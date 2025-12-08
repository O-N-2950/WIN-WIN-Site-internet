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

- [ ] **BUG CALCUL PRIX STRIPE** : Erreur 500 lors du calcul du prix (client.getStripePrice)
  - Vérifier que la mutation existe dans server/routers.ts
  - Vérifier les credentials Airtable (AIRTABLE_BASE_ID, AIRTABLE_API_KEY)
  - Vérifier la formule "Nb membres famille actifs" dans Airtable

- [ ] **API Zippopotam 404** : Remplacer par OpenPLZ (API suisse complète)
  - URL : https://openplzapi.org/ch/Localities?postalCode=2950
  - Plus fiable pour TOUS les NPA suisses

- [ ] **Auto-complétion BIDIRECTIONNELLE** :
  - [x] NPA → Localité (déjà fait)
  - [ ] Localité → NPA (nouveau !)
  - Exemple : "Bure" → NPA devient "2915"

## 📝 ERREURS TYPESCRIPT (93 erreurs restantes)

- [ ] Corriger erreurs TypeScript dans Mapping360.tsx (20+ erreurs)
- [ ] Corriger erreurs TypeScript dans ParentsEnfants.tsx (10+ erreurs)
- [ ] Corriger erreurs TypeScript dans Merci.tsx (3 erreurs)
- [ ] Corriger autres erreurs TypeScript (60+ erreurs dans d'autres fichiers)

## 🚀 PROCHAINES FONCTIONNALITÉS

- [ ] Code de parrainage à l'étape 2
- [ ] Validation temps réel du code
- [ ] Afficher rabais immédiatement
