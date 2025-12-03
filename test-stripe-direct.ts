/**
 * Script pour créer une session Stripe directement
 * avec les données du groupe FAMILLE-NEUKOMM-SeLs
 */

import Stripe from 'stripe';
import { ENV } from './server/_core/env';
import { calculateFamilyDiscount, applyFamilyDiscount } from './server/lib/parrainage';

async function main() {
  console.log('='.repeat(80));
  console.log('TEST STRIPE - CRÉATION FACTURE AVEC RABAIS FAMILIAL');
  console.log('='.repeat(80));
  console.log('');

  const stripe = new Stripe(ENV.stripeSecretKey, {
    apiVersion: '2025-10-29.clover',
  });

  // Données simulées du groupe FAMILLE-NEUKOMM-SeLs
  const groupeFamilial = 'FAMILLE-NEUKOMM-SeLs';
  const nbMembres = 12;
  const membersList = 'Olivier Neukomm, Chloé Lefèvre, Patrick Delamare, Sophie Martin, Jean Dupont, Marie Bernard, Pierre Dubois, Claire Moreau, Luc Simon, Anne Laurent, Marc Petit, Julie Roux';
  
  const prixBase = 185; // Particulier > 22 ans
  const rabais = calculateFamilyDiscount(nbMembres);
  const prixFinal = applyFamilyDiscount(prixBase, rabais);
  const economie = prixBase - prixFinal;

  console.log('📊 DONNÉES DU GROUPE:');
  console.log(`   Groupe: ${groupeFamilial}`);
  console.log(`   Membres actifs: ${nbMembres}`);
  console.log(`   Rabais: ${rabais}%`);
  console.log(`   Prix base: ${prixBase} CHF`);
  console.log(`   Prix final: ${prixFinal} CHF`);
  console.log(`   Économie: ${economie} CHF`);
  console.log('');

  // Construire la description détaillée
  const descriptionDetaillée = [
    `Mandat de Gestion Annuel - Marie Dubois (Test)`,
    '',
    `👥 GROUPE FAMILIAL: ${groupeFamilial}`,
    `Membres actifs (${nbMembres}): ${membersList}`,
    '',
    `💰 CALCUL DU PRIX:`,
    `Prix de base: CHF ${prixBase.toFixed(2)}`,
    `Rabais familial: -${rabais}% (${nbMembres} membres)`,
    `Économie: CHF ${economie.toFixed(2)}`,
    `Prix final: CHF ${prixFinal.toFixed(2)}`,
  ].join('\n');

  console.log('📄 DESCRIPTION DE LA FACTURE:');
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
  console.log(`   Prix original: ${originalPrice.unit_amount! / 100} CHF/an`);
  console.log('');

  // Créer d'abord le produit avec la description
  console.log('🔧 Création du produit personnalisé...');
  
  const customProduct = await stripe.products.create({
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
  });

  console.log('✅ Produit personnalisé créé');
  console.log(`   ID: ${customProduct.id}`);
  console.log(`   Nom: ${customProduct.name}`);
  console.log('');  

  // Créer le Price avec le prix final
  console.log('🔧 Création du Price avec rabais...');
  
  const customPrice = await stripe.prices.create({
    currency: 'chf',
    unit_amount: Math.round(prixFinal * 100), // Convertir en centimes
    recurring: {
      interval: 'year',
    },
    product: customProduct.id,
  });

  console.log('✅ Price personnalisé créé');
  console.log(`   ID: ${customPrice.id}`);
  console.log(`   Nom: ${customPrice.product_data?.name || 'N/A'}`);
  console.log(`   Montant: ${customPrice.unit_amount! / 100} CHF/an`);
  console.log('');

  // Créer la session Stripe
  console.log('🔧 Création de la session Checkout Stripe...');
  
  const timestamp = Date.now();
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: customPrice.id,
        quantity: 1,
      },
    ],
    customer_email: 'olivier.neukomm@bluewin.ch',
    success_url: 'https://winwin.swiss/merci?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://winwin.swiss/inscription',
    metadata: {
      clientName: 'Olivier Neukomm (Test Rabais Familial)',
      clientEmail: 'olivier.neukomm@bluewin.ch',
      groupeFamilial: groupeFamilial,
      familyMembersCount: nbMembres.toString(),
      familyDiscount: rabais.toString(),
      basePrice: prixBase.toString(),
      finalPrice: prixFinal.toString(),
      familyMembersList: membersList,
    },
  });

  console.log('✅ Session Checkout créée avec succès !');
  console.log(`   Session ID: ${session.id}`);
  console.log('');

  console.log('='.repeat(80));
  console.log('✅ TEST TERMINÉ AVEC SUCCÈS');
  console.log('='.repeat(80));
  console.log('');
  console.log('🌐 OUVRIR LA PAGE DE PAIEMENT STRIPE POUR VOIR LA FACTURE:');
  console.log('');
  console.log(`   ${session.url}`);
  console.log('');
  console.log('📋 CE QUE VOUS VERREZ SUR LA FACTURE STRIPE:');
  console.log('   ✅ Nom du produit: "Mandat de Gestion Annuel - Particulier > 22 ans - Rabais Familial 20%"');
  console.log('   ✅ Prix: 148.00 CHF/an (au lieu de 185.00 CHF)');
  console.log('   ✅ Description complète avec:');
  console.log('      - Nom du groupe familial');
  console.log('      - Liste des 12 membres actifs');
  console.log('      - Calcul détaillé du rabais');
  console.log('      - Économie réalisée (37.00 CHF)');
  console.log('');
  console.log('⚠️  NETTOYAGE (après test):');
  console.log(`   1. Annuler la session Stripe si non utilisée`);
  console.log(`   2. Supprimer le Price personnalisé: ${customPrice.id}`);
  console.log('');
}

main().catch(error => {
  console.error('❌ ERREUR:', error.message);
  process.exit(1);
});
