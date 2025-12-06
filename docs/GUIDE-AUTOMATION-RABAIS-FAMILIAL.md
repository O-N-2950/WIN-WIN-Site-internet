# 📘 Guide de Configuration - Automation Rabais Familial

## 🎯 Objectif

Automatiser le calcul du rabais familial WIN WIN Finance :
- Compter automatiquement les membres actifs d'un groupe familial
- Créer des liens bidirectionnels entre les membres
- Mettre à jour le champ "Nb membres famille actifs"
- Calculer le rabais (2% par membre, max 20%)

---

## 📋 Prérequis

### ✅ Champs Airtable requis

| Nom du champ | Field ID | Type | Description |
|--------------|----------|------|-------------|
| **Groupe Familial** | `fld7adFgijiW0Eqhj` | Text | Code unique du groupe familial |
| **Statut du client** | `fldw9QKnjkINjZ7kQ` | Single Select | Statut actif/inactif |
| **Nb membres famille actifs** | `fldOkhbJGNwsiEfCo` | Number | Compteur automatique |
| **From field: Membres de la famille** | `fldzVtOES0l6kZhjv` | Multiple Record Links | Liens bidirectionnels |

---

## 🔧 Configuration de l'Automation Airtable

### **ÉTAPE 1 : Créer l'automation**

1. Allez dans **"Automatisations"** → **"+ Créer une automation"**
2. Nommez-la : **"Rabais Familial - Mise à jour automatique"**

---

### **ÉTAPE 2 : Configurer le déclencheur**

**Type :** "Lorsqu'une entrée est mise à jour"

**Configuration :**
- **Table** : `Clients`
- **Champ surveillé** : **"Groupe Familial"** ⚠️ (PAS "Code Groupe Familial")
- **Condition** : "Groupe Familial n'est pas vide"

---

### **ÉTAPE 3 : Ajouter l'action "Exécuter un script"**

1. Cliquez sur **"+ Ajouter une action"**
2. Sélectionnez **"Exécuter un script"**

---

### **ÉTAPE 4 : Configurer les variables d'entrée**

**⚠️ IMPORTANT : Configurez les variables AVANT de coller le script !**

Cliquez sur **"+ Add input variable"** et ajoutez :

#### **Variable 1 :**
- **Nom** : `clientId`
- **Valeur** : Sélectionnez **"Record ID"** dans la liste déroulante

#### **Variable 2 :**
- **Nom** : `groupeFamilial`
- **Valeur** : Sélectionnez **"Groupe Familial"** dans la liste déroulante

**Résultat attendu :**
```
Input variables:
┌─────────────────────────────────────┐
│ clientId = Record ID                │
│ groupeFamilial = Groupe Familial    │
└─────────────────────────────────────┘
```

---

### **ÉTAPE 5 : Coller le script**

Copiez le contenu du fichier `AIRTABLE-AUTOMATION-SCRIPT-FINAL.js` et collez-le dans l'éditeur de script.

---

### **ÉTAPE 6 : Activer l'automation**

1. Cliquez sur **"Tester"** pour vérifier que le script fonctionne
2. Activez l'automation avec le bouton vert **"Activer"**

---

## 👥 Utilisation : Créer un Groupe Familial

### **MÉTHODE MANUELLE (pour les clients existants)**

#### **1️⃣ Désigner le membre fondateur**

1. Ouvrez le client principal de la famille (ex: Olivier Neukomm)
2. Trouvez le champ **"Relations familiales"**
3. Sélectionnez **"Membre fondateur"**
4. Sauvegardez

➡️ Le champ **"Code Groupe Familial"** (formule) génère automatiquement : `FAMILLE-NEUKOMM-SeLs`

#### **2️⃣ Copier le code dans "Groupe Familial"**

1. Copiez la valeur du champ **"Code Groupe Familial"**
2. Collez-la dans le champ **"Groupe Familial"** (texte simple)
3. Sauvegardez

#### **3️⃣ Remplir pour tous les membres**

Pour chaque membre de la famille :
1. Ouvrez le client
2. Collez la même valeur dans **"Groupe Familial"**
3. Sauvegardez

**⚠️ IMPORTANT :** Tous les membres doivent avoir exactement le même code !

#### **4️⃣ Déclencher l'automation**

1. Modifiez le champ **"Groupe Familial"** d'un des membres (ajoutez un espace puis supprimez-le)
2. Sauvegardez

➡️ L'automation se déclenche automatiquement !

