/**
 * Module d'intégration Airtable pour WIN WIN Finance Group
 * Utilise le MCP Airtable pour créer et gérer les clients
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { AIRTABLE_CONFIG } from './airtable-config';
import { storageGetBuffer } from './storage';

const execAsync = promisify(exec);

export interface CreateClientInput {
  nom: string;
  prenom: string;
  email: string;
  telMobile?: string;
  adresse?: string;
  npa?: string;
  localite?: string;
  typeClient: 'Privé' | 'Entreprise';
  dateNaissance?: string;
  age?: number;
  nbEmployes?: number;
  tarifApplicable: number;
  mandatOffert: boolean;
  dateSignatureMandat?: string;
  signatureUrl?: string;
  signatureDataUrl?: string; // Base64 data URL (data:image/png;base64,...)
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  // Champs parrainage et famille
  relationsFamiliales?: string; // Membre fondateur, Épouse, Fils, etc.
  groupeFamilial?: string; // FAMILLE-NOM-2024
  codeParrainage?: string; // DUPO-1234
  codeParrainageUtilise?: string; // Code du parrain (si rejoint un groupe)
}

export interface AirtableClientRecord {
  id: string;
  fields: Record<string, any>;
}

/**
 * Créer un client dans Airtable via MCP
 */
export async function createClientInAirtable(input: CreateClientInput): Promise<AirtableClientRecord> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  // Préparer les champs pour Airtable
  const fields: Record<string, any> = {};
  
  // Champs obligatoires
  // Note: nomClient ("NOM du client") est un champ calculé dans Airtable, ne pas l'envoyer
  fields[clients.fields.nom] = input.nom;
  fields[clients.fields.prenom] = input.prenom;
  if (input.nomEntreprise) fields[clients.fields.nomEntreprise] = input.nomEntreprise;
  fields[clients.fields.email] = input.email;
  fields[clients.fields.typeClient] = input.typeClient;
  // Note: tarifApplicable est un champ calculé dans Airtable, ne pas l'envoyer
  fields[clients.fields.mandatOffert] = input.mandatOffert;
  fields[clients.fields.statutClient] = 'NOUVEAU CLIENT';
  
  // Champs optionnels
  if (input.telMobile) fields[clients.fields.telMobile] = input.telMobile;
  if (input.adresse) fields[clients.fields.adresse] = input.adresse;
  if (input.npa) fields[clients.fields.npa] = parseInt(input.npa, 10); // NPA est un champ number dans Airtable
  if (input.localite) fields[clients.fields.localite] = input.localite;
  if (input.dateNaissance) fields[clients.fields.dateNaissance] = input.dateNaissance;
  // Note: age est un champ calculé dans Airtable, ne pas l'envoyer
  if (input.nbEmployes !== undefined) fields[clients.fields.nbEmployes] = input.nbEmployes;
  if (input.dateSignatureMandat) fields[clients.fields.dateSignatureMandat] = input.dateSignatureMandat;
  
  // Note: La signature sera uploadée après la création du record via uploadSignatureToAirtable()
  
  // Champs parrainage et famille
  if (input.relationsFamiliales) {
    // Relations familiales est un champ multipleSelects, il faut un tableau
    fields[clients.fields.relationsFamiliales] = Array.isArray(input.relationsFamiliales) 
      ? input.relationsFamiliales 
      : [input.relationsFamiliales];
  }
  if (input.lieAFamille) {
    // Lié à (famille) est un champ multipleRecordLinks, il faut un tableau d'IDs
    fields[clients.fields.lieAFamille] = Array.isArray(input.lieAFamille)
      ? input.lieAFamille
      : [input.lieAFamille];
  }
  if (input.groupeFamilial) fields[clients.fields.groupeFamilial] = input.groupeFamilial;
  if (input.codeParrainage) fields[clients.fields.codeParrainage] = input.codeParrainage;
  
  // Appeler MCP Airtable pour créer le record
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    fields,
  });
  
  try {
    const { stdout, stderr } = await execAsync(
      `manus-mcp-cli tool call create_record --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`
    );
    
    console.log('[Airtable] Sortie MCP (stdout):', stdout.substring(0, 500));
    if (stderr) {
      console.log('[Airtable] Sortie MCP (stderr):', stderr.substring(0, 500));
    }
    
    // Extraire le JSON de la sortie MCP (ignorer le préfixe "Tool execution result:")
    const jsonMatch = stdout.match(/Tool execution result:\s*([\s\S]+)/);
    if (!jsonMatch) {
      console.error('[Airtable] Impossible d\'extraire le JSON. Sortie complète:', stdout);
      throw new Error('Impossible d\'extraire le JSON de la réponse MCP');
    }
    
    const jsonString = jsonMatch[1].trim();
    
    // Vérifier si c'est une erreur
    if (jsonString.startsWith('Error:')) {
      console.error('[Airtable] Erreur MCP:', jsonString);
      throw new Error(`Erreur MCP Airtable: ${jsonString}`);
    }
    
    const response = JSON.parse(jsonString);
    
    return {
      id: response.id,
      fields: response.fields,
    };
  } catch (error) {
    console.error('[Airtable] Erreur lors de la création du client:', error);
    throw new Error('Impossible de créer le client dans Airtable');
  }
}

