const BASE_ID = 'appZQkRJ7PwOtdQ3O';
const TABLE_ID = 'tblWPcIpGmBZ3ASGI';
const API_KEY = 'patgASYypqfgNBYTd.fa299ffa5628538062dcef528be4322e93868dff93f1ba7686905b0daf656f9a';

const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`;

const columns = [
  {
    name: 'Code Parrainage',
    type: 'singleLineText',
    description: 'Code unique du client pour parrainer sa famille (ex: JEAN-A3X9)'
  },
  {
    name: 'Lien de Parenté',
    type: 'singleSelect',
    options: {
      choices: [
        { name: 'Fondateur' },
        { name: 'Conjoint(e)' },
        { name: 'Père' },
        { name: 'Mère' },
        { name: 'Fils' },
        { name: 'Fille' },
        { name: 'Frère' },
        { name: 'Sœur' },
        { name: 'Grand-père' },
        { name: 'Grand-mère' },
        { name: 'Beau-père' },
        { name: 'Belle-mère' },
        { name: 'Beau-frère' },
        { name: 'Belle-sœur' },
        { name: 'Entreprise liée' },
        { name: 'Autre' }
      ]
    },
    description: 'Lien de parenté avec la personne qui a parrainé'
  },
  {
    name: 'Stripe Subscription ID',
    type: 'singleLineText',
    description: 'ID de l\'abonnement Stripe pour gestion des paiements'
  }
];

async function createColumn(column) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(column),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Erreur "${column.name}":`, error);
      return false;
    }

    const data = await response.json();
    console.log(`✅ "${column.name}" créée (ID: ${data.id})`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur "${column.name}":`, error.message);
    return false;
  }
}

console.log('🚀 Création des colonnes...\n');

for (const column of columns) {
  await createColumn(column);
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log('\n✅ Terminé !');
