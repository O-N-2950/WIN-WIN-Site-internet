import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { ENV } from "./_core/env";
import { v2 as cloudinary } from 'cloudinary';
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Router Client pour gérer les dossiers multi-mandats
  clients: router({
    create: publicProcedure
      .input(z.object({
        typeClient: z.enum(["prive", "entreprise"]),
        email: z.string().min(1, "Email requis"),
        telMobile: z.string(),
        // Champs PRIVÉ
        formuleAppel: z.string().optional(),
        prenom: z.string().optional(),
        nom: z.string().optional(),
        dateNaissance: z.string().optional(),
        statutProfessionnel: z.string().optional(),
        profession: z.string().optional(), // Si statutProfessionnel === "Employé(e)" ou "Indépendant(e)"
        employeur: z.string().optional(), // Si statutProfessionnel === "Employé(e)"
        tauxActivite: z.string().optional(), // Si statutProfessionnel === "Employé(e)" ou "Indépendant(e)"
        situationFamiliale: z.string().optional(),
        nationalite: z.string().optional(),
        autreNationalite: z.string().optional(), // Si nationalite === "Autre"
        permis: z.string().optional(), // Si nationalité !== "Suisse"
        adresse: z.string().optional(),
        npa: z.string().optional(),
        localite: z.string().optional(),
        canton: z.string().optional(), // Rempli automatiquement par OpenPLZ
        banque: z.string().optional(),
        autreBanque: z.string().optional(), // Si banque === "Autre"
        iban: z.string().refine((val) => !val || val.length >= 15, {
          message: "L'IBAN doit contenir au moins 15 caractères",
        }).optional(),
        // Champs ENTREPRISE
        nomEntreprise: z.string().optional(),
        formeJuridique: z.string().optional(),
        nombreEmployes: z.number().optional(),
        adresseEntreprise: z.string().optional(),
        npaEntreprise: z.string().optional(),
        localiteEntreprise: z.string().optional(),
        banqueEntreprise: z.string().optional(),
        autreBanqueEntreprise: z.string().optional(), // Si banqueEntreprise === "Autre"
        ibanEntreprise: z.string().refine((val) => !val || val.length >= 15, {
          message: "L'IBAN doit contenir au moins 15 caractères",
        }).optional(),
        // Polices (tableau de noms de polices sélectionnées)
        polices: z.array(z.string()).optional(),
        // CLÉ MULTI-MANDATS
        parrainEmail: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // 1. LOGIQUE DE LIAISON MULTI-MANDATS
        let groupeFamilial = "";
        
        if (input.parrainEmail) {
          // CAS : Dossier lié (Conjoint ou Entreprise)
          try {
            // Chercher le parrain dans les 2 champs email
            const response = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula=OR({fldI0sr2QLOJYsZR6}='${input.parrainEmail}',{fldFdqxwos16iziy3}='${input.parrainEmail}')`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const data = await response.json();
            
            if (data.records && data.records.length > 0) {
              // Récupérer le groupe familial du parrain
              groupeFamilial = data.records[0].fields["fld7adFgijiW0Eqhj"] || "";
              console.log("✅ Parrain trouvé !", { parrainEmail: input.parrainEmail, groupeFamilial });
            } else {
              console.error("❌ Parrain introuvable avec l'email:", input.parrainEmail);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du parrain:", error);
          }
        }
        
        if (!groupeFamilial) {
          // CAS : Premier mandat - Générer un nouveau groupe familial unique
          const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
          groupeFamilial = `FAMILLE-${randomSuffix}`;
        }

        // 2. MAPPING AIRTABLE STRICT (selon typeClient)
        const airtableFields: Record<string, any> = {
          "Email du client (table client)": input.email,
          "Contact E-mail": input.email, // Email dans les 2 colonnes
          "Tél. Mobile": input.telMobile,
          "Groupe Familial": groupeFamilial,
          "Statut du client": "NOUVEAU CLIENT",
          "Type de client": input.typeClient === "entreprise" ? "Entreprise" : "Particulier",
        };

        if (input.typeClient === "entreprise") {
          // CAS A : ENTREPRISE
          airtableFields["Nom de l'entreprise"] = input.nomEntreprise || "";
          airtableFields["Forme Juridique "] = input.formeJuridique || "";
          airtableFields["Nombre d'employés"] = input.nombreEmployes || 0;
          airtableFields["Contact Adresse, no"] = input.adresseEntreprise || "";
          airtableFields["Contact NPA"] = input.npaEntreprise ? parseInt(input.npaEntreprise, 10) : null;
          airtableFields["Contact Localité"] = input.localiteEntreprise || "";
          // Banque entreprise : Utiliser "autreBanqueEntreprise" si "Autre" sélectionné
          airtableFields["Banque"] = input.banqueEntreprise === "Autre" ? (input.autreBanqueEntreprise || "Autre") : (input.banqueEntreprise || "");
          airtableFields["IBAN"] = input.ibanEntreprise || "";
          // LAISSER VIDE : Nom, Prénom
        } else {
          // CAS B : PRIVÉ
          airtableFields["Formule d'appel"] = input.formuleAppel || "";
          airtableFields["Prénom"] = input.prenom || "";
          airtableFields["Nom"] = input.nom || "";
          airtableFields["Date de naissance"] = input.dateNaissance || "";
          airtableFields["Statut professionnel"] = input.statutProfessionnel || "";
          if (input.profession) {
            airtableFields["Profession"] = input.profession;
          }
          if (input.employeur) {
            airtableFields["Employeur"] = input.employeur;
          }
          if (input.tauxActivite) {
            airtableFields["Taux d'activité %"] = input.tauxActivite;
          }
          airtableFields["Situation familiale"] = input.situationFamiliale || "";
          // Nationalité : Utiliser "autreNationalite" si "Autre" sélectionné
          airtableFields["Nationalité"] = input.nationalite === "Autre" ? (input.autreNationalite || "Autre") : (input.nationalite || "");
          if (input.nationalite && input.nationalite !== "Suisse") {
            airtableFields["Permis d'établissement"] = input.permis || "";
          }
          airtableFields["Contact Adresse, no"] = input.adresse || "";
          airtableFields["Contact NPA"] = input.npa ? parseInt(input.npa, 10) : null;
          airtableFields["Contact Localité"] = input.localite || "";
          // Canton : Ne pas envoyer si vide (Airtable refuse les chaînes vides pour singleSelect)
          if (input.canton) {
            airtableFields["Canton"] = input.canton;
          }
          // Banque : Utiliser "autreBanque" si "Autre" sélectionné
          airtableFields["Banque"] = input.banque === "Autre" ? (input.autreBanque || "Autre") : (input.banque || "");
          airtableFields["IBAN"] = input.iban || "";
          // LAISSER VIDE : Nom de l'entreprise
        }

        // 3. CRÉATION DANS AIRTABLE
        try {
          const response = await fetch(
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ENV.airtableApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fields: airtableFields,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            console.error("❌ ERREUR AIRTABLE COMPLÈTE:", JSON.stringify(data, null, 2));
            console.error("📦 CHAMPS ENVOYÉS:", JSON.stringify(airtableFields, null, 2));
            throw new Error(`Airtable error: ${JSON.stringify(data)}`);
          }

          return {
            success: true,
            clientId: data.id,
            groupeFamilial,
          };
        } catch (error) {
          console.error("Erreur lors de la création du client:", error);
          throw new Error("Impossible de créer le client dans Airtable");
        }
      }),

    // Calculer le prix Stripe dynamique avec rabais familial
    getStripePrice: publicProcedure
      .input(z.object({
        email: z.string().min(1, "Email requis"),
      }))
      .mutation(async ({ input }) => {
        try {
          // 1. RÉCUPÉRATION DU CLIENT DANS AIRTABLE
          const response = await fetch(
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula={fldI0sr2QLOJYsZR6}='${input.email}'`,
            {
              headers: {
                Authorization: `Bearer ${ENV.airtableApiKey}`,
              },
            }
          );
          const data = await response.json();

          if (!data.records || data.records.length === 0) {
            throw new Error("Client introuvable dans Airtable");
          }

          const clientRecord = data.records[0];
          const groupeFamilial = clientRecord.fields["fld7adFgijiW0Eqhj"] || "";
          
          // Compter UNIQUEMENT les membres ACTIFS avec mandat PAYANT (non offert)
          let nbMembres = 1;
          if (groupeFamilial) {
            const familyResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula=AND({fld7adFgijiW0Eqhj}='${groupeFamilial}',{fldw9QKnjkINjZ7kQ}='Actif',NOT({flda7YHZTqwxL9zdr}))`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const familyData = await familyResponse.json();
            nbMembres = familyData.records?.length || 1;
            console.log(`📊 Groupe ${groupeFamilial}: ${nbMembres} membre(s) actif(s) avec mandat payant`);
          }

          // 2. FORMULE DE RABAIS STRICTE
          let rabaisPourcent = 0;
          if (nbMembres >= 2) {
            rabaisPourcent = (nbMembres - 1) * 2 + 2;
            // Plafond à 20%
            if (rabaisPourcent > 20) {
              rabaisPourcent = 20;
            }
          }

          // 3. CALCUL DU PRIX FINAL
          const prixBase = 185.00; // CHF
          const prixFinal = prixBase * (1 - rabaisPourcent / 100);
          const prixFinalCentimes = Math.round(prixFinal * 100); // Arrondi au centime

          // 4. CALCUL DE L'ÉCONOMIE
          const economie = prixBase - prixFinal;

          return {
            prixBase,
            rabaisPourcent,
            prixFinal,
            prixFinalCentimes,
            economie,
            nbMembres,
            groupeFamilial,
            metadata: `Rabais Groupe: ${rabaisPourcent}% (${nbMembres} membre${nbMembres > 1 ? 's' : ''})`
          };
        } catch (error) {
          console.error("Erreur lors du calcul du prix:", error);
          throw new Error("Impossible de calculer le prix Stripe");
        }
      }),
  }),

  // Router Workflow pour gérer le paiement Stripe
  workflow: router({
    createCheckoutSession: publicProcedure
      .input(z.object({
        email: z.string().min(1, "Email requis"),
        clientName: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          // 1. RÉCUPÉRER LE PRIX DYNAMIQUE
          const response = await fetch(
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula={fldI0sr2QLOJYsZR6}='${input.email}'`,
            {
              headers: {
                Authorization: `Bearer ${ENV.airtableApiKey}`,
              },
            }
          );
          const data = await response.json();

          if (!data.records || data.records.length === 0) {
            throw new Error("Client introuvable dans Airtable");
          }

          const clientRecord = data.records[0];
          const groupeFamilial = clientRecord.fields["fld7adFgijiW0Eqhj"] || "";
          
          // Compter UNIQUEMENT les membres ACTIFS avec mandat PAYANT (non offert)
          let nbMembres = 1;
          if (groupeFamilial) {
            const familyResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula=AND({fld7adFgijiW0Eqhj}='${groupeFamilial}',{fldw9QKnjkINjZ7kQ}='Actif',NOT({flda7YHZTqwxL9zdr}))`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const familyData = await familyResponse.json();
            nbMembres = familyData.records?.length || 1;
            console.log(`📊 Groupe ${groupeFamilial}: ${nbMembres} membre(s) actif(s) avec mandat payant`);
          }

          // 2. CALCUL DU PRIX AVEC FORMULE VALIDÉE
          let rabaisPourcent = 0;
          if (nbMembres >= 2) {
            rabaisPourcent = (nbMembres - 1) * 2 + 2;
            if (rabaisPourcent > 20) {
              rabaisPourcent = 20;
            }
          }

          const prixBase = 185.00;
          const prixFinal = prixBase * (1 - rabaisPourcent / 100);
          const prixFinalCentimes = Math.round(prixFinal * 100);

          // 3. CRÉER LA SESSION STRIPE
          const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
          
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'chf',
                  product_data: {
                    name: 'Mandat de courtage WIN WIN Finance',
                    description: `Rabais Groupe: ${rabaisPourcent}% (${nbMembres} membre${nbMembres > 1 ? 's' : ''})`,
                  },
                  unit_amount: prixFinalCentimes,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(input.email)}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/paiement/${encodeURIComponent(input.email)}`,
            customer_email: input.email,
            metadata: {
              clientName: input.clientName,
              email: input.email,
              rabaisPourcent: rabaisPourcent.toString(),
              nbMembres: nbMembres.toString(),
              prixBase: prixBase.toString(),
              prixFinal: prixFinal.toString(),
            },
          });

          return {
            checkoutUrl: session.url,
            sessionId: session.id,
          };
        } catch (error) {
          console.error("Erreur lors de la création de la session Stripe:", error);
          throw new Error("Impossible de créer la session de paiement");
        }
      }),
  }),

  // Router Contact pour gérer les messages de contact
  contact: router({
    sendMessage: publicProcedure
      .input(z.object({
        nom: z.string().min(1, "Nom requis"),
        email: z.string().email("Email invalide"),
        telephone: z.string().min(1, "Téléphone requis"),
        typeClient: z.enum(["particulier", "entreprise", "les-deux"]),
        sujet: z.string().min(1, "Sujet requis"),
        message: z.string().min(1, "Message requis"),
        attachmentUrl: z.string().optional(),
        attachmentFilename: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Envoyer l'email via Airtable
          const airtableApiKey = ENV.airtableApiKey;
          const airtableBaseId = ENV.airtableBaseId;

          if (!airtableApiKey || !airtableBaseId) {
            throw new Error("Configuration Airtable manquante");
          }

          // Mapper les valeurs typeClient vers les valeurs Airtable
          const typeClientMapping: Record<string, string> = {
            "particulier": "Particulier",
            "entreprise": "Entreprise",
            "les-deux": "Les deux"
          };

          const response = await fetch(
            `https://api.airtable.com/v0/${airtableBaseId}/tbl7kIZd294RTM1de`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${airtableApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                records: [{
                  fields: {
                    "Nom": input.nom,
                    "Email": input.email,
                    "Téléphone": input.telephone,
                    "Type Client": typeClientMapping[input.typeClient] || "Particulier",
                    "Source": "Formulaire Contact",
                    "Message": input.message,
                    "Statut": "Nouveau",
                    ...(input.attachmentUrl ? {
                      "Pièce jointe": [{
                        url: input.attachmentUrl,
                        filename: input.attachmentFilename
                      }]
                    } : {})
                  }
                }]
              }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Erreur Airtable:", errorText);
            throw new Error("Erreur lors de l'envoi du message");
          }

          // Envoyer une notification au propriétaire
          const notificationContent = `
**Nouveau message de contact**

**Nom:** ${input.nom}
**Email:** ${input.email}
**Téléphone:** ${input.telephone}
**Type:** ${typeClientMapping[input.typeClient]}

**Message:**
${input.message}

${input.attachmentUrl ? `**Pièce jointe:** ${input.attachmentUrl}` : ''}
          `.trim();

          await notifyOwner({
            title: `📩 Nouveau message de ${input.nom}`,
            content: notificationContent,
          });

          return { success: true };
        } catch (error) {
          console.error("Erreur sendMessage:", error);
          throw error;
        }
      }),

    uploadAttachment: publicProcedure
      .input(z.object({
        base64Data: z.string(),
        filename: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Upload vers Cloudinary avec credentials signés
          cloudinary.config({
            cloud_name: ENV.cloudinaryCloudName,
            api_key: ENV.cloudinaryApiKey,
            api_secret: ENV.cloudinaryApiSecret,
          });

          // Upload vers Cloudinary
          const result = await cloudinary.uploader.upload(input.base64Data, {
            folder: 'winwin-contact',
            resource_type: 'auto',
            public_id: `${Date.now()}-${input.filename}`,
          });

          return { url: result.secure_url };
        } catch (error) {
          console.error("Erreur uploadAttachment:", error);
          throw new Error("Erreur lors de l'upload du fichier");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
