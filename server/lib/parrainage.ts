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
 * @param totalMandatsActifs - Nombre TOTAL de mandats actifs (Privé + Entreprise + Conjoint)
 * @returns Pourcentage de rabais (0-20%)
 * 
 * Logique WIN WIN (système incitatif) :
 * - 1 mandat = 0% (pas de rabais si seul)
 * - 2 mandats = 4% (forte incitation dès le départ)
 * - 3 mandats = 6%
 * - 4 mandats = 8%
 * - 5 mandats = 10%
 * - 6 mandats = 12%
 * - 7 mandats = 14%
 * - 8 mandats = 16%
 * - 9 mandats = 18%
 * - 10 mandats = 20% MAX
 * 
 * Formule : (mandats - 1) × 2% + 2% pour mandats >= 2
 */
export function calculateFamilyDiscount(totalMandatsActifs: number): number {
  if (totalMandatsActifs <= 1) {
    return 0; // 1 seul mandat = pas de rabais
  }

  // Formule : (mandats - 1) × 2 + 2
  // 2 mandats → (2-1)×2 + 2 = 4%
  // 3 mandats → (3-1)×2 + 2 = 6%
  // 10 mandats → (10-1)×2 + 2 = 20%
  const discount = (totalMandatsActifs - 1) * 2 + 2;

  // Maximum 20% (10 mandats)
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

/**
 * Interface pour un membre avec son statut
 */
export interface FamilyMemberWithStatus extends FamilyMember {
  statut: string;
  isActive: boolean;
}

/**
 * Compter uniquement les membres ACTIFS de la famille
 * 
 * @param codeParrainage - Code de parrainage du groupe familial
 * @returns Nombre de membres avec statut "Actif"
 */
export async function countActiveFamilyMembers(codeParrainage: string): Promise<number> {
  if (!codeParrainage || codeParrainage.trim() === '') {
    return 0;
  }

  try {
    // Rechercher tous les clients avec ce code de parrainage ET statut Actif
    const filterFormula = `AND({Code Parrainage}='${codeParrainage.replace(/'/g, "\\'")}'`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('[Parrainage] Erreur comptage membres actifs:', await response.text());
      return 0;
    }

    const result = await response.json();
    
    // Filtrer uniquement les membres avec statut "Actif"
    const activeMembers = result.records.filter((record: any) => {
      const statut = record.fields['Statut du client'] as string;
      return statut === 'Actif';
    });

    return activeMembers.length;
  } catch (error) {
    console.error('[Parrainage] Erreur comptage membres actifs:', error);
    return 0;
  }
}

/**
 * Récupérer tous les membres de la famille avec leur statut
 * 
 * @param codeParrainage - Code de parrainage du groupe familial
 * @returns Liste des membres avec leur statut
 */
export async function getFamilyMembersWithStatus(codeParrainage: string): Promise<FamilyMemberWithStatus[]> {
  if (!codeParrainage || codeParrainage.trim() === '') {
    return [];
  }

  try {
    const filterFormula = `{Code Parrainage}='${codeParrainage.replace(/'/g, "\\'")}'`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      console.error('[Parrainage] Erreur recherche famille avec statut:', await response.text());
      return [];
    }

    const result = await response.json();

    return result.records.map((record: any) => {
      const statut = record.fields['Statut du client'] as string || 'Inconnu';
      return {
        id: record.id,
        nom: record.fields['NOM du client'] as string,
        prenom: record.fields['Prénom'] as string | undefined,
        email: record.fields['Email'] as string,
        codeParrainage: record.fields['Code Parrainage'] as string,
        lienParente: record.fields['Lien de Parenté'] as string | undefined,
        statut,
        isActive: statut === 'Actif',
      };
    });
  } catch (error) {
    console.error('[Parrainage] Erreur récupération famille avec statut:', error);
    return [];
  }
}

/**
 * Calculer le rabais familial dynamiquement basé sur les membres ACTIFS
 * 
 * @param codeParrainage - Code de parrainage du groupe familial
 * @returns Objet avec nombre de membres actifs, rabais, et prix calculés
 */
