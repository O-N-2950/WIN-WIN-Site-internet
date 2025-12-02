import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { storagePut } from './storage';

describe('Workflow Simple Tests', () => {
  it('devrait uploader directement vers S3', async () => {
    // Lire la signature de test
    const signatureDataUrl = fs.readFileSync('/home/ubuntu/signature-test-dataurl.txt', 'utf-8');
    
    console.log('🧪 Test upload S3 direct...');
    console.log(`📏 Taille signature: ${signatureDataUrl.length} caractères`);
    
    // Convertir data URL en Buffer (comme dans workflow.ts)
    const base64Data = signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log(`📦 Buffer créé: ${buffer.length} bytes`);
    
    // Upload direct vers S3
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    const fileKey = `signatures/test-api-${Date.now()}-${randomSuffix}.png`;
    
    const { url } = await storagePut(fileKey, buffer, 'image/png');
    
    console.log(`✅ Upload S3 réussi: ${url}`);
    
    expect(url).toBeDefined();
    expect(url).toContain('signatures/');
    expect(url).toContain('.png');
    
    // Sauvegarder l'URL
    fs.writeFileSync('/home/ubuntu/signature-test-url.txt', url);
  }, 60000);
});
