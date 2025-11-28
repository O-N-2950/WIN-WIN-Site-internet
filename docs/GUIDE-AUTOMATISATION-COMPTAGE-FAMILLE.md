# Guide d'Installation : Automatisation Comptage Familial

## 🎯 Objectif

Compter automatiquement tous les membres **ACTIFS** de chaque famille et mettre à jour le champ "Nb membres famille (total)" pour tous les membres.

---

## 📋 Fonctionnement

### **Déclencheur**

- Quand un enregistrement est créé ou modifié
- Table : **Clients**
- Condition : **"Code Famille (hérité)" n'est pas vide**

### **Action**

1. Récupère le "Code Famille (hérité)" de l'enregistrement modifié
2. Compte tous les clients avec le même code famille ET statut = "Actif"
3. Met à jour "Nb membres famille (total)" pour **TOUS** les membres de la famille

---

## 🚀 Installation

### **Étape 1 : Créer l'Automatisation**

1. **Airtable → Automatisations → Créer une automatisation**
2. **Nom :** `Compter membres famille automatiquement`

---

### **Étape 2 : Configurer le Déclencheur**

1. **Type :** Quand un enregistrement correspond à des conditions
2. **Table :** Clients
3. **Condition :**
   - Champ : **Code Famille (hérité)**
   - Opérateur : **n'est pas vide**

---

### **Étape 3 : Ajouter l'Action**

1. **Type :** Exécuter un script
2. **Copier le script depuis :** `scripts/airtable-count-family-members.js`
3. **Variable d'entrée :**
   - Nom : `recordId`
   - Valeur : **Record ID** (du déclencheur)

---

### **Étape 4 : Activer l'Automatisation**

1. **Tester avec un enregistrement de test**
2. **Vérifier les logs**
3. **Activer l'automatisation**

---

## 🧪 Test

### **Scénario 1 : Famille Bussat (4 Membres Actifs)**

**Avant :**
| Client | Statut | Nb membres famille (total) |
|--------|--------|---------------------------|
| Antoine | Actif | 3 ❌ |
| Sophie | Actif | 3 ❌ |
| Henri | Actif | 3 ❌ |
| Cabinet | Actif | 3 ❌ |

**Après :**
| Client | Statut | Nb membres famille (total) |
|--------|--------|---------------------------|
| Antoine | Actif | **4** ✅ |
| Sophie | Actif | **4** ✅ |
| Henri | Actif | **4** ✅ |
| Cabinet | Actif | **4** ✅ |

---

### **Scénario 2 : Henri Devient Inactif**

**Action :** Changer le statut d'Henri en "Inactif"

**Résultat :**
| Client | Statut | Nb membres famille (total) |
|--------|--------|---------------------------|
| Antoine | Actif | **3** ✅ |
| Sophie | Actif | **3** ✅ |
| Henri | **Inactif** | **3** ✅ |
| Cabinet | Actif | **3** ✅ |

**Note :** Henri affiche toujours "3" car l'automatisation compte seulement les actifs, mais Henri lui-même n'est plus actif !

---

### **Scénario 3 : Nouveau Membre Ajouté**

**Action :** Créer un nouveau client "Marie Bussat"
- Statut : Actif
- Membre principal du groupe : Antoine Bussat
- Code Famille (hérité) : FAMILLE-BUSSAT-qC2v

**Résultat :**
| Client | Statut | Nb membres famille (total) |
|--------|--------|---------------------------|
| Antoine | Actif | **5** ✅ |
| Sophie | Actif | **5** ✅ |
| Henri | Actif | **5** ✅ |
| Cabinet | Actif | **5** ✅ |
| Marie | Actif | **5** ✅ |

---

## 🔧 Dépannage

### **Problème : "Nb membres famille (total)" Ne Se Met Pas à Jour**

**Solutions :**

1. **Vérifier que l'automatisation est activée**
2. **Vérifier les logs de l'automatisation**
3. **Vérifier que "Code Famille (hérité)" n'est pas vide**
4. **Déclencher manuellement l'automatisation sur un enregistrement de test**

---

### **Problème : Erreur "Field ID Not Found"**

**Cause :** Les IDs de champs ont changé

**Solution :**

1. **Récupérer les IDs corrects via MCP**
2. **Mettre à jour les IDs dans le script**

---

### **Problème : L'Automatisation Ne Se Déclenche Pas**

**Vérifications :**

1. **Le champ "Code Famille (hérité)" est-il rempli ?**
2. **L'automatisation est-elle activée ?**
3. **Y a-t-il des erreurs dans les logs ?**

---

## 📊 Avantages de Cette Solution

| Avantage | Description |
|----------|-------------|
| ✅ **Automatique** | Pas besoin de mise à jour manuelle |
| ✅ **Dynamique** | S'adapte aux changements de statut |
| ✅ **Précis** | Compte seulement les membres actifs |
| ✅ **Temps réel** | Mise à jour immédiate |
| ✅ **Fiable** | Basé sur "Code Famille (hérité)" |

---

## 🎯 Prochaines Étapes

1. ✅ Installer l'automatisation
2. ✅ Tester avec la famille Bussat
3. ✅ Vérifier que le comptage est correct
4. ✅ Installer l'automatisation pour retirer les membres inactifs
5. ✅ Tester le système complet

---

## 📝 Notes Importantes

- **Le champ "Nb membres famille (total)" doit être de type Number** (pas Formula)
- **L'automatisation se déclenche à chaque modification** (peut consommer des automations Airtable)
- **Pour optimiser, ajoutez des conditions supplémentaires** (ex: seulement si "Statut du client" ou "Membre principal du groupe" change)

---

## 🔗 Fichiers Associés

- Script : `scripts/airtable-count-family-members.js`
- Guide membres inactifs : `docs/GUIDE-AUTOMATISATION-MEMBRES-INACTIFS.md`
- Analyse structure : `docs/ANALYSE-STRUCTURE-AIRTABLE-FAMILLE.md`
