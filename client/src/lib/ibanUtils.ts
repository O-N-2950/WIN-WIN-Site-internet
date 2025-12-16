/**
 * Formate un IBAN suisse avec espaces tous les 4 caractères
 * Ex: CH1234567890123456789 → CH12 3456 7890 1234 5678 9
 */
export function formatIBAN(value: string): string {
  // Retirer tous les espaces et convertir en majuscules
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  
  // Ajouter des espaces tous les 4 caractères
  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  
  return formatted;
}

/**
 * Valide un IBAN suisse
 * Format: CH + 2 chiffres (clé) + 5 chiffres (banque) + 12 chiffres (compte) + 1 lettre optionnelle
 * Ex: CH56 0024 3243 6022 8840 W (avec lettre) ou CH93 0076 2011 6238 5295 7 (sans lettre)
 */
export function validateSwissIBAN(value: string): boolean {
  // Retirer les espaces
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  
  // Vérifier le format : CH + 19 chiffres OU CH + 18 chiffres + 1 lettre
  const swissIBANRegex = /^CH\d{19}$|^CH\d{18}[A-Z]$/;
  
  return swissIBANRegex.test(cleaned);
}

/**
 * Retourne un message d'erreur si l'IBAN est invalide, sinon null
 */
export function getIBANError(value: string): string | null {
  if (!value) return null; // Champ vide = pas d'erreur (géré par required)
  
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  
  if (!cleaned.startsWith('CH')) {
    return "L'IBAN doit commencer par CH";
  }
  
  if (cleaned.length < 21) {
    return `IBAN incomplet (${cleaned.length}/21 caractères)`;
  }
  
  if (cleaned.length > 21) {
    return `IBAN trop long (${cleaned.length}/21 caractères)`;
  }
  
  if (!validateSwissIBAN(cleaned)) {
    return "Format IBAN invalide (CH + 19 chiffres ou CH + 18 chiffres + 1 lettre)";
  }
  
  return null;
}
