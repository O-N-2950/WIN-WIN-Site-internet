/**
 * Script pour créer un client test et générer une vraie session Stripe
 * pour voir la facture avec le rabais familial
 */

import { createClientInAirtable, getClientById } from './server/airtable';
import { validateReferralCode, generateFamilyCode, calculateFamilyDiscount, applyFamilyDiscount, getFamilyMembers } from './server/lib/parrainage';
import Stripe from 'stripe';
import { ENV } from './server/_core/env';

const CODE_PARRAINAGE = 'OLIV-SELS';
const TIMESTAMP = Date.now();

async function main() {
  console.log('='.repeat(80));
  console.log('TEST STRIPE - CRÉATION CLIENT ET FACTURE AVEC RABAIS FAMILIAL');
  console.log('='.repeat(80));
  console.log('');

  // ÉTAPE 1: Valider le code de parrainage
  console.log('🔍 ÉTAPE 1: Validation du code de parrainage');
  console.log('─'.repeat(80));
  
  const referrer = await validateReferralCode(CODE_PARRAINAGE);
  
  if (!referrer) {
    console.error('❌ Code de parrainage invalide');
    process.exit(1);
  }
  
  console.log('✅ Code valide');
  console.log(`   Parrain: ${referrer.prenom} ${referrer.nom}`);
  console.log(`   ID: ${referrer.id}`);
  console.log('');

  // ÉTAPE 2: Déterminer le groupe familial
  console.log('📊 ÉTAPE 2: Détermination du groupe familial');
  console.log('─'.repeat(80));
  
  const referrerData = await getClientById(referrer.id);
  let groupeFamilial: string;

  if (referrerData && referrerData['Groupe Familial']) {
    groupeFamilial = referrerData['Groupe Familial'] as string;
    console.log('✅ Rejoindre groupe existant');
  } else {
    groupeFamilial = `FAMILLE-${generateFamilyCode(referrer.nom)}`;
    console.log('✅ Créer nouveau groupe');
  }
  
  console.log(`   Groupe: ${groupeFamilial}`);
  console.log('');

  // ÉTAPE 3: Créer le client dans Airtable
  console.log('📝 ÉTAPE 3: Création du client dans Airtable');
  console.log('─'.repeat(80));
  
  const clientData = {
    'Prénom': 'Marie',
    'Nom': `Dubois-Test-${TIMESTAMP}`,
    'Type de client': 'Privé',
    'Date de naissance': '1990-05-15',
    'Email du client (table client)': `marie.dubois.test.${TIMESTAMP}@example.com`,
    'Tél. Mobile': '+41 79 555 1234',
    'Adresse et no': 'Rue du Test 42',
    'NPA': 2900,
    'Localité': 'Porrentruy',
    'Canton': 'Jura',
    'Statut du client': 'Prospect',
    'Formule d\'appel': 'Madame',
    'Situation familiale': 'Célibataire',
    'Statut professionnel': 'Employé(e)',
    'Fumeur(se)': 'non',
    'Language': 'Français',
    'Groupe Familial': groupeFamilial,
  };

  const record = await createClientInAirtable(clientData);
  const clientId = record.id;
  
  console.log('✅ Client créé');
  console.log(`   ID: ${clientId}`);
  console.log(`   Email: ${clientData['Email du client (table client)']}`);
  console.log('');

  // ÉTAPE 4: Attendre l'automation Airtable
  console.log('⏳ ÉTAPE 4: Attente automation Airtable (8 secondes)');
  console.log('─'.repeat(80));
  await new Promise(resolve => setTimeout(resolve, 8000));
  console.log('✅ Attente terminée');
  console.log('');

  // ÉTAPE 5: Récupérer les données mises à jour
  console.log('🔄 ÉTAPE 5: Récupération des données après automation');
  console.log('─'.repeat(80));
  
  const updatedClient = await getClientById(clientId);
  const nbMembres = (updatedClient!['Nb membres famille actifs'] as number) || 1;
  const rabaisFamilial = (updatedClient!['Rabais familial %'] as number) || 0;
  
  console.log('✅ Données récupérées:');
  console.log(`   Groupe: ${updatedClient!['Groupe Familial']}`);
  console.log(`   Nb membres actifs: ${nbMembres}`);
  console.log(`   Rabais familial: ${rabaisFamilial}%`);
  console.log('');

  // ÉTAPE 6: Créer une vraie session Stripe
  console.log('💳 ÉTAPE 6: Création session Stripe RÉELLE');
  console.log('─'.repeat(80));
  
  const stripe = new Stripe(ENV.stripeSecretKey, {
    apiVersion: '2025-10-29.clover',
  });

  // Récupérer la liste des membres
  const members = await getFamilyMembers(groupeFamilial);
  const rabais = calculateFamilyDiscount(nbMembres);
  const prixBase = 185;
  const prixFinal = applyFamilyDiscount(prixBase, rabais);

  const membersList = members
    .map(m => `${m.prenom || ''} ${m.nom}`.trim())
    .join(', ');

  const descriptionDetaillée = [
    `Mandat de Gestion Annuel - Marie Dubois-Test-${TIMESTAMP}`,
    '',
    `👥 GROUPE FAMILIAL: ${groupeFamilial}`,
    `Membres actifs (${nbMembres}): ${membersList}`,
    '',
    `💰 CALCUL DU PRIX:`,
    `Prix de base: CHF ${prixBase.toFixed(2)}`,
    `Rabais familial: -${rabais}% (${nbMembres} membres)`,
    `Économie: CHF ${(prixBase - prixFinal).toFixed(2)}`,
    `Prix final: CHF ${prixFinal.toFixed(2)}`,
  ].join('\n');

  console.log('📄 Description de la facture:');
  console.log('┌' + '─'.repeat(78) + '┐');
  descriptionDetaillée.split('\n').forEach(line => {
    console.log('│ ' + line.padEnd(77) + '│');
  });
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');

  // Récupérer le produit Stripe pour "Particulier > 22 ans"
  const priceId = 'price_1STlgKDevWYEIiJ8ExMQznN7';
  
  console.log('🔧 Création du Price personnalisé...');
  
  const originalPrice = await stripe.prices.retrieve(priceId, {
    expand: ['product'],
  });
  
  const product = originalPrice.product as any;
  
  // Créer un nouveau Price avec le prix final
  const customPrice = await stripe.prices.create({
    currency: 'chf',
    unit_amount: Math.round(prixFinal * 100),
    recurring: {
      interval: 'year',
    },
    product_data: {
      name: `${product.name} - Rabais Familial ${rabais}%`,
      description: descriptionDetaillée,
      metadata: {
        originalProductId: product.id,
        originalPriceId: priceId,
        groupeFamilial: groupeFamilial,
        familyMembersCount: nbMembres.toString(),
        familyDiscount: rabais.toString(),
        basePrice: prixBase.toString(),
        finalPrice: prixFinal.toString(),
      },
    },
  });

  console.log('✅ Price personnalisé créé');
  console.log(`   ID: ${customPrice.id}`);
  console.log(`   Montant: ${customPrice.unit_amount! / 100} CHF`);
  console.log('');

  // Créer la session Stripe
  console.log('🔧 Création de la session Checkout...');
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: customPrice.id,
        quantity: 1,
      },
    ],
    customer_email: clientData['Email du client (table client)'],
    success_url: 'https://winwin.swiss/merci?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://winwin.swiss/inscription',
    metadata: {
      clientId: clientId,
      clientName: `Marie Dubois-Test-${TIMESTAMP}`,
      clientEmail: clientData['Email du client (table client)'],
      groupeFamilial: groupeFamilial,
      familyMembersCount: nbMembres.toString(),
      familyDiscount: rabais.toString(),
      finalPrice: prixFinal.toString(),
      familyMembersList: membersList,
    },
  });

  console.log('✅ Session Checkout créée');
  console.log(`   Session ID: ${session.id}`);
  console.log(`   URL: ${session.url}`);
  console.log('');

  console.log('='.repeat(80));
  console.log('✅ TEST TERMINÉ AVEC SUCCÈS');
  console.log('='.repeat(80));
  console.log('');
  console.log('📊 RÉSUMÉ:');
  console.log(`   Client ID: ${clientId}`);
  console.log(`   Groupe: ${groupeFamilial}`);
  console.log(`   Membres: ${nbMembres}`);
  console.log(`   Rabais: ${rabais}%`);
  console.log(`   Prix base: ${prixBase} CHF`);
  console.log(`   Prix final: ${prixFinal} CHF`);
  console.log(`   Économie: ${prixBase - prixFinal} CHF`);
  console.log('');
  console.log('🌐 OUVRIR LA PAGE DE PAIEMENT STRIPE:');
  console.log(`   ${session.url}`);
  console.log('');
  console.log('⚠️  NETTOYAGE:');
  console.log(`   1. Supprimer le client test dans Airtable: ${clientId}`);
  console.log(`   2. Supprimer le Price Stripe: ${customPrice.id}`);
  console.log('');
}

main().catch(console.error);
