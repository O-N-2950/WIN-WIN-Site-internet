import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { createLeadInAirtable } from "../airtable-crm";
import { uploadToCloudinary, isCloudinaryConfigured } from "../lib/cloudinary-upload";

export const contactRouter = router({
  sendMessage: publicProcedure
    .input(
      z.object({
        nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        email: z.string().email("Email invalide"),
        telephone: z.string().optional(),
        sujet: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
        message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
        attachmentUrl: z.string().url().optional(),
        attachmentFilename: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 1. Créer le lead dans Airtable
        const leadData = {
          email: input.email,
          nom: input.nom,
          telephone: input.telephone || "",
          typeClient: "Particulier" as const,
          source: "Formulaire Contact" as const,
          message: `Sujet: ${input.sujet}\n\nMessage:\n${input.message}`,
          attachmentUrl: input.attachmentUrl,
        };

        await createLeadInAirtable(leadData);

        // Note: sendOwnerNotificationEmail nécessite 6 paramètres spécifiques pour les mandats
        // Pour un simple message de contact, on ne l'utilise pas
        // L'email sera envoyé via Airtable automation ou manuellement

        return {
          success: true,
          message: "Message envoyé avec succès",
        };
      } catch (error) {
        console.error("[Contact] Erreur lors de l'envoi du message:", error);
        throw new Error("Erreur lors de l'envoi du message. Veuillez réessayer.");
      }
    }),

  /**
   * Upload d'une pièce jointe vers Cloudinary
   * Remplaçant de tmpfiles.org qui est bloqué par les adblockers
   */
  uploadAttachment: publicProcedure
    .input(
      z.object({
        base64Data: z.string(),
        filename: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Vérifier que Cloudinary est configuré
        if (!isCloudinaryConfigured()) {
          throw new Error(
            "Cloudinary n'est pas configuré. Veuillez configurer CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY et CLOUDINARY_API_SECRET dans Railway."
          );
        }

        // Upload vers Cloudinary
        const url = await uploadToCloudinary(
          input.base64Data,
          input.filename,
          'winwin-contact-attachments'
        );

        return {
          success: true,
          url,
          filename: input.filename,
        };
      } catch (error) {
        console.error("[Contact] Erreur lors de l'upload du fichier:", error);
        throw new Error(
          `Erreur lors de l'upload du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        );
      }
    }),
});
