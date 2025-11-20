import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { 
  validateCodeParrainage, 
  addClientToFamily, 
  createNewFamily,
  calculatePrixMandat,
  calculateRabaisFamille,
  recalculateFamilyDiscount
} from "../parrainage";
import { calculatePrice, getAllPricing } from "../pricing";
import { generateMandatPDF, addSignatureToPDF, type ClientData } from "../pdfGenerator";

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
        clientType: z.enum(['particulier', 'entreprise']),
        clientAge: z.number().optional(),
        clientEmployeeCount: z.number().optional(),
        annualPrice: z.number(),
        isFree: z.boolean().optional(),
        signatureUrl: z.string().url().optional(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
        codeParrainage: z.string().optional(), // Code parrainage famille
        lienParente: z.string().optional(), // Lien de parenté (Conjoint, Fils, Fille, etc.)
        nombreMembresFamille: z.number().optional(), // Nombre de membres dans la famille (pour calcul rabais)
      })
    )
    .mutation(async ({ input, ctx }) => {
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(ENV.stripeSecretKey, {
        apiVersion: '2025-10-29.clover',
      });
      
      // Calculer le prix ajusté selon le rabais famille
      let prixAjuste = input.annualPrice;
      let rabaisFamille = 0;
      
      if (input.nombreMembresFamille && input.nombreMembresFamille > 0) {
        rabaisFamille = calculateRabaisFamille(input.nombreMembresFamille);
        prixAjuste = calculatePrixMandat(input.nombreMembresFamille);
        console.log(`[Workflow] Rabais famille: ${rabaisFamille}% → Prix: ${prixAjuste} CHF`);
      }
      
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: input.priceId,
            quantity: 1,
          },
        ],
        customer_email: input.clientEmail,
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: {
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientType: input.clientType,
          clientAge: input.clientAge?.toString() || '',
          clientEmployeeCount: input.clientEmployeeCount?.toString() || '',
          annualPrice: prixAjuste.toString(),
          annualPriceOriginal: input.annualPrice.toString(),
          rabaisFamille: rabaisFamille.toString(),
          nombreMembresFamille: input.nombreMembresFamille?.toString() || '1',
          isFree: input.isFree ? 'true' : 'false',
          signatureUrl: input.signatureUrl || '',
          codeParrainage: input.codeParrainage || '',
          lienParente: input.lienParente || '',
        },
      });
      
      return {
        sessionId: session.id,
        url: session.url,
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
      const { storagePut } = await import('../storage');
      
      // Convertir data URL en Buffer
      const base64Data = input.signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Générer une clé unique pour éviter l'énumération
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const fileKey = `signatures/${input.clientEmail.replace('@', '-at-')}-${Date.now()}-${randomSuffix}.png`;
      
      const { url } = await storagePut(fileKey, buffer, 'image/png');
      
      return {
        url,
        key: fileKey,
      };
    }),

  /**
   * Créer un client dans Airtable (après paiement réussi)
   */
  createClient: publicProcedure
    .input(
      z.object({
        nom: z.string(),
        prenom: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        type: z.enum(["particulier", "entreprise"]),
        age: z.number().optional(),
        employeeCount: z.number().optional(),
        annualPrice: z.number(),
        isFree: z.boolean().optional(),
        signatureUrl: z.string().url().optional(),
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { createClientInAirtable } = await import('../airtable');
      
      // Créer le client dans Airtable via MCP
      const record = await createClientInAirtable({
        nom: input.nom,
        prenom: input.prenom,
        email: input.email,
        telMobile: input.phone,
        typeClient: input.type === 'particulier' ? 'Particulier' : 'Entreprise',
        age: input.age,
        nbEmployes: input.employeeCount,
        tarifApplicable: input.annualPrice,
        mandatOffert: input.isFree || false,
        dateSignatureMandat: new Date().toISOString().split('T')[0],
      });
      
      // Générer le numéro de mandat
      const mandatNumber = `WW-${new Date().getFullYear()}-${record.id.substring(3, 8).toUpperCase()}`;
      
      return {
        airtableId: record.id,
        mandatNumber,
      };
    }),

  /**
   * Générer le PDF du mandat pré-rempli avec les données du client
   */
  generateMandatPDF: publicProcedure
    .input(
      z.object({
        nom: z.string(),
        prenom: z.string(),
        adresse: z.string(),
        npa: z.string(),
        localite: z.string(),
        telephone: z.string().optional(),
        email: z.string().email().optional(),
        dateNaissance: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const clientData: ClientData = {
        nom: input.nom,
        prenom: input.prenom,
        adresse: input.adresse,
        npa: input.npa,
        localite: input.localite,
        telephone: input.telephone,
        email: input.email,
        dateNaissance: input.dateNaissance,
      };
      
      const pdfBuffer = await generateMandatPDF(clientData);
      
      // Convertir le buffer en base64 pour l'envoyer au client
      const base64Pdf = pdfBuffer.toString('base64');
      
      return {
        pdfBase64: base64Pdf,
        filename: `Mandat_${input.nom}_${input.prenom}.pdf`,
      };
    }),

  /**
   * Ajouter la signature au PDF du mandat
   */
  addSignatureToPDF: publicProcedure
    .input(
      z.object({
        pdfBase64: z.string(),
        signatureDataUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const pdfBuffer = Buffer.from(input.pdfBase64, 'base64');
      const signedPdfBuffer = await addSignatureToPDF(pdfBuffer, input.signatureDataUrl);
      
      // Convertir le buffer en base64
      const base64SignedPdf = signedPdfBuffer.toString('base64');
      
      return {
        pdfBase64: base64SignedPdf,
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
