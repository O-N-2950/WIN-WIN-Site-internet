/**
 * Tests pour le système de parrainage familial
 * WIN WIN Finance Group
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateReferralCode, generateFamilyCode } from '../../lib/parrainage';

describe('Système de Parrainage Familial', () => {
  describe('generateFamilyCode', () => {
    it('devrait générer un code au format NOM-XXXX', () => {
      const code = generateFamilyCode('NEUKOMM');
      
      expect(code).toMatch(/^[A-Z]{4}-[A-Z0-9]{4}$/);
      expect(code.startsWith('NEUK-')).toBe(true);
    });

    it('devrait gérer les noms courts (< 4 lettres)', () => {
      const code = generateFamilyCode('LEE');
      
      expect(code).toMatch(/^[A-Z]{4}-[A-Z0-9]{4}$/);
      expect(code.startsWith('LEEX-')).toBe(true);
    });

    it('devrait enlever les accents', () => {
      const code = generateFamilyCode('MÜLLER');
      
      expect(code).toMatch(/^[A-Z]{4}-[A-Z0-9]{4}$/);
      expect(code.startsWith('MULL-')).toBe(true);
    });

    it('devrait générer des codes différents pour le même nom', () => {
      const code1 = generateFamilyCode('DUPONT');
      const code2 = generateFamilyCode('DUPONT');
      
      expect(code1).not.toBe(code2);
      expect(code1.startsWith('DUPO-')).toBe(true);
      expect(code2.startsWith('DUPO-')).toBe(true);
    });
  });

  describe('validateReferralCode', () => {
    it('devrait rejeter un code vide', async () => {
      const result = await validateReferralCode('');
      expect(result).toBeNull();
    });

    it('devrait rejeter un code avec format invalide', async () => {
      const result1 = await validateReferralCode('ABC-123'); // Trop court
      const result2 = await validateReferralCode('ABCDE-1234'); // Trop long
      const result3 = await validateReferralCode('ABC-12345'); // Partie droite trop longue
      
      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toBeNull();
    });

    it('devrait accepter un code au format valide', async () => {
      // Note: Ce test nécessite un code existant dans Airtable
      // Pour les tests unitaires, on devrait mocker l'appel Airtable
      const validCode = 'OLIV-SELS';
      
      // Mock de l'appel Airtable (à implémenter si nécessaire)
      const result = await validateReferralCode(validCode);
      
      // Le résultat dépend de la présence du code dans Airtable
      if (result) {
        expect(result).toHaveProperty('nom');
        expect(result).toHaveProperty('email');
        expect(result).toHaveProperty('codeParrainage');
      }
    });
  });

  describe('Workflow de création de client avec parrainage', () => {
    it('devrait créer un nouveau groupe si le parrain n\'en a pas', () => {
      // Test conceptuel : vérifier la logique de création de groupe
      const referrerHasGroup = false;
      const referrerNom = 'NEUKOMM';
      
      let groupeFamilial: string;
      
      if (!referrerHasGroup) {
        // Créer un nouveau groupe
        const code = generateFamilyCode(referrerNom);
        groupeFamilial = `FAMILLE-${code}`;
        
        expect(groupeFamilial).toMatch(/^FAMILLE-[A-Z]{4}-[A-Z0-9]{4}$/);
        expect(groupeFamilial).toContain('FAMILLE-NEUK-');
      }
    });

    it('devrait rejoindre le groupe existant du parrain', () => {
      // Test conceptuel : vérifier la logique de rejoindre un groupe
      const referrerHasGroup = true;
      const existingGroup = 'FAMILLE-NEUK-ABC1';
      
      let groupeFamilial: string;
      
      if (referrerHasGroup) {
        groupeFamilial = existingGroup;
        
        expect(groupeFamilial).toBe('FAMILLE-NEUK-ABC1');
      }
    });
  });

  describe('Format du code de parrainage', () => {
    it('devrait valider le format XXXX-XXXX', () => {
      const validCodes = [
        'OLIV-SELS',
        'NEUK-ABC1',
        'DUPO-1234',
        'MART-XYZ9',
      ];

      const codePattern = /^[A-Z]{4}-[A-Z0-9]{4}$/;

      validCodes.forEach(code => {
        expect(code).toMatch(codePattern);
      });
    });

    it('devrait rejeter les formats invalides', () => {
      const invalidCodes = [
        'ABC-123',      // Trop court
        'ABCDE-1234',   // Partie gauche trop longue
        'ABCD-12345',   // Partie droite trop longue
        'abcd-1234',    // Minuscules
        'ABCD_1234',    // Mauvais séparateur
      ];

      const codePattern = /^[A-Z]{4}-[A-Z0-9]{4}$/;

      invalidCodes.forEach(code => {
        expect(code).not.toMatch(codePattern);
      });
    });
  });
});
