/**
 * Script pour créer une session Stripe de RENOUVELLEMENT
 * avec message de remerciement pour la fidélité
 */

import Stripe from 'stripe';
import { ENV } from './server/_core/env';
import { calculateFamilyDiscount, applyFamilyDiscount } from './server/lib/parrainage';

async function main() {
  console.log('='.repeat(80));
  console.log('TEST STRIPE - RENOUVELLEMENT ANNUEL AVEC RABAIS FAMILIAL');
  console.log('='.repeat(80));
  console.log('');

  const stripe = new Stripe(ENV.stripeSecretKey, {
    apiVersion: '2025-10-29.clover',
  });

  // Données du client Olivier Neukomm (renouvellement année 2)
  const clientName = 'Olivier Neukomm';
  const clientEmail = 'olivier.neukomm@bluewin.ch';
  const groupeFamilial = 'FAMILLE-NEUKOMM-SeLs';
  const nbMembres = 12;
  const anneeRenouvellement = 2; // Année 2
  const dateInscription = '2024'; // Première année
  
  const membersList = 'Olivier Neukomm, Chloé Lefèvre, Patrick Delamare, Sophie Martin, Jean Dupont, Marie Bernard, Pierre Dubois, Claire Moreau, Luc Simon, Anne Laurent, Marc Petit, Julie Roux';
  
  const prixBase = 185; // Particulier > 22 ans
  const rabais = calculateFamilyDiscount(nbMembres);
  const prixFinal = applyFamilyDiscount(prixBase, rabais);
  const economie = prixBase - prixFinal;

  console.log('📊 DONNÉES DU RENOUVELLEMENT:');
  console.log(`   Client: ${clientName}`);
  console.log(`   Email: ${clientEmail}`);
  console.log(`   Année: ${anneeRenouvellement} (client depuis ${dateInscription})`);
  console.log(`   Groupe: ${groupeFamilial}`);
  console.log(`   Membres actifs: ${nbMembres}`);
  console.log(`   Rabais maintenu: ${rabais}%`);
  console.log(`   Prix final: ${prixFinal} CHF/an`);
  console.log('');

  // Construire la description avec message de fidélité
  const descriptionDetaillée = [
    `🎉 RENOUVELLEMENT ANNUEL - Année ${anneeRenouvellement}`,
    `Merci pour votre confiance et votre fidélité !`,
    '',
    `Client: ${clientName}`,
    `Membre WIN WIN depuis ${dateInscription}`,
    '',
    `👥 GROUPE FAMILIAL: ${groupeFamilial}`,
    `Membres actifs (${nbMembres}): ${membersList}`,
    '',
    `💰 VOTRE TARIF PRÉFÉRENTIEL MAINTENU:`,
    `Prix de base: CHF ${prixBase.toFixed(2)}`,
    `Rabais familial: -${rabais}% (${nbMembres} membres)`,
    `Économie annuelle: CHF ${economie.toFixed(2)}`,
    `Prix final: CHF ${prixFinal.toFixed(2)}`,
    '',
    `✨ Depuis ${anneeRenouvellement} an(s), vous économisez CHF ${(economie * anneeRenouvellement).toFixed(2)} grâce au rabais familial !`,
    '',
    `Merci de nous faire confiance pour la gestion de vos assurances.`,
    `L'équipe WIN WIN Finance Group`,
  ].join('\n');

  console.log('📄 DESCRIPTION DE LA FACTURE DE RENOUVELLEMENT:');
  console.log('┌' + '─'.repeat(78) + '┐');
  descriptionDetaillée.split('\n').forEach(line => {
    console.log('│ ' + line.padEnd(77) + '│');
  });
  console.log('└' + '─'.repeat(78) + '┘');
  console.log('');

  // Récupérer le produit Stripe pour "Particulier > 22 ans"
  const priceId = 'price_1STlgKDevWYEIiJ8ExMQznN7';
  
  console.log('🔧 Récupération du produit Stripe...');
  
  const originalPrice = await stripe.prices.retrieve(priceId, {
    expand: ['product'],
  });
  
  const product = originalPrice.product as any;
  console.log(`✅ Produit: ${product.name}`);
  console.log('');

  // Créer le produit personnalisé pour le renouvellement
  console.log('🔧 Création du produit de renouvellement...');
  
  const customProduct = await stripe.products.create({
    name: `${product.name} - Renouvellement Année ${anneeRenouvellement} - Rabais Familial ${rabais}%`,
    description: descriptionDetaillée,
    metadata: {
      originalProductId: product.id,
      originalPriceId: priceId,
      groupeFamilial: groupeFamilial,
      familyMembersCount: nbMembres.toString(),
      familyDiscount: rabais.toString(),
      basePrice: prixBase.toString(),
      finalPrice: prixFinal.toString(),
      renewalYear: anneeRenouvellement.toString(),
      customerSince: dateInscription,
      totalSavings: (economie * anneeRenouvellement).toFixed(2),
    },
  });

  console.log('✅ Produit de renouvellement créé');
  console.log(`   ID: ${customProduct.id}`);
  console.log(`   Nom: ${customProduct.name}`);
  console.log('');

  // Créer le Price
  console.log('🔧 Création du Price...');
  
  const customPrice = await stripe.prices.create({
    currency: 'chf',
    unit_amount: Math.round(prixFinal * 100),
    recurring: {
      interval: 'year',
    },
    product: customProduct.id,
  });

  console.log('✅ Price créé');
  console.log(`   ID: ${customPrice.id}`);
  console.log(`   Montant: ${customPrice.unit_amount! / 100} CHF/an`);
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
    customer_email: clientEmail,
    success_url: 'https://winwin.swiss/merci?session_id={CHECKOUT_SESSION_ID}&renewal=true',
    cancel_url: 'https://winwin.swiss/espace-client',
    metadata: {
      clientName: clientName,
      clientEmail: clientEmail,
      groupeFamilial: groupeFamilial,
      familyMembersCount: nbMembres.toString(),
      familyDiscount: rabais.toString(),
      basePrice: prixBase.toString(),
      finalPrice: prixFinal.toString(),
      familyMembersList: membersList,
      renewalYear: anneeRenouvellement.toString(),
      customerSince: dateInscription,
      isRenewal: 'true',
    },
  });

  console.log('✅ Session Checkout créée avec succès !');
  console.log(`   Session ID: ${session.id}`);
  console.log('');

  console.log('='.repeat(80));
  console.log('✅ TEST RENOUVELLEMENT TERMINÉ AVEC SUCCÈS');
  console.log('='.repeat(80));
  console.log('');
  console.log('🌐 LIEN DE PAIEMENT POUR LE RENOUVELLEMENT:');
  console.log('');
  console.log(`   ${session.url}`);
  console.log('');
  console.log('📋 CE QUE VOUS VERREZ SUR LA FACTURE STRIPE:');
  console.log(`   ✅ Titre: "Renouvellement Année ${anneeRenouvellement} - Rabais Familial ${rabais}%"`);
  console.log(`   ✅ Prix: ${prixFinal} CHF/an (rabais maintenu)`);
  console.log('   ✅ Message de remerciement pour la fidélité');
  console.log(`   ✅ Rappel: Client depuis ${dateInscription}`);
  console.log(`   ✅ Économie totale: CHF ${(economie * anneeRenouvellement).toFixed(2)} sur ${anneeRenouvellement} an(s)`);
  console.log('   ✅ Liste des 12 membres du groupe familial');
  console.log('');
  console.log('📧 EMAIL STRIPE:');
  console.log(`   Un email sera envoyé à ${clientEmail}`);
  console.log('   avec le lien de paiement pour le renouvellement');
  console.log('');
  console.log('⚠️  NETTOYAGE (après test):');
  console.log(`   1. Annuler la session si non utilisée`);
  console.log(`   2. Supprimer le produit: ${customProduct.id}`);
  console.log(`   3. Supprimer le price: ${customPrice.id}`);
  console.log('');
}

main().catch(error => {
  console.error('❌ ERREUR:', error.message);
  process.exit(1);
});
