import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { ENV } from "./_core/env";
import { v2 as cloudinary } from 'cloudinary';
import { notifyOwner } from "./_core/notification";
import { generateMandatPDF } from "./_core/generateMandatPDF";
import { dataUrlToBuffer, uploadToAirtableAttachment, updateAirtableAttachment } from "./_core/airtableAttachments";

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
              // Récupérer l'ID Groupe du parrain
              groupeFamilial = data.records[0].fields["fldIdJBCoXvW9IgHD"] || "";
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
          const groupeFamilial = clientRecord.fields["fldIdJBCoXvW9IgHD"] || "";
          
          // Compter UNIQUEMENT les membres ACTIFS avec mandat PAYANT (non offert)
          let nbMembres = 1;
          if (groupeFamilial) {
            const familyResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula=AND({fldIdJBCoXvW9IgHD}='${groupeFamilial}',{fldw9QKnjkINjZ7kQ}='Actif',NOT({flda7YHZTqwxL9zdr}))`,
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
          const groupeFamilial = clientRecord.fields["fldIdJBCoXvW9IgHD"] || "";
          
          // Compter UNIQUEMENT les membres ACTIFS avec mandat PAYANT (non offert)
          let nbMembres = 1;
          if (groupeFamilial) {
            const familyResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula=AND({fldIdJBCoXvW9IgHD}='${groupeFamilial}',{fldw9QKnjkINjZ7kQ}='Actif',NOT({flda7YHZTqwxL9zdr}))`,
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

  // Router Customers pour créer un client avec signature et PDF
  customers: router({
    createFromSignature: publicProcedure
      .input(z.object({
        clientEmail: z.string(),
        signatureDataUrl: z.string(),
        signatureDate: z.string(),
      }))
      .mutation(async ({ input }) => {
        try {
          // 1. Récupérer les données du client depuis Airtable
          const response = await fetch(
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula={fldI0sr2QLOJYsZR6}='${input.clientEmail}'`,
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
          const recordId = clientRecord.id;
          const fields = clientRecord.fields;

          // Extraire les données du client (selon colonnes Airtable)
          const clientName = fields["fldoJ7b8Q7PaM27Vd"] || ""; // NOM du client (formule)
          const clientAddress = fields["fldWXpm73tI4mHUoj"] || ""; // Adresse et no
          const clientNPA = fields["fldkbLY9Ziota9Wey"] ? fields["fldkbLY9Ziota9Wey"].toString() : ""; // NPA (number)
          const clientLocality = fields["fldqs8SybdPAauPdJ"] || ""; // Localité

          // 2. Convertir signature en PNG Buffer
          const signatureBuffer = dataUrlToBuffer(input.signatureDataUrl);
          const signatureFilename = `signature-${input.clientEmail}.png`;

          // 3. Upload signature vers Airtable (colonne #197 "Signature client")
          const signatureResult = await uploadToAirtableAttachment(
            signatureBuffer,
            signatureFilename,
            'image/png',
            recordId,  // ID de l'enregistrement Airtable
            'fldXxORXbvcHPVTio'  // Field ID "Signature client"
          );

          // 4. Générer le PDF du mandat avec la signature
          const pdfBuffer = await generateMandatPDF({
            clientName,
            clientAddress,
            clientNPA,
            clientLocality,
            signatureUrl: signatureResult.url,
            signatureDate: input.signatureDate,
          });

          // 5. Upload PDF vers Airtable (colonne #194 "MANDAT DE GESTION signé")
          const pdfFilename = `mandat-${input.clientEmail}.pdf`;
          const pdfResult = await uploadToAirtableAttachment(
            pdfBuffer,
            pdfFilename,
            'application/pdf',
            recordId,  // ID de l'enregistrement Airtable
            'fldFlOqiGic9Yv3on'  // Field ID "MANDAT DE GESTION signé"
          );

          // 6. FIN ! L'API Airtable Attachments a déjà ajouté les fichiers directement
          // Pas besoin de PATCH, les fichiers sont déjà dans les colonnes Airtable

          return {
            clientId: recordId,
            pdfUrl: pdfResult.url,
            signatureUrl: signatureResult.url,
          };
        } catch (error) {
          console.error("Erreur lors de la création du client avec signature:", error);
          throw new Error("Impossible de créer le client avec signature");
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

  // Router Billing pour la facturation automatique annuelle
  billing: router({
    createAnnualInvoice: publicProcedure
      .input(z.object({
        recordId: z.string(),
        clientName: z.string(),
        email: z.string().email(),
        prixBase: z.number(),
        rabaisPourcent: z.number(),
        prixFinal: z.number(),
        montantRabais: z.number(),
        groupeFamilial: z.string(),
        nbMembres: z.number(),
      }))
      .mutation(async ({ input }) => {
        try {
          console.log(`💰 Création facture pour ${input.clientName}`);
          console.log(`   Email: ${input.email}`);
          console.log(`   Groupe: ${input.groupeFamilial} (${input.nbMembres} membres)`);
          console.log(`   Prix: ${input.prixFinal} CHF (base: ${input.prixBase}, rabais: ${input.rabaisPourcent}%)`);

          // Vérifier la clé Stripe
          if (!ENV.stripeSecretKey) {
            throw new Error("STRIPE_SECRET_KEY non configurée");
          }

          const stripe = require('stripe')(ENV.stripeSecretKey);

          // 1. Créer ou récupérer le client Stripe
          const customers = await stripe.customers.list({
            email: input.email,
            limit: 1,
          });

          let customer;
          if (customers.data.length > 0) {
            customer = customers.data[0];
            console.log(`   ✅ Client Stripe existant: ${customer.id}`);
          } else {
            customer = await stripe.customers.create({
              email: input.email,
              name: input.clientName,
              metadata: {
                groupeFamilial: input.groupeFamilial,
                source: 'winwin-website-annual-billing',
              },
            });
            console.log(`   ✅ Nouveau client Stripe créé: ${customer.id}`);
          }

          // 2. Créer la description détaillée
          const description = `Mandat de courtage WIN WIN Finance - Année ${new Date().getFullYear()}
Groupe familial: ${input.groupeFamilial} (${input.nbMembres} membre${input.nbMembres > 1 ? 's' : ''} actif${input.nbMembres > 1 ? 's' : ''})
Prix de base: ${input.prixBase.toFixed(2)} CHF
Rabais familial: ${input.rabaisPourcent}% (-${input.montantRabais.toFixed(2)} CHF)
Prix final: ${input.prixFinal.toFixed(2)} CHF`;

          // 3. Créer un item de facture
          await stripe.invoiceItems.create({
            customer: customer.id,
            amount: Math.round(input.prixFinal * 100), // Convertir en centimes
            currency: 'chf',
            description: description,
          });

          // 4. Créer la facture
          const invoice = await stripe.invoices.create({
            customer: customer.id,
            auto_advance: true, // Finaliser automatiquement
            collection_method: 'send_invoice',
            days_until_due: 30,
            metadata: {
              clientName: input.clientName,
              groupeFamilial: input.groupeFamilial,
              nbMembres: input.nbMembres.toString(),
              rabaisPourcent: input.rabaisPourcent.toString(),
              prixBase: input.prixBase.toFixed(2),
              prixFinal: input.prixFinal.toFixed(2),
              montantRabais: input.montantRabais.toFixed(2),
              airtableRecordId: input.recordId,
            },
          });

          console.log(`   ✅ Facture créée: ${invoice.id}`);

          // 5. Finaliser la facture
          const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
          console.log(`   ✅ Facture finalisée`);

          // 6. Envoyer la facture par email
          await stripe.invoices.sendInvoice(invoice.id);
          console.log(`   📧 Facture envoyée par email à ${input.email}`);

          // 7. Mettre à jour Airtable avec les nouvelles dates
          const airtableApiKey = ENV.airtableApiKey;
          const airtableBaseId = ENV.airtableBaseId;

          if (!airtableApiKey || !airtableBaseId) {
            throw new Error("Configuration Airtable manquante");
          }

          const today = new Date().toISOString().split('T')[0];
          const nextBillingDate = new Date();
          nextBillingDate.setDate(nextBillingDate.getDate() + 360);
          const nextBillingDateStr = nextBillingDate.toISOString().split('T')[0];

          const updateResponse = await fetch(
            `https://api.airtable.com/v0/${airtableBaseId}/Clients/${input.recordId}`,
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${airtableApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fields: {
                  'Date dernière facture établie': today,
                  'Date prochaine facturation': nextBillingDateStr,
                  'Stripe Invoice ID': invoice.id,
                },
              }),
            }
          );

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error(`   ⚠️  Erreur mise à jour Airtable: ${errorText}`);
          } else {
            console.log(`   ✅ Airtable mis à jour`);
            console.log(`   📅 Prochaine facturation: ${nextBillingDateStr}`);
          }

          return {
            success: true,
            invoiceId: invoice.id,
            invoiceUrl: finalizedInvoice.hosted_invoice_url,
            nextBillingDate: nextBillingDateStr,
          };
        } catch (error: any) {
          console.error("❌ Erreur createAnnualInvoice:", error);
          throw new Error(`Erreur lors de la création de la facture: ${error.message}`);
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
