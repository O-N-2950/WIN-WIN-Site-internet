# 📋 Guide d'Import Airtable - Leads Site Web WIN WIN

## 🎯 Objectif

Ce guide vous explique comment créer la table "Leads Site Web" dans votre base Airtable "ERP Clients WW" en important le fichier CSV template fourni.

---

## 📁 Fichier CSV Fourni

**Nom du fichier :** `airtable-leads-template.csv`

**Encodage :** UTF-8

**Colonnes :**
1. Nom
2. Email
3. Téléphone
4. Type Client
5. Source
6. Message
7. Date RDV
8. Heure RDV
9. Statut

**Contenu :** 8 exemples de leads fictifs pour tester l'import

---

## 🚀 Procédure d'Import dans Airtable

### Étape 1 : Ouvrir votre base ERP Clients WW

1. Allez sur https://airtable.com
2. Ouvrez la base **"ERP Clients WW"** (ID: `appZQkRJ7PwOtdQ3O`)

### Étape 2 : Créer une nouvelle table par import CSV

1. Cliquez sur le bouton **"+"** à côté des tables existantes (en haut à gauche)
2. Sélectionnez **"Import data"**
3. Choisissez **"CSV file"**
4. Uploadez le fichier `airtable-leads-template.csv`

### Étape 3 : Configurer l'import

Airtable va détecter automatiquement les colonnes. **Vérifiez le mapping suivant :**

| Colonne CSV | Type de champ Airtable | Configuration |
|-------------|------------------------|---------------|
| Nom | Single line text | Aucune config |
| Email | Email | Aucune config |
| Téléphone | Phone number | Format: `+41 XX XXX XX XX` |
| Type Client | Single select | Options: Particulier, Entreprise, Les deux |
| Source | Single select | Options: Formulaire Contact, Demande RDV, Questionnaire Mandat |
| Message | Long text | Aucune config |
| Date RDV | Date | Format: `YYYY-MM-DD` |
| Heure RDV | Single line text | Format: `HH:MM` |
| Statut | Single select | Options: Nouveau, Contacté, Qualifié, Converti, Perdu |

### Étape 4 : Ajuster les types de champs

Après l'import, Airtable peut avoir deviné certains types incorrectement. **Modifiez les types si nécessaire :**

1. Cliquez sur la flèche à côté du nom de la colonne
2. Sélectionnez **"Customize field type"**
3. Choisissez le bon type selon le tableau ci-dessus

### Étape 5 : Ajouter les champs manquants

Ajoutez manuellement ces champs supplémentaires :

1. **Date Création** (Created time)
   - Type: Created time
   - Configuration: Date et heure

2. **Lien Client** (Link to another record)
   - Type: Link to another record
   - Table liée: Clients (votre table clients existante)
   - Configuration: Allow linking to multiple records = NON

### Étape 6 : Renommer la table

1. Double-cliquez sur le nom de la table (probablement "Table 1")
2. Renommez en **"Leads Site Web"**

### Étape 7 : Configurer les couleurs des statuts (optionnel)

Pour une meilleure visibilité, configurez les couleurs des options "Statut" :

- **Nouveau** → 🔵 Bleu
- **Contacté** → 🟡 Jaune
- **Qualifié** → 🟢 Vert
- **Converti** → 🟣 Violet
- **Perdu** → 🔴 Rouge

---

## 🔗 Connexion avec le Site Web

Une fois la table créée, le site web WIN WIN pourra automatiquement créer des leads dans cette table via l'API Airtable.

### Configuration requise

1. **Clé API Airtable** : Créée sur https://airtable.com/create/tokens
2. **Base ID** : `appZQkRJ7PwOtdQ3O` (déjà configuré)
3. **Table ID** : `Leads Site Web` (nom exact de la table)

### Sources de leads automatiques

Le site créera automatiquement des leads depuis :

1. **Formulaire Contact** (`/conseil`) → Source: "Formulaire Contact"
2. **Demande RDV** (`/conseil`) → Source: "Demande RDV"
3. **Questionnaire Mandat** (`/questionnaire-info`) → Source: "Questionnaire Mandat"

---

## 📧 Notifications Email

À chaque création de lead, une notification sera envoyée automatiquement à **contact@winwin.swiss** avec :

- Nom, email, téléphone du lead
- Type de client et source
- Message éventuel
- Date/heure RDV si applicable
- Lien direct vers le record Airtable

---

## 🔄 Workflow de Gestion des Leads

### 1. Lead créé (Statut: Nouveau)
- ✅ Notification email envoyée
- ✅ Lead visible dans Airtable
- ⏰ **Action requise sous 24h** : Contacter le lead

### 2. Lead contacté (Statut: Contacté)
- Appel téléphonique ou email envoyé
- Qualification du besoin
- Proposition d'entretien si pertinent

### 3. Lead qualifié (Statut: Qualifié)
- Besoin identifié
- Budget validé
- Prêt pour proposition commerciale

### 4. Lead converti (Statut: Converti)
- Mandat signé
- Client créé dans la table Clients
- Lien établi entre Lead et Client

### 5. Lead perdu (Statut: Perdu)
- Raison de perte documentée dans "Message"
- Archivage

---

## 📊 Vues Recommandées

Créez ces vues dans Airtable pour faciliter la gestion :

### Vue 1 : "Nouveaux Leads"
- Filtre: Statut = Nouveau
- Tri: Date Création (plus récent en premier)

### Vue 2 : "À Contacter Aujourd'hui"
- Filtre: Statut = Nouveau OU Contacté
- Filtre: Date RDV = Aujourd'hui
- Tri: Heure RDV

### Vue 3 : "Leads Qualifiés"
- Filtre: Statut = Qualifié
- Tri: Date Création

### Vue 4 : "Par Source"
- Grouper par: Source
- Tri: Date Création (plus récent en premier)

---

## ✅ Checklist de Validation

Après l'import, vérifiez que :

- [ ] La table s'appelle exactement "Leads Site Web"
- [ ] Tous les champs ont le bon type
- [ ] Les 8 leads d'exemple sont importés correctement
- [ ] Le champ "Date Création" (Created time) est ajouté
- [ ] Le champ "Lien Client" (Link to record) est ajouté
- [ ] Les couleurs des statuts sont configurées
- [ ] La clé API Airtable est créée et ajoutée au site

---

## 🆘 Problèmes Courants

### Problème 1 : "Erreur lors de la création du lead"

**Cause :** Clé API Airtable invalide ou permissions insuffisantes

**Solution :**
1. Vérifiez que la clé API a les scopes `data.records:read` et `data.records:write`
2. Vérifiez que la base "ERP Clients WW" est bien sélectionnée dans les permissions du token

### Problème 2 : "Table not found"

**Cause :** Le nom de la table ne correspond pas exactement

**Solution :**
1. Vérifiez que la table s'appelle exactement "Leads Site Web" (avec majuscules et espace)
2. Pas de caractères spéciaux ou espaces supplémentaires

### Problème 3 : "Notification email non reçue"

**Cause :** Service d'email non configuré

**Solution :**
1. Vérifiez que la clé API Resend est configurée (optionnel)
2. Les notifications sont loguées dans la console en attendant

---

## 📞 Support

Pour toute question sur l'intégration Airtable, contactez l'équipe technique.

**Base Airtable :** ERP Clients WW (`appZQkRJ7PwOtdQ3O`)  
**Table :** Leads Site Web  
**Documentation technique :** Voir Notion (lien à venir)

---

**Dernière mise à jour :** 20 novembre 2025  
**Version :** 1.0
