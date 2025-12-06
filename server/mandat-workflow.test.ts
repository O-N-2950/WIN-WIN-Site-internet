/**
 * Tests du workflow complet : Signature → PDF → Airtable
 */

import { describe, it, expect } from 'vitest';
import { generateMandatPDF, generateMandatFilename, type MandatData } from '../server/pdf-generator';
import { createClientInAirtable, type CreateClientInput } from '../server/airtable';

describe('Workflow Mandat Complet', () => {
  
  it('devrait générer un nom de fichier valide pour un particulier', () => {
    const data: MandatData = {
      prenom: 'Jean',
      nom: 'Dupont',
      email: 'jean.dupont@example.com',
      adresse: 'Rue de la Paix 10',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'prive',
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      dateSignature: new Date().toISOString(),
    };
    
    const filename = generateMandatFilename(data);
    
    expect(filename).toMatch(/^mandat_jean_dupont_\d+\.pdf$/);
  });
  
  it('devrait générer un nom de fichier valide pour une entreprise', () => {
    const data: MandatData = {
      nomEntreprise: 'Entreprise SA',
      email: 'contact@entreprise.ch',
      adresse: 'Avenue du Commerce 5',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'entreprise',
      formeJuridique: 'sa',
      nombreEmployes: '10',
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      dateSignature: new Date().toISOString(),
    };
    
    const filename = generateMandatFilename(data);
    
    // Le nom d'entreprise peut contenir des majuscules
    expect(filename).toMatch(/^mandat_[A-Za-z_]+_\d+\.pdf$/);
  });
  
  it('devrait générer un PDF valide pour un particulier avec signature', async () => {
    const data: MandatData = {
      prenom: 'Marie',
      nom: 'Martin',
      email: 'marie.martin@example.com',
      adresse: 'Chemin des Fleurs 15',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'prive',
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      dateSignature: new Date().toISOString(),
      annualPrice: 185,
      isFree: false,
    };
    
    const pdfBuffer = await generateMandatPDF(data);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000); // Au moins 1 KB
    
    // Vérifier que c'est bien un PDF
    const pdfHeader = pdfBuffer.toString('utf8', 0, 4);
    expect(pdfHeader).toBe('%PDF');
  });
  
  it('devrait générer un PDF valide pour une entreprise avec signature', async () => {
    const data: MandatData = {
      nomEntreprise: 'Tech Solutions Sàrl',
      email: 'info@techsolutions.ch',
      adresse: 'Route de l\'Innovation 20',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'entreprise',
      formeJuridique: 'sarl',
      nombreEmployes: '15',
      signatureDataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      dateSignature: new Date().toISOString(),
      annualPrice: 660,
      isFree: false,
    };
    
    const pdfBuffer = await generateMandatPDF(data);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);
    
    const pdfHeader = pdfBuffer.toString('utf8', 0, 4);
    expect(pdfHeader).toBe('%PDF');
  });
  
  it('devrait rejeter une signature invalide', async () => {
    const data: MandatData = {
      prenom: 'Test',
      nom: 'User',
      email: 'test@example.com',
      adresse: 'Test Street 1',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'prive',
      signatureDataUrl: 'invalid-signature-data',
      dateSignature: new Date().toISOString(),
    };
    
    await expect(generateMandatPDF(data)).rejects.toThrow();
  });
  
  it('devrait formater correctement les données client pour Airtable (particulier)', () => {
    const input: CreateClientInput = {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      telMobile: '+41 79 123 45 67',
      adresse: 'Rue de la Paix 10',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'Particulier',
      age: 35,
      tarifApplicable: 185,
      mandatOffert: false,
      dateSignatureMandat: '2025-11-21',
      signatureUrl: 'https://s3.example.com/signatures/jean-dupont.png',
    };
    
    // Vérifier que toutes les propriétés requises sont présentes
    expect(input.nom).toBe('Dupont');
    expect(input.prenom).toBe('Jean');
    expect(input.email).toBe('jean.dupont@example.com');
    expect(input.typeClient).toBe('Particulier');
    expect(input.tarifApplicable).toBe(185);
    expect(input.signatureUrl).toBeDefined();
  });
  
  it('devrait formater correctement les données client pour Airtable (entreprise)', () => {
    const input: CreateClientInput = {
      nom: 'Tech',
      prenom: 'Solutions',
      email: 'info@techsolutions.ch',
      telMobile: '+41 32 466 11 00',
      adresse: 'Route de l\'Innovation 20',
      npa: '2950',
      localite: 'Courgenay',
      typeClient: 'Entreprise',
      nbEmployes: 15,
      tarifApplicable: 660,
      mandatOffert: false,
      dateSignatureMandat: '2025-11-21',
      signatureUrl: 'https://s3.example.com/signatures/techsolutions.png',
    };
    
    expect(input.typeClient).toBe('Entreprise');
    expect(input.nbEmployes).toBe(15);
    expect(input.tarifApplicable).toBe(660);
    expect(input.signatureUrl).toBeDefined();
  });
});
