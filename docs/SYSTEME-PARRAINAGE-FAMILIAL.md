# Système de Parrainage Familial - WIN WIN Finance Group

## Vue d'ensemble

Le système de parrainage familial permet aux clients de WIN WIN Finance de bénéficier de rabais en constituant des groupes familiaux. Chaque membre du groupe bénéficie d'un rabais progressif basé sur le nombre total de membres actifs.

## Fonctionnalités implémentées

### 1. Frontend - Formulaire d'inscription

**Fichier** : `client/src/pages/Inscription.tsx`

**Champ ajouté** :
- `Code de Parrainage (optionnel)` : Champ texte avec validation temps réel
- Format automatique en majuscules
- Placeholder : `OLIV-SeLs`

**Validation temps réel** :
- Debounce de 500ms après la dernière frappe
- Appel à l'API `trpc.parrainage.validateCode`
- Feedback visuel :
  - 🔄 Loader pendant la validation
  - ✅ Bordure verte + message "Code valide ! Vous rejoignez [Prénom] [Nom]"
  - ❌ Bordure rouge + message "Code de parrainage invalide"

### 2. Backend - Router tRPC

**Fichier** : `server/routers/parrainage.ts`

**Endpoints disponibles** :
- `validateCode` : Valider un code de parrainage et récupérer les infos du parrain
- `calculateDiscount` : Calculer le rabais familial pour un nombre de membres donné
- `getFamilyMembers` : Récupérer tous les membres d'un groupe familial
- `calculateFinalPrice` : Calculer le prix final après application du rabais

### 3. Backend - Logique de création de client

**Fichier** : `server/routers/client.ts`

**Workflow lors de la création d'un client** :

1. **Si un code de parrainage est fourni** :
   - Validation du code via `validateReferralCode()`
   - Récupération des données du parrain via `getClientById()`

2. **Scénario 1 : Le parrain a déjà un groupe familial** :
   - Le nouveau client rejoint le groupe existant
   - Champ `Groupe Familial` = groupe du parrain
   - Champ `Relations familiales` = `undefined` (à définir manuellement dans Airtable)

3. **Scénario 2 : Le parrain n'a pas de groupe familial** :
   - Création d'un nouveau groupe avec format `FAMILLE-[CODE]`
   - Le parrain est mis à jour :
     - `Groupe Familial` = nouveau groupe
     - `Relations familiales` = `Membre fondateur`
   - Le nouveau client rejoint le groupe :
     - `Groupe Familial` = nouveau groupe
     - `Relations familiales` = `undefined` (à définir manuellement)

### 4. Module de parrainage

**Fichier** : `server/lib/parrainage.ts`

**Fonctions principales** :

```typescript
// Valider un code de parrainage
validateReferralCode(code: string): Promise<FamilyMember | null>

// Générer un code de parrainage unique
generateFamilyCode(nom: string): string
// Format: NEUK-ABC1 (4 lettres du nom + 4 caractères aléatoires)

// Calculer le rabais familial
calculateFamilyDiscount(totalMandatsActifs: number): number
// Formule: (mandats - 1) × 2% + 2%, max 20%
// Exemples:
// - 1 mandat = 0%
// - 2 mandats = 4%
// - 3 mandats = 6%
// - 10 mandats = 20% MAX

// Appliquer le rabais à un prix
applyFamilyDiscount(basePrice: number, discountPercent: number): number
```

### 5. Airtable - Fonctions d'accès

**Fichier** : `server/airtable.ts`

**Nouvelles fonctions** :

```typescript
// Récupérer un client par son ID
getClientById(recordId: string): Promise<Record<string, any> | null>

// Mettre à jour un client existant
updateClientInAirtable(recordId: string, fields: Record<string, any>): Promise<AirtableClientRecord>
```

## Format des codes de parrainage

**Pattern** : `^[A-Z]{4}-[A-Z0-9]{4}$`

**Exemples valides** :
- `OLIV-SELS`
- `NEUK-ABC1`
- `DUPO-1234`
- `MART-XYZ9`

**Génération** :
1. Prendre les 4 premières lettres du nom (en majuscules, sans accents)
2. Si le nom a moins de 4 lettres, compléter avec des `X`
3. Ajouter un tiret `-`
4. Ajouter 4 caractères aléatoires (lettres majuscules + chiffres)

**Exemples** :
- `NEUKOMM` → `NEUK-A1B2`
- `LEE` → `LEEX-C3D4`
- `MÜLLER` → `MULL-E5F6`

## Calcul des rabais familiaux

**Formule** : `(mandats - 1) × 2% + 2%`

**Tableau des rabais** :

