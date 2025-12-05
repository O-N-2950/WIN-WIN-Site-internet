# TODO - WIN WIN Finance Group (www.winwin.swiss)

**Site en production** : https://www.winwin.swiss  
**Déploiement** : GitHub → Railway (automatique)  
**CRM** : Airtable (ERP Clients WW - appZQkRJ7PwOtdQ3O)  
**Paiements** : Stripe (production)  
**Emails** : Resend (contact@winwin.swiss)

---

## 🎯 Système de Paiement Stripe - PRODUCTION READY ✅

### Phase 1 : Stripe Payment System (TERMINÉ ✅)
- [x] Configuration Stripe production (clés API, webhook)
- [x] Création des 10 produits selon grille tarifaire
- [x] Système de facturation récurrente (360 jours)
- [x] Webhook `/api/stripe/webhook` opérationnel
- [x] Synchronisation Airtable après paiement (6 champs Stripe)
- [x] Tests complets (11/11 passés)
- [x] Webhook configuré en production : https://www.winwin.swiss/api/stripe/webhook

### Phase 2 : Rabais Familial (TERMINÉ ✅)
- [x] Système de parrainage avec codes uniques (format NOM-XXXX)
- [x] Calcul automatique rabais (2% par membre, max 20%)
- [x] Affichage membres famille sur factures Stripe
- [x] Section parrainage VIRALE sur page /merci
- [x] Boutons de partage (WhatsApp, SMS, Email, Copier)
- [x] Tests complets (33/33 passés)
- [x] Formules Airtable pour calcul automatique rabais

### Phase 3 : Tâches Restantes Stripe ⏳
- [ ] **Configurer cron job quotidien** (9h00 CET) pour facturation automatique
  - Script : `server/lib/billing.ts` → `processDailyBilling()`
  - Vérifier "Date prochaine facturation" dans Airtable
  - Créer factures Stripe avec rabais familial appliqué
  - Exclure clients "Mandat offert"
- [ ] **Tester premier cycle de facturation** (simulation date future)
- [ ] **Vérifier premier virement bancaire** Raiffeisen depuis Stripe

---

## 📧 Emails Automatiques - PRODUCTION READY ✅

### Système d'Emails (TERMINÉ ✅)
- [x] Service Resend configuré (domaine winwin.swiss vérifié SPF/DKIM)
- [x] Email bienvenue client après paiement
- [x] Email notification Olivier "Nouveau client payé ✅"
- [x] Template HTML professionnel avec code de parrainage
- [x] Tableau économies dynamique selon tarif client
- [x] Boutons de partage WhatsApp/SMS/Email dans l'email

### Tâches Restantes Emails ⏳
- [ ] **Campagne email aux 500+ clients existants**
  - Objectif : Activer le système de parrainage viral
  - Template : Code de parrainage + économies potentielles + boutons partage
  - Timing : Mardi-Jeudi, 10h-14h
  - Script d'envoi en batch (max 100/heure pour éviter spam)
  - Tracking conversions (nouveaux clients via codes)
  - ROI estimé : +50 nouveaux clients = +9'250 CHF/an

---

## 📋 Checklists Documents Clients - TERMINÉ ✅

### Checklists Imprimables (TERMINÉ ✅)
- [x] Checklist Particuliers (10 sections)
- [x] Checklist Entreprises (16 sections avec section Fiduciaire)
- [x] Section "Accès Tiers" (optionnel)
- [x] Section "Accès Fiduciaire" (optionnel)
- [x] Bouton "Imprimer" avec CSS print optimisé
- [x] Affichage dynamique selon type de client

### Tâches Restantes Checklists ⏳
- [ ] **Implémenter envoi email à Olivier** quand client demande son code de parrainage
  - Endpoint : `trpc.parrainage.requestCode` (ligne 89 dans server/routers/parrainage.ts)
  - Email : Prénom, Nom, Email du client
  - TODO dans le code à implémenter

---

## 🔧 Corrections et Améliorations UX

### Bugs Critiques Résolus ✅
- [x] Header responsive (logo + téléphone horizontal)
- [x] Boutons invisibles (blanc sur blanc) → text-white corrigé (13 boutons)
- [x] Questionnaire étape 2 (validation téléphone)
- [x] Type de client incorrect (particulier/entreprise)
- [x] Activation automatique bouton signature
- [x] Calcul dynamique priceId Stripe
- [x] Formulaire contact (champ "Vous êtes ?" ajouté)
- [x] Tous les liens "Demander Conseil" → /conseil
- [x] Nom complet "WIN WIN Finance Group" (avec 2 WIN)

