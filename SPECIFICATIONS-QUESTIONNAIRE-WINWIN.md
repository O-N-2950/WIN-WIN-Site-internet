# 📋 Spécifications Système Questionnaire WIN WIN

**Projet** : Acquisition automatisée de clients via questionnaire web  
**Client** : Olivier Neukomm - WIN WIN Finance Group  
**Site** : https://winwin.swiss (hébergé sur Railway)  
**Base Airtable** : ERP Clients WW (ID: `appZQkRJ7PwOtdQ3O`)  
**Date** : 20 novembre 2025  
**Auteur** : Manus AI

---

## 🎯 Objectif Stratégique

Créer un **workflow d'acquisition client entièrement automatisé** qui transforme un prospect web en client actif en 4 étapes simples, avec un taux de conversion maximal grâce à une expérience utilisateur optimale et une analyse IA personnalisée.

**Cible prioritaire** : PME, créations d'entreprises, indépendants (spécialité WIN WIN)

---

## 📊 Workflow Complet d'Acquisition

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PROSPECT remplit questionnaire (2 versions au choix)     │
│    → Version RAPIDE (5-10 min) : 20-30 champs essentiels    │
│    → Version COMPLÈTE (20-30 min) : 200+ champs détaillés   │
│    → Upload documents catégorisés (5 catégories)            │
│    → Création automatique dans Airtable (Statut: "Prospect")│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. ANALYSE IA automatique (immédiate)                       │
│    → Extraction données des documents uploadés              │
│    → Analyse couverture actuelle vs besoins réels           │
│    → Identification lacunes et opportunités                 │
│    → Génération rapport PDF personnalisé (5-10 pages)       │
│    → Email automatique avec rapport + lien signature        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. SIGNATURE ÉLECTRONIQUE du mandat de gestion             │
│    → Canvas HTML5 pour signature manuscrite                 │
│    → Génération PDF mandat personnalisé (données client)    │
│    → Stockage signature + mandat signé dans Airtable        │
│    → Mise à jour champ "ok Mandat signé" = ✅               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. PAIEMENT STRIPE (Abonnement annuel récurrent)            │
│    → Calcul automatique du tarif (selon âge/employés)       │
│    → Checkout Stripe sécurisé                                │
│    → Webhook Stripe → Mise à jour Airtable                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. ACTIVATION CLIENT automatique                            │
│    → Statut change : "Prospect" → "Actif"                   │
│    → Email de bienvenue avec accès Espace Client            │
│    → Notification email à Olivier                            │
│    → Accès Airtable activé pour le client                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Structure Airtable (Base: ERP Clients WW)

### Table **Clients** (`tblWPcIpGmBZ3ASGI`)

**Champs clés pour le workflow** :

