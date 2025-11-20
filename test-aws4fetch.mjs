import { AwsClient } from 'aws4fetch';

const config = {
  accessKeyId: '2d7c79beae1e0f464e4b255514e26eb9',
  secretAccessKey: '22fe31a3121759456a3c9aa3f4c70421776a4bc1e5748f00c5930865ad151bcf',
  endpoint: 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com',
  bucketName: 'winwin-uploads'
};

const aws = new AwsClient({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  service: 's3',
  region: 'auto',
});

const testKey = `test-uploads/aws4fetch-${Date.now()}.txt`;
const testData = '✅ Test avec aws4fetch - Bibliothèque spécialisée R2';
const url = `${config.endpoint}/${config.bucketName}/${testKey}`;

console.log('[aws4fetch] URL:', url);
console.log('[aws4fetch] Upload en cours...');

try {
  const response = await aws.fetch(url, {
    method: 'PUT',
    body: testData,
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  console.log('[aws4fetch] Status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[aws4fetch] ❌ Erreur:', errorText.substring(0, 500));
  } else {
    console.log('[aws4fetch] ✅✅✅ SUCCÈS! ✅✅✅');
    console.log('[aws4fetch] Fichier uploadé:', testKey);
    console.log('[aws4fetch] URL complète:', url);
  }
} catch (error) {
  console.error('[aws4fetch] ❌ Exception:', error.message);
}
