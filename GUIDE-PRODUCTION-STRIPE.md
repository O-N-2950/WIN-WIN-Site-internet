# 🚀 Guide de Passage en Production - Stripe Facturation

**WIN WIN Finance Group - Système de Paiement et Facturation Récurrente**

---

## 📋 Vue d'ensemble

Ce guide vous accompagne étape par étape pour passer du mode TEST au mode PRODUCTION Stripe et commencer à facturer vos clients réellement.

**Durée estimée :** 1-2 heures  
**Prérequis :** Compte Stripe activé + Compte bancaire Raiffeisen configuré

---

## ✅ Checklist Avant Production

Avant de commencer, vérifiez que :

- [ ] Votre compte Stripe est **vérifié** (identité + documents)
- [ ] Votre compte bancaire **Raiffeisen** est connecté à Stripe
- [ ] Vous avez testé le workflow en mode TEST
- [ ] Tous les champs Airtable sont configurés
- [ ] Le site est déployé sur Railway (www.winwin.swiss)

---

## 🔑 Étape 1 : Récupérer les Clés LIVE Stripe

### 1.1 Activer votre compte Stripe

1. Aller sur https://dashboard.stripe.com
2. Cliquer sur **"Activer votre compte"**
3. Compléter les informations :
   - **Informations entreprise** : WIN WIN Finance Group
   - **Adresse** : Votre adresse professionnelle
   - **Numéro FINMA** : F01042365
   - **Compte bancaire** : Raiffeisen (IBAN)

4. Soumettre les documents demandés :
   - Pièce d'identité
   - Justificatif de domicile
   - Extrait du registre du commerce (si demandé)

⏱️ **Délai d'activation :** 1-3 jours ouvrables

### 1.2 Récupérer les clés API LIVE

Une fois votre compte activé :

1. Aller sur https://dashboard.stripe.com/apikeys
2. **Basculer en mode LIVE** (toggle en haut à droite)
3. Copier les clés :

**Secret key**
- Commence par `sk_live_`
- Exemple: `sk_live_` suivi de 24 caractères aléatoires

**Publishable key**
- Commence par `pk_live_`
- Exemple: `pk_live_` suivi de 24 caractères aléatoires

⚠️ **IMPORTANT** : Ne partagez JAMAIS votre Secret Key !

---

## 🔧 Étape 2 : Configurer les Clés LIVE dans Railway

### 2.1 Accéder aux variables d'environnement

1. Aller sur https://railway.app
2. Sélectionner le projet **winwin-website**
3. Cliquer sur **Variables** (onglet gauche)

### 2.2 Remplacer les clés TEST par les clés LIVE

Modifier ces 2 variables :

| Variable | Ancienne valeur (TEST) | Nouvelle valeur (LIVE) |
|----------|------------------------|------------------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |

### 2.3 Redémarrer le serveur

1. Cliquer sur **Deploy** → **Redeploy**
2. Attendre 2-3 minutes
3. Vérifier que le site est accessible : https://www.winwin.swiss

---

## 🔔 Étape 3 : Configurer le Webhook Stripe PRODUCTION

### 3.1 Créer le webhook

1. Aller sur https://dashboard.stripe.com/webhooks
2. **Basculer en mode LIVE** (toggle en haut à droite)
3. Cliquer sur **"Ajouter un endpoint"**

### 3.2 Configuration du webhook

**URL de l'endpoint :**
```
https://www.winwin.swiss/api/stripe/webhook
```

**Événements à écouter :**
- ✅ `invoice.payment_succeeded` (paiement réussi)
- ✅ `invoice.payment_failed` (paiement échoué)
- ✅ `invoice.payment_action_required` (3D Secure requis)

### 3.3 Récupérer le Signing Secret

1. Cliquer sur le webhook créé
2. Copier le **Signing secret** (commence par `whsec_...`)

**Signing secret**
- Commence par `whsec_`
- Exemple: `whsec_` suivi de 24 caractères aléatoires

### 3.4 Ajouter le Signing Secret dans Railway

