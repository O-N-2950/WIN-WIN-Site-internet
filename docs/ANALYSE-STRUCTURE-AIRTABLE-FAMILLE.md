# Analyse Complète de la Structure Airtable - Système de Rabais Familial

**Date:** 24 novembre 2025  
**Base:** ERP Clients WW (appZQkRJ7PwOtdQ3O)  
**Table:** Clients (tblWPcIpGmBZ3ASGI)

---

## 📋 **Champs Identifiés pour le Système de Rabais Familial**

### **1. Champs de Base**

| Nom du Champ | ID | Type | Description |
|--------------|-----|------|-------------|
| **NOM du client** | fldoJ7b8Q7PaM27Vd | Formula | Nom complet (Prénom + Nom + Entreprise) |
| **Prénom** | fldfhjuxTQwZipdOf | Text | Prénom du client |
| **Nom** | fldaADa3p1WhaIKhW | Text | Nom de famille |
| **Nom de l'entreprise** | fldZ8w4IDGJBKS35M | Text | Nom de l'entreprise (si applicable) |

---

### **2. Champs de Relations Familiales**

| Nom du Champ | ID | Type | Description | Statut |
|--------------|-----|------|-------------|--------|
| **Relations familiales** | fldXEhXcXbV40f6zM | Multiple Selects | Type de relation (Membre fondateur, épouse, fils, etc.) | ✅ Créé |
| **Code Groupe Familial** | fldJ2qDQMZaFKSwRq | Formula | Code unique pour le fondateur (FAMILLE-NOM-XXXX) | ✅ Créé |
| **Membre principal du groupe** | fldDyjnIEYKO9aO8e | Link (single) | Lien vers le membre fondateur | ✅ Créé |
| **Code Famille (hérité)** | fldyMVcOhIv44jtb0 | Lookup | Code famille récupéré du fondateur | ✅ Créé |
| **Membres de la famille** | fld3nKyHeghlKwUCq | Link (multiple, bidirectionnel) | Liens vers tous les membres de la famille | ✅ **VIENT D'ÊTRE CRÉÉ** |

---

### **3. Champs de Comptage et Rabais**

| Nom du Champ | ID | Type | Formule | Statut |
|--------------|-----|------|---------|--------|
| **Nb membres famille** | flddyUKRSSHe3d1Co | Formula | `IF({fld3nKyHeghlKwUCq}, COUNTA({fld3nKyHeghlKwUCq}) + 1, 1)` | ✅ Créé |
| **Nb membres famille (total)** | fld2R56MEGtsH2SEt | Formula | `{flddyUKRSSHe3d1Co} + 1` | ⚠️ **REDONDANT** (à supprimer) |
| **Rabais familial %** | fldpEAuzKECISrgM6 | Formula | `{flddyUKRSSHe3d1Co} * 0.01` | ⚠️ **FORMULE INCORRECTE** |
| **Rabais Groupe Familial (%)** | fldNHPto00tiybfnb | Number | (vide) | ⚠️ **À CONVERTIR EN FORMULA** |
| **Montant Rabais Familial (CHF)** | fldkJ1SFLkPNbL5pj | Currency | (vide) | ⚠️ **À CONVERTIR EN FORMULA** |

---

### **4. Champs de Parrainage**

| Nom du Champ | ID | Type | Description |
|--------------|-----|------|-------------|
| **Code Parrainage** | fldEx4ytlCnqPoSDM | Formula | Code unique pour parrainer (JEAN-A3X9) |
| **Parrainé par** | fldwwD2OCerxa7dtz | Link (single) | Lien vers le client parrain |

---

### **5. Champs Auxiliaires (Bidirectionnels)**

| Nom du Champ | ID | Type | Description |
|--------------|-----|------|-------------|
| **From field: Membres de la famille** | fldzVtOES0l6kZhjv | Link (inverse) | Champ inverse automatique |
| **From field: Membre principale du groupe** | fldTLYMBWTICbtcwe | Link (inverse) | Champ inverse automatique |
| **Lié à (famille)** | fldt6pklPvJmGq5FJ | Link (multiple, bidirectionnel) | ⚠️ **DOUBLON ?** (à vérifier) |

