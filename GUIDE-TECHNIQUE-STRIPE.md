# 🔧 Guide Technique - Système de Paiement Stripe

**WIN WIN Finance Group - Documentation Développeur**

---

## 📐 Architecture du Système

### Vue d'ensemble

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │
       │ 1. Remplit formulaire
       ↓
┌─────────────────────┐
│   Frontend React    │
│  (questionnaire)    │
└──────┬──────────────┘
       │
       │ 2. Appel tRPC: createCheckoutSession
       ↓
┌─────────────────────┐
│   Backend Express   │
│  (workflow.ts)      │
└──────┬──────────────┘
       │
       │ 3. Récupère données Airtable
       │    (groupe familial, rabais)
       ↓
┌─────────────────────┐
│     Airtable API    │
│  (CRM clients)      │
└──────┬──────────────┘
       │
       │ 4. Calcule prix final
       ↓
┌─────────────────────┐
│     Stripe API      │
│  (create session)   │
└──────┬──────────────┘
       │
       │ 5. Retourne URL paiement
       ↓
┌─────────────┐
│   Client    │
│  (paie)     │
└──────┬──────┘
       │
       │ 6. Paiement réussi
       ↓
┌─────────────────────┐
│  Stripe Webhook     │
│  (invoice.payment_  │
│   succeeded)        │
└──────┬──────────────┘
       │
       │ 7. Met à jour Airtable
       ↓
┌─────────────────────┐
│     Airtable API    │
│  (sync paiement)    │
└─────────────────────┘
```

---

## 📁 Structure des Fichiers

### Fichiers principaux

```
server/
├── airtable-config.ts           # Configuration Field IDs Airtable
├── airtable-crm.ts              # Fonctions CRUD Airtable
├── lib/
│   ├── stripe-payment.ts        # Création sessions Stripe
│   ├── stripe-webhooks.ts       # Traitement webhooks
│   ├── billing.ts               # Facturation récurrente
│   └── parrainage.ts            # Calcul rabais familiaux
├── routers/
│   └── workflow.ts              # Router tRPC (API)
└── __tests__/
    └── stripe-billing.test.ts   # Tests unitaires
```

---

## 🔑 Configuration Airtable

### Field IDs Stripe

**Fichier :** `server/airtable-config.ts`

```typescript
export const AIRTABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tables: {
    clients: {
      id: 'tblWPcIpGmBZ3ASGI',
      fields: {
        // Champs Stripe
        stripeSubscriptionId: 'fldocAjdGomXPRQeU',
        dateProchaineFact: 'fld3VBfm8vhkawBCo',
        statutPaiement: 'fldaFF7mU0FwNshw7',
        dateDernierPaiement: 'fldrg5f0BD3np8Mug',
        stripeInvoiceId: 'fldMn8zMy3lQNWF0e',
        dateDerniereFacture: 'fldq2bsTMuxynxVHj',
      },
    },
  },
};
```

### Formule Airtable

**Date prochaine facturation** (calculée automatiquement) :

```
IF(
  AND(
    {Statut du client} = 'Actif',
    {date dernière facture établie}
  ),
  DATEADD({date dernière facture établie}, 360, 'days'),
  ''
)
```

---

## 💳 Création de Session de Paiement

### Workflow complet

**Fichier :** `server/routers/workflow.ts`

```typescript
// 1. Récupérer les données du client depuis Airtable
const clientData = await getClientById(input.clientId);

// 2. Calculer le rabais familial
const groupeFamilial = clientData['Groupe Familial'];
const familyMembersCount = clientData['Nb membres famille actifs'];
const familyDiscount = calculateFamilyDiscount(familyMembersCount);

// 3. Appliquer le rabais
const prixBase = input.annualPrice;
const prixFinal = applyFamilyDiscount(prixBase, familyDiscount);

// 4. Créer un Price ID dynamique avec le prix final
const customPrice = await stripe.prices.create({
  currency: 'chf',
  unit_amount: Math.round(prixFinal * 100), // Centimes
  recurring: { interval: 'year' },
  product_data: {
    name: `Mandat de Gestion - Rabais ${familyDiscount}%`,
    description: descriptionDetaillée,
  },
});

// 5. Créer la session Stripe
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: customPrice.id, quantity: 1 }],
  customer_email: input.clientEmail,
  metadata: {
    clientId: input.clientId,
    groupeFamilial,
    familyDiscount,
    prixFinal,
  },
});
```

### Calcul du rabais familial

**Fichier :** `server/lib/parrainage.ts`

```typescript
export function calculateFamilyDiscount(membersCount: number): number {
  if (membersCount <= 1) return 0;
  
  // 2% par membre, max 20%
  const discount = (membersCount - 1) * 2;
  return Math.min(discount, 20);
}

export function applyFamilyDiscount(
  basePrice: number,
  discountPercent: number
): number {
  return basePrice * (1 - discountPercent / 100);
}
```

**Exemples :**

| Membres | Rabais | Prix base | Prix final |
|---------|--------|-----------|------------|
| 1       | 0%     | 185 CHF   | 185 CHF    |
| 2       | 2%     | 185 CHF   | 181.30 CHF |
| 5       | 8%     | 185 CHF   | 170.20 CHF |
| 10      | 18%    | 185 CHF   | 151.70 CHF |
| 12+     | 20%    | 185 CHF   | 148 CHF    |

---

## 🔔 Webhooks Stripe

### Configuration

**Endpoint :** `https://www.winwin.swiss/api/stripe/webhook`

**Événements écoutés :**
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `invoice.payment_action_required`

### Traitement des événements

