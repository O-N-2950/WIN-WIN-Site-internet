# Logique du Système de Relations Familiales

## 🎯 Vue d'Ensemble

Le système de relations familiales permet de gérer automatiquement les liens entre membres d'une même famille avec **réciprocité automatique** basée sur le genre.

---

## 📋 Structure des Champs Airtable

### **1. Champ "Relations familiales" (Single Select)**

**Type :** Liste déroulante avec 26 valeurs

**Utilisation :** Vous sélectionnez **manuellement** la relation de ce client vers les autres membres de sa famille.

**Valeurs disponibles :**

#### Relations Conjugales (2)
1. Conjoint
2. Conjointe

#### Relations Parent-Enfant (4)
3. Père
4. Mère
5. Fils
6. Fille

#### Relations Beau-Parent / Beau-Enfant (4)
7. Beau-père
8. Belle-mère
9. Beau-fils
10. Belle-fille

#### Relations Grand-Parent / Petit-Enfant (4)
11. Grand-père
12. Grand-mère
13. Petit-fils
14. Petite-fille

#### Relations Frère / Sœur (2)
15. Frère
16. Sœur

#### Relations Beau-Frère / Belle-Sœur (2)
17. Beau-frère
18. Belle-sœur

#### Relations Oncle-Tante / Neveu-Nièce (4)
19. Oncle
20. Tante
21. Neveu
22. Nièce

#### Relations Spéciales (4)
23. **Membre fondateur** ⭐
24. Entreprise familiale
25. Propriétaire
26. Autre

---

### **2. Champ "Membres de la famille" (Link to another record)**

**Type :** Lien bidirectionnel vers la table "Clients"

**Utilisation :** Vous sélectionnez les autres membres de la famille. Le lien inverse se crée **automatiquement**.

**Exemple :**
```
Antoine → Sélectionne Sophie dans "Membres de la famille"
Résultat automatique : Sophie voit Antoine dans son champ "Membres de la famille"
```

---

### **3. Champ "Formule d'appel" (Existant)**

**Type :** Single Select

**Valeurs :**
- Monsieur → Homme
- Madame → Femme
- (vide) → Entreprise

**Utilisation :** Détermine le genre pour calculer la réciprocité.

---

### **4. Champ "Relation réciproque" (Formula) - À CRÉER**

**Type :** Formule calculée automatiquement

**Fonction :** Calcule la relation inverse basée sur :
1. La relation définie par l'autre personne
2. Le genre des deux personnes

**Exemple :**
```
Antoine (Monsieur) → Sophie : "Conjointe"
Formule calcule : Sophie → Antoine : "Conjoint"
```

---

## 🔄 Table de Réciprocité Complète

| Relation A→B | Genre A | Genre B | Réciprocité B→A |
|--------------|---------|---------|-----------------|
| Conjoint | Homme | Femme | Conjointe |
| Conjointe | Femme | Homme | Conjoint |
| Père | Homme | Homme | Fils |
| Père | Homme | Femme | Fille |
| Mère | Femme | Homme | Fils |
| Mère | Femme | Femme | Fille |
| Fils | Homme | Homme | Père |
| Fils | Homme | Femme | Mère |
| Fille | Femme | Homme | Père |
| Fille | Femme | Femme | Mère |
| Beau-père | Homme | Homme | Beau-fils |
| Beau-père | Homme | Femme | Belle-fille |
| Belle-mère | Femme | Homme | Beau-fils |
| Belle-mère | Femme | Femme | Belle-fille |
| Beau-fils | Homme | Homme | Beau-père |
| Beau-fils | Homme | Femme | Belle-mère |
| Belle-fille | Femme | Homme | Beau-père |
| Belle-fille | Femme | Femme | Belle-mère |
| Grand-père | Homme | Homme | Petit-fils |
| Grand-père | Homme | Femme | Petite-fille |
| Grand-mère | Femme | Homme | Petit-fils |
| Grand-mère | Femme | Femme | Petite-fille |
| Petit-fils | Homme | Homme | Grand-père |
| Petit-fils | Homme | Femme | Grand-mère |
| Petite-fille | Femme | Homme | Grand-père |
| Petite-fille | Femme | Femme | Grand-mère |
| Frère | Homme | Homme | Frère |
| Frère | Homme | Femme | Sœur |
| Sœur | Femme | Homme | Frère |
| Sœur | Femme | Femme | Sœur |
| Beau-frère | Homme | Femme | Belle-sœur |
| Belle-sœur | Femme | Homme | Beau-frère |
| Oncle | Homme | Homme | Neveu |
| Oncle | Homme | Femme | Nièce |
| Tante | Femme | Homme | Neveu |
| Tante | Femme | Femme | Nièce |
| Neveu | Homme | Homme | Oncle |
| Neveu | Homme | Femme | Tante |
| Nièce | Femme | Homme | Oncle |
| Nièce | Femme | Femme | Tante |
| Propriétaire | Tout | Entreprise | Entreprise familiale |
| Entreprise familiale | Entreprise | Tout | Propriétaire |

