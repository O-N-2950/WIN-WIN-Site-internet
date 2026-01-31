import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dzrcyqzuw',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload la signature
const signaturePath = '/home/ubuntu/upload/signature_olivier_neukomm_transparent.png';

cloudinary.uploader.upload(signaturePath, {
  folder: 'winwin-assets',
  public_id: 'signature-olivier-neukomm',
  resource_type: 'image'
}, (error, result) => {
  if (error) {
    console.error('❌ Erreur upload:', error);
    process.exit(1);
  } else {
    console.log('✅ Upload réussi !');
    console.log('URL:', result.secure_url);
    process.exit(0);
  }
});
