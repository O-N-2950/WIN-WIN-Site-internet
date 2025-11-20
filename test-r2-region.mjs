import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const config = {
  accessKeyId: '2d7c79beae1e0f464e4b255514e26eb9',
  secretAccessKey: '22fe31a3121759456a3c9aa3f4c70421776a4bc1e5748f00c5930865ad151bcf',
  endpoint: 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com',
  bucketName: 'winwin-uploads'
};

console.log('[Test R2 Region] Test avec région us-east-1...');

const client = new S3Client({
  region: 'us-east-1', // Essayer avec une région spécifique
  endpoint: config.endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
  forcePathStyle: true,
});

const testKey = `test-uploads/region-test-${Date.now()}.txt`;
const testData = Buffer.from('Test R2 avec région us-east-1');

const command = new PutObjectCommand({
  Bucket: config.bucketName,
  Key: testKey,
  Body: testData,
  ContentType: 'text/plain',
});

try {
  console.log('[Test R2 Region] Upload...');
  const result = await client.send(command);
  console.log('[Test R2 Region] ✅ SUCCÈS!');
  console.log('[Test R2 Region] ETag:', result.ETag);
} catch (error) {
  console.error('[Test R2 Region] ❌', error.message);
  console.error('[Test R2 Region] Code:', error.Code || 'N/A');
}
