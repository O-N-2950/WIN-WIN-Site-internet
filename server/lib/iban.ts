/**
 * Module de validation IBAN Suisse
 * Format: CH + 19 chiffres = 21 caractères total
 * Exemple: CH93 0076 2011 6238 5295 7
 */

/**
 * Regex pour valider le format IBAN Suisse
 * Format: CH + 19 chiffres
 */
export const IBAN_REGEX = /^CH\d{19}$/;

/**
 * Nettoyer un IBAN (enlever espaces et mettre en majuscules)
 */
export function cleanIban(iban: string): string {
  return iban.replace(/\s/g, '').toUpperCase();
}

/**
 * Formater un IBAN avec espaces pour l'affichage
 * Format: CHXX XXXX XXXX XXXX XXXX X
 * 
 * @param iban - IBAN à formater (avec ou sans espaces)
 * @returns IBAN formaté avec espaces
 */
export function formatIban(iban: string): string {
  const clean = cleanIban(iban);
  
  if (clean.length < 2) {
    return clean;
  }
  
  // Format: CHXX XXXX XXXX XXXX XXXX X
  const parts: string[] = [];
  parts.push(clean.slice(0, 4));   // CHXX
  parts.push(clean.slice(4, 8));   // XXXX
  parts.push(clean.slice(8, 12));  // XXXX
  parts.push(clean.slice(12, 16)); // XXXX
  parts.push(clean.slice(16, 20)); // XXXX
  if (clean.length > 20) {
    parts.push(clean.slice(20));   // X
  }
  
  return parts.filter(p => p.length > 0).join(' ');
}

/**
 * Valider un IBAN Suisse
 * 
 * @param iban - IBAN à valider
 * @returns true si valide, false sinon
 */
export function validateIban(iban: string): boolean {
  const clean = cleanIban(iban);
  return IBAN_REGEX.test(clean);
}

/**
 * Valider un IBAN et retourner un message d'erreur si invalide
 * 
 * @param iban - IBAN à valider
 * @returns null si valide, message d'erreur sinon
 */
export function validateIbanWithMessage(iban: string): string | null {
  if (!iban || iban.trim() === '') {
    return 'IBAN requis';
  }
  
  const clean = cleanIban(iban);
  
  // Vérifier le préfixe CH
  if (!clean.startsWith('CH')) {
    return 'L\'IBAN doit commencer par CH';
  }
  
  // Vérifier la longueur
  if (clean.length < 21) {
    const missing = 21 - clean.length;
    return `${missing} caractère${missing > 1 ? 's' : ''} manquant${missing > 1 ? 's' : ''}`;
  }
  
  if (clean.length > 21) {
    const extra = clean.length - 21;
    return `${extra} caractère${extra > 1 ? 's' : ''} en trop`;
  }
  
  // Vérifier que les 19 caractères après CH sont des chiffres
  const digits = clean.slice(2);
  if (!/^\d{19}$/.test(digits)) {
    return 'Les 19 caractères après CH doivent être des chiffres';
  }
  
  return null; // Valide
}

/**
 * Exemples d'IBAN valides pour les tests
 */
export const IBAN_EXAMPLES = {
  valid: [
    'CH9300762011623852957',
    'CH93 0076 2011 6238 5295 7',
    'CH1234567890123456789',
    'CH00 0000 0000 0000 0000 0',
  ],
  invalid: [
    'CH93007620116238529',        // 18 chiffres seulement
    'CH930076201162385295712',    // 20 chiffres
    'FR9300762011623852957',      // Pas CH
    'CH93A0762011623852957',      // Contient une lettre
    'CH93 0076 2011 6238 5295',   // Incomplet
    '',                            // Vide
    'CH',                          // Trop court
  ],
};
