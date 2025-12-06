import { describe, it, expect } from 'vitest';
import { createLeadInAirtable } from './airtable-crm';

/**
 * Tests d'intégration Airtable CRM
 * 
 * Ces tests vérifient que :
 * - La clé API Airtable est valide
 * - La connexion à la base fonctionne
 * - La création de leads fonctionne correctement
 */

describe('Airtable CRM Integration', () => {
  it('should create a test lead in Airtable', async () => {
    // Données de test
    const testLead = {
      nom: 'Test Lead Vitest',
      email: 'test.vitest@winwin.swiss',
      telephone: '+41 79 999 99 99',
      typeClient: 'Particulier' as const,
      source: 'Formulaire Contact' as const,
      message: 'Ceci est un lead de test créé automatiquement par Vitest pour valider l\'intégration Airtable.',
    };

    // Créer le lead
    const recordId = await createLeadInAirtable(testLead);

    // Vérifications
    expect(recordId).toBeDefined();
    expect(recordId).toMatch(/^rec[a-zA-Z0-9]+$/); // Format Airtable record ID
    expect(recordId.length).toBeGreaterThan(10);

    console.log('✅ Lead de test créé avec succès dans Airtable:', recordId);
    console.log('🔗 Voir dans Airtable: https://airtable.com/appZQkRJ7PwOtdQ3O/tbl7kIZd294RTM1de');
  }, 30000); // Timeout 30s pour l'appel API

  it('should validate Airtable API key format', () => {
    const apiKey = process.env.AIRTABLE_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^pat[a-zA-Z0-9.]+$/); // Format Personal Access Token
    
    console.log('✅ Clé API Airtable valide (format correct)');
  });

  it('should create a lead with RDV information', async () => {
    const testLeadWithRdv = {
      nom: 'Test RDV Vitest',
      email: 'test.rdv@winwin.swiss',
      telephone: '+41 78 888 88 88',
      typeClient: 'Entreprise' as const,
      source: 'Demande RDV' as const,
      message: 'Test de création de lead avec date et heure de RDV.',
      dateRdv: '2025-12-01',
      heureRdv: '14:30',
    };

    const recordId = await createLeadInAirtable(testLeadWithRdv);

    expect(recordId).toBeDefined();
    expect(recordId).toMatch(/^rec[a-zA-Z0-9]+$/);

    console.log('✅ Lead avec RDV créé avec succès:', recordId);
  }, 30000);
});