---

## 🔍 **Valeurs du Champ "Relations familiales"**

Le champ **Relations familiales** (fldXEhXcXbV40f6zM) est de type **Multiple Selects** avec les valeurs suivantes :

| ID | Valeur | Couleur |
|----|--------|---------|
| selaJfS5NtopzvAp4 | **Membre fondateur** | Teal |
| sel9RcGG4j0pGlW8r | époux | Blue |
| selAF2t0JkuMMRCDZ | épouse | Red |
| sel85oG3jQCNtXYfa | père | Blue |
| sel5yHur9ogq3dTZX | mère | Cyan |
| sel7yskomlHxu5D3j | fils | Cyan |
| selkLUMdmcfyvsrxo | fille | Red |
| sel5fgfA0yA9XAwGf | frère | Blue |
| seltuJ3DNWcN2JDIY | sœur | Pink |
| selHIxmdTFBDjySzp | Entreprise de | Purple |
| selAyxExIeHCMqmng | autre | Purple |

---

## 🎯 **Problèmes Identifiés**

### **Problème 1 : Formule "Rabais familial %" Incorrecte**

**Champ actuel :** `fldpEAuzKECISrgM6`  
**Formule actuelle :** `{flddyUKRSSHe3d1Co} * 0.01`

**Résultat :**
- 1 membre → 0.01 (1%)
- 2 membres → 0.02 (2%)
- 4 membres → 0.04 (4%)

**❌ INCORRECT !** La formule devrait être :
- 1 membre → 0%
- 2 membres → 4%
- 4 membres → 8%
- 10+ membres → 20% (max)

---

### **Problème 2 : Champ "Nb membres famille (total)" Redondant**

**Champ :** `fld2R56MEGtsH2SEt`  
**Formule :** `{flddyUKRSSHe3d1Co} + 1`

**Problème :** Ajoute +1 au comptage déjà correct de "Nb membres famille" !

**Résultat actuel :**
- Nb membres famille = 2
- Nb membres famille (total) = 3

**❌ INCORRECT !** Ce champ doit être supprimé.

---

### **Problème 3 : Champs "Rabais Groupe Familial (%)" et "Montant Rabais Familial (CHF)" Vides**

**Champs :**
- `fldNHPto00tiybfnb` (Rabais Groupe Familial %)
- `fldkJ1SFLkPNbL5pj` (Montant Rabais Familial CHF)

**Problème :** Ces champs sont de type **Number** et **Currency**, mais devraient être de type **Formula** pour calculer automatiquement !

---

### **Problème 4 : Champ "Lié à (famille)" Doublon ?**

**Champ :** `fldt6pklPvJmGq5FJ`  
**Type :** Link (multiple, bidirectionnel)

**Question :** Ce champ semble faire doublon avec "Membres de la famille" (`fld3nKyHeghlKwUCq`).

**À vérifier :** Est-ce que ce champ est utilisé ? Si non, le supprimer.

---

## ✅ **Formules Correctes à Appliquer**

### **Formule 1 : Rabais Groupe Familial (%)**

**Champ :** `fldNHPto00tiybfnb` (à convertir en Formula)

```airtable
IF(
  {flddyUKRSSHe3d1Co} >= 2,
  MIN(({flddyUKRSSHe3d1Co} - 1) * 2 + 2, 20),
  0
)
```

**Explication :**
- Si 1 membre → 0%
- Si 2 membres → (2-1) × 2 + 2 = **4%**
- Si 4 membres → (4-1) × 2 + 2 = **8%**
- Si 10 membres → (10-1) × 2 + 2 = **20%**
- Si 15 membres → MIN(30, 20) = **20%** (max)

---

### **Formule 2 : Montant Rabais Familial (CHF)**

**Champ :** `fldkJ1SFLkPNbL5pj` (à convertir en Formula)

