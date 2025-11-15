/**
 * Script pour créer les produits Stripe pour WIN WIN Finance Group
 * Usage: node scripts/create-stripe-products.mjs
 */

import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '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';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Produits à créer dans Stripe
 */
const PRODUCTS = [
  // Particuliers
  {
    name: 'Mandat de Gestion Annuel - Particulier 18-22 ans',
    description: 'Mandat de gestion annuel pour particuliers de 18 à 22 ans',
    price: 8500, // 85.00 CHF en centimes
    currency: 'chf',
    key: 'particulier_18_22',
  },
  {
    name: 'Mandat de Gestion Annuel - Particulier > 22 ans',
    description: 'Mandat de gestion annuel pour particuliers de plus de 22 ans',
    price: 18500, // 185.00 CHF en centimes
    currency: 'chf',
    key: 'particulier_over_22',
  },
  
  // Entreprises
  {
    name: 'Mandat de Gestion Annuel - Entreprise 0 employé',
    description: 'Mandat de gestion annuel pour entreprises sans employé',
    price: 16000, // 160.00 CHF
    currency: 'chf',
    key: 'entreprise_0',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 1 employé',
    description: 'Mandat de gestion annuel pour entreprises avec 1 employé',
    price: 26000, // 260.00 CHF
    currency: 'chf',
    key: 'entreprise_1',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 2 employés',
    description: 'Mandat de gestion annuel pour entreprises avec 2 employés',
    price: 36000, // 360.00 CHF
    currency: 'chf',
    key: 'entreprise_2',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 3-5 employés',
    description: 'Mandat de gestion annuel pour entreprises avec 3 à 5 employés',
    price: 46000, // 460.00 CHF
    currency: 'chf',
    key: 'entreprise_3_5',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 6-10 employés',
    description: 'Mandat de gestion annuel pour entreprises avec 6 à 10 employés',
    price: 56000, // 560.00 CHF
    currency: 'chf',
    key: 'entreprise_6_10',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 11-20 employés',
    description: 'Mandat de gestion annuel pour entreprises avec 11 à 20 employés',
    price: 66000, // 660.00 CHF
    currency: 'chf',
    key: 'entreprise_11_20',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 21-30 employés',
    description: 'Mandat de gestion annuel pour entreprises avec 21 à 30 employés',
    price: 76000, // 760.00 CHF
    currency: 'chf',
    key: 'entreprise_21_30',
  },
  {
    name: 'Mandat de Gestion Annuel - Entreprise 31+ employés',
    description: 'Mandat de gestion annuel pour entreprises avec 31 employés ou plus',
    price: 86000, // 860.00 CHF
    currency: 'chf',
    key: 'entreprise_31_plus',
  },
];

async function createProducts() {
  console.log('🚀 Création des produits Stripe pour WIN WIN Finance Group...\n');
  
  const results = [];
  
  for (const productData of PRODUCTS) {
    try {
      console.log(`📦 Création du produit: ${productData.name}`);
      
      // Créer le produit
      const product = await stripe.products.create({
        name: productData.name,
        description: productData.description,
        metadata: {
          key: productData.key,
          company: 'WIN WIN Finance Group',
        },
      });
      
      console.log(`   ✅ Produit créé: ${product.id}`);
      
      // Créer le prix
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: productData.price,
        currency: productData.currency,
        recurring: {
          interval: 'year',
        },
        metadata: {
          key: productData.key,
        },
      });
      
      console.log(`   ✅ Prix créé: ${price.id}`);
      console.log(`   💰 Montant: ${productData.price / 100} ${productData.currency.toUpperCase()}/an\n`);
      
      results.push({
        key: productData.key,
        productId: product.id,
        priceId: price.id,
        amount: productData.price / 100,
        currency: productData.currency,
      });
    } catch (error) {
      console.error(`   ❌ Erreur lors de la création de ${productData.name}:`, error.message);
    }
  }
  
  console.log('\n✅ Création terminée!\n');
  console.log('📋 Résumé des IDs créés:\n');
  console.log('Copiez ces IDs dans server/pricing.ts:\n');
  console.log('const STRIPE_PRICE_IDS: Record<string, string> = {');
  results.forEach(r => {
    console.log(`  "${r.key}": "${r.priceId}",`);
  });
  console.log('};\n');
  
  // Sauvegarder dans un fichier JSON
  const fs = await import('fs');
  fs.writeFileSync(
    '/home/ubuntu/winwin-website/stripe-products.json',
    JSON.stringify(results, null, 2)
  );
  console.log('💾 IDs sauvegardés dans stripe-products.json');
}

createProducts().catch(console.error);
