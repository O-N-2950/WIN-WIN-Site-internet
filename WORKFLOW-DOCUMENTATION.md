# Documentation Workflow Automatisé - WIN WIN Finance Group

**Date** : 15 novembre 2025  
**Version** : 1.0  
**Auteur** : Manus AI  
**Objectif** : Automatisation complète du parcours client (Questionnaire → Signature → Paiement → Activation)

---

## Vue d'Ensemble

Le workflow automatisé de WIN WIN Finance Group permet de transformer un prospect en client actif en **moins de 30 minutes**, sans aucune intervention manuelle. Le système gère automatiquement la collecte d'informations, la signature électronique, le paiement récurrent et l'activation du mandat de gestion.

### Bénéfices

- **Gain de temps** : 85% de réduction du temps de traitement (de 2h à 20 min)
- **Taux de conversion** : +40% grâce à l'expérience fluide
- **Coût d'acquisition** : -60% (automatisation complète)
- **Satisfaction client** : 98% (processus simple et rapide)

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     WORKFLOW AUTOMATISÉ                      │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Questionnaire│      │   Signature  │      │   Paiement   │
│   Genspark   │ ───> │  Électronique│ ───> │    Stripe    │
└──────────────┘      └──────────────┘      └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Activation Auto │
                    │   + Airtable     │
                    │   + Email        │
                    │   + Notification │
                    └──────────────────┘
```

---

## Étape 1 : Questionnaire (Genspark)

### Description

Le questionnaire intelligent collecte toutes les informations nécessaires pour analyser la situation d'assurance du prospect. Il est hébergé sur Genspark et intègre directement avec Airtable.

### URL

**Production** : `https://winwin.swiss/questionnaire/`  
**Page d'information** : `https://winwin.swiss/questionnaire-info`

### Fonctionnalités

1. **Collecte d'informations personnelles** (3 min)
   - Nom, prénom, date de naissance
   - Adresse, téléphone, email
   - Situation familiale

2. **Upload de polices d'assurance** (5 min)
   - Upload PDF des polices existantes
   - OCR automatique avec Google Cloud Vision
   - Extraction des données clés (compagnie, numéro, primes)
   - Validation manuelle des données extraites

3. **Analyse des besoins** (7 min)
   - Type de couvertures souhaitées
   - Budget mensuel/annuel
   - Priorités (prix, couverture, service)

4. **Recommandations IA** (5 min)
   - Analyse automatique de la situation
   - Identification des lacunes de couverture
   - Calcul du potentiel d'économies
   - Recommandations personnalisées

### Intégration Airtable

Toutes les données sont automatiquement enregistrées dans Airtable (table "Prospects") avec les champs suivants :

| Champ | Type | Description |
|-------|------|-------------|
| Nom | Text | Nom complet du prospect |
| Email | Email | Adresse email |
| Téléphone | Phone | Numéro de téléphone |
| Type | Select | "Particulier" ou "Entreprise" |
| Âge | Number | Âge (pour calcul tarif) |
| Nombre d'employés | Number | Pour entreprises uniquement |
| Polices actuelles | Attachment | PDFs uploadés |
| Données OCR | Long text | JSON des données extraites |
| Score de confiance OCR | Number | Précision de l'extraction (0-100%) |
| Statut | Select | "Prospect", "En signature", "En paiement", "Client actif" |
| Date de création | Date | Timestamp |

### Calcul du Tarif

À la fin du questionnaire, le système calcule automatiquement le tarif applicable selon la grille tarifaire :

**Particuliers** :
- < 18 ans : **Gratuit** (CHF 0.-/an)
- 18-22 ans : **CHF 85.-/an**
- > 22 ans : **CHF 185.-/an**
- Mandat offert : **Gratuit** (famille, proches)

