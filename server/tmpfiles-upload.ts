/**
 * Module d'upload de fichiers vers tmpfiles.org
 * Service gratuit qui héberge temporairement les fichiers
 * Airtable téléchargera ensuite le fichier et le stockera définitivement
 */

interface UploadResult {
  url: string;
  fileName: string;
}

/**
 * Upload un fichier vers tmpfiles.org
 * 
 * @param fileData - Données du fichier en base64
 * @param fileName - Nom du fichier
 * @param mimeType - Type MIME du fichier
 * @returns URL publique du fichier
 */
export async function uploadToTmpFiles(
  fileData: string,
  fileName: string,
  mimeType: string
): Promise<UploadResult> {
  try {
    // Décoder le base64
    const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    const buffer = Buffer.from(base64Data, 'base64');

    // Créer un FormData
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, fileName);

    console.log('[TmpFiles] Upload en cours:', fileName, `(${buffer.length} bytes)`);

    // Upload vers tmpfiles.org
    const response = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TmpFiles] Erreur HTTP:', response.status, errorText);
      throw new Error(`TmpFiles upload failed: ${response.status}`);
    }

    const result = await response.json();
    
    console.log('[TmpFiles] Réponse:', result);

    // tmpfiles.org retourne : { "status": "success", "data": { "url": "https://tmpfiles.org/12345/file.pdf" } }
    if (result.status === 'success' && result.data?.url) {
      // Convertir l'URL de preview en URL de téléchargement direct
      // https://tmpfiles.org/12345/file.pdf → https://tmpfiles.org/dl/12345/file.pdf
      const directUrl = result.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
      
      console.log('[TmpFiles] ✅ Upload réussi:', directUrl);
      
      return {
        url: directUrl,
        fileName,
      };
    }

    throw new Error('Invalid response from tmpfiles.org');
  } catch (error) {
    console.error('[TmpFiles] Erreur upload:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
