import { storagePut } from '../storage';

interface UploadAttachmentResult {
  url: string;
  filename: string;
}

/**
 * Upload un fichier (Buffer) vers Airtable Attachments
 * 
 * @param buffer - Contenu du fichier
 * @param filename - Nom du fichier
 * @param mimeType - Type MIME du fichier
 * @returns URL de l'attachment dans Airtable
 */
export async function uploadToAirtableAttachment(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadAttachmentResult> {
  try {
    console.log(`[Airtable] 📤 Upload de ${filename} vers S3...`);
    
    // Générer une clé S3 unique avec timestamp pour éviter les collisions
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const s3Key = `airtable-attachments/${timestamp}-${randomSuffix}-${filename}`;
    
    // Upload vers S3 via storagePut
    const result = await storagePut(s3Key, buffer, mimeType);
    
    console.log(`[Airtable] ✅ Upload réussi: ${result.url}`);
    
    return {
      url: result.url,
      filename,
    };
  } catch (error) {
    console.error(`[Airtable] ❌ Erreur lors de l'upload de ${filename}:`, error);
    throw new Error(`Impossible d'uploader ${filename} vers S3: ${error}`);
  }
}

/**
 * Met à jour un champ attachment dans Airtable
 * 
 * @param tableId - ID de la table Airtable
 * @param recordId - ID de l'enregistrement
 * @param fieldName - Nom du champ attachment
 * @param attachmentUrl - URL de l'attachment (ou data URL)
 * @param filename - Nom du fichier
 */
export async function updateAirtableAttachment(
  tableId: string,
  recordId: string,
  fieldName: string,
  attachmentUrl: string,
  filename: string
): Promise<void> {
  // Cette fonction n'est plus nécessaire car on utilise directement
  // l'URL S3 dans la mise à jour Airtable
  console.warn('[Airtable] updateAirtableAttachment() est obsolète, utilisez directement l\'URL S3');
}

/**
 * Convertit une signature base64 (dataURL) en PNG Buffer
 * 
 * @param dataUrl - Data URL de la signature (data:image/png;base64,...)
 * @returns Buffer PNG
 */
export function dataUrlToBuffer(dataUrl: string): Buffer {
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}
