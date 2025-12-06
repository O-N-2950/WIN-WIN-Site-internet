/**
 * Tests pour le système de parrainage familial
 * WIN WIN Finance Group
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFamilyDiscount,
  applyFamilyDiscount,
  generateInvoiceDescription,
  generateFamilyMembersSummary,
  type FamilyMember,
} from './parrainage';

describe('Système de Parrainage', () => {
  describe('calculateFamilyDiscount', () => {
    it('devrait retourner 0% pour 1 membre (seul)', () => {
      expect(calculateFamilyDiscount(1)).toBe(0);
    });

    it('devrait retourner 2% pour 2 membres', () => {
      expect(calculateFamilyDiscount(2)).toBe(2);
    });

    it('devrait retourner 6% pour 4 membres', () => {
      expect(calculateFamilyDiscount(4)).toBe(6);
    });

    it('devrait retourner 18% pour 10 membres', () => {
      expect(calculateFamilyDiscount(10)).toBe(18);
    });

    it('devrait plafonner à 20% pour 11 membres ou plus', () => {
      expect(calculateFamilyDiscount(11)).toBe(20);
      expect(calculateFamilyDiscount(15)).toBe(20);
      expect(calculateFamilyDiscount(20)).toBe(20);
    });
  });

  describe('applyFamilyDiscount', () => {
    it('devrait retourner le prix de base si rabais = 0%', () => {
      expect(applyFamilyDiscount(185, 0)).toBe(185);
    });

    it('devrait appliquer 2% de rabais correctement', () => {
      // 185 - 2% = 185 - 3.70 = 181.30
      expect(applyFamilyDiscount(185, 2)).toBe(181.30);
    });

    it('devrait appliquer 10% de rabais correctement', () => {
      // 185 - 10% = 185 - 18.50 = 166.50
      expect(applyFamilyDiscount(185, 10)).toBe(166.50);
    });

    it('devrait appliquer 20% de rabais correctement', () => {
      // 185 - 20% = 185 - 37 = 148
      expect(applyFamilyDiscount(185, 20)).toBe(148);
    });

    it('devrait arrondir correctement à 2 décimales', () => {
      // 100 - 3% = 97
      expect(applyFamilyDiscount(100, 3)).toBe(97);
    });
  });

  describe('generateInvoiceDescription', () => {
    it('devrait générer une description simple pour 1 membre', () => {
      const members: FamilyMember[] = [
        {
          id: '1',
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean@example.com',
          codeParrainage: 'DUPO-1234',
        },
      ];

      const description = generateInvoiceDescription(members, 0);
      expect(description).toBe('Mandat de Gestion Annuel');
    });

    it('devrait générer une description avec 1 membre de famille', () => {
      const members: FamilyMember[] = [
        {
          id: '1',
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean@example.com',
          codeParrainage: 'DUPO-1234',
        },
        {
          id: '2',
          nom: 'Dupont',
          prenom: 'Marie',
          email: 'marie@example.com',
          codeParrainage: 'DUPO-5678',
          lienParente: 'Épouse',
        },
      ];

      const description = generateInvoiceDescription(members, 2);
      expect(description).toContain('Vous et 1 membre de votre famille');
      expect(description).toContain('Jean Dupont');
      expect(description).toContain('Marie Dupont (Épouse)');
      expect(description).toContain('Rabais familial 2%');
    });

    it('devrait générer une description avec plusieurs membres de famille', () => {
      const members: FamilyMember[] = [
        {
          id: '1',
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean@example.com',
          codeParrainage: 'DUPO-1234',
        },
        {
          id: '2',
          nom: 'Dupont',
          prenom: 'Marie',
          email: 'marie@example.com',
          codeParrainage: 'DUPO-5678',
          lienParente: 'Épouse',
        },
        {
          id: '3',
          nom: 'Dupont',
          prenom: 'Sophie',
          email: 'sophie@example.com',
          codeParrainage: 'DUPO-9012',
          lienParente: 'Fille',
        },
      ];

      const description = generateInvoiceDescription(members, 4);
      expect(description).toContain('Vous et 2 membres de votre famille');
      expect(description).toContain('Rabais familial 4%');
    });
  });

  describe('generateFamilyMembersSummary', () => {
    it('devrait générer un résumé avec noms complets', () => {
      const members: FamilyMember[] = [
        {
          id: '1',
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean@example.com',
          codeParrainage: 'DUPO-1234',
        },
        {
          id: '2',
          nom: 'Dupont',
          prenom: 'Marie',
          email: 'marie@example.com',
          codeParrainage: 'DUPO-5678',
          lienParente: 'Épouse',
        },
      ];

      const summary = generateFamilyMembersSummary(members);
      expect(summary).toBe('Jean Dupont, Marie Dupont (Épouse)');
    });

    it('devrait gérer les membres sans prénom', () => {
      const members: FamilyMember[] = [
        {
          id: '1',
          nom: 'Dupont',
          email: 'dupont@example.com',
          codeParrainage: 'DUPO-1234',
        },
      ];

      const summary = generateFamilyMembersSummary(members);
      expect(summary).toBe('Dupont');
    });
  });

  describe('Scénarios réels', () => {
    it('devrait calculer correctement pour une famille de 4 membres', () => {
      const basePrice = 185; // CHF
      const familyMembersCount = 4;

      const discountPercent = calculateFamilyDiscount(familyMembersCount);
      const finalPrice = applyFamilyDiscount(basePrice, discountPercent);

      expect(discountPercent).toBe(6); // 3 membres supplémentaires × 2%
      expect(finalPrice).toBe(173.90); // 185 - 6%
    });

    it('devrait calculer correctement pour une grande famille (10 membres)', () => {
      const basePrice = 185; // CHF
      const familyMembersCount = 10;

      const discountPercent = calculateFamilyDiscount(familyMembersCount);
      const finalPrice = applyFamilyDiscount(basePrice, discountPercent);

      expect(discountPercent).toBe(18); // 9 membres supplémentaires × 2%
      expect(finalPrice).toBe(151.70); // 185 - 18%
    });

    it('devrait plafonner à 20% pour une très grande famille', () => {
      const basePrice = 185; // CHF
      const familyMembersCount = 15;

      const discountPercent = calculateFamilyDiscount(familyMembersCount);
      const finalPrice = applyFamilyDiscount(basePrice, discountPercent);

      expect(discountPercent).toBe(20); // Plafonné à 20%
      expect(finalPrice).toBe(148); // 185 - 20%
    });
  });
});
