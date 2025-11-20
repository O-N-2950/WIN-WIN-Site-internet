/**
 * Client Cloudflare R2 avec signature AWS v4 manuelle
 * Contourne les problèmes de compatibilité du SDK AWS
 */

import crypto from 'crypto';

interface R2Config {
  accessKeyId: string;
  secretAccessKey: string;
  endpoint: string;
  bucketName: string;
}

function getR2Config(): R2Config {
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT;
  const bucketName = process.env.R2_BUCKET_NAME || 'winwin-uploads';

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    throw new Error(
      'R2 credentials missing: set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_ENDPOINT'
    );
  }

  return { accessKeyId, secretAccessKey, endpoint, bucketName };
}

/**
 * Créer une signature AWS v4 pour R2
 */
function createSignature(
  method: string,
  url: string,
  headers: Record<string, string>,
  payload: Buffer,
  config: R2Config
): string {
  const now = new Date();
  const dateStamp = now.toISOString().split('T')[0].replace(/-/g, '');
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');

  // Hash du payload
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

  // Canonical request
  const canonicalUri = new URL(url).pathname;
  const canonicalQueryString = '';
  const canonicalHeaders = Object.entries(headers)
    .map(([k, v]) => `${k.toLowerCase()}:${v.trim()}`)
    .sort()
    .join('\n');
  const signedHeaders = Object.keys(headers)
    .map(k => k.toLowerCase())
    .sort()
    .join(';');

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    '',
    signedHeaders,
    payloadHash,
  ].join('\n');

  // String to sign
  const algorithm = 'AWS4-HMAC-SHA256';
  const credentialScope = `${dateStamp}/auto/s3/aws4_request`;
  const canonicalRequestHash = crypto.createHash('sha256').update(canonicalRequest).digest('hex');

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalRequestHash,
  ].join('\n');

  // Signing key
  const kDate = crypto.createHmac('sha256', `AWS4${config.secretAccessKey}`).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update('auto').digest();
  const kService = crypto.createHmac('sha256', kRegion).update('s3').digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();

  // Signature
  const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');

  return `${algorithm} Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

/**
 * Upload un fichier vers R2
 */
export async function uploadToR2(
  key: string,
  data: Buffer,
  contentType: string
): Promise<{ key: string; url: string }> {
  const config = getR2Config();
  
  // Construire l'URL complète
  const url = `${config.endpoint}/${config.bucketName}/${key}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');

  // Headers requis
  const headers: Record<string, string> = {
    'Host': new URL(config.endpoint).host,
    'x-amz-date': amzDate,
    'x-amz-content-sha256': crypto.createHash('sha256').update(data).digest('hex'),
    'Content-Type': contentType,
    'Content-Length': data.length.toString(),
  };

  // Créer la signature
  const authorization = createSignature('PUT', url, headers, data, config);
  headers['Authorization'] = authorization;

  try {
    console.log('[R2 Client] Upload vers:', url);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[R2 Client] Erreur:', response.status, errorText);
      throw new Error(`R2 upload failed: ${response.status} - ${errorText}`);
    }

    console.log('[R2 Client] ✅ Upload réussi:', key);
    
    return {
      key,
      url, // URL privée, nécessite signature pour accès
    };
  } catch (error) {
    console.error('[R2 Client] Erreur upload:', error);
    throw error;
  }
}

/**
 * Générer une URL signée pour accéder à un fichier (temporaire)
 */
export async function getSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const config = getR2Config();
  const url = `${config.endpoint}/${config.bucketName}/${key}`;
  
  // Pour l'instant, retourner l'URL directe
  // TODO: Implémenter la signature pour URLs temporaires
  return url;
}
