# TODO - WIN WIN Finance Website

## 🎯 SYSTÈME DE GROUPES FAMILIAUX (SOLUTION 1 : ID GROUPE PARTAGÉ)

### Phase 1 : Airtable
- [x] Créer le champ "ID Groupe" dans la table Clients (type: Single line text)
- [x] Créer un script de migration pour initialiser ID Groupe = Code Parrainage par défaut
- [ ] **ACTION MANUELLE** : Regrouper les familles existantes (voir documentation Notion)

### Phase 2 : Code du site web
- [x] Modifier le code d'inscription pour copier l'ID Groupe du parrain
- [x] Modifier le calcul du rabais pour utiliser ID Groupe au lieu de Code Groupe Familial
- [x] Mettre à jour tous les filtres Airtable pour utiliser ID Groupe

### Phase 3 : Email personnalisé de facturation
- [x] Créer le template HTML de l'email personnalisé
- [x] Ajouter la section "Nouveautés WIN WIN Finance" (nouveau site + recherche LPP)
- [x] Ajouter le lien vers www.winwin.swiss
- [x] Ajouter le lien vers https://winwin.recherche-libre-passage.ch/fr/homepage
- [x] Ajouter le lien de parrainage personnalisé
- [x] Simplifier le tableau des rabais (sans formule de calcul)
- [x] Utiliser le montant DYNAMIQUE (prixBase, rabaisPourcent, prixFinal)
- [x] Créer la fonction d'envoi d'email (sendAnnualInvoiceEmail.ts)
- [ ] **TODO** : Intégrer l'envoi d'email dans le router de facturation
- [ ] **TODO** : Implémenter un service d'envoi d'email réel (SendGrid, AWS SES, etc.)

### Phase 4 : Facturation automatique Stripe
- [x] L'endpoint API `/api/billing/create-annual-invoice` existe déjà
- [x] Création de facture Stripe avec prix dynamique implémentée
- [ ] **TODO** : Créer l'automation Airtable qui appelle l'endpoint chaque jour
- [ ] **TODO** : Tester la facturation avec Olivier Neukomm

### Phase 5 : Documentation Notion
- [x] Créer une page Notion dans l'espace WIN WIN
- [x] Documenter le système de groupes familiaux (ID Groupe)
- [x] Documenter la facturation automatique annuelle
- [x] Instructions manuelles pour regrouper les familles dans Airtable
- [x] Liste des colonnes Airtable devenues inutiles (à supprimer)
- [x] Guide de test complet
- [x] FAQ et dépannage

## 📋 ACTIONS MANUELLES REQUISES

### 1. Regrouper les familles dans Airtable
**Voir documentation Notion** : https://www.notion.so/2f8dd860ea518130a0e7e9a97eb48058

**Familles à regrouper :**
- Famille Neukomm (9 membres)
- Famille Vauthier (2 membres)
- Famille Morel (4 membres)
- Famille Jubin (4 membres)
- Famille Apikian (2 membres)
- Famille Monaco (2 membres)
- Famille Clerc (2 membres)
- Famille Chavanne (3 membres)
- Famille Saunier (2 membres)
- Famille Bussat (3 membres)
- Famille Nussbaum (2 membres)
- Famille Evan (2 membres)

### 2. Supprimer les colonnes obsolètes dans Airtable
- `Code Groupe Familial` (obsolète, remplacé par ID Groupe)
- `Groupe Familial` (obsolète, remplacé par ID Groupe)

### 3. Implémenter un service d'envoi d'email
**Options :**
- SendGrid
- AWS SES
- Mailgun
- Postmark

**Fichier à modifier :** `server/_core/sendAnnualInvoiceEmail.ts`

### 4. Créer l'automation Airtable
**Déclencheur :** Chaque jour à 8h00
**Condition :** `Date prochaine facturation` ≤ AUJOURD'HUI
**Action :** Appeler l'endpoint `/api/billing/create-annual-invoice`

## 🐛 BUGS EXISTANTS (NON LIÉS À CE PROJET)
- [ ] Corriger les erreurs TypeScript dans Talentis.tsx (82 erreurs)

## ✅ RÉSUMÉ DU PROJET

**Ce qui a été fait :**
1. ✅ Système de groupes familiaux avec champ "ID Groupe"
2. ✅ Migration de 148 clients existants
3. ✅ Code du site web mis à jour pour utiliser ID Groupe
4. ✅ Email HTML personnalisé créé (nouveau site, recherche LPP, parrainage, rabais)
5. ✅ Fonction d'envoi d'email créée
6. ✅ Documentation Notion complète

**Ce qu'il reste à faire :**
1. ❌ Regrouper manuellement les familles dans Airtable
2. ❌ Intégrer l'envoi d'email dans le router
3. ❌ Implémenter un service d'envoi d'email réel
4. ❌ Créer l'automation Airtable
5. ❌ Tester la facturation avec Olivier Neukomm

### Phase 8 : Amélioration de l'explication du service LPP
- [x] Corriger "recherche d'avoir" → "recherche d'avoirs" (avec s)
- [x] Ajouter une explication concrète du problème (argent oublié sur anciens comptes)
- [x] Ajouter les chiffres clés (CHF 12'838.-, 1.3 milliard retrouvés, 1 Suisse sur 4)
- [x] Rendre l'appel à l'action plus clair et urgent
- [x] Mettre à jour le template HTML de l'email

### Phase 9 : Précision smartphone pour la recherche LPP
- [x] Ajouter le conseil "Faites la demande depuis votre smartphone"
- [x] Ajouter la liste des documents nécessaires (numéro AVS, photo recto/verso carte d'identité)
- [x] Mettre à jour le template HTML de l'email
