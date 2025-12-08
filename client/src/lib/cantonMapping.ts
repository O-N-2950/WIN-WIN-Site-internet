/**
 * Mapping des codes cantonaux OpenPLZ (shortName) vers les noms Airtable
 * 
 * OpenPLZ retourne des codes à 2 lettres (ex: "JU", "VD", "BE")
 * Airtable attend les noms complets (ex: "Jura", "Vaud", "Berne")
 */
export const CANTON_MAPPING: Record<string, string> = {
  "AG": "Argovie",
  "AI": "Appenzell Rhodes-Intérieures",
  "AR": "Appenzell Rhodes-Extérieures",
  "BE": "Berne",
  "BL": "Bâle_Campagne",
  "BS": "Bâle_Ville",
  "FR": "Fribourg",
  "GE": "Genève",
  "GL": "Glaris",
  "GR": "Grisons",
  "JU": "Jura",
  "LU": "Lucerne",
  "NE": "Neuchâtel",
  "NW": "Nidwald",
  "OW": "Obwald",
  "SG": "Saint-Gall",
  "SH": "Schaffhouse",
  "SO": "Soleure",
  "SZ": "Schwytz",
  "TG": "Thurgovie",
  "TI": "Tessin",
  "UR": "Uri",
  "VD": "Vaud",
  "VS": "Valais",
  "ZG": "Zoug",
  "ZH": "Zurich",
};

/**
 * Convertit un code canton OpenPLZ en nom Airtable
 * @param shortName Code à 2 lettres (ex: "JU")
 * @returns Nom complet Airtable (ex: "Jura") ou undefined si introuvable
 */
export function mapCantonToAirtable(shortName: string): string | undefined {
  return CANTON_MAPPING[shortName.toUpperCase()];
}
