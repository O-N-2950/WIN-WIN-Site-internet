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
        nomEntreprise: 'fldZ8w4IDGJBKS35M', // Nom de l'entreprise
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
        mandatSigne: 'fldFlOqiGic9Yv3on', // MANDAT DE GESTION signé (Attachment)
        dateCreation: 'fldJfGM8wGOZeEtSy',
        signatureClient: 'fldXxORXbvcHPVTio', // Attachment (pièce jointe)
        relationsFamiliales: 'fldXEhXcXbV40f6zM', // Multiple select (Membre fondateur, épouse, etc.)
        lieAFamille: 'fldt6pklPvJmGq5FJ', // Lié à (famille) - multipleRecordLinks
        groupeFamilial: 'fld7adFgijiW0Eqhj', // Single line text (FAMILLE-NOM-2024)
        codeParrainage: 'fldEx4ytlCnqPoSDM', // Single line text (DUPO-1234)
        // Champs Stripe pour facturation
        stripeSubscriptionId: 'fldocAjdGomXPRQeU', // Stripe Subscription ID
        dateProchaineFact: 'fld3VBfm8vhkawBCo', // Date prochaine facturation (formule: date dernière facture + 360 jours)
        statutPaiement: 'fldaFF7mU0FwNshw7', // Statut Paiement (Payé/En attente/Échoué)
        dateDernierPaiement: 'fldrg5f0BD3np8Mug', // Date dernier paiement
        stripeInvoiceId: 'fldMn8zMy3lQNWF0e', // Stripe Invoice ID
        dateDerniereFacture: 'fldq2bsTMuxynxVHj', // date dernière facture établie
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
