import crypto from 'crypto';

const config = {
  accessKeyId: '2d7c79beae1e0f464e4b255514e26eb9',
  secretAccessKey: '22fe31a3121759456a3c9aa3f4c70421776a4bc1e5748f00c5930865ad151bcf',
  endpoint: 'https://891814e197da7ef83e9e6db513cc4db1.r2.cloudflarestorage.com',
  bucketName: 'winwin-uploads'
};

const testKey = `test-uploads/custom-${Date.now()}.txt`;
const testData = Buffer.from('Test avec client personnalisé');
const url = `${config.endpoint}/${config.bucketName}/${testKey}`;

console.log('[Custom R2] URL:', url);

const now = new Date();
const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
const dateStamp = now.toISOString().split('T')[0].replace(/-/g, '');

const payloadHash = crypto.createHash('sha256').update(testData).digest('hex');

const headers = {
  'Host': new URL(config.endpoint).host,
  'x-amz-date': amzDate,
  'x-amz-content-sha256': payloadHash,
  'Content-Type': 'text/plain',
};

// Canonical request
const canonicalUri = `/${config.bucketName}/${testKey}`;
const canonicalHeaders = Object.entries(headers)
  .map(([k, v]) => `${k.toLowerCase()}:${v}`)
  .sort()
  .join('\n');
const signedHeaders = Object.keys(headers).map(k => k.toLowerCase()).sort().join(';');

const canonicalRequest = [
  'PUT',
  canonicalUri,
  '',
  canonicalHeaders,
  '',
  signedHeaders,
  payloadHash,
].join('\n');

console.log('[Custom R2] Canonical Request:\n', canonicalRequest);

const algorithm = 'AWS4-HMAC-SHA256';
const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
const requestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');

const stringToSign = [algorithm, amzDate, credentialScope, requestHash].join('\n');

// Signing key
const kDate = crypto.createHmac('sha256', `AWS4${config.secretAccessKey}`).update(dateStamp).digest();
const kRegion = crypto.createHmac('sha256', kDate).update('auto').digest();
const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

headers['Authorization'] = `${algorithm} Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

console.log('[Custom R2] Authorization:', headers['Authorization']);

try {
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: testData,
  });

  console.log('[Custom R2] Status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Custom R2] ❌ Erreur:', errorText);
  } else {
    console.log('[Custom R2] ✅ SUCCÈS!');
  }
} catch (error) {
  console.error('[Custom R2] ❌ Exception:', error.message);
}
