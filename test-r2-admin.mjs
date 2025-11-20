import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const config = {
  accessKeyId: '2d7c79beae1e0f464e4b255514e26eb9',
  secretAccessKey: '22fe31a3121759456a3c9aa3f4c70421776a4bc1e5748f00c5930865ad151bcf',
  endpoint: 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com',
  bucketName: 'winwin-uploads'
};

console.log('[Test R2 ADMIN] Configuration:', {
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

const testKey = `test-uploads/test-admin-${Date.now()}.txt`;
const testData = Buffer.from('✅ Test upload avec token ADMIN - WIN WIN Finance');

const command = new PutObjectCommand({
  Bucket: config.bucketName,
  Key: testKey,
  Body: testData,
  ContentType: 'text/plain',
});

try {
  console.log('[Test R2 ADMIN] Tentative d\'upload...');
  const result = await client.send(command);
  const url = `${config.endpoint}/${testKey}`;
  console.log('[Test R2 ADMIN] ✅✅✅ UPLOAD RÉUSSI! ✅✅✅');
  console.log('[Test R2 ADMIN] URL:', url);
  console.log('[Test R2 ADMIN] ETag:', result.ETag);
  console.log('[Test R2 ADMIN] Bucket:', config.bucketName);
} catch (error) {
  console.error('[Test R2 ADMIN] ❌ Erreur:', error.message);
  if (error.Code) console.error('[Test R2 ADMIN] Code:', error.Code);
  if (error.$metadata) console.error('[Test R2 ADMIN] Metadata:', error.$metadata);
}
