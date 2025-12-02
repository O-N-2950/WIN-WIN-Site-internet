# 🎯 GUIDE DE CONFIGURATION - AUTOMATION AIRTABLE RABAIS FAMILIAL

## ✅ PRÉREQUIS

Avant de configurer l'automation, vous devez créer **1 nouveau champ** dans la table "Clients".

### Champ à créer : "Lié à (famille)"

1. Ouvrez la table "Clients" dans Airtable
2. Cliquez sur le bouton **"+"** pour ajouter un nouveau champ
3. Configurez le champ comme suit :

| Paramètre | Valeur |
|-----------|--------|
| **Nom du champ** | `Lié à (famille)` |
| **Type de champ** | `Multiple record links` (Lien vers des enregistrements) |
| **Table liée** | `Clients` (même table) |
| **Lien bidirectionnel** | ✅ **OUI** (cochez "Allow linking to multiple records") |
| **Nom du champ inverse** | `Lié à (famille)` (même nom) |

4. Cliquez sur **"Create field"**

**⚠️ IMPORTANT :** Une fois le champ créé, notez son **Field ID** (visible dans l'URL ou via l'API). Vous devrez remplacer `fldXXXXXXXXXXXXXXX` dans le script par ce Field ID.

---

## 📋 ÉTAPE 1 : CRÉER L'AUTOMATION

1. Dans Airtable, allez dans l'onglet **"Automatisations"**
2. Cliquez sur **"+ Créer une automatisation"**
3. Nommez l'automation : **"Rabais Familial - Comptage et Liens"**

---

## 🔔 ÉTAPE 2 : CONFIGURER LE DÉCLENCHEUR (TRIGGER)

1. Cliquez sur **"Ajouter un déclencheur"**
2. Sélectionnez **"Lorsqu'une entrée est mise à jour"** (When record is updated)
3. Configurez comme suit :

| Paramètre | Valeur |
|-----------|--------|
| **Table** | `Clients` |
| **Champ surveillé** | `Code Groupe Familial` |
| **Condition** | `Code Groupe Familial n'est pas vide` |

4. Cliquez sur **"Terminé"**

**⚠️ ATTENTION :** Ne surveillez PAS le champ "Code Parrainage" (qui est une formule calculée). Surveillez bien **"Code Groupe Familial"** (qui est un champ texte manuel).

---

## ⚙️ ÉTAPE 3 : CONFIGURER L'ACTION (SCRIPT)

1. Cliquez sur **"+ Ajouter une action"**
2. Sélectionnez **"Exécuter un script"** (Run script)
3. Configurez les **variables d'entrée** :

| Nom de la variable | Valeur |
|-------------------|--------|
| `clientId` | Record ID (depuis le déclencheur) |
| `codeGroupeFamilial` | Code Groupe Familial (depuis le déclencheur) |

**Comment ajouter les variables :**
- Cliquez sur **"+ Add input variable"**
- Nom : `clientId`
- Valeur : Cliquez sur le champ de saisie → Sélectionnez **"Record ID"** dans la liste déroulante
- Répétez pour `codeGroupeFamilial` en sélectionnant le champ **"Code Groupe Familial"**

4. **Copiez-collez le script** depuis le fichier `AIRTABLE-AUTOMATION-SCRIPT-FINAL.js`

5. **⚠️ IMPORTANT :** Remplacez `fldXXXXXXXXXXXXXXX` par le vrai Field ID du champ "Lié à (famille)" que vous avez créé à l'étape 1.

```javascript
const FIELD_IDS = {
  CODE_GROUPE_FAMILIAL: 'fld7adFgijiW0Eqhj',
  STATUT_CLIENT: 'fldw9QKnjkINjZ7kQ',
  NB_MEMBRES_ACTIFS: 'fldRPfLKDNO3mwXhb',
  LIENS_FAMILLE: 'fldXXXXXXXXXXXXXXX'  // ⚠️ REMPLACER ICI
};
```

6. Cliquez sur **"Terminé"**

---

## 🚀 ÉTAPE 4 : ACTIVER L'AUTOMATION

1. Vérifiez que l'automation est bien configurée :
   - ✅ Déclencheur : "Lorsqu'une entrée est mise à jour" sur "Code Groupe Familial"
   - ✅ Action : "Exécuter un script" avec 2 variables d'entrée
   - ✅ Script copié et Field ID remplacé

2. Cliquez sur le **bouton vert "Activer"** (en haut à droite)

3. L'automation est maintenant **ACTIVE** ✅

---

## 🧪 ÉTAPE 5 : TESTER L'AUTOMATION

### Test 1 : Modifier un client existant

1. Ouvrez un client dans Airtable (par exemple "Olivier Neukomm")
2. Modifiez n'importe quel champ (par exemple, ajoutez un espace dans l'adresse)
3. Sauvegardez
4. Attendez 5-10 secondes
5. Vérifiez que :
   - ✅ "Nb membres famille actifs" est mis à jour (devrait afficher 2 ou 3)
   - ✅ "Lié à (famille)" contient des liens vers les autres membres

### Test 2 : Créer 3 nouveaux clients

Vous pouvez utiliser le script de test backend :

