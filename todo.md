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


---

# 🚨 PHASE 1 URGENT - RÉPARATION WORKFLOW SIGNATURE (30 janvier 2026)

## Problème critique identifié par Claude IA
Le système de signature ne fonctionne PAS actuellement :
- Mutations `workflow.uploadSignature` et `customers.createFromSignature` n'existent pas
- Signatures jamais enregistrées dans Airtable
- PDF mandat jamais généré

## Mutations tRPC manquantes
- [x] Créer mutation `workflow.uploadSignature` dans server/routers.ts
- [x] Créer mutation `customers.createFromSignature` dans server/routers.ts

## Génération PDF du mandat
- [x] Installer puppeteer (`pnpm add puppeteer`)
- [x] Copier mandat-template.html dans server/email-templates/
- [x] Créer fonction generateMandatPDF dans server/_core/
- [x] Implémenter remplacement variables {{CLIENT_NAME}}, {{CLIENT_ADDRESS}}, {{CLIENT_NPA}}, {{CLIENT_LOCALITY}}
- [x] Implémenter conversion signature canvas → PNG
- [x] Implémenter upload PNG signature vers Airtable (colonne #197 "Signature client")
- [x] Implémenter génération PDF avec puppeteer
- [x] Implémenter upload PDF vers Airtable (colonne #194 "MANDAT DE GESTION signé")

## Intégration Airtable
- [x] Vérifier colonnes Airtable (Signature client fldXxORXbvcHPVTio, MANDAT DE GESTION signé fldFlOqiGic9Yv3on)
- [x] Implémenter upload attachments vers Airtable via API
- [x] Corriger Base ID (appZQkRJ7PwOtdQ3O)
- [x] Corriger tous les Field IDs avec les vraies valeurs
- [ ] Tester upload fichiers PNG et PDF

## Tests complets
- [ ] Tester workflow complet : signature → PNG → PDF → Airtable
- [ ] Vérifier que Stripe se déclenche après signature
- [ ] Vérifier système groupes familiaux et rabais fonctionnent

## Déploiement
- [ ] Pousser sur GitHub
- [ ] Vérifier déploiement Railway
- [ ] Tester en production sur www.winwin.swiss

---

# 📋 PHASE 2 - Après Phase 1 validée

## Migration Cloudinary → Airtable
- [ ] Migrer formulaire contact de Cloudinary vers Airtable Attachments
- [ ] Supprimer dépendances Cloudinary (variables d'environnement)
- [ ] Tester upload pièces jointes formulaire contact


---

# 🚨 BUG CRITIQUE - L'étape signature est sautée

- [x] Vérifier que la route `/signature` existe dans App.tsx
- [x] Vérifier où redirige le bouton "Terminer & Signer" du questionnaire
- [x] Corriger le workflow pour : Questionnaire → SIGNATURE → Paiement (ligne 424 Questionnaire.tsx)
- [x] Ajouter sauvegarde des données dans WorkflowContext avant redirection
- [x] Modifier Signature.tsx pour lire l'email depuis l'URL ET le workflow
- [x] Pousser les corrections sur GitHub (commit 1e095d6)
- [ ] Tester que la page de signature s'affiche bien avant le paiement


---

# 🚨🚨 BUG CRITIQUE - Site DOWN - WorkflowProvider manquant

**ERREUR:** `useWorkflow must be used within a WorkflowProvider`

- [x] Vérifier que client/src/contexts/WorkflowContext.tsx existe
- [x] Vérifier que WorkflowProvider est bien wrappé dans App.tsx ou main.tsx
- [x] Corriger le provider (ajouté dans main.tsx)
- [ ] Pousser la correction sur GitHub
- [ ] Vérifier que le site fonctionne à nouveau


---

# 🚨 ERREUR 400 - Paramètres manquants dans customers.createFromSignature

**ERREUR:** `Invalid input: expected string, received undefined path: ["clientEmail"] path: ["signatureDate"]`

- [x] Lire le schéma Zod côté serveur (server/routers.ts) pour voir TOUS les champs requis
- [x] Corriger Signature.tsx pour envoyer clientEmail (workflow.questionnaireData.email)
- [x] Corriger Signature.tsx pour envoyer signatureDate (new Date().toISOString())
- [x] Vérifier tous les autres champs requis
- [ ] Pousser sur GitHub
- [ ] Tester le workflow complet


---

# 🚨 ERREUR __dirname dans generateMandatPDF.ts (ES Modules)

**ERREUR Railway:** `ReferenceError: __dirname is not defined at generateMandatPDF`

- [x] Lire server/_core/generateMandatPDF.ts pour voir l'utilisation de __dirname
- [x] Remplacer __dirname par import.meta.url (solution ES Modules)
- [ ] Pousser sur GitHub
- [ ] Attendre redéploiement Railway
- [ ] Tester le workflow complet


---

# 🚨 ERREUR FICHIER MANQUANT - mandat-template.html

**ERREUR Railway:** `ENOENT: no such file or directory, open '/app/email-templates/mandat-template.html'`

**2 PROBLÈMES :**
1. Mauvais chemin : cherche dans `email-templates/` au lieu de `pdf-templates/`
2. Fichier peut-être absent du repository GitHub

- [x] Vérifier si server/pdf-templates/mandat-template.html existe localement (OUI, dans server/email-templates/)
- [x] Corriger le chemin dans generateMandatPDF.ts (utiliser process.cwd())
- [x] Ajouter le fichier à Git si manquant (Déjà dans Git)
- [ ] Pousser sur GitHub
- [ ] Attendre redéploiement Railway
- [ ] Tester le workflow complet


---

# 🚨 ERREUR CHROME MANQUANT - Puppeteer sur Railway

**ERREUR Railway:** `Error: Could not find Chrome (ver. 144.0.7559.96)`

**PROBLÈME :** Railway n'installe pas Chrome automatiquement pour Puppeteer

**SOLUTION :** Installer Chromium via Nixpacks

- [x] Créer nixpacks.toml à la racine pour installer Chromium
- [x] Modifier generateMandatPDF.ts pour pointer vers Chromium
- [x] Ajouter les variables d'environnement Puppeteer (PUPPETEER_EXECUTABLE_PATH)
- [ ] Pousser sur GitHub
- [ ] Attendre redéploiement Railway
- [ ] Tester le workflow complet


---

# 📝 MISE À JOUR TEMPLATE MANDAT - Clarification PEP's

**CHANGEMENT :** Clarification de la ligne PEP's pour éviter l'ambiguïté sur le prix

**AVANT :**
> Analyse de prévoyance offerte aux membres PEP's (CHF 250.- - www.peps.digital)

**APRÈS :**
> Analyse de prévoyance d'une valeur de CHF 250.- offerte aux membres PEP's (www.peps.digital)

- [x] Remplacer server/email-templates/mandat-template.html par la nouvelle version
- [ ] Pousser sur GitHub


---

# 🚨 ERREUR CHROMIUM NON INSTALLÉ - nixpacks.toml n'a pas fonctionné

**ERREUR Railway:** `Error: Browser was not found at the configured executablePath (/usr/bin/chromium)`

**PROBLÈME :** Le fichier nixpacks.toml n'a pas installé Chromium sur Railway

**SOLUTION :** Utiliser un Dockerfile personnalisé à la place

- [x] Créer Dockerfile avec installation de Chromium et toutes les dépendances
- [x] Supprimer nixpacks.toml (ne fonctionne pas)
- [ ] Pousser sur GitHub
- [ ] Railway détectera automatiquement le Dockerfile
- [ ] Tester le workflow complet


---

# 🚨 ERREUR DOCKERFILE - Ordre des copies incorrect

**ERREUR Railway:** `ENOENT: no such file or directory, open '/app/patches/wouter@3.7.1.patch'`

**PROBLÈME :** Le Dockerfile copie package.json et lance pnpm install AVANT de copier le dossier patches/

**SOLUTION :** Copier TOUT le code (y compris patches/) AVANT pnpm install

- [x] Corriger le Dockerfile : déplacer COPY . . avant pnpm install
- [ ] Pousser sur GitHub
- [ ] Railway redéploiera automatiquement
- [ ] Tester le workflow complet


---

# 🚨 ERREUR CHEMIN CHROMIUM - /usr/bin/chromium n'existe pas

**ERREUR Railway:** `Error: Browser was not found at the configured executablePath (/usr/bin/chromium)`

**PROBLÈME :** Le chemin /usr/bin/chromium n'existe pas dans le conteneur Docker

**SOLUTION :** Détecter dynamiquement le chemin de Chromium

- [x] Créer fonction findChromiumPath() dans generateMandatPDF.ts
- [x] Modifier Dockerfile pour détecter le chemin Chromium
- [x] Utiliser la détection dynamique dans puppeteer.launch()
- [ ] Pousser sur GitHub
- [ ] Railway redéploiera automatiquement
- [ ] Tester le workflow complet


---

# 🚀 SOLUTION FINALE - Image Docker officielle Puppeteer

**PROBLÈME :** Impossible de trouver le bon chemin Chromium dans le conteneur

**SOLUTION :** Utiliser l'image Docker officielle de Puppeteer qui a TOUT préinstallé

- [x] Remplacer Dockerfile par image ghcr.io/puppeteer/puppeteer:23.11.1
- [x] Simplifier generateMandatPDF.ts (supprimer findChromiumPath)
- [x] Utiliser puppeteer.launch() sans executablePath
- [ ] Pousser sur GitHub
- [ ] Railway redéploiera automatiquement
- [ ] Tester le workflow complet


---

# 🚀 MIGRATION PUPPETEER → PDFSHIFT

**DÉCISION :** Abandonner Puppeteer pour PDFShift (service dédié, plus simple)

**CLÉ API PDFSHIFT :** sk_28473ca5506da79d6cbb41a3b5a198a9dafb7c79

- [x] Supprimer Dockerfile
- [x] Désinstaller puppeteer et puppeteer-core
- [x] Remplacer generateMandatPDF() par appel à PDFShift
- [ ] Ajouter PDFSHIFT_API_KEY dans Railway (ACTION OLIVIER)
- [ ] Supprimer variables Puppeteer de Railway (ACTION OLIVIER)
- [ ] Commit et push
- [ ] Tester le workflow complet


---

# 🚨 ERREUR DOUBLE UPLOAD - PATCH inutile

**PROBLÈME :** Après `uploadToAirtableAttachment()`, un PATCH est fait pour "mettre à jour" les attachments, mais l'API Attachments les ajoute **DIRECTEMENT** !

**SOLUTION :** Supprimer le bloc PATCH (lignes ~472-499)

- [x] Supprimer le bloc PATCH dans customers.createFromSignature
- [ ] Commit et push
- [ ] Tester le workflow complet


---

# 🚨 ERREUR 404 - ENDPOINT AIRTABLE INCORRECT

**PROBLÈME :** Utilisation du nom de la table (`/Clients/`) au lieu de l'ID de la table (`/tblhcE5L98pE6h22T/`)

**SOLUTION :** Utiliser le table ID dans l'endpoint Airtable Attachments

- [x] Ajouter `airtableClientsTableId: 'tblhcE5L98pE6h22T'` dans env.ts
- [x] Corriger l'endpoint dans airtableAttachments.ts (ligne ~47)
- [ ] Commit et push
- [ ] Tester le workflow complet


---

# 🚀 MIGRATION API AIRTABLE ATTACHMENTS → CLOUDINARY

**PROBLÈME :** L'API Airtable Attachments ne fonctionne pas comme prévu

**SOLUTION :** Utiliser Cloudinary (déjà configuré) pour uploader les fichiers

- [x] Installer cloudinary (`pnpm add cloudinary`)
- [x] Créer fonction uploadToCloudinary dans server/_core/cloudinaryUpload.ts
- [x] Modifier routers.ts pour utiliser Cloudinary
- [x] PATCH Airtable avec les URLs Cloudinary
- [x] Commit et push
- [ ] Tester le workflow complet

---

# 🐛 DEBUG: PDF MANQUANT DANS AIRTABLE

**PROBLÈME :** La signature PNG apparaît dans Airtable, MAIS le PDF n'apparaît pas

**HYPOTHÈSE :** Le PATCH avec les 2 champs ne fonctionne pas correctement

- [x] Ajouter logs détaillés dans routers.ts (signatureUrl, pdfUrl, PATCH body, PATCH response)
- [x] Commit et push (commit 8e8ebdc)
- [x] Olivier refait un test pour voir les logs complets
- [x] Analyser les logs pour identifier le problème

**PROBLÈME IDENTIFIÉ :** Cloudinary utilise des paths différents selon le type :
- Images (PNG) → /image/upload/ ✅
- PDFs → /raw/upload/ ❌ (on utilisait /image/upload/ pour tout)

- [x] Ajouter paramètre resource_type dans uploadToCloudinary
- [x] Modifier routers.ts pour spécifier 'image' (signature) et 'raw' (PDF)
- [ ] Commit et push
- [ ] Tester le workflow complet
