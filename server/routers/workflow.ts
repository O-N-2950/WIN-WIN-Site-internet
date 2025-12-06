import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { calculatePrice, getAllPricing } from "../pricing";
import { ENV } from "../_core/env";
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
        type: z.enum(["prive", "entreprise"]),
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
        clientType: z.enum(['prive', 'entreprise']),
        clientAge: z.number().optional(),
        clientEmployeeCount: z.number().optional(),
        annualPrice: z.number(),
        isFree: z.boolean().optional(),
        signatureUrl: z.string().url().optional(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
        clientId: z.string().optional(), // Airtable Record ID pour récupérer le groupe familial
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que la clé Stripe est configurée
      if (!ENV.stripeSecretKey || ENV.stripeSecretKey === '') {
        console.error('[Stripe Checkout] ERREUR: STRIPE_SECRET_KEY non configurée');
        throw new Error('Configuration Stripe manquante. Veuillez contacter le support.');
      }
      
      const Stripe = (await import('stripe')).default;
      const stripe = new Stripe(ENV.stripeSecretKey, {
        apiVersion: '2025-10-29.clover',
      });
      
      // Calculer le rabais familial si clientId est fourni
      let familyDiscount = 0;
      let familyMembersCount = 1;
      let groupeFamilial: string | undefined;
      let finalPrice = input.annualPrice;
      let familyMembers: Array<{ nom: string; prenom?: string }> = [];
      let descriptionDetaillée = '';
      
      if (input.clientId) {
        try {
          const { getClientById } = await import('../airtable');
          const { calculateFamilyDiscount, applyFamilyDiscount, getFamilyMembers } = await import('../lib/parrainage');
          
          const clientData = await getClientById(input.clientId);
          
          if (clientData && clientData['Groupe Familial']) {
            groupeFamilial = clientData['Groupe Familial'] as string;
            familyMembersCount = (clientData['Nb membres famille actifs'] as number) || 1;
            
            // Récupérer la liste des membres du groupe
            familyMembers = await getFamilyMembers(groupeFamilial);
            
            // Calculer le rabais
            familyDiscount = calculateFamilyDiscount(familyMembersCount);
            finalPrice = applyFamilyDiscount(input.annualPrice, familyDiscount);
            
            // Construire la description détaillée pour la facture Stripe
            const membersList = familyMembers
              .map(m => `${m.prenom || ''} ${m.nom}`.trim())
              .join(', ');
            
            descriptionDetaillée = [
              `Mandat de Gestion Annuel - ${input.clientName}`,
              '',
              `👥 GROUPE FAMILIAL: ${groupeFamilial}`,
              `Membres actifs (${familyMembersCount}): ${membersList}`,
              '',
              `💰 CALCUL DU PRIX:`,
              `Prix de base: CHF ${input.annualPrice.toFixed(2)}`,
              `Rabais familial: -${familyDiscount}% (${familyMembersCount} membres)`,
              `Économie: CHF ${(input.annualPrice - finalPrice).toFixed(2)}`,
              `Prix final: CHF ${finalPrice.toFixed(2)}`,
            ].join('\n');
            
            console.log('[Stripe Checkout] Rabais familial appliqué:');
            console.log(`  Groupe: ${groupeFamilial}`);
            console.log(`  Membres actifs: ${familyMembersCount}`);
            console.log(`  Liste: ${membersList}`);
            console.log(`  Rabais: ${familyDiscount}%`);
            console.log(`  Prix base: ${input.annualPrice} CHF`);
            console.log(`  Prix final: ${finalPrice} CHF`);
          }
        } catch (error) {
          console.error('[Stripe Checkout] Erreur calcul rabais familial:', error);
          // Continuer sans rabais en cas d'erreur
        }
      }
      
      // Créer un Price ID dynamique avec le prix final si rabais familial > 0
      let priceIdToUse = input.priceId;
      let customPriceCreated = false;
      
      if (familyDiscount > 0 && descriptionDetaillée) {
        try {
          // Récupérer le produit original pour obtenir ses infos
          const originalPrice = await stripe.prices.retrieve(input.priceId, {
            expand: ['product'],
          });
          
          const product = originalPrice.product as any;
          
          // Créer un nouveau Price avec le prix final (après rabais)
          const customPrice = await stripe.prices.create({
            currency: 'chf',
            unit_amount: Math.round(finalPrice * 100), // Convertir en centimes
            recurring: {
              interval: 'year',
            },
            product_data: {
              name: `${product.name} - Rabais Familial ${familyDiscount}%`,
              description: descriptionDetaillée,
              metadata: {
                originalProductId: product.id,
                originalPriceId: input.priceId,
                groupeFamilial: groupeFamilial || '',
                familyMembersCount: familyMembersCount.toString(),
                familyDiscount: familyDiscount.toString(),
                basePrice: input.annualPrice.toString(),
                finalPrice: finalPrice.toString(),
              },
            },
          });
          
          priceIdToUse = customPrice.id;
          customPriceCreated = true;
          console.log(`[Stripe Checkout] Price personnalisé créé: ${customPrice.id}`);
          console.log(`  Prix final: ${finalPrice} CHF (au lieu de ${input.annualPrice} CHF)`);
        } catch (error) {
          console.error('[Stripe Checkout] Erreur création price personnalisé:', error);
          // Fallback: utiliser le price original sans rabais
          console.warn('[Stripe Checkout] Fallback: utilisation du price original');
        }
      }
      
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceIdToUse,
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
          annualPrice: input.annualPrice.toString(),
          isFree: input.isFree ? 'true' : 'false',
          signatureUrl: input.signatureUrl || '',
          clientId: input.clientId || '',
          groupeFamilial: groupeFamilial || '',
          familyMembersCount: familyMembersCount.toString(),
          familyDiscount: familyDiscount.toString(),
          finalPrice: finalPrice.toString(),
          familyMembersList: familyMembers.map(m => `${m.prenom || ''} ${m.nom}`.trim()).join(', '),
          customPriceCreated: customPriceCreated.toString(),
        },
      });
      
      return {
        sessionId: session.id,
        url: session.url,
        familyDiscount,
        familyMembersCount,
        finalPrice,
        groupeFamilial,
        familyMembers: familyMembers.map(m => ({ nom: m.nom, prenom: m.prenom })),
        descriptionDetaillée,
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
      try {
        console.log('[Upload Signature] Début upload pour:', input.clientEmail);
        
        const { storagePut } = await import('../storage');
        
        // Convertir data URL en Buffer
        const base64Data = input.signatureDataUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        console.log('[Upload Signature] Buffer créé, taille:', buffer.length, 'bytes');
        
        // Générer une clé unique pour éviter l'énumération
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `signatures/${input.clientEmail.replace('@', '-at-')}-${Date.now()}-${randomSuffix}.png`;
        
        console.log('[Upload Signature] Upload vers S3:', fileKey);
        const { url } = await storagePut(fileKey, buffer, 'image/png');
        
        console.log('[Upload Signature] Upload réussi:', url);
        
        return {
          url,
          key: fileKey,
        };
      } catch (error) {
        console.error('[Upload Signature] Erreur:', error);
        throw new Error(`Échec de l'upload de signature: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
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
        type: z.enum(["prive", "entreprise"]),
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
        typeClient: input.type === 'prive' ? 'Particulier' : 'Entreprise',
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
