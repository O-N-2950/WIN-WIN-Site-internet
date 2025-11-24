# Guide de Configuration Airtable - Relations Familiales

## 🎯 Objectif

Compléter le champ "Relations familiales" dans Airtable avec les 26 valeurs nécessaires pour le système de parrainage familial.

---

## ✅ Champs Déjà Créés

1. **"Membres de la famille"** (fld3nKyHeghlKwUCq)
   - Type : Link to another record (bidirectionnel)
   - Permet de lier les membres d'une même famille

2. **"Relations familiales"** (existe déjà)
   - Type : Single Select
   - Contient actuellement 8 valeurs en minuscules
   - **À COMPLÉTER avec 26 valeurs en majuscules**

---

## 📋 Étapes de Configuration

### **Étape 1 : Ouvrir Airtable**

1. Aller sur https://airtable.com
2. Ouvrir la base **"ERP Clients WW"**
3. Ouvrir la table **"Clients"**

---

### **Étape 2 : Modifier le Champ "Relations familiales"**

1. Cliquer sur l'en-tête de colonne **"Relations familiales"**
2. Cliquer sur **"Personnaliser le type de champ"**
3. Vous verrez la liste actuelle des valeurs

---

### **Étape 3 : Ajouter les 26 Valeurs**

**⚠️ IMPORTANT :** Utilisez des **majuscules** au début de chaque mot pour rester professionnel.

#### **Relations Conjugales (2)**
```
Conjoint
Conjointe
```

#### **Relations Parent-Enfant (4)**
```
Père
Mère
Fils
Fille
```

#### **Relations Beau-Parent / Beau-Enfant (4)**
```
Beau-père
Belle-mère
Beau-fils
Belle-fille
```

#### **Relations Grand-Parent / Petit-Enfant (4)**
```
Grand-père
Grand-mère
Petit-fils
Petite-fille
```

#### **Relations Frère / Sœur (2)**
```
Frère
Sœur
```

#### **Relations Beau-Frère / Belle-Sœur (2)**
```
Beau-frère
Belle-sœur
```

#### **Relations Oncle-Tante / Neveu-Nièce (4)**
```
Oncle
Tante
Neveu
Nièce
```

#### **Relations Spéciales (4)**
```
Membre fondateur
Entreprise familiale
Propriétaire
Autre
```

---

### **Étape 4 : Supprimer les Anciennes Valeurs en Minuscules**

**Valeurs à supprimer (ou remplacer) :**
- ❌ "père" → ✅ "Père"
- ❌ "mère" → ✅ "Mère"
- ❌ "épouse" → ✅ "Conjointe"
- ❌ "époux" → ✅ "Conjoint"
- ❌ "fils" → ✅ "Fils"
- ❌ "fille" → ✅ "Fille"
- ❌ "frère" → ✅ "Frère"
- ❌ "sœur" → ✅ "Sœur"

**⚠️ Attention :** Si des clients utilisent déjà ces valeurs, Airtable vous proposera de les migrer vers les nouvelles valeurs.

---

### **Étape 5 : Vérifier le Résultat**

Vous devriez avoir **26 valeurs au total** dans le champ "Relations familiales" :

1. Membre fondateur ⭐
2. Conjoint
3. Conjointe
4. Père
5. Mère
6. Fils
7. Fille
8. Beau-père
9. Belle-mère
10. Beau-fils
11. Belle-fille
12. Grand-père
13. Grand-mère
14. Petit-fils
15. Petite-fille
16. Frère
17. Sœur
18. Beau-frère
19. Belle-sœur
20. Oncle
21. Tante
22. Neveu
23. Nièce
24. Entreprise familiale
25. Propriétaire
26. Autre

---

## 🎯 Utilisation du Système

### **Exemple : Famille Bussat**

#### **Étape 1 : Désigner le Membre Fondateur**

1. Ouvrir la fiche **Antoine Bussat**
2. Champ "Relations familiales" → Sélectionner **"Membre fondateur"**

#### **Étape 2 : Lier les Membres de la Famille**

1. Rester sur la fiche d'Antoine
2. Champ "Membres de la famille" → Sélectionner :
   - Sophie Bussat
   - Henri Bussat
   - Cabinet dentaire Antoine Bussat Sàrl

#### **Étape 3 : Définir les Relations**

1. Ouvrir la fiche **Sophie Bussat**
2. Champ "Relations familiales" → Sélectionner **"Conjointe"**

3. Ouvrir la fiche **Henri Bussat**
4. Champ "Relations familiales" → Sélectionner **"Fils"**

5. Ouvrir la fiche **Cabinet dentaire Antoine Bussat Sàrl**
6. Champ "Relations familiales" → Sélectionner **"Entreprise familiale"**

---

## ✅ Résultat Attendu

| Client | Relations familiales | Membres de la famille |
|--------|---------------------|----------------------|
| Antoine Bussat | **Membre fondateur** | Sophie, Henri, Cabinet |
| Sophie Bussat | **Conjointe** | Antoine |
| Henri Bussat | **Fils** | Antoine |
| Cabinet dentaire | **Entreprise familiale** | Antoine |

---

## 🚀 Prochaines Étapes

Une fois la configuration terminée :

1. ✅ Tester avec la famille Bussat
2. ✅ Créer la formule "Liste membres pour facture"
3. ✅ Intégrer dans les factures Stripe
4. ✅ Calculer les rabais familiaux automatiquement

---

## 📞 Support

Si vous rencontrez des problèmes, contactez-moi dans le chat !