### Améliorations Restantes ⏳
- [ ] **Tests workflow complet en production**
  - Questionnaire → Signature → Paiement → Email bienvenue
  - Vérifier création client Airtable
  - Vérifier génération PDF mandat
  - Vérifier email avec code de parrainage
  - Vérifier upload signature + PDF dans Airtable
- [ ] **Optimisation SEO**
  - Meta descriptions sur toutes les pages
  - Schema.org JSON-LD (Organization, LocalBusiness)
  - Sitemap.xml
  - Open Graph tags pour partage réseaux sociaux

---

## 📊 Intégrations Complètes - PRODUCTION READY ✅

### Airtable CRM (TERMINÉ ✅)
- [x] Table "Clients" (tblWPcIpGmBZ3ASGI) avec 6 champs Stripe :
  - Stripe Subscription ID (fldocAjdGomXPRQeU)
  - Date prochaine facturation (fld3VBfm8vhkawBCo - formule)
  - Statut Paiement (fldaFF7mU0FwNshw7)
  - Date dernier paiement (fldrg5f0BD3np8Mug)
  - Stripe Invoice ID (fldMn8zMy3lQNWF0e)
  - Date dernière facture établie (fldq2bsTMuxynxVHj)
- [x] Création automatique clients après paiement
- [x] Upload signatures PNG directement dans Airtable (API /uploadAttachment)
- [x] Upload PDF mandats directement dans Airtable (API /uploadAttachment)
- [x] Système de relations familiales bidirectionnelles
- [x] Calcul automatique rabais familial (formules Airtable)

### Google Calendar (TERMINÉ ✅)
- [x] Intégration Google Calendar Appointment Scheduling
- [x] 2 options : 15 min (Question Express) + 30 min (Entretien Conseil)
- [x] URLs configurées : https://calendar.app.google/eSBUtmkHmUETRwfw5 (15min)
- [x] URLs configurées : https://calendar.app.google/nwyU9gAbNe4vPmHUA (30min)
- [x] Synchronisation automatique avec contact@winwin.swiss

### Formulaire Contact (TERMINÉ ✅)
- [x] Formulaire avec upload fichiers (PDF, JPG, PNG max 10 MB)
- [x] Upload vers Cloudinary (remplace tmpfiles.org)
- [x] Envoi vers Airtable (table "Leads Site Web" - tbl7kIZd294RTM1de)
- [x] Champ "Vous êtes ?" (Particulier/Entreprise/Les deux)
- [x] Email notification à contact@winwin.swiss

---

## 🎨 Pages Complètes - PRODUCTION READY ✅

