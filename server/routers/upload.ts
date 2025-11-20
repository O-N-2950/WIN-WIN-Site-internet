import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { uploadToTmpFiles } from "../tmpfiles-upload";
import { TRPCError } from "@trpc/server";

/**
 * Router pour l'upload de fichiers
 * Utilise tmpfiles.org comme hébergement temporaire
 * Airtable téléchargera ensuite le fichier et le stockera définitivement
 */
export const uploadRouter = router({
  /**
   * Upload un fichier en base64 vers tmpfiles.org
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
        console.log('[Upload File] Début upload:', input.fileName);
        
        // Upload vers tmpfiles.org
        const result = await uploadToTmpFiles(
          input.fileData,
          input.fileName,
          input.fileType
        );

        console.log('[Upload File] ✅ Upload réussi:', result.url);

        return {
          success: true,
          url: result.url,
          fileName: result.fileName,
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
