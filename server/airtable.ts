/**
 * Module d'intégration Airtable pour WIN WIN Finance Group
 * Utilise le MCP Airtable pour créer et gérer les clients
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { AIRTABLE_CONFIG } from './airtable-config';

const execAsync = promisify(exec);

export interface CreateClientInput {
  nom: string;
  prenom: string;
  email: string;
  telMobile?: string;
  adresse?: string;
  npa?: string;
  localite?: string;
  typeClient: 'Particulier' | 'Entreprise';
  dateNaissance?: string;
  age?: number;
  nbEmployes?: number;
  tarifApplicable: number;
  mandatOffert: boolean;
  dateSignatureMandat?: string;
  signatureUrl?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
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
  fields[clients.fields.nomClient] = `${input.prenom} ${input.nom}`;
  fields[clients.fields.nom] = input.nom;
  fields[clients.fields.prenom] = input.prenom;
  fields[clients.fields.email] = input.email;
  fields[clients.fields.typeClient] = input.typeClient;
  fields[clients.fields.tarifApplicable] = input.tarifApplicable;
  fields[clients.fields.mandatOffert] = input.mandatOffert;
  fields[clients.fields.statutClient] = 'Client sous gestion';
  
  // Champs optionnels
  if (input.telMobile) fields[clients.fields.telMobile] = input.telMobile;
  if (input.adresse) fields[clients.fields.adresse] = input.adresse;
  if (input.npa) fields[clients.fields.npa] = input.npa;
  if (input.localite) fields[clients.fields.localite] = input.localite;
  if (input.dateNaissance) fields[clients.fields.dateNaissance] = input.dateNaissance;
  if (input.age) fields[clients.fields.age] = input.age;
  if (input.nbEmployes !== undefined) fields[clients.fields.nbEmployes] = input.nbEmployes;
  if (input.dateSignatureMandat) fields[clients.fields.dateSignatureMandat] = input.dateSignatureMandat;
  
  // Signature (format Airtable Attachment)
  if (input.signatureUrl) {
    fields[clients.fields.signatureClient] = [
      {
        url: input.signatureUrl,
      }
    ];
  }
  
  // Appeler MCP Airtable pour créer le record
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    fields,
  });
  
  try {
    const { stdout } = await execAsync(
      `manus-mcp-cli tool call create_record --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`
    );
    
    // Parser la réponse MCP
    const response = JSON.parse(stdout);
    
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
 * Rechercher un client par email
 */
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
