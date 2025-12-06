import { describe, it, expect } from 'vitest';
import { parsePolicyDataWithLLM } from './googleVisionLLM';

describe('OCR avec LLM - Extraction de données de polices', () => {
  it('devrait extraire les données d\'une police LAMal avec paiement mensuel', async () => {
    const mockOCRText = `
      ASSURA
      Assurance Maladie de Base LAMal
      
      Police N°: 22.913.008
      Assuré: Jean Dupont
      Date de naissance: 01.01.1980
      
      Prime mensuelle: 350.00 CHF
      Mode de paiement: Mensuel
      
      Début de couverture: 01.01.2025
      Échéance: 31.12.2025
    `;

    const availableCompanies = ['ASSURA', 'AXA', 'Groupe Mutuel', 'Emmental'];
    const availableTypes = ['LAMal', 'LCA', 'RC Privée', 'Protection Juridique'];

    const result = await parsePolicyDataWithLLM(
      mockOCRText,
      availableCompanies,
      availableTypes
    );

    console.log('Résultat extraction LAMal:', result);

    // Vérifications
    expect(result.compagnie).toBe('ASSURA');
    expect(result.typeContrat).toBe('LAMal');
    expect(result.numeroPolice).toBe('22.913.008');
    expect(result.nomAssure).toBe('Jean Dupont');
    expect(result.montantPrime).toBe(350);
    expect(result.frequencePaiement).toBe('Mensuel');
    expect(result.primeAnnuelle).toBe(350 * 12); // 4200 CHF
    expect(result.confidence).toBeGreaterThan(70);
  }, 30000); // Timeout 30s pour l'appel LLM

  it('devrait extraire les données d\'une police RC avec paiement semestriel', async () => {
    const mockOCRText = `
      Emmental Assurance
      Responsabilité Civile Privée
      
      Contrat: 1234
      Titulaire: Marie Martin
      
      Prime semestrielle: 600.- CHF
      Paiement: Semestriel
      
      Valable dès: 15.03.2025
      Valable jusqu'au: 14.03.2026
    `;

    const availableCompanies = ['ASSURA', 'AXA', 'Groupe Mutuel', 'Emmental Assurance'];
    const availableTypes = ['LAMal', 'LCA', 'RC Privée', 'Protection Juridique'];

    const result = await parsePolicyDataWithLLM(
      mockOCRText,
      availableCompanies,
      availableTypes
    );

    console.log('Résultat extraction RC:', result);

    // Vérifications
    expect(result.compagnie).toBe('Emmental Assurance');
    expect(result.typeContrat).toContain('RC');
    expect(result.numeroPolice).toBe('1234');
    expect(result.montantPrime).toBe(600);
    expect(result.frequencePaiement).toBe('Semestriel');
    expect(result.primeAnnuelle).toBe(600 * 2); // 1200 CHF
    expect(result.confidence).toBeGreaterThan(70);
  }, 30000);

  it('devrait gérer un texte OCR incomplet avec faible confiance', async () => {
    const mockOCRText = `
      Texte illisible... quelques mots...
      CHF 500
      2025
    `;

    const result = await parsePolicyDataWithLLM(mockOCRText, [], []);

    console.log('Résultat extraction texte incomplet:', result);

    // Le LLM devrait retourner des données avec faible confiance
    expect(result.confidence).toBeLessThan(50);
  }, 30000);
});
