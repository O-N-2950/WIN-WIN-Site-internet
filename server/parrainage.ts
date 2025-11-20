/**
 * Module de gestion du parrainage famille WIN WIN
 * 
 * Fonctionnalités :
 * - Génération de codes parrainage uniques par client
 * - Validation des codes parrainage
 * - Gestion des familles (ajout/retrait membres)
 * - Calcul automatique des rabais (2% par membre, max 20%)
 * - Mise à jour des prix Stripe
 */

interface ParrainageConfig {
  baseId: string;
  tableId: string;
  apiKey: string;
}

interface ClientData {
  recordId?: string;
  nom: string;
  prenom?: string;
  email: string;
  typeClient: 'Particulier' | 'Entreprise';
  codeParrainage?: string;
  idFamille?: string;
  lienParente?: string;
  parrainePar?: string;
}

interface FamilleInfo {
  idFamille: string;
  nomFamille: string;
  nombreMembres: number;
  rabais: number; // en pourcentage (0-20)
  prixMandat: number; // prix ajusté selon rabais
  membres: ClientData[];
}

const AIRTABLE_CONFIG: ParrainageConfig = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tableId: 'tblClients', // TODO: Vérifier l'ID exact de la table Clients
  apiKey: process.env.AIRTABLE_API_KEY || '',
};

const PRIX_BASE_MANDAT = 185; // CHF
const RABAIS_PAR_MEMBRE = 2; // %
const RABAIS_MAX = 20; // %
const AIRTABLE_TIMEOUT = 10000;

/**
 * Générer un code parrainage unique pour un client
 * Format : PRENOM-XXXX (ex: JEAN-A3X9)
 */
export function generateCodeParrainage(prenom: string): string {
  const prenomClean = prenom.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 10);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prenomClean}-${random}`;
}

/**
 * Générer un ID famille unique
 * Format : FAM-NOM-YYYY (ex: FAM-DUPONT-2025)
 */
export function generateIdFamille(nom: string): string {
  const nomClean = nom.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 15);
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `FAM-${nomClean}-${year}-${random}`;
}

/**
 * Calculer le rabais famille selon le nombre de membres
 * Règle : 2% par membre, maximum 20%
 */
export function calculateRabaisFamille(nombreMembres: number): number {
  const rabais = nombreMembres * RABAIS_PAR_MEMBRE;
  return Math.min(rabais, RABAIS_MAX);
}

/**
 * Calculer le prix du mandat ajusté selon le rabais
 */
export function calculatePrixMandat(nombreMembres: number): number {
  const rabais = calculateRabaisFamille(nombreMembres);
  const prixAjuste = PRIX_BASE_MANDAT * (1 - rabais / 100);
  return Math.round(prixAjuste * 100) / 100; // Arrondir à 2 décimales
}

/**
 * Valider un code parrainage et récupérer les infos du parrain
 */
export async function validateCodeParrainage(code: string): Promise<ClientData | null> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    // Rechercher le client avec ce code parrainage
    const filterFormula = `{Code Parrainage} = '${code}'`;
    const response = await fetch(`${url}?filterByFormula=${encodeURIComponent(filterFormula)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Parrainage] Erreur validation code:', await response.text());
      return null;
    }

    const result = await response.json();
    
    if (result.records.length === 0) {
      console.log('[Parrainage] Code non trouvé:', code);
      return null;
    }

    const record = result.records[0];
    const fields = record.fields;

    return {
      recordId: record.id,
      nom: fields['NOM du client'] || fields['Nom'] || '',
      prenom: fields['Prénom'] || '',
      email: fields['Email'] || '',
      typeClient: fields['Type Client'] || 'Particulier',
      codeParrainage: fields['Code Parrainage'] || '',
      idFamille: fields['ID Famille'] || '',
      lienParente: fields['Lien de Parenté'] || '',
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Parrainage] Timeout validation code');
    } else {
      console.error('[Parrainage] Erreur:', error);
    }
    return null;
  }
}

/**
 * Récupérer tous les membres d'une famille
 */
