# Guide d'Installation : Automatisation des Membres Inactifs

## 🎯 Objectif

Quand un client passe au statut "Inactif", cette automatisation :
1. ✅ Retire automatiquement ce client de toutes les familles
2. ✅ Vide son champ "Membres de la famille"
3. ✅ Met à jour le comptage des membres automatiquement
4. ✅ Recalcule le rabais familial pour tous les membres restants

---

## 📋 Prérequis

- ✅ Champ "Statut du client" avec les valeurs : Actif, Inactif, En attente, Mandat résilié, Prospect
- ✅ Champ "Membres de la famille" (Link bidirectionnel vers Clients)
- ✅ Champ "Nb membres famille" (Formula)

---

## 🚀 Installation de l'Automatisation

### Étape 1 : Créer l'Automatisation

1. **Ouvrir Airtable** → Aller dans votre base "ERP Clients WW"
2. **Cliquer sur "Automatisations"** (en haut à droite)
3. **Cliquer sur "Créer une automatisation"**
4. **Nom de l'automatisation :** `Retirer membres inactifs des familles`

---

### Étape 2 : Configurer le Déclencheur

1. **Sélectionner "Quand un enregistrement correspond à des conditions"**
2. **Configuration :**
   - **Table :** Clients
   - **Champ :** Statut du client
   - **Condition :** est égal à → **Inactif**
3. **Cliquer sur "Suivant"**

---

### Étape 3 : Ajouter l'Action "Exécuter un script"

1. **Cliquer sur "Ajouter une action"**
2. **Sélectionner "Exécuter un script"**
3. **Copier-coller le script** depuis `scripts/airtable-remove-inactive-members.js`
4. **Configurer les variables d'entrée :**
   - **Nom de la variable :** `recordId`
   - **Valeur :** Sélectionner `Record ID` (depuis le déclencheur)

---

### Étape 4 : Tester l'Automatisation

1. **Cliquer sur "Tester"**
2. **Sélectionner un enregistrement de test** (par exemple, Henri Bussat)
3. **Vérifier que le script s'exécute sans erreur**
4. **Annuler les modifications de test** (remettre Henri en "Actif")

---

### Étape 5 : Activer l'Automatisation

1. **Cliquer sur "Activer"** (bouton en haut à droite)
2. **L'automatisation est maintenant active !**

---

## 🧪 Test Complet

### Scénario de Test : Henri Bussat Devient Inactif

**État Initial :**

| Client | Statut | Membres de la famille | Nb membres famille | Rabais % |
|--------|--------|----------------------|-------------------|----------|
| Antoine | Actif | Sophie, Henri, Cabinet | 4 | 8% |
| Sophie | Actif | Antoine, Henri, Cabinet | 4 | 8% |
| Henri | **Actif** | Antoine, Sophie, Cabinet | 4 | 8% |
| Cabinet | Actif | Antoine, Sophie, Henri | 4 | 8% |

---

**Action : Changer le statut d'Henri en "Inactif"**

---

**État Attendu Après Automatisation :**

| Client | Statut | Membres de la famille | Nb membres famille | Rabais % |
|--------|--------|----------------------|-------------------|----------|
| Antoine | Actif | Sophie, Cabinet | **3** ✅ | **6%** ✅ |
| Sophie | Actif | Antoine, Cabinet | **3** ✅ | **6%** ✅ |
| Henri | **Inactif** | **(vide)** | **0** ✅ | **0%** ✅ |
| Cabinet | Actif | Antoine, Sophie | **3** ✅ | **6%** ✅ |

---

## ✅ Vérifications

1. **Henri n'apparaît plus dans "Membres de la famille" des autres membres**
2. **Le champ "Membres de la famille" d'Henri est vide**
3. **"Nb membres famille" passe de 4 à 3 pour Antoine, Sophie, Cabinet**
4. **"Rabais familial %" passe de 8% à 6% pour Antoine, Sophie, Cabinet**
5. **"Prix final avec rabais" est recalculé automatiquement**

---

## 🔄 Scénario Inverse : Henri Redevient Actif

**⚠️ Limitation :** L'automatisation ne re-lie PAS automatiquement les membres !

**Solution Manuelle :**

1. **Changer le statut d'Henri en "Actif"**
2. **Ouvrir la fiche d'Antoine**
3. **Ajouter Henri dans "Membres de la famille"**
4. **Le lien bidirectionnel se crée automatiquement**
5. **Le comptage et le rabais se mettent à jour automatiquement**

---

## 📊 Formules Associées

### Formule "Nb membres famille"

```airtable
IF(
  {Statut du client} = "Actif",
  COUNTA({Membres de la famille}) + 1,
  0
)
```

**Explication :**
- Si le client est "Actif" → Compte les membres + soi-même
- Si le client est "Inactif" → 0

---

### Formule "Rabais familial %"

```airtable
SWITCH(
  {Nb membres famille},
  1, 0,
  2, 0.02,
  3, 0.06,
  4, 0.08,
  0.10
)
```

**Barème :**
- 1 membre → 0%
- 2 membres → 2%
- 3 membres → 6%
- 4 membres → 8%
- 5+ membres → 10%

---

## 🐛 Dépannage

### Problème : Le script échoue avec "recordId is undefined"

**Solution :**
- Vérifier que la variable d'entrée `recordId` est bien configurée
- Sélectionner `Record ID` depuis le déclencheur

---

### Problème : Les membres ne sont pas retirés

**Solution :**
- Vérifier que le champ "Membres de la famille" est bien un lien bidirectionnel
- Vérifier que le nom du champ est exactement "Membres de la famille"

---

### Problème : Le comptage ne se met pas à jour

**Solution :**
- Rafraîchir la page (F5)
- Vérifier que la formule "Nb membres famille" est correcte
- Vérifier que le champ "Statut du client" est bien "Actif"

---

## 📝 Notes Importantes

1. **L'automatisation se déclenche SEULEMENT quand le statut passe à "Inactif"**
   - Si le statut est déjà "Inactif", l'automatisation ne se déclenche pas
   - Pour forcer le déclenchement, passer en "Actif" puis "Inactif"

2. **L'automatisation ne fonctionne PAS en sens inverse**
   - Quand un client redevient "Actif", il faut re-lier manuellement les membres

3. **Limite de 50 enregistrements par lot**
   - Le script traite automatiquement par lots de 50
   - Pas de limite pratique pour le nombre de membres

---

## 🎯 Prochaines Étapes

1. ✅ Installer l'automatisation
2. ✅ Tester avec un client de test
3. ✅ Vérifier que le comptage et le rabais se mettent à jour
4. ✅ Documenter le processus pour l'équipe

---

**Automatisation créée le 24 novembre 2025**  
**Dernière mise à jour : 24 novembre 2025**
