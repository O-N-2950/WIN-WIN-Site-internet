/**
 * Router tRPC pour le système de parrainage familial
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  validateReferralCode,
  calculateFamilyDiscount,
  generateFamilyId,
  getFamilyMembers,
  updateFamilyDiscounts,
  type LienParente,
} from "../lib/parrainage";

export const parrainageRouter = router({
  /**
   * Valider un code de parrainage
   */
  validateCode: publicProcedure
    .input(
      z.object({
        code: z.string().min(1, "Le code de parrainage est requis"),
      })
    )
    .mutation(async ({ input }) => {
      const result = await validateReferralCode(input.code);
      return result;
    }),

  /**
   * Calculer le rabais familial
   */
  calculateDiscount: publicProcedure
    .input(
      z.object({
        nombreMembres: z.number().int().min(1),
        prixBase: z.number().optional(),
      })
    )
    .query(({ input }) => {
      return calculateFamilyDiscount(input.nombreMembres, input.prixBase);
    }),

  /**
   * Récupérer les membres d'un groupe familial
   */
  getFamilyMembers: publicProcedure
    .input(
      z.object({
        codeGroupeFamilial: z.string(),
      })
    )
    .query(async ({ input }) => {
      const members = await getFamilyMembers(input.codeGroupeFamilial);
      return members;
    }),

  /**
   * Mettre à jour les rabais d'un groupe familial
   * (appelé automatiquement après ajout d'un membre)
   */
  updateFamilyDiscounts: publicProcedure
    .input(
      z.object({
        codeGroupeFamilial: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await updateFamilyDiscounts(input.codeGroupeFamilial);
      return { success: true };
    }),
});