1. Retourner sur Railway → Variables
2. Ajouter ou modifier la variable :

```
STRIPE_WEBHOOK_SECRET = [votre signing secret ici]
```

3. Redéployer le serveur

### 3.5 Tester le webhook

1. Sur la page du webhook Stripe, cliquer sur **"Envoyer un événement test"**
2. Sélectionner `invoice.payment_succeeded`
3. Vérifier que le webhook reçoit bien l'événement (statut 200)

✅ **Si vous voyez "Succeeded" → Webhook configuré correctement !**

---

## 🧪 Étape 4 : Tester avec un Client Réel (Mode LIVE)

### 4.1 Créer un client test dans Airtable

1. Ouvrir Airtable → Table "Clients"
2. Créer un nouveau client :
   - **Nom** : Votre nom (ou un ami/collègue)
   - **Email** : Votre email personnel
   - **Type** : Particulier
   - **Tarif applicable** : 185 CHF
   - **Mandat offert** : ❌ NON

### 4.2 Déclencher le paiement

1. Aller sur https://www.winwin.swiss/questionnaire-info
2. Remplir le formulaire avec les infos du client test
3. Signer le mandat
4. Cliquer sur **"Procéder au paiement"**

### 4.3 Effectuer le paiement TEST

Utiliser une **carte de test Stripe** :

```
Numéro de carte : 4242 4242 4242 4242
Date d'expiration : 12/34 (n'importe quelle date future)
CVC : 123
Code postal : 1234
```

⚠️ **ATTENTION** : Cette carte ne fonctionne qu'en mode TEST !

### 4.4 Vérifier la synchronisation

1. **Airtable** : Vérifier que les champs sont mis à jour :
   - Stripe Subscription ID = `sub_xxx`
   - Stripe Invoice ID = `in_xxx`
   - Statut Paiement = "Payé"
   - Date dernier paiement = aujourd'hui
   - Date prochaine facturation = aujourd'hui + 360 jours

2. **Stripe Dashboard** : Vérifier la facture créée

3. **Email** : Vérifier que le client a reçu l'email de bienvenue

✅ **Si tout est OK → Système fonctionnel !**

---

## 💳 Étape 5 : Premier Vrai Paiement (Mode LIVE)

### 5.1 Créer un vrai client

1. Choisir un client qui a signé le mandat
2. Vérifier ses informations dans Airtable
3. S'assurer que "Mandat offert" = ❌ NON

### 5.2 Envoyer le lien de paiement

Option 1 : **Lien direct**
```
https://www.winwin.swiss/paiement?clientId=recXXXXXXXXXX
```

Option 2 : **Email personnalisé**
```
Bonjour [Prénom],

Merci d'avoir signé le mandat de gestion WIN WIN Finance Group.

Pour finaliser votre inscription, veuillez procéder au paiement :
👉 https://www.winwin.swiss/paiement?clientId=recXXXXXXXXXX

Montant annuel : CHF [Prix final avec rabais]

Cordialement,
Olivier Neukomm
WIN WIN Finance Group
```

### 5.3 Vérifier le paiement

1. **Stripe Dashboard** : Vérifier la transaction
2. **Airtable** : Vérifier la synchronisation
3. **Raiffeisen** : Vérifier le virement (délai 2-7 jours)

---

## 🔄 Étape 6 : Activer la Facturation Récurrente

### 6.1 Comprendre le cycle de facturation

**Cycle WIN WIN** : 360 jours (pas 365)

```
Exemple :
- Date signature : 01/01/2025
- Premier paiement : 01/01/2025
- Prochaine facturation : 26/12/2025 (+360 jours)
```

### 6.2 Configurer le Cron Job

Le système vérifie automatiquement chaque jour à **9h00 CET** les clients à facturer.

**Fonction appelée** : `processDailyBilling()`

**Fichier** : `server/lib/billing.ts`

### 6.3 Tester la facturation récurrente

Pour tester sans attendre 360 jours :