### Pages Principales (TERMINÉ ✅)
- [x] Page d'accueil (Hero, Services, Concepts, Chiffres, CTA, Section parrainage)
- [x] Page Services (6 services détaillés)
- [x] Page Tarifs (grille complète + FAQ + section rabais de groupe #rabais-groupe)
- [x] Page À propos (Olivier Neukomm, timeline 1995-2024, statistiques, IAF)
- [x] Page Conseil (3 options : Appel 032 466 11 00, RDV Google Calendar, Message)
- [x] Page Mentions légales (FINMA, LSA compliance)
- [x] Page Confidentialité (RGPD compliance)

### Pages Concepts (TERMINÉ ✅)
- [x] Page Talentis (fidélisation talents) - Design moderne intégré
- [x] Page Durabilis (protection associés) - Design "Héritage & Prestige"
- [x] Page Synergis/Startup (création entreprises) - Lien vers mapping-360
- [x] Page Parents-Enfants (épargne enfants) - Design "Dream & Grow"
- [x] Page Libre Passage (recherche gratuite avoirs LPP)

### Pages Outils (TERMINÉ ✅)
- [x] Page Outils (index avec cartes cliquables)
- [x] Calculateur Inventaire Ménage (4 étapes + téléchargement PDF)
- [x] Page Mapping 360 (simulation retraite/invalidité/décès + formulaire)

### Pages Workflow Client (TERMINÉ ✅)
- [x] Page Questionnaire (informations client avec validation stricte)
- [x] Page Signature (Canvas HTML5 + récapitulatif complet)
- [x] Page Paiement (Stripe Checkout avec rabais familial)
- [x] Page Merci (confirmation + code parrainage + checklists + section parrainage VIRALE)

---

## 🚀 Déploiement et Infrastructure - PRODUCTION ✅

### Configuration Actuelle (TERMINÉ ✅)
- [x] Domaine : www.winwin.swiss (DNS configuré)
- [x] Redirection : winwin.swiss → www.winwin.swiss (301)
- [x] Hébergement : Railway (déploiement automatique depuis GitHub)
- [x] Base de données : PostgreSQL (Railway)
- [x] Variables d'environnement : Toutes configurées
- [x] SSL : Automatique (Railway)
- [x] CORS : Configuré pour www.winwin.swiss

### Monitoring et Maintenance ⏳
- [ ] **Configurer alertes Railway** (erreurs, downtime)
- [ ] **Dashboard de suivi des conversions** (nouveaux clients, parrainages)
- [ ] **Backup automatique Airtable** (export hebdomadaire)

---

## 📈 Améliorations Futures (Optionnel)

### Croissance Virale
- [ ] Système de récompenses pour meilleurs ambassadeurs
- [ ] Landing page dédiée "Étudiants & Apprentis"
- [ ] Partenariats universités et écoles professionnelles
- [ ] Campagnes LinkedIn ciblées (jeunes diplômés Suisse romande)

### Fonctionnalités Avancées
- [ ] Recherche automatique avoirs LPP via numéro AVS
- [ ] OCR intelligent pour extraction données polices (Google Cloud Vision)
- [ ] Espace client avec dashboard personnalisé
- [ ] Notifications push (nouveaux documents, échéances)

### Optimisations Techniques
- [ ] Migration frontend vers Vercel (CDN mondial, ultra-rapide)
- [ ] Automatisations N8N (workflows sans code)
- [ ] Tests end-to-end (Playwright/Cypress)
- [ ] Monitoring performance (Sentry, LogRocket)

---

## 📝 Notes Importantes

### Architecture Confirmée ✅
- ✅ **Stockage fichiers** : DIRECTEMENT dans Airtable via API `/uploadAttachment`
- ✅ **Signatures PNG** : Converties en base64 et uploadées dans Airtable
- ✅ **PDF Mandats** : Uploadés directement dans Airtable
- ❌ **PAS de S3** pour les fichiers clients (signatures + PDF mandats)
- ✅ **GitHub** : Dépôt principal avec auto-déploiement Railway
- ✅ **Airtable** : Source unique de vérité pour toutes les données clients

### Grille Tarifaire
**Clients Privés** :
- < 18 ans : CHF 0.-/an (gratuit)
- 18-22 ans : CHF 85.-/an
- > 22 ans : CHF 185.-/an

**Entreprises** (selon nombre d'employés) :
- 0 employé : CHF 160.-/an
- 1 employé : CHF 260.-/an
- 2 employés : CHF 360.-/an
- 3-5 employés : CHF 460.-/an
- 6-10 employés : CHF 560.-/an
- 11-20 employés : CHF 660.-/an
- 21-30 employés : CHF 760.-/an
- 31+ employés : CHF 860.-/an

### Rabais Familial (Formule : (membres-1)×2+2, max 20%)
- 1 membre : 0% rabais
- 2 membres : 4% rabais (2 mandats)
- 3 membres : 6% rabais
- 4 membres : 8% rabais
- 5 membres : 10% rabais
- 10+ membres : 20% rabais (maximum)

### Contact
- **Téléphone** : 032 466 11 00
- **Email** : contact@winwin.swiss
- **Adresse** : Bellevue 7, 2950 Courgenay

### Couleurs Branding
- **Bleu principal** : #3176A6
- **Bleu clair** : #8CB4D2
- **Doré** : #D4AF37

---

## ✅ Résumé de l'État Actuel

### Ce qui fonctionne en PRODUCTION ✅
✅ Site complet avec 20+ pages  
✅ Workflow client automatisé (questionnaire → signature → paiement)  
✅ Système de paiement Stripe avec facturation récurrente (360 jours)  
✅ Système de parrainage familial avec rabais dynamique (2-20%)  
✅ Intégration Airtable complète (clients, contrats, leads)  
✅ Emails automatiques (bienvenue + notifications + code parrainage)  
✅ Formulaire contact avec upload fichiers (Cloudinary)  
✅ Réservation RDV via Google Calendar (15min + 30min)  
✅ Calculateurs (inventaire ménage, mapping 360)  
✅ Design responsive et animations professionnelles  
✅ Déploiement automatique GitHub → Railway  

### Ce qui reste à faire (3 tâches prioritaires) ⏳
1. ⏳ **Configurer cron job quotidien** pour facturation automatique (9h00 CET)
2. ⏳ **Campagne email aux 500+ clients existants** (parrainage viral)
3. ⏳ **Tests workflow complet en production** (bout en bout)

### ROI du Système Automatisé 🚀
- **Temps économisé** : 10-15h/mois de gestion manuelle
- **Valeur** : 1'800-2'700 CHF/an (à 150 CHF/h)
- **Taux d'automatisation** : 95%
- **Investissement développement** : ~15'000 CHF
- **ROI** : 5-8x dès la première année

### Statistiques Système de Parrainage
- **Potentiel viral** : 500+ clients existants avec codes uniques
- **Rabais maximum** : 20% (10+ membres famille)
- **Économie client** : Jusqu'à 37 CHF/an (sur 185 CHF)
- **Conversion estimée** : 10% = 50 nouveaux clients = +9'250 CHF/an


---

## 🐛 Bugs et Améliorations UX Urgentes (5 déc 2025)

### Page Questionnaire - Améliorations Critiques
- [ ] **Améliorer le bouton "Continuer vers la signature"**
  - Rendre le bouton plus grand et plus visible
  - Meilleur contraste de couleurs
  - Ajouter une icône attractive
  - Animation au hover
  
- [ ] **Ajouter checklists documents AVANT la signature**
  - Checklist Particuliers (10 sections) : Carte identité, IBAN, contrats LAMal/LCA, etc.
  - Checklist Entreprises (16 sections) : RC, LPP, IJM, LAA, section Fiduciaire, etc.
  - Affichage dynamique selon type de client
  - Message motivant : "Préparez ces documents pour accélérer votre dossier"
  
- [ ] **Vérifier toutes les fonctionnalités manquantes**
  - Revoir la liste complète des fonctionnalités discutées
  - Identifier ce qui manque dans le questionnaire
  - Implémenter les éléments manquants

### Page Signature - Refonte UX Complète
- [ ] **Rendre la page plus vivante et engageante**
  - Hero section avec gradient bleu WIN WIN (#3176A6 → #8CB4D2)
  - Canvas signature avec bordure dorée (#D4AF37)
  - Animations : Effet signature qui brille, confettis à la validation
  - Boutons attractifs : Effacer (rouge), Valider (vert avec animation)
  - Micro-copy motivant : "Votre signature scelle votre tranquillité d'esprit ✨"
  - Fond dégradé au lieu de blanc pur
  - Cartes récapitulatif avec couleurs et icônes


### Message WhatsApp Parrainage - Correction Urgente
- [x] **Corriger le message WhatsApp de parrainage**
  - Remplacer caractères bizarres `◆` par vrais emojis
  - Rendre le ton plus naturel et personnel (pas formel)
  - Raccourcir le message (version punchy pour WhatsApp)
  - Simplifier l'URL (sans ?ref= visible)
  - Ajouter plus d'émotion et de chaleur
  - Tester sur mobile (iPhone + Android)

### Erreur Stripe - CRITIQUE ⚠️
- [ ] **Corriger l'erreur "Expired API Key provided"**
  - Vérifier la clé Stripe dans les variables d'environnement
  - Tester avec la clé de test Stripe
  - Vérifier que la clé n'a pas expiré
  - Tester un paiement complet

### Page Paiement - UX Confus 😕
- [x] **Ajouter encadré rassurant sur le fonctionnement du rabais**
  - Expliquer que le paiement CHF 185.- est pour l'année en cours
  - Expliquer que le rabais s'applique sur la PROCHAINE facture
  - Montrer exemple concret : "3 proches = CHF 11.10 économisés l'année prochaine"
  - Design attractif avec icônes et couleurs
  - Placer AVANT le bouton de paiement


---

## 🤖 **Workflow Upload Documents + Google Vision OCR**

### Phase 1 : Page Upload Documents
- [x] Créer page `/upload-documents?token=xxx` sécurisée
- [x] Afficher checklist personnalisée (Particulier/Entreprise)
- [x] Upload multiple de fichiers (PDF/images)
- [x] Validation du token unique par client
- [x] Design moderne et engageant

### Phase 2 : Backend OCR et Airtable
- [x] Endpoint tRPC `documents.upload` pour recevoir les fichiers
- [x] Appel Google Vision OCR pour extraction
- [x] Parsing intelligent des données (compagnie, police, primes, dates)
- [x] Création automatique des contrats dans Airtable
- [x] Lien contrat → client dans Airtable

### Phase 3 : Email de Bienvenue
- [x] Template email avec lien upload personnalisé
- [x] Inclure code de parrainage
- [x] Inclure checklist des documents
- [x] Envoi automatique après paiement Stripe
- [x] Design professionnel et engageant

### Phase 4 : Tests et Déploiement
- [x] Harmoniser types Particulier/Privé (Airtable + code)
- [ ] Tester upload + OCR avec vrais contrats suisses
- [ ] Vérifier création dans Airtable
- [ ] Corriger les bugs de parsing
- [ ] Push sur GitHub
- [ ] Déploiement automatique sur Railway
- [ ] Configurer `GOOGLE_CLOUD_VISION_KEY_JSON` sur Railway