export async function calculateDynamicFamilyDiscount(codeParrainage: string, basePrice: number = 185) {
  const membresActifs = await countActiveFamilyMembers(codeParrainage);
  
  // Calculer le rabais (2% par membre, max 20%)
  const rabais = Math.min(membresActifs * 2, 20);
  
  // Calculer le prix final
  const prixFinal = applyFamilyDiscount(basePrice, rabais);
  
  return {
    membresActifs,
    rabais,
    prixBase: basePrice,
    prixFinal,
    economie: basePrice - prixFinal,
  };
}

/**
 * Générer un code de parrainage unique basé sur le nom du client
 * Format: NOM-XXXX (4 lettres du nom + 4 caractères aléatoires)
 * 
 * @param nom - Nom du client
 * @returns Code de parrainage unique
 */
export function generateFamilyCode(nom: string): string {
  // Nettoyer le nom (enlever accents, espaces, caractères spéciaux)
  const cleanNom = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/[^a-zA-Z]/g, '') // Garder que lettres
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, 'X'); // Si nom < 4 lettres, compléter avec X
  
  // Générer 4 caractères aléatoires (lettres + chiffres)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `${cleanNom}-${randomPart}`;
}

/**
 * Notifier tous les membres de la famille lors de la résiliation d'un membre
 * 
 * @param codeParrainage - Code de parrainage du groupe familial
 * @param memberResilie - Membre qui a résilié
 * @param oldDiscount - Ancien rabais (%)
 * @param newDiscount - Nouveau rabais (%)
 * @param oldPrice - Ancien prix (CHF)
 * @param newPrice - Nouveau prix (CHF)
 */
export async function notifyFamilyMembers(
  codeParrainage: string,
  memberResilie: { nom: string; prenom?: string },
  oldDiscount: number,
  newDiscount: number,
  oldPrice: number,
  newPrice: number
): Promise<void> {
  try {
    const familyMembers = await getFamilyMembersWithStatus(codeParrainage);
    
    // Filtrer uniquement les membres actifs (ne pas notifier celui qui résilie)
    const activeMembers = familyMembers.filter(m => m.isActive);
    
    const nomComplet = memberResilie.prenom 
      ? `${memberResilie.prenom} ${memberResilie.nom}` 
      : memberResilie.nom;
    
    console.log(`[Parrainage] Notification de ${activeMembers.length} membres suite à résiliation de ${nomComplet}`);
    
    // TODO: Implémenter l'envoi d'emails via le système d'email de Manus
    // Pour l'instant, on log juste les notifications
    for (const member of activeMembers) {
      console.log(`[Parrainage] Email à envoyer à ${member.email}:`);
      console.log(`  Sujet: ⚠️ Changement dans votre groupe familial`);
      console.log(`  Corps: ${nomComplet} a résilié son mandat.`);
      console.log(`  Rabais: ${oldDiscount}% → ${newDiscount}%`);
      console.log(`  Prix: ${oldPrice} CHF → ${newPrice} CHF`);
    }
  } catch (error) {
    console.error('[Parrainage] Erreur notification famille:', error);
  }
}

/**
 * Générer la liste formatée des membres pour la facture Stripe
 * 
 * @param codeParrainage - Code de parrainage du groupe familial
 * @returns Chaîne formatée avec ✅/❌ selon le statut
 */
export async function generateInvoiceMembersList(codeParrainage: string): Promise<string> {
  const members = await getFamilyMembersWithStatus(codeParrainage);
  
  if (members.length === 0) {
    return 'Aucun membre';
  }
  
  return members
    .map(m => {
      const icon = m.isActive ? '✅' : '❌';
      const fullName = m.prenom ? `${m.prenom} ${m.nom}` : m.nom;
      const status = m.isActive ? '' : ' (résilié)';
      return `${icon} ${fullName}${status}`;
    })
    .join('\n');
}
