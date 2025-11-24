/**
 * Script de migration pour mettre à jour les groupes familiaux dans Airtable
 * 
 * Ancien format : FAMILLE-BUSSAT-2024
 * Nouveau format : FAMILLE-BUSSAT-ANTO-QC2V
 * 
 * Ce script :
 * 1. Récupère tous les clients avec un Code Parrainage
 * 2. Génère le nouveau format de groupe pour chaque famille
 * 3. Met à jour le champ "Groupe Familial" dans Airtable
 * 
 * Usage : pnpm tsx scripts/migrate-family-groups.ts
 */

import { execSync } from 'child_process';
import { AIRTABLE_CONFIG } from '../server/airtable-config';

interface AirtableClient {
  id: string;
  fields: {
    'NOM du client': string;
    'Code Parrainage': string;
    'Groupe Familial'?: string;
    'Relations familiales'?: string;
  };
}

/**
 * Récupérer tous les clients depuis Airtable
 */
async function getAllClients(): Promise<AirtableClient[]> {
  console.log('[Migration] Récupération de tous les clients...');
  
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
  });
  
  try {
    const stdout = execSync(
      `manus-mcp-cli tool call list_records --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );
    
    const response = JSON.parse(stdout);
    
    if (response.records) {
      console.log(`[Migration] ${response.records.length} clients trouvés`);
      return response.records;
    }
    
    return [];
  } catch (error) {
    console.error('[Migration] Erreur lors de la récupération des clients:', error);
    return [];
  }
}

/**
 * Générer le nouveau format de groupe familial
 */
function generateNewGroupFormat(nom: string, codeParrainage: string): string {
  const cleanNom = nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase();
  
  return `FAMILLE-${cleanNom}-${codeParrainage}`;
}

/**
 * Mettre à jour un client dans Airtable
 */
async function updateClient(recordId: string, newGroupeFamilial: string): Promise<boolean> {
  const { baseId, tables } = AIRTABLE_CONFIG;
  const { clients } = tables;
  
  const mcpInput = JSON.stringify({
    baseId,
    tableId: clients.id,
    recordId,
    fields: {
      'Groupe Familial': newGroupeFamilial,
    },
  });
  
  try {
    execSync(
      `manus-mcp-cli tool call update_record --server airtable --input '${mcpInput.replace(/'/g, "\\'")}'`,
      { encoding: 'utf-8' }
    );
    
    return true;
  } catch (error) {
    console.error(`[Migration] Erreur mise à jour client ${recordId}:`, error);
    return false;
  }
}

/**
 * Script principal de migration
 */
async function main() {
  console.log('========================================');
  console.log('Migration Groupes Familiaux Airtable');
  console.log('========================================\n');
  
  // 1. Récupérer tous les clients
  const clients = await getAllClients();
  
  if (clients.length === 0) {
    console.log('[Migration] Aucun client trouvé. Arrêt.');
    return;
  }
  
  // 2. Identifier les membres fondateurs (ceux avec un Code Parrainage)
  const fondateurs = clients.filter(c => c.fields['Code Parrainage']);
  console.log(`\n[Migration] ${fondateurs.length} membres fondateurs identifiés\n`);
  
  // 3. Pour chaque fondateur, générer le nouveau format
  const updates: { recordId: string; oldGroup: string; newGroup: string; nom: string }[] = [];
  
  for (const fondateur of fondateurs) {
    const nom = fondateur.fields['NOM du client'];
    const codeParrainage = fondateur.fields['Code Parrainage'];
    const oldGroup = fondateur.fields['Groupe Familial'] || '';
    
    const newGroup = generateNewGroupFormat(nom, codeParrainage);
    
    if (oldGroup !== newGroup) {
      updates.push({
        recordId: fondateur.id,
        oldGroup,
        newGroup,
        nom,
      });
    }
  }
  
  console.log(`[Migration] ${updates.length} groupes à mettre à jour\n`);
  
  if (updates.length === 0) {
    console.log('[Migration] Tous les groupes sont déjà au bon format. Rien à faire.');
    return;
  }
  
  // 4. Afficher les changements prévus
  console.log('Changements prévus :');
  console.log('====================\n');
  
  for (const update of updates) {
    console.log(`${update.nom}`);
    console.log(`  Ancien : ${update.oldGroup || '(vide)'}`);
    console.log(`  Nouveau : ${update.newGroup}`);
    console.log('');
  }
  
  // 5. Demander confirmation
  console.log('\n⚠️  ATTENTION : Cette opération va modifier Airtable !');
  console.log('Appuyez sur Ctrl+C pour annuler, ou attendez 5 secondes pour continuer...\n');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // 6. Appliquer les mises à jour
  console.log('[Migration] Début des mises à jour...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const update of updates) {
    console.log(`[Migration] Mise à jour ${update.nom}...`);
    
    const success = await updateClient(update.recordId, update.newGroup);
    
    if (success) {
      successCount++;
      console.log(`  ✅ Succès`);
    } else {
      errorCount++;
      console.log(`  ❌ Échec`);
    }
    
    // Pause entre chaque mise à jour pour éviter rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 7. Résumé
  console.log('\n========================================');
  console.log('Résumé de la migration');
  console.log('========================================');
  console.log(`✅ Succès : ${successCount}`);
  console.log(`❌ Échecs : ${errorCount}`);
  console.log(`📊 Total : ${updates.length}`);
  console.log('========================================\n');
  
  if (errorCount > 0) {
    console.log('⚠️  Certaines mises à jour ont échoué. Vérifiez les logs ci-dessus.');
  } else {
    console.log('🎉 Migration terminée avec succès !');
  }
}

// Exécuter le script
main().catch(error => {
  console.error('[Migration] Erreur fatale:', error);
  process.exit(1);
});