```bash
cd /home/ubuntu/winwin-website
pnpm test test/test-famille-3-mandats.ts
```

Cela créera automatiquement 3 clients (Jean, Marie, Entreprise) avec le même code groupe familial "EXEM-QMAC".

**Vérifiez ensuite dans Airtable :**
- ✅ Les 3 clients ont "Nb membres famille actifs" = 3
- ✅ Les 3 clients sont liés entre eux dans "Lié à (famille)"
- ✅ Le rabais familial est calculé automatiquement (6% pour 3 membres)

---

## 📊 VÉRIFICATION DES RÉSULTATS

### Exemple avec 3 membres (Jean, Marie, Entreprise)

| Client | Code Groupe Familial | Statut | Nb membres actifs | Rabais % | Lié à (famille) |
|--------|---------------------|--------|-------------------|----------|-----------------|
| Jean Exemple | EXEM-QMAC | NOUVEAU CLIENT | 3 | 6% | Marie, Entreprise |
| Marie Exemple | EXEM-QMAC | NOUVEAU CLIENT | 3 | 6% | Jean, Entreprise |
| Ma petite Entreprise Sàrl | EXEM-QMAC | NOUVEAU CLIENT | 3 | 6% | Jean, Marie |

**Formule de calcul du rabais :**
```
Rabais % = (Nb membres - 1) × 2 + 2
Rabais % = (3 - 1) × 2 + 2 = 6%
```

---

## 🐛 DÉPANNAGE

### L'automation ne se déclenche pas

**Causes possibles :**

1. ❌ **Le trigger surveille le mauvais champ**
   - Solution : Vérifiez que vous surveillez "Code Groupe Familial" et PAS "Code Parrainage"

2. ❌ **L'automation n'est pas activée**
   - Solution : Vérifiez que le bouton est vert (activé) en haut à droite

3. ❌ **Le champ "Code Groupe Familial" est vide**
   - Solution : Assurez-vous que le client a bien un code groupe familial (ex: "EXEM-QMAC")

4. ❌ **Le statut du client n'est pas "NOUVEAU CLIENT" ou "Actif"**
   - Solution : Changez le statut du client

### Le script échoue avec une erreur

**Erreurs courantes :**

1. ❌ **"Field not found"**
   - Solution : Vérifiez que vous avez bien remplacé `fldXXXXXXXXXXXXXXX` par le vrai Field ID

2. ❌ **"Variables d'entrée manquantes"**
   - Solution : Vérifiez que vous avez bien configuré les 2 variables d'entrée (`clientId` et `codeGroupeFamilial`)

3. ❌ **"Cannot read property 'id' of undefined"**
   - Solution : Vérifiez que le champ "Lié à (famille)" existe bien et est de type "Multiple Record Links"

### Comment voir les logs de l'automation

1. Ouvrez l'automation dans Airtable
2. Cliquez sur l'onglet **"Historique"** (en haut)
3. Cliquez sur une exécution pour voir les détails
4. Les `console.log()` du script sont affichés dans les logs

**Exemple de logs réussis :**
```
=== DÉBUT AUTOMATION RABAIS FAMILIAL ===
Client ID: rec10J9Jd6QJbl2fR
Code Groupe Familial: EXEM-QMAC
🔍 Recherche des membres du groupe familial: EXEM-QMAC
✅ Nombre de membres actifs trouvés: 3
📋 Liste des membres:
  - Record ID: rec10J9Jd6QJbl2fR | Statut: NOUVEAU CLIENT
  - Record ID: rec87Sr3hCkGkYU0J | Statut: NOUVEAU CLIENT
  - Record ID: rec9tFPtaXvzmZICl | Statut: NOUVEAU CLIENT
🔗 Création des liens bidirectionnels entre membres...
  ✓ Membre rec10J9Jd6QJbl2fR → lié à 2 autres membres
  ✓ Membre rec87Sr3hCkGkYU0J → lié à 2 autres membres
  ✓ Membre rec9tFPtaXvzmZICl → lié à 2 autres membres
💰 Rabais familial calculé: 6%
=== AUTOMATION TERMINÉE AVEC SUCCÈS ===
```

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. Vérifiez l'historique de l'automation dans Airtable
2. Lisez les messages d'erreur dans les logs
3. Vérifiez que tous les Field IDs sont corrects
4. Testez avec un seul client d'abord avant de tester avec plusieurs

---

## ✅ CHECKLIST FINALE

Avant de valider que l'automation fonctionne :

- [ ] Le champ "Lié à (famille)" est créé (type Multiple Record Links)
- [ ] Le Field ID de "Lié à (famille)" est remplacé dans le script
- [ ] Le trigger surveille "Code Groupe Familial" (PAS "Code Parrainage")
- [ ] Les 2 variables d'entrée sont configurées (clientId, codeGroupeFamilial)
- [ ] L'automation est activée (bouton vert)
- [ ] Le test avec 3 clients montre bien "Nb membres actifs" = 3
- [ ] Les liens bidirectionnels sont créés dans "Lié à (famille)"
- [ ] Le rabais familial est calculé automatiquement (6% pour 3 membres)

**Si tous les points sont cochés, l'automation est opérationnelle ! 🎉**