---

## 📝 Workflow Manuel (Ce que VOUS faites)

### **Étape 1 : Désigner le Membre Fondateur**

1. Ouvrir la fiche du client principal (ex: Antoine Bussat)
2. Champ "Relations familiales" → Sélectionner **"Membre fondateur"**
3. Sauvegarder

### **Étape 2 : Lier les Membres de la Famille**

1. Rester sur la fiche d'Antoine
2. Champ "Membres de la famille" → Cliquer et sélectionner :
   - Sophie Bussat
   - Henri Bussat
   - Cabinet dentaire Antoine Bussat Sàrl
3. Sauvegarder

**Résultat automatique :**
- Sophie, Henri et le Cabinet voient maintenant Antoine dans leur champ "Membres de la famille"

### **Étape 3 : Définir les Relations**

Pour chaque membre lié, définir la relation d'Antoine vers eux :

1. Antoine → Sophie : Sélectionner **"Conjointe"**
2. Antoine → Henri : Sélectionner **"Fils"**
3. Antoine → Cabinet : Sélectionner **"Propriétaire"**

---

## 🤖 Automatisation (Ce que le SYSTÈME fait)

### **1. Liens Bidirectionnels Automatiques**

Dès que vous liez Antoine à Sophie, le système crée automatiquement le lien inverse.

### **2. Calcul de la Relation Réciproque**

La formule "Relation réciproque" lit :
1. La relation définie par l'autre personne
2. Les genres des deux personnes
3. Calcule automatiquement la relation inverse

**Exemple :**
```
Antoine (Monsieur) définit : Sophie = "Conjointe"
Formule calcule pour Sophie : Antoine = "Conjoint"
```

### **3. Affichage sur les Factures Stripe**

Le champ "Liste membres pour facture" génère automatiquement :
```
Sophie Bussat (Conjointe), Henri Bussat (Fils), Cabinet dentaire Antoine Bussat Sàrl (Entreprise familiale)
```

---

## ⭐ Rôle Spécial du "Membre Fondateur"

### **Pourquoi ce statut est important ?**

1. **Identification du client principal**
   - C'est lui qui a créé le groupe familial
   - C'est lui qui a généré le code de parrainage

2. **Priorité d'affichage**
   - Apparaît en premier sur les factures Stripe
   - Identifié comme "contact principal"

3. **Gestion des notifications**
   - Reçoit les alertes si un membre annule son mandat
   - Reçoit les notifications de changement de rabais familial

4. **Calcul du rabais familial**
   - Le rabais s'applique à TOUS les membres (y compris le fondateur)
   - Formule : (nombre_mandats - 1) × 2 + 2%, max 20%

---

## 🎯 Exemple Complet : Famille Bussat

### **Configuration Manuelle**

| Client | Relations familiales | Membres de la famille | Genre |
|--------|---------------------|----------------------|-------|
| Antoine Bussat | **Membre fondateur** | Sophie, Henri, Cabinet | Monsieur |
| Sophie Bussat | (vide) | Antoine | Madame |
| Henri Bussat | (vide) | Antoine | Monsieur |
| Cabinet dentaire | (vide) | Antoine | (vide) |

### **Relations Définies Manuellement (par Antoine)**

- Antoine → Sophie : "Conjointe"
- Antoine → Henri : "Fils"
- Antoine → Cabinet : "Propriétaire"

### **Relations Calculées Automatiquement**

- Sophie → Antoine : "Conjoint" (formule)
- Henri → Antoine : "Père" (formule)
- Cabinet → Antoine : "Entreprise familiale" (formule)

### **Affichage sur Facture Stripe d'Antoine**

```
Membres de la famille :
- Sophie Bussat (Conjointe)
- Henri Bussat (Fils)
- Cabinet dentaire Antoine Bussat Sàrl (Entreprise familiale)

Rabais familial : 8% (4 mandats)
```

---

## ✅ Avantages du Système

1. **Simplicité** : Vous ne définissez les relations qu'une seule fois
2. **Cohérence** : Les relations réciproques sont toujours correctes
3. **Automatisation** : Le système gère les liens bidirectionnels
4. **Flexibilité** : Support de 26 types de relations différentes
5. **Précision** : Tient compte du genre pour les relations genrées

---

## 🚀 Prochaines Étapes

1. ✅ Créer le champ "Membres de la famille" (FAIT)
2. ⏳ Créer le champ "Relations familiales" avec 26 valeurs
3. ⏳ Créer la formule "Relation réciproque"
4. ⏳ Créer la formule "Liste membres pour facture"
5. ⏳ Tester avec la famille Bussat
