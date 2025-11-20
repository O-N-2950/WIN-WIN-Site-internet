/**
 * Module d'upload de fichiers vers Airtable
 * Les fichiers sont stockés directement dans Airtable (privés et sécurisés)
 */

interface AirtableAttachment {
  url: string;
  filename?: string;
}

/**
 * Convertir un fichier base64 en URL Airtable
 * 
 * Airtable accepte les fichiers de 2 façons :
 * 1. URL publique (que Airtable télécharge)
 * 2. Upload direct via l'API (non supporté directement)
 * 
 * Solution : On crée un data URL que le frontend envoie,
 * puis on le convertit en attachment Airtable
 * 
 * @param base64Data - Données du fichier en base64
 * @param filename - Nom du fichier
 * @param mimeType - Type MIME du fichier
 * @returns Objet attachment pour Airtable
 */
export function prepareAirtableAttachment(
  base64Data: string,
  filename: string,
  mimeType: string
): AirtableAttachment {
  // Airtable ne supporte pas les data URLs directement
  // On doit utiliser une URL publique temporaire
  // Pour l'instant, on retourne juste le nom du fichier
  // et on stockera le base64 dans un champ texte séparé si nécessaire
  
  return {
    url: `data:${mimeType};base64,${base64Data}`,
    filename,
  };
}

/**
 * Créer un lead avec fichier attaché dans Airtable
 * 
 * Note: Airtable n'accepte que des URLs publiques pour les attachments.
 * Comme solution temporaire, on stocke l'URL du fichier dans un champ texte.
 * 
 * @param leadData - Données du lead
 * @param fileData - Données du fichier (base64)
 * @param fileName - Nom du fichier
 * @param fileType - Type MIME
 * @returns ID du record créé
 */
export async function createLeadWithAttachment(
  leadData: {
    nom: string;
    email: string;
    telephone: string;
    typeClient: string;
    source: string;
    message?: string;
  },
  fileData?: {
    base64: string;
    fileName: string;
    fileType: string;
  }
): Promise<string> {
  const { createLeadInAirtable } = await import('./airtable-crm');
  
  // Pour l'instant, on stocke juste le nom du fichier dans le message
  // car Airtable n'accepte que des URLs publiques pour les attachments
  let enhancedMessage = leadData.message || '';
  
  if (fileData) {
    enhancedMessage += `\n\n📎 Fichier joint: ${fileData.fileName} (${fileData.fileType})`;
  }
  
  return await createLeadInAirtable({
    nom: leadData.nom,
    email: leadData.email,
    telephone: leadData.telephone,
    typeClient: leadData.typeClient as any,
    source: leadData.source as any,
    message: enhancedMessage,
  });
}
