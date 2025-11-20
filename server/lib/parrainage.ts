/**
 * Module de gestion du système de parrainage familial WIN WIN
 * 
 * Fonctionnalités :
 * - Validation des codes de parrainage
 * - Calcul automatique des rabais familiaux (2% par membre, max 20%)
 * - Gestion des groupes familiaux
 * - Intégration avec Airtable et Stripe
 */

/**
 * Types de liens de parenté éligibles
 */
export type LienParente =
  | "Fondateur"
  | "Conjoint(e)"
  | "Père"
  | "Mère"
  | "Fils"
  | "Fille"
  | "Frère"
  | "Sœur"
  | "Grand-père"
  | "Grand-mère"
  | "Beau-père"
  | "Belle-mère"
  | "Beau-frère"
  | "Belle-sœur"
  | "Entreprise liée"
  | "Autre";

/**
 * Structure d'un membre de famille
 */
export interface FamilyMember {
  recordId: string;
  nom: string;
  prenom?: string;
  nomEntreprise?: string;
  codeParrainage: string;
  lienParente?: LienParente;
  typeClient: "Privé" | "Entreprise";
}

/**
 * Résultat de validation d'un code de parrainage
 */
export interface ReferralValidationResult {
  valid: boolean;
  member?: FamilyMember;
  error?: string;
}

/**
 * Calcul du rabais familial
 */
export interface FamilyDiscountResult {
  nombreMembres: number;
  pourcentageRabais: number; // 0-20
  prixBase: number;
  montantRabais: number;
  prixFinal: number;
}

/**
 * Valide un code de parrainage en interrogeant Airtable
 * 
 * @param code - Code de parrainage (format: PRENOM-XXXX)
 * @returns Résultat de validation avec informations du parrain
 */
export async function validateReferralCode(
  code: string
): Promise<ReferralValidationResult> {
  // Import dynamique pour éviter les dépendances circulaires
  const { searchRecords } = await import("../airtable-crm");

  try {
    // Nettoyer et normaliser le code
    const cleanCode = code.trim().toUpperCase();

    // Format basique : XXXX-YYYY
    if (!/^[A-Z]{2,4}-[A-Z0-9]{4}$/.test(cleanCode)) {
      return {
        valid: false,
        error: "Format de code invalide. Format attendu : PRENOM-XXXX",
      };
    }

    // Rechercher le client avec ce code de parrainage dans Airtable
    const results = await searchRecords(cleanCode, ["Code Parrainage"]);

    if (results.length === 0) {
      return {
        valid: false,
        error: "Code de parrainage introuvable",
      };
    }

    const record = results[0];
    const fields = record.fields;

    // Construire l'objet membre
    const member: FamilyMember = {
      recordId: record.id,
      nom: (fields["Nom"] as string) || "",
      prenom: fields["Prénom"] as string | undefined,
      nomEntreprise: fields["Nom de l'entreprise"] as string | undefined,
      codeParrainage: cleanCode,
      typeClient: (fields["Type de client"] as "Privé" | "Entreprise") || "Privé",
    };

    return {
      valid: true,
      member,
    };
  } catch (error) {
    console.error("[Parrainage] Erreur validation code:", error);
    return {
      valid: false,
      error: "Erreur lors de la validation du code",
    };
  }
}

/**
 * Calcule le rabais familial basé sur le nombre de membres
 * 
 * Règles :
 * - 2% de rabais par membre de la famille
 * - Maximum 20% de rabais (10+ membres)
 * - Prix de base : 185 CHF/an par mandat
 * 
 * @param nombreMembres - Nombre total de membres dans le groupe familial (incluant le nouveau)
 * @param prixBase - Prix de base du mandat (par défaut 185 CHF)
 * @returns Détails du calcul du rabais
 */