| Champ | ID Airtable | Type | Valeurs possibles | Usage dans workflow |
|-------|-------------|------|-------------------|---------------------|
| **Statut du client** | `fldw9QKnjkINjZ7kQ` | Select | Prospect / Actif / En attente / Inactif / Mandat résilié | **Étape 1** : "Prospect" → **Étape 5** : "Actif" |
| **ok Mandat signé** | `fldSVX91GvFXyVjQL` | Checkbox | ✅ / ❌ | **Étape 3** : ✅ après signature |
| **Mandat signé** | `fldaw7xjEZyjiFDWR` | Attachments | PDF | **Étape 3** : Upload PDF signé |
| **Date signature mandat** | `fldzZyuW5mElq0NAX` | Date | JJ/MM/AAAA | **Étape 3** : Date de signature |
| **Tarif applicable** | `fldjS5xq3CVfIdIEt` | Formula | CHF 0-860 | **Étape 4** : Calcul automatique |
| **Type de client** | `flddoSiduFTUIciGX` | Select | Privé / Entreprise | **Étape 1** : Choix questionnaire |
| **Nom** | `fldaADa3p1WhaIKhW` | Text | - | **Étape 1** : Questionnaire |
| **Prénom** | `fldfhjuxTQwZipdOf` | Text | - | **Étape 1** : Questionnaire |
| **Nom de l'entreprise** | `fldZ8w4IDGJBKS35M` | Text | - | **Étape 1** : Questionnaire (si entreprise) |
| **Email** | `fldI0sr2QLOJYsZR6` | Email | - | **Étape 1** : Questionnaire |
| **Tél. Mobile** | `fldVnQFYRxlHwbcAo` | Phone | - | **Étape 1** : Questionnaire |
| **Date de naissance** | `flddLhgVxc3kCl0Yt` | Date | JJ/MM/AAAA | **Étape 1** : Questionnaire (si privé) |
| **Age** | `fldgJzTufgozKGwWh` | Formula | 0-999 | Calcul automatique |
| **Catégorie d'âge** | `fldUM4zQRa7x3W0gM` | Formula | Moins de 18 ans / 18-22 ans / Plus de 22 ans | Calcul automatique |
| **Nombre d'employés** | `fldb0luJBAdheYrCm` | Number | 0-999 | **Étape 1** : Questionnaire (si entreprise) |
| **Catégorie d'entreprise** | `fldSlxXC2cIXlpyKv` | Formula | 0 employé / 1 employé / 2 employés / etc. | Calcul automatique |
| **Adresse et no** | `fldWXpm73tI4mHUoj` | Text | - | **Étape 1** : Questionnaire |
| **NPA** | `fldkbLY9Ziota9Wey` | Number | 1000-9999 | **Étape 1** : Questionnaire |
| **Localité** | `fldqs8SybdPAauPdJ` | Text | - | **Étape 1** : Questionnaire |
| **Canton** | `fldbblAIdYpzgLwzt` | Select | 26 cantons suisses | **Étape 1** : Questionnaire |
| **Nouvelle entreprise** | `fldGWP6ONsXjeJuxw` | Select | OUI / NON | **Étape 1** : Questionnaire (si entreprise) |
| **Lien avec contrats** | `fldwmIuKAXL3RbUvP` | Link | → Table Contrats | **Étape 1** : Relation automatique |

### Table **Contrats** (`tblDOIQM3zt7QkZd4`)

**Usage** : Stockage des **polices d'assurance** uploadées par le client

| Champ | Type | Usage |
|-------|------|-------|
| **Client** | Link → Clients | Relation avec le client |
| **Type de contrat** | Select | À analyser / Vie / Maladie / RC / Véhicule / etc. |
| **Statut** | Select | En analyse / Actif / Résilié |
| **Fichier police** | Attachments | PDF de la police uploadée |
| **Source** | Text | "Questionnaire client" |
| **Date réception** | Date | Date d'upload |

### Table **Documents** (à identifier)

**Usage** : Stockage des **autres documents** (LPP, décomptes, identité, etc.)

| Champ | Type | Usage |
|-------|------|-------|
| **Client** | Link → Clients | Relation avec le client |
| **Nom document** | Text | Nom du fichier |
| **Type document** | Select | Certificat LPP / Décompte de primes / Pièce d'identité / Autre |
| **Fichier** | Attachments | PDF/Image du document |
| **Date upload** | Date | Date d'upload |

---

## 📋 Questionnaire : Deux Versions au Choix

### **Version 1 : RAPIDE** (5-10 minutes)

**Objectif** : Obtenir un maximum de prospects avec un formulaire court et engageant

**Champs (20-30 maximum)** :

#### **Section 1 : Identification** (5 champs)
1. Type de client : Privé / Entreprise *(radio)*
2. Prénom *(text)*
3. Nom *(text)*
4. Email *(email)*
5. Téléphone mobile *(tel)*

#### **Section 2 : Informations spécifiques** (3-5 champs)

**Si Privé** :
- Date de naissance *(date)*
- Situation familiale : Célibataire / Marié / Divorcé / Veuf *(select)*
- Nombre d'enfants *(number)*

**Si Entreprise** :
- Nom de l'entreprise *(text)*
- Forme juridique : Raison individuelle / SA / Sàrl / SNC / Autre *(select)*
- Nombre d'employés *(number)*
- Nouvelle entreprise ? OUI / NON *(radio)*

#### **Section 3 : Adresse** (4 champs)
- Adresse et numéro *(text)*
- NPA *(number)*
- Localité *(text)*
- Canton *(select - 26 cantons)*

#### **Section 4 : Situation actuelle** (3 champs)
- Avez-vous actuellement des assurances ? OUI / NON *(radio)*
- Avez-vous un 2e pilier (LPP) ? OUI / NON *(radio)*
- Souhaitez-vous une analyse de votre situation ? OUI / NON *(radio)*

