import { describe, it, expect } from 'vitest';
import { storagePut } from './storage';
import { createClientInAirtable } from './airtable';

/**
 * Test d'intégration complet du workflow d'inscription client
 * 
 * Parcours testé :
 * 1. Questionnaire Genspark (simulé avec données de test)
 * 2. Signature électronique → Upload S3
 * 3. Création client Airtable avec signature
 * 4. Vérification des données
 */
describe('Workflow Complet Inscription Client', () => {
  it('devrait compléter le workflow d\'inscription de A à Z', async () => {
    console.log('\n🚀 === TEST WORKFLOW COMPLET D\'INSCRIPTION ===\n');
    
    // ========================================
    // ÉTAPE 1 : Données du questionnaire Genspark
    // ========================================
    console.log('📝 ÉTAPE 1 : Données questionnaire Genspark');
    const questionnaireData = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: `test-workflow-${Date.now()}@winwin.swiss`,
      telMobile: '+41 79 555 66 77',
      dateNaissance: '1985-05-15',
      adresse: 'Route de Lausanne 42',
      npa: '1950',
      localite: 'Sion',
      typeClient: 'Particulier',
      age: 40,
    };
    console.log('✅ Données questionnaire:', JSON.stringify(questionnaireData, null, 2));
    
    // ========================================
    // ÉTAPE 2 : Signature électronique → Upload S3
    // ========================================
    console.log('\n✍️ ÉTAPE 2 : Signature électronique et upload S3');
    
    // Simuler une signature (Base64 PNG minimal)
    const signatureBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const signatureBuffer = Buffer.from(signatureBase64, 'base64');
    
    // Upload S3
    const signatureKey = `signatures/${questionnaireData.email}-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const { url: signatureUrl } = await storagePut(signatureKey, signatureBuffer, 'image/png');
    
    console.log('✅ Signature uploadée sur S3:', signatureUrl);
    expect(signatureUrl).toContain('.png');
    expect(signatureUrl).toContain('cloudfront.net');
    
    // ========================================
    // ÉTAPE 3 : Création client Airtable
    // ========================================
    console.log('\n📊 ÉTAPE 3 : Création client dans Airtable');
    
    const clientData = {
      ...questionnaireData,
      tarifApplicable: 185, // > 22 ans
      mandatOffert: false,
      dateSignatureMandat: new Date().toISOString().split('T')[0],
      signatureUrl,
    };
    
    const airtableResult = await createClientInAirtable(clientData);
    
    console.log('✅ Client créé dans Airtable:', {
      id: airtableResult.id,
      nom: airtableResult.fields['Nom'],
      prenom: airtableResult.fields['Prénom'],
      email: airtableResult.fields['Email du client (table client)'],
      signaturePresente: !!airtableResult.fields['Signature client'],
    });
    
    expect(airtableResult.id).toBeTruthy();
    expect(airtableResult.fields['Nom']).toBe('Dupont');
    expect(airtableResult.fields['Prénom']).toBe('Jean');
    expect(airtableResult.fields['Signature client']).toBeTruthy();
    expect(Array.isArray(airtableResult.fields['Signature client'])).toBe(true);
    expect(airtableResult.fields['Signature client'][0].url).toContain('.png');
    
    // ========================================
    // ÉTAPE 4 : Vérification finale
    // ========================================
    console.log('\n✅ ÉTAPE 4 : Vérification finale');
    console.log('━'.repeat(60));
    console.log('🎉 WORKFLOW COMPLET RÉUSSI !');
    console.log('━'.repeat(60));
    console.log('📝 Questionnaire → ✅ Données collectées');
    console.log('✍️ Signature → ✅ Uploadée sur S3');
    console.log('📊 Airtable → ✅ Client créé avec signature PNG');
    console.log('🔗 Record ID:', airtableResult.id);
    console.log('🖼️ Signature URL:', signatureUrl);
    console.log('━'.repeat(60));
  }, 60000); // Timeout 60s
});
