/**
 * Router tRPC pour la génération de mandats PDF
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateMandatPDF, generateMandatFilename } from "../pdf-generator";
import { storagePut } from "../storage";

export const mandatRouter = router({
  /**
   * Générer le PDF du mandat et l'uploader vers S3
   * Utilise les données complètes du questionnaire et la signature Canvas
   */
  generateMandat: publicProcedure
    .input(
      z.object({
        // Informations client
        prenom: z.string().optional(),
        nom: z.string().optional(),
        nomEntreprise: z.string().optional(),
        email: z.string().email(),
        adresse: z.string(),
        npa: z.string(),
        localite: z.string(),
        
        // Informations entreprise (optionnel)
        formeJuridique: z.enum(['entreprise_individuelle', 'sarl', 'sa', 'autre']).optional(),
        nombreEmployes: z.string().optional(),
        
        // Type de client
        typeClient: z.enum(['prive', 'entreprise', 'les_deux']),
        
        // Signature (Canvas data URL)
        signatureDataUrl: z.string(), // Base64 data URL de la signature Canvas
        dateSignature: z.string(), // Format ISO
        
        // Informations de paiement (optionnel)
        mandatNumber: z.string().optional(),
        annualPrice: z.number().optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Générer le PDF avec le template officiel
        const pdfBuffer = await generateMandatPDF(input);
        
        // Générer un nom de fichier unique
        const filename = generateMandatFilename(input);
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `mandats/${filename.replace('.pdf', '')}-${randomSuffix}.pdf`;
        
        // Uploader vers S3
        const { url } = await storagePut(fileKey, pdfBuffer, 'application/pdf');
        
        console.log(`[Mandat] PDF généré et uploadé: ${url}`);
        
        return {
          url,
          key: fileKey,
          filename,
        };
      } catch (error) {
        console.error('[Mandat Router] Erreur lors de la génération du mandat:', error);
        throw new Error(`Échec de la génération du mandat: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }),
});