---

## 🧪 Vérification

### **Logs attendus dans l'automation :**

```
=== DÉBUT AUTOMATION RABAIS FAMILIAL ===
Client ID: recXEpwJCodPaSeLs
Groupe Familial: FAMILLE-NEUKOMM-SeLs

🔍 Recherche des membres du groupe familial: FAMILLE-NEUKOMM-SeLs

✅ Nombre de membres actifs trouvés: 8
📋 Liste des membres:
  - Record ID: recXXXXXXXXXXXXXX | Statut: Actif
  - Record ID: recYYYYYYYYYYYYYY | Statut: Actif
  ...

🔗 Création des liens bidirectionnels entre membres...
  ✓ Membre recXXXXXXXXXXXXXX → lié à 7 autres membres
  ✓ Membre recYYYYYYYYYYYYYY → lié à 7 autres membres
  ...

💰 Rabais familial calculé: 16%
📊 Détail:
  - Nombre de membres actifs: 8
  - Formule: ( 8 - 1) × 2 + 2 = 16 %
  - Maximum: 20%

=== AUTOMATION TERMINÉE AVEC SUCCÈS ===
✅ Nombre de membres mis à jour: 8
✅ Liens créés pour 8 membres
✅ Rabais familial: 16%
```

---

## 🐛 Dépannage

### **❌ Erreur : "clientId ou groupeFamilial manquant"**

**Cause :** Les variables d'entrée ne sont pas configurées.

**Solution :**
1. Vérifiez que les 2 variables (`clientId` et `groupeFamilial`) sont bien créées
2. Vérifiez que les valeurs sont bien sélectionnées depuis les champs du déclencheur

---

### **❌ Erreur : "No field matching 'fldXXXXXXXXXXXXXX' found"**

**Cause :** Un Field ID dans le script ne correspond pas à un champ de votre table.

**Solution :**
1. Vérifiez que tous les champs existent dans votre table Airtable
2. Vérifiez que les Field IDs dans le script sont corrects

---

### **⚠️ Aucun membre trouvé (0 résultat)**

**Causes possibles :**

1. **Le champ "Groupe Familial" est vide**
   - Vérifiez que tous les membres ont bien le même code dans "Groupe Familial"

2. **Le statut n'est pas "Actif" ou "NOUVEAU CLIENT"**
   - Vérifiez le champ "Statut du client" de chaque membre

3. **Le code ne correspond pas exactement**
   - Vérifiez qu'il n'y a pas d'espaces ou de différences de casse

---

## 📊 Formule de Rabais

| Nb membres actifs | Formule | Rabais |
|-------------------|---------|--------|
| 1 | - | 0% |
| 2 | (2-1) × 2 + 2 | 4% |
| 3 | (3-1) × 2 + 2 | 6% |
| 4 | (4-1) × 2 + 2 | 8% |
| 5 | (5-1) × 2 + 2 | 10% |
| 6 | (6-1) × 2 + 2 | 12% |
| 7 | (7-1) × 2 + 2 | 14% |
| 8 | (8-1) × 2 + 2 | 16% |
| 9 | (9-1) × 2 + 2 | 18% |
| 10+ | (10-1) × 2 + 2 | **20% MAX** |

---

## ✅ Checklist de Vérification

- [ ] Le champ "Groupe Familial" existe et est de type Text
- [ ] Le champ "From field: Membres de la famille" existe et est de type Multiple Record Links
- [ ] Le déclencheur surveille le champ "Groupe Familial" (PAS "Code Groupe Familial")
- [ ] Les 2 variables d'entrée (`clientId` et `groupeFamilial`) sont configurées
- [ ] Le script est collé dans l'action "Exécuter un script"
- [ ] L'automation est activée (bouton vert)
- [ ] Tous les membres d'une famille ont le même code dans "Groupe Familial"
- [ ] Les membres ont le statut "Actif" ou "NOUVEAU CLIENT"

---

## 🎉 Résultat Final

Une fois l'automation configurée et testée :

✅ **Automatique :** Dès qu'un client modifie son "Groupe Familial", l'automation se déclenche  
✅ **Liens créés :** Tous les membres sont liés entre eux  
✅ **Compteur mis à jour :** Le champ "Nb membres famille actifs" est rempli automatiquement  
✅ **Rabais calculé :** Le rabais familial est calculé selon la formule WIN WIN  

---

**Besoin d'aide ?** Contactez le support technique.
