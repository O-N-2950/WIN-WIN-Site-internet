/**
 * Génération de codes de parrainage et identifiants de groupe familial
 * 
 * Format code parrainage : NOM-1234 (4 lettres + 4 chiffres)
 * Format groupe familial : FAMILLE-NOM-ANNEE
 */

/**
 * Générer un code de parrainage unique
 * 
 * @param nom - Nom du client
 * @returns Code parrainage (ex: DUPO-1234)
 */
export function generateReferralCode(nom: string): string {
  // Nettoyer le nom (enlever accents, espaces, caractères spéciaux)
  const cleanNom = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/[^a-zA-Z]/g, '') // Garder seulement lettres
    .toUpperCase();

  // Prendre les 4 premières lettres (ou compléter avec X si trop court)
  const prefix = (cleanNom + 'XXXX').substring(0, 4);

  // Générer 4 chiffres aléatoires
  const suffix = Math.floor(1000 + Math.random() * 9000).toString();

  return `${prefix}-${suffix}`;
}

/**
 * Générer un identifiant de groupe familial
 * 
 * @param nom - Nom de famille
 * @returns Identifiant groupe (ex: FAMILLE-DUPONT-2024)
 */
export function generateFamilyGroupId(nom: string): string {
  // Nettoyer le nom
  const cleanNom = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();

  // Année actuelle
  const year = new Date().getFullYear();

  return `FAMILLE-${cleanNom}-${year}`;
}

/**
 * Valider un code de parrainage
 * 
 * @param code - Code à valider
 * @returns true si le format est valide
 */
export function isValidReferralCode(code: string): boolean {
  // Format: 4 lettres - 4 chiffres
  const pattern = /^[A-Z]{4}-\d{4}$/;
  return pattern.test(code);
}
