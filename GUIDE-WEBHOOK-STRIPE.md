# Guide de Configuration Webhook Stripe - WIN WIN Finance Group

**Date** : 15 novembre 2025  
**Auteur** : Manus AI

---

## 📋 Vue d'Ensemble

Ce guide explique comment configurer le webhook Stripe pour automatiser le processus post-paiement du site WIN WIN Finance Group. Le webhook permet de créer automatiquement le client dans Airtable, d'envoyer les emails de bienvenue et de notifier Olivier après chaque paiement réussi.

---

## 🔧 Configuration dans Stripe Dashboard

### Étape 1 : Accéder aux Webhooks

1. Connectez-vous au [Stripe Dashboard](https://dashboard.stripe.com/)
2. Allez dans **Developers** → **Webhooks**
3. Cliquez sur **Add endpoint**

### Étape 2 : Configurer l'Endpoint

**URL de l'endpoint** :
```
https://www.winwin.swiss/api/stripe/webhook
```

**Événements à écouter** :

Sélectionnez les événements suivants :
- ✅ `checkout.session.completed` (OBLIGATOIRE)
- ✅ `customer.subscription.created` (recommandé)
- ✅ `customer.subscription.updated` (recommandé)
- ✅ `customer.subscription.deleted` (recommandé)

### Étape 3 : Récupérer le Signing Secret

Après avoir créé le webhook, Stripe affiche le **Signing Secret** (commence par `whsec_`).

**Important** : Copiez ce secret et ajoutez-le dans les variables d'environnement du projet :

```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🧪 Tests en Local avec Stripe CLI

### Installation de Stripe CLI

**macOS** :
```bash
brew install stripe/stripe-cli/stripe
```

**Linux** :
```bash
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

**Windows** :
```bash
scoop install stripe
```

### Authentification

```bash
stripe login
```

Suivez les instructions pour vous connecter à votre compte Stripe.

### Écouter les Webhooks en Local

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Cette commande affiche un **webhook signing secret** temporaire (commence par `whsec_`). Utilisez-le pour les tests locaux :

```bash
export STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Tester un Événement

Dans un autre terminal, déclenchez un événement de test :

```bash
stripe trigger checkout.session.completed
```

Vous devriez voir dans les logs du serveur :
```
[Webhook] Événement reçu: checkout.session.completed
[Webhook] Paiement réussi pour session: cs_test_xxxxx
[Webhook] Client créé dans Airtable: recXXXXXXXXXXXXXX
[Webhook] Numéro de mandat: WW-2025-XXXXX
[Email] ✅ Email de bienvenue envoyé avec succès
[Webhook] Notifications envoyées à Olivier
```

---

## 📊 Flux de Données du Webhook

```
Client complète paiement Stripe
    ↓
Stripe envoie POST /api/stripe/webhook
    ↓
Serveur vérifie signature avec STRIPE_WEBHOOK_SECRET
    ↓
Extraction des metadata de session.metadata:
  - clientName
  - clientEmail
  - clientType (particulier | entreprise)
  - clientAge
  - clientEmployeeCount
  - annualPrice
  - isFree
  - signatureUrl
    ↓
Création client dans Airtable (table Clients)
    ↓
Génération numéro de mandat: WW-2025-XXXXX
    ↓
Envoi email bienvenue client (Resend)
    ↓
Envoi notification Manus à Olivier
    ↓
Envoi email notification à Olivier
    ↓
Retour HTTP 200 à Stripe
```

---

## 🔐 Variables d'Environnement Requises

Le webhook nécessite les variables suivantes :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Clé API Stripe (mode production) | `sk_live_xxxxx` |
| `STRIPE_WEBHOOK_SECRET` | Secret de signature webhook | `whsec_xxxxx` |
| `RESEND_API_KEY` | Clé API Resend pour emails | `re_xxxxx` |
| `DATABASE_URL` | URL base de données MySQL/TiDB | `mysql://user:pass@host/db` |

**Configuration des secrets** :

Les secrets doivent être configurés via l'interface Manus (Settings → Secrets) ou via `webdev_request_secrets`.

---

## 🐛 Debugging

### Vérifier les Logs Webhook dans Stripe

1. Allez dans **Developers** → **Webhooks**
2. Cliquez sur votre endpoint
3. Consultez l'onglet **Recent events**

Chaque événement affiche :
- ✅ Succès (HTTP 200)
- ❌ Échec (HTTP 4xx/5xx)
- 📄 Payload envoyé
- 📄 Réponse reçue

### Logs Serveur

Le webhook log toutes les étapes :

```javascript
console.log('[Webhook] Événement reçu:', event.type);
console.log('[Webhook] Paiement réussi pour session:', session.id);
console.log('[Webhook] Customer:', session.customer);
console.log('[Webhook] Metadata:', session.metadata);
console.log('[Webhook] Client créé dans Airtable:', airtableRecord.id);
console.log('[Webhook] Numéro de mandat:', mandatNumber);
console.log('[Email] ✅ Email de bienvenue envoyé avec succès');
console.log('[Webhook] Notifications envoyées à Olivier');
```

### Erreurs Courantes

**1. Signature invalide**
```
Webhook Error: No signatures found matching the expected signature for payload
```
**Solution** : Vérifiez que `STRIPE_WEBHOOK_SECRET` est correctement configuré.

**2. Metadata manquantes**
```
[Webhook] Metadata: {}
```
**Solution** : Vérifiez que `createCheckoutSession` envoie bien toutes les metadata.

**3. Erreur Airtable**
```
[Webhook] Erreur lors de la création du client: INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND
```
**Solution** : Vérifiez que le MCP Airtable est correctement configuré et que les IDs de base/table sont corrects.

**4. Erreur email**
```
[Email] ❌ Erreur lors de l'envoi: API key is invalid
```
**Solution** : Vérifiez que `RESEND_API_KEY` est correctement configuré.

---

## 🔄 Retry Policy

Stripe réessaie automatiquement les webhooks échoués :
- **1er retry** : Immédiatement
- **2ème retry** : Après 1 heure
- **3ème retry** : Après 3 heures
- **4ème retry** : Après 6 heures
- **5ème retry** : Après 12 heures
- **6ème retry** : Après 24 heures

**Important** : Le webhook ne renvoie pas d'erreur à Stripe en cas d'échec de création client Airtable pour éviter les retries infinis. L'erreur est loggée et l'administrateur doit créer le client manuellement.

---

## ✅ Checklist de Mise en Production

- [ ] Webhook créé dans Stripe Dashboard (mode production)
- [ ] URL webhook configurée : `https://www.winwin.swiss/api/stripe/webhook`
- [ ] Événements sélectionnés : `checkout.session.completed`, `customer.subscription.*`
- [ ] `STRIPE_WEBHOOK_SECRET` configuré dans les secrets
- [ ] `STRIPE_SECRET_KEY` configuré (mode production `sk_live_`)
- [ ] `RESEND_API_KEY` configuré
- [ ] Test webhook avec Stripe CLI réussi
- [ ] Test paiement réel effectué et client créé dans Airtable
- [ ] Email de bienvenue reçu par le client
- [ ] Notification Olivier reçue (Manus + email)

---

## 📞 Support

En cas de problème avec le webhook :

1. **Consulter les logs Stripe** : Developers → Webhooks → Recent events
2. **Consulter les logs serveur** : Vérifier les logs du serveur Node.js
3. **Tester en local** : Utiliser Stripe CLI pour reproduire le problème
4. **Contacter le support** : Si le problème persiste, contacter le support Stripe ou Manus

---

**Auteur** : Manus AI  
**Date** : 15 novembre 2025  
**Version** : 1.0
