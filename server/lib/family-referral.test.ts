/**
 * Tests pour le système de parrainage et groupes familiaux
 */

import { describe, it, expect } from 'vitest';
import { generateReferralCode, generateFamilyGroupId, isValidReferralCode } from './referral-code';
import { setupReferralForNewClient } from './family-referral';

describe('Système de Parrainage', () => {
  
  describe('Génération de codes parrainage', () => {
    it('devrait générer un code au bon format (NOM-1234)', () => {
      const code = generateReferralCode('Dupont');
      expect(code).toMatch(/^[A-Z]{4}-\d{4}$/);
      expect(code.startsWith('DUPO-')).toBe(true);
    });
    
    it('devrait gérer les noms avec accents', () => {
      const code = generateReferralCode('Müller');
      expect(code).toMatch(/^[A-Z]{4}-\d{4}$/);
      expect(code.startsWith('MULL-')).toBe(true);
    });
    
    it('devrait gérer les noms courts', () => {
      const code = generateReferralCode('Li');
      expect(code).toMatch(/^[A-Z]{4}-\d{4}$/);
      expect(code.startsWith('LIXX-')).toBe(true);
    });
    
    it('devrait valider un code correct', () => {
      expect(isValidReferralCode('DUPO-1234')).toBe(true);
      expect(isValidReferralCode('MART-5678')).toBe(true);
    });
    
    it('devrait rejeter un code invalide', () => {
      expect(isValidReferralCode('DUP-1234')).toBe(false); // Trop court
      expect(isValidReferralCode('DUPONT-1234')).toBe(false); // Trop long
      expect(isValidReferralCode('DUPO1234')).toBe(false); // Pas de tiret
      expect(isValidReferralCode('DUPO-ABC')).toBe(false); // Pas que des chiffres
    });
  });
  
  describe('Génération d\'identifiants de groupe familial', () => {
    it('devrait générer un identifiant au bon format', () => {
      const groupId = generateFamilyGroupId('Dupont');
      const currentYear = new Date().getFullYear();
      expect(groupId).toBe(`FAMILLE-DUPONT-${currentYear}`);
    });
    
    it('devrait gérer les noms avec accents', () => {
      const groupId = generateFamilyGroupId('Müller');
      const currentYear = new Date().getFullYear();
      expect(groupId).toBe(`FAMILLE-MULLER-${currentYear}`);
    });
  });
  
  describe('Configuration parrainage pour nouveau client', () => {
    it('devrait créer un nouveau groupe pour un client sans parrainage', async () => {
      const result = await setupReferralForNewClient('Dupont');
      
      expect(result.relationsFamiliales).toBe('Membre fondateur');
      expect(result.groupeFamilial).toMatch(/^FAMILLE-DUPONT-\d{4}$/);
      expect(result.codeParrainage).toMatch(/^DUPO-\d{4}$/);
    });
    
    it('devrait générer un code parrainage unique', async () => {
      const result1 = await setupReferralForNewClient('Dupont');
      const result2 = await setupReferralForNewClient('Dupont');
      
      // Les codes doivent être différents (probabilité très faible de collision)
      expect(result1.codeParrainage).not.toBe(result2.codeParrainage);
    });
  });
});
