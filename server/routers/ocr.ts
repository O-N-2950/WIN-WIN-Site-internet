import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { analyzePolicyDocument, type ExtractedPolicyData } from "../_core/googleVision";

/**
 * Router tRPC pour l'OCR Google Cloud Vision
 * 
 * Permet au frontend d'analyser des polices d'assurance uploadées
 */
export const ocrRouter = router({
  /**
   * Analyser un document de police d'assurance
   * 
   * @param fileUrl - URL du fichier PDF/image à analyser (S3, HTTP, etc.)
   * @returns Données extraites de la police
   */
  analyzeDocument: publicProcedure
    .input(
      z.object({
        fileUrl: z.string().url("L'URL du fichier est invalide"),
      })
    )
    .mutation(async ({ input }): Promise<ExtractedPolicyData> => {
      console.log('[OCR Router] Analyse demandée pour:', input.fileUrl);
      
      try {
        const policyData = await analyzePolicyDocument(input.fileUrl);
        
        console.log('[OCR Router] Analyse réussie:', {
          compagnie: policyData.compagnie,
          confidence: `${policyData.confidence}%`,
        });
        
        return policyData;
      } catch (error) {
        console.error('[OCR Router] Erreur lors de l\'analyse:', error);
        throw new Error(
          `Impossible d'analyser le document: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        );
      }
    }),
});