1. Modifier manuellement dans Airtable :
   - "Date prochaine facturation" = aujourd'hui

2. Exécuter manuellement la fonction :

```bash
# Sur Railway, ouvrir le terminal
node -e "import('./server/lib/billing.js').then(m => m.processDailyBilling())"
```

3. Vérifier :
   - Facture créée dans Stripe
   - Airtable mis à jour
   - Email envoyé au client

---

## 📊 Étape 7 : Monitoring et Suivi

### 7.1 Dashboard Stripe

Accéder au dashboard : https://dashboard.stripe.com

**Métriques à surveiller :**
- Revenus mensuels
- Taux de réussite des paiements
- Clients actifs
- Abonnements en cours

### 7.2 Airtable CRM

**Champs importants à surveiller :**
- Statut Paiement (Payé / En attente / Échoué)
- Date prochaine facturation
- Montant dernier paiement

### 7.3 Notifications automatiques

Le système envoie automatiquement des notifications pour :
- ✅ Paiement réussi → Email de confirmation au client
- ❌ Paiement échoué → Alerte à l'équipe WIN WIN
- ⏳ Action requise (3D Secure) → Email au client

---

## 🛠️ Dépannage

### Problème 1 : Webhook ne fonctionne pas

**Symptômes** : Airtable n'est pas mis à jour après paiement

**Solutions** :
1. Vérifier que `STRIPE_WEBHOOK_SECRET` est configuré dans Railway
2. Vérifier l'URL du webhook : `https://www.winwin.swiss/api/stripe/webhook`
3. Tester le webhook depuis Stripe Dashboard
4. Vérifier les logs Railway : `railway logs`

### Problème 2 : Paiement échoué

**Symptômes** : Le client ne peut pas payer

**Solutions** :
1. Vérifier que les clés LIVE sont configurées
2. Vérifier que le compte Stripe est activé
3. Vérifier que la carte du client est valide
4. Vérifier les logs Stripe Dashboard

### Problème 3 : Facturation récurrente ne fonctionne pas

**Symptômes** : Aucune facture créée après 360 jours

**Solutions** :
1. Vérifier que le cron job est actif
2. Vérifier que "Date prochaine facturation" est correcte dans Airtable
3. Exécuter manuellement `processDailyBilling()` pour tester
4. Vérifier les logs Railway

---

## 📞 Support

**En cas de problème :**

1. **Stripe Support** : https://support.stripe.com
2. **Railway Support** : https://railway.app/help
3. **Airtable Support** : https://support.airtable.com

**Logs utiles :**
```bash
# Railway logs
railway logs --tail 100

# Stripe logs
https://dashboard.stripe.com/logs
```

---

## 🎉 Félicitations !

Votre système de paiement Stripe est maintenant en **PRODUCTION** !

**Prochaines étapes :**
- [ ] Migrer tous vos clients existants
- [ ] Envoyer les liens de paiement
- [ ] Surveiller les premiers paiements
- [ ] Ajuster les emails de notification
- [ ] Former l'équipe sur le nouveau système

---

## 📝 Résumé des URLs Importantes

| Service | URL |
|---------|-----|
| **Site web** | https://www.winwin.swiss |
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **Railway Dashboard** | https://railway.app |
| **Airtable Base** | https://airtable.com/appZQkRJ7PwOtdQ3O |
| **Webhook Endpoint** | https://www.winwin.swiss/api/stripe/webhook |

---

## 🔐 Sécurité

**Bonnes pratiques :**

1. ✅ Ne partagez JAMAIS vos clés Stripe
2. ✅ Utilisez HTTPS partout (déjà configuré)
3. ✅ Vérifiez les signatures des webhooks (déjà implémenté)
4. ✅ Sauvegardez régulièrement Airtable
5. ✅ Surveillez les transactions suspectes

---

**Document créé le :** 04 décembre 2025  
**Dernière mise à jour :** 04 décembre 2025  
**Version :** 1.0  
**Auteur :** Manus AI pour WIN WIN Finance Group