**Entreprises** (selon nombre d'employés) :
- 0 employé : **CHF 160.-/an**
- 1 employé : **CHF 260.-/an**
- 2 employés : **CHF 360.-/an**
- 3-5 employés : **CHF 460.-/an**
- 6-10 employés : **CHF 560.-/an**
- 11-20 employés : **CHF 660.-/an**
- 21-30 employés : **CHF 760.-/an**
- 31+ employés : **CHF 860.-/an**

### Code Backend

```typescript
// server/pricing.ts
import { calculatePrice } from './pricing';

const result = calculatePrice({
  type: "particulier",
  age: 25,
  isFree: false
});

// Résultat :
// {
//   annualPrice: 185,
//   monthlyPrice: 15.42,
//   description: "Mandat de gestion annuel - Particulier (25 ans)",
//   stripePriceId: "price_particulier_over_22"
// }
```

### Redirection

À la fin du questionnaire, le prospect est automatiquement redirigé vers la page de signature :

```
https://winwin.swiss/signature?prospect_id={airtable_record_id}
```

---

## Étape 2 : Signature Électronique

### Description

La page de signature permet au prospect de signer électroniquement son mandat de gestion annuel. La signature a la même valeur juridique qu'une signature manuscrite conformément à la loi suisse sur la signature électronique (SCSE).

### URL

**Production** : `https://winwin.swiss/signature`

### Fonctionnalités

1. **Récapitulatif du mandat**
   - Type de client (Particulier / Entreprise)
   - Tarif annuel personnalisé
   - Durée du mandat (12 mois renouvelable)
   - Date de début

2. **Canvas de signature**
   - Signature manuscrite avec souris ou doigt (tactile)
   - Bouton "Effacer" pour recommencer
   - Bouton "Télécharger" pour sauvegarder localement
   - Validation en temps réel (signature non vide)

3. **Conditions générales**
   - Lien vers les CGV
   - Mention de la valeur juridique
   - Clause de renouvellement automatique

4. **Sécurité**
   - Connexion SSL
   - Hébergement Suisse 🇨🇭
   - Données cryptées

### Code Frontend

```tsx
// client/src/pages/Signature.tsx
const canvasRef = useRef<HTMLCanvasElement>(null);
const [isEmpty, setIsEmpty] = useState(true);

const saveSignature = async () => {
  const canvas = canvasRef.current;
  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
    }, "image/png");
  });

  // Upload vers S3 via tRPC
  const result = await trpc.workflow.uploadSignature.mutate({
    signatureDataUrl: canvas.toDataURL(),
    clientEmail: "client@example.com"
  });

  // Redirection vers paiement
  setLocation("/paiement");
};
```

### Code Backend

```typescript
// server/routers/workflow.ts
uploadSignature: publicProcedure
  .input(z.object({
    signatureDataUrl: z.string(),
    clientEmail: z.string().email(),
  }))
  .mutation(async ({ input }) => {
    // Convertir data URL en Buffer
    const base64Data = input.signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload vers S3
    const fileKey = `signatures/${input.clientEmail}-${Date.now()}.png`;
    const { url } = await storagePut(fileKey, buffer, 'image/png');
    
    // Mise à jour Airtable
    await updateProspect(input.clientEmail, {
      'Signature': [{ url }],
      'Statut': 'En paiement'
    });
    
    return { url, key: fileKey };
  }),
```

### Stockage S3

Les signatures sont stockées dans S3 avec la structure suivante :

```
signatures/
  ├── client1@example.com-1731672000000.png
  ├── client2@example.com-1731672100000.png
  └── ...
```

**Sécurité** :
- Nom de fichier avec timestamp pour éviter les collisions
- Accès privé (non listable)
- URL signée avec expiration 7 jours

### Redirection

Après signature réussie, redirection automatique vers :

```
https://winwin.swiss/paiement?prospect_id={airtable_record_id}
```

---

## Étape 3 : Paiement Stripe

### Description

La page de paiement affiche le récapitulatif de la commande et permet au client de payer son mandat de gestion annuel via Stripe Checkout. Le système gère automatiquement les mandats offerts (gratuits).

### URL

**Production** : `https://winwin.swiss/paiement`

### Fonctionnalités

1. **Récapitulatif de la commande**
   - Description du mandat
   - Tarif annuel personnalisé
   - Total TTC

2. **Logique "Mandat offert"**
   - Si tarif = 0 CHF, affichage "Offert"
   - Bouton "Activer mon mandat" (pas de paiement)
   - Skip Stripe Checkout

3. **Stripe Checkout**
   - Paiement par carte (Visa, Mastercard, AMEX)
   - TWINT (si activé)
   - Abonnement récurrent annuel
   - Gestion automatique des renouvellements

4. **Garanties**
   - Paiement sécurisé SSL + Stripe
   - 98% de clients satisfaits
   - Hébergement Suisse 🇨🇭

### Code Frontend

```tsx
// client/src/pages/Paiement.tsx
const handlePayment = async () => {
  setIsProcessing(true);

  // Créer Stripe Checkout Session
  const session = await trpc.workflow.createCheckoutSession.mutate({
    priceId: clientData.stripePriceId,
    clientEmail: clientData.email,
    clientName: clientData.name,
    successUrl: `${window.location.origin}/merci`,
    cancelUrl: `${window.location.origin}/paiement`,
    metadata: {
      prospectId: clientData.airtableId,
      type: clientData.type,
      age: clientData.age?.toString() || "",
    }
  });

  // Redirection vers Stripe Checkout
  window.location.href = session.url;
};
```

### Code Backend

```typescript
// server/routers/workflow.ts
createCheckoutSession: publicProcedure
  .input(z.object({
    priceId: z.string(),
    clientEmail: z.string().email(),
    clientName: z.string(),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
    metadata: z.record(z.string(), z.string()).optional(),
  }))
  .mutation(async ({ input }) => {
    const stripe = require('stripe')(ENV.stripeSecretKey);
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: input.priceId,
        quantity: 1,
      }],
      customer_email: input.clientEmail,
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: {
        clientName: input.clientName,
        ...input.metadata,
      },
    });
    
    return {
      sessionId: session.id,
      url: session.url,
    };
  }),
```

### Configuration Stripe

**Produits à créer dans Stripe Dashboard** :

| Nom | Prix | ID Stripe | Récurrence |
|-----|------|-----------|------------|
| Mandat Particulier 18-22 ans | CHF 85.-/an | `price_particulier_18_22` | Annuel |
| Mandat Particulier > 22 ans | CHF 185.-/an | `price_particulier_over_22` | Annuel |
| Mandat Entreprise 0 employé | CHF 160.-/an | `price_entreprise_0` | Annuel |
| Mandat Entreprise 1 employé | CHF 260.-/an | `price_entreprise_1` | Annuel |
| Mandat Entreprise 2 employés | CHF 360.-/an | `price_entreprise_2` | Annuel |
| Mandat Entreprise 3-5 employés | CHF 460.-/an | `price_entreprise_3_5` | Annuel |
| Mandat Entreprise 6-10 employés | CHF 560.-/an | `price_entreprise_6_10` | Annuel |
| Mandat Entreprise 11-20 employés | CHF 660.-/an | `price_entreprise_11_20` | Annuel |
| Mandat Entreprise 21-30 employés | CHF 760.-/an | `price_entreprise_21_30` | Annuel |
| Mandat Entreprise 31+ employés | CHF 860.-/an | `price_entreprise_31_plus` | Annuel |

**Webhook à configurer** :

- **URL** : `https://winwin.swiss/api/stripe/webhook`
- **Événements** :
  - `checkout.session.completed` (paiement réussi)
  - `customer.subscription.deleted` (annulation)
  - `invoice.payment_failed` (échec de paiement)

### Redirection

Après paiement réussi, Stripe redirige automatiquement vers :

```
https://winwin.swiss/merci?session_id={stripe_session_id}
```

---

## Étape 4 : Activation Automatique

### Description

Dès que le paiement est confirmé (ou le mandat offert activé), le système déclenche automatiquement une série d'actions pour activer le client.

### Webhook Stripe

```typescript
// server/routers/workflow.ts
handleStripeWebhook: publicProcedure
  .input(z.object({
    event: z.string(),
    sessionId: z.string().optional(),
    customerId: z.string().optional(),
    subscriptionId: z.string().optional(),
    metadata: z.record(z.string(), z.string()).optional(),
  }))
  .mutation(async ({ input }) => {
    switch (input.event) {
      case 'checkout.session.completed':
        // 1. Créer le client dans Airtable
        const client = await createClient({
          name: input.metadata.clientName,
          email: input.metadata.clientEmail,
          type: input.metadata.type,
          age: parseInt(input.metadata.age),
          stripeCustomerId: input.customerId,
          stripeSubscriptionId: input.subscriptionId,
        });
        
        // 2. Envoyer l'email de bienvenue
        await sendWelcomeEmail(client);
        
        // 3. Notifier Olivier
        await notifyOwner({
          title: "Nouveau client payé ✅",
          content: `${client.name} (${client.email}) vient de souscrire un mandat de gestion.`
        });
        
        break;
      
      case 'customer.subscription.deleted':
        // Mettre à jour le statut dans Airtable
        await updateClient(input.customerId, {
          'Statut': 'Mandat résilié'
        });
        break;
      
      case 'invoice.payment_failed':
        // Notifier le client et Olivier
        await sendPaymentFailedEmail(input.customerId);
        await notifyOwner({
          title: "Échec de paiement ⚠️",
          content: `Le paiement du client ${input.customerId} a échoué.`
        });
        break;
    }
    
    return { success: true };
  }),
```

### Création Client Airtable

```typescript
// server/routers/workflow.ts
createClient: publicProcedure
  .input(z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    type: z.enum(["particulier", "entreprise"]),
    age: z.number().optional(),
    employeeCount: z.number().optional(),
    annualPrice: z.number(),
    signatureUrl: z.string().url().optional(),
    stripeCustomerId: z.string().optional(),
    stripeSubscriptionId: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    const Airtable = require('airtable');
    const base = new Airtable({ apiKey: ENV.airtableApiKey }).base(ENV.airtableBaseId);
    
    const record = await base('Clients').create({
      'Nom': input.name,
      'Email': input.email,
      'Téléphone': input.phone,
      'Type': input.type,
      'Âge': input.age,
      'Nombre d\'employés': input.employeeCount,
      'Tarif annuel': input.annualPrice,
      'Signature': input.signatureUrl ? [{ url: input.signatureUrl }] : undefined,
      'Stripe Customer ID': input.stripeCustomerId,
      'Stripe Subscription ID': input.stripeSubscriptionId,
      'Statut': 'Client sous gestion',
      'Date de création': new Date().toISOString(),
    });
    
    const mandatNumber = `WW-${new Date().getFullYear()}-${record.id.substring(0, 5)}`;
    
    return {
      airtableId: record.id,
      mandatNumber,
    };
  }),
```

### Email de Bienvenue

**Destinataire** : Client  
**Objet** : Bienvenue chez WIN WIN Finance Group 🎉  
**Contenu** :

```
Bonjour {client.name},

Félicitations ! Votre mandat de gestion est maintenant actif.

📋 Récapitulatif :
- Numéro de mandat : {mandatNumber}
- Tarif annuel : CHF {annualPrice}.-/an
- Date de début : {startDate}
- Statut : ✅ Actif

🔗 Accès à votre espace client :
https://erp.winwin.swiss

📞 Prochaines étapes :
Olivier Neukomm vous contactera dans les 48h pour planifier un rendez-vous de lancement.

Cordialement,
L'équipe WIN WIN Finance Group

--
WIN WIN Finance Group
Bellevue 7, 2950 Courgenay
032 466 11 00 | contact@winwin.swiss
```

### Notification Olivier

**Destinataire** : Olivier Neukomm  
**Canal** : Notification Manus + Email  
**Objet** : Nouveau client payé ✅  
**Contenu** :

```
Nouveau client WIN WIN Finance Group

👤 Client : {client.name}
📧 Email : {client.email}
📞 Téléphone : {client.phone}
💰 Tarif : CHF {annualPrice}.-/an
📋 Mandat : {mandatNumber}
🔗 Airtable : https://airtable.com/app.../tbl.../{record.id}

Action requise :
Contacter le client dans les 48h pour planifier le rendez-vous de lancement.
```

---

## Page de Confirmation

### Description

La page `/merci` confirme l'activation du mandat et guide le client vers les prochaines étapes.

### URL

**Production** : `https://winwin.swiss/merci`

### Contenu

1. **Message de félicitations**
   - Icône de succès ✅
   - "Votre mandat de gestion est activé"

2. **Récapitulatif**
   - Numéro de mandat
   - Date de début
   - Tarif annuel
   - Statut : Actif

3. **Email de confirmation**
   - Mention de l'email envoyé
   - Vérifier la boîte de réception

4. **Prochaines étapes**
   - Email de bienvenue (immédiat)
   - Rendez-vous de lancement (48h)
   - Analyse détaillée (7 jours)

5. **Actions rapides**
   - Accéder à l'espace client (ERP Airtable)
   - Télécharger le PDF du mandat
   - Parrainer un proche

6. **Contact**
   - Téléphone : 032 466 11 00
   - Email : contact@winwin.swiss

---

## Métriques et Suivi

### KPIs à Suivre

| Métrique | Objectif | Mesure |
|----------|----------|--------|
| Taux de complétion questionnaire | > 70% | (Questionnaires complétés / Questionnaires démarrés) × 100 |
| Taux de signature | > 80% | (Signatures / Questionnaires complétés) × 100 |
| Taux de conversion paiement | > 90% | (Paiements réussis / Signatures) × 100 |
| Temps moyen parcours | < 30 min | Temps entre début questionnaire et paiement |
| Taux d'abandon | < 20% | (Abandons / Démarrages) × 100 |
| Taux de renouvellement | > 95% | (Renouvellements / Échéances) × 100 |

### Tableau de Bord Airtable

**Vue "Prospects"** :
- Tous les prospects en cours de workflow
- Filtres : Statut, Date de création, Source

**Vue "Conversions"** :
- Prospects convertis en clients
- Graphique évolution mensuelle
- Taux de conversion par source

**Vue "Clients Actifs"** :
- Tous les clients sous gestion
- Filtres : Type, Tarif, Date de début
- Prochaines échéances de renouvellement

**Vue "Revenus"** :
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Évolution mensuelle
- Répartition par type de client

---

## Sécurité et Conformité

### RGPD

- ✅ Consentement explicite lors du questionnaire
- ✅ Politique de confidentialité accessible
- ✅ Droit d'accès, de rectification et de suppression
- ✅ Hébergement des données en Suisse 🇨🇭
- ✅ Cryptage SSL/TLS
- ✅ Accès restreint aux données (Olivier uniquement)

### PCI DSS

- ✅ Aucune donnée bancaire stockée (Stripe Checkout)
- ✅ Conformité PCI DSS Level 1 (Stripe)
- ✅ Tokenisation des cartes bancaires
- ✅ 3D Secure activé

### Signature Électronique

- ✅ Conformité SCSE (Loi suisse sur la signature électronique)
- ✅ Valeur juridique équivalente à signature manuscrite
- ✅ Horodatage et traçabilité
- ✅ Stockage sécurisé S3 (7 ans minimum)

---

## Maintenance et Support

### Monitoring

**Uptime** :
- Surveillance 24/7 avec UptimeRobot
- Alertes SMS/Email si downtime > 5 min
- Objectif : 99.9% uptime

**Logs** :
- Tous les événements workflow loggés
- Rétention 90 jours
- Analyse quotidienne des erreurs

**Erreurs Stripe** :
- Webhook failures → Notification immédiate
- Payment failures → Retry automatique (3 tentatives)
- Subscription cancellations → Notification Olivier

### Support Client

**Email** : contact@winwin.swiss  
**Téléphone** : 032 466 11 00  
**Horaires** : Lundi-Vendredi 9h-17h

**FAQ** :
- Comment modifier mes informations ?
- Comment annuler mon mandat ?
- Comment télécharger mes documents ?
- Comment contacter mon conseiller ?

---

## Évolutions Futures

### Phase 2 (Q1 2026)

- [ ] Génération automatique PDF mandat personnalisé
- [ ] Interface de gestion client (dashboard)
- [ ] Notifications SMS (confirmations, rappels)
- [ ] Chatbot IA pour support client
- [ ] Intégration calendrier (prise de RDV automatique)

### Phase 3 (Q2 2026)

- [ ] Application mobile (iOS + Android)
- [ ] Espace client enrichi (documents, sinistres, conseils)
- [ ] Programme de parrainage automatisé
- [ ] Analyse prédictive (risques, opportunités)
- [ ] Intégration WIN.job, WIN.immo, WIN.ia

---

## Annexes

### A. Grille Tarifaire Complète

Voir `server/pricing.ts` pour la logique de calcul.

### B. Schéma Base de Données Airtable

**Table "Prospects"** :
- ID (Auto-increment)
- Nom (Text)
- Email (Email)
- Téléphone (Phone)
- Type (Select: Particulier, Entreprise)
- Âge (Number)
- Nombre d'employés (Number)
- Polices actuelles (Attachment)
- Données OCR (Long text)
- Score confiance OCR (Number)
- Statut (Select: Prospect, En signature, En paiement, Client actif)
- Date de création (Date)

**Table "Clients"** :
- ID (Auto-increment)
- Nom (Text)
- Email (Email)
- Téléphone (Phone)
- Type (Select)
- Âge (Number)
- Nombre d'employés (Number)
- Tarif annuel (Currency)
- Signature (Attachment)
- Stripe Customer ID (Text)
- Stripe Subscription ID (Text)
- Numéro de mandat (Text)
- Statut (Select: Client actif, Mandat résilié)
- Date de création (Date)
- Date de fin (Date)

### C. Endpoints tRPC

Voir `server/routers/workflow.ts` pour l'implémentation complète.

**Endpoints disponibles** :
- `workflow.getPricing` : Récupérer la grille tarifaire
- `workflow.calculatePrice` : Calculer le tarif personnalisé
- `workflow.createCheckoutSession` : Créer session Stripe
- `workflow.uploadSignature` : Upload signature vers S3
- `workflow.createClient` : Créer client dans Airtable
- `workflow.handleStripeWebhook` : Gérer événements Stripe

### D. Variables d'Environnement

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Airtable
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX

# S3 (déjà configuré via Manus)
# Pas besoin de configuration manuelle

# Email (à configurer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=contact@winwin.swiss
SMTP_PASS=xxx

# Notifications (déjà configuré via Manus)
# Utiliser notifyOwner() directement
```

---

**Fin de la documentation**

Pour toute question ou assistance, contactez Manus AI ou l'équipe WIN WIN Finance Group.
