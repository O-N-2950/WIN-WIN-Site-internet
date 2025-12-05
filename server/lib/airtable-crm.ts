/**
 * Airtable CRM Integration - API REST Native
 * 
 * Remplace l'intégration MCP qui ne fonctionne pas sur Railway
 */

const AIRTABLE_CONFIG = {
  apiKey: process.env.AIRTABLE_API_KEY!,
  baseId: 'appZQkRJ7PwOtdQ3O', // ERP Clients WW
  tableId: 'tblWPcIpGmBZ3ASGI' // Table Clients
};

export interface ClientData {
  nom: string;
  prenom?: string;
  email: string;
  telMobile: string;
  adresse: string;
  npa: string;
  localite: string;
  typeClient: 'prive' | 'entreprise';
  dateNaissance?: string;
  nombreEmployes?: number;
  dateSignature: string;
  pdfUrl?: string;
}

/**
 * Créer un nouveau client dans Airtable
 */
export async function createClientInAirtable(clientData: ClientData): Promise<string> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}`;
  
  const fields: Record<string, any> = {
    'Nom': clientData.nom,
    'Prénom': clientData.prenom || '',
    'Type de client': clientData.typeClient === 'prive' ? 'Particulier' : 'Entreprise',
    'Email du client (table client)': clientData.email,
    'Tél. Mobile': clientData.telMobile,
    'Adresse et no': clientData.adresse,
    'NPA': parseInt(clientData.npa),
    'Localité': clientData.localite,
    'Statut du client': 'Prospect',
    'Date signature mandat': clientData.dateSignature,
    'Language': 'Français'
  };
  
  // Ajouter date naissance si particulier
  if (clientData.dateNaissance) {
    fields['Date de naissance'] = clientData.dateNaissance;
  }
  
  // Ajouter nombre d'employés si entreprise
  if (clientData.nombreEmployes !== undefined) {
    fields['Nombre d\'employés'] = clientData.nombreEmployes;
  }
  
  // Ajouter PDF mandat si disponible
  if (clientData.pdfUrl) {
    fields['Mandat signé'] = [{
      url: clientData.pdfUrl
    }];
  }
  
  // Générer code parrainage
  const codeParrainage = generateCodeParrainage(clientData.nom);
  fields['Code Parrainage'] = codeParrainage;
  
  console.log('[Airtable] Creating client:', clientData.email);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Airtable] Error creating client:', errorText);
    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  console.log('[Airtable] Client created successfully:', result.id);
  
  return result.id; // rec123456
}

/**
 * Mettre à jour un client existant dans Airtable
 */
export async function updateClientInAirtable(
  recordId: string,
  updates: Partial<Record<string, any>>
): Promise<void> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}/${recordId}`;
  
  console.log('[Airtable] Updating client:', recordId);
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fields: updates })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Airtable] Error updating client:', errorText);
    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
  }
  
  console.log('[Airtable] Client updated successfully');
}

/**
 * Rechercher un client par email
 */
export async function findClientByEmail(email: string): Promise<string | null> {
  const formula = `{Email du client (table client)}="${email}"`;
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`;
  
  console.log('[Airtable] Searching client by email:', email);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`
    }
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Airtable] Error searching client:', errorText);
    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  
  if (result.records && result.records.length > 0) {
    console.log('[Airtable] Client found:', result.records[0].id);
    return result.records[0].id;
  }
  
  console.log('[Airtable] Client not found');
  return null;
}

/**
 * Générer un code de parrainage unique
 */
function generateCodeParrainage(nom: string): string {
  const prefix = nom.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'X');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${random}`;
}
