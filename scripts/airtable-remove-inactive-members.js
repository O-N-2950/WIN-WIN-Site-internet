/**
 * Script d'Automatisation Airtable : Retirer les Membres Inactifs des Familles
 * 
 * OBJECTIF :
 * Quand un client devient "Inactif", ce script :
 * 1. Retire ce client de tous les champs "Membres de la famille" des autres membres
 * 2. Vide le champ "Membres de la famille" du client inactif
 * 3. Met à jour automatiquement le comptage des membres
 * 
 * DÉCLENCHEUR :
 * - Quand le champ "Statut du client" passe à "Inactif"
 * 
 * INSTALLATION :
 * 1. Aller dans Airtable → Automatisations
 * 2. Créer une nouvelle automatisation
 * 3. Déclencheur : "Quand un enregistrement correspond à des conditions"
 *    - Table : Clients
 *    - Condition : Statut du client = "Inactif"
 * 4. Action : "Exécuter un script"
 * 5. Copier-coller ce script
 * 6. Configurer les variables d'entrée :
 *    - recordId : {Record ID} (du déclencheur)
 */

// Configuration
const TABLE_NAME = "Clients";
const FIELD_MEMBRES_FAMILLE = "Membres de la famille";

// Récupérer l'ID du client qui devient inactif
const inactiveClientId = input.config().recordId;

// Récupérer la table Clients
const table = base.getTable(TABLE_NAME);

// Récupérer tous les enregistrements de la table
const query = await table.selectRecordsAsync({
  fields: [FIELD_MEMBRES_FAMILLE, "Statut du client", "NOM du client"]
});

// Liste des mises à jour à effectuer
const updates = [];

// Parcourir tous les clients
for (let record of query.records) {
  const membresIds = record.getCellValue(FIELD_MEMBRES_FAMILLE) || [];
  
  // Vérifier si ce client a le client inactif dans ses membres
  const hasMemberToRemove = membresIds.some(m => m.id === inactiveClientId);
  
  if (hasMemberToRemove) {
    // Retirer le client inactif de la liste des membres
    const newMembresIds = membresIds
      .filter(m => m.id !== inactiveClientId)
      .map(m => ({ id: m.id }));
    
    updates.push({
      id: record.id,
      fields: {
        [FIELD_MEMBRES_FAMILLE]: newMembresIds
      }
    });
    
    console.log(`Retrait de ${inactiveClientId} de ${record.getCellValue("NOM du client")}`);
  }
}

// Vider le champ "Membres de la famille" du client inactif
updates.push({
  id: inactiveClientId,
  fields: {
    [FIELD_MEMBRES_FAMILLE]: []
  }
});

// Effectuer les mises à jour par lots de 50 (limite Airtable)
while (updates.length > 0) {
  const batch = updates.splice(0, 50);
  await table.updateRecordsAsync(batch);
  console.log(`Mis à jour ${batch.length} enregistrements`);
}

console.log("✅ Automatisation terminée !");
console.log(`Total de ${updates.length} enregistrements mis à jour`);
