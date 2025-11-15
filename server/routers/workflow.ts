import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { calculatePrice, getAllPricing } from "../pricing";
import { ENV } from "../_core/env";

/**
 * Router pour le workflow d'onboarding client
 * Gère le calcul des tarifs, la création de sessions Stripe, et l'intégration Airtable
 */
export const workflowRouter = router({
  /**
   * Obtenir toute la grille tarifaire
   */
  getPricing: publicProcedure.query(() => {
    return getAllPricing();
  }),

  /**
   * Calculer le tarif pour un client
   */
  calculatePrice: publicProcedure
    .input(
      z.object({
        type: z.enum(["particulier", "entreprise"]),
        age: z.number().optional(),
        employeeCount: z.number().optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return calculatePrice(input);
    }),

  /**
   * Créer une session Stripe Checkout
   */
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        priceId: z.string(),
        clientEmail: z.string().email(),
        clientName: z.string(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
        metadata: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implémenter avec Stripe SDK
      // const stripe = require('stripe')(ENV.stripeSecretKey);
      
      // const session = await stripe.checkout.sessions.create({
      //   mode: 'subscription',
      //   payment_method_types: ['card'],
      //   line_items: [
      //     {
      //       price: input.priceId,
      //       quantity: 1,
      //     },
      //   ],
      //   customer_email: input.clientEmail,
      //   success_url: input.successUrl,
      //   cancel_url: input.cancelUrl,
      //   metadata: {
      //     clientName: input.clientName,
      //     ...input.metadata,
      //   },
      // });
      
      // return {
      //   sessionId: session.id,
      //   url: session.url,
      // };

      // Simulation pour le moment
      return {
        sessionId: "cs_test_" + Math.random().toString(36).substring(7),
        url: input.successUrl, // Redirection directe pour le moment
      };
    }),

  /**
   * Uploader une signature
   */
  uploadSignature: publicProcedure
    .input(
      z.object({
        signatureDataUrl: z.string(), // Base64 data URL
        clientEmail: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implémenter upload vers S3
      // import { storagePut } from "../storage";
      
      // Convertir data URL en Buffer
      // const base64Data = input.signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
      // const buffer = Buffer.from(base64Data, 'base64');
      
      // const fileKey = `signatures/${input.clientEmail}-${Date.now()}.png`;
      // const { url } = await storagePut(fileKey, buffer, 'image/png');
      
      // return {
      //   url,
      //   key: fileKey,
      // };

      // Simulation pour le moment
      return {
        url: "https://storage.example.com/signatures/signature.png",
        key: `signatures/${input.clientEmail}-${Date.now()}.png`,
      };
    }),

  /**
   * Créer un client dans Airtable (après paiement réussi)
   */
  createClient: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        type: z.enum(["particulier", "entreprise"]),
        age: z.number().optional(),
        employeeCount: z.number().optional(),
        annualPrice: z.number(),
        signatureUrl: z.string().url().optional(),
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Implémenter avec Airtable API
      // const Airtable = require('airtable');
      // const base = new Airtable({ apiKey: ENV.airtableApiKey }).base(ENV.airtableBaseId);
      
      // const record = await base('Clients').create({
      //   'Nom': input.name,
      //   'Email': input.email,
      //   'Téléphone': input.phone,
      //   'Type': input.type,
      //   'Âge': input.age,
      //   'Nombre d\'employés': input.employeeCount,
      //   'Tarif annuel': input.annualPrice,
      //   'Signature': input.signatureUrl ? [{ url: input.signatureUrl }] : undefined,
      //   'Stripe Customer ID': input.stripeCustomerId,
      //   'Stripe Subscription ID': input.stripeSubscriptionId,
      //   'Statut': 'Client sous gestion',
      //   'Date de création': new Date().toISOString(),
      // });
      
      // return {
      //   airtableId: record.id,
      //   mandatNumber: `WW-${new Date().getFullYear()}-${record.id.substring(0, 5)}`,
      // };

      // Simulation pour le moment
      const mandatNumber = `WW-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
      
      return {
        airtableId: "rec" + Math.random().toString(36).substring(7),
        mandatNumber,
      };
    }),

  /**
   * Webhook Stripe (à appeler depuis le webhook endpoint)
   */
  handleStripeWebhook: publicProcedure
    .input(
      z.object({
        event: z.string(),
        sessionId: z.string().optional(),
        customerId: z.string().optional(),
        subscriptionId: z.string().optional(),
        metadata: z.record(z.string(), z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Gérer les événements Stripe
      // switch (input.event) {
      //   case 'checkout.session.completed':
      //     // Créer le client dans Airtable
      //     // Envoyer l'email de bienvenue
      //     // Notifier Olivier
      //     break;
      //   
      //   case 'customer.subscription.deleted':
      //     // Mettre à jour le statut dans Airtable
      //     break;
      //   
      //   case 'invoice.payment_failed':
      //     // Notifier le client et Olivier
      //     break;
      // }
      
      return {
        success: true,
        message: `Événement ${input.event} traité`,
      };
    }),
});
