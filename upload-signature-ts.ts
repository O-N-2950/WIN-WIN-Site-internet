import fs from 'fs';
import { uploadToCloudinary } from './server/_core/cloudinaryUpload';

async function main() {
  const signaturePath = '/home/ubuntu/upload/signature_olivier_neukomm_transparent.png';
  const buffer = fs.readFileSync(signaturePath);
  
  try {
    // Upload vers winwin-assets au lieu de winwin-mandats
    const url = await uploadToCloudinary(buffer, 'winwin-assets/signature-olivier-neukomm', 'image');
    console.log('✅ Upload réussi !');
    console.log('URL:', url);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

main();
