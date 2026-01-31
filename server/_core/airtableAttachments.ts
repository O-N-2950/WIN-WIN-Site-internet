import FormData from 'form-data';
import { ENV } from './env';

interface UploadAttachmentResult {
  url: string;
  filename: string;
}

/**
 * Convertit une data URL (base64) en Buffer
 */
export function dataUrlToBuffer(dataUrl: string): Buffer {
  const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid data URL format');
  }
  return Buffer.from(matches[2], 'base64');
}

/**
 * Upload un fichier vers Airtable Attachments API
 * Documentation officielle : https://airtable.com/developers/web/api/upload-attachment
 * 
 * @param buffer - Contenu du fichier
 * @param filename - Nom du fichier
 * @param mimeType - Type MIME du fichier
 * @param recordId - ID de l'enregistrement Airtable
 * @param fieldId - ID du champ attachment dans Airtable
 * @returns URL publique de l'attachment (compatible Airtable)
 */
export async function uploadToAirtableAttachment(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  recordId: string,
  fieldId: string
): Promise<UploadAttachmentResult> {
  try {
    console.log(`[Airtable] 📤 Upload de ${filename} vers Airtable Attachments API...`);
    
    // Créer FormData pour l'upload
    const form = new FormData();
    form.append('file', buffer, {
      filename,
      contentType: mimeType,
    });
    
    // Endpoint officiel Airtable Attachments API
    const uploadUrl = `https://api.airtable.com/v0/${ENV.airtableBaseId}/${ENV.airtableClientsTableId}/${recordId}/attachments/${fieldId}`;
    
    console.log(`[Airtable] 🔄 POST ${uploadUrl}`);
    
    // Upload vers Airtable
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.airtableApiKey}`,
        ...form.getHeaders(),
      },
      body: form,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Airtable] ❌ Erreur HTTP ${response.status}:`, errorText);
      throw new Error(`Airtable Attachments API error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log(`[Airtable] ✅ Upload réussi:`, result);
    
    // L'API Airtable retourne l'URL de l'attachment
    const attachmentUrl = result.url || result.fields?.[fieldId]?.[0]?.url;
    
    if (!attachmentUrl) {
      throw new Error('Airtable API ne retourne pas d\'URL d\'attachment');
    }
    
    return {
      url: attachmentUrl,
      filename,
    };
  } catch (error) {
    console.error(`[Airtable] ❌ Erreur lors de l'upload de ${filename}:`, error);
    throw new Error(`Impossible d'uploader ${filename} vers Airtable: ${error}`);
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
  // l'API Airtable Attachments pour uploader
  console.warn('[Airtable] updateAirtableAttachment() est obsolète, utilisez uploadToAirtableAttachment()');
}
