/**
 * Script de test du workflow complet de parrainage familial
 * WIN WIN Finance Group
 */

import 'dotenv/config';

// Données du client test
const testClient = {
  prenom: 'Marie',
  nom: 'Dubois',
  typeClient: 'Privé',
  dateNaissance: '1990-05-15',
  email: `marie.dubois.test.${Date.now()}@example.com`, // Email unique
  telMobile: '+41 79 555 1234',
  adresse: 'Rue du Test 42',
  npa: 2900,
  localite: 'Porrentruy',
  canton: 'Jura',
  formuleAppel: 'Madame',
  situationFamiliale: 'Célibataire',
  statutProfessionnel: 'Employé(e)',
  fumeur: 'non',
  language: 'Français',
  codeParrainage: 'OLIV-SELS', // Code de parrainage à tester
};

console.log('='.repeat(60));
console.log('TEST WORKFLOW COMPLET - PARRAINAGE FAMILIAL');
console.log('='.repeat(60));
console.log('\n📋 Données du client test:');
console.log(`   Nom: ${testClient.prenom} ${testClient.nom}`);
console.log(`   Email: ${testClient.email}`);
console.log(`   Code parrainage: ${testClient.codeParrainage}`);
console.log('');

// Étape 1: Valider le code de parrainage
console.log('🔍 ÉTAPE 1: Validation du code de parrainage...');
console.log('');

const { validateReferralCode } = await import('./server/lib/parrainage.js');

