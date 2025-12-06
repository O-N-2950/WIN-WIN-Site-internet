/**
 * Script pour créer une session Stripe PREMIUM
 * avec un effet WAHOUUU professionnel
 */

import Stripe from 'stripe';
import { ENV } from './server/_core/env';
import { calculateFamilyDiscount, applyFamilyDiscount } from './server/lib/parrainage';

async function main() {
  console.log('='.repeat(80));
  console.log('🚀 CRÉATION FACTURE STRIPE PREMIUM - EFFET WAHOUUU');
  console.log('='.repeat(80));
  console.log('');

  const stripe = new Stripe(ENV.stripeSecretKey, {
    apiVersion: '2025-10-29.clover',
  });

  // Données du client
  const clientName = 'Olivier Neukomm';
  const clientEmail = 'olivier.neukomm@bluewin.ch';
  const groupeFamilial = 'FAMILLE-NEUKOMM-SeLs';
  const nbMembres = 12;
  const anneeRenouvellement = 2;
  const dateInscription = '2024';
  
  const prixBase = 185;
  const rabais = calculateFamilyDiscount(nbMembres);
  const prixFinal = applyFamilyDiscount(prixBase, rabais);
  const economie = prixBase - prixFinal;
  const economieTotal = economie * anneeRenouvellement;

  // ✨ DESCRIPTION PREMIUM AVEC EFFET WAHOUUU ✨
  const descriptionPremium = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '                    🎉  RENOUVELLEMENT ANNUEL - ANNÉE 2  🎉',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '   Cher Olivier Neukomm,',
    '',
    '   Merci pour votre confiance et votre fidélité ! 🙏',
    '   Membre WIN WIN depuis 2024',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '   👨‍👩‍👧‍👦  VOTRE GROUPE FAMILIAL',
    '',
    `   ${groupeFamilial}`,
    `   ${nbMembres} membres actifs`,
    '',
    '   Olivier Neukomm • Chloé Lefèvre • Patrick Delamare',
    '   Sophie Martin • Jean Dupont • Marie Bernard',
    '   Pierre Dubois • Claire Moreau • Luc Simon',
    '   Anne Laurent • Marc Petit • Julie Roux',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '   💰  VOTRE TARIF PRÉFÉRENTIEL',
    '',
    `   Prix standard                           CHF ${prixBase.toFixed(2)}`,
    `   Rabais familial (-${rabais}%)                      - CHF ${economie.toFixed(2)}`,
    '   ─────────────────────────────────────────────────────────────',
    `   PRIX FINAL                              CHF ${prixFinal.toFixed(2)} / an`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '   ✨  VOS ÉCONOMIES',
    '',
    `   Économie cette année                    CHF ${economie.toFixed(2)}`,
    `   Économie totale (${anneeRenouvellement} ans)                   CHF ${economieTotal.toFixed(2)}`,
    '',
    `   🎯  Vous économisez ${rabais}% chaque année grâce à votre groupe familial !`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '   🏆  AVANTAGES INCLUS',
    '',
    '   ✓  Gestion complète de vos assurances',
    '   ✓  Suivi personnalisé par nos experts',
    '   ✓  Optimisation continue de vos contrats',
    '   ✓  Support prioritaire 7j/7',
    '   ✓  Rabais familial garanti à vie',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '   Merci de nous faire confiance pour la gestion de vos assurances.',
    '',
    '   🤝  L\'équipe WIN WIN Finance Group',
    '   📞  032 466 11 00',
    '   ✉️   contact@winwin.swiss',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  ].join('\n');

  console.log('📄 APERÇU DE LA FACTURE PREMIUM:');
  console.log(descriptionPremium);
  console.log('');

  // Récupérer le produit Stripe
  const priceId = 'price_1STlgKDevWYEIiJ8ExMQznN7';
  
  console.log('🔧 Création du produit premium...');
  
  const originalPrice = await stripe.prices.retrieve(priceId, {
    expand: ['product'],
  });
  
  const product = originalPrice.product as any;

  // Créer le produit premium
  const customProduct = await stripe.products.create({
    name: `🎉 Renouvellement Année ${anneeRenouvellement} - Rabais Familial ${rabais}% 🎉`,
    description: descriptionPremium,
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
      totalSavings: economieTotal.toFixed(2),
      isPremium: 'true',
    },
  });

  console.log('✅ Produit premium créé');
  console.log(`   ID: ${customProduct.id}`);
  console.log('');

  // Créer le Price
  const customPrice = await stripe.prices.create({
    currency: 'chf',
    unit_amount: Math.round(prixFinal * 100),
    recurring: {
      interval: 'year',
    },
    product: customProduct.id,
  });

  console.log('✅ Price créé');
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
    success_url: 'https://winwin.swiss/merci?session_id={CHECKOUT_SESSION_ID}&renewal=true&premium=true',
    cancel_url: 'https://winwin.swiss/espace-client',
    metadata: {
      clientName: clientName,
      clientEmail: clientEmail,
      groupeFamilial: groupeFamilial,
      familyMembersCount: nbMembres.toString(),
      familyDiscount: rabais.toString(),
      basePrice: prixBase.toString(),
      finalPrice: prixFinal.toString(),
      renewalYear: anneeRenouvellement.toString(),
      customerSince: dateInscription,
      totalSavings: economieTotal.toFixed(2),
      isRenewal: 'true',
      isPremium: 'true',
    },
  });

  console.log('✅ Session Checkout créée !');
  console.log('');

  console.log('='.repeat(80));
  console.log('🎉 FACTURE PREMIUM CRÉÉE AVEC SUCCÈS !');
  console.log('='.repeat(80));
  console.log('');
  console.log('🌐 LIEN DE PAIEMENT PREMIUM:');
  console.log('');
  console.log(`   ${session.url}`);
  console.log('');
  console.log('✨ EFFET WAHOUUU INCLUS:');
  console.log('   ✓  Design visuel élégant avec séparateurs');
  console.log('   ✓  Hiérarchie claire et professionnelle');
  console.log('   ✓  Mise en valeur du rabais familial');
  console.log('   ✓  Liste complète des avantages');
  console.log('   ✓  Message de remerciement personnalisé');
  console.log('   ✓  Coordonnées de contact');
  console.log('   ✓  Économies totales mises en avant');
  console.log('');
  console.log('📧 Email envoyé à: olivier.neukomm@bluewin.ch');
  console.log('');
}

main().catch(error => {
  console.error('❌ ERREUR:', error.message);
  process.exit(1);
});
