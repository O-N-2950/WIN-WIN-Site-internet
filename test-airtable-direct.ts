import { createClientInAirtable } from './server/airtable';

async function testCreateClient() {
  console.log('🧪 Test création client Airtable avec signature...\n');
  
  const testData = {
    nom: 'Test',
    prenom: 'Client',
    email: 'test@example.com',
    typeClient: 'Privé' as const,
    dateNaissance: '1990-01-15',
    adresse: 'Rue de Test 123',
    npa: '2950',
    localite: 'Courgenay',
    telMobile: '+41 79 123 45 67',
    signatureUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/app-bEKwu3wRasXEgQhTn4SpMV/signatures/test-api-1764672495096-ksz0ww122w.png',
    tarifApplicable: 25,
    mandatOffert: false,
    dateSignatureMandat: '2025-01-29',
  };
  
  try {
    console.log('📤 Envoi des données à Airtable...');
    console.log('Données:', JSON.stringify(testData, null, 2));
    
    const result = await createClientInAirtable(testData);
    
    console.log('\n✅ Client créé avec succès !');
    console.log('Record ID:', result.id);
    console.log('Lien Airtable:', `https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${result.id}`);
    
  } catch (error: any) {
    console.error('\n❌ Erreur lors de la création du client:');
    console.error('Message:', error.message);
    if (error.response?.data) {
      console.error('Détails:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

testCreateClient();
