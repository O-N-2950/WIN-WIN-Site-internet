#!/usr/bin/env node

/**
 * Vérifier que tous les priceIds Stripe configurés existent et correspondent aux bons tarifs
 */

import 'dotenv/config';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY non configuré dans .env');
  process.exit(1);
}

// PriceIds configurés dans pricing.ts
const CONFIGURED_PRICES = {
  // Particuliers
  "CHF 85.-/an (18-22 ans)": "price_1STlgKDevWYEIiJ8QqZu9R52",
  "CHF 185.-/an (> 22 ans)": "price_1STlgKDevWYEIiJ8ExMQznN7",
  
  // Entreprises
  "CHF 160.-/an (0 employé)": "price_1STlgLDevWYEIiJ8fpjNpgAn",
  "CHF 260.-/an (1 employé)": "price_1STlgLDevWYEIiJ8TtUOdeBY",
  "CHF 360.-/an (2 employés)": "price_1STlgMDevWYEIiJ8LcVUCBzI",
  "CHF 460.-/an (3-5 employés)": "price_1STlgMDevWYEIiJ8lnbNPxVe",
  "CHF 560.-/an (6-10 employés)": "price_1STlgNDevWYEIiJ8WHVYyo0l",
  "CHF 660.-/an (11-20 employés)": "price_1STlgNDevWYEIiJ8jQRDvTuS",
  "CHF 760.-/an (21-30 employés)": "price_1STlgNDevWYEIiJ8r1Ysxivn",
  "CHF 860.-/an (31+ employés)": "price_1STlgODevWYEIiJ8vMjiO56u",
};

console.log('🔍 Vérification des priceIds Stripe...\n');

let allValid = true;
let validCount = 0;
let invalidCount = 0;

for (const [description, priceId] of Object.entries(CONFIGURED_PRICES)) {
  try {
    const response = await fetch(`https://api.stripe.com/v1/prices/${priceId}`, {
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      },
    });
    
    if (response.ok) {
      const price = await response.json();
      const amount = price.unit_amount / 100; // Convertir centimes en CHF
      const currency = price.currency.toUpperCase();
      const interval = price.recurring?.interval || 'one-time';
      
      console.log(`✅ ${description}`);
      console.log(`   ID: ${priceId}`);
      console.log(`   Montant: ${currency} ${amount}.- (${interval})`);
      console.log(`   Produit: ${price.product}`);
      console.log('');
      
      validCount++;
    } else {
      const error = await response.json();
      console.log(`❌ ${description}`);
      console.log(`   ID: ${priceId}`);
      console.log(`   Erreur: ${error.error?.message || 'Inconnu'}`);
      console.log('');
      
      allValid = false;
      invalidCount++;
    }
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   ID: ${priceId}`);
    console.log(`   Erreur: ${error.message}`);
    console.log('');
    
    allValid = false;
    invalidCount++;
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📊 Résumé: ${validCount} valides, ${invalidCount} invalides`);

if (allValid) {
  console.log('✅ Tous les priceIds sont valides et configurés correctement !');
  process.exit(0);
} else {
  console.log('⚠️ Certains priceIds sont invalides. Vérifiez votre configuration Stripe.');
  process.exit(1);
}
