import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";
import { TRPCError } from "@trpc/server";

/**
 * Router pour l'upload de fichiers vers S3
 */
export const uploadRouter = router({
  /**
   * Upload un fichier en base64 vers S3
   * Retourne l'URL publique du fichier
   */
  uploadFile: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileData: z.string(), // Base64
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Décoder le base64
        const base64Data = input.fileData.split(',')[1] || input.fileData;
        const buffer = Buffer.from(base64Data, 'base64');

        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const extension = input.fileName.split('.').pop();
        const fileKey = `contact-attachments/${timestamp}-${randomSuffix}.${extension}`;

        // Upload vers S3
        const { url } = await storagePut(fileKey, buffer, input.fileType);

        return {
          success: true,
          url,
          fileKey,
        };
      } catch (error) {
        console.error("[Upload File] Erreur:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'upload du fichier. Veuillez réessayer.",
        });
      }
    }),
});
