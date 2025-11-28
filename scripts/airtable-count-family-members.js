/**
 * AUTOMATISATION AIRTABLE : Comptage Automatique des Membres de Famille
 * 
 * DÉCLENCHEUR : Quand un enregistrement est créé ou modifié
 * CONDITIONS : 
 *   - Champ "Code Famille (hérité)" n'est pas vide
 *   - OU Champ "Membre principal du groupe" est modifié
 *   - OU Champ "Statut du client" est modifié
 * 
 * ACTION : Compter tous les membres ACTIFS avec le même "Code Famille (hérité)"
 *          et mettre à jour "Nb membres famille (total)" pour TOUS les membres
 * 
 * INSTALLATION :
 * 1. Airtable → Automatisations → Créer une automatisation
 * 2. Nom : "Compter membres famille automatiquement"
 * 3. Déclencheur : Quand un enregistrement correspond à des conditions
 *    - Table : Clients
 *    - Condition : "Code Famille (hérité)" n'est pas vide
 * 4. Action : Exécuter un script
 *    - Copier ce script
 *    - Variable d'entrée : recordId → Record ID (du déclencheur)
 */

// Configuration des IDs de champs
const FIELD_IDS = {
  CODE_FAMILLE: 'fldkRqZTzZzOKNgBB',           // Code Famille (hérité)
  STATUT_CLIENT: 'fldw9QKnjkINjZ7kQ',          // Statut du client
  NB_MEMBRES_TOTAL: 'fldZLwNWsGhQYhRXu',       // Nb membres famille (total)
  NOM_CLIENT: 'fldoJ7b8Q7PaM27Vd'              // NOM du client
};

// Récupérer l'enregistrement qui a déclenché l'automatisation
let inputConfig = input.config();
let recordId = inputConfig.recordId;

// Récupérer la table Clients
let table = base.getTable('Clients');
let record = await table.selectRecordAsync(recordId);

if (!record) {
  console.log('❌ Enregistrement introuvable');
  return;
}

// Récupérer le code famille
let codeFamille = record.getCellValue(FIELD_IDS.CODE_FAMILLE);

if (!codeFamille) {
  console.log('⚠️ Pas de code famille pour cet enregistrement');
  return;
}

console.log(`🔍 Comptage pour la famille : ${codeFamille}`);

// Récupérer TOUS les enregistrements de la table
let query = await table.selectRecordsAsync({
  fields: [
    FIELD_IDS.CODE_FAMILLE,
    FIELD_IDS.STATUT_CLIENT,
    FIELD_IDS.NOM_CLIENT
  ]
});

// Filtrer les membres de la même famille qui sont ACTIFS
let membresFamille = query.records.filter(r => {
  let code = r.getCellValue(FIELD_IDS.CODE_FAMILLE);
  let statut = r.getCellValueAsString(FIELD_IDS.STATUT_CLIENT);
  
  // Même famille ET statut actif
  return code === codeFamille && statut === 'Actif';
});

let nbMembresActifs = membresFamille.length;

console.log(`✅ Nombre de membres actifs trouvés : ${nbMembresActifs}`);
console.log(`📋 Membres :`);
membresFamille.forEach(m => {
  console.log(`   - ${m.getCellValueAsString(FIELD_IDS.NOM_CLIENT)}`);
});

// Mettre à jour le champ "Nb membres famille (total)" pour TOUS les membres de la famille
let updates = membresFamille.map(membre => ({
  id: membre.id,
  fields: {
    [FIELD_IDS.NB_MEMBRES_TOTAL]: nbMembresActifs
  }
}));

// Airtable limite à 50 mises à jour par batch
while (updates.length > 0) {
  let batch = updates.splice(0, 50);
  await table.updateRecordsAsync(batch);
  console.log(`✅ ${batch.length} enregistrements mis à jour`);
}

console.log(`🎉 Comptage terminé ! ${nbMembresActifs} membres actifs dans la famille ${codeFamille}`);