try {
  const referrer = await validateReferralCode(testClient.codeParrainage);
  
  if (referrer) {
    console.log('✅ Code de parrainage VALIDE');
    console.log(`   Parrain: ${referrer.prenom} ${referrer.nom}`);
    console.log(`   Email: ${referrer.email}`);
    console.log(`   ID: ${referrer.id}`);
    console.log(`   Lien parenté: ${referrer.lienParente || 'Non défini'}`);
  } else {
    console.log('❌ Code de parrainage INVALIDE');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erreur lors de la validation:', error.message);
  process.exit(1);
}

console.log('');
console.log('─'.repeat(60));
console.log('');

// Étape 2: Créer le client dans Airtable
console.log('📝 ÉTAPE 2: Création du client dans Airtable...');
console.log('');

const { createClientInAirtable, getClientById, findClientByEmail } = await import('./server/airtable.js');

let clientId;
try {
  // Vérifier si le client existe déjà
  const existing = await findClientByEmail(testClient.email);
  if (existing) {
    console.log('⚠️  Client avec cet email existe déjà, suppression recommandée avant le test');
    console.log(`   ID existant: ${existing.id}`);
    clientId = existing.id;
  } else {
    // Créer le client
    const record = await createClientInAirtable({
      'Prénom': testClient.prenom,
      'Nom': testClient.nom,
      'Type de client': testClient.typeClient,
      'Date de naissance': testClient.dateNaissance,
      'Email du client (table client)': testClient.email,
      'Tél. Mobile': testClient.telMobile,
      'Adresse et no': testClient.adresse,
      'NPA': testClient.npa,
      'Localité': testClient.localite,
      'Canton': testClient.canton,
      'Statut du client': 'Prospect',
      'Formule d\'appel': testClient.formuleAppel,
      'Situation familiale': testClient.situationFamiliale,
      'Statut professionnel': testClient.statutProfessionnel,
      'Fumeur(se)': testClient.fumeur,
      'Language': testClient.language,
    });
    
    clientId = record.id;
    console.log('✅ Client créé avec succès');
    console.log(`   ID: ${clientId}`);
  }
} catch (error) {
  console.error('❌ Erreur lors de la création:', error.message);
  process.exit(1);
}

console.log('');
console.log('─'.repeat(60));
console.log('');

// Étape 3: Récupérer le parrain et vérifier son groupe
console.log('👥 ÉTAPE 3: Vérification du groupe familial du parrain...');
console.log('');

const { validateReferralCode: validateCode } = await import('./server/lib/parrainage.js');

try {
  const referrer = await validateCode(testClient.codeParrainage);
  
  if (referrer) {
    const referrerData = await getClientById(referrer.id);
    
    if (referrerData) {
      const groupeFamilial = referrerData['Groupe Familial'];
      const relationsFamiliales = referrerData['Relations familiales'];
      
      console.log('✅ Données du parrain récupérées');
      console.log(`   Groupe familial: ${groupeFamilial || 'AUCUN'}`);
      console.log(`   Relations: ${relationsFamiliales || 'Non défini'}`);
      
      if (groupeFamilial) {
        console.log('');
        console.log('📊 Scénario 1: Le parrain a déjà un groupe');
        console.log(`   → Le nouveau client devrait rejoindre: ${groupeFamilial}`);
      } else {
        console.log('');
        console.log('📊 Scénario 2: Le parrain n\'a pas de groupe');
        console.log('   → Un nouveau groupe devrait être créé');
        console.log('   → Le parrain devrait devenir "Membre fondateur"');
        
        const { generateFamilyCode } = await import('./server/lib/parrainage.js');
        const newGroupCode = `FAMILLE-${generateFamilyCode(referrer.nom)}`;
        console.log(`   → Format du groupe: ${newGroupCode}`);
      }
    }
  }
} catch (error) {
  console.error('❌ Erreur:', error.message);
}

console.log('');
console.log('─'.repeat(60));
console.log('');

// Étape 4: Simuler l'assignation au groupe (logique du router)
console.log('🔗 ÉTAPE 4: Simulation de l\'assignation au groupe familial...');
console.log('');

try {
  const referrer = await validateCode(testClient.codeParrainage);
  
  if (referrer) {
    const referrerData = await getClientById(referrer.id);
    let groupeFamilial;
    
    if (referrerData && referrerData['Groupe Familial']) {
      // Scénario 1: Rejoindre groupe existant
      groupeFamilial = referrerData['Groupe Familial'];
      console.log('✅ Scénario 1 activé: Rejoindre groupe existant');
      console.log(`   Groupe: ${groupeFamilial}`);
    } else {
      // Scénario 2: Créer nouveau groupe
      const { generateFamilyCode } = await import('./server/lib/parrainage.js');
      groupeFamilial = `FAMILLE-${generateFamilyCode(referrer.nom)}`;
      console.log('✅ Scénario 2 activé: Créer nouveau groupe');
      console.log(`   Nouveau groupe: ${groupeFamilial}`);
      console.log('   ⚠️  Le parrain devrait être mis à jour avec:');
      console.log(`      - Groupe Familial: ${groupeFamilial}`);
      console.log('      - Relations familiales: Membre fondateur');
    }
    
    console.log('');
    console.log('📌 Le nouveau client devrait avoir:');
    console.log(`   - Groupe Familial: ${groupeFamilial}`);
    console.log('   - Relations familiales: undefined (à définir manuellement)');
  }
} catch (error) {
  console.error('❌ Erreur:', error.message);
}

console.log('');
console.log('─'.repeat(60));
console.log('');

// Étape 5: Calcul du rabais familial
console.log('💰 ÉTAPE 5: Calcul du rabais familial...');
console.log('');

const { calculateFamilyDiscount, applyFamilyDiscount } = await import('./server/lib/parrainage.js');

try {
  // Simuler différents nombres de membres
  const basePrice = 185; // Prix de base pour particulier > 22 ans
  
  console.log(`Prix de base: ${basePrice} CHF`);
  console.log('');
  
  const scenarios = [
    { membres: 1, description: 'Nouveau client seul' },
    { membres: 2, description: 'Avec 1 membre existant' },
    { membres: 5, description: 'Avec 4 membres existants' },
    { membres: 12, description: 'Groupe actuel OLIV-SELS (12 membres)' },
  ];
  
  scenarios.forEach(({ membres, description }) => {
    const rabais = calculateFamilyDiscount(membres);
    const prixFinal = applyFamilyDiscount(basePrice, rabais);
    const economie = basePrice - prixFinal;
    
    console.log(`${description}:`);
    console.log(`   Membres: ${membres} | Rabais: ${rabais}% | Prix: ${prixFinal} CHF | Économie: ${economie} CHF`);
  });
} catch (error) {
  console.error('❌ Erreur:', error.message);
}

console.log('');
console.log('='.repeat(60));
console.log('✅ TEST TERMINÉ');
console.log('='.repeat(60));
console.log('');
console.log('📝 PROCHAINES ÉTAPES MANUELLES:');
console.log('   1. Vérifier dans Airtable que le client a été créé');
console.log('   2. Vérifier que l\'automation se déclenche après assignation du groupe');
console.log('   3. Tester la signature du mandat');
console.log('   4. Tester le paiement Stripe avec le rabais appliqué');
console.log('');
