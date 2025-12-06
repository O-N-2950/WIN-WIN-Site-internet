/**
 * Tests pour le module de parrainage familial
 */

import { describe, it, expect } from 'vitest';
import {
  generateFamilyCode,
  calculateFamilyDiscount,
  applyFamilyDiscount,
} from '../parrainage';

describe('Parrainage Familial', () => {
  describe('generateFamilyCode', () => {
    it('devrait générer un code au format NOM-XXXX', () => {
      const code = generateFamilyCode('Dupont');
      expect(code).toMatch(/^[A-Z]{4}-[A-Z0-9]{4}$/);
    });

    it('devrait commencer par les 4 premières lettres du nom', () => {
      const code = generateFamilyCode('Dupont');
      expect(code.startsWith('DUPO-')).toBe(true);
    });

    it('devrait gérer les noms courts (< 4 lettres)', () => {
      const code = generateFamilyCode('Li');
      expect(code).toMatch(/^LIXX-[A-Z0-9]{4}$/);
    });

    it('devrait enlever les accents', () => {
      const code = generateFamilyCode('Müller');
      expect(code.startsWith('MULL-')).toBe(true);
    });

    it('devrait enlever les caractères spéciaux', () => {
      const code = generateFamilyCode("O'Brien");
      expect(code.startsWith('OBRI-')).toBe(true);
    });

    it('devrait générer des codes différents pour le même nom', () => {
      const code1 = generateFamilyCode('Dupont');
      const code2 = generateFamilyCode('Dupont');
      expect(code1).not.toBe(code2);
    });
  });

  describe('calculateFamilyDiscount', () => {
    it('devrait retourner 0% pour 1 mandat (seul)', () => {
      expect(calculateFamilyDiscount(1)).toBe(0);
    });

    it('devrait retourner 4% pour 2 mandats', () => {
      expect(calculateFamilyDiscount(2)).toBe(4);
    });

    it('devrait retourner 12% pour 6 mandats', () => {
      expect(calculateFamilyDiscount(6)).toBe(12);
    });

    it('devrait plafonner à 20% pour 10 mandats', () => {
      expect(calculateFamilyDiscount(10)).toBe(20);
    });

    it('devrait plafonner à 20% pour plus de 10 mandats', () => {
      expect(calculateFamilyDiscount(11)).toBe(20);
      expect(calculateFamilyDiscount(15)).toBe(20);
      expect(calculateFamilyDiscount(100)).toBe(20);
    });

    it('devrait calculer correctement tous les paliers', () => {
      const expected = [
        { mandats: 1, discount: 0 },
        { mandats: 2, discount: 4 },
        { mandats: 3, discount: 6 },
        { mandats: 4, discount: 8 },
        { mandats: 5, discount: 10 },
        { mandats: 6, discount: 12 },
        { mandats: 7, discount: 14 },
        { mandats: 8, discount: 16 },
        { mandats: 9, discount: 18 },
        { mandats: 10, discount: 20 },
      ];

      expected.forEach(({ mandats, discount }) => {
        expect(calculateFamilyDiscount(mandats)).toBe(discount);
      });
    });
  });

  describe('applyFamilyDiscount', () => {
    it('devrait retourner le prix de base si rabais = 0%', () => {
      expect(applyFamilyDiscount(185, 0)).toBe(185);
    });

    it('devrait calculer correctement 2% de rabais', () => {
      const result = applyFamilyDiscount(185, 2);
      expect(result).toBe(181.30);
    });

    it('devrait calculer correctement 10% de rabais', () => {
      const result = applyFamilyDiscount(185, 10);
      expect(result).toBe(166.50);
    });

    it('devrait calculer correctement 20% de rabais (max)', () => {
      const result = applyFamilyDiscount(185, 20);
      expect(result).toBe(148);
    });

    it('devrait arrondir à 2 décimales', () => {
      const result = applyFamilyDiscount(185, 3);
      expect(result).toBe(179.45);
    });

    it('devrait fonctionner avec différents prix de base', () => {
      expect(applyFamilyDiscount(260, 10)).toBe(234);
      expect(applyFamilyDiscount(360, 20)).toBe(288);
    });
  });

  describe('Scénarios complets', () => {
    it('Scénario 1: Client seul (1 mandat)', () => {
      const mandats = 1;
      const basePrice = 185;
      
      const discount = calculateFamilyDiscount(mandats);
      const finalPrice = applyFamilyDiscount(basePrice, discount);
      
      expect(discount).toBe(0);
      expect(finalPrice).toBe(185);
    });

    it('Scénario 2: Client + Entreprise (2 mandats)', () => {
      const mandats = 2;
      const basePricePrive = 185;
      const basePriceEntreprise = 260;
      
      const discount = calculateFamilyDiscount(mandats);
      const pricePrive = applyFamilyDiscount(basePricePrive, discount);
      const priceEntreprise = applyFamilyDiscount(basePriceEntreprise, discount);
      
      expect(discount).toBe(4);
      expect(pricePrive).toBe(177.60);
      expect(priceEntreprise).toBe(249.60);
    });

    it('Scénario 3: Couple (2 mandats)', () => {
      const mandats = 2;
      const basePrice = 185;
      
      const discount = calculateFamilyDiscount(mandats);
      const finalPrice = applyFamilyDiscount(basePrice, discount);
      
      expect(discount).toBe(4);
      expect(finalPrice).toBe(177.60);
    });

    it('Scénario 4: Couple + Entreprise (3 mandats)', () => {
      const mandats = 3;
      const basePricePrive = 185;
      const basePriceEntreprise = 260;
      
      const discount = calculateFamilyDiscount(mandats);
      const pricePrive = applyFamilyDiscount(basePricePrive, discount);
      const priceEntreprise = applyFamilyDiscount(basePriceEntreprise, discount);
      
      expect(discount).toBe(6);
      expect(pricePrive).toBe(173.90);
      expect(priceEntreprise).toBe(244.40);
    });

    it('Scénario 5: Famille de 10 mandats (MAX)', () => {
      const mandats = 10;
      const basePrice = 185;
      
      const discount = calculateFamilyDiscount(mandats);
      const finalPrice = applyFamilyDiscount(basePrice, discount);
      
      expect(discount).toBe(20);
      expect(finalPrice).toBe(148);
    });

    it('Scénario 6: Famille de 11 mandats (plafond 20%)', () => {
      const mandats = 11;
      const basePrice = 185;
      
      const discount = calculateFamilyDiscount(mandats);
      const finalPrice = applyFamilyDiscount(basePrice, discount);
      
      expect(discount).toBe(20); // Plafonné à 20%
      expect(finalPrice).toBe(148);
    });

    it('Scénario 7: Résiliation d\'un membre (10 → 9 mandats)', () => {
      const basePrice = 185;
      
      // Avant résiliation (10 mandats)
      const discount10 = calculateFamilyDiscount(10);
      const price10 = applyFamilyDiscount(basePrice, discount10);
      
      // Après résiliation (9 mandats)
      const discount9 = calculateFamilyDiscount(9);
      const price9 = applyFamilyDiscount(basePrice, discount9);
      
      expect(discount10).toBe(20);
      expect(price10).toBe(148);
      
      expect(discount9).toBe(18);
      expect(price9).toBe(151.70);
      
      // Augmentation de prix par personne
      const increase = Math.round((price9 - price10) * 100) / 100;
      expect(increase).toBe(3.70);
    });
  });
});
