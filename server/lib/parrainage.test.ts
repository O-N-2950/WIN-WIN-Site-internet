/**
 * Tests unitaires pour le système de parrainage familial
 */

import { describe, it, expect } from "vitest";
import { calculateFamilyDiscount, generateFamilyId } from "./parrainage";

describe("Système de Parrainage Familial", () => {
  describe("calculateFamilyDiscount", () => {
    it("devrait retourner 0% de rabais pour 1 membre", () => {
      const result = calculateFamilyDiscount(1, 185);
      expect(result.nombreMembres).toBe(1);
      expect(result.pourcentageRabais).toBe(0);
      expect(result.prixBase).toBe(185);
      expect(result.montantRabais).toBe(0);
      expect(result.prixFinal).toBe(185);
    });

    it("devrait calculer 4% de rabais pour 2 membres", () => {
      const result = calculateFamilyDiscount(2, 185);
      expect(result.nombreMembres).toBe(2);
      expect(result.pourcentageRabais).toBe(4); // 2 membres × 2%
      expect(result.prixBase).toBe(185);
      expect(result.montantRabais).toBe(7.4); // 185 × 4% = 7.4
      expect(result.prixFinal).toBe(177.6); // 185 - 7.4
    });

    it("devrait calculer 10% de rabais pour 5 membres", () => {
      const result = calculateFamilyDiscount(5, 185);
      expect(result.nombreMembres).toBe(5);
      expect(result.pourcentageRabais).toBe(10); // 5 membres × 2%
      expect(result.prixBase).toBe(185);
      expect(result.montantRabais).toBe(18.5); // 185 × 10%
      expect(result.prixFinal).toBe(166.5); // 185 - 18.5
    });

    it("devrait plafonner à 20% de rabais pour 10 membres", () => {
      const result = calculateFamilyDiscount(10, 185);
      expect(result.nombreMembres).toBe(10);
      expect(result.pourcentageRabais).toBe(20); // Max 20%
      expect(result.prixBase).toBe(185);
      expect(result.montantRabais).toBe(37); // 185 × 20%
      expect(result.prixFinal).toBe(148); // 185 - 37
    });

    it("devrait plafonner à 20% de rabais pour 15 membres", () => {
      const result = calculateFamilyDiscount(15, 185);
      expect(result.nombreMembres).toBe(15);
      expect(result.pourcentageRabais).toBe(20); // Max 20% (pas 30%)
      expect(result.prixBase).toBe(185);
      expect(result.montantRabais).toBe(37); // 185 × 20%
      expect(result.prixFinal).toBe(148); // 185 - 37
    });

    it("devrait fonctionner avec un prix de base personnalisé", () => {
      const result = calculateFamilyDiscount(3, 260); // Entreprise 1 employé
      expect(result.nombreMembres).toBe(3);
      expect(result.pourcentageRabais).toBe(6); // 3 membres × 2%
      expect(result.prixBase).toBe(260);
      expect(result.montantRabais).toBe(15.6); // 260 × 6%
      expect(result.prixFinal).toBe(244.4); // 260 - 15.6
    });
  });

  describe("generateFamilyId", () => {
    it("devrait générer un ID de groupe familial valide", () => {
      const familyId = generateFamilyId("Dupont");
      expect(familyId).toMatch(/^FAM-DUPONT-\d{4}-[A-Z0-9]{2}$/);
    });

    it("devrait nettoyer les caractères spéciaux", () => {
      const familyId = generateFamilyId("Müller-Schmidt");
      expect(familyId).toMatch(/^FAM-MLLERSCH-\d{4}-[A-Z0-9]{2}$/);
    });

    it("devrait tronquer les noms trop longs", () => {
      const familyId = generateFamilyId("VeryLongFamilyName");
      expect(familyId).toMatch(/^FAM-VERYLONG-\d{4}-[A-Z0-9]{2}$/);
    });

    it("devrait générer des IDs différents pour le même nom", () => {
      const id1 = generateFamilyId("Dupont");
      const id2 = generateFamilyId("Dupont");
      // Les suffixes aléatoires devraient être différents (probabilité très élevée)
      expect(id1).not.toBe(id2);
    });
  });

  describe("Scénarios réels", () => {
    it("Scénario 1: Famille de 3 personnes (père, mère, fils)", () => {
      // Prix de base pour particulier > 22 ans: 185 CHF
      const result = calculateFamilyDiscount(3, 185);
      
      expect(result.nombreMembres).toBe(3);
      expect(result.pourcentageRabais).toBe(6); // 3 × 2%
      expect(result.prixFinal).toBe(173.9); // 185 - (185 × 6%)
      
      // Chaque membre paie 173.90 CHF/an au lieu de 185 CHF
      // Économie totale famille: (185 - 173.9) × 3 = 33.30 CHF/an
    });

    it("Scénario 2: Famille de 5 personnes + 2 entreprises", () => {
      // 7 membres au total (5 personnes + 2 entreprises)
      const result = calculateFamilyDiscount(7, 185);
      
      expect(result.nombreMembres).toBe(7);
      expect(result.pourcentageRabais).toBe(14); // 7 × 2%
      expect(result.prixFinal).toBe(159.1); // 185 - (185 × 14%)
      
      // Rabais substantiel: 25.90 CHF par mandat
    });

    it("Scénario 3: Grande famille de 12 personnes", () => {
      // Devrait plafonner à 20%
      const result = calculateFamilyDiscount(12, 185);
      
      expect(result.nombreMembres).toBe(12);
      expect(result.pourcentageRabais).toBe(20); // Plafonné à 20%
      expect(result.prixFinal).toBe(148); // 185 - (185 × 20%)
      
      // Économie maximale: 37 CHF par mandat
      // Sur 12 mandats: 37 × 12 = 444 CHF/an économisés
    });
  });
});
