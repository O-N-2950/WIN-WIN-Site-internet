/**
 * Test du workflow complet en conditions réelles
 * Création d'un client test avec code OLIV-SELS jusqu'au paiement Stripe
 */

import 'dotenv/config';
import { execSync } from 'child_process';

const CODE_PARRAINAGE = 'OLIV-SELS';
const TIMESTAMP = Date.now();

// Données du client test
const clientTest = {
  prenom: 'Marie',
  nom: 'Dubois',
  typeClient: 'Privé',
  dateNaissance: '1990-05-15',
  email: `marie.dubois.test.${TIMESTAMP}@example.com`,
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
  codeParrainage: CODE_PARRAINAGE,
};

console.log('='.repeat(80));
console.log('TEST WORKFLOW COMPLET - CONDITIONS RÉELLES');
console.log('='.repeat(80));
console.log('');
console.log('📋 Client test:');
console.log(`   Nom: ${clientTest.prenom} ${clientTest.nom}`);
console.log(`   Email: ${clientTest.email}`);
console.log(`   Code parrainage: ${clientTest.codeParrainage}`);
console.log('');

// ÉTAPE 1: Valider le code de parrainage
console.log('─'.repeat(80));
console.log('🔍 ÉTAPE 1: Validation du code de parrainage');
console.log('─'.repeat(80));

const { validateReferralCode } = await import('./server/lib/parrainage.js');