**Fichier :** `server/lib/stripe-webhooks.ts`

```typescript
export async function processStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
      
    case 'invoice.payment_action_required':
      await handlePaymentActionRequired(event.data.object);
      break;
  }
}
```

### Synchronisation Airtable

```typescript
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  const today = new Date();
  const nextBillingDate = new Date(today);
  nextBillingDate.setDate(nextBillingDate.getDate() + 360);
  
  await updateClientAfterPayment({
    email: invoice.customer_email,
    statutPaiement: 'Payé',
    dateDernierPaiement: today.toISOString().split('T')[0],
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: subscriptionId,
    dateDerniereFacture: today.toISOString().split('T')[0],
    dateProchaineFact: nextBillingDate.toISOString().split('T')[0],
  });
}
```

---

## 🔄 Facturation Récurrente

### Cycle de 360 jours

**Pourquoi 360 jours ?**
- Demande spécifique du client
- Simplifie la comptabilité (12 mois × 30 jours)
- Différence de 5 jours par rapport à 365 jours

### Fonction principale

**Fichier :** `server/lib/billing.ts`

```typescript
export async function processDailyBilling(): Promise<{
  success: boolean;
  clientsProcessed: number;
  invoicesCreated: number;
  errors: string[];
}> {
  // 1. Récupérer les clients à facturer aujourd'hui
  const clients = await getClientsToBillToday();
  
  // 2. Créer une facture pour chaque client
  for (const client of clients) {
    // Skip si "Mandat offert"
    if (client.tarifApplicable === 0) continue;
    
    // Créer la facture Stripe
    await createInvoiceForClient(client);
    
    // Mettre à jour Airtable
    await updateNextBillingDate(client.recordId, invoiceId);
  }
  
  return result;
}
```

### Requête Airtable

```typescript
async function getClientsToBillToday(): Promise<ClientToBill[]> {
  const today = new Date().toISOString().split('T')[0];
  
  // Formule Airtable
  const formula = `{Date prochaine facturation}='${today}'`;
  
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${encodeURIComponent(formula)}`;
  
  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${AIRTABLE_API_KEY}` },
  });
  
  return response.json().then(r => r.records);
}
```

### Cron Job

**Fréquence :** Quotidien à 9h00 CET

**Configuration Railway :**

```bash
# Ajouter dans railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "pnpm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "cron": [
    {
      "schedule": "0 9 * * *",
      "command": "node -e \"import('./server/lib/billing.js').then(m => m.processDailyBilling())\""
    }
  ]
}
```

---

## 🧪 Tests

### Exécuter les tests

```bash
# Tous les tests
pnpm test

# Tests Stripe uniquement
pnpm test server/__tests__/stripe-billing.test.ts
```

### Tests disponibles

**Fichier :** `server/__tests__/stripe-billing.test.ts`

1. ✅ Configuration Airtable (Field IDs)
2. ✅ Module stripe-payment.ts
3. ✅ Module stripe-webhooks.ts
4. ✅ Module billing.ts
5. ✅ Module airtable-crm.ts
6. ✅ Workflow complet
7. ✅ Cycle de facturation (360 jours)

### Exemple de test

```typescript
it('devrait calculer correctement +360 jours', () => {
  const today = new Date('2024-01-01');
  const nextBillingDate = new Date(today);
  nextBillingDate.setDate(nextBillingDate.getDate() + 360);
  
  expect(nextBillingDate.toISOString().split('T')[0])
    .toBe('2024-12-26');
});
```

---

## 🐛 Debugging

### Logs Stripe

```typescript
console.log('[Stripe Payment] Session créée:', {
  sessionId: session.id,
  clientId: data.clientId,
  prixFinal: data.prixFinal,
  rabaisFamilial: data.rabaisFamilial,
});
```

### Logs Webhook

```typescript
console.log('[Stripe Webhook] Paiement réussi:', invoice.id);
console.log('[Stripe Webhook] Client mis à jour:', clientEmail);
```

### Logs Billing

```typescript
console.log('[Billing] ${clients.length} client(s) à facturer aujourd'hui');
console.log('[Billing] ✅ Facture créée pour ${client.email}');
```

### Vérifier les logs Railway

```bash
railway logs --tail 100
```

---

## 🔐 Sécurité

### Variables d'environnement

```env
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Airtable
AIRTABLE_API_KEY=key...
```

### Vérification signature webhook

```typescript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

---

## 📊 Métriques

### Données trackées

1. **Stripe Dashboard** :
   - Revenus mensuels
   - Taux de réussite paiements
   - Clients actifs

2. **Airtable** :
   - Nombre de clients actifs
   - Montant total facturé
   - Taux de rabais moyen

3. **Logs** :
   - Temps de réponse API
   - Erreurs webhook
   - Factures créées quotidiennement

---

## 🚀 Déploiement

### Railway

```bash
# Push vers GitHub
git push origin main

# Railway déploie automatiquement
# URL: https://www.winwin.swiss
```

### Vérifier le déploiement

```bash
# Health check
curl https://www.winwin.swiss/api/health

# Webhook endpoint
curl https://www.winwin.swiss/api/stripe/webhook
```

---

## 📚 Ressources

### Documentation externe

- [Stripe API](https://stripe.com/docs/api)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Airtable API](https://airtable.com/developers/web/api/introduction)
- [tRPC](https://trpc.io/docs)

### Code source

- [GitHub Repository](https://github.com/O-N-2950/WIN-WIN-Site-internet)

---

**Document créé le :** 04 décembre 2025  
**Version :** 1.0  
**Auteur :** Manus AI pour WIN WIN Finance Group