export async function getFamilleMembers(idFamille: string): Promise<ClientData[]> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const filterFormula = `{ID Famille} = '${idFamille}'`;
    const response = await fetch(`${url}?filterByFormula=${encodeURIComponent(filterFormula)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Parrainage] Erreur récupération famille:', await response.text());
      return [];
    }

    const result = await response.json();
    
    return result.records.map((record: any) => ({
      recordId: record.id,
      nom: record.fields['NOM du client'] || record.fields['Nom'] || '',
      prenom: record.fields['Prénom'] || '',
      email: record.fields['Email'] || '',
      typeClient: record.fields['Type Client'] || 'Particulier',
      codeParrainage: record.fields['Code Parrainage'] || '',
      idFamille: record.fields['ID Famille'] || '',
      lienParente: record.fields['Lien de Parenté'] || '',
    }));
  } catch (error: any) {
    console.error('[Parrainage] Erreur récupération famille:', error);
    return [];
  }
}

/**
 * Recalculer et mettre à jour le rabais pour tous les membres d'une famille
 */
export async function recalculateFamilyDiscount(idFamille: string): Promise<void> {
  console.log(`[Parrainage] Recalcul rabais pour famille ${idFamille}`);
  
  // Récupérer tous les membres
  const membres = await getFamilleMembers(idFamille);
  const nombreMembres = membres.length;
  
  if (nombreMembres === 0) {
    console.log('[Parrainage] Aucun membre trouvé');
    return;
  }

  const rabais = calculateRabaisFamille(nombreMembres);
  const prixMandat = calculatePrixMandat(nombreMembres);

  console.log(`[Parrainage] ${nombreMembres} membres → ${rabais}% rabais → ${prixMandat} CHF/mandat`);

  // Mettre à jour chaque membre
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}`;
  
  for (const membre of membres) {
    if (!membre.recordId) continue;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
      
      const response = await fetch(`${url}/${membre.recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Nombre Membres Famille': nombreMembres,
            '% Rabais Famille': rabais,
            'Prix Mandat Ajusté': prixMandat,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[Parrainage] Erreur mise à jour membre ${membre.email}:`, await response.text());
      } else {
        console.log(`[Parrainage] Membre ${membre.email} mis à jour`);
      }
    } catch (error) {
      console.error(`[Parrainage] Erreur mise à jour membre ${membre.email}:`, error);
    }
  }

  console.log(`[Parrainage] Recalcul terminé pour famille ${idFamille}`);
}

/**
 * Ajouter un nouveau client à une famille existante
 */
export async function addClientToFamily(
  clientRecordId: string,
  codeParrainage: string,
  lienParente: string
): Promise<boolean> {
  console.log(`[Parrainage] Ajout client ${clientRecordId} via code ${codeParrainage}`);
  
  // Valider le code parrainage
  const parrain = await validateCodeParrainage(codeParrainage);
  
  if (!parrain || !parrain.idFamille) {
    console.error('[Parrainage] Code invalide ou parrain sans famille');
    return false;
  }

  // Mettre à jour le nouveau client
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}/${clientRecordId}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'ID Famille': parrain.idFamille,
          'Lien de Parenté': lienParente,
          'Parrainé par': parrain.recordId,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Parrainage] Erreur ajout à la famille:', await response.text());
      return false;
    }

    console.log(`[Parrainage] Client ajouté à la famille ${parrain.idFamille}`);
    
    // Recalculer le rabais pour toute la famille
    await recalculateFamilyDiscount(parrain.idFamille);
    
    return true;
  } catch (error) {
    console.error('[Parrainage] Erreur ajout à la famille:', error);
    return false;
  }
}

/**
 * Créer une nouvelle famille pour un client (premier de la famille)
 */
export async function createNewFamily(clientRecordId: string, nom: string, prenom: string): Promise<string> {
  const idFamille = generateIdFamille(nom);
  const codeParrainage = generateCodeParrainage(prenom || nom);
  
  console.log(`[Parrainage] Création nouvelle famille ${idFamille} pour ${prenom} ${nom}`);
  
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}/${clientRecordId}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'ID Famille': idFamille,
          'Code Parrainage': codeParrainage,
          'Nombre Membres Famille': 1,
          '% Rabais Famille': 2, // 1 membre = 2%
          'Prix Mandat Ajusté': calculatePrixMandat(1),
          'Lien de Parenté': 'Fondateur',
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Parrainage] Erreur création famille:', await response.text());
      throw new Error('Erreur création famille');
    }

    console.log(`[Parrainage] Famille créée: ${idFamille}, code: ${codeParrainage}`);
    
    return codeParrainage;
  } catch (error) {
    console.error('[Parrainage] Erreur création famille:', error);
    throw error;
  }
}
