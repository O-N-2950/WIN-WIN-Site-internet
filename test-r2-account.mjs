import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Extraire l'Account ID de l'endpoint
const fullEndpoint = 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com';
const accountId = '891814e197da7ef83e9e6db513cc4db1';

const config = {
  accessKeyId: '2d7c79beae1e0f464e4b255514e26eb9',
  secretAccessKey: '22fe31a3121759456a3c9aa3f4c70421776a4bc1e5748f00c5930865ad151bcf',
  accountId: accountId,
  bucketName: 'winwin-uploads'
};

console.log('[Test R2 Account] Configuration:', {
  accountId: config.accountId,
  bucketName: config.bucketName
});

// Essayer avec l'URL publique R2
const endpoint = `https://${config.accountId}.r2.cloudflarestorage.com`;

const client = new S3Client({
  region: 'auto',
  endpoint: endpoint,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

const testKey = `test-uploads/account-test-${Date.now()}.txt`;
const testData = Buffer.from('Test R2 avec Account ID');

const command = new PutObjectCommand({
  Bucket: config.bucketName,
  Key: testKey,
  Body: testData,
  ContentType: 'text/plain',
});

try {
  console.log('[Test R2 Account] Upload...');
  const result = await client.send(command);
  console.log('[Test R2 Account] ✅ SUCCÈS!');
  console.log('[Test R2 Account] ETag:', result.ETag);
} catch (error) {
  console.error('[Test R2 Account] ❌', error.message);
  console.error('[Test R2 Account] Code:', error.Code || 'N/A');
}