| Nombre de mandats | Rabais | Prix base (CHF 185.-) | Prix final |
|-------------------|--------|----------------------|------------|
| 1                 | 0%     | 185.-                | 185.-      |
| 2                 | 4%     | 185.-                | 177.60     |
| 3                 | 6%     | 185.-                | 173.90     |
| 4                 | 8%     | 185.-                | 170.20     |
| 5                 | 10%    | 185.-                | 166.50     |
| 6                 | 12%    | 185.-                | 162.80     |
| 7                 | 14%    | 185.-                | 159.10     |
| 8                 | 16%    | 185.-                | 155.40     |
| 9                 | 18%    | 185.-                | 151.70     |
| 10+               | 20%    | 185.-                | 148.- MAX  |

## Workflow complet

### Étape 1 : Inscription avec code de parrainage

1. Le nouveau client remplit le formulaire d'inscription
2. Il saisit le code de parrainage d'un membre existant (ex: `OLIV-SELS`)
3. Le système valide le code en temps réel
4. Si valide, affichage : "Code valide ! Vous rejoignez Olivier Neukomm"

### Étape 2 : Création du client dans Airtable

1. Le backend vérifie si le parrain a un groupe familial
2. **Si OUI** : Le nouveau client rejoint le groupe existant
3. **Si NON** : 
   - Création d'un nouveau groupe `FAMILLE-NEUK-ABC1`
   - Le parrain devient "Membre fondateur"
   - Le nouveau client rejoint le groupe

### Étape 3 : Automation Airtable (déjà implémentée)

**Fichier** : `docs/AIRTABLE-AUTOMATION-SCRIPT-FINAL.js`

**Déclencheur** : Modification du champ "Groupe Familial"

**Actions** :
1. Compter les membres actifs du groupe
2. Créer les liens bidirectionnels dans "Membres de la famille"
3. Mettre à jour "Nb membres famille actifs"
4. Calculer le rabais familial (2% par membre, max 20%)

### Étape 4 : Facturation avec rabais

Lors de la création d'une facture Stripe :
1. Récupérer le nombre de membres actifs du groupe
2. Calculer le rabais avec `calculateFamilyDiscount()`
3. Appliquer le rabais avec `applyFamilyDiscount()`
4. Créer la facture Stripe avec le prix final

## Tests

**Fichier** : `server/routers/__tests__/family-referral.test.ts`

**Tests implémentés** :
- ✅ Génération de codes au format NOM-XXXX
- ✅ Gestion des noms courts (< 4 lettres)
- ✅ Suppression des accents
- ✅ Codes uniques pour le même nom
- ✅ Rejet des codes vides
- ✅ Rejet des formats invalides
- ✅ Validation du format XXXX-XXXX
- ✅ Logique de création de nouveau groupe
- ✅ Logique de rejoindre un groupe existant

**Commande** : `pnpm test family-referral.test.ts`

## Configuration Airtable requise

### Champs nécessaires

1. **Code Parrainage** (Formula) :
   - Format : `XXXX-XXXX`
   - Généré automatiquement pour chaque client

2. **Groupe Familial** (Single line text) :
   - Format : `FAMILLE-NEUK-ABC1`
   - Assigné automatiquement lors de l'inscription avec parrainage

3. **Relations familiales** (Single select) :
   - Options : `Membre fondateur`, `Conjoint(e)`, `Enfant`, `Parent`, `Frère/Sœur`, `Ami(e)`, etc.
   - Défini manuellement ou lors de l'inscription

4. **Membres de la famille** (Linked records) :
   - Type : Multiple record links (bidirectionnel)
   - Créé automatiquement par l'automation Airtable

5. **Nb membres famille actifs** (Number) :
   - Calculé automatiquement par l'automation Airtable
   - Compte uniquement les membres avec statut "Actif"

6. **Rabais familial %** (Number) :
   - Calculé automatiquement par l'automation Airtable
   - Formule : `(Nb membres - 1) × 2 + 2`, max 20%

### Automation Airtable

**Nom** : Gestion Groupes Familiaux

**Déclencheur** : When record updated → Champ "Groupe Familial"

**Script** : Voir `docs/AIRTABLE-AUTOMATION-SCRIPT-FINAL.js`

**Variables d'entrée** :
- `clientId` : Record ID
- `groupeFamilial` : Valeur du champ "Groupe Familial"

## Prochaines étapes

1. ✅ Champ code parrainage ajouté au formulaire
2. ✅ Validation temps réel implémentée
3. ✅ Backend modifié pour gérer les groupes familiaux
4. ✅ Tests unitaires créés et validés
5. ⏳ Tester le workflow complet en conditions réelles
6. ⏳ Vérifier que l'automation Airtable se déclenche correctement
7. ⏳ Valider le calcul des rabais sur les factures Stripe

## Support et maintenance

**Contact** : Olivier Neukomm - contact@winwin.swiss

**Documentation technique** :
- `docs/AIRTABLE-AUTOMATION-SCRIPT-FINAL.js`
- `docs/GUIDE-CONFIGURATION-AUTOMATION-AIRTABLE.md`
- `docs/FORMULES-AIRTABLE-RABAIS-FAMILIAL.md`
- `docs/LOGIQUE-RELATIONS-FAMILIALES.md`
