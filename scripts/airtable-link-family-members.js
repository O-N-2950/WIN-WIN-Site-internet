/**
 * Script d'Automatisation Airtable : Liaison Automatique des Membres de Famille
 * 
 * Ce script lie automatiquement tous les membres d'une même famille dans le champ
 * "Membres de la famille" en se basant sur le "Code Famille (hérité)".
 * 
 * UTILISATION :
 * 1. Copier ce script dans Airtable Automations → Script
 * 2. Configurer le déclencheur : "Quand un enregistrement est créé ou modifié"
 * 3. Condition : "Code Famille (hérité)" n'est pas vide
 * 
 * AUTEUR : Manus AI
 * DATE : 24 novembre 2025
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const TABLE_NAME = 'Clients';

const FIELD_NAMES = {
  CODE_FAMILLE_HERITE: 'Code Famille (hérité)',
  MEMBRES_FAMILLE: 'Membres de la famille',
  NOM_CLIENT: 'NOM du client',
  RELATIONS_FAMILIALES: 'Relations familiales'
};

// ============================================================================
// FONCTION PRINCIPALE
// ============================================================================

/**
 * Lie automatiquement tous les membres d'une même famille
 */
async function linkFamilyMembers() {
  console.log('🚀 Démarrage du script de liaison des membres de famille...');
  
  // Récupérer la table Clients
  const table = base.getTable(TABLE_NAME);
  
  // Récupérer tous les enregistrements
  console.log('📋 Récupération de tous les clients...');
  const query = await table.selectRecordsAsync({
    fields: [
      FIELD_NAMES.CODE_FAMILLE_HERITE,
      FIELD_NAMES.MEMBRES_FAMILLE,
      FIELD_NAMES.NOM_CLIENT,
      FIELD_NAMES.RELATIONS_FAMILIALES
    ]
  });
  
  // Grouper les clients par code famille
  console.log('🔍 Groupement des clients par famille...');
  const familyGroups = {};
  
  for (const record of query.records) {
    const codesFamille = record.getCellValue(FIELD_NAMES.CODE_FAMILLE_HERITE);
    
    // Vérifier si le code famille existe
    if (!codesFamille || codesFamille.length === 0) {
      continue;
    }
    
    // Prendre le premier code famille (normalement il n'y en a qu'un)
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
  
  // Lier les membres de chaque famille
  let totalUpdates = 0;
  
  for (const [codeFamille, members] of Object.entries(familyGroups)) {
    console.log(`\n👨‍👩‍👧‍👦 Famille ${codeFamille} : ${members.length} membres`);
    
    // Si la famille n'a qu'un seul membre, passer
    if (members.length === 1) {
      console.log('  ⏭️  Un seul membre, aucune liaison nécessaire');
      continue;
    }
    
    // Pour chaque membre, lier tous les autres membres
    const updates = [];
    
    for (const member of members) {
      // Créer la liste des autres membres (tous sauf lui-même)
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
    
    // Mettre à jour tous les membres de cette famille
    if (updates.length > 0) {
      // Airtable limite les mises à jour à 50 enregistrements par appel
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

// ============================================================================
// EXÉCUTION
// ============================================================================

await linkFamilyMembers();
