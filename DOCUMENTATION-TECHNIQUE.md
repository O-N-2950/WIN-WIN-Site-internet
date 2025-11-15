# Documentation Technique - Site WIN WIN Finance Group

**Version** : 1.0.0  
**Date** : 15 novembre 2025  
**Auteur** : Manus AI

---

## Vue d'Ensemble

Le site WIN WIN Finance Group est une plateforme web moderne permettant l'onboarding automatisé des clients pour les mandats de gestion en assurances. Le système intègre un workflow complet depuis le questionnaire initial jusqu'à l'activation du client, en passant par la signature électronique et le paiement Stripe.

### Technologies Utilisées

Le projet repose sur une stack technique moderne et performante :

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **Frontend** | React | 19 | Interface utilisateur |
| **Styling** | Tailwind CSS | 4 | Design system |
| **Backend** | Express | 4 | Serveur API |
| **API** | tRPC | 11 | Communication type-safe |
| **Paiement** | Stripe | 19.3.1 | Gestion des abonnements |
| **Base de données** | Airtable | MCP | CRM et gestion clients |
| **Stockage** | S3 | - | Signatures et documents |
| **Authentification** | Manus OAuth | - | Connexion utilisateurs |

### Architecture

L'architecture suit un modèle client-serveur avec une API tRPC pour la communication type-safe entre le frontend et le backend. Les données clients sont stockées dans Airtable (via MCP), les paiements sont gérés par Stripe, et les fichiers (signatures) sont stockés sur S3.

```
┌─────────────────┐
│   React App     │ ← Frontend (Tailwind CSS)
│  (Port 3000)    │
└────────┬────────┘
         │ tRPC
         ↓
┌─────────────────┐
│  Express Server │ ← Backend (tRPC Router)
│  (Port 3000)    │
└────────┬────────┘
         │
         ├─→ Stripe API (Paiements)
         ├─→ Airtable MCP (Clients)
         ├─→ S3 (Signatures)
         └─→ Google Cloud Vision (OCR)
```

---

## Structure du Projet

### Organisation des Fichiers

```
winwin-website/
├── client/                    # Frontend React
│   ├── public/                # Assets statiques
│   │   ├── logo-winwin-official.jpg
│   │   └── olivier-neukomm.jpg
│   ├── src/
│   │   ├── pages/             # Pages principales
│   │   │   ├── Home.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Questionnaire.tsx
│   │   │   ├── Signature.tsx
│   │   │   ├── Paiement.tsx
│   │   │   └── Merci.tsx
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── lib/
│   │   │   └── trpc.ts        # Client tRPC
│   │   ├── const.ts           # Constantes (routes, config)
│   │   └── App.tsx            # Router principal
│   └── index.html
├── server/                    # Backend Express
│   ├── _core/                 # Infrastructure
│   │   ├── env.ts             # Variables d'environnement
│   │   ├── trpc.ts            # Configuration tRPC
│   │   └── index.ts           # Serveur Express
│   ├── routers/
│   │   └── workflow.ts        # Router workflow (Stripe, Airtable)
│   ├── routers.ts             # Router principal
│   ├── db.ts                  # Helpers base de données
│   ├── pricing.ts             # Calcul des tarifs
│   ├── airtable.ts            # Helpers Airtable MCP
│   ├── airtable-config.ts     # Configuration Airtable
│   └── storage.ts             # Helpers S3
├── drizzle/
│   └── schema.ts              # Schéma base de données
├── scripts/
│   └── create-stripe-products.mjs  # Création produits Stripe
├── test-ocr/                  # Tests OCR Google Cloud Vision
└── package.json
```

### Fichiers Clés

#### Frontend

**`client/src/const.ts`** : Contient toutes les constantes de l'application (routes, informations de contact, liens externes).

**`client/src/App.tsx`** : Définit les routes et la structure de navigation de l'application.

**`client/src/pages/`** : Contient toutes les pages du site (9 pages principales + concepts).

#### Backend

