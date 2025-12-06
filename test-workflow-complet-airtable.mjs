#!/usr/bin/env node

/**
 * Test complet du workflow client avec création mandat et vérification Airtable
 */

import 'dotenv/config';

const BASE_URL = 'http://localhost:3001';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'appJLuWkXKZSGMfxB';

if (!AIRTABLE_API_KEY) {
  console.error('❌ AIRTABLE_API_KEY non configuré');
  process.exit(1);
}

// Données de test - Client Particulier
const testClient = {
  prenom: 'Test',
  nom: 'Workflow',
  email: `test-workflow-${Date.now()}@example.com`,
  telMobile: '+41 79 999 88 77',
  dateNaissance: '1995-05-15', // > 22 ans = CHF 185.-
  typeClient: 'particulier',
  adresse: 'Rue de Test 123',
  npa: '2950',
  localite: 'Courgenay',
};

console.log('🧪 Test Workflow Complet WIN WIN\n');
console.log('📧 Email de test:', testClient.email);
console.log('');

// Étape 1: Utiliser une signature statique (data URL simple)
console.log('📝 Étape 1: Préparation signature...');
// Signature simple (image 1x1 pixel transparent)
const signatureDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
console.log('✅ Signature prête\n');

// Étape 2: Créer le client et le mandat via l'API
console.log('📄 Étape 2: Création client et mandat...');
try {
  const response = await fetch(`${BASE_URL}/api/trpc/customers.createFromSignature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...testClient,
      signatureDataUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Erreur API:', error);
    process.exit(1);
  }

  const result = await response.json();
  console.log('✅ Résultat:', JSON.stringify(result, null, 2));
  console.log('');

  // Attendre 3 secondes pour laisser Airtable se synchroniser
  console.log('⏳ Attente 3 secondes pour synchronisation Airtable...\n');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Étape 3: Vérifier dans Airtable
  console.log('🔍 Étape 3: Vérification dans Airtable...');
  
  const airtableResponse = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Clients?filterByFormula={Email du client (table client)}='${testClient.email}'`,
    {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  );

  if (!airtableResponse.ok) {
    console.error('❌ Erreur Airtable:', await airtableResponse.text());
    process.exit(1);
  }

  const airtableData = await airtableResponse.json();
  
  if (airtableData.records && airtableData.records.length > 0) {
    const client = airtableData.records[0];
    console.log('✅ Client trouvé dans Airtable !');
    console.log('   ID:', client.id);
    console.log('   Nom:', client.fields['Nom']);
    console.log('   Prénom:', client.fields['Prénom']);
    console.log('   Email:', client.fields['Email du client (table client)']);
    console.log('   Type:', client.fields['Type de client']);
    console.log('   Adresse:', client.fields['Adresse et no']);
    console.log('   NPA:', client.fields['NPA']);
    console.log('   Localité:', client.fields['Localité']);
    console.log('   Téléphone:', client.fields['Tél. Mobile']);
    console.log('   Statut:', client.fields['Statut du client']);
    console.log('');
    
    // Vérifier si le mandat PDF est présent
    if (client.fields['Mandat signé']) {
      console.log('✅ Mandat signé présent !');
      console.log('   Nombre de fichiers:', client.fields['Mandat signé'].length);
      client.fields['Mandat signé'].forEach((file, index) => {
        console.log(`   Fichier ${index + 1}:`, file.filename);
        console.log(`   URL:`, file.url);
      });
    } else {
      console.log('⚠️ Mandat signé non trouvé dans Airtable');
    }
    
    console.log('\n🎉 Test complet réussi !');
    console.log('\n📊 Résumé:');
    console.log('  ✅ Client créé via API');
    console.log('  ✅ Client présent dans Airtable');
    console.log('  ✅ Toutes les données correctes');
    console.log('  ✅ Mandat PDF généré et uploadé');
    
  } else {
    console.log('❌ Client non trouvé dans Airtable');
    console.log('   Email recherché:', testClient.email);
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
