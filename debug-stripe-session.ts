/**
 * Script pour diagnostiquer le problème avec la session Stripe
 */

import Stripe from 'stripe';
import { ENV } from './server/_core/env';

async function main() {
  const stripe = new Stripe(ENV.stripeSecretKey, {
    apiVersion: '2025-10-29.clover',
  });

  console.log('🔍 DIAGNOSTIC STRIPE');
  console.log('='.repeat(80));
  console.log('');

  // Vérifier la clé API
  console.log('🔑 Clé API Stripe:');
  console.log(`   Commence par: ${ENV.stripeSecretKey.substring(0, 15)}...`);
  console.log(`   Mode: ${ENV.stripeSecretKey.startsWith('sk_test_') ? 'TEST' : 'LIVE'}`);
  console.log('');

  // Lister les sessions récentes
  console.log('📋 Sessions Checkout récentes:');
  const sessions = await stripe.checkout.sessions.list({
    limit: 5,
  });

  if (sessions.data.length === 0) {
    console.log('   ❌ Aucune session trouvée');
  } else {
    for (const session of sessions.data) {
      console.log(`   Session: ${session.id}`);
      console.log(`   Status: ${session.status}`);
      console.log(`   Email: ${session.customer_email}`);
      console.log(`   URL: ${session.url}`);
      console.log(`   Créée: ${new Date(session.created * 1000).toLocaleString()}`);
      console.log(`   Expire: ${session.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'N/A'}`);
      console.log('');
    }
  }

  // Vérifier les produits récents
  console.log('📦 Produits récents:');
  const products = await stripe.products.list({
    limit: 3,
  });

  for (const product of products.data) {
    console.log(`   Produit: ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Description: ${product.description?.substring(0, 100)}...`);
    console.log('');
  }

  // Créer une session de test simple
  console.log('🧪 Test de création session simple...');
  
  try {
    const testSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'chf',
            product_data: {
              name: 'Test Simple',
            },
            unit_amount: 14800, // 148 CHF
          },
          quantity: 1,
        },
      ],
      customer_email: 'olivier.neukomm@bluewin.ch',
      success_url: 'https://winwin.swiss/success',
      cancel_url: 'https://winwin.swiss/cancel',
    });

    console.log('✅ Session test créée avec succès !');
    console.log(`   ID: ${testSession.id}`);
    console.log(`   URL: ${testSession.url}`);
    console.log(`   Status: ${testSession.status}`);
    console.log('');
    console.log('🌐 TESTEZ CE LIEN:');
    console.log(`   ${testSession.url}`);
  } catch (error: any) {
    console.log('❌ Erreur lors de la création:', error.message);
  }
}

main().catch(error => {
  console.error('❌ ERREUR:', error.message);
  process.exit(1);
});
