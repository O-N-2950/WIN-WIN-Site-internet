/**
 * Tests pour le générateur PDF de mandat
 */

import { describe, it, expect } from 'vitest';
import { generateMandatPDF, generateMandatFilename, type MandatData } from './pdf-generator';
import { writeFileSync } from 'fs';
import { join } from 'path';

describe('PDF Generator', () => {
  // Signature Canvas simulée (1x1 pixel PNG transparent en base64)
  const mockSignatureDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

  describe('generateMandatFilename', () => {
    it('devrait générer un nom de fichier pour un client particulier', () => {
      const data: MandatData = {
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        adresse: 'Rue de la Paix 1',
        npa: '2950',
        localite: 'Courgenay',
        typeClient: 'prive',
        signatureDataUrl: mockSignatureDataUrl,
        dateSignature: new Date().toISOString(),
      };

      const filename = generateMandatFilename(data);
      expect(filename).toMatch(/^mandat_jean_dupont_\d+\.pdf$/);
    });

    it('devrait générer un nom de fichier pour une entreprise', () => {
      const data: MandatData = {
        nomEntreprise: 'Acme SA',
        email: 'contact@acme.ch',
        adresse: 'Avenue du Commerce 10',
        npa: '1000',
        localite: 'Lausanne',
        typeClient: 'entreprise',
        formeJuridique: 'sa',
        nombreEmployes: '25',
        signatureDataUrl: mockSignatureDataUrl,
        dateSignature: new Date().toISOString(),
      };

      const filename = generateMandatFilename(data);
      expect(filename).toMatch(/^mandat_[a-zA-Z_]+_\d+\.pdf$/);
      expect(filename.toLowerCase()).toContain('acme');
    });
  });

  describe('generateMandatPDF', () => {
    it('devrait générer un PDF pour un client particulier', async () => {
      const data: MandatData = {
        prenom: 'Marie',
        nom: 'Martin',
        email: 'marie.martin@example.com',
        adresse: 'Chemin des Fleurs 5',
        npa: '2900',
        localite: 'Porrentruy',
        typeClient: 'prive',
        signatureDataUrl: mockSignatureDataUrl,
        dateSignature: new Date().toISOString(),
      };

      const pdfBuffer = await generateMandatPDF(data);

      // Vérifier que le PDF est généré
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);

      // Vérifier que c'est bien un PDF (commence par %PDF)
      const pdfHeader = pdfBuffer.toString('utf-8', 0, 4);
      expect(pdfHeader).toBe('%PDF');

      // Sauvegarder pour inspection manuelle (optionnel)
      const outputPath = join(__dirname, '../test-output/mandat-test-particulier.pdf');
      writeFileSync(outputPath, pdfBuffer);
      console.log(`PDF de test généré: ${outputPath}`);
    }, 10000); // Timeout de 10s pour la génération

    it('devrait générer un PDF pour une entreprise', async () => {
      const data: MandatData = {
        nomEntreprise: 'Tech Solutions Sàrl',
        email: 'info@techsolutions.ch',
        adresse: 'Route de l\'Innovation 42',
        npa: '1700',
        localite: 'Fribourg',
        typeClient: 'entreprise',
        formeJuridique: 'sarl',
        nombreEmployes: '12',
        signatureDataUrl: mockSignatureDataUrl,
        dateSignature: new Date().toISOString(),
      };

      const pdfBuffer = await generateMandatPDF(data);

      // Vérifier que le PDF est généré
      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);

      // Vérifier que c'est bien un PDF
      const pdfHeader = pdfBuffer.toString('utf-8', 0, 4);
      expect(pdfHeader).toBe('%PDF');

      // Sauvegarder pour inspection manuelle
      const outputPath = join(__dirname, '../test-output/mandat-test-entreprise.pdf');
      writeFileSync(outputPath, pdfBuffer);
      console.log(`PDF de test généré: ${outputPath}`);
    }, 10000);

    it('devrait gérer les erreurs de signature invalide', async () => {
      const data: MandatData = {
        prenom: 'Test',
        nom: 'Error',
        email: 'test@example.com',
        adresse: 'Test Street 1',
        npa: '1000',
        localite: 'Test',
        typeClient: 'prive',
        signatureDataUrl: 'invalid-data-url',
        dateSignature: new Date().toISOString(),
      };

      await expect(generateMandatPDF(data)).rejects.toThrow();
    });
  });
});
