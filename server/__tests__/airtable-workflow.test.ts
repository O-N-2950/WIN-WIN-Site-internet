import { describe, it, expect } from 'vitest';
import { createClientInAirtable, uploadSignatureToAirtable, uploadPdfToAirtable } from '../airtable';
import { generateMandatPDF, type MandatData } from '../pdf-generator';

// Signature de test en base64 (petit carré rouge 10x10 pixels)
const testSignatureDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';

describe('Airtable Workflow Integration', () => {
  it('should create client, upload signature and PDF mandat', async () => {
    // 1. Créer le client
    const clientData = {
      nom: 'TestWorkflow',
      prenom: 'Client',
      email: `test-workflow-${Date.now()}@example.com`,
      typeClient: 'Particulier' as const,
      dateNaissance: '1990-01-15',
      adresse: 'Rue de Test 123',
      npa: '2950',
      localite: 'Courgenay',
      telMobile: '+41 79 123 45 67',
      tarifApplicable: 185,
      mandatOffert: false,
      dateSignatureMandat: '2025-01-29',
    };
    
    const result = await createClientInAirtable(clientData);
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.id).toMatch(/^rec/);
    
    console.log('✅ Client créé:', result.id);
    
    // 2. Uploader la signature
    await uploadSignatureToAirtable(result.id, testSignatureDataUrl);
    console.log('✅ Signature uploadée');
    
    // 3. Générer et uploader le PDF du mandat
    const mandatData: MandatData = {
      typeClient: 'prive',
      prenom: clientData.prenom,
      nom: clientData.nom,
      email: clientData.email,
      telMobile: clientData.telMobile,
      adresse: clientData.adresse,
      npa: clientData.npa,
      localite: clientData.localite,
      dateNaissance: clientData.dateNaissance,
      signatureDataUrl: testSignatureDataUrl,
      dateSignature: '2025-01-29',
    };
    
    const pdfBuffer = await generateMandatPDF(mandatData);
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer.length).toBeGreaterThan(0);
    
    console.log('✅ PDF généré:', pdfBuffer.length, 'bytes');
    
    const pdfFilename = `mandat-test-${Date.now()}.pdf`;
    await uploadPdfToAirtable(result.id, pdfBuffer, pdfFilename);
    console.log('✅ PDF uploadé vers Airtable');
    
    console.log('\n🎉 Workflow complet réussi !');
    console.log('Lien Airtable:', `https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${result.id}`);
  }, 60000); // Timeout 60s pour les appels API
});
