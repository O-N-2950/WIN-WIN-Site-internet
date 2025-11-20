const BASE_ID = 'appZQkRJ7PwOtdQ3O';
const TABLE_ID = 'tblWPcIpGmBZ3ASGI';
const API_KEY = 'patBP3F1Ta2m8FsKz.d66be1dd6f02fa14e0737d5910fdd37ba6277dd21927247be3e5d57d86514165';

// Tester si on peut lire le schéma de la table
const url = `https://api.airtable.com/v0/meta/bases/${BASE_ID}/tables`;

try {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
    },
  });

  if (!response.ok) {
    console.error('Erreur:', response.status, await response.text());
  } else {
    const data = await response.json();
    console.log('✅ Permissions OK pour lire le schéma');
    console.log('Tables:', data.tables.map(t => t.name).join(', '));
    
    // Trouver la table Clients
    const clientsTable = data.tables.find(t => t.id === TABLE_ID);
    if (clientsTable) {
      console.log('\n📋 Table Clients trouvée:', clientsTable.name);
      console.log('Colonnes existantes:', clientsTable.fields.map(f => f.name).join(', '));
    }
  }
} catch (error) {
  console.error('Erreur:', error);
}
