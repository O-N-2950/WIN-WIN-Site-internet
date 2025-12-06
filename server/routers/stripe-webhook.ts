import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { processStripeWebhook } from "../lib/stripe-webhooks";

export const stripeWebhookRouter = router({
  testWebhook: publicProcedure
    .input(
      z.object({
        eventType: z.enum([
          "invoice.payment_succeeded",
          "invoice.payment_failed",
          "invoice.payment_action_required",
          "customer.subscription.past_due",
        ]),
        customerEmail: z.string().email(),
        amount: z.number().positive(),
      })
    )
    .mutation(async ({ input }) => {
      const mockEvent = {
        id: `evt_test_${Date.now()}`,
        type: input.eventType,
        data: {
          object: {
            id: `in_test_${Date.now()}`,
            customer_email: input.customerEmail,
            amount_paid: input.amount * 100,
            amount_due: input.amount * 100,
            customer: "cus_test_123",
          },
        },
      } as any;

      const result = await processStripeWebhook(mockEvent);

      return {
        success: result.success,
        message: result.message,
        event: result.event,
      };
    }),

  getPaymentHistory: publicProcedure
    .input(
      z.object({
        clientEmail: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      // TODO: Implémenter la recherche de client dans Airtable
      // Pour l'instant, retourner un résultat vide
      return {
        found: false,
        client: null,
      };
    }),
});
