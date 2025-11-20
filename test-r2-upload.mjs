import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const config = {
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '6626bb1f504456b87b32d5fed36ef15',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'f3fb3d44cba50b727d2518e37fbccbb2a53480092cad594fd5719d6a73d51541',
  endpoint: process.env.R2_ENDPOINT || 'https://891814e197da7ef8f39e4db513cc4db1.r2.cloudflarestorage.com',
  bucketName: process.env.R2_BUCKET_NAME || 'winwin-uploads'
};

console.log('[Test R2] Configuration:', {
  endpoint: config.endpoint,
  bucketName: config.bucketName,
  accessKeyId: config.accessKeyId.substring(0, 10) + '...'
});

const client = new S3Client({
  region: 'auto',
  endpoint: config.endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

const testKey = `test-uploads/test-${Date.now()}.txt`;
const testData = Buffer.from('Test upload from Manus');

const command = new PutObjectCommand({
  Bucket: config.bucketName,
  Key: testKey,
  Body: testData,
  ContentType: 'text/plain',
});

try {
  console.log('[Test R2] Tentative d\'upload...');
  await client.send(command);
  const url = `${config.endpoint}/${testKey}`;
  console.log('[Test R2] ✅ Upload réussi!');
  console.log('[Test R2] URL:', url);
} catch (error) {
  console.error('[Test R2] ❌ Erreur:', error.message);
  console.error('[Test R2] Détails:', error);
}
