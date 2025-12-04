/**
 * Router tRPC pour le système de parrainage et facturation automatique
 * WIN WIN Finance Group
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  validateReferralCode,
  getFamilyMembers,
  calculateFamilyDiscount,
  applyFamilyDiscount,
} from "../lib/parrainage";
import { processDailyBilling } from "../lib/billing";

export const parrainageRouter = router({
  /**
   * Valider un code de parrainage
   */
  validateCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Code de parrainage requis"),
      })
    )
    .mutation(async ({ input }) => {
      const referrer = await validateReferralCode(input.code);

      if (!referrer) {
        return {
          valid: false,
          referrer: null,
        };
      }

      return {
        valid: true,
        referrer: {
          nom: referrer.nom,
          prenom: referrer.prenom,
          lienParente: referrer.lienParente,
        },
      };
    }),

  /**
   * Calculer le rabais familial pour un nombre de membres donné
   */
  calculateDiscount: publicProcedure
    .input(
      z.object({
        familyMembersCount: z.number().int().min(1),
      })
    )
    .query(({ input }) => {
      const discountPercent = calculateFamilyDiscount(input.familyMembersCount);

      return {
        familyMembersCount: input.familyMembersCount,
        discountPercent,
      };
    }),

  /**
   * Récupérer les membres de la famille d'un client
   */
  getFamilyMembers: publicProcedure
    .input(
      z.object({
        groupeFamilial: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const members = await getFamilyMembers(input.groupeFamilial);

      return {
        groupeFamilial: input.groupeFamilial,
        membersCount: members.length,
        members: members.map(m => ({
          nom: m.nom,
          prenom: m.prenom,
          lienParente: m.lienParente,
        })),
        discountPercent: calculateFamilyDiscount(members.length),
      };
    }),

  /**
   * Calculer le prix final après application du rabais familial
   */
  calculateFinalPrice: publicProcedure
    .input(
      z.object({
        basePrice: z.number().positive(),
        familyMembersCount: z.number().int().min(1),
      })
    )
    .query(({ input }) => {
      const discountPercent = calculateFamilyDiscount(input.familyMembersCount);
      const finalPrice = applyFamilyDiscount(input.basePrice, discountPercent);

      return {
        basePrice: input.basePrice,
        discountPercent,
        discountAmount: input.basePrice - finalPrice,
        finalPrice,
      };
    }),

  /**
   * Déclencher la facturation quotidienne (endpoint admin)
   * Cette fonction doit normalement être appelée par un cron job
   */
  processDailyBilling: protectedProcedure
    .mutation(async () => {
      const result = await processDailyBilling();

      return result;
    }),

  /**
   * Demander un code de parrainage (pour clients existants)
   * Envoie un email à Olivier avec les informations du client
   */
  requestCode: publicProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "Prénom requis"),
        lastName: z.string().min(1, "Nom requis"),
        email: z.string().email("Email invalide"),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Envoyer un email à Olivier avec les informations du client
      // Pour l'instant, on simule l'envoi
      console.log("[Parrainage] Demande de code reçue:", input);

      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: "Demande envoyée avec succès. Vous recevrez votre code par email sous 48h.",
      };
    }),
});
