import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const config = {
  accessKeyId: '6626bb1f5044556b87b32d5fed36ef15',
  secretAccessKey: 'f3fb3d44cba50b727d2518e37fbccbb2a53480092cad594fd57196fe73d51541',
  endpoint: 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com',
  bucketName: 'winwin-uploads'
};

console.log('[Test R2 FIXED] Configuration:', {
  endpoint: config.endpoint,
  bucketName: config.bucketName,
  accessKeyId: config.accessKeyId.substring(0, 15) + '...'
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
const testData = Buffer.from('Test upload avec identifiants corrects');

const command = new PutObjectCommand({
  Bucket: config.bucketName,
  Key: testKey,
  Body: testData,
  ContentType: 'text/plain',
});

try {
  console.log('[Test R2 FIXED] Tentative d\'upload...');
  const result = await client.send(command);
  const url = `${config.endpoint}/${testKey}`;
  console.log('[Test R2 FIXED] ✅ Upload réussi!');
  console.log('[Test R2 FIXED] URL:', url);
  console.log('[Test R2 FIXED] ETag:', result.ETag);
} catch (error) {
  console.error('[Test R2 FIXED] ❌ Erreur:', error.message);
  if (error.Code) console.error('[Test R2 FIXED] Code:', error.Code);
}
