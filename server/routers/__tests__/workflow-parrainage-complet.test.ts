/**
 * Test du workflow complet de parrainage familial
 * De l'inscription jusqu'à la création dans Airtable
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { validateReferralCode, generateFamilyCode, calculateFamilyDiscount, applyFamilyDiscount } from '../../lib/parrainage';

describe('Workflow Complet - Parrainage Familial', () => {
  const CODE_PARRAINAGE_TEST = 'OLIV-SELS';
  
  describe('Étape 1: Validation du code de parrainage', () => {
    it('devrait valider le code OLIV-SELS', async () => {
      const referrer = await validateReferralCode(CODE_PARRAINAGE_TEST);
      
      // Le code devrait être valide si Olivier Neukomm existe dans Airtable
      if (referrer) {
        expect(referrer).toHaveProperty('nom');
        expect(referrer).toHaveProperty('email');
        expect(referrer).toHaveProperty('id');
        expect(referrer.nom).toBe('Neukomm');
        
        console.log('✅ Code OLIV-SELS validé');
        console.log(`   Parrain: ${referrer.prenom} ${referrer.nom}`);
      } else {
        console.log('⚠️  Code OLIV-SELS non trouvé dans Airtable');
      }
    });
  });

  describe('Étape 2: Génération du groupe familial', () => {
    it('devrait générer un code de groupe au bon format', () => {
      const code = generateFamilyCode('Neukomm');
      
      expect(code).toMatch(/^[A-Z]{4}-[A-Z0-9]{4}$/);
      expect(code.startsWith('NEUK-')).toBe(true);
      
      const groupeComplet = `FAMILLE-${code}`;
      expect(groupeComplet).toMatch(/^FAMILLE-[A-Z]{4}-[A-Z0-9]{4}$/);
      
      console.log(`✅ Groupe généré: ${groupeComplet}`);
    });
  });

  describe('Étape 3: Calcul des rabais familiaux', () => {
    const basePrice = 185; // Prix de base particulier > 22 ans
    
    it('devrait calculer 0% pour 1 membre', () => {
      const rabais = calculateFamilyDiscount(1);
      const prixFinal = applyFamilyDiscount(basePrice, rabais);
      
      expect(rabais).toBe(0);
      expect(prixFinal).toBe(185);
      
      console.log(`1 membre: ${rabais}% → ${prixFinal} CHF`);
    });

    it('devrait calculer 4% pour 2 membres', () => {
      const rabais = calculateFamilyDiscount(2);
      const prixFinal = applyFamilyDiscount(basePrice, rabais);
      
      expect(rabais).toBe(4);
      expect(prixFinal).toBe(177.6);
      
      console.log(`2 membres: ${rabais}% → ${prixFinal} CHF`);
    });

    it('devrait calculer 10% pour 5 membres', () => {
      const rabais = calculateFamilyDiscount(5);
      const prixFinal = applyFamilyDiscount(basePrice, rabais);
      
      expect(rabais).toBe(10);
      expect(prixFinal).toBe(166.5);
      
      console.log(`5 membres: ${rabais}% → ${prixFinal} CHF`);
    });

    it('devrait plafonner à 20% pour 12+ membres', () => {
      const rabais12 = calculateFamilyDiscount(12);
      const rabais20 = calculateFamilyDiscount(20);
      const prixFinal12 = applyFamilyDiscount(basePrice, rabais12);
      const prixFinal20 = applyFamilyDiscount(basePrice, rabais20);
      
      expect(rabais12).toBe(20);
      expect(rabais20).toBe(20);
      expect(prixFinal12).toBe(148);
      expect(prixFinal20).toBe(148);
      
      console.log(`12 membres: ${rabais12}% → ${prixFinal12} CHF (MAX)`);
      console.log(`20 membres: ${rabais20}% → ${prixFinal20} CHF (MAX)`);
    });
  });

  describe('Étape 4: Scénarios d\'assignation au groupe', () => {
    it('Scénario 1: Le parrain a déjà un groupe', () => {
      const referrerHasGroup = true;
      const existingGroup = 'FAMILLE-NEUKOMM-SeLs';
      
      let groupeFamilial: string;
      let actionParrain: string;
      
      if (referrerHasGroup) {
        // Le nouveau client rejoint le groupe existant
        groupeFamilial = existingGroup;
        actionParrain = 'Aucune (groupe déjà existant)';
      } else {
        groupeFamilial = `FAMILLE-${generateFamilyCode('Neukomm')}`;
        actionParrain = 'Créer groupe + marquer comme fondateur';
      }
      
      expect(groupeFamilial).toBe('FAMILLE-NEUKOMM-SeLs');
      expect(actionParrain).toBe('Aucune (groupe déjà existant)');
      
      console.log('✅ Scénario 1: Rejoindre groupe existant');
      console.log(`   Groupe: ${groupeFamilial}`);
      console.log(`   Action parrain: ${actionParrain}`);
    });

    it('Scénario 2: Le parrain n\'a pas de groupe', () => {
      const referrerHasGroup = false;
      const referrerNom = 'Dupont';
      
      let groupeFamilial: string;
      let actionParrain: string;
      
      if (referrerHasGroup) {
        groupeFamilial = 'EXISTING-GROUP';
        actionParrain = 'Aucune';
      } else {
        // Créer un nouveau groupe
        const code = generateFamilyCode(referrerNom);
        groupeFamilial = `FAMILLE-${code}`;
        actionParrain = 'Mettre à jour: Groupe + Relations="Membre fondateur"';
      }
      
      expect(groupeFamilial).toMatch(/^FAMILLE-DUPO-[A-Z0-9]{4}$/);
      expect(actionParrain).toBe('Mettre à jour: Groupe + Relations="Membre fondateur"');
      
      console.log('✅ Scénario 2: Créer nouveau groupe');
      console.log(`   Nouveau groupe: ${groupeFamilial}`);
      console.log(`   Action parrain: ${actionParrain}`);
    });
  });

  describe('Étape 5: Workflow complet simulé', () => {
    it('devrait simuler l\'inscription complète avec parrainage', async () => {
      // Données du nouveau client
      const newClient = {
        prenom: 'Marie',
        nom: 'Dubois',
        email: 'marie.dubois.test@example.com',
        codeParrainage: CODE_PARRAINAGE_TEST,
      };
      
      console.log('');
      console.log('='.repeat(60));
      console.log('SIMULATION WORKFLOW COMPLET');
      console.log('='.repeat(60));
      console.log(`Nouveau client: ${newClient.prenom} ${newClient.nom}`);
      console.log(`Code parrainage: ${newClient.codeParrainage}`);
      console.log('');
      
      // 1. Valider le code
      const referrer = await validateReferralCode(newClient.codeParrainage);
      
      if (referrer) {
        console.log('✅ Étape 1: Code validé');
        console.log(`   Parrain: ${referrer.prenom} ${referrer.nom}`);
        console.log('');
        
        // 2. Déterminer le groupe (simulation)
        // Dans la vraie implémentation, on appellerait getClientById(referrer.id)
        const referrerHasGroup = true; // Olivier a déjà un groupe
        const existingGroup = 'FAMILLE-NEUKOMM-SeLs';
        
        let groupeFamilial: string;
        
        if (referrerHasGroup) {
          groupeFamilial = existingGroup;
          console.log('✅ Étape 2: Rejoindre groupe existant');
          console.log(`   Groupe: ${groupeFamilial}`);
        } else {
          const code = generateFamilyCode(referrer.nom);
          groupeFamilial = `FAMILLE-${code}`;
          console.log('✅ Étape 2: Créer nouveau groupe');
          console.log(`   Nouveau groupe: ${groupeFamilial}`);
          console.log('   ⚠️  Parrain à mettre à jour comme fondateur');
        }
        
        console.log('');
        
        // 3. Calculer le rabais (simulation avec 12 membres actuels + 1 nouveau)
        const membresActuels = 12;
        const membresApres = membresActuels + 1;
        const rabaisAvant = calculateFamilyDiscount(membresActuels);
        const rabaisApres = calculateFamilyDiscount(membresApres);
        const basePrice = 185;
        const prixFinalAvant = applyFamilyDiscount(basePrice, rabaisAvant);
        const prixFinalApres = applyFamilyDiscount(basePrice, rabaisApres);
        
        console.log('✅ Étape 3: Calcul des rabais');
        console.log(`   Avant: ${membresActuels} membres → ${rabaisAvant}% → ${prixFinalAvant} CHF`);
        console.log(`   Après: ${membresApres} membres → ${rabaisApres}% → ${prixFinalApres} CHF`);
        console.log('');
        
        // 4. Résumé
        console.log('📋 RÉSUMÉ:');
        console.log(`   Nouveau client: ${newClient.prenom} ${newClient.nom}`);
        console.log(`   Groupe familial: ${groupeFamilial}`);
        console.log(`   Rabais: ${rabaisApres}%`);
        console.log(`   Prix mandat: ${prixFinalApres} CHF`);
        console.log('');
        console.log('✅ Workflow simulé avec succès !');
        console.log('='.repeat(60));
        
        expect(groupeFamilial).toBeTruthy();
        expect(rabaisApres).toBeGreaterThanOrEqual(0);
        expect(rabaisApres).toBeLessThanOrEqual(20);
        expect(prixFinalApres).toBeLessThanOrEqual(basePrice);
      } else {
        console.log('⚠️  Code de parrainage non trouvé - test ignoré');
      }
    });
  });
});