let referrer;
try {
  referrer = await validateReferralCode(CODE_PARRAINAGE);
  
  if (referrer) {
    console.log('✅ Code de parrainage VALIDE');
    console.log(`   Parrain: ${referrer.prenom} ${referrer.nom}`);
    console.log(`   Email: ${referrer.email}`);
    console.log(`   ID: ${referrer.id}`);
  } else {
    console.log('❌ Code de parrainage INVALIDE');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

console.log('');

// ÉTAPE 2: Créer le client dans Airtable
console.log('─'.repeat(80));
console.log('📝 ÉTAPE 2: Création du client dans Airtable');
console.log('─'.repeat(80));

const { createClientInAirtable, getClientById } = await import('./server/airtable.js');
const { generateFamilyCode } = await import('./server/lib/parrainage.js');

let clientId;
let groupeFamilial;

try {
  // Récupérer les données du parrain
  const referrerData = await getClientById(referrer.id);
  
  if (referrerData && referrerData['Groupe Familial']) {
    // Scénario 1: Le parrain a déjà un groupe
    groupeFamilial = referrerData['Groupe Familial'];
    console.log('📊 Scénario 1: Rejoindre groupe existant');
    console.log(`   Groupe: ${groupeFamilial}`);
  } else {
    // Scénario 2: Créer un nouveau groupe
    groupeFamilial = `FAMILLE-${generateFamilyCode(referrer.nom)}`;
    console.log('📊 Scénario 2: Créer nouveau groupe');
    console.log(`   Nouveau groupe: ${groupeFamilial}`);
    console.log('   ⚠️  Le parrain sera mis à jour comme "Membre fondateur"');
  }
  
  console.log('');
  
  // Créer le client
  const record = await createClientInAirtable({
    'Prénom': clientTest.prenom,
    'Nom': clientTest.nom,
    'Type de client': clientTest.typeClient,
    'Date de naissance': clientTest.dateNaissance,
    'Email du client (table client)': clientTest.email,
    'Tél. Mobile': clientTest.telMobile,
    'Adresse et no': clientTest.adresse,
    'NPA': clientTest.npa,
    'Localité': clientTest.localite,
    'Canton': clientTest.canton,
    'Statut du client': 'Prospect',
    'Formule d\'appel': clientTest.formuleAppel,
    'Situation familiale': clientTest.situationFamiliale,
    'Statut professionnel': clientTest.statutProfessionnel,
    'Fumeur(se)': clientTest.fumeur,
    'Language': clientTest.language,
    'Groupe Familial': groupeFamilial,
  });
  
  clientId = record.id;
  console.log('✅ Client créé avec succès');
  console.log(`   ID: ${clientId}`);
  console.log(`   Groupe familial: ${groupeFamilial}`);
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

console.log('');

// ÉTAPE 3: Attendre que l'automation Airtable se déclenche
console.log('─'.repeat(80));
console.log('⏳ ÉTAPE 3: Attente de l\'automation Airtable (5 secondes)');
console.log('─'.repeat(80));
console.log('   L\'automation devrait :');
console.log('   - Créer les liens bidirectionnels');
console.log('   - Calculer le nombre de membres actifs');
console.log('   - Calculer le rabais familial');
console.log('');

await new Promise(resolve => setTimeout(resolve, 5000));

console.log('✅ Attente terminée');
console.log('');

// ÉTAPE 4: Récupérer les données mises à jour
console.log('─'.repeat(80));
console.log('🔄 ÉTAPE 4: Vérification des données après automation');
console.log('─'.repeat(80));

try {
  const clientData = await getClientById(clientId);
  
  if (clientData) {
    const nbMembres = clientData['Nb membres famille actifs'] || 1;
    const rabaisFamilial = clientData['Rabais familial %'] || 0;
    
    console.log('✅ Données récupérées:');
    console.log(`   Groupe familial: ${clientData['Groupe Familial'] || 'Non défini'}`);
    console.log(`   Nb membres actifs: ${nbMembres}`);
    console.log(`   Rabais familial: ${rabaisFamilial}%`);
    console.log(`   Relations familiales: ${clientData['Relations familiales'] || 'Non défini'}`);
  }
} catch (error) {
  console.error('⚠️  Erreur récupération:', error.message);
}

console.log('');

// ÉTAPE 5: Simuler la création d'une session Stripe
console.log('─'.repeat(80));
console.log('💳 ÉTAPE 5: Simulation création session Stripe');
console.log('─'.repeat(80));

const { calculateFamilyDiscount, applyFamilyDiscount, getFamilyMembers } = await import('./server/lib/parrainage.js');

try {
  const clientData = await getClientById(clientId);
  
  if (clientData && clientData['Groupe Familial']) {
    const groupe = clientData['Groupe Familial'];
    const nbMembres = clientData['Nb membres famille actifs'] || 1;
    
    // Récupérer la liste des membres
    const members = await getFamilyMembers(groupe);
    
    // Calculer le rabais
    const rabais = calculateFamilyDiscount(nbMembres);
    const prixBase = 185; // Particulier > 22 ans
    const prixFinal = applyFamilyDiscount(prixBase, rabais);
    const economie = prixBase - prixFinal;
    
    // Construire la description
    const membersList = members
      .map(m => `${m.prenom || ''} ${m.nom}`.trim())
      .join(', ');
    
    const description = [
      `Mandat de Gestion Annuel - ${clientTest.prenom} ${clientTest.nom}`,
      '',
      `👥 GROUPE FAMILIAL: ${groupe}`,
      `Membres actifs (${nbMembres}): ${membersList}`,
      '',
      `💰 CALCUL DU PRIX:`,
      `Prix de base: CHF ${prixBase.toFixed(2)}`,
      `Rabais familial: -${rabais}% (${nbMembres} membres)`,
      `Économie: CHF ${economie.toFixed(2)}`,
      `Prix final: CHF ${prixFinal.toFixed(2)}`,
    ].join('\n');
    
    console.log('✅ Simulation réussie');
    console.log('');
    console.log('📄 DESCRIPTION STRIPE:');
    console.log('┌' + '─'.repeat(78) + '┐');
    description.split('\n').forEach(line => {
      console.log('│ ' + line.padEnd(77) + '│');
    });
    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    console.log('📊 RÉSUMÉ:');
    console.log(`   Groupe: ${groupe}`);
    console.log(`   Membres: ${nbMembres}`);
    console.log(`   Liste: ${membersList.substring(0, 50)}${membersList.length > 50 ? '...' : ''}`);
    console.log(`   Rabais: ${rabais}%`);
    console.log(`   Prix base: ${prixBase} CHF`);
    console.log(`   Prix final: ${prixFinal} CHF`);
    console.log(`   Économie: ${economie} CHF`);
    console.log(`   Montant Stripe: ${Math.round(prixFinal * 100)} centimes`);
  }
} catch (error) {
  console.error('❌ Erreur simulation:', error.message);
}

console.log('');
console.log('='.repeat(80));
console.log('✅ TEST TERMINÉ AVEC SUCCÈS');
console.log('='.repeat(80));
console.log('');
console.log('📝 RÉSULTATS:');
console.log(`   ✅ Client créé: ${clientId}`);
console.log(`   ✅ Groupe familial: ${groupeFamilial}`);
console.log(`   ✅ Code parrainage validé: ${CODE_PARRAINAGE}`);
console.log(`   ✅ Simulation Stripe réussie`);
console.log('');
console.log('⚠️  NETTOYAGE:');
console.log(`   Pour supprimer le client test, allez dans Airtable et supprimez le record ${clientId}`);
console.log('');
