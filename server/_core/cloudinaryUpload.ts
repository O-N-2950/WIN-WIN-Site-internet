import { v2 as cloudinary } from 'cloudinary';
import { ENV } from './env';

// Configuration Cloudinary (déjà dans env.ts)
cloudinary.config({
  cloud_name: ENV.cloudinaryCloudName,
  api_key: ENV.cloudinaryApiKey,
  api_secret: ENV.cloudinaryApiSecret,
});

/**
 * Upload un fichier vers Cloudinary
 * 
 * @param buffer - Contenu du fichier
 * @param filename - Nom du fichier (sans extension)
 * @param resourceType - Type de ressource Cloudinary ('image' pour PNG/JPG, 'raw' pour PDF/autres)
 * @returns URL sécurisée du fichier uploadé
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'winwin-mandats',
        public_id: filename,
        resource_type: resourceType
      },
      (error, result) => {
        if (error) {
          console.error(`[Cloudinary] ❌ Erreur upload ${filename}:`, error);
          reject(error);
        } else {
          console.log(`[Cloudinary] ✅ Upload réussi: ${result!.secure_url}`);
          resolve(result!.secure_url);
        }
      }
    );
    uploadStream.end(buffer);
  });
}
