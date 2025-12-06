/**
 * Module d'upload de fichiers vers Cloudinary
 * 
 * Remplace tmpfiles.org qui est bloqué par les adblockers
 * 
 * Configuration requise dans Railway :
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY
 * - CLOUDINARY_API_SECRET
 */

import { v2 as cloudinary } from 'cloudinary';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploader un fichier base64 vers Cloudinary
 * 
 * @param base64Data - Données du fichier en base64 (avec ou sans préfixe data:)
 * @param filename - Nom du fichier (optionnel)
 * @param folder - Dossier Cloudinary (par défaut: winwin-attachments)
 * @returns URL publique du fichier uploadé
 */
export async function uploadToCloudinary(
  base64Data: string,
  filename?: string,
  folder: string = 'winwin-attachments'
): Promise<string> {
  try {
    console.log('[Cloudinary] Starting upload...');
    console.log('[Cloudinary] Config check:', {
      hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasApiKey: !!process.env.CLOUDINARY_API_KEY,
      hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
    });

    // Vérifier que Cloudinary est configuré
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('[Cloudinary] Missing credentials!');
      throw new Error('Cloudinary not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Railway.');
    }

    // Nettoyer le nom de fichier pour Cloudinary (pas d'espaces, caractères spéciaux)
    const publicId = filename 
      ? `${folder}/${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}_${Date.now()}`
      : `${folder}/file_${Date.now()}`;

    console.log('[Cloudinary] Uploading file:', publicId);
    console.log('[Cloudinary] Base64 data length:', base64Data.length);
    console.log('[Cloudinary] Folder:', folder);

    // Upload vers Cloudinary
    const result = await cloudinary.uploader.upload(base64Data, {
      public_id: publicId,
      resource_type: 'auto', // Détecte automatiquement le type (image, pdf, etc.)
      // folder: folder, // ← Supprimé car publicId contient déjà le chemin complet
    });

    console.log('[Cloudinary] Upload successful:', result.secure_url);

    return result.secure_url;
  } catch (error) {
    console.error('[Cloudinary] Upload error:', error);
    console.error('[Cloudinary] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(`Failed to upload file to Cloudinary: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Vérifier si Cloudinary est configuré
 * 
 * @returns true si les credentials Cloudinary sont présents
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Supprimer un fichier de Cloudinary
 * 
 * @param publicId - ID public du fichier (extrait de l'URL)
 * @returns true si suppression réussie
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('[Cloudinary] Delete result:', result);
    return result.result === 'ok';
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error);
    return false;
  }
}
