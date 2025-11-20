/**
 * Module de gestion du parrainage familial pour WIN WIN Finance Group
 * 
 * Fonctionnalités :
 * - Validation des codes de parrainage
 * - Calcul des rabais familiaux (2% par membre, max 20%)
 * - Récupération des membres de la famille
 * - Génération de descriptions pour factures Stripe
 */

/**
 * Configuration Airtable pour la table Clients
 */
const AIRTABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tableId: 'tblTODO_CLIENTS', // TODO: Remplacer par le vrai ID de la table "Clients"
  apiKey: process.env.AIRTABLE_API_KEY || '',
};

/**
 * Interface pour un membre de famille
 */
export interface FamilyMember {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  codeParrainage: string;
  lienParente?: string;
}

/**
 * Valider un code de parrainage
 * 
 * @param code - Code de parrainage à valider (format: NOM-XXXX)
 * @returns Les informations du parrain si le code est valide, null sinon
 */
export async function validateReferralCode(code: string): Promise<FamilyMember | null> {
  if (!code || code.trim() === '') {
    return null;
  }

  // Normaliser le code (uppercase, trim)
  const normalizedCode = code.trim().toUpperCase();

  // Vérifier le format (4 lettres - 4 caractères)
  const codePattern = /^[A-Z]{4}-[A-Z0-9]{4}$/;
  if (!codePattern.test(normalizedCode)) {
    console.log(`[Parrainage] Code invalide (format incorrect): ${normalizedCode}`);
    return null;
  }

  try {
    // Rechercher le client dans Airtable par code de parrainage
    const filterFormula = `{Code Parrainage}='${normalizedCode}'`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('[Parrainage] Erreur recherche code:', await response.text());
      return null;
    }

    const result = await response.json();

    if (result.records.length === 0) {
      console.log(`[Parrainage] Code non trouvé: ${normalizedCode}`);
      return null;
    }

    const record = result.records[0];
    const fields = record.fields;

    return {
      id: record.id,
      nom: fields['NOM du client'] as string,
      prenom: fields['Prénom'] as string | undefined,
      email: fields['Email'] as string,
      codeParrainage: normalizedCode,
      lienParente: fields['Lien de Parenté'] as string | undefined,
    };
  } catch (error) {
    console.error('[Parrainage] Erreur validation code:', error);
    return null;
  }
}

/**
 * Récupérer tous les membres de la famille d'un client
 * 
 * @param groupeFamilial - Identifiant du groupe familial
 * @returns Liste des membres de la famille
 */
export async function getFamilyMembers(groupeFamilial: string): Promise<FamilyMember[]> {
  if (!groupeFamilial || groupeFamilial.trim() === '') {
    return [];
  }

  try {
    // Rechercher tous les clients du même groupe familial
    const filterFormula = `{Groupe Familial}='${groupeFamilial.replace(/'/g, "\\'")}'`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('[Parrainage] Erreur recherche famille:', await response.text());
      return [];
    }

    const result = await response.json();

    return result.records.map((record: any) => ({
      id: record.id,
      nom: record.fields['NOM du client'] as string,
      prenom: record.fields['Prénom'] as string | undefined,
      email: record.fields['Email'] as string,
      codeParrainage: record.fields['Code Parrainage'] as string,
      lienParente: record.fields['Lien de Parenté'] as string | undefined,
    }));
  } catch (error) {
    console.error('[Parrainage] Erreur récupération famille:', error);
    return [];
  }
}

/**
 * Calculer le rabais familial
 * 
 * @param familyMembersCount - Nombre de membres de la famille (incluant le client)
 * @returns Pourcentage de rabais (0-20%)
 */
export function calculateFamilyDiscount(familyMembersCount: number): number {
  if (familyMembersCount <= 1) {
    return 0; // Pas de rabais si seul
  }

  // 2% par membre supplémentaire (le client ne compte pas pour le rabais)
  const discount = (familyMembersCount - 1) * 2;

  // Maximum 20% (10 membres)
  return Math.min(discount, 20);
}

/**
 * Appliquer le rabais familial à un prix
 * 
 * @param basePrice - Prix de base en CHF
 * @param discountPercent - Pourcentage de rabais (0-20%)
 * @returns Prix après rabais
 */
export function applyFamilyDiscount(basePrice: number, discountPercent: number): number {
  if (discountPercent <= 0) {
    return basePrice;
  }

  const discount = basePrice * (discountPercent / 100);
  return Math.round((basePrice - discount) * 100) / 100; // Arrondir à 2 décimales
}

/**
 * Générer la description pour une facture Stripe incluant les membres de la famille
 * 
 * @param familyMembers - Liste des membres de la famille
 * @param discountPercent - Pourcentage de rabais appliqué
 * @returns Description formatée pour Stripe
 */
export function generateInvoiceDescription(
  familyMembers: FamilyMember[],
  discountPercent: number
): string {
  if (familyMembers.length <= 1) {
    return 'Mandat de Gestion Annuel';
  }

  const memberNames = familyMembers
    .map(m => {
      const fullName = m.prenom ? `${m.prenom} ${m.nom}` : m.nom;
      return m.lienParente ? `${fullName} (${m.lienParente})` : fullName;
    })
    .join(', ');

  return `Mandat de Gestion Annuel - Vous et ${familyMembers.length - 1} membre${familyMembers.length > 2 ? 's' : ''} de votre famille (${memberNames}) - Rabais familial ${discountPercent}%`;
}

/**
 * Générer un résumé des membres de la famille pour les métadonnées Stripe
 * 
 * @param familyMembers - Liste des membres de la famille
 * @returns Chaîne formatée avec les noms des membres
 */
export function generateFamilyMembersSummary(familyMembers: FamilyMember[]): string {
  return familyMembers
    .map(m => {
      const fullName = m.prenom ? `${m.prenom} ${m.nom}` : m.nom;
      return m.lienParente ? `${fullName} (${m.lienParente})` : fullName;
    })
    .join(', ');
}
