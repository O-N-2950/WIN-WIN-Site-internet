import { describe, it, expect } from 'vitest';

/**
 * Tests pour la formule de rabais familial WIN WIN Finance
 * 
 * Formule : Rabais (%) = (N - 1) × 2 + 2
 * Plafond : 20%
 * Prix de base : 185 CHF
 */

describe('Formule de Rabais Familial', () => {
  const PRIX_BASE = 185.00;

  function calculerRabais(nbMembres: number): number {
    if (nbMembres < 2) return 0;
    let rabais = (nbMembres - 1) * 2 + 2;
    return Math.min(rabais, 20); // Plafond à 20%
  }

  function calculerPrixFinal(nbMembres: number): number {
    const rabais = calculerRabais(nbMembres);
    return PRIX_BASE * (1 - rabais / 100);
  }

  it('1 membre → 0% de rabais → 185.00 CHF', () => {
    expect(calculerRabais(1)).toBe(0);
    expect(calculerPrixFinal(1)).toBe(185.00);
  });

  it('2 membres → 4% de rabais → 177.60 CHF', () => {
    expect(calculerRabais(2)).toBe(4);
    expect(calculerPrixFinal(2)).toBeCloseTo(177.60, 2);
  });

  it('3 membres → 6% de rabais → 173.90 CHF', () => {
    expect(calculerRabais(3)).toBe(6);
    expect(calculerPrixFinal(3)).toBeCloseTo(173.90, 2);
  });

  it('4 membres → 8% de rabais → 170.20 CHF', () => {
    expect(calculerRabais(4)).toBe(8);
    expect(calculerPrixFinal(4)).toBeCloseTo(170.20, 2);
  });

  it('5 membres → 10% de rabais → 166.50 CHF', () => {
    expect(calculerRabais(5)).toBe(10);
    expect(calculerPrixFinal(5)).toBeCloseTo(166.50, 2);
  });

  it('10 membres → 20% de rabais → 148.00 CHF (plafond)', () => {
    expect(calculerRabais(10)).toBe(20);
    expect(calculerPrixFinal(10)).toBeCloseTo(148.00, 2);
  });

  it('15 membres → 20% de rabais → 148.00 CHF (plafond)', () => {
    expect(calculerRabais(15)).toBe(20); // Devrait être 30% mais plafonné à 20%
    expect(calculerPrixFinal(15)).toBeCloseTo(148.00, 2);
  });

  it('100 membres → 20% de rabais → 148.00 CHF (plafond)', () => {
    expect(calculerRabais(100)).toBe(20);
    expect(calculerPrixFinal(100)).toBeCloseTo(148.00, 2);
  });
});

describe('Arrondi au centime (Stripe)', () => {
  it('177.60 CHF → 17760 centimes', () => {
    const prix = 177.60;
    expect(Math.round(prix * 100)).toBe(17760);
  });

  it('173.90 CHF → 17390 centimes', () => {
    const prix = 173.90;
    expect(Math.round(prix * 100)).toBe(17390);
  });

  it('170.20 CHF → 17020 centimes', () => {
    const prix = 170.20;
    expect(Math.round(prix * 100)).toBe(17020);
  });
});
