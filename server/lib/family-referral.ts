/**
 * Gestion du système de parrainage et groupes familiaux
 * 
 * Fonctionnalités :
 * - Création automatique de groupe familial pour nouveau client
 * - Attribution rôle "Membre fondateur"
 * - Génération code parrainage unique
 * - Rejoindre un groupe existant via code parrainage
 */

import { CreateClientInput } from '../airtable';
import { generateReferralCode, generateFamilyGroupId } from './referral-code';
import { getFamilyMembers } from './parrainage';

export interface ReferralSetupResult {
  relationsFamiliales: string;
  groupeFamilial: string;
  codeParrainage: string;
}

/**
 * Configurer le parrainage pour un nouveau client
 * 
 * @param nom - Nom du client
 * @param codeParrainageUtilise - Code de parrainage utilisé (optionnel)
 * @param lienParente - Lien de parenté si rejoint un groupe (optionnel)
 * @returns Configuration parrainage (rôle, groupe, code)
 */
export async function setupReferralForNewClient(
  nom: string,
  codeParrainageUtilise?: string,
  lienParente?: string
): Promise<ReferralSetupResult> {
  
  // Générer le code parrainage du nouveau client
  const codeParrainage = generateReferralCode(nom);
  
  // CAS 1 : Client SANS code parrainage → Créer nouveau groupe
  if (!codeParrainageUtilise) {
    const groupeFamilial = generateFamilyGroupId(nom, codeParrainage);
    
    return {
      relationsFamiliales: 'Membre fondateur',
      groupeFamilial,
      codeParrainage,
    };
  }
  
  // CAS 2 : Client AVEC code parrainage → Rejoindre groupe existant
  try {
    // Récupérer le groupe familial du parrain via MCP Airtable
    const parrainGroupeFamilial = await getGroupeFamilialByCode(codeParrainageUtilise);
    
    if (!parrainGroupeFamilial) {
      console.warn(`[Referral] Code parrainage invalide: ${codeParrainageUtilise}`);
      // Fallback : créer nouveau groupe
      const groupeFamilial = generateFamilyGroupId(nom, codeParrainage);
      return {
        relationsFamiliales: 'Membre fondateur',
        groupeFamilial,
        codeParrainage,
      };
    }
    
    return {
      relationsFamiliales: lienParente || 'autre',
      groupeFamilial: parrainGroupeFamilial,
      codeParrainage,
    };
    
  } catch (error) {
    console.error('[Referral] Erreur lors de la recherche du parrain:', error);
    // Fallback : créer nouveau groupe
    const groupeFamilial = generateFamilyGroupId(nom, codeParrainage);
    return {
      relationsFamiliales: 'Membre fondateur',
      groupeFamilial,
      codeParrainage,
    };
  }
}

/**
 * Récupérer le groupe familial d'un client via son code parrainage
 * 
 * @param codeParrainage - Code parrainage du parrain
 * @returns Identifiant du groupe familial ou null
 */
async function getGroupeFamilialByCode(codeParrainage: string): Promise<string | null> {
  const { execAsync } = await import('util').then(m => ({ execAsync: require('util').promisify(require('child_process').exec) }));
  const { AIRTABLE_CONFIG } = await import('../airtable-config');
  
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    filterByFormula: `{Code Parrainage} = '${codeParrainage}'`,
    maxRecords: 1,
  });
  
  try {
    const { stdout } = await execAsync(
      `manus-mcp-cli tool call search_records --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`
    );
    
    const response = JSON.parse(stdout);
    
    if (response.records && response.records.length > 0) {
      const parrain = response.records[0];
      return parrain.fields['Groupe Familial'] || null;
    }
    
    return null;
  } catch (error) {
    console.error('[Referral] Erreur recherche parrain:', error);
    return null;
  }
}

/**
 * Enrichir les données client avec le système de parrainage
 * 
 * @param clientData - Données client de base
 * @param codeParrainageUtilise - Code parrainage utilisé (optionnel)
 * @param lienParente - Lien de parenté (optionnel)
 * @returns Données client enrichies avec parrainage
 */
export async function enrichClientWithReferral(
  clientData: CreateClientInput,
  codeParrainageUtilise?: string,
  lienParente?: string
): Promise<CreateClientInput> {
  
  const referralSetup = await setupReferralForNewClient(
    clientData.nom,
    codeParrainageUtilise,
    lienParente
  );
  
  return {
    ...clientData,
    relationsFamiliales: referralSetup.relationsFamiliales,
    groupeFamilial: referralSetup.groupeFamilial,
    codeParrainage: referralSetup.codeParrainage,
    codeParrainageUtilise,
  };
}
