# Guide d'Installation de l'Automatisation Airtable - Liaison Automatique des Membres de Famille

**Date:** 24 novembre 2025  
**Auteur:** Manus AI  
**Objectif:** Automatiser la liaison des membres de famille dans Airtable

---

## 🎯 **Objectif de l'Automatisation**

**Problème :** Lier manuellement tous les membres d'une famille dans le champ "Membres de la famille" est fastidieux et source d'erreurs.

**Solution :** Un script d'automatisation qui :
1. ✅ Détecte tous les membres avec le même "Code Famille (hérité)"
2. ✅ Les lie automatiquement dans "Membres de la famille"
3. ✅ Se déclenche automatiquement quand un nouveau membre est ajouté
4. ✅ Fonctionne pour toutes les familles existantes et futures

---

## 📋 **Prérequis**

Avant d'installer l'automatisation, assurez-vous que :

1. ✅ Le champ **"Membres de la famille"** est créé (type : Link to another record, bidirectionnel)
2. ✅ Le champ **"Code Famille (hérité)"** est créé (type : Lookup)
3. ✅ Le champ **"Membre principal du groupe"** est créé (type : Link to another record)
4. ✅ Le champ **"Relations familiales"** est créé (type : Multiple Selects)

---

## 🚀 **Installation de l'Automatisation**

### **Étape 1 : Créer une Nouvelle Automatisation**

1. **Ouvrir Airtable** → Base "ERP Clients WW"
2. **Cliquer sur "Automations"** (icône éclair en haut à droite)
3. **Cliquer sur "Create automation"**
4. **Nom de l'automatisation :** `Liaison automatique des membres de famille`

---

### **Étape 2 : Configurer le Déclencheur**

1. **Cliquer sur "Add trigger"**
2. **Sélectionner :** "When a record is created or updated"
3. **Configuration :**
   - **Table :** Clients
   - **Fields :** Sélectionner "Code Famille (hérité)"
4. **Cliquer sur "Done"**

---

### **Étape 3 : Ajouter une Condition (Optionnel)**

**Pour éviter de déclencher l'automatisation inutilement :**

1. **Cliquer sur "Add condition"** (après le déclencheur)
2. **Configuration :**
   - **Field :** Code Famille (hérité)
   - **Condition :** is not empty
3. **Cliquer sur "Done"**

---

### **Étape 4 : Ajouter le Script**

1. **Cliquer sur "Add action"**
2. **Sélectionner :** "Run a script"
3. **Copier-coller le script suivant :**

```javascript
/**
 * Script d'Automatisation Airtable : Liaison Automatique des Membres de Famille
 */

const TABLE_NAME = 'Clients';

const FIELD_NAMES = {
  CODE_FAMILLE_HERITE: 'Code Famille (hérité)',
  MEMBRES_FAMILLE: 'Membres de la famille',
  NOM_CLIENT: 'NOM du client',
  RELATIONS_FAMILIALES: 'Relations familiales'
};

async function linkFamilyMembers() {
  console.log('🚀 Démarrage du script de liaison des membres de famille...');
  
  const table = base.getTable(TABLE_NAME);
  
  console.log('📋 Récupération de tous les clients...');
  const query = await table.selectRecordsAsync({
    fields: [
      FIELD_NAMES.CODE_FAMILLE_HERITE,
      FIELD_NAMES.MEMBRES_FAMILLE,
      FIELD_NAMES.NOM_CLIENT,
      FIELD_NAMES.RELATIONS_FAMILIALES
    ]
  });
  
  console.log('🔍 Groupement des clients par famille...');
  const familyGroups = {};
  
  for (const record of query.records) {
    const codesFamille = record.getCellValue(FIELD_NAMES.CODE_FAMILLE_HERITE);
    
    if (!codesFamille || codesFamille.length === 0) {
      continue;
    }
    
    const codeFamille = codesFamille[0];
    
    if (!familyGroups[codeFamille]) {
      familyGroups[codeFamille] = [];
    }
    
    familyGroups[codeFamille].push({
      id: record.id,
      name: record.getCellValue(FIELD_NAMES.NOM_CLIENT),
      relation: record.getCellValue(FIELD_NAMES.RELATIONS_FAMILIALES)
    });
  }
  
  console.log(`✅ ${Object.keys(familyGroups).length} familles trouvées`);
  
  let totalUpdates = 0;
  
  for (const [codeFamille, members] of Object.entries(familyGroups)) {
    console.log(`\n👨‍👩‍👧‍👦 Famille ${codeFamille} : ${members.length} membres`);
    
    if (members.length === 1) {
      console.log('  ⏭️  Un seul membre, aucune liaison nécessaire');
      continue;
    }
    
    const updates = [];
    
    for (const member of members) {
      const otherMembers = members
        .filter(m => m.id !== member.id)
        .map(m => ({ id: m.id }));
      
      updates.push({
        id: member.id,
        fields: {
          [FIELD_NAMES.MEMBRES_FAMILLE]: otherMembers
        }
      });
      
      console.log(`  ✅ ${member.name} → lié à ${otherMembers.length} membres`);
    }
    
    if (updates.length > 0) {
      const batchSize = 50;
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize);
        await table.updateRecordsAsync(batch);
        totalUpdates += batch.length;
      }
    }
  }
  
  console.log(`\n🎉 Script terminé ! ${totalUpdates} clients mis à jour`);
}

await linkFamilyMembers();
```

4. **Cliquer sur "Done"**

---

### **Étape 5 : Activer l'Automatisation**

