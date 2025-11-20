/**
 * Router tRPC pour la facturation récurrente automatique
 */

import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  processDailyBilling,
  checkBillingEligibility,
  createStripeInvoice,
} from "../lib/billing";
import { listRecords } from "../airtable-crm";

export const billingRouter = router({
  /**
   * Traiter toutes les facturations du jour (CRON quotidien)
   */
  processDailyBilling: protectedProcedure.mutation(async () => {
    const results = await processDailyBilling();
    return results;
  }),

  /**
   * Vérifier l'éligibilité d'un client à la facturation
   */
  checkEligibility: protectedProcedure
    .input(
      z.object({
        clientRecordId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const clients = await listRecords({
        filterByFormula: `RECORD_ID()='${input.clientRecordId}'`,
        maxRecords: 1,
      });

      if (clients.length === 0) {
        throw new Error('Client non trouvé');
      }

      const eligibility = checkBillingEligibility(clients[0] as any);
      return eligibility;
    }),

  /**
   * Créer manuellement une facture pour un client
   */
  createInvoice: protectedProcedure
    .input(
      z.object({
        clientRecordId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const clients = await listRecords({
        filterByFormula: `RECORD_ID()='${input.clientRecordId}'`,
        maxRecords: 1,
      });

      if (clients.length === 0) {
        throw new Error('Client non trouvé');
      }

      const result = await createStripeInvoice(clients[0] as any);
      return result;
    }),

  /**
   * Obtenir un résumé des facturations à venir
   */
  getUpcomingBilling: protectedProcedure.query(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const next7Days = new Date(today);
    next7Days.setDate(next7Days.getDate() + 7);

    // Récupérer tous les clients actifs avec une date de facturation
    const clients = await listRecords({
      filterByFormula: "AND({Statut du client}='Actif', {Date prochaine facturation}!=BLANK())",
    });

    const upcoming = clients.filter((client: any) => {
      const billingDate = new Date(client.fields['Date prochaine facturation']);
      billingDate.setHours(0, 0, 0, 0);
      return billingDate >= today && billingDate <= next7Days;
    });

    return {
      total: upcoming.length,
      clients: upcoming.map((c: any) => ({
        id: c.id,
        name: c.fields['NOM du client'],
        billingDate: c.fields['Date prochaine facturation'],
        amount: c.fields['Tarif applicable mandat de gestion'],
        isFree: c.fields['Mandat offert'] || false,
      })),
    };
  }),
});