#### **Section 5 : Upload simplifié** (optionnel)
- **Polices d'assurance** : Upload multiple (PDF, JPG, PNG)
- **Certificat LPP** : Upload (PDF)

**Total** : ~20 champs + 2 uploads optionnels

**Durée estimée** : 5-10 minutes

**Analyse IA** : Rapport simplifié (3-5 pages) avec recommandations générales

---

### **Version 2 : COMPLÈTE** (20-30 minutes)

**Objectif** : Obtenir un profil client complet pour une analyse IA approfondie et un mandat de gestion immédiat

**Champs (200+ selon Genspark)** :

#### **Section 1 : Identification** (10 champs)
- Type de client : Privé / Entreprise
- Prénom
- Nom
- Nom de l'entreprise *(si entreprise)*
- Forme juridique *(si entreprise)*
- Email
- Téléphone mobile
- Téléphone fixe
- Langue : Français / Allemand / Italien / Anglais / Autre
- AVS *(optionnel)*

#### **Section 2 : Adresse** (6 champs)
- Adresse et numéro
- Adresse 2 *(optionnel)*
- NPA
- Localité
- Canton
- Pays *(par défaut: Suisse)*

#### **Section 3 : Situation personnelle** (Privé uniquement - 15 champs)
- Date de naissance
- Lieu de naissance
- Nationalité
- Permis de séjour *(si étranger)*
- Situation familiale : Célibataire / Marié / Partenariat enregistré / Divorcé / Veuf
- Date de mariage *(si marié)*
- Régime matrimonial : Séparation de biens / Participation aux acquêts / Communauté de biens
- Nom du conjoint
- Prénom du conjoint
- Date de naissance du conjoint
- Nombre d'enfants
- Pour chaque enfant (répéter) :
  - Prénom
  - Date de naissance
  - Situation : À charge / Indépendant

#### **Section 4 : Situation professionnelle** (10 champs)
- Statut professionnel : Salarié / Indépendant / Retraité / Sans emploi / Étudiant
- Employeur *(si salarié)*
- Fonction
- Taux d'activité : 100% / 80% / 60% / 40% / 20%
- Revenu annuel brut *(CHF)*
- Date d'entrée en fonction
- Secteur d'activité
- Profession
- Nombre d'années d'expérience
- Prévoyance professionnelle (LPP) : OUI / NON

#### **Section 5 : Situation entreprise** (Entreprise uniquement - 20 champs)
- Raison sociale
- Forme juridique : Raison individuelle / SA / Sàrl / SNC / Autre
- IDE *(Identifiant des entreprises)*
- Date de création
- Nouvelle entreprise : OUI / NON
- Secteur d'activité
- Chiffre d'affaires annuel *(CHF)*
- Nombre d'employés
- Masse salariale annuelle *(CHF)*
- Régime de prévoyance : Obligatoire / Surobligatoire / Aucun
- Assurance perte de gain : OUI / NON
- Assurance accidents : OUI / NON
- Responsabilité civile entreprise : OUI / NON
- Protection juridique entreprise : OUI / NON
- Assurance bâtiment : OUI / NON
- Assurance inventaire : OUI / NON
- Cyber-assurance : OUI / NON
- Assurance D&O (dirigeants) : OUI / NON
- Assurance crédit : OUI / NON
- Autres assurances : *(textarea)*

#### **Section 6 : Patrimoine** (15 champs)
- Propriétaire immobilier : OUI / NON
- Valeur du bien immobilier *(CHF)*
- Hypothèque : OUI / NON
- Montant hypothèque *(CHF)*
- Taux hypothécaire *(%)
- Échéance hypothèque *(date)*
- Épargne 3a : OUI / NON
- Montant 3a *(CHF)*
- Épargne 3b : OUI / NON
- Montant 3b *(CHF)*
- Comptes bancaires : Montant total *(CHF)*
- Titres/Actions : Montant total *(CHF)*
- Véhicules : Nombre
- Autres biens : *(textarea)*
- Dettes : Montant total *(CHF)*

#### **Section 7 : Assurances actuelles** (30+ champs)

