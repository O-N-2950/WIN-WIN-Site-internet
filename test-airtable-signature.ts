import { createClientInAirtable, uploadSignatureToAirtable } from './server/airtable';

// Signature de test en base64 (petit carré rouge 10x10 pixels)
const testSignatureDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC';

async function testCreateClientWithSignature() {
  console.log('🧪 Test création client Airtable avec upload signature...\n');
  
  const testData = {
    nom: 'TestSignature',
    prenom: 'Client',
    email: 'test-signature@example.com',
    typeClient: 'Privé' as const,
    dateNaissance: '1990-01-15',
    adresse: 'Rue de Test 123',
    npa: '2950',
    localite: 'Courgenay',
    telMobile: '+41 79 123 45 67',
    tarifApplicable: 25,
    mandatOffert: false,
    dateSignatureMandat: '2025-01-29',
  };
  
  try {
    // Étape 1: Créer le client
    console.log('📤 Étape 1: Création du client dans Airtable...');
    const result = await createClientInAirtable(testData);
    
    console.log('✅ Client créé avec succès !');
    console.log('Record ID:', result.id);
    console.log('Lien Airtable:', `https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${result.id}`);
    
    // Étape 2: Uploader la signature
    console.log('\n📤 Étape 2: Upload de la signature...');
    await uploadSignatureToAirtable(result.id, testSignatureDataUrl);
    
    console.log('✅ Signature uploadée avec succès !');
    console.log('\n🎉 Test complet réussi ! Vérifiez dans Airtable que la signature est visible.');
    
  } catch (error: any) {
    console.error('\n❌ Erreur lors du test:');
    console.error('Message:', error.message);
    if (error.response?.data) {
      console.error('Détails:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testCreateClientWithSignature();