export function calculateFamilyDiscount(
  nombreMembres: number,
  prixBase: number = 185
): FamilyDiscountResult {
  // Minimum 2 membres pour avoir un rabais (le parrain + le nouveau)
  if (nombreMembres < 2) {
    return {
      nombreMembres: 1,
      pourcentageRabais: 0,
      prixBase,
      montantRabais: 0,
      prixFinal: prixBase,
    };
  }

  // Calcul du pourcentage : 2% par membre, max 20%
  const pourcentageRabais = Math.min(nombreMembres * 2, 20);

  // Calcul du montant du rabais
  const montantRabais = (prixBase * pourcentageRabais) / 100;

  // Prix final
  const prixFinal = prixBase - montantRabais;

  return {
    nombreMembres,
    pourcentageRabais,
    prixBase,
    montantRabais: Math.round(montantRabais * 100) / 100, // Arrondi à 2 décimales
    prixFinal: Math.round(prixFinal * 100) / 100,
  };
}

/**
 * Génère un ID de groupe familial unique
 * Format : FAM-NOM-ANNEE-XX
 * 
 * @param nomFamille - Nom de famille du fondateur
 * @returns ID de groupe familial
 */
export function generateFamilyId(nomFamille: string): string {
  const year = new Date().getFullYear();
  const nomClean = nomFamille
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .substring(0, 8);
  
  // Suffixe aléatoire
  const suffix = Math.random().toString(36).substring(2, 4).toUpperCase();
  
  return `FAM-${nomClean}-${year}-${suffix}`;
}

/**
 * Récupère tous les membres d'un groupe familial depuis Airtable
 * 
 * @param codeGroupeFamilial - ID du groupe familial
 * @returns Liste des membres du groupe
 */
export async function getFamilyMembers(
  codeGroupeFamilial: string
): Promise<FamilyMember[]> {
  const { listRecords } = await import("../airtable-crm");

  try {
    const records = await listRecords({
      filterByFormula: `{Code Groupe Familial} = "${codeGroupeFamilial}"`,
    });

    return records.map((record) => ({
      recordId: record.id,
      nom: (record.fields["Nom"] as string) || "",
      prenom: record.fields["Prénom"] as string | undefined,
      nomEntreprise: record.fields["Nom de l'entreprise"] as string | undefined,
      codeParrainage: (record.fields["Code Parrainage"] as string) || "",
      lienParente: record.fields["Lien de Parenté"] as LienParente | undefined,
      typeClient: (record.fields["Type de client"] as "Privé" | "Entreprise") || "Privé",
    }));
  } catch (error) {
    console.error("[Parrainage] Erreur récupération membres famille:", error);
    return [];
  }
}

/**
 * Met à jour les rabais de tous les membres d'une famille
 * Appelé quand un nouveau membre rejoint le groupe
 * 
 * @param codeGroupeFamilial - ID du groupe familial
 */
export async function updateFamilyDiscounts(
  codeGroupeFamilial: string
): Promise<void> {
  const { updateRecords } = await import("../airtable-crm");

  try {
    // Récupérer tous les membres
    const members = await getFamilyMembers(codeGroupeFamilial);
    const nombreMembres = members.length;

    // Calculer le nouveau rabais
    const discount = calculateFamilyDiscount(nombreMembres);

    // Mettre à jour chaque membre dans Airtable
    const updates = members.map((member) => ({
      id: member.recordId,
      fields: {
        "Nb membres famille": nombreMembres,
        "Rabais familial %": discount.pourcentageRabais,
        "Prix final avec rabais": discount.prixFinal,
      },
    }));

    // Batch update (max 10 par appel Airtable)
    for (let i = 0; i < updates.length; i += 10) {
      const batch = updates.slice(i, i + 10);
      await updateRecords(batch);
    }

    console.log(
      `[Parrainage] Rabais mis à jour pour ${nombreMembres} membres du groupe ${codeGroupeFamilial}`
    );
  } catch (error) {
    console.error("[Parrainage] Erreur mise à jour rabais:", error);
    throw error;
  }
}
