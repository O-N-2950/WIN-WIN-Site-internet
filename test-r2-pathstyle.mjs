import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const config = {
  accessKeyId: '2d7c79beae1e0f464e4b255514e26eb9',
  secretAccessKey: '22fe31a3121759456a3c9aa3f4c70421776a4bc1e5748f00c5930865ad151bcf',
  endpoint: 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com',
  bucketName: 'winwin-uploads'
};

console.log('[Test R2 PathStyle] Configuration:', {
  endpoint: config.endpoint,
  bucketName: config.bucketName,
  forcePathStyle: true
});

const client = new S3Client({
  region: 'auto',
  endpoint: config.endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  forcePathStyle: true, // Important pour R2
});

const testKey = `test-uploads/pathstyle-${Date.now()}.txt`;
const testData = Buffer.from('Test avec forcePathStyle pour R2');

const command = new PutObjectCommand({
  Bucket: config.bucketName,
  Key: testKey,
  Body: testData,
  ContentType: 'text/plain',
});

try {
  console.log('[Test R2 PathStyle] Upload en cours...');
  const result = await client.send(command);
  const url = `${config.endpoint}/${config.bucketName}/${testKey}`;
  console.log('[Test R2 PathStyle] ✅✅✅ SUCCÈS! ✅✅✅');
  console.log('[Test R2 PathStyle] URL:', url);
  console.log('[Test R2 PathStyle] ETag:', result.ETag);
} catch (error) {
  console.error('[Test R2 PathStyle] ❌ Erreur:', error.message);
  if (error.Code) console.error('[Test R2 PathStyle] Code:', error.Code);
}