```airtable
{fldjS5xq3CVfIdIEt} * ({fldNHPto00tiybfnb} / 100)
```

**Où :**
- `{fldjS5xq3CVfIdIEt}` = Tarif applicable mandat de gestion
- `{fldNHPto00tiybfnb}` = Rabais Groupe Familial (%)

**Exemple :**
- Tarif = 185 CHF
- Rabais = 8%
- Montant rabais = 185 × (8 / 100) = **14.80 CHF**

---

### **Formule 3 : Prix Final avec Rabais (CHF)**

**Nouveau champ à créer :** `Prix final avec rabais (CHF)`

```airtable
{fldjS5xq3CVfIdIEt} - {fldkJ1SFLkPNbL5pj}
```

**OU (version simplifiée) :**

```airtable
{fldjS5xq3CVfIdIEt} * (1 - {fldNHPto00tiybfnb} / 100)
```

**Exemple :**
- Tarif = 185 CHF
- Rabais = 8%
- Prix final = 185 × (1 - 8/100) = 185 × 0.92 = **170.20 CHF**

---

## 🤖 **Plan d'Automatisation Airtable**

### **Objectif**

Lier automatiquement tous les membres d'une famille dans le champ "Membres de la famille" quand :
1. Un nouveau client est créé avec un "Membre principal du groupe"
2. Le "Code Famille (hérité)" est rempli

---

### **Déclencheur**

**Quand un enregistrement est créé ou modifié**
- Table : Clients
- Conditions :
  - "Membre principal du groupe" n'est pas vide
  - "Code Famille (hérité)" n'est pas vide

---

### **Actions**

1. **Trouver tous les membres de la même famille**
   - Rechercher dans la table "Clients"
   - Condition : "Code Famille (hérité)" = {Code Famille (hérité)} de l'enregistrement actuel

2. **Lier tous les membres entre eux**
   - Pour chaque membre trouvé :
     - Mettre à jour le champ "Membres de la famille"
     - Ajouter tous les autres membres de la famille

---

### **Limitations d'Airtable Automations**

⚠️ **Problème :** Les automations Airtable ne permettent PAS de :
- Faire des boucles (loop) sur plusieurs enregistrements
- Mettre à jour plusieurs enregistrements en une seule action

**Solution :** Utiliser un **Script** Airtable au lieu d'une automation simple !

---

## 📝 **Prochaines Étapes**

1. ✅ Créer un script Airtable pour lier automatiquement les membres de famille
2. ✅ Corriger les formules de rabais
3. ✅ Supprimer le champ redondant "Nb membres famille (total)"
4. ✅ Tester avec la famille Bussat
5. ✅ Documenter le système complet

---

## 🔗 **IDs des Champs Importants (pour le script)**

```javascript
const FIELD_IDS = {
  // Champs de base
  NOM_CLIENT: 'fldoJ7b8Q7PaM27Vd',
  PRENOM: 'fldfhjuxTQwZipdOf',
  NOM: 'fldaADa3p1WhaIKhW',
  
  // Relations familiales
  RELATIONS_FAMILIALES: 'fldXEhXcXbV40f6zM',
  CODE_GROUPE_FAMILIAL: 'fldJ2qDQMZaFKSwRq',
  MEMBRE_PRINCIPAL: 'fldDyjnIEYKO9aO8e',
  CODE_FAMILLE_HERITE: 'fldyMVcOhIv44jtb0',
  MEMBRES_FAMILLE: 'fld3nKyHeghlKwUCq',
  
  // Comptage et rabais
  NB_MEMBRES_FAMILLE: 'flddyUKRSSHe3d1Co',
  RABAIS_FAMILIAL_PCT: 'fldNHPto00tiybfnb',
  MONTANT_RABAIS_CHF: 'fldkJ1SFLkPNbL5pj',
  TARIF_MANDAT: 'fldjS5xq3CVfIdIEt'
};
```

---

**Fin de l'analyse**
