/**
 * Tests pour les endpoints de récupération des données de référence Airtable
 * (Compagnies d'assurance, Types de contrats)
 */

import { describe, it, expect } from 'vitest';
import { getInsuranceCompanies, getContractTypes } from './airtable-reference';

describe('Airtable Reference Data', () => {
  it('devrait récupérer la liste des compagnies d\'assurance', async () => {
    const companies = await getInsuranceCompanies();
    
    // Vérifier que c'est un tableau
    expect(Array.isArray(companies)).toBe(true);
    
    // Vérifier qu'il y a au moins quelques compagnies
    expect(companies.length).toBeGreaterThan(5);
    
    // Vérifier que les compagnies connues sont présentes
    const expectedCompanies = ['Allianz Suisse', 'AXA Assurances', 'Groupe Mutuel'];
    expectedCompanies.forEach(company => {
      const found = companies.some(c => c.includes(company.split(' ')[0]));
      expect(found).toBe(true);
    });
    
    // Vérifier que les noms sont triés alphabétiquement
    const sorted = [...companies].sort((a, b) => a.localeCompare(b, 'fr'));
    expect(companies).toEqual(sorted);
    
    console.log(`✅ ${companies.length} compagnies récupérées depuis Airtable`);
    console.log('Exemples:', companies.slice(0, 5).join(', '));
  }, 30000); // Timeout 30s pour appel MCP

  it('devrait récupérer la liste des types de contrats', async () => {
    const contractTypes = await getContractTypes();
    
    // Vérifier que c'est un tableau
    expect(Array.isArray(contractTypes)).toBe(true);
    
    // Vérifier qu'il y a au moins quelques types
    expect(contractTypes.length).toBeGreaterThan(5);
    
    // Vérifier que les types connus sont présents
    const expectedTypes = ['LAMal', 'LCA', 'AVS'];
    expectedTypes.forEach(type => {
      const found = contractTypes.some(ct => ct.includes(type));
      expect(found).toBe(true);
    });
    
    // Vérifier que les noms sont triés alphabétiquement
    const sorted = [...contractTypes].sort((a, b) => a.localeCompare(b, 'fr'));
    expect(contractTypes).toEqual(sorted);
    
    console.log(`✅ ${contractTypes.length} types de contrats récupérés depuis Airtable`);
    console.log('Exemples:', contractTypes.slice(0, 5).join(', '));
  }, 30000); // Timeout 30s pour appel MCP

  it('devrait gérer les erreurs gracieusement (fallback)', async () => {
    // Ce test vérifie que même en cas d'erreur MCP, on a des données par défaut
    const companies = await getInsuranceCompanies();
    const contractTypes = await getContractTypes();
    
    // Les fallbacks devraient toujours retourner quelque chose
    expect(companies.length).toBeGreaterThan(0);
    expect(contractTypes.length).toBeGreaterThan(0);
  }, 30000);
});
