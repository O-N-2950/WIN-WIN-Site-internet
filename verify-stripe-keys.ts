/**
 * Script pour vérifier les clés API Stripe et leur validité
 */

import Stripe from 'stripe';
import { ENV } from './server/_core/env';

async function main() {
  console.log('='.repeat(80));
  console.log('🔍 VÉRIFICATION COMPLÈTE DES CLÉS STRIPE');
  console.log('='.repeat(80));
  console.log('');

  // 1. Vérifier les clés configurées
  console.log('📋 CLÉS CONFIGURÉES:');
  console.log(`   Secret Key: ${ENV.stripeSecretKey.substring(0, 20)}...`);
  console.log(`   Publishable Key: ${ENV.stripePublishableKey?.substring(0, 20) || 'Non configurée'}...`);
  console.log(`   Webhook Secret: ${ENV.stripeWebhookSecret?.substring(0, 20) || 'Non configuré'}...`);
  console.log('');

  // 2. Déterminer le mode
  const isTestMode = ENV.stripeSecretKey.startsWith('sk_test_');
  const isLiveMode = ENV.stripeSecretKey.startsWith('sk_live_');
  
  console.log('🔑 MODE STRIPE:');
  if (isTestMode) {
    console.log('   ✅ Mode TEST (développement)');
  } else if (isLiveMode) {
    console.log('   ⚠️  Mode LIVE (production)');
  } else {
    console.log('   ❌ Mode inconnu - clé invalide?');
  }
  console.log('');

  // 3. Tester la connexion à l'API Stripe
  console.log('🔌 TEST DE CONNEXION API:');
  try {
    const stripe = new Stripe(ENV.stripeSecretKey, {
      apiVersion: '2025-10-29.clover',
    });

    // Récupérer les infos du compte
    const account = await stripe.accounts.retrieve();
    
    console.log('   ✅ Connexion réussie !');
    console.log(`   Account ID: ${account.id}`);
    console.log(`   Email: ${account.email || 'Non configuré'}`);
    console.log(`   Pays: ${account.country}`);
    console.log(`   Charges activées: ${account.charges_enabled ? 'OUI ✅' : 'NON ❌'}`);
    console.log(`   Payouts activés: ${account.payouts_enabled ? 'OUI ✅' : 'NON ❌'}`);
    console.log(`   Détails soumis: ${account.details_submitted ? 'OUI ✅' : 'NON ❌'}`);
    console.log('');

    // 4. Vérifier les capacités
    console.log('⚡ CAPACITÉS DU COMPTE:');
    if (account.charges_enabled) {
      console.log('   ✅ Peut accepter des paiements');
    } else {
      console.log('   ❌ Ne peut PAS encore accepter des paiements');
      console.log('   → Le compte doit être activé dans le dashboard Stripe');
    }
    
    if (account.payouts_enabled) {
      console.log('   ✅ Peut recevoir des virements');
    } else {
      console.log('   ❌ Ne peut PAS encore recevoir des virements');
    }
    console.log('');

    // 5. Tester la création d'un produit
    console.log('🧪 TEST CRÉATION PRODUIT:');
    try {
      const testProduct = await stripe.products.create({
        name: 'Test Diagnostic - À supprimer',
        description: 'Produit de test pour vérifier les permissions API',
      });
      
      console.log('   ✅ Création de produit: OK');
      console.log(`   Produit créé: ${testProduct.id}`);
      
      // Supprimer le produit de test
      await stripe.products.del(testProduct.id);
      console.log('   ✅ Suppression de produit: OK');
    } catch (error: any) {
      console.log('   ❌ Erreur:', error.message);
    }
    console.log('');

    // 6. Tester la création d'un price
    console.log('🧪 TEST CRÉATION PRICE:');
    try {
      const testProduct2 = await stripe.products.create({
        name: 'Test Price - À supprimer',
      });
      
      const testPrice = await stripe.prices.create({
        currency: 'chf',
        unit_amount: 14800,
        product: testProduct2.id,
      });
      
      console.log('   ✅ Création de price: OK');
      console.log(`   Price créé: ${testPrice.id}`);
      
      // Nettoyage
      await stripe.products.del(testProduct2.id);
      console.log('   ✅ Nettoyage: OK');
    } catch (error: any) {
      console.log('   ❌ Erreur:', error.message);
    }
    console.log('');

    // 7. Tester la création d'une session Checkout
    console.log('🧪 TEST CRÉATION SESSION CHECKOUT:');
    try {
      const testSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'chf',
              product_data: {
                name: 'Test Checkout',
              },
              unit_amount: 14800,
            },
            quantity: 1,
          },
        ],
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      });
      
      console.log('   ✅ Création de session: OK');
      console.log(`   Session ID: ${testSession.id}`);
      console.log(`   Status: ${testSession.status}`);
      console.log(`   URL valide: ${testSession.url ? 'OUI ✅' : 'NON ❌'}`);
      
      if (testSession.url) {
        console.log('');
        console.log('   🌐 LIEN DE TEST FONCTIONNEL:');
        console.log(`   ${testSession.url}`);
      }
    } catch (error: any) {
      console.log('   ❌ Erreur:', error.message);
    }
    console.log('');

    // 8. Conclusion
    console.log('='.repeat(80));
    console.log('📊 RÉSUMÉ:');
    console.log('='.repeat(80));
    
    if (account.charges_enabled && account.details_submitted) {
      console.log('✅ TOUT FONCTIONNE ! Votre compte Stripe est prêt pour les paiements.');
    } else if (!account.charges_enabled) {
      console.log('⚠️  COMPTE NON ACTIVÉ:');
      console.log('   Le compte Stripe doit être activé pour accepter des paiements.');
      console.log('   Actions requises:');
      console.log('   1. Connectez-vous au dashboard Stripe');
      console.log('   2. Complétez les informations du compte');
      console.log('   3. Activez les paiements');
      if (isTestMode) {
        console.log('   4. En mode TEST, claimez le sandbox si nécessaire');
      }
    }
    console.log('');

  } catch (error: any) {
    console.log('   ❌ ERREUR DE CONNEXION:', error.message);
    console.log('');
    console.log('   Causes possibles:');
    console.log('   - Clé API invalide');
    console.log('   - Clé API révoquée');
    console.log('   - Problème de réseau');
    console.log('');
  }
}

main().catch(error => {
  console.error('❌ ERREUR FATALE:', error.message);
  process.exit(1);
});