**7.1 Assurance maladie**
- Caisse maladie
- Numéro de police
- Prime mensuelle *(CHF)*
- Franchise : 300 / 500 / 1000 / 1500 / 2000 / 2500
- Modèle : Standard / Médecin de famille / HMO / Télémédecine
- Assurances complémentaires : OUI / NON
- Liste des complémentaires : *(textarea)*
- Prime complémentaires *(CHF)*

**7.2 Assurance vie**
- Assurance vie : OUI / NON
- Compagnie
- Numéro de police
- Capital assuré *(CHF)*
- Prime annuelle *(CHF)*
- Bénéficiaires

**7.3 Assurance invalidité (perte de gain)**
- Assurance perte de gain : OUI / NON
- Compagnie
- Numéro de police
- Indemnité journalière *(CHF)*
- Délai d'attente : 30 / 60 / 90 / 180 jours
- Prime annuelle *(CHF)*

**7.4 Assurance RC (Responsabilité civile)**
- Assurance RC privée : OUI / NON
- Compagnie
- Numéro de police
- Somme assurée *(CHF)*
- Prime annuelle *(CHF)*

**7.5 Assurance ménage**
- Assurance ménage : OUI / NON
- Compagnie
- Numéro de police
- Somme assurée *(CHF)*
- Prime annuelle *(CHF)*

**7.6 Assurance véhicule**
- Nombre de véhicules
- Pour chaque véhicule :
  - Type : Voiture / Moto / Autre
  - Marque et modèle
  - Immatriculation
  - Compagnie d'assurance
  - Numéro de police
  - Couverture : RC seule / Casco partielle / Casco complète
  - Prime annuelle *(CHF)*

**7.7 Assurance protection juridique**
- Protection juridique : OUI / NON
- Compagnie
- Numéro de police
- Domaines couverts : Privé / Circulation / Travail / Immobilier
- Prime annuelle *(CHF)*

**7.8 Autres assurances**
- Assurance voyage : OUI / NON
- Assurance animaux : OUI / NON
- Assurance objets de valeur : OUI / NON
- Autres : *(textarea)*

#### **Section 8 : Besoins et objectifs** (10 champs)
- Objectif principal : Optimiser mes primes / Améliorer ma couverture / Préparer ma retraite / Protéger ma famille / Autre
- Budget mensuel souhaité pour assurances *(CHF)*
- Préoccupations principales : *(textarea - 3 max)*
- Projets à court terme (1-3 ans) : *(textarea)*
- Projets à moyen terme (3-10 ans) : *(textarea)*
- Projets à long terme (10+ ans) : *(textarea)*
- Tolérance au risque : Faible / Moyenne / Élevée
- Préférence investissement : Sécurité / Équilibré / Croissance
- Souhaitez-vous une planification successorale ? OUI / NON
- Commentaires libres : *(textarea)*

#### **Section 9 : Upload catégorisé** (5 catégories)

**9.1 Polices d'assurance** → Table Contrats
- Upload multiple (PDF, JPG, PNG)
- Drag & drop
- Aperçu des fichiers uploadés

**9.2 Certificats LPP / 2e pilier** → Table Documents
- Upload multiple (PDF)
- Drag & drop

**9.3 Décomptes de primes** → Table Documents
- Upload multiple (PDF)
- Drag & drop

**9.4 Pièces d'identité** → Table Documents
- Upload multiple (PDF, JPG, PNG)
- Drag & drop

**9.5 Autres documents** → Table Documents
- Upload multiple (PDF, JPG, PNG, DOC, DOCX)
- Drag & drop

**Total** : ~200 champs + 5 catégories d'upload

**Durée estimée** : 20-30 minutes

**Analyse IA** : Rapport complet (10-15 pages) avec analyse détaillée et recommandations personnalisées

---

## 🤖 Analyse IA : Fonctionnement Détaillé

### **Étape 1 : Extraction des données**

**Documents analysés** :
1. **Polices d'assurance** (PDF) :
   - Compagnie d'assurance
   - Type de contrat (vie, maladie, RC, etc.)
   - Numéro de police
   - Capital assuré / Somme assurée
   - Prime annuelle
   - Date d'échéance
   - Bénéficiaires
   - Conditions particulières