**`server/pricing.ts`** : Module de calcul des tarifs selon le type de client (particulier/entreprise) et les critères (âge/nombre d'employés). Contient les IDs Stripe des 10 produits créés.

**`server/routers/workflow.ts`** : Router tRPC principal pour le workflow d'onboarding. Expose 6 endpoints :
- `getPricing` : Récupérer la grille tarifaire
- `calculatePrice` : Calculer le tarif personnalisé
- `createCheckoutSession` : Créer une session Stripe
- `uploadSignature` : Upload signature vers S3
- `createClient` : Créer client dans Airtable
- `handleStripeWebhook` : Gérer les webhooks Stripe

**`server/airtable.ts`** : Helpers pour l'intégration Airtable via MCP. Fonctions principales :
- `createClientInAirtable()` : Créer un nouveau client
- `findClientByEmail()` : Rechercher un client existant
- `updateClientInAirtable()` : Mettre à jour un client

**`server/airtable-config.ts`** : Configuration des IDs Airtable (base, tables, champs).

---

## Configuration

### Variables d'Environnement

Le projet utilise les variables d'environnement suivantes (automatiquement injectées par la plateforme Manus) :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion MySQL/TiDB | `mysql://...` |
| `JWT_SECRET` | Secret pour les cookies de session | `xxx` |
| `VITE_APP_ID` | ID de l'application Manus OAuth | `xxx` |
| `OAUTH_SERVER_URL` | URL du serveur OAuth | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | URL du portail de connexion | `https://portal.manus.im` |
| `OWNER_OPEN_ID` | OpenID du propriétaire | `xxx` |
| `OWNER_NAME` | Nom du propriétaire | `Olivier Neukomm` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | `whsec_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | `pk_live_...` |
| `BUILT_IN_FORGE_API_URL` | URL des APIs Manus | `https://...` |
| `BUILT_IN_FORGE_API_KEY` | Clé API Manus (backend) | `xxx` |
| `VITE_FRONTEND_FORGE_API_KEY` | Clé API Manus (frontend) | `xxx` |

**Note** : Les variables préfixées par `VITE_` sont accessibles côté client. Les autres sont réservées au backend.

### Configuration Stripe

#### Produits Créés

10 produits ont été créés dans Stripe pour couvrir toute la grille tarifaire :

**Particuliers** :
- 18-22 ans : CHF 85.-/an (`price_1STlgKDevWYEIiJ8QqZu9R52`)
- > 22 ans : CHF 185.-/an (`price_1STlgKDevWYEIiJ8ExMQznN7`)

**Entreprises** :
- 0 employé : CHF 160.-/an (`price_1STlgLDevWYEIiJ8fpjNpgAn`)
- 1 employé : CHF 260.-/an (`price_1STlgLDevWYEIiJ8TtUOdeBY`)
- 2 employés : CHF 360.-/an (`price_1STlgMDevWYEIiJ8LcVUCBzI`)
- 3-5 employés : CHF 460.-/an (`price_1STlgMDevWYEIiJ8lnbNPxVe`)
- 6-10 employés : CHF 560.-/an (`price_1STlgNDevWYEIiJ8WHVYyo0l`)
- 11-20 employés : CHF 660.-/an (`price_1STlgNDevWYEIiJ8jQRDvTuS`)
- 21-30 employés : CHF 760.-/an (`price_1STlgNDevWYEIiJ8r1Ysxivn`)
- 31+ employés : CHF 860.-/an (`price_1STlgODevWYEIiJ8vMjiO56u`)

Ces IDs sont définis dans `server/pricing.ts` et utilisés automatiquement par le système de calcul de tarifs.

#### Webhooks

Un endpoint webhook doit être configuré dans Stripe Dashboard :
- **URL** : `https://[votre-domaine]/api/stripe/webhook`
- **Événements** : `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`

### Configuration Airtable

#### Base Utilisée

**Nom** : ERP Clients WW  
**ID** : `appZQkRJ7PwOtdQ3O`

#### Tables

**Table Clients** (`tblWPcIpGmBZ3ASGI`) :
- Champs principaux : Nom, Prénom, Email, Téléphone, Type (Particulier/Entreprise), Âge, Nombre d'employés, Tarif applicable, Statut client, Date signature mandat

**Table Contrats** (`tblDOIQM3zt7QkZd4`) :
- Champs principaux : Numéro contrat, Nom client, Compagnie, Type contrat, Montant prime, Date début, Date fin, Statut

Les IDs complets des champs sont définis dans `server/airtable-config.ts`.

---

## Workflow d'Onboarding

Le workflow d'onboarding client se déroule en 4 étapes principales :

### 1. Questionnaire

**Page** : `/questionnaire-info`

Le client est présenté au processus et redirigé vers le questionnaire Genspark (hébergé sur `/questionnaire/`). Le questionnaire collecte toutes les informations nécessaires pour l'analyse des besoins en assurances.

**Données collectées** :
- Informations personnelles (nom, prénom, âge, contact)
- Situation familiale et professionnelle
- Contrats d'assurance existants (via upload PDF + OCR)
- Besoins et objectifs

### 2. Signature Électronique

**Page** : `/signature`

Le client signe électroniquement le mandat de gestion à l'aide d'un canvas HTML5. La signature est capturée en tant que data URL (Base64) puis uploadée vers S3.

**Processus** :
1. Affichage du récapitulatif du mandat
2. Capture de la signature (Canvas HTML5)
3. Validation et téléchargement de la signature
4. Upload vers S3 via `trpc.workflow.uploadSignature`
5. Redirection vers `/paiement`

**Endpoint tRPC** : `workflow.uploadSignature`
- **Input** : `{ signatureDataUrl: string, clientEmail: string }`
- **Output** : `{ url: string, key: string }`

### 3. Paiement Stripe

**Page** : `/paiement`

Le client est présenté avec le tarif personnalisé calculé selon son profil (âge ou nombre d'employés). Si le mandat est offert (famille, proches), le paiement est skippé.

**Processus** :
1. Calcul du tarif via `trpc.workflow.calculatePrice`
2. Si tarif > 0 : Création session Stripe via `trpc.workflow.createCheckoutSession`
3. Redirection vers Stripe Checkout
4. Après paiement : Webhook Stripe → Création client Airtable
5. Redirection vers `/merci`

**Endpoint tRPC** : `workflow.createCheckoutSession`
- **Input** : `{ priceId: string, clientEmail: string, clientName: string, successUrl: string, cancelUrl: string, metadata?: Record<string, string> }`
- **Output** : `{ sessionId: string, url: string }`

### 4. Confirmation et Activation

**Page** : `/merci`

Le client reçoit une confirmation de son inscription avec :
- Numéro de mandat unique (format `WW-2025-XXXXX`)
- Prochaines étapes (email de bienvenue, RDV, analyse)
- Lien vers l'espace client Airtable
- Téléchargement du PDF du mandat signé

**Endpoint tRPC** : `workflow.createClient`
- **Input** : `{ nom: string, prenom: string, email: string, phone?: string, type: "particulier" | "entreprise", age?: number, employeeCount?: number, annualPrice: number, isFree?: boolean, signatureUrl?: string, stripeCustomerId?: string, stripeSubscriptionId?: string }`
- **Output** : `{ airtableId: string, mandatNumber: string }`

---

## Intégration OCR

Le système intègre Google Cloud Vision OCR pour l'extraction automatique des données des polices d'assurance uploadées par les clients.

### Résultats des Tests

6 polices d'assurance ont été testées (29 pages au total) avec les résultats suivants :

| Champ | Précision | Commentaire |
|-------|-----------|-------------|
| Compagnie | 100% (6/6) | ✅ Parfait |
| N° Police | 100% (6/6) | ✅ Parfait |
| Type de couverture | 100% détecté | ⚠️ Bugs de classification |
| Adresse | 100% (6/6) | ✅ Parfait |
| Nom assuré | 50% (3/6) | ❌ Patterns manquants |
| Prime annuelle | 17% (1/6) | ❌ Patterns manquants |

**Précision globale** : 78% (objectif 90% atteignable avec améliorations)

### ROI OCR

L'automatisation OCR permet un gain de temps significatif :

- **Temps manuel** : 15-20 min par client
- **Temps automatisé** : 2-3 min par client
- **Gain** : 85% de réduction du temps de traitement
- **Sur 500 clients** : 108 heures économisées = **16'200 CHF** (à CHF 150/h)
- **Coût développement** : ~3'000 CHF
- **ROI** : **5.4x dès la première année**

À 95% de précision, le ROI monte à **7.1x-7.5x**.

---

## Déploiement

### Prérequis

- Node.js 22.13.0
- pnpm 10.4.1
- Accès SSH au serveur SwissCenter
- Compte Stripe configuré
- Base Airtable configurée
- Bucket S3 configuré

### Build Production

```bash
# Installer les dépendances
pnpm install

# Build frontend
cd client && pnpm build

# Le serveur Express sert automatiquement les fichiers statiques buildés
```

### Démarrage

```bash
# Mode développement
pnpm dev

# Mode production
NODE_ENV=production pnpm start
```

### Configuration PM2 (SwissCenter)

Créer un fichier `ecosystem.config.js` :

```javascript
module.exports = {
  apps: [{
    name: 'winwin-website',
    script: 'server/_core/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
  }],
};
```

Démarrer avec PM2 :

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Configuration DNS

Pointer le domaine `www.winwin.swiss` vers l'IP du serveur SwissCenter. Configurer un certificat SSL (Let's Encrypt recommandé).

---

## Maintenance

### Logs

Les logs sont accessibles via PM2 :

```bash
# Voir les logs en temps réel
pm2 logs winwin-website

# Voir les logs d'erreur
pm2 logs winwin-website --err

# Voir les 100 dernières lignes
pm2 logs winwin-website --lines 100
```

### Monitoring

Utiliser PM2 pour monitorer l'application :

```bash
# Statut de l'application
pm2 status

# Monitoring en temps réel
pm2 monit

# Informations détaillées
pm2 show winwin-website
```

### Mises à Jour

Pour déployer une nouvelle version :

```bash
# 1. Pull les derniers changements
git pull origin main

# 2. Installer les nouvelles dépendances
pnpm install

# 3. Build le frontend
cd client && pnpm build && cd ..

# 4. Redémarrer l'application
pm2 restart winwin-website
```

### Backup

**Base de données** : Airtable gère automatiquement les backups.

**Signatures S3** : Configurer une politique de backup S3 avec versioning activé.

**Code source** : Utiliser Git pour le versioning du code.

---

## Sécurité

### Bonnes Pratiques Implémentées

1. **Authentification** : Manus OAuth pour la connexion sécurisée
2. **Cookies** : Cookies HTTP-only avec signature JWT
3. **HTTPS** : Obligatoire en production
4. **Validation** : Validation des inputs avec Zod (tRPC)
5. **Secrets** : Variables d'environnement (jamais commitées)
6. **S3** : Clés de fichiers non-énumérables (suffixes aléatoires)
7. **Stripe** : Webhooks signés pour éviter les attaques

### Checklist Sécurité

- [ ] Certificat SSL configuré (Let's Encrypt)
- [ ] Variables d'environnement sécurisées (pas de .env commité)
- [ ] Webhooks Stripe configurés avec secret
- [ ] CORS configuré correctement
- [ ] Rate limiting activé sur les endpoints sensibles
- [ ] Logs d'erreur sans informations sensibles
- [ ] Backup régulier des données

---

## Support

### Contacts

**Développement** : Manus AI  
**Client** : Olivier Neukomm (WIN WIN Finance Group)  
**Email** : contact@winwin.swiss  
**Téléphone** : 032 466 11 00

### Ressources

- **Documentation Stripe** : https://stripe.com/docs
- **Documentation Airtable MCP** : https://github.com/domdomegg/airtable-mcp-server
- **Documentation tRPC** : https://trpc.io/docs
- **Documentation React** : https://react.dev

---

## Changelog

### Version 1.0.0 (15 novembre 2025)

**Fonctionnalités** :
- ✅ Site vitrine complet (9 pages + 3 concepts)
- ✅ Workflow d'onboarding automatisé
- ✅ Intégration Stripe production (10 produits)
- ✅ Intégration Airtable via MCP
- ✅ Upload signatures vers S3
- ✅ Calcul automatique des tarifs
- ✅ Logo officiel WIN WIN intégré
- ✅ Tests OCR sur 6 polices d'assurance

**Améliorations futures** :
- [ ] Webhook Stripe complet (email bienvenue, notification Olivier)
- [ ] Amélioration précision OCR (90%+)
- [ ] Générateur PDF mandat personnalisé
- [ ] Tests automatisés (E2E)
- [ ] Monitoring performance (Sentry, LogRocket)

---

**Fin de la documentation technique**
