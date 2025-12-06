import { describe, it, expect } from 'vitest';
import fs from 'fs';

describe('Workflow API Tests', () => {
  it('devrait uploader une signature vers S3', async () => {
    // Lire la signature de test
    const signatureDataUrl = fs.readFileSync('/home/ubuntu/signature-test-dataurl.txt', 'utf-8');
    
    console.log('🧪 Test uploadSignature...');
    console.log(`📏 Taille signature: ${signatureDataUrl.length} caractères`);
    
    // Simuler l'appel tRPC (via fetch direct)
    const response = await fetch('http://localhost:3000/api/trpc/workflow.uploadSignature?batch=1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "0": {
          "input": {
            signatureDataUrl,
            clientEmail: 'test-vitest@winwin.swiss',
          }
        }
      }),
    });
    
    const result = await response.json();
    console.log('📄 Résultat:', JSON.stringify(result, null, 2));
    
    expect(response.status).toBe(200);
    expect(result[0].result.data.url).toBeDefined();
    expect(result[0].result.data.url).toContain('signatures/');
    
    // Sauvegarder l'URL pour le test suivant
    fs.writeFileSync('/home/ubuntu/signature-test-url.txt', result[0].result.data.url);
    console.log(`✅ Signature uploadée: ${result[0].result.data.url}`);
  }, 60000);
});
