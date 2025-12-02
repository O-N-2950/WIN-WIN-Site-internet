/**
 * SCRIPT D'AUTOMATION AIRTABLE - RABAIS FAMILIAL WIN WIN FINANCE
 * 
 * OBJECTIF:
 * - Compter automatiquement le nombre de membres actifs dans un groupe familial
 * - Créer des liens bidirectionnels entre les membres de la famille
 * - Mettre à jour le champ "Nb membres famille actifs"
 * 
 * CONFIGURATION AIRTABLE:
 * 
 * 1. DÉCLENCHEUR (TRIGGER):
 *    - Type: "Lorsqu'une entrée est mise à jour"
 *    - Table: "Clients"
 *    - Champ surveillé: "Groupe Familial" (fld7adFgijiW0Eqhj)
 *    - Condition: "Groupe Familial n'est pas vide"
 * 
 * 2. ACTION:
 *    - Type: "Exécuter un script"
 *    - Variables d'entrée:
 *      * clientId = Record ID (depuis le déclencheur)
 *      * groupeFamilial = Groupe Familial (depuis le déclencheur)
 * 
 * 3. CHAMPS AIRTABLE UTILISÉS:
 *    - Groupe Familial (fld7adFgijiW0Eqhj) - Text
 *    - Statut du client (fldw9QKnjkINjZ7kQ) - Single Select
 *    - Nb membres famille actifs (fldOkhbJGNwsiEfCo) - Number
 *    - From field: Membres de la famille (fldzVtOES0l6kZhjv) - Multiple Record Links
 */

// ============================================================================
// CONFIGURATION DES CHAMPS
// ============================================================================

const FIELD_IDS = {
  GROUPE_FAMILIAL: 'fld7adFgijiW0Eqhj',  // ✅ Groupe Familial (texte simple)
  STATUT_CLIENT: 'fldw9QKnjkINjZ7kQ',
  NB_MEMBRES_ACTIFS: 'fldOkhbJGNwsiEfCo',
  LIENS_FAMILLE: 'fldCyRJx4POhP1KjX'  // ✅ Membres de la famille (multipleRecordLinks)
};

const STATUTS_ACTIFS = ['NOUVEAU CLIENT', 'Actif'];

// ============================================================================
// RÉCUPÉRATION DES VARIABLES D'ENTRÉE
// ============================================================================

let inputConfig = input.config();
let clientId = inputConfig.clientId;
let groupeFamilial = inputConfig.groupeFamilial;

console.log('=== DÉBUT AUTOMATION RABAIS FAMILIAL ===');
console.log('Client ID:', clientId);
console.log('Groupe Familial:', groupeFamilial);

// ============================================================================
// VALIDATION DES ENTRÉES
// ============================================================================

if (!clientId || !groupeFamilial) {
  console.error('❌ ERREUR: clientId ou groupeFamilial manquant');
  throw new Error('Variables d\'entrée manquantes');
}

// ============================================================================
// RÉCUPÉRATION DE LA TABLE CLIENTS
// ============================================================================

let table = base.getTable('Clients');

// ============================================================================
// RECHERCHE DE TOUS LES MEMBRES DU GROUPE FAMILIAL
// ============================================================================

console.log('🔍 Recherche des membres du groupe familial:', groupeFamilial);

let query = await table.selectRecordsAsync({
  fields: [
    FIELD_IDS.GROUPE_FAMILIAL,
    FIELD_IDS.STATUT_CLIENT,
    FIELD_IDS.NB_MEMBRES_ACTIFS,
    FIELD_IDS.LIENS_FAMILLE
  ]
});

// Filtrer les membres du même groupe familial avec statut actif
let membresActifs = query.records.filter(record => {
  let code = record.getCellValue(FIELD_IDS.GROUPE_FAMILIAL);
  let statut = record.getCellValueAsString(FIELD_IDS.STATUT_CLIENT);
  
  return code === groupeFamilial && STATUTS_ACTIFS.includes(statut);
});

let nbMembresActifs = membresActifs.length;

console.log('✅ Nombre de membres actifs trouvés:', nbMembresActifs);
console.log('📋 Liste des membres:');
membresActifs.forEach(membre => {
  console.log('  - Record ID:', membre.id, '| Statut:', membre.getCellValueAsString(FIELD_IDS.STATUT_CLIENT));
});

// ============================================================================
// CRÉATION DES LIENS BIDIRECTIONNELS
// ============================================================================

console.log('🔗 Création des liens bidirectionnels entre membres...');

// Pour chaque membre, créer des liens vers tous les autres membres
for (let membre of membresActifs) {
  // Récupérer les IDs de tous les autres  // Créer les liens bidirectionnels (format: tableau d'objets {id: ...})
  let autresMembres = membresActifs
    .filter(m => m.id !== membre.id)
    .map(m => ({id: m.id}));  // ✅ Format correct pour Linked record  
  // DEBUG: Afficher la valeur avant l'envoi
  console.log('  🐛 DEBUG - Membre:', membre.id);
  console.log('  🐛 DEBUG - autresMembres:', JSON.stringify(autresMembres));
  console.log('  🐛 DEBUG - Field ID:', FIELD_IDS.LIENS_FAMILLE);
  
  // Mettre à jour les liens et le nombre de membres
  await table.updateRecordAsync(membre.id, {
    [FIELD_IDS.LIENS_FAMILLE]: autresMembres,
    [FIELD_IDS.NB_MEMBRES_ACTIFS]: nbMembresActifs
  });
  
  console.log('  ✓ Membre', membre.id, '→ lié à', autresMembres.length, 'autres membres');
}

// ============================================================================
// CALCUL DU RABAIS (POUR INFORMATION)
// ============================================================================

let rabaisPourcent = 0;
if (nbMembresActifs >= 2) {
  rabaisPourcent = Math.min((nbMembresActifs - 1) * 2 + 2, 20);
}

console.log('💰 Rabais familial calculé:', rabaisPourcent + '%');
console.log('📊 Détail:');
console.log('  - Nombre de membres actifs:', nbMembresActifs);
console.log('  - Formule: (', nbMembresActifs, '- 1) × 2 + 2 =', rabaisPourcent, '%');
console.log('  - Maximum: 20%');

// ============================================================================
// RÉSUMÉ FINAL
// ============================================================================

console.log('=== AUTOMATION TERMINÉE AVEC SUCCÈS ===');
console.log('✅ Nombre de membres mis à jour:', nbMembresActifs);
console.log('✅ Liens créés pour', membresActifs.length, 'membres');
console.log('✅ Rabais familial:', rabaisPourcent + '%');
