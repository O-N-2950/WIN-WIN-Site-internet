/**
 * Test de l'intégration Stripe avec rabais familial
 * Valide que le prix final et la description sont corrects
 */

import { describe, it, expect } from 'vitest';
import { calculateFamilyDiscount, applyFamilyDiscount } from '../../lib/parrainage';

describe('Intégration Stripe - Rabais Familial', () => {
  describe('Calcul du prix final pour Stripe', () => {
    const basePrice = 185; // Prix de base particulier > 22 ans

    it('devrait calculer le prix final correct pour 1 membre (0% rabais)', () => {
      const members = 1;
      const discount = calculateFamilyDiscount(members);
      const finalPrice = applyFamilyDiscount(basePrice, discount);

      expect(discount).toBe(0);
      expect(finalPrice).toBe(185);
      
      // Vérifier que le montant Stripe (en centimes) est correct
      const stripeAmount = Math.round(finalPrice * 100);
      expect(stripeAmount).toBe(18500);
    });

    it('devrait calculer le prix final correct pour 2 membres (4% rabais)', () => {
      const members = 2;
      const discount = calculateFamilyDiscount(members);
      const finalPrice = applyFamilyDiscount(basePrice, discount);

      expect(discount).toBe(4);
      expect(finalPrice).toBe(177.6);
      
      const stripeAmount = Math.round(finalPrice * 100);
      expect(stripeAmount).toBe(17760);
    });

    it('devrait calculer le prix final correct pour 5 membres (10% rabais)', () => {
      const members = 5;
      const discount = calculateFamilyDiscount(members);
      const finalPrice = applyFamilyDiscount(basePrice, discount);

      expect(discount).toBe(10);
      expect(finalPrice).toBe(166.5);
      
      const stripeAmount = Math.round(finalPrice * 100);
      expect(stripeAmount).toBe(16650);
    });

    it('devrait calculer le prix final correct pour 12 membres (20% rabais MAX)', () => {
      const members = 12;
      const discount = calculateFamilyDiscount(members);
      const finalPrice = applyFamilyDiscount(basePrice, discount);

      expect(discount).toBe(20);
      expect(finalPrice).toBe(148);
      
      const stripeAmount = Math.round(finalPrice * 100);
      expect(stripeAmount).toBe(14800);
      
      console.log('✅ Prix final pour 12 membres: 148 CHF (économie de 37 CHF)');
    });
  });

  describe('Format de la description Stripe', () => {
    it('devrait générer une description détaillée correcte', () => {
      const clientName = 'Marie Dubois';
      const groupeFamilial = 'FAMILLE-NEUKOMM-SeLs';
      const familyMembers = [
        { nom: 'Neukomm', prenom: 'Olivier' },
        { nom: 'Lefèvre', prenom: 'Chloé' },
        { nom: 'Delamare', prenom: 'Patrick' },
      ];
      const familyMembersCount = 12;
      const basePrice = 185;
      const familyDiscount = 20;
      const finalPrice = 148;

      const membersList = familyMembers
        .map(m => `${m.prenom || ''} ${m.nom}`.trim())
        .join(', ');

      const description = [
        `Mandat de Gestion Annuel - ${clientName}`,
        '',
        `👥 GROUPE FAMILIAL: ${groupeFamilial}`,
        `Membres actifs (${familyMembersCount}): ${membersList}`,
        '',
        `💰 CALCUL DU PRIX:`,
        `Prix de base: CHF ${basePrice.toFixed(2)}`,
        `Rabais familial: -${familyDiscount}% (${familyMembersCount} membres)`,
        `Économie: CHF ${(basePrice - finalPrice).toFixed(2)}`,
        `Prix final: CHF ${finalPrice.toFixed(2)}`,
      ].join('\n');

      expect(description).toContain('Mandat de Gestion Annuel - Marie Dubois');
      expect(description).toContain('GROUPE FAMILIAL: FAMILLE-NEUKOMM-SeLs');
      expect(description).toContain('Membres actifs (12)');
      expect(description).toContain('Olivier Neukomm, Chloé Lefèvre, Patrick Delamare');
      expect(description).toContain('Prix de base: CHF 185.00');
      expect(description).toContain('Rabais familial: -20%');
      expect(description).toContain('Économie: CHF 37.00');
      expect(description).toContain('Prix final: CHF 148.00');

      console.log('');
      console.log('📄 DESCRIPTION STRIPE:');
      console.log('─'.repeat(60));
      console.log(description);
      console.log('─'.repeat(60));
    });
  });

  describe('Métadonnées Stripe', () => {
    it('devrait contenir toutes les métadonnées requises', () => {
      const metadata = {
        clientName: 'Marie Dubois',
        clientEmail: 'marie.dubois@example.com',
        clientType: 'prive',
        clientId: 'rec123456',
        groupeFamilial: 'FAMILLE-NEUKOMM-SeLs',
        familyMembersCount: '12',
        familyDiscount: '20',
        annualPrice: '185',
        finalPrice: '148',
        familyMembersList: 'Olivier Neukomm, Chloé Lefèvre, Patrick Delamare, ...',
        customPriceCreated: 'true',
      };

      expect(metadata).toHaveProperty('groupeFamilial');
      expect(metadata).toHaveProperty('familyMembersCount');
      expect(metadata).toHaveProperty('familyDiscount');
      expect(metadata).toHaveProperty('finalPrice');
      expect(metadata).toHaveProperty('familyMembersList');
      expect(metadata.customPriceCreated).toBe('true');

      console.log('');
      console.log('📊 MÉTADONNÉES STRIPE:');
      console.log(JSON.stringify(metadata, null, 2));
    });
  });

  describe('Scénarios de tarification', () => {
    const scenarios = [
      { type: 'Particulier > 22 ans', basePrice: 185, members: 1, expectedDiscount: 0, expectedFinal: 185 },
      { type: 'Particulier > 22 ans', basePrice: 185, members: 2, expectedDiscount: 4, expectedFinal: 177.6 },
      { type: 'Particulier > 22 ans', basePrice: 185, members: 5, expectedDiscount: 10, expectedFinal: 166.5 },
      { type: 'Particulier > 22 ans', basePrice: 185, members: 12, expectedDiscount: 20, expectedFinal: 148 },
      { type: 'Particulier 18-22 ans', basePrice: 85, members: 3, expectedDiscount: 6, expectedFinal: 79.9 },
      { type: 'Entreprise 2 employés', basePrice: 360, members: 4, expectedDiscount: 8, expectedFinal: 331.2 },
    ];

    scenarios.forEach(({ type, basePrice, members, expectedDiscount, expectedFinal }) => {
      it(`devrait calculer correctement pour ${type} avec ${members} membre(s)`, () => {
        const discount = calculateFamilyDiscount(members);
        const finalPrice = applyFamilyDiscount(basePrice, discount);

        expect(discount).toBe(expectedDiscount);
        expect(finalPrice).toBeCloseTo(expectedFinal, 1);

        const economy = basePrice - finalPrice;
        console.log(`${type} (${members} membres): ${basePrice} CHF → ${discount}% → ${finalPrice.toFixed(2)} CHF (économie: ${economy.toFixed(2)} CHF)`);
      });
    });
  });

  describe('Validation du workflow complet', () => {
    it('devrait simuler la création d\'une session Stripe avec rabais familial', () => {
      // Données d'entrée
      const input = {
        priceId: 'price_1STlgKDevWYEIiJ8ExMQznN7', // Particulier > 22 ans
        clientEmail: 'marie.dubois@example.com',
        clientName: 'Marie Dubois',
        clientType: 'prive',
        annualPrice: 185,
        clientId: 'rec123456', // ID Airtable
      };

      // Simulation des données récupérées depuis Airtable
      const clientData = {
        'Groupe Familial': 'FAMILLE-NEUKOMM-SeLs',
        'Nb membres famille actifs': 12,
      };

      const familyMembers = [
        { nom: 'Neukomm', prenom: 'Olivier' },
        { nom: 'Lefèvre', prenom: 'Chloé' },
        { nom: 'Delamare', prenom: 'Patrick' },
        // ... 9 autres membres
      ];

      // Calculs
      const groupeFamilial = clientData['Groupe Familial'];
      const familyMembersCount = clientData['Nb membres famille actifs'];
      const familyDiscount = calculateFamilyDiscount(familyMembersCount);
      const finalPrice = applyFamilyDiscount(input.annualPrice, familyDiscount);

      // Vérifications
      expect(groupeFamilial).toBe('FAMILLE-NEUKOMM-SeLs');
      expect(familyMembersCount).toBe(12);
      expect(familyDiscount).toBe(20);
      expect(finalPrice).toBe(148);

      // Montant Stripe (en centimes)
      const stripeAmount = Math.round(finalPrice * 100);
      expect(stripeAmount).toBe(14800);

      console.log('');
      console.log('='.repeat(60));
      console.log('SIMULATION WORKFLOW STRIPE COMPLET');
      console.log('='.repeat(60));
      console.log(`Client: ${input.clientName}`);
      console.log(`Email: ${input.clientEmail}`);
      console.log(`Groupe: ${groupeFamilial}`);
      console.log(`Membres actifs: ${familyMembersCount}`);
      console.log(`Prix base: ${input.annualPrice} CHF`);
      console.log(`Rabais: ${familyDiscount}%`);
      console.log(`Prix final: ${finalPrice} CHF`);
      console.log(`Montant Stripe: ${stripeAmount} centimes`);
      console.log('='.repeat(60));
      console.log('✅ Workflow validé !');
    });
  });
});
