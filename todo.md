# TODO - WIN WIN Finance Group

## ✅ TERMINÉ

- [x] Synchroniser listes déroulantes questionnaire avec Airtable
- [x] Implémenter validation IBAN stricte avec auto-formatage
- [x] Corriger backend pour accepter tous les champs
- [x] Corriger tous les noms de champs Airtable
- [x] Corriger conversion NPA string → number
- [x] Améliorer copywriting ("rabais de groupe")
- [x] Ajouter "Tout sélectionner" pour les polices
- [x] Simplifier labels polices + ajouter Protection juridique + Dégâts d'eau
- [x] Validation complète avec messages d'erreur précis
- [x] CSS Header : Cacher texte logo
- [x] Bouton "← Retour" pour préserver données
- [x] Auto-complétion NPA → Localité avec API Zippopotam.us
- [x] Champs Employeur + Taux d'activité pour Employé(e)
- [x] Taux d'activité AUSSI pour Indépendant(e)
- [x] Message humoristique 150% (Indépendant + Employé)
- [x] Corrections TypeScript Durabilis.tsx (0 erreur)

## 🔥 BUGS CRITIQUES (PRIORITÉ MAXIMALE)

- [x] **BUG SAISIE LOCALITÉ BLOQUÉE** : La key dynamique empêche la saisie manuelle, supprimée complètement

## 🔥 BUGS CRITIQUES RÉSOLUS (Anciens)

- [x] **BUG VALIDATION EMPLOYÉS** : Permettre 0 employés pour les entreprises immobilières
- [x] **BUG LOCALITÉ VIDE** : Railway n'a pas redéployé la V6, forcer le déploiement

## 🔥 BUGS CRITIQUES RÉSOLUS

- [x] **BUG CALCUL PRIX STRIPE** : Erreur 500 lors du calcul du prix (client.getStripePrice)
  - ✅ Filtres Airtable corrigés avec field IDs
  - ✅ Calcul dynamique du nombre de membres (plus besoin de champ Airtable)
  - ✅ 3 mutations corrigées (create, getStripePrice, createCheckoutSession)

- [x] **API Zippopotam 404** : Remplacer par OpenPLZ (API suisse complète)
  - ✅ AddressAutocomplete.tsx réécrit avec OpenPLZ
  - ✅ Plus d'erreurs 404 sur NPA valides

- [x] **Auto-complétion BIDIRECTIONNELLE** :
  - [x] NPA → Localité (déjà fait)
  - [x] Localité → NPA (nouveau !)
  - ✅ Exemple : "Bure" → NPA devient "2915"

## 📝 ERREURS TYPESCRIPT (93 erreurs restantes)

- [ ] Corriger erreurs TypeScript dans Mapping360.tsx (20+ erreurs)
- [ ] Corriger erreurs TypeScript dans ParentsEnfants.tsx (10+ erreurs)
- [ ] Corriger erreurs TypeScript dans Merci.tsx (3 erreurs)
- [ ] Corriger autres erreurs TypeScript (60+ erreurs dans d'autres fichiers)

## 🎨 Améliorations UX AddressAutocomplete (Terminé)

- [x] Ajouter indicateur visuel vert (✓) sur le champ NPA quand une localité est trouvée automatiquement
- [x] Pré-remplir automatiquement le canton dans un champ caché pour l'envoyer à Airtable
- [x] Ajouter un message d'aide sous les champs : "Tapez votre NPA ou votre localité, l'autre champ se remplira automatiquement"
- [x] Ajouter animation bounce sur l'icône verte ✓ pour la rendre plus visible
- [x] Afficher le canton trouvé dans le message d'aide (ex: "✓ Porrentruy, Jura")

## 🚀 PROCHAINES FONCTIONNALITÉS

- [ ] Code de parrainage à l'étape 2
- [ ] Validation temps réel du code
- [ ] Afficher rabais immédiatement
