/**
 * Module de calcul des tarifs pour les mandats de gestion
 * Grille tarifaire WW Finance Group
 */

export type ClientType = "particulier" | "entreprise";

export interface PricingInput {
  type: ClientType;
  age?: number; // Pour particuliers
  employeeCount?: number; // Pour entreprises
  isFree?: boolean; // Mandat offert (famille, proches)
}

export interface PricingResult {
  annualPrice: number;
  monthlyPrice: number;
  description: string;
  stripePriceId: string | null;
}

/**
 * Grille tarifaire particuliers
 */
const PRICING_PARTICULIER: Record<string, number> = {
  "under_18": 0,      // < 18 ans : Gratuit
  "18_22": 85,        // 18-22 ans : CHF 85.-/an
  "over_22": 185,     // > 22 ans : CHF 185.-/an
};

/**
 * Grille tarifaire entreprises (selon nombre d'employés)
 */
const PRICING_ENTREPRISE: Record<string, number> = {
  "0": 160,           // 0 employé : CHF 160.-/an
  "1": 260,           // 1 employé : CHF 260.-/an
  "2": 360,           // 2 employés : CHF 360.-/an
  "3_5": 460,         // 3-5 employés : CHF 460.-/an
  "6_10": 560,        // 6-10 employés : CHF 560.-/an
  "11_20": 660,       // 11-20 employés : CHF 660.-/an
  "21_30": 760,       // 21-30 employés : CHF 760.-/an
  "31_plus": 860,     // 31+ employés : CHF 860.-/an
};

/**
 * IDs des produits Stripe (à configurer après création des produits)
 * Format: price_xxxxxxxxxxxxxxxxxxxxx
 */
const STRIPE_PRICE_IDS: Record<string, string> = {
  // Particuliers
  "particulier_18_22": "price_particulier_18_22",
  "particulier_over_22": "price_particulier_over_22",
  
  // Entreprises
  "entreprise_0": "price_entreprise_0",
  "entreprise_1": "price_entreprise_1",
  "entreprise_2": "price_entreprise_2",
  "entreprise_3_5": "price_entreprise_3_5",
  "entreprise_6_10": "price_entreprise_6_10",
  "entreprise_11_20": "price_entreprise_11_20",
  "entreprise_21_30": "price_entreprise_21_30",
  "entreprise_31_plus": "price_entreprise_31_plus",
};

/**
 * Calculer le tarif pour un particulier
 */
function calculateParticulierPrice(age: number): PricingResult {
  let annualPrice: number;
  let key: string;
  
  if (age < 18) {
    annualPrice = PRICING_PARTICULIER.under_18;
    key = "particulier_under_18";
  } else if (age >= 18 && age <= 22) {
    annualPrice = PRICING_PARTICULIER["18_22"];
    key = "particulier_18_22";
  } else {
    annualPrice = PRICING_PARTICULIER.over_22;
    key = "particulier_over_22";
  }
  
  return {
    annualPrice,
    monthlyPrice: Math.round((annualPrice / 12) * 100) / 100,
    description: `Mandat de gestion annuel - Particulier (${age} ans)`,
    stripePriceId: annualPrice > 0 ? STRIPE_PRICE_IDS[key] || null : null,
  };
}

/**
 * Calculer le tarif pour une entreprise
 */
function calculateEntreprisePrice(employeeCount: number): PricingResult {
  let annualPrice: number;
  let key: string;
  
  if (employeeCount === 0) {
    annualPrice = PRICING_ENTREPRISE["0"];
    key = "entreprise_0";
  } else if (employeeCount === 1) {
    annualPrice = PRICING_ENTREPRISE["1"];
    key = "entreprise_1";
  } else if (employeeCount === 2) {
    annualPrice = PRICING_ENTREPRISE["2"];
    key = "entreprise_2";
  } else if (employeeCount >= 3 && employeeCount <= 5) {
    annualPrice = PRICING_ENTREPRISE["3_5"];
    key = "entreprise_3_5";
  } else if (employeeCount >= 6 && employeeCount <= 10) {
    annualPrice = PRICING_ENTREPRISE["6_10"];
    key = "entreprise_6_10";
  } else if (employeeCount >= 11 && employeeCount <= 20) {
    annualPrice = PRICING_ENTREPRISE["11_20"];
    key = "entreprise_11_20";
  } else if (employeeCount >= 21 && employeeCount <= 30) {
    annualPrice = PRICING_ENTREPRISE["21_30"];
    key = "entreprise_21_30";
  } else {
    annualPrice = PRICING_ENTREPRISE["31_plus"];
    key = "entreprise_31_plus";
  }
  
  return {
    annualPrice,
    monthlyPrice: Math.round((annualPrice / 12) * 100) / 100,
    description: `Mandat de gestion annuel - Entreprise (${employeeCount} employé${employeeCount > 1 ? 's' : ''})`,
    stripePriceId: STRIPE_PRICE_IDS[key] || null,
  };
}

/**
 * Calculer le tarif selon le type de client
 */
export function calculatePrice(input: PricingInput): PricingResult {
  // Mandat offert (gratuit)
  if (input.isFree) {
    return {
      annualPrice: 0,
      monthlyPrice: 0,
      description: "Mandat de gestion annuel - Offert",
      stripePriceId: null,
    };
  }
  
  // Particulier
  if (input.type === "particulier") {
    if (input.age === undefined) {
      throw new Error("L'âge est requis pour un particulier");
    }
    return calculateParticulierPrice(input.age);
  }
  
  // Entreprise
  if (input.type === "entreprise") {
    if (input.employeeCount === undefined) {
      throw new Error("Le nombre d'employés est requis pour une entreprise");
    }
    return calculateEntreprisePrice(input.employeeCount);
  }
  
  throw new Error("Type de client invalide");
}

/**
 * Obtenir toute la grille tarifaire
 */
export function getAllPricing() {
  return {
    particulier: [
      { ageRange: "< 18 ans", price: PRICING_PARTICULIER.under_18, description: "Gratuit" },
      { ageRange: "18-22 ans", price: PRICING_PARTICULIER["18_22"], description: "CHF 85.-/an" },
      { ageRange: "> 22 ans", price: PRICING_PARTICULIER.over_22, description: "CHF 185.-/an" },
    ],
    entreprise: [
      { employeeRange: "0 employé", price: PRICING_ENTREPRISE["0"], description: "CHF 160.-/an" },
      { employeeRange: "1 employé", price: PRICING_ENTREPRISE["1"], description: "CHF 260.-/an" },
      { employeeRange: "2 employés", price: PRICING_ENTREPRISE["2"], description: "CHF 360.-/an" },
      { employeeRange: "3-5 employés", price: PRICING_ENTREPRISE["3_5"], description: "CHF 460.-/an" },
      { employeeRange: "6-10 employés", price: PRICING_ENTREPRISE["6_10"], description: "CHF 560.-/an" },
      { employeeRange: "11-20 employés", price: PRICING_ENTREPRISE["11_20"], description: "CHF 660.-/an" },
      { employeeRange: "21-30 employés", price: PRICING_ENTREPRISE["21_30"], description: "CHF 760.-/an" },
      { employeeRange: "31+ employés", price: PRICING_ENTREPRISE["31_plus"], description: "CHF 860.-/an" },
    ],
  };
}
