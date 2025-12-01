import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover',
});

async function listAllPrices() {
  console.log('🔍 Récupération de tous les Price IDs Stripe...\n');
  
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
    });
    
    console.log(`✅ ${prices.data.length} prix trouvés :\n`);
    
    prices.data.forEach((price) => {
      const amount = price.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A';
      const currency = price.currency.toUpperCase();
      const interval = price.recurring?.interval || 'one-time';
      const productId = price.product;
      
      console.log(`📌 Price ID: ${price.id}`);
      console.log(`   Montant: ${amount} ${currency}`);
      console.log(`   Récurrence: ${interval}`);
      console.log(`   Product ID: ${productId}`);
      console.log(`   Actif: ${price.active}`);
      console.log('');
    });
    
    // Grouper par montant pour faciliter le mapping
    console.log('\n📊 Groupement par montant annuel (CHF) :\n');
    
    const pricesByAmount = {};
    prices.data.forEach((price) => {
      if (price.currency === 'chf' && price.recurring?.interval === 'year') {
        const amount = price.unit_amount / 100;
        if (!pricesByAmount[amount]) {
          pricesByAmount[amount] = [];
        }
        pricesByAmount[amount].push(price.id);
      }
    });
    
    Object.keys(pricesByAmount).sort((a, b) => a - b).forEach((amount) => {
      console.log(`CHF ${amount}.- /an : ${pricesByAmount[amount].join(', ')}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

listAllPrices();