/**
 * Uploader une signature vers un record Airtable existant
 * Utilise l'endpoint officiel Airtable pour upload direct via base64
 */
export async function uploadSignatureToAirtable(
  recordId: string,
  signatureDataUrl: string
): Promise<void> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  
  if (!AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY non configurée');
  }
  
  try {
    // Extraire le base64 depuis le data URL
    // Format: data:image/png;base64,iVBORw0KGgo...
    const base64Match = signatureDataUrl.match(/^data:image\/png;base64,(.+)$/);
    if (!base64Match) {
      throw new Error('Format de signatureDataUrl invalide');
    }
    
    const base64Data = base64Match[1];
    
    // Endpoint officiel Airtable pour upload d'attachments
    const uploadUrl = `https://content.airtable.com/v0/${baseId}/${recordId}/${clients.fields.signatureClient}/uploadAttachment`;
    
    console.log('[Airtable] Upload signature vers:', uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType: 'image/png',
        file: base64Data,
        filename: 'signature.png',
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Airtable] Erreur upload signature:', response.status, errorText);
      throw new Error(`Erreur upload signature: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('[Airtable] Signature uploadée avec succès:', result);
  } catch (error) {
    console.error('[Airtable] Erreur lors de l\'upload de la signature:', error);
    throw error;
  }
}

/**
 * Uploader un PDF vers un record Airtable existant
 * Utilise l'endpoint officiel Airtable pour upload direct via base64
 */
export async function uploadPdfToAirtable(
  recordId: string,
  pdfBuffer: Buffer,
  filename: string
): Promise<void> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  
  if (!AIRTABLE_API_KEY) {
    throw new Error('AIRTABLE_API_KEY non configurée');
  }
  
  try {
    // Convertir le Buffer en base64
    const base64Data = pdfBuffer.toString('base64');
    
    // Endpoint officiel Airtable pour upload d'attachments
    const uploadUrl = `https://content.airtable.com/v0/${baseId}/${recordId}/${clients.fields.mandatSigne}/uploadAttachment`;
    
    console.log('[Airtable] Upload PDF mandat vers:', uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contentType: 'application/pdf',
        file: base64Data,
        filename,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Airtable] Erreur upload PDF:', response.status, errorText);
      throw new Error(`Erreur upload PDF: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log('[Airtable] PDF uploadé avec succès:', result);
  } catch (error) {
    console.error('[Airtable] Erreur lors de l\'upload du PDF:', error);
    throw error;
  }
}

/**
 * Rechercher un client par email
 */
/**
 * Récupérer un client par son ID
 */
export async function getClientById(recordId: string): Promise<Record<string, any> | null> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    recordId,
  });
  
  try {
    const { stdout } = await execAsync(
      `manus-mcp-cli tool call get_record --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`
    );
    
    const response = JSON.parse(stdout);
    
    if (response && response.fields) {
      return response.fields;
    }
    
    return null;
  } catch (error) {
    console.error('[Airtable] Erreur lors de la récupération du client:', error);
    return null;
  }
}

export async function findClientByEmail(email: string): Promise<AirtableClientRecord | null> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    filterByFormula: `{${clients.fields.email}} = '${email}'`,
    maxRecords: 1,
  });
  
  try {
    const { stdout } = await execAsync(
      `manus-mcp-cli tool call list_records --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`
    );
    
    const response = JSON.parse(stdout);
    
    if (response.records && response.records.length > 0) {
      return response.records[0];
    }
    
    return null;
  } catch (error) {
    console.error('[Airtable] Erreur lors de la recherche du client:', error);
    return null;
  }
}

/**
 * Mettre à jour un client existant
 */
export async function updateClientInAirtable(
  recordId: string,
  fields: Record<string, any>
): Promise<AirtableClientRecord> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    records: [
      {
        id: recordId,
        fields,
      },
    ],
  });
  
  try {
    const { stdout } = await execAsync(
      `manus-mcp-cli tool call update_records --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`
    );
    
    const response = JSON.parse(stdout);
    
    return response.records[0];
  } catch (error) {
    console.error('[Airtable] Erreur lors de la mise à jour du client:', error);
    throw new Error('Impossible de mettre à jour le client dans Airtable');
  }
}
