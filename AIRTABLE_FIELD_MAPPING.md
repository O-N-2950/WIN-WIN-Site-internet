# Mapping des champs Airtable - Table Clients

## Champs utilisés dans le code

| Code (ancien) | Airtable (EXACT) | Type |
|--------------|------------------|------|
| `Email` | `Email du client (table client)` | email |
| `Contact E-mail` | `Contact E-mail` | email |
| `Groupe Familial` | `Groupe Familial` | singleLineText |
| `Nb membres famille actifs` | **CHAMP MANQUANT** | ??? |
| `Tél. Mobile` | `Tél. Mobile` | phoneNumber |
| `Nom` | `Nom` | singleLineText |
| `Prénom` | `Prénom` | singleLineText |
| `Date de naissance` | `Date de naissance` | date |
| `Adresse et no` | `Adresse et no` | singleLineText |
| `NPA` | `NPA` | number |
| `Localité` | `Localité` | singleLineText |
| `Banque` | `Banque` | singleLineText |
| `Type de client` | `Type de client` | singleSelect |
| `Nom de l'entreprise` | `Nom de l'entreprise` | singleLineText |
| `Forme Juridique` | `Forme Juridique` | singleSelect |
| `Nombre d'employés` | `Nombre d'employés` | number |

## ⚠️ PROBLÈME CRITIQUE

Le champ `Nb membres famille actifs` n'existe PAS dans Airtable !

**Solutions possibles :**
1. Créer un champ formule dans Airtable qui compte les membres actifs du groupe familial
2. Calculer côté backend en comptant les records avec le même `Groupe Familial`

## Filtres à corriger

**AVANT (INCORRECT) :**
```
filterByFormula={Email}='...'
```

**APRÈS (CORRECT) :**
```
filterByFormula={Email du client (table client)}='...'
```
