/**
 * Configuration Airtable pour WIN WIN Finance Group
 * Base: ERP Clients WW
 */

export const AIRTABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tables: {
    clients: {
      id: 'tblWPcIpGmBZ3ASGI',
      fields: {
        nomClient: 'fldoJ7b8Q7PaM27Vd',
        idClient: 'fldhozJVY3Qr3HXdb',
        nom: 'fldaADa3p1WhaIKhW',
        prenom: 'fldfhjuxTQwZipdOf',
        email: 'fldI0sr2QLOJYsZR6',
        telMobile: 'fldVnQFYRxlHwbcAo',
        telFixe: 'fldIMSSTTlvwP0Uwl',
        adresse: 'fldWXpm73tI4mHUoj',
        npa: 'fldkbLY9Ziota9Wey',
        localite: 'fldqs8SybdPAauPdJ',
        typeClient: 'flddoSiduFTUIciGX', // Particulier ou Entreprise
        dateNaissance: 'flddLhgVxc3kCl0Yt',
        age: 'fldgJzTufgozKGwWh',
        nbEmployes: 'fldb0luJBAdheYrCm',
        tarifApplicable: 'fldjS5xq3CVfIdIEt',
        statutClient: 'fldw9QKnjkINjZ7kQ',
        dateSignatureMandat: 'fldzZyuW5mElq0NAX',
        mandatOffert: 'flda7YHZTqwxL9zdr',
        mandatSigne: 'fldaw7xjEZyjiFDWR',
        dateCreation: 'fldJfGM8wGOZeEtSy',
      },
    },
    contrats: {
      id: 'tblDOIQM3zt7QkZd4',
      fields: {
        numeroContrat: 'fldKDTi7nGsXEUGC6',
        nomClient: 'fldj2IjOoQiqqC0tD',
        compagnie: 'fldHzk8EcrK8dDC5Q',
        typeContrat: 'fld6WoCEuhzx6F7p4',
        montantPrime: 'fldVUcf9EgERiw5vL',
        dateDebut: 'fld3MpVBL1K1YACcZ',
        dateFin: 'fldYsXRELTpDzZXEI',
        statutContrat: 'fldmXfYu2FAgq2HL7',
      },
    },
  },
} as const;

export type AirtableConfig = typeof AIRTABLE_CONFIG;
