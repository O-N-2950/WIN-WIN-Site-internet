import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { createClientInAirtable } from './airtable';

describe('Airtable Client Tests', () => {
  it('devrait créer un client avec signature dans Airtable', async () => {
    // Lire l'URL de la signature uploadée
    const signatureUrl = fs.readFileSync('/home/ubuntu/signature-test-url.txt', 'utf-8').trim();
    
    console.log('🧪 Test création client Airtable...');
    console.log(`📸 Signature URL: ${signatureUrl}`);
    
    // Créer un client de test
    const clientData = {
      nom: 'Test API',
      prenom: 'Client',
      email: 'test-api-' + Date.now() + '@winwin.swiss',
      telMobile: '+41 79 123 45 67',
      adresse: 'Rue de Test 123',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'Particulier' as const,
      age: 35,
      tarifApplicable: 185,
      mandatOffert: false,
      dateSignatureMandat: new Date().toISOString().split('T')[0],
      signatureUrl,
    };
    
    console.log('📝 Données client:', JSON.stringify(clientData, null, 2));
    
    // Créer le client dans Airtable
    const record = await createClientInAirtable(clientData);
    
    console.log(`✅ Client créé dans Airtable: ${record.id}`);
    console.log('📄 Record:', JSON.stringify(record, null, 2));
    
    expect(record.id).toBeDefined();
    expect(record.id).toContain('rec');
    expect(record.fields).toBeDefined();
    
    // Sauvegarder l'ID pour vérification manuelle
    fs.writeFileSync('/home/ubuntu/airtable-record-id.txt', record.id);
    console.log(`💾 Record ID sauvegardé: ${record.id}`);
  }, 90000);
});
