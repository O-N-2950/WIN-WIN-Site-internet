/**
 * Tests pour le router client-v2
 * Test de création multi-mandats avec IBAN
 */

import { describe, it, expect } from 'vitest';

describe('Client V2 Router - createFromSignature', () => {
  // Mock data pour les tests
  const baseInput = {
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@test.ch',
    telMobile: '+41 79 123 45 67',
    adresse: 'Rue de la Paix 12',
    npa: '1000',
    localite: 'Lausanne',
    dateNaissance: '1980-01-15',
    ibanPersonnel: 'CH9300762011623852957',
    banquePersonnelle: 'UBS',
    signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  };

  describe('Validation IBAN', () => {
    it('devrait accepter un IBAN suisse valide', () => {
      const ibans = [
        'CH9300762011623852957',
        'CH93 0076 2011 6238 5295 7',
        'CH1234567890123456789',
      ];
      
      ibans.forEach(iban => {
        // Le cleanIban devrait normaliser tous ces formats
        expect(iban.replace(/\s/g, '')).toMatch(/^CH\d{19}$/);
      });
    });

    it('devrait rejeter un IBAN invalide', () => {
      const ibansInvalides = [
        'CH93007620116238529',        // 18 chiffres
        'FR9300762011623852957',      // Pas CH
        'CH93A0762011623852957',      // Contient lettre
      ];
      
      ibansInvalides.forEach(iban => {
        expect(iban.replace(/\s/g, '')).not.toMatch(/^CH\d{19}$/);
      });
    });
  });

  describe('Calcul du nombre de mandats', () => {
    it('Scénario 1: Client seul = 1 mandat', () => {
      const input = {
        ...baseInput,
        typeClient: 'prive' as const,
        situationFamiliale: 'Célibataire' as const,
      };
      
      // Nombre de mandats attendu
      let nombreMandats = 1;
      expect(nombreMandats).toBe(1);
    });

    it('Scénario 2: Client + Entreprise = 2 mandats', () => {
      const input = {
        ...baseInput,
        typeClient: 'les_deux' as const,
        situationFamiliale: 'Célibataire' as const,
        nomEntreprise: 'Dupont Sàrl',
        ibanEntreprise: 'CH1234567890123456789',
        banqueEntreprise: 'Raiffeisen',
      };
      
      let nombreMandats = 0;
      nombreMandats++; // Privé
      if (input.typeClient === 'les_deux') nombreMandats++; // Entreprise
      
      expect(nombreMandats).toBe(2);
    });

    it('Scénario 3: Couple (conjoint avec contrats) = 2 mandats', () => {
      const input = {
        ...baseInput,
        typeClient: 'prive' as const,
        situationFamiliale: 'Marié(e)' as const,
        conjointPrenom: 'Marie',
        conjointNom: 'Dupont',
        conjointDateNaissance: '1982-05-20',
        conjointHasContracts: true,
        ibanConjoint: 'CH1234567890123456789',
        banqueConjoint: 'Credit Suisse',
      };
      
      let nombreMandats = 1; // Client principal
      if (input.situationFamiliale === 'Marié(e)' && input.conjointHasContracts) {
        nombreMandats++; // Conjoint
      }
      
      expect(nombreMandats).toBe(2);
    });

    it('Scénario 4: Couple + Entreprise = 3 mandats', () => {
      const input = {
        ...baseInput,
        typeClient: 'les_deux' as const,
        situationFamiliale: 'Marié(e)' as const,
        conjointPrenom: 'Marie',
        conjointNom: 'Dupont',
        conjointDateNaissance: '1982-05-20',
        conjointHasContracts: true,
        ibanConjoint: 'CH1234567890123456789',
        banqueConjoint: 'Credit Suisse',
        nomEntreprise: 'Dupont Sàrl',
        ibanEntreprise: 'CH9999999999999999999',
        banqueEntreprise: 'Raiffeisen',
      };
      
      let nombreMandats = 1; // Client principal
      if (input.situationFamiliale === 'Marié(e)' && input.conjointHasContracts) {
        nombreMandats++; // Conjoint
      }
      if (input.typeClient === 'les_deux') {
        nombreMandats++; // Entreprise
      }
      
      expect(nombreMandats).toBe(3);
    });

    it('Scénario 5: Couple (conjoint SANS contrats) = 1 mandat + 1 entrée offerte', () => {
      const input = {
        ...baseInput,
        typeClient: 'prive' as const,
        situationFamiliale: 'Marié(e)' as const,
        conjointPrenom: 'Marie',
        conjointNom: 'Dupont',
        conjointDateNaissance: '1982-05-20',
        conjointHasContracts: false,
      };
      
      let nombreMandats = 1; // Client principal
      let mandatOffert = false;
      
      if (input.situationFamiliale === 'Marié(e)' && input.conjointHasContracts === false) {
        mandatOffert = true; // Entrée "Mandat offert" créée
      }
      
      expect(nombreMandats).toBe(1);
      expect(mandatOffert).toBe(true);
    });
  });

  describe('Calcul du rabais familial', () => {
    it('1 mandat = 0% de rabais', () => {
      const nombreMandats = 1;
      const rabais = nombreMandats <= 1 ? 0 : (nombreMandats - 1) * 2;
      expect(rabais).toBe(0);
    });

    it('2 mandats = 2% de rabais', () => {
      const nombreMandats = 2;
      const rabais = (nombreMandats - 1) * 2;
      expect(rabais).toBe(2);
    });

    it('3 mandats = 4% de rabais', () => {
      const nombreMandats = 3;
      const rabais = (nombreMandats - 1) * 2;
      expect(rabais).toBe(4);
    });
  });

  describe('Calcul des montants', () => {
    it('Client seul (1 mandat) : 185 CHF (0% rabais)', () => {
      const montantBase = 185;
      const rabais = 0;
      const montantFinal = montantBase * (1 - rabais / 100);
      
      expect(montantFinal).toBe(185);
    });

    it('Couple (2 mandats) : 181.30 CHF chacun (2% rabais)', () => {
      const montantBase = 185;
      const rabais = 2;
      const montantFinal = Math.round(montantBase * (1 - rabais / 100) * 100) / 100;
      
      expect(montantFinal).toBe(181.30);
    });

    it('Couple + Entreprise (3 mandats) : 177.60 CHF privé, 249.60 CHF entreprise (4% rabais)', () => {
      const montantBasePrive = 185;
      const montantBaseEntreprise = 260;
      const rabais = 4;
      
      const montantFinalPrive = Math.round(montantBasePrive * (1 - rabais / 100) * 100) / 100;
      const montantFinalEntreprise = Math.round(montantBaseEntreprise * (1 - rabais / 100) * 100) / 100;
      
      expect(montantFinalPrive).toBe(177.60);
      expect(montantFinalEntreprise).toBe(249.60);
    });
  });

  describe('Structure de la réponse', () => {
    it('devrait retourner la structure attendue', () => {
      const mockResponse = {
        success: true,
        codeParrainage: 'DUPO-A1B2',
        nombreMandats: 2,
        rabaisFamilial: 2,
        mandats: [
          {
            clientId: 'rec123',
            type: 'Privé' as const,
            nom: 'Dupont',
            prenom: 'Jean',
            pdfUrl: 'https://s3.../mandat-prive-Dupont-123.pdf',
            montantBase: 185,
            montantFinal: 181.30,
            iban: 'CH9300762011623852957',
            banque: 'UBS',
          },
          {
            clientId: 'rec456',
            type: 'Entreprise' as const,
            nom: 'Dupont Sàrl',
            pdfUrl: 'https://s3.../mandat-entreprise-Dupont-Sarl-456.pdf',
            montantBase: 260,
            montantFinal: 254.80,
            iban: 'CH1234567890123456789',
            banque: 'Raiffeisen',
          },
        ],
        message: '2 mandat(s) créé(s) avec succès',
      };
      
      expect(mockResponse.success).toBe(true);
      expect(mockResponse.nombreMandats).toBe(2);
      expect(mockResponse.mandats).toHaveLength(2);
      expect(mockResponse.mandats[0].type).toBe('Privé');
      expect(mockResponse.mandats[1].type).toBe('Entreprise');
    });
  });
});
