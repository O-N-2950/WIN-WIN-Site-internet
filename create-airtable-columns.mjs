const BASE_ID = 'appZQkRJ7PwOtdQ3O';
const TABLE_ID = 'tblWPcIpGmBZ3ASGI';
const API_KEY = 'patBP3F1Ta2m8FsKz.d66be1dd6f02fa14e0737d5910fdd37ba6277dd21927247be3e5d57d86514165';

const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables/${TABLE_ID}/fields`;

// Colonnes à créer
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
      console.error(`❌ Erreur création "${column.name}":`, error);
      return false;
    }

    const data = await response.json();
    console.log(`✅ Colonne "${column.name}" créée avec succès (ID: ${data.id})`);
    return true;
  } catch (error) {
    console.error(`❌ Erreur création "${column.name}":`, error.message);
    return false;
  }
}

console.log('🚀 Création des colonnes dans Airtable...\n');

for (const column of columns) {
  await createColumn(column);
  // Petit délai entre chaque création pour éviter rate limiting
  await new Promise(resolve => setTimeout(resolve, 500));
}

console.log('\n✅ Terminé !');
