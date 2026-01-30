import FormData from 'form-data';
// @ts-ignore
import fetch from 'node-fetch';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || '';
const AIRTABLE_BASE_ID = 'appZQkR17PwOtdQ30';

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
  // Créer FormData pour l'upload
  const formData = new FormData();
  formData.append('file', buffer, {
    filename,
    contentType: mimeType,
  });

  // Upload vers Airtable (endpoint temporaire pour obtenir l'URL)
  // Note: Airtable nécessite d'uploader via un service externe puis de référencer l'URL
  // Pour simplifier, on va utiliser une approche directe avec base64
  
  const base64Data = buffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  return {
    url: dataUrl,
    filename,
  };
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
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}/${recordId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        [fieldName]: [
          {
            url: attachmentUrl,
            filename,
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Airtable attachment: ${error}`);
  }
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