2. **Certificats LPP** (PDF) :
   - Caisse de pension
   - Avoir de vieillesse
   - Capital décès
   - Rente invalidité
   - Cotisations employeur/employé
   - Taux de couverture

3. **Décomptes de primes** (PDF) :
   - Montants payés
   - Périodes couvertes
   - Franchises appliquées
   - Remboursements

4. **Réponses du questionnaire** :
   - Situation familiale
   - Revenus
   - Patrimoine
   - Objectifs

**Technologies utilisées** :
- **OCR** : Extraction de texte des PDF scannés
- **NLP** : Analyse sémantique des documents
- **LLM** : Compréhension contextuelle et génération de recommandations

### **Étape 2 : Analyse de la couverture actuelle**

**Calculs effectués** :
1. **Besoins en capital décès** :
   - Formule : `(Revenus annuels × 5) + Dettes - Épargne`
   - Comparaison avec capital assuré actuel
   - Identification du gap

2. **Besoins en rente invalidité** :
   - Formule : `Revenus mensuels × 60% (taux de remplacement recommandé)`
   - Comparaison avec indemnités actuelles
   - Identification du gap

3. **Analyse des primes** :
   - Total des primes actuelles
   - Comparaison avec le marché (benchmarking)
   - Identification des sur-assurances
   - Identification des sous-assurances

4. **Analyse de la prévoyance** :
   - Lacune de prévoyance (1er, 2e, 3e piliers)
   - Projection retraite
   - Recommandations 3a/3b

### **Étape 3 : Identification des lacunes**

**Lacunes types identifiées** :
- ❌ **Sous-assuré en décès** : Capital insuffisant pour protéger la famille
- ❌ **Sous-assuré en invalidité** : Indemnités journalières trop faibles
- ❌ **Sur-assuré en RC** : Somme assurée excessive par rapport aux besoins
- ❌ **Franchise maladie inadaptée** : Trop basse pour profil sain
- ❌ **Manque de protection juridique** : Pas de couverture pour litiges
- ❌ **Lacune de prévoyance** : Épargne 3a insuffisante pour retraite
- ❌ **Assurances redondantes** : Couvertures qui se chevauchent

### **Étape 4 : Opportunités d'optimisation**

**Opportunités types** :
- ✅ **Économie potentielle** : CHF 1'200/an en changeant de franchise maladie
- ✅ **Amélioration couverture** : +CHF 100'000 capital décès pour +CHF 300/an
- ✅ **Consolidation** : Regrouper 3 assurances chez un seul assureur → -15% de prime
- ✅ **Optimisation fiscale** : Augmenter 3a de CHF 7'056/an → économie impôt CHF 2'000/an
- ✅ **Prévoyance retraite** : Rachat LPP de CHF 50'000 → économie impôt CHF 15'000

### **Étape 5 : Génération du rapport PDF**

**Structure du rapport** (10-15 pages) :

#### **Page 1 : Page de garde**
- Logo WIN WIN
- Titre : "Analyse de votre situation d'assurances et prévoyance"
- Nom du client
- Date de l'analyse
- Mention : "Analyse personnalisée par WIN WIN Finance Group"

#### **Pages 2-3 : Résumé exécutif**
- **Situation actuelle** : Résumé en 3-5 points clés
- **Lacunes identifiées** : Top 3 des problèmes
- **Opportunités** : Top 3 des recommandations
- **Économie potentielle** : Montant annuel en CHF
- **Amélioration couverture** : Montant capital supplémentaire

#### **Pages 4-6 : Analyse détaillée**
- **Tableau récapitulatif** : Toutes les assurances actuelles
  - Compagnie
  - Type
  - Capital/Somme assurée
  - Prime annuelle
  - Échéance
  - Statut (✅ Adéquat / ⚠️ À optimiser / ❌ Lacune)
- **Graphiques** :
  - Répartition des primes par type d'assurance
  - Évolution des besoins vs couverture actuelle
  - Projection retraite (3 piliers)

#### **Pages 7-10 : Recommandations personnalisées**
- **Recommandation 1** : Titre + Description + Impact + Coût
- **Recommandation 2** : Titre + Description + Impact + Coût
- **Recommandation 3** : Titre + Description + Impact + Coût
- **Recommandation 4** : Titre + Description + Impact + Coût
- **Recommandation 5** : Titre + Description + Impact + Coût

