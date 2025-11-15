/**
 * Router tRPC pour la génération de mandats PDF
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateMandatPDF } from "../pdf-generator";
import { storagePut } from "../storage";

export const mandatRouter = router({
  /**
   * Générer le PDF du mandat et l'uploader vers S3
   */
  generateMandat: publicProcedure
    .input(
      z.object({
        mandatNumber: z.string(),
        clientName: z.string(),
        clientEmail: z.string().email(),
        clientAddress: z.string().optional(),
        clientType: z.enum(['particulier', 'entreprise']),
        annualPrice: z.number(),
        isFree: z.boolean(),
        signatureUrl: z.string().url().optional(),
        signatureDate: z.string(), // ISO date
      })
    )
    .mutation(async ({ input }) => {
      // Générer le PDF
      const pdfBuffer = await generateMandatPDF(input);
      
      // Uploader vers S3
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileKey = `mandats/${input.mandatNumber}-${randomSuffix}.pdf`;
      
      const { url } = await storagePut(fileKey, pdfBuffer, 'application/pdf');
      
      return {
        url,
        key: fileKey,
      };
    }),
});