1. **Cliquer sur le bouton "Turn on"** (en haut à droite)
2. **L'automatisation est maintenant active !** ✅

---

## 🧪 **Test de l'Automatisation**

### **Test 1 : Exécution Manuelle**

**Pour tester l'automatisation sur les familles existantes :**

1. **Ouvrir l'automatisation**
2. **Cliquer sur "Run test"** (en haut à droite)
3. **Sélectionner un enregistrement de test** (ex: Antoine Bussat)
4. **Cliquer sur "Run test"**
5. **Vérifier les logs** dans la console

**Résultat attendu :**
```
🚀 Démarrage du script de liaison des membres de famille...
📋 Récupération de tous les clients...
🔍 Groupement des clients par famille...
✅ 1 familles trouvées

👨‍👩‍👧‍👦 Famille FAMILLE-BUSSAT-qC2v : 4 membres
  ✅ Antoine Bussat → lié à 3 membres
  ✅ Sophie Bussat → lié à 3 membres
  ✅ Henri Bussat → lié à 3 membres
  ✅ Cabinet dentaire, Antoine Bussat Sàrl → lié à 3 membres

🎉 Script terminé ! 4 clients mis à jour
```

---

### **Test 2 : Vérification dans Airtable**

1. **Ouvrir la fiche d'Antoine Bussat**
2. **Vérifier le champ "Membres de la famille"**
3. **Devrait contenir :**
   - Sophie Bussat
   - Henri Bussat
   - Cabinet dentaire, Antoine Bussat Sàrl

4. **Vérifier le champ "Nb membres famille"**
5. **Devrait afficher : 4** ✅

---

### **Test 3 : Ajout d'un Nouveau Membre**

**Pour tester l'automatisation en temps réel :**

1. **Créer un nouveau client :** "Marie Bussat"
2. **Remplir les champs :**
   - **Relations familiales :** fille
   - **Membre principal du groupe :** Antoine Bussat
3. **Enregistrer**

**Résultat attendu :**
- Le champ "Code Famille (hérité)" se remplit automatiquement : FAMILLE-BUSSAT-qC2v
- L'automatisation se déclenche automatiquement
- Le champ "Membres de la famille" se remplit avec : Antoine, Sophie, Henri, Cabinet
- Le champ "Nb membres famille" affiche : **5** ✅

---

## 🔧 **Dépannage**

### **Problème 1 : L'automatisation ne se déclenche pas**

**Causes possibles :**
- ✅ Vérifier que l'automatisation est activée (bouton "Turn on")
- ✅ Vérifier que le champ "Code Famille (hérité)" est rempli
- ✅ Vérifier que le déclencheur est configuré sur "Code Famille (hérité)"

---

### **Problème 2 : Erreur "Field not found"**

**Cause :** Le nom d'un champ dans le script ne correspond pas au nom réel dans Airtable.

**Solution :**
1. Vérifier les noms des champs dans Airtable
2. Modifier les noms dans la section `FIELD_NAMES` du script

---

### **Problème 3 : "Nb membres famille" affiche toujours 1**

**Cause :** Le champ "Membres de la famille" est vide.

**Solution :**
1. Exécuter manuellement l'automatisation (Run test)
2. Vérifier que le script s'exécute sans erreur
3. Vérifier que les membres sont bien liés

---

## 📊 **Résultat Attendu pour la Famille Bussat**

| Client | Relations familiales | Membres de la famille | Nb membres famille | Rabais familial % |
|--------|---------------------|----------------------|-------------------|------------------|
| Antoine Bussat | Membre fondateur | Sophie, Henri, Cabinet | **4** | **8%** |
| Sophie Bussat | épouse | Antoine, Henri, Cabinet | **4** | **8%** |
| Henri Bussat | fils | Antoine, Sophie, Cabinet | **4** | **8%** |
| Cabinet dentaire | Entreprise de | Antoine, Sophie, Henri | **4** | **8%** |

---

## 🎯 **Prochaines Étapes**

1. ✅ Installer l'automatisation dans Airtable
2. ✅ Tester avec la famille Bussat
3. ✅ Corriger les formules de rabais
4. ✅ Supprimer le champ redondant "Nb membres famille (total)"
5. ✅ Intégrer avec le site web WIN WIN

---

## 📝 **Notes Importantes**

### **Limitation 1 : Exécution Manuelle Requise pour les Familles Existantes**

**Problème :** L'automatisation se déclenche seulement quand un enregistrement est **créé ou modifié**.

**Solution :** Pour lier les familles existantes, vous devez :
- **Option A :** Exécuter manuellement l'automatisation (Run test)
- **Option B :** Modifier un champ (ex: ajouter un espace dans "Nom") pour déclencher l'automatisation

---

### **Limitation 2 : Airtable Automations Limits**

**Airtable Free Plan :**
- 100 exécutions d'automatisation par mois
- 1 automatisation par base

**Airtable Plus Plan :**
- 25 000 exécutions par mois
- Automatisations illimitées

**Solution :** Si vous dépassez la limite, passez au plan Plus ou exécutez le script manuellement.

---

## 🚀 **Alternative : Script Standalone**

**Si vous préférez exécuter le script manuellement :**

1. **Ouvrir Airtable** → Base "ERP Clients WW"
2. **Cliquer sur "Extensions"** (icône puzzle en haut à droite)
3. **Ajouter "Scripting"**
4. **Copier-coller le script**
5. **Cliquer sur "Run"**

**Avantage :** Pas de limite d'exécutions !  
**Inconvénient :** Doit être exécuté manuellement.

---

**Fin du guide**
