/**
 * Script de migration : Copier "Code Groupe Familial" vers "Groupe Familial"
 * 
 * Ce script copie la valeur de "Code Groupe Familial" (formule) vers "Groupe Familial" (texte)
 * UNIQUEMENT pour les clients qui sont "Membre fondateur".
 * 
 * Usage :
 *   pnpm tsx scripts/migrate-groupe-familial.ts
 */

const AIRTABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tableId: 'tblWPcIpGmBZ3ASGI', // Table "Clients"
  apiKey: process.env.AIRTABLE_API_KEY || '',
};

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

/**
 * Récupérer tous les clients de la table Airtable
 */
async function getAllClients(): Promise<AirtableRecord[]> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur Airtable: ${await response.text()}`);
  }

  const result = await response.json();
  return result.records;
}

/**
 * Mettre à jour le champ "Groupe Familial" d'un client
 */
async function updateGroupeFamilial(recordId: string, groupeFamilial: string): Promise<void> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}/${recordId}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fields: {
        'Groupe Familial': groupeFamilial,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Erreur mise à jour ${recordId}: ${await response.text()}`);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('=== MIGRATION GROUPE FAMILIAL ===\n');
  console.log('Copie de "Code Groupe Familial" → "Groupe Familial" pour les membres fondateurs\n');
  console.log('Récupération de tous les clients...');

  const clients = await getAllClients();
  console.log(`✅ ${clients.length} clients trouvés\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const client of clients) {
    const recordId = client.id;
    const fields = client.fields;
    const nomClient = fields['NOM du client'] || recordId;

    // Vérifier si le champ "Groupe Familial" est déjà rempli
    const groupeFamilialActuel = fields['Groupe Familial'];
    if (groupeFamilialActuel) {
      console.log(`⏭️  ${nomClient} : Groupe Familial déjà rempli (${groupeFamilialActuel})`);
      skipped++;
      continue;
    }

    // Vérifier si c'est un "Membre fondateur"
    const relationsFamiliales = fields['Relations familiales'];
    const estMembreFondateur = relationsFamiliales && relationsFamiliales.includes('Membre fondateur');

    if (!estMembreFondateur) {
      // Pas un membre fondateur, on skip
      skipped++;
      continue;
    }

    // Récupérer la valeur depuis "Code Groupe Familial" (formule)
    const codeGroupeFamilial = fields['Code Groupe Familial'];

    if (!codeGroupeFamilial) {
      console.log(`⚠️  ${nomClient} : Membre fondateur mais aucun Code Groupe Familial (skip)`);
      skipped++;
      continue;
    }

    try {
      await updateGroupeFamilial(recordId, codeGroupeFamilial);
      console.log(`✅ ${nomClient} : Groupe Familial copié (${codeGroupeFamilial})`);
      updated++;

      // Pause de 200ms entre chaque requête pour éviter le rate limiting Airtable (5 req/s)
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ ${nomClient} : Erreur mise à jour`, error);
      errors++;
    }
  }

  console.log('\n=== RÉSUMÉ ===');
  console.log(`✅ Membres fondateurs mis à jour : ${updated}`);
  console.log(`⏭️  Ignorés : ${skipped}`);
  console.log(`❌ Erreurs : ${errors}`);
  console.log(`📊 Total : ${clients.length}`);
  
  if (updated > 0) {
    console.log('\n🎉 Migration terminée avec succès !');
    console.log('👉 Maintenant, copiez manuellement le "Groupe Familial" du fondateur vers les autres membres de la famille.');
  } else {
    console.log('\n⚠️  Aucun membre fondateur n\'a été mis à jour.');
    console.log('💡 Vérifiez qu\'au moins un client a "Relations familiales" = "Membre fondateur".');
  }
}

// Exécuter le script
main().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
