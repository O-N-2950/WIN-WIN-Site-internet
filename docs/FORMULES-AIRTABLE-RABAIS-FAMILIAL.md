# Formules Airtable - Système de Rabais Familial

## 🎯 Objectif

Créer 4 champs de formule dans Airtable pour calculer automatiquement le rabais familial et le prix final du mandat.

---

## ⚠️ IMPORTANT : Ordre de Création

**Créez les champs dans CET ORDRE** (car certaines formules dépendent d'autres) :

1. ✅ **"Nb membres famille"**
2. ✅ **"Rabais familial %"** (utilise "Nb membres famille")
3. ✅ **"Prix mandat avec rabais"** (utilise "Rabais familial %")
4. ✅ **"Groupe Familial"** (modifier le champ existant)

---

## 📋 Formule 1 : Nb membres famille

### **Informations du Champ**

- **Nom :** `Nb membres famille`
- **Type :** Formula
- **Description :** Nombre total de membres dans le groupe familial (soi-même + membres liés)

### **Formule à Copier-Coller**

```
COUNTA({Membres de la famille}) + 1
```

### **Explication**

- `COUNTA({Membres de la famille})` : Compte le nombre de membres liés
- `+ 1` : Ajoute soi-même au comptage
- **Exemple :** Antoine a lié Sophie, Henri et Cabinet → 3 + 1 = **4 membres**

### **Résultat Attendu**

| Client | Membres liés | Nb membres famille |
|--------|-------------|-------------------|
| Antoine | 3 (Sophie, Henri, Cabinet) | **4** |
| Sophie | 1 (Antoine) | **2** |
| Henri | 1 (Antoine) | **2** |
| Cabinet | 1 (Antoine) | **2** |

**⚠️ Problème détecté :** Chaque membre devrait voir **4** membres, pas 2 !

**Solution :** Tous les membres doivent être liés entre eux (pas seulement à Antoine).

---

## 📋 Formule 2 : Rabais familial %

### **Informations du Champ**

- **Nom :** `Rabais familial %`
- **Type :** Formula
- **Description :** Pourcentage de rabais basé sur le nombre de membres (min 2%, max 20%)

### **Formule à Copier-Coller**

```
IF(
  {Nb membres famille} >= 2,
  MIN(({Nb membres famille} - 1) * 2 + 2, 20),
  0
)
```

### **Explication**

- `IF({Nb membres famille} >= 2, ...)` : Vérifie s'il y a au moins 2 membres
- `({Nb membres famille} - 1) * 2 + 2` : Formule de calcul du rabais
- `MIN(..., 20)` : Limite le rabais à 20% maximum
- Si 1 seul membre → 0% de rabais

### **Table de Calcul**

| Nb membres | Formule | Rabais % |
|-----------|---------|----------|
| 1 | - | 0% |
| 2 | (2-1)*2+2 | **4%** |
| 3 | (3-1)*2+2 | **6%** |
| 4 | (4-1)*2+2 | **8%** |
| 5 | (5-1)*2+2 | **10%** |
| 6 | (6-1)*2+2 | **12%** |
| 7 | (7-1)*2+2 | **14%** |
| 8 | (8-1)*2+2 | **16%** |
| 9 | (9-1)*2+2 | **18%** |
| 10 | (10-1)*2+2 | **20%** |
| 11+ | MIN(..., 20) | **20%** (max) |

### **Résultat Attendu pour Famille Bussat (4 membres)**

| Client | Nb membres | Rabais % |
|--------|-----------|----------|
| Antoine | 4 | **8%** |
| Sophie | 4 | **8%** |
| Henri | 4 | **8%** |
| Cabinet | 4 | **8%** |

---

## 📋 Formule 3 : Prix mandat avec rabais

### **Informations du Champ**

- **Nom :** `Prix mandat avec rabais`
- **Type :** Formula
- **Description :** Prix final du mandat après application du rabais familial

### **Formule à Copier-Coller**

```
{Tarif applicable mandat de gestion} * (1 - {Rabais familial %} / 100)
```

### **Explication**

- `{Tarif applicable mandat de gestion}` : Prix de base du mandat
- `(1 - {Rabais familial %} / 100)` : Calcule le coefficient de réduction
- **Exemple :** 185 CHF avec 8% rabais = 185 * (1 - 8/100) = 185 * 0.92 = **170.20 CHF**

### **Résultat Attendu pour Famille Bussat**

| Client | Type | Prix base | Rabais % | Prix avec rabais |
|--------|------|-----------|----------|------------------|
| Antoine | Privé 22+ ans | 185 CHF | 8% | **170.20 CHF** |
| Sophie | Privé 22+ ans | 185 CHF | 8% | **170.20 CHF** |
| Henri | Privé 18-22 ans | 85 CHF | 8% | **78.20 CHF** |
| Cabinet | Entreprise 0 employé | 160 CHF | 8% | **147.20 CHF** |

---

## 📋 Formule 4 : Groupe Familial (Code Automatique)

### **Informations du Champ**

- **Nom :** `Groupe Familial` (champ existant à modifier)
- **Type :** Formula (remplacer le type "singleLineText" actuel)
- **Description :** Code famille automatique généré pour le membre fondateur uniquement

### **Formule à Copier-Coller**

```
IF(
  {Relations familiales} = "Membre fondateur",
  "FAMILLE-" & UPPER(SUBSTITUTE({Nom}, " ", "-")) & "-" & RIGHT(RECORD_ID(), 4),
  ""
)
```

### **Explication**

- `IF({Relations familiales} = "Membre fondateur", ...)` : Vérifie si c'est le fondateur
- `"FAMILLE-"` : Préfixe fixe
- `UPPER(SUBSTITUTE({Nom}, " ", "-"))` : Nom de famille en majuscules avec tirets
- `RIGHT(RECORD_ID(), 4)` : 4 derniers caractères de l'ID du record
- Si pas fondateur → Champ vide

### **Résultat Attendu**

| Client | Relations familiales | Groupe Familial |
|--------|---------------------|-----------------|
| Antoine | Membre fondateur | **FAMILLE-BUSSAT-A3X9** |
| Sophie | Conjointe | (vide) |
| Henri | Fils | (vide) |
| Cabinet | Entreprise familiale | (vide) |

**Note :** Seul le membre fondateur a un code famille. Les autres membres n'en ont pas besoin car ils sont liés via "Membres de la famille".

---

## ✅ Étapes de Création dans Airtable

### **Pour Chaque Formule :**

1. **Ouvrir la table "Clients"**
2. **Cliquer sur "+" à droite des colonnes**
3. **Sélectionner "Formula"**
4. **Copier-coller la formule exacte**
5. **Donner le nom EXACT du champ** (important pour les dépendances)
6. **Ajouter la description**
7. **Cliquer sur "Créer le champ"**

### **Pour Modifier "Groupe Familial" :**

1. **Cliquer sur l'en-tête de colonne "Groupe Familial"**
2. **Cliquer sur "Personnaliser le type de champ"**
3. **Changer le type de "Single line text" à "Formula"**
4. **Copier-coller la formule**
5. **Enregistrer**

**⚠️ Attention :** Si des données existent déjà dans "Groupe Familial", elles seront écrasées par la formule.

---

## 🧪 Test Complet avec Famille Bussat

### **Étape 1 : Prérequis**

1. ✅ Antoine = "Membre fondateur"
2. ✅ Sophie = "Conjointe"
3. ✅ Henri = "Fils"
4. ✅ Cabinet = "Entreprise familiale"

### **Étape 2 : Lier les Membres**

**Dans la fiche d'Antoine :**
- Champ "Membres de la famille" → Sélectionner Sophie, Henri, Cabinet

**Résultat automatique :**
- Sophie, Henri et Cabinet voient Antoine dans leur "Membres de la famille"

### **Étape 3 : Vérifier les Calculs**

| Champ | Antoine | Sophie | Henri | Cabinet |
|-------|---------|--------|-------|---------|
| **Relations familiales** | Membre fondateur | Conjointe | Fils | Entreprise familiale |
| **Membres de la famille** | Sophie, Henri, Cabinet | Antoine | Antoine | Antoine |
| **Nb membres famille** | 4 | 4 | 4 | 4 |
| **Rabais familial %** | 8% | 8% | 8% | 8% |
| **Prix base** | 185 CHF | 185 CHF | 85 CHF | 160 CHF |
| **Prix avec rabais** | 170.20 CHF | 170.20 CHF | 78.20 CHF | 147.20 CHF |
| **Groupe Familial** | FAMILLE-BUSSAT-XXXX | (vide) | (vide) | (vide) |

---

## ⚠️ Problème Potentiel : Comptage des Membres

### **Problème**

Avec la formule actuelle, chaque membre ne voit que les membres qu'il a liés directement :
- Antoine voit 4 membres (lui + 3 liés)
- Sophie voit 2 membres (elle + Antoine)
- Henri voit 2 membres (lui + Antoine)

### **Solution 1 : Lier Tous les Membres entre Eux**

**Dans chaque fiche, lier TOUS les autres membres :**
- Antoine → Sophie, Henri, Cabinet
- Sophie → Antoine, Henri, Cabinet
- Henri → Antoine, Sophie, Cabinet
- Cabinet → Antoine, Sophie, Henri

**Inconvénient :** Fastidieux à maintenir

### **Solution 2 : Formule Basée sur le Fondateur**

**Créer un champ "Membre Principal du Groupe" (Link to Record) :**
- Tous les membres pointent vers Antoine

**Nouvelle formule "Nb membres famille" :**
```
IF(
  {Relations familiales} = "Membre fondateur",
  COUNTA({Membres de la famille}) + 1,
  COUNTA({Membre Principal du Groupe → Membres de la famille}) + 1
)
```

**Avantage :** Un seul point de vérité (le fondateur)

---

## 🚀 Prochaines Étapes

1. ✅ Créer les 4 formules dans Airtable
2. ✅ Tester avec la famille Bussat
3. ✅ Vérifier que les calculs sont corrects
4. ✅ Intégrer dans les factures Stripe
5. ✅ Créer l'interface de gestion des groupes familiaux

---

## 📞 Support

Si vous rencontrez des problèmes avec les formules, contactez-moi dans le chat !
