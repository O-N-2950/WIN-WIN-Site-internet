/**
 * Module Airtable - Helpers pour interagir avec Airtable via MCP
 * 
 * Ce module fournit des fonctions pour créer et mettre à jour des clients et contrats
 * dans Airtable en utilisant le serveur MCP Airtable.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration Airtable
const AIRTABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O', // ERP Clients WW
  tables: {
    clients: 'tblWPcIpGmBZ3ASGI',
    contrats: 'tblDOIQM3zt7QkZd4',
    compagnies: 'tblwnkQFK63KKjFEY',
  },
};

/**
 * Interface pour les données client
 */
export interface ClientData {
  // Champs obligatoires
  Prénom: string;
  Nom: string;
  'Type de client': 'Privé' | 'Entreprise';
  'Date de naissance'?: string; // Format: YYYY-MM-DD
  'Email du client (table client)': string;
  'Tél. Mobile': string;
  
  // Adresse
  'Adresse et no': string;
  NPA: number;
  Localité: string;
  Canton?: string;
  
  // Statut et configuration
  'Statut du client': 'Prospect' | 'En attente' | 'Actif' | 'Inactif' | 'Mandat résilié' | 'Mandat offert';
  'Formule d\'appel'?: 'Monsieur' | 'Madame' | 'Autre';
  'Situation familiale'?: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf/Veuve' | 'Concubin(e)' | 'Partenariat enregistré';
  'Statut professionnel'?: 'Employé(e)' | 'Indépendant(e)' | 'Retraité(e)' | 'Sans Emploi' | 'Au chômage' | 'Ai' | 'Etudiant(e)' | 'Enfant';
  Profession?: string;
  Employeur?: string;
  'Taux d\'activité'?: string;
  Nationalité?: string;
  'Permis d\'Etablissement'?: string;
  Banque?: string;
  IBAN?: string;
  'Fumeur(se)'?: 'oui' | 'non';
  
  // Champs optionnels
  'Nombre d\'employés'?: number;
  AVS?: string;
  Language?: 'Français' | 'Anglais' | 'Allemand' | 'Italien' | 'Espagnol' | 'Autre';
  'Nom de la banque'?: string;
  
  // Champs Stripe (ajoutés après paiement)
  'Stripe Customer ID'?: string;
  'Stripe Subscription ID'?: string;
  'Date signature mandat'?: string; // Format: YYYY-MM-DD
}

/**
 * Interface pour les données de contrat
 */
export interface ContractData {
  // Relations client (tous remplis avec le même client_record_id)
  'lien table client depuis contrats': string[]; // [clientRecordId]
  Clients: string[];
  'Clients 2': string[];
  'Nom du clients': string[];
  'Clients 3': string[];
  
  // Champs obligatoires
  'Numéro du contrat': string;
  'types de contrats': string[]; // IDs des types de contrats
  'Montant de la prime fractionnée ou annuelle CHF': number;
  'Mode de paiement': 'Annuel' | 'Semestriel' | 'Trimestriel' | 'Mensuel';
  'Date début du contrat': string; // Format: YYYY-MM-DD
  'Date fin du contrat': string; // Format: YYYY-MM-DD
  
  // Champs optionnels
  Compagnie?: string[]; // [compagnieRecordId]
  'Objet de l\'assurance (adresse, personne, véhicule etc )'?: string;
  'Statut du contrat'?: 'Actif' | 'En attente du contrat' | 'Résilié' | 'Libéré des primes' | 'Racheté' | 'Mandat Résilié' | 'Résilié pour échéance' | 'OFFRE' | 'Confirmation de résiliation en attente';
  'Contrat PDF'?: Array<{ url: string }>;
}

/**
 * Exécute une commande MCP Airtable
 */
async function executeMCP(toolName: string, input: Record<string, any>): Promise<any> {
  const inputJson = JSON.stringify(input).replace(/"/g, '\\"');
  const command = `manus-mcp-cli tool call ${toolName} --server airtable --input "${inputJson}"`;
  
  try {
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr && !stderr.includes('Tool execution result')) {
      console.error('[Airtable MCP] Error:', stderr);
    }
    
    // Parser la sortie JSON
    const result = JSON.parse(stdout);
    return result;
  } catch (error: any) {
    console.error('[Airtable MCP] Command failed:', error.message);
    throw new Error(`Airtable MCP error: ${error.message}`);
  }
}

/**
 * Crée un client dans Airtable
 * @param clientData Données du client
 * @returns Record ID du client créé
 */
