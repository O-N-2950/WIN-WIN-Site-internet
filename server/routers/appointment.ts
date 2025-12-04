import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { createCalendarEvent, getAuthUrl, getTokenFromCode, type AppointmentData } from "../google-calendar";
import { TRPCError } from "@trpc/server";

/**
 * Router pour la gestion des réservations d'entretiens
 * 
 * Endpoints :
 * - appointment.requestAppointment : Demander un rendez-vous (stocké temporairement)
 * - appointment.getOAuthUrl : Obtenir l'URL d'authentification Google
 * - appointment.confirmAppointment : Confirmer et créer l'événement dans Google Calendar
 */

// Stockage temporaire des demandes de RDV (en attendant OAuth)
// TODO: Remplacer par une table database si besoin de persistance
const pendingAppointments = new Map<string, AppointmentData>();

export const appointmentRouter = router({
  /**
   * Demander un rendez-vous
   * Stocke temporairement la demande et retourne un ID unique
   */
  requestAppointment: publicProcedure
    .input(
      z.object({
        nom: z.string().min(1, "Le nom est requis"),
        email: z.string().email("Email invalide"),
        telephone: z.string().min(1, "Le téléphone est requis"),
        typeClient: z.enum(["particulier", "entreprise", "les-deux"]),
        dateRdv: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
        heureRdv: z.string().regex(/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:MM)"),
        message: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Créer le lead dans Airtable
        const { createLeadInAirtable } = await import("../airtable-crm");
        
        const recordId = await createLeadInAirtable({
          nom: input.nom,
          email: input.email,
          telephone: input.telephone,
          typeClient: input.typeClient === "particulier" ? "Particulier" : 
                      input.typeClient === "entreprise" ? "Entreprise" : "Les deux",
          source: "Demande RDV",
          message: input.message,
          dateRdv: input.dateRdv,
          heureRdv: input.heureRdv,
        });

        // Générer un ID unique pour cette demande
        const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Stocker temporairement
        pendingAppointments.set(appointmentId, input);
        
        // Nettoyer après 1 heure (timeout)
        setTimeout(() => {
          pendingAppointments.delete(appointmentId);
        }, 60 * 60 * 1000);

        return {
          success: true,
          appointmentId,
          recordId,
          message: "Demande de rendez-vous enregistrée. Redirection vers l'authentification Google...",
        };
      } catch (error) {
        console.error("[Request Appointment] Erreur:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'enregistrement du rendez-vous. Veuillez réessayer.",
        });
      }
    }),

  /**
   * Obtenir l'URL d'authentification OAuth Google
   * L'utilisateur sera redirigé vers cette URL pour autoriser l'accès à son calendrier
   */
  getOAuthUrl: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),
      })
    )
    .query(({ input }) => {
      // Vérifier que la demande existe
      if (!pendingAppointments.has(input.appointmentId)) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Demande de rendez-vous introuvable ou expirée",
        });
      }

      // Générer l'URL OAuth avec le state contenant l'appointmentId
      const authUrl = getAuthUrl();
      const urlWithState = `${authUrl}&state=${input.appointmentId}`;

      return {
        authUrl: urlWithState,
      };
    }),

  /**
   * Confirmer le rendez-vous et créer l'événement dans Google Calendar
   * Appelé après le retour du callback OAuth
   */
  confirmAppointment: publicProcedure
    .input(
      z.object({
        appointmentId: z.string(),
        code: z.string(), // Code d'autorisation OAuth
      })
    )
    .mutation(async ({ input }) => {
      // Récupérer les données de la demande
      const appointmentData = pendingAppointments.get(input.appointmentId);
      
      if (!appointmentData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Demande de rendez-vous introuvable ou expirée",
        });
      }

      try {
        // Échanger le code contre un token d'accès
        const tokens = await getTokenFromCode(input.code);
        
        if (!tokens.access_token) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Impossible d'obtenir le token d'accès",
          });
        }

        // Sauvegarder les tokens d'Olivier (première fois)
        const { saveGoogleTokens } = await import('../google-calendar-tokens');
        await saveGoogleTokens({
          access_token: tokens.access_token!,
          refresh_token: tokens.refresh_token!,
          scope: tokens.scope!,
          token_type: tokens.token_type!,
          expiry_date: tokens.expiry_date!,
        });
        
        // Créer l'événement dans Google Calendar
        const result = await createCalendarEvent(appointmentData);

        // Nettoyer la demande temporaire
        pendingAppointments.delete(input.appointmentId);

        return {
          success: true,
          eventId: result.eventId,
          eventLink: result.eventLink,
          meetLink: result.meetLink,
          message: "Rendez-vous confirmé ! Vous recevrez une invitation par email.",
        };
      } catch (error) {
        console.error("[Appointment] Erreur confirmation:", error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Erreur lors de la création du rendez-vous: ${errorMessage}`,
        });
      }
    }),

  /**
   * Envoyer une demande de contact simple (sans Google Calendar)
   * Pour les clients qui préfèrent être recontactés
   */
  sendContactRequest: publicProcedure
    .input(
      z.object({
        nom: z.string().min(1),
        email: z.string().email(),
        telephone: z.string().min(1, "Le téléphone est requis"),
        typeClient: z.enum(["particulier", "entreprise", "les-deux"]),
        message: z.string().min(1, "Le message est requis"),
        attachmentUrl: z.union([z.string().url(), z.undefined()]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Créer le lead dans Airtable
        const { createLeadInAirtable } = await import("../airtable-crm");
        
        const recordId = await createLeadInAirtable({
          nom: input.nom,
          email: input.email,
          telephone: input.telephone || "",
          typeClient: input.typeClient === "particulier" ? "Particulier" : 
                      input.typeClient === "entreprise" ? "Entreprise" : "Les deux",
          source: "Formulaire Contact",
          message: input.message,
          attachmentUrl: input.attachmentUrl,
        });

        return {
          success: true,
          message: "Votre message a été envoyé. Nous vous recontacterons sous 24h.",
          recordId,
        };
      } catch (error) {
        console.error("[Contact Request] Erreur:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de l'envoi du message. Veuillez réessayer.",
        });
      }
    }),
});
