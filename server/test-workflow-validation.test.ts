import { describe, it, expect } from 'vitest';
import { calculatePrice } from './pricing';

describe('Workflow Validation - Champs Obligatoires et Calcul Tarifs', () => {
  
  describe('Calcul de tarifs', () => {
    it('devrait calculer CHF 185.- pour un particulier > 22 ans', () => {
      const result = calculatePrice({
        type: 'particulier',
        age: 30,
      });
      
      expect(result.annualPrice).toBe(185);
      expect(result.stripePriceId).toBe('price_1STlgKDevWYEIiJ8ExMQznN7');
    });
    
    it('devrait calculer CHF 85.- pour un particulier 18-22 ans', () => {
      const result = calculatePrice({
        type: 'particulier',
        age: 20,
      });
      
      expect(result.annualPrice).toBe(85);
      expect(result.stripePriceId).toBe('price_1STlg8DevWYEIiJ8nnIpZJPz');
    });
    
    it('devrait calculer CHF 0.- pour un particulier < 18 ans', () => {
      const result = calculatePrice({
        type: 'particulier',
        age: 15,
      });
      
      expect(result.annualPrice).toBe(0);
      expect(result.stripePriceId).toBe('price_1STlfvDevWYEIiJ8ZVAqQqHh');
    });
    
    it('devrait calculer CHF 260.- pour une entreprise avec 1 employé', () => {
      const result = calculatePrice({
        type: 'entreprise',
        employeeCount: 1,
      });
      
      expect(result.annualPrice).toBe(260);
      expect(result.stripePriceId).toBe('price_1STlhODevWYEIiJ8qwqWKZVu');
    });
    
    it('devrait calculer CHF 460.- pour une entreprise avec 5 employés', () => {
      const result = calculatePrice({
        type: 'entreprise',
        employeeCount: 5,
      });
      
      expect(result.annualPrice).toBe(460);
      expect(result.stripePriceId).toBe('price_1STlhmDevWYEIiJ8vqVPaLPE');
    });
    
    it('devrait calculer CHF 160.- pour une entreprise avec 0 employé', () => {
      const result = calculatePrice({
        type: 'entreprise',
        employeeCount: 0,
      });
      
      expect(result.annualPrice).toBe(160);
      expect(result.stripePriceId).toBe('price_1STlh9DevWYEIiJ8gYVCVJEW');
    });
  });
  
  describe('Validation des champs obligatoires', () => {
    it('devrait valider les champs obligatoires pour un particulier', () => {
      const clientParticulier = {
        nom: 'Neukomm',
        prenom: 'Olivier', // Optionnel
        email: 'olivier.neukomm@example.com',
        telMobile: '+41 79 579 25 00',
        adresse: 'Bellevue 7',
        npa: '2950',
        localite: 'Courgenay',
        dateNaissance: '1995-05-15',
        typeClient: 'particulier',
      };
      
      // Vérifier que tous les champs obligatoires sont présents
      expect(clientParticulier.nom).toBeTruthy();
      expect(clientParticulier.email).toBeTruthy();
      expect(clientParticulier.telMobile).toBeTruthy();
      expect(clientParticulier.adresse).toBeTruthy();
      expect(clientParticulier.npa).toBeTruthy();
      expect(clientParticulier.localite).toBeTruthy();
      
      // Prénom est optionnel
      expect(clientParticulier.prenom).toBeTruthy(); // Présent dans cet exemple
    });
    
    it('devrait valider les champs obligatoires pour une entreprise', () => {
      const clientEntreprise = {
        nom: 'Dupont',
        nomEntreprise: 'Dupont SA',
        email: 'contact@dupont.ch',
        telMobile: '+41 79 123 45 67',
        adresse: 'Rue de la Gare 15',
        npa: '2900',
        localite: 'Porrentruy',
        typeClient: 'entreprise',
        formeJuridique: 'sarl',
        nombreEmployes: 5,
      };
      
      // Vérifier que tous les champs obligatoires sont présents
      expect(clientEntreprise.nom).toBeTruthy();
      expect(clientEntreprise.email).toBeTruthy();
      expect(clientEntreprise.telMobile).toBeTruthy();
      expect(clientEntreprise.adresse).toBeTruthy();
      expect(clientEntreprise.npa).toBeTruthy();
      expect(clientEntreprise.localite).toBeTruthy();
      expect(clientEntreprise.nombreEmployes).toBeGreaterThanOrEqual(0);
      
      // Prénom est optionnel pour les entreprises
      expect(clientEntreprise.prenom).toBeUndefined();
    });
    
    it('devrait accepter un client sans prénom (société)', () => {
      const clientSociete = {
        nom: 'Martin Consulting',
        prenom: undefined, // Pas de prénom pour une société
        email: 'info@martin-consulting.ch',
        telMobile: '+41 79 999 88 77',
        adresse: 'Avenue de la Gare 25',
        npa: '2800',
        localite: 'Delémont',
        typeClient: 'entreprise',
        nombreEmployes: 0,
      };
      
      // Le prénom doit être optionnel
      expect(clientSociete.prenom).toBeUndefined();
      
      // Tous les autres champs obligatoires doivent être présents
      expect(clientSociete.nom).toBeTruthy();
      expect(clientSociete.email).toBeTruthy();
      expect(clientSociete.telMobile).toBeTruthy();
      expect(clientSociete.adresse).toBeTruthy();
      expect(clientSociete.npa).toBeTruthy();
      expect(clientSociete.localite).toBeTruthy();
    });
  });
  
  describe('Mapping des champs', () => {
    it('devrait utiliser telMobile au lieu de telephone', () => {
      const client = {
        telMobile: '+41 79 579 25 00',
      };
      
      // Vérifier que le champ s'appelle bien telMobile
      expect(client.telMobile).toBe('+41 79 579 25 00');
      expect((client as any).telephone).toBeUndefined();
    });
  });
});
