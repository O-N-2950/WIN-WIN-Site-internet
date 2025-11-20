/**
 * Storage helpers for Cloudflare R2
 * Uses AWS S3 SDK compatible with Cloudflare R2
 */

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    const config = getR2Config();
    s3Client = new S3Client({
      region: 'auto',
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return s3Client;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, '');
}

/**
 * Upload a file to Cloudflare R2
 * 
 * @param relKey - Relative path/key for the file (e.g., "uploads/image.jpg")
 * @param data - File data as Buffer, Uint8Array, or string
 * @param contentType - MIME type of the file
 * @returns Object with key and public URL
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = 'application/octet-stream'
): Promise<{ key: string; url: string }> {
  const config = getR2Config();
  const client = getS3Client();
  const key = normalizeKey(relKey);

  // Convert string to Buffer if needed
  const buffer = typeof data === 'string' ? Buffer.from(data) : data;

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  try {
    await client.send(command);
    
    // Construct public URL
    // Format: https://<bucket>.<account-id>.r2.cloudflarestorage.com/<key>
    const url = `${config.endpoint}/${key}`;
    
    console.log('[R2] File uploaded successfully:', key);
    return { key, url };
  } catch (error) {
    console.error('[R2] Upload error:', error);
    throw new Error(`R2 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a presigned URL to download a file from R2
 * 
 * @param relKey - Relative path/key for the file
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Object with key and presigned URL
 */
export async function storageGet(
  relKey: string,
  expiresIn = 3600
): Promise<{ key: string; url: string }> {
  const config = getR2Config();
  const client = getS3Client();
  const key = normalizeKey(relKey);

  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn });
    console.log('[R2] Presigned URL generated:', key);
    return { key, url };
  } catch (error) {
    console.error('[R2] Get URL error:', error);
    throw new Error(`R2 get URL failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
