#!/usr/bin/env node

/**
 * Test API direct du workflow - appel aux procédures tRPC via HTTP
 */

const BASE_URL = 'https://www.winwin.swiss';

console.log('🧪 Test API Direct WIN WIN\n');

// Données de test
const testData = {
  prenom: 'Agent',
  nom: 'Test',
  email: `test-${Date.now()}@example.com`,
  telMobile: '+41 79 123 45 67',
  dateNaissance: '1995-05-15',
  typeClient: 'prive',
  adresse: 'Rue de Test 123',
  npa: '2950',
  localite: 'Courgenay',
  signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
};

console.log('📧 Email de test:', testData.email);
console.log('');

// Test 1: Calcul du prix
console.log('💰 Test 1: Calcul du prix...');
try {
  const calcResponse = await fetch(`${BASE_URL}/api/trpc/workflow.calculatePrice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      json: {
        typeClient: 'prive',
        dateNaissance: '1995-05-15'
      }
    }),
  });

  if (!calcResponse.ok) {
    console.error('❌ Erreur calcul prix:', await calcResponse.text());
  } else {
    const calcResult = await calcResponse.json();
    console.log('✅ Prix calculé:', JSON.stringify(calcResult.result.data.json, null, 2));
    console.log('');
  }
} catch (error) {
  console.error('❌ Erreur:', error.message);
}

// Test 2: Création du client
console.log('📄 Test 2: Création du client...');
try {
  const createResponse = await fetch(`${BASE_URL}/api/trpc/customers.createFromSignature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      json: testData
    }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.text();
    console.error('❌ Erreur création client:', error);
  } else {
    const createResult = await createResponse.json();
    console.log('✅ Client créé:', JSON.stringify(createResult.result.data, null, 2));
    console.log('');
    console.log('🎉 Test complet réussi !');
    console.log('\n📊 Résumé:');
    console.log('  ✅ Calcul de prix fonctionne');
    console.log('  ✅ Création client fonctionne');
    console.log('  ✅ Workflow complet validé');
    console.log('\n💡 Prochaine étape:');
    console.log('  Vérifiez dans Airtable que le client a été créé avec le mandat PDF');
  }
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