export async function createAirtableClient(clientData: ClientData): Promise<string> {
  console.log('[Airtable] Creating client:', clientData.Prénom, clientData.Nom);
  
  try {
    const result = await executeMCP('create_record', {
      baseId: AIRTABLE_CONFIG.baseId,
      tableId: AIRTABLE_CONFIG.tables.clients,
      fields: clientData,
    });
    
    const recordId = result.id;
    console.log('[Airtable] Client created successfully:', recordId);
    return recordId;
  } catch (error: any) {
    console.error('[Airtable] Failed to create client:', error.message);
    throw error;
  }
}

/**
 * Met à jour un client dans Airtable
 * @param recordId Record ID du client
 * @param updates Champs à mettre à jour
 */
export async function updateAirtableClient(
  recordId: string,
  updates: Partial<ClientData>
): Promise<void> {
  console.log('[Airtable] Updating client:', recordId, updates);
  
  try {
    await executeMCP('update_record', {
      baseId: AIRTABLE_CONFIG.baseId,
      tableId: AIRTABLE_CONFIG.tables.clients,
      recordId,
      fields: updates,
    });
    
    console.log('[Airtable] Client updated successfully');
  } catch (error: any) {
    console.error('[Airtable] Failed to update client:', error.message);
    throw error;
  }
}

/**
 * Crée un contrat dans Airtable
 * @param contractData Données du contrat
 * @returns Record ID du contrat créé
 */
export async function createAirtableContract(contractData: ContractData): Promise<string> {
  console.log('[Airtable] Creating contract:', contractData['Numéro du contrat']);
  
  try {
    const result = await executeMCP('create_record', {
      baseId: AIRTABLE_CONFIG.baseId,
      tableId: AIRTABLE_CONFIG.tables.contrats,
      fields: contractData,
    });
    
    const recordId = result.id;
    console.log('[Airtable] Contract created successfully:', recordId);
    return recordId;
  } catch (error: any) {
    console.error('[Airtable] Failed to create contract:', error.message);
    throw error;
  }
}

/**
 * Crée plusieurs contrats pour un client
 * @param clientRecordId Record ID du client
 * @param contracts Liste des contrats à créer
 * @returns Liste des Record IDs des contrats créés
 */
export async function createMultipleContracts(
  clientRecordId: string,
  contracts: Omit<ContractData, 'lien table client depuis contrats' | 'Clients' | 'Clients 2' | 'Nom du clients' | 'Clients 3'>[]
): Promise<string[]> {
  console.log(`[Airtable] Creating ${contracts.length} contracts for client ${clientRecordId}`);
  
  const contractIds: string[] = [];
  
  for (const contract of contracts) {
    // Remplir automatiquement les 5 champs de relation client
    const fullContractData: ContractData = {
      ...contract,
      'lien table client depuis contrats': [clientRecordId],
      'Clients': [clientRecordId],
      'Clients 2': [clientRecordId],
      'Nom du clients': [clientRecordId],
      'Clients 3': [clientRecordId],
    };
    
    const contractId = await createAirtableContract(fullContractData);
    contractIds.push(contractId);
  }
  
  console.log(`[Airtable] Created ${contractIds.length} contracts successfully`);
  return contractIds;
}

/**
 * Récupère un client par son Record ID
 * @param recordId Record ID du client
 * @returns Données du client
 */
export async function getAirtableClient(recordId: string): Promise<any> {
  console.log('[Airtable] Getting client:', recordId);
  
  try {
    const result = await executeMCP('get_record', {
      baseId: AIRTABLE_CONFIG.baseId,
      tableId: AIRTABLE_CONFIG.tables.clients,
      recordId,
    });
    
    return result;
  } catch (error: any) {
    console.error('[Airtable] Failed to get client:', error.message);
    throw error;
  }
}

/**
 * Recherche un client par email
 * @param email Email du client
 * @returns Record ID du client ou null si non trouvé
 */
export async function findClientByEmail(email: string): Promise<string | null> {
  console.log('[Airtable] Searching client by email:', email);
  
  try {
    const result = await executeMCP('list_records', {
      baseId: AIRTABLE_CONFIG.baseId,
      tableId: AIRTABLE_CONFIG.tables.clients,
      maxRecords: 1,
      filterByFormula: `{Email du client (table client)}="${email}"`,
    });
    
    if (result && result.length > 0) {
      return result[0].id;
    }
    
    return null;
  } catch (error: any) {
    console.error('[Airtable] Failed to search client:', error.message);
    return null;
  }
}
