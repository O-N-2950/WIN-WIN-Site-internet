
- [x] Synchroniser listes déroulantes questionnaire avec Airtable
- [x] Implémenter validation IBAN stricte avec auto-formatage
- [x] Corriger backend pour accepter tous les champs
- [x] Corriger tous les noms de champs Airtable
- [x] Corriger conversion NPA string → number
- [x] Améliorer copywriting ("rabais de groupe")
- [x] Ajouter "Tout sélectionner" pour les polices
- [x] Simplifier labels polices + ajouter Protection juridique + Dégâts d'eau
- [x] Validation complète avec messages d'erreur précis

## 🐛 BUGS CRITIQUES EN COURS

- [x] **CSS Header** : Cacher le texte "WIN WIN Finance Group" (garder uniquement le logo)
  - Problème : Le texte déborde et recouvre les onglets de navigation
  - Solution : Modifier Header.tsx ligne 40 pour cacher le texte sur tous les écrans

- [x] **UX Critique** : Ajouter bouton "Retour" pour revenir en arrière sans perdre les données
  - Problème : Si l'utilisateur clique sur "Ajouter mon Entreprise" JUSTE POUR VOIR, tout s'efface
  - Solution : Sauvegarder l'état précédent et ajouter un bouton "Annuler" qui restaure les données
  - Workflow :
    1. Utilisateur remplit dossier PRIVÉ → "Dossier enregistré !"
    2. Clique "Ajouter mon Entreprise" → Nouveau formulaire vide
    3. Clique "Annuler" → Retour à l'écran "Dossier enregistré !" avec données intactes
    4. Peut finaliser avec "Terminer & Signer"

- [ ] **Attendre Railway** : Vérifier que le nouveau déploiement (commit 47972c2) fonctionne
  - Railway doit redéployer avec la correction parseInt(npa)
  - Tester enregistrement Airtable avec Oli Exemple3

## 🔍 AUTO-COMPLÉTION NPA (EN ATTENTE)

- [x] Rechercher API Zippopotam.us
- [ ] Implémenter auto-complétion NPA → Localité dans AddressAutocomplete.tsx
- [ ] Ajouter debouncing (500ms)
- [ ] Gérer cas multiples localités

## 🚀 PROCHAINES FONCTIONNALITÉS

- [ ] Code de parrainage à l'étape 2
- [ ] Validation temps réel du code
- [ ] Afficher rabais immédiatement
