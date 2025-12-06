import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { uploadToCloudinary } from "../lib/cloudinary-upload";
import { TRPCError } from "@trpc/server";

/**
 * Router pour l'upload de fichiers vers Cloudinary
 */
export const uploadRouter = router({
  /**
   * Upload un fichier en base64 vers Cloudinary
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
        // Générer un nom de fichier unique
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 9);
        const extension = input.fileName.split('.').pop();
        const fileKey = `${timestamp}-${randomSuffix}.${extension}`;

        // Préparer le data URL pour Cloudinary
        const dataUrl = input.fileData.startsWith('data:') 
          ? input.fileData 
          : `data:${input.fileType};base64,${input.fileData}`;

        // Upload vers Cloudinary
        const url = await uploadToCloudinary(dataUrl, fileKey, 'winwin-contact-attachments');

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
