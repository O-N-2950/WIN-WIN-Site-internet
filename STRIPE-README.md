# 💳 Système de Paiement Stripe - WIN WIN Finance Group

## 🎯 Vue d'ensemble

Système complet de paiement et facturation récurrente avec gestion automatique des rabais familiaux.

**Status :** ✅ Prêt pour production (mode TEST actuellement)

---

## 📚 Documentation

### Pour les utilisateurs

📖 **[GUIDE-PRODUCTION-STRIPE.md](./GUIDE-PRODUCTION-STRIPE.md)**
- Comment passer en production
- Configuration des clés LIVE
- Configuration du webhook
- Premier paiement réel
- Monitoring et suivi

### Pour les développeurs

🔧 **[GUIDE-TECHNIQUE-STRIPE.md](./GUIDE-TECHNIQUE-STRIPE.md)**
- Architecture du système
- Structure des fichiers
- API et fonctions
- Tests et debugging
- Déploiement

---

## ✨ Fonctionnalités

### 1. Paiement avec Rabais Familiaux

- ✅ Calcul automatique du rabais (2% par membre, max 20%)
- ✅ Prix dynamique dans Stripe (pas de coupon)
- ✅ Facture détaillée avec liste des membres
- ✅ Métadonnées enrichies

### 2. Synchronisation Airtable

- ✅ Mise à jour automatique après paiement
- ✅ 6 champs Stripe configurés
- ✅ Calcul automatique "Date prochaine facturation"

### 3. Facturation Récurrente (360 jours)

- ✅ Vérification quotidienne automatique
- ✅ Création factures Stripe
- ✅ Gestion "Mandat offert"
- ✅ Logs détaillés

### 4. Webhooks Stripe

- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`
- ✅ `invoice.payment_action_required`

---

## 🔑 Configuration Actuelle

### Mode TEST

```env
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Airtable

```
Base ID: appZQkRJ7PwOtdQ3O
Table ID: tblWPcIpGmBZ3ASGI
```

### Champs Stripe

| Champ | Field ID | Type |
|-------|----------|------|
| Stripe Subscription ID | fldocAjdGomXPRQeU | Text |
| Date prochaine facturation | fld3VBfm8vhkawBCo | Formula |
| Statut Paiement | fldaFF7mU0FwNshw7 | Single select |
| Date dernier paiement | fldrg5f0BD3np8Mug | Date |
| Stripe Invoice ID | fldMn8zMy3lQNWF0e | Text |
| date dernière facture établie | fldq2bsTMuxynxVHj | Date |

---

## 🧪 Tests

### Exécuter les tests

```bash
pnpm test server/__tests__/stripe-billing.test.ts
```

### Résultats

✅ **11/11 tests passés** (543ms)

- Configuration Airtable
- Module stripe-payment.ts
- Module stripe-webhooks.ts
- Module billing.ts
- Module airtable-crm.ts
- Workflow complet
- Cycle de facturation (360 jours)

---

## 📁 Fichiers Principaux

```
server/
├── airtable-config.ts           # Field IDs Airtable
├── airtable-crm.ts              # CRUD Airtable
├── lib/
│   ├── stripe-payment.ts        # Sessions Stripe
│   ├── stripe-webhooks.ts       # Webhooks
│   ├── billing.ts               # Facturation récurrente
│   └── parrainage.ts            # Rabais familiaux
├── routers/
│   └── workflow.ts              # API tRPC
└── __tests__/
    └── stripe-billing.test.ts   # Tests unitaires
```

---

## 🚀 Prochaines Étapes

### Pour passer en production :

1. ✅ **Tests complets** → Terminé
2. ✅ **Documentation** → Terminé
3. ⏳ **Activer compte Stripe** → À faire
4. ⏳ **Configurer clés LIVE** → À faire
5. ⏳ **Configurer webhook production** → À faire
6. ⏳ **Premier paiement réel** → À faire

**Suivre le guide :** [GUIDE-PRODUCTION-STRIPE.md](./GUIDE-PRODUCTION-STRIPE.md)

---

## 💡 Exemples de Rabais

| Membres | Rabais | Prix base | Prix final |
|---------|--------|-----------|------------|
| 1       | 0%     | 185 CHF   | 185.00 CHF |
| 2       | 2%     | 185 CHF   | 181.30 CHF |
| 5       | 8%     | 185 CHF   | 170.20 CHF |
| 10      | 18%    | 185 CHF   | 151.70 CHF |
| 12+     | 20%    | 185 CHF   | 148.00 CHF |

---

## 📞 Support

**En cas de problème :**

1. Consulter [GUIDE-TECHNIQUE-STRIPE.md](./GUIDE-TECHNIQUE-STRIPE.md) (section Dépannage)
2. Vérifier les logs Railway : `railway logs`
3. Vérifier les logs Stripe : https://dashboard.stripe.com/logs
4. Contacter le support Stripe : https://support.stripe.com

---

## 🔐 Sécurité

- ✅ HTTPS partout
- ✅ Vérification signature webhook
- ✅ Clés API sécurisées (Railway)
- ✅ Pas de clés dans le code source

---

**Créé le :** 04 décembre 2025  
**Version :** 1.0  
**Status :** ✅ Production-ready (mode TEST)