Chaque recommandation inclut :
- **Problème identifié** : Explication claire
- **Solution proposée** : Produit/Action recommandée
- **Impact** : Amélioration de la couverture ou économie
- **Coût** : Prime supplémentaire ou économie
- **Priorité** : Haute / Moyenne / Faible
- **Échéance** : Immédiate / Court terme / Moyen terme

#### **Pages 11-12 : Plan d'action**
- **Étape 1** : Action à entreprendre immédiatement
- **Étape 2** : Action à court terme (1-3 mois)
- **Étape 3** : Action à moyen terme (3-12 mois)
- **Étape 4** : Action à long terme (1-3 ans)

#### **Pages 13-14 : Annexes**
- **Glossaire** : Termes techniques expliqués
- **Sources** : Références utilisées pour l'analyse
- **Méthodologie** : Explication de l'analyse IA

#### **Page 15 : Appel à l'action**
- **Bouton** : "Signer mon mandat de gestion"
- **Avantages** : Liste des bénéfices du mandat WIN WIN
- **Tarif** : Prix calculé automatiquement selon profil
- **Contact** : Coordonnées Olivier Neukomm

**Format** : PDF A4, design professionnel avec couleurs WIN WIN (#3176A6 / #8CB4D2)

---

## ✍️ Signature Électronique du Mandat

### **Fonctionnement**

1. **Génération du mandat personnalisé** :
   - Template PDF pré-rempli avec données client
   - Tarif calculé automatiquement
   - Conditions générales incluses

2. **Interface de signature** :
   - Canvas HTML5 pour signature manuscrite
   - Boutons : Effacer / Valider
   - Aperçu du mandat avant signature

3. **Validation** :
   - Capture de la signature (image PNG)
   - Insertion de la signature dans le PDF
   - Génération du PDF final signé

4. **Stockage** :
   - Upload du PDF signé dans Airtable (champ `Mandat signé`)
   - Mise à jour du champ `ok Mandat signé` = ✅
   - Mise à jour de la `Date signature mandat`

5. **Email de confirmation** :
   - Envoi du mandat signé au client
   - Copie à Olivier Neukomm

### **Technologies**

- **Canvas HTML5** : Capture de la signature manuscrite
- **jsPDF** : Génération du PDF côté client
- **pdf-lib** : Insertion de la signature dans le PDF
- **Airtable API** : Upload du PDF signé

---

## 💳 Paiement Stripe

### **Fonctionnement**

1. **Calcul automatique du tarif** :
   - Lecture du champ Airtable `Tarif applicable mandat de gestion`
   - Formule déjà en place dans Airtable :
     ```
     IF(Privé, 
        IF(Age < 18, 0, IF(Age < 23, 85, 185)),
        IF(Employés = 0, 160, IF(Employés = 1, 260, ...))
     )
     ```

2. **Création de la session Stripe Checkout** :
   - Mode : `subscription` (abonnement récurrent)
   - Intervalle : `year` (annuel)
   - Montant : Tarif calculé (en centimes)
   - Métadonnées : `clientId` Airtable

3. **Redirection vers Stripe** :
   - Interface de paiement sécurisée Stripe
   - Paiement par carte bancaire
   - 3D Secure automatique

4. **Webhook Stripe** :
   - Événement : `checkout.session.completed`
   - Récupération du `clientId` dans les métadonnées
   - Mise à jour Airtable :
     - `Statut du client` : "Prospect" → "Actif"
     - `ok Mandat signé` : ✅ (si pas déjà fait)
     - Date d'activation

5. **Email de bienvenue** :
   - Confirmation de paiement
   - Accès Espace Client Airtable
   - Coordonnées de contact

### **Gestion des abonnements**

- **Renouvellement automatique** : Stripe charge la carte chaque année
- **Échec de paiement** : Email automatique + statut "En attente" dans Airtable
- **Résiliation** : Bouton dans l'Espace Client → Statut "Mandat résilié"

---

## 🎨 Design et UX

### **Principes de design**

1. **Simplicité** : Interface épurée, pas de distraction
2. **Progression claire** : Barre de progression visible
3. **Sauvegarde automatique** : Pas de perte de données
4. **Mobile-first** : Responsive design
5. **Accessibilité** : WCAG 2.1 AA

### **Couleurs WIN WIN**

- **Primaire** : #3176A6 (Bleu WIN WIN)
- **Secondaire** : #8CB4D2 (Bleu clair)
- **Accent** : #D4AF37 (Doré)
- **Texte** : #1A2332 (Gris foncé)
- **Fond** : #F8FAFC (Gris très clair)

### **Typographie**

- **Titres** : Kozuka Gothic PR6N B (Gras)
- **Corps** : Kozuka Gothic PR6N L (Léger)
- **Fallback** : Inter, system-ui, sans-serif

### **Composants UI**

- **Inputs** : shadcn/ui (design moderne)
- **Boutons** : Variant "default" (bleu WIN WIN)
- **Upload** : Drag & drop avec aperçu
- **Signature** : Canvas avec boutons Effacer/Valider

---

## 🔐 Sécurité et Confidentialité

### **Mesures de sécurité**

1. **HTTPS** : Toutes les communications chiffrées
2. **Validation côté serveur** : Toutes les données validées
3. **CORS** : Restrictions sur les origines autorisées
4. **Rate limiting** : Protection contre les abus
5. **Sanitization** : Nettoyage des inputs utilisateur

### **Confidentialité**

1. **RGPD** : Conformité totale
2. **Consentement** : Checkbox obligatoire
3. **Droit à l'oubli** : Suppression des données sur demande
4. **Stockage sécurisé** : Airtable (chiffrement au repos)
5. **Accès restreint** : Seul Olivier a accès aux données

### **Mentions légales**

- **Politique de confidentialité** : Lien dans le footer
- **CGV** : Conditions générales de vente
- **Mentions légales** : Informations légales WIN WIN

---

## 📧 Notifications Email

### **Emails automatiques**

1. **Confirmation de soumission du questionnaire** :
   - Destinataire : Client
   - Sujet : "Votre questionnaire a bien été reçu"
   - Contenu : Confirmation + lien vers rapport IA

2. **Rapport IA prêt** :
   - Destinataire : Client
   - Sujet : "Votre analyse personnalisée est prête"
   - Contenu : Résumé + lien téléchargement PDF + lien signature

3. **Mandat signé** :
   - Destinataire : Client + Olivier
   - Sujet : "Votre mandat de gestion a été signé"
   - Contenu : Confirmation + PDF mandat signé + lien paiement

4. **Paiement reçu** :
   - Destinataire : Client
   - Sujet : "Bienvenue chez WIN WIN Finance Group !"
   - Contenu : Confirmation + accès Espace Client + coordonnées Olivier

5. **Notification Olivier** :
   - Destinataire : Olivier
   - Sujet : "Nouveau client activé : [Nom Client]"
   - Contenu : Résumé du profil + lien Airtable

### **Design des emails**

- **Template** : HTML responsive
- **Couleurs** : WIN WIN (#3176A6 / #8CB4D2)
- **Logo** : WIN WIN en header
- **Footer** : Coordonnées + liens réseaux sociaux

---

## 🚀 Implémentation Technique

### **Stack technologique**

- **Frontend** : React 19 + Tailwind 4
- **Backend** : Express 4 + tRPC 11
- **Base de données** : Airtable (ERP Clients WW)
- **Paiement** : Stripe (abonnements récurrents)
- **Signature** : Canvas HTML5 + pdf-lib
- **IA** : OpenAI GPT-4 (analyse documents + génération rapport)
- **Emails** : Manus Notification API
- **Hébergement** : Railway

### **Architecture**

```
client/
  src/
    pages/
      QuestionnaireRapide.tsx      ← Questionnaire rapide
      QuestionnaireComplet.tsx     ← Questionnaire complet
      Signature.tsx                ← Signature électronique
      Paiement.tsx                 ← Paiement Stripe
      Merci.tsx                    ← Page de remerciement
    components/
      UploadZone.tsx               ← Zone d'upload drag & drop
      SignatureCanvas.tsx          ← Canvas de signature
      ProgressBar.tsx              ← Barre de progression
    lib/
      airtable.ts                  ← Client Airtable
      stripe.ts                    ← Client Stripe
      ai-analysis.ts               ← Analyse IA
      pdf-generator.ts             ← Génération PDF

server/
  routers/
    questionnaire.ts               ← Routes questionnaire
    signature.ts                   ← Routes signature
    paiement.ts                    ← Routes paiement
  _core/
    airtable.ts                    ← Connexion Airtable
    stripe.ts                      ← Webhooks Stripe
    llm.ts                         ← Intégration LLM
    notification.ts                ← Emails
```

### **Workflow de développement**

1. **Phase 1** : Questionnaire rapide + Upload catégorisé
2. **Phase 2** : Intégration Airtable (création client + documents)
3. **Phase 3** : Analyse IA + Génération rapport PDF
4. **Phase 4** : Signature électronique
5. **Phase 5** : Paiement Stripe + Webhooks
6. **Phase 6** : Emails automatiques
7. **Phase 7** : Questionnaire complet
8. **Phase 8** : Tests et optimisations

---

## 📊 KPIs et Suivi

### **Métriques à suivre**

1. **Taux de conversion** :
   - Visiteurs → Démarrage questionnaire : X%
   - Démarrage → Soumission : X%
   - Soumission → Signature : X%
   - Signature → Paiement : X%
   - **Taux global** : Visiteurs → Client actif : X%

2. **Temps moyen** :
   - Temps de remplissage questionnaire rapide : X min
   - Temps de remplissage questionnaire complet : X min
   - Temps entre soumission et signature : X jours
   - Temps entre signature et paiement : X heures

3. **Qualité des leads** :
   - Nombre de prospects par semaine
   - Nombre de clients activés par semaine
   - Taux de résiliation : X%
   - Valeur vie client (LTV) : X CHF

4. **Performance technique** :
   - Temps de chargement page : < 2s
   - Taux d'erreur : < 1%
   - Disponibilité : > 99.9%

### **Dashboard Airtable**

- **Vue "Prospects"** : Tous les prospects en attente
- **Vue "En attente signature"** : Prospects ayant reçu le rapport
- **Vue "En attente paiement"** : Mandats signés non payés
- **Vue "Clients actifs"** : Tous les clients avec mandat actif
- **Vue "Statistiques"** : Graphiques et métriques

---

## 🎯 Prochaines Étapes

### **Phase 1 : MVP (Minimum Viable Product)** - 2 semaines

1. ✅ **Questionnaire rapide** (20 champs)
2. ✅ **Upload catégorisé** (5 catégories)
3. ✅ **Intégration Airtable** (création client + documents)
4. ✅ **Analyse IA basique** (rapport simplifié 3-5 pages)
5. ✅ **Signature électronique** (Canvas + PDF)
6. ✅ **Paiement Stripe** (abonnement annuel)
7. ✅ **Emails automatiques** (confirmation + bienvenue)

### **Phase 2 : Questionnaire complet** - 1 semaine

1. ✅ **200+ champs** (toutes les sections)
2. ✅ **Analyse IA avancée** (rapport complet 10-15 pages)
3. ✅ **Recommandations personnalisées** (5+ recommandations)
4. ✅ **Graphiques et visualisations** (dans le rapport PDF)

### **Phase 3 : Optimisations** - 1 semaine

1. ✅ **Tests utilisateurs** (5-10 personnes)
2. ✅ **Optimisation UX** (corrections selon feedbacks)
3. ✅ **Performance** (temps de chargement < 2s)
4. ✅ **SEO** (référencement naturel)
5. ✅ **Analytics** (Google Analytics + Airtable)

### **Phase 4 : Lancement** - 1 semaine

1. ✅ **Déploiement production** (Railway)
2. ✅ **Campagne marketing** (email + réseaux sociaux)
3. ✅ **Suivi des KPIs** (dashboard Airtable)
4. ✅ **Support client** (réponses aux questions)

**Total : 5 semaines**

---

## 📞 Contact

**Olivier Neukomm**  
WIN WIN Finance Group  
Bellevue 7, 2950 Courgenay, Suisse  
📧 contact@winwin.swiss  
📱 079 579 25 00  
☎️ 032 466 11 00  
🌐 www.winwin.swiss

**FINMA** : F01042365  
**Directeur** : Olivier Neukomm (FINMA F01106918, CICERO 30101)

---

**Document créé par Manus AI le 20 novembre 2025**
