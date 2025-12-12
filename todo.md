# TODO - WIN WIN Finance Group

## 🔥 BUGS CRITIQUES CORRIGÉS (11 DÉC 2025)

- [x] BUG #1: Code de parrainage vide sur la page Paiement → Récupéré depuis Airtable (field fldEx4ytlCnqPoSDM)
- [x] BUG #2: Messages de partage WhatsApp/Telegram/Email/SMS → Refaits complètement avec bon domaine (www.winwin.swiss)
- [x] BUG #3: Email client non enregistré dans "Contact E-mail" → Déjà présent (fldFdqxwos16iziy3)
- [x] BUG #4: Email client non enregistré dans "Email du client (table client)" → Ajouté (fldI0sr2QLOJYsZR6)

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

## 🔥 BUG NOMS CHAMPS AIRTABLE (EN COURS)

- [x] **BUG NOMS CHAMPS** : Envoie "Contact Nom" au lieu de "Nom", "Contact Prénom" au lieu de "Prénom" → Corrigé

## 🔥 BUG CODE PARRAINAGE (EN ATTENTE)

- [ ] **BUG AFFICHAGE CODE PARRAINAGE** : Le backend retourne groupeFamilial mais le frontend ne l'affiche pas

## 🔥 SIMPLIFICATION NPA/LOCALITÉ/CANTON (TERMINÉ)

- [x] Remplacer AddressAutocomplete par champs texte simples (NPA + Localité)
- [x] Ajouter dropdown Canton avec valeurs exactes Airtable (26 cantons)
- [x] Supprimer tous les contrôles (icônes vertes, animations, messages)

## 🔥 BUGS CRITIQUES RÉSOLUS (V10)

- [x] **BUG CANTON VIDE** : Airtable refuse Canton vide (INVALID_MULTIPLE_CHOICE_OPTIONS) → Ne pas envoyer si vide

## 🔥 BUGS CRITIQUES RÉSOLUS (V9 - suite)

- [x] **SUPPRIMER 150%** : Airtable n'accepte pas 150%, supprimé du formulaire (type + SelectItem + message)

## 🔥 BUGS CRITIQUES RÉSOLUS (V9)

- [x] **BUG NOM CHAMP AIRTABLE** : Airtable refuse "Taux d'activité" → Le champ s'appelle "Taux d'activité %" (avec %)

## 🔥 BUGS CRITIQUES RÉSOLUS (V8)

- [x] **BUG ERREUR ENVOI AIRTABLE** : "Erreur lors de l'envoi. Vérifiez vos informations." → Manquait employeur + tauxActivite dans schema Zod
- [x] **BUG FORMAT DATE NAISSANCE** : Affiche "1973-05-12" au lieu de "12.05.1973" → Formaté avec toLocaleDateString

## 🔥 BUGS CRITIQUES RÉSOLUS (Récents)

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

## 🔥 BUG URGENT CORRIGÉ (11 DÉC 2025 - 12:45)

- [x] BUG #5: Code de parrainage vide → Généré côté backend (PRENOM-XXXX) au lieu d'attendre la formule Airtable

## 🔥🔥🔥 BUGS CRITIQUES SYSTÈME PARRAINAGE (11 DÉC 2025 - 13:15)

- [x] BUG #6 CRITIQUE: Système de parrainage complètement cassé → CORRIGÉ
  - ✅ Questionnaire.tsx récupère URLSearchParams (?ref=CODE)
  - ✅ Code de parrainage envoyé au backend (codeParrainageRef)
  - ✅ Backend cherche le parrain par code (FIND dans Airtable)
  - ✅ Nouveau client lié au groupe familial du parrain
  - ✅ Rabais calculé automatiquement (nb membres groupe)
- [x] BUG #7: Code de parrainage VIDE dans les messages de partage → Fixé avec loader

## 🎨 UX - Amélioration CORRIGÉE (11 DÉC 2025 - 14:30)

- [x] Ajouter texte explicatif au-dessus de "Coordonnées bancaires" : "Sur quel compte souhaitez-vous recevoir vos prestations en cas de sinistre ?"
  - Ajouté dans section Entreprise (ligne 733-735)
  - Ajouté dans section Privé (ligne 1271-1273)

## 🔥🔥🔥 BUGS CRITIQUES RABAIS + MESSAGE CORRIGÉS (11 DÉC 2025 - 14:45)

- [x] BUG #8 CRITIQUE: Le rabais n'est PAS appliqué sur la page Paiement → CORRIGÉ
  - CAUSE: getStripePrice appelé immédiatement après création, Airtable n'a pas eu le temps de calculer nb membres
  - SOLUTION: Délai de 2 secondes avant d'appeler loadPriceInfo() pour laisser Airtable mettre à jour
  - RÉSULTAT: Le rabais 4% (177.60 CHF) s'affiche correctement pour 2 membres
