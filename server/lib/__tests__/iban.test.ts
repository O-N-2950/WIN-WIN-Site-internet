/**
 * Tests pour le module de validation IBAN
 */

import { describe, it, expect } from 'vitest';
import {
  cleanIban,
  formatIban,
  validateIban,
  validateIbanWithMessage,
  IBAN_EXAMPLES,
} from '../iban';

describe('Validation IBAN Suisse', () => {
  describe('cleanIban', () => {
    it('devrait enlever les espaces', () => {
      expect(cleanIban('CH93 0076 2011 6238 5295 7')).toBe('CH9300762011623852957');
    });

    it('devrait mettre en majuscules', () => {
      expect(cleanIban('ch9300762011623852957')).toBe('CH9300762011623852957');
    });

    it('devrait gérer les IBAN sans espaces', () => {
      expect(cleanIban('CH9300762011623852957')).toBe('CH9300762011623852957');
    });
  });

  describe('formatIban', () => {
    it('devrait formater avec espaces (CHXX XXXX XXXX XXXX XXXX X)', () => {
      const formatted = formatIban('CH9300762011623852957');
      expect(formatted).toBe('CH93 0076 2011 6238 5295 7');
    });

    it('devrait gérer les IBAN déjà formatés', () => {
      const formatted = formatIban('CH93 0076 2011 6238 5295 7');
      expect(formatted).toBe('CH93 0076 2011 6238 5295 7');
    });

    it('devrait gérer les IBAN incomplets', () => {
      expect(formatIban('CH93')).toBe('CH93');
      expect(formatIban('CH9300')).toBe('CH93 00');
      expect(formatIban('CH930076')).toBe('CH93 0076');
    });
  });

  describe('validateIban', () => {
    it('devrait valider les IBAN corrects', () => {
      IBAN_EXAMPLES.valid.forEach(iban => {
        expect(validateIban(iban)).toBe(true);
      });
    });

    it('devrait rejeter les IBAN invalides', () => {
      IBAN_EXAMPLES.invalid.forEach(iban => {
        expect(validateIban(iban)).toBe(false);
      });
    });

    it('devrait accepter CH + 19 chiffres', () => {
      expect(validateIban('CH1234567890123456789')).toBe(true);
      expect(validateIban('CH0000000000000000000')).toBe(true);
      expect(validateIban('CH9999999999999999999')).toBe(true);
    });

    it('devrait rejeter si pas 19 chiffres', () => {
      expect(validateIban('CH123456789012345678')).toBe(false);  // 18 chiffres
      expect(validateIban('CH12345678901234567890')).toBe(false); // 20 chiffres
    });

    it('devrait rejeter si ne commence pas par CH', () => {
      expect(validateIban('FR1234567890123456789')).toBe(false);
      expect(validateIban('DE1234567890123456789')).toBe(false);
      expect(validateIban('IT1234567890123456789')).toBe(false);
    });

    it('devrait rejeter si contient des lettres après CH', () => {
      expect(validateIban('CH123456789012345678A')).toBe(false);
      expect(validateIban('CHA234567890123456789')).toBe(false);
    });
  });

  describe('validateIbanWithMessage', () => {
    it('devrait retourner null pour IBAN valide', () => {
      expect(validateIbanWithMessage('CH9300762011623852957')).toBeNull();
      expect(validateIbanWithMessage('CH93 0076 2011 6238 5295 7')).toBeNull();
    });

    it('devrait retourner message si vide', () => {
      expect(validateIbanWithMessage('')).toBe('IBAN requis');
      expect(validateIbanWithMessage('   ')).toBe('IBAN requis');
    });

    it('devrait retourner message si ne commence pas par CH', () => {
      expect(validateIbanWithMessage('FR1234567890123456789')).toBe('L\'IBAN doit commencer par CH');
    });

    it('devrait retourner message si trop court', () => {
      expect(validateIbanWithMessage('CH123456789012345678')).toBe('1 caractère manquant');
      expect(validateIbanWithMessage('CH12345678901234567')).toBe('2 caractères manquants');
    });

    it('devrait retourner message si trop long', () => {
      expect(validateIbanWithMessage('CH12345678901234567890')).toBe('1 caractère en trop');
      expect(validateIbanWithMessage('CH123456789012345678901')).toBe('2 caractères en trop');
    });

    it('devrait retourner message si contient des lettres', () => {
      const message = validateIbanWithMessage('CH123456789012345678A');
      expect(message).toBe('Les 19 caractères après CH doivent être des chiffres');
    });
  });

  describe('Scénarios réels', () => {
    it('Scénario 1: IBAN UBS valide', () => {
      const iban = 'CH93 0076 2011 6238 5295 7';
      expect(validateIban(iban)).toBe(true);
      expect(validateIbanWithMessage(iban)).toBeNull();
    });

    it('Scénario 2: IBAN PostFinance valide', () => {
      const iban = 'CH12 0900 0000 1234 5678 9';
      expect(validateIban(iban)).toBe(true);
      expect(validateIbanWithMessage(iban)).toBeNull();
    });

    it('Scénario 3: Utilisateur oublie un chiffre', () => {
      const iban = 'CH93 0076 2011 6238 5295'; // Manque 1 chiffre
      expect(validateIban(iban)).toBe(false);
      expect(validateIbanWithMessage(iban)).toBe('1 caractère manquant');
    });

    it('Scénario 4: Utilisateur tape un IBAN français', () => {
      const iban = 'FR76 3000 6000 0112 3456 7890 189';
      expect(validateIban(iban)).toBe(false);
      expect(validateIbanWithMessage(iban)).toBe('L\'IBAN doit commencer par CH');
    });

    it('Scénario 5: Utilisateur colle un IBAN sans espaces', () => {
      const iban = 'CH9300762011623852957';
      expect(validateIban(iban)).toBe(true);
      expect(formatIban(iban)).toBe('CH93 0076 2011 6238 5295 7');
    });
  });
});
