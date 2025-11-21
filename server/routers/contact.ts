import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { createLeadInAirtable } from "../airtable-crm";

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

  uploadFile: publicProcedure
    .input(
      z.object({
        file: z.instanceof(File),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Upload vers tmpfiles.org
        const formData = new FormData();
        formData.append("file", input.file);

        const response = await fetch("https://tmpfiles.org/api/v1/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'upload du fichier");
        }

        const data = await response.json();
        
        // tmpfiles.org retourne une URL du type: https://tmpfiles.org/123456
        // Il faut la transformer en: https://tmpfiles.org/dl/123456
        const fileUrl = data.data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");

        return {
          success: true,
          url: fileUrl,
          filename: input.file.name,
        };
      } catch (error) {
        console.error("[Contact] Erreur lors de l'upload du fichier:", error);
        throw new Error("Erreur lors de l'upload du fichier. Veuillez réessayer.");
      }
    }),
});