- [x] BUG #9: Emojis cassés dans les messages WhatsApp/Telegram → CORRIGÉ
  - CAUSE: encodeURIComponent() encode les emojis en %F0%9F%91%8B, affichés comme ◆
  - SOLUTION: Retrait des emojis, remplacés par des puces • (plus sûr)
  - RÉSULTAT: Messages propres et lisibles sur tous les canaux

## 🔥🔥🔥 BUG CRITIQUE CRÉATION CLIENT CORRIGÉ (11 DÉC 2025 - 15:10)

- [x] BUG #10 BLOQUANT: Impossible de créer le client dans Airtable → CORRIGÉ
  - CAUSE: Formule Airtable incorrecte `FIND('CODE',{field})>0` au lieu de `{field}='CODE'`
  - SOLUTION: Remplacement par `{fldEx4ytlCnqPoSDM}='${input.codeParrainageRef}'`
  - RÉSULTAT: La création du client fonctionne maintenant

## 🔥🔥🔥 BUG SYSTÈME PARRAINAGE FAMILIAL (11 DÉC 2025 - 20:05)

- [ ] BUG #11 CRITIQUE: Le nouveau client n'intègre pas le groupe familial du parrain
  - Code de parrainage détecté dans l'URL (CODE-1MQY)
  - Erreur: "TRPCClientError: Impossible de créer le client dans Airtable"
  - Le nouveau client devrait rejoindre le groupe familial du parrain
  - Les rabais du groupe doivent s'ajuster automatiquement
  - Le prix calculé sur le site doit tenir compte du rabais de groupe

- [ ] Analyser les logs Railway pour identifier la cause exacte
- [ ] Corriger la logique de création du groupe familial
- [ ] Vérifier que les formules Airtable calculent bien les rabais
- [ ] Tester le workflow complet avec un code de parrainage réel

## 🔥 FINALISATION SYSTÈME PARRAINAGE (11 DÉC 2025 - 21:00)

- [ ] Backend : Marquer le parrain comme "Membre fondateur" quand son code est utilisé
- [ ] Airtable : Formule pour copier automatiquement le "Groupe familial" du parrain
- [ ] Tester le workflow complet avec le code OLIO-1MQY
- [ ] Vérifier que les rabais s'ajustent automatiquement (0% → 4%)


## 🚀 SYSTÈME DE CALCUL AUTOMATIQUE DES RABAIS (12 DÉC 2025)

### Phase 1 : Backend - Calcul automatique des rabais
- [x] Créer le service de calcul des membres du groupe familial (countGroupMembers)
- [x] Créer le service de calcul du rabais familial (calculateFamilyDiscount)
- [x] Créer le service de mise à jour Airtable (updateGroupDiscounts)
- [x] Créer l'endpoint tRPC pour recalculer les rabais d'un groupe
- [x] Créer l'endpoint tRPC pour recalculer tous les groupes (admin only)

### Phase 2 : Intégration et tests
- [x] Intégrer le calcul automatique lors de l'inscription d'un nouveau client
- [ ] Tester avec la famille Jolidon (4 membres → 8% de rabais)
- [ ] Vérifier la mise à jour Airtable (Nb membres famille actifs + Rabais familial %)
- [ ] Tester le code de parrainage OLIO-1MQY

### Phase 3 : Livraison
- [ ] Créer un checkpoint
- [ ] Documentation du système
- [ ] Livrer au client


## 🐛 CORRECTIONS BUGS CRITIQUES (12 DÉC 2025 - 03:30)

### Bug 1 : Parrain marqué comme "Membre fondateur" même s'il est déjà dans un groupe
- [x] Vérifier si le parrain a déjà une relation familiale avant de le marquer
- [x] Ne marquer comme "Membre fondateur" QUE si le parrain est seul (pas de relation existante)
- [ ] Tester avec un parrain déjà dans un groupe de 10 personnes (20% de rabais)

### Bug 2 : Multi-mandats (email) ne créent pas les liens bidirectionnels
- [x] Stocker l'ID du parrain pour PRIORITÉ 2 (email)
- [x] Créer les liens bidirectionnels pour les multi-mandats
- [x] Marquer le parrain comme "Membre fondateur" pour les multi-mandats (si seul)

### Amélioration : Ajouter "Employé(e)" dans les relations familiales
- [ ] Vérifier que "Employé(e)" est bien dans la liste déroulante Airtable
- [ ] Permettre aux entreprises de parrainer leurs employés
