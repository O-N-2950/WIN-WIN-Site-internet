# ANALYSE STRUCTURE AIRTABLE - SYSTÈME DE RABAIS FAMILIAL

## 🎯 CHAMPS CRITIQUES IDENTIFIÉS

### 1. **Groupe Familial** (fld7adFgijiW0Eqhj)
- **Type**: `singleLineText` (TEXTE SIMPLE, pas linked record !)
- **Description**: "Identifiant unique pour regrouper les membres d'une même famille"
- **Exemple**: "FAMILLE-ABC123"
- ✅ **CORRECTION**: Le backend envoie déjà correctement ce champ

### 2. **Membres de la famille** (fldCyRJx4POhP1KjX)
- **Type**: `multipleRecordLinks` (LIEN VERS AUTRES CLIENTS)
- **Options**: `linkedTableId: "tblWPcIpGmBZ3ASGI"` (table Clients)
- **inverseLinkFieldId**: `fld1OXMTGuwqZroZc`
- ❌ **PROBLÈME**: Le backend N'ENVOIE PAS ce champ !
- 🔥 **CRITIQUE**: C'est CE CHAMP qui crée les liens bidirectionnels entre les membres de la famille

### 3. **Parrainé par** (fldwwD2OCerxa7dtz)
- **Type**: `multipleRecordLinks` (LIEN VERS LE PARRAIN)
- **Options**: `linkedTableId: "tblWPcIpGmBZ3ASGI"`, `prefersSingleRecordLink: true`
- **Description**: "Client qui a parrainé ce nouveau client"
- ❌ **PROBLÈME**: Le backend N'ENVOIE PAS ce champ !
- 🔥 **CRITIQUE**: C'est CE CHAMP qui identifie qui a parrainé qui

### 4. **Nb membres famille actifs** (fldOkhbJGNwsiEfCo)
- **Type**: `count` (FORMULE AUTOMATIQUE)
- **Source**: Compte automatiquement le nombre de liens dans "Membres de la famille"
- ✅ **AUTOMATIQUE**: Calculé par Airtable dès que les liens sont créés

### 5. **Rabais Groupe Familial (%)** (fldNHPto00tiybfnb)
- **Type**: `formula` (FORMULE AUTOMATIQUE)
- **Formule**: `(Nb membres - 1) × 2 + 2`, plafonné à 20%
- ✅ **AUTOMATIQUE**: Calculé par Airtable dès que Nb membres est mis à jour

### 6. **Prix final avec rabais** (CHAMP À IDENTIFIER)
- **Type**: `formula` (FORMULE AUTOMATIQUE)
- **Formule**: `Tarif applicable × (1 - Rabais / 100)`
- ✅ **AUTOMATIQUE**: Calculé par Airtable

## 🔥 PROBLÈME IDENTIFIÉ

Le backend envoie uniquement :
```typescript
"Groupe Familial": "FAMILLE-ABC123"
```

Mais il MANQUE :
```typescript
"Membres de la famille": [recordIdDuParrain],  // ← MANQUANT !
"Parrainé par": [recordIdDuParrain]            // ← MANQUANT !
```

## ✅ SOLUTION

1. **Récupérer l'ID du parrain** (record ID, pas le code de parrainage)
2. **Envoyer les champs de liaison** :
   - `fldCyRJx4POhP1KjX` (Membres de la famille) = `[recordIdDuParrain]`
   - `fldwwD2OCerxa7dtz` (Parrainé par) = `[recordIdDuParrain]`

3. **Airtable calculera automatiquement** :
   - Nb membres famille actifs (compte les liens)
   - Rabais Groupe Familial (%) (formule)
   - Prix final avec rabais (formule)

## 📝 CODE À MODIFIER

**Fichier**: `server/routers.ts`

**Ligne 89-92** : Récupérer l'ID du parrain (PAS SEULEMENT le groupe familial)
```typescript
if (data.records && data.records.length > 0) {
  const parrainRecord = data.records[0];
  const parrainId = parrainRecord.id;  // ← AJOUTER CETTE LIGNE
  groupeFamilial = parrainRecord.fields["fld7adFgijiW0Eqhj"] || "";
  console.log("✅ Parrain trouvé ! ID:", parrainId, "Groupe familial:", groupeFamilial);
}
```

**Ligne 135-142** : Ajouter les champs de liaison
```typescript
const airtableFields: Record<string, any> = {
  "Contact E-mail": input.email,
  "Email du client (table client)": input.email,
  "Tél. Mobile": input.telMobile,
  "Groupe Familial": groupeFamilial,
  "Statut du client": "NOUVEAU CLIENT",
  "Type de client": input.typeClient === "entreprise" ? "Entreprise" : "Particulier",
};

// ✅ AJOUTER SI PARRAIN TROUVÉ
if (parrainId) {
  airtableFields["fldCyRJx4POhP1KjX"] = [parrainId];  // Membres de la famille
  airtableFields["fldwwD2OCerxa7dtz"] = [parrainId];  // Parrainé par
}
```

## 🎯 RÉSULTAT ATTENDU

1. Client A crée son compte → Groupe familial `FAMILLE-ABC123`
2. Client B utilise le code de parrainage de A → Backend :
   - Récupère l'ID de A (ex: `recXYZ123`)
   - Assigne le même groupe familial `FAMILLE-ABC123`
   - Crée les liens :
     * `Membres de la famille` = `[recXYZ123]`
     * `Parrainé par` = `[recXYZ123]`
3. Airtable calcule automatiquement :
   - Nb membres famille actifs = 2
   - Rabais Groupe Familial (%) = 4%
   - Prix final avec rabais = 177.60 CHF (au lieu de 185 CHF)
