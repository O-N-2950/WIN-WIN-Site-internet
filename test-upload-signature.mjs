import fs from 'fs';
import fetch from 'node-fetch';

// Lire le data URL de la signature
const signatureDataUrl = fs.readFileSync('/home/ubuntu/signature-test-dataurl.txt', 'utf-8');

// Appeler l'API tRPC uploadSignature
const testUploadSignature = async () => {
  try {
    console.log('🧪 Test uploadSignature API...');
    console.log(`📏 Taille signature: ${signatureDataUrl.length} caractères`);
    
    const response = await fetch('http://localhost:3000/api/trpc/workflow.uploadSignature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signatureDataUrl,
        clientEmail: 'test-api@winwin.swiss',
      }),
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Upload réussi !');
      console.log('📄 Résultat:', JSON.stringify(result, null, 2));
      
      // Sauvegarder l'URL pour le test suivant
      if (result.result?.data?.url) {
        fs.writeFileSync('/home/ubuntu/signature-test-url.txt', result.result.data.url);
        console.log(`💾 URL sauvegardée: ${result.result.data.url}`);
      }
    } else {
      console.error('❌ Erreur upload:', result);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

testUploadSignature();
