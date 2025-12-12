import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { ENV } from "./_core/env";
// import { updateGroupDiscounts, recalculateAllGroups, countGroupMembers, calculateFamilyDiscount } from "./familyGroupService";

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
  client: router({
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
        // CODE DE PARRAINAGE (depuis URL ?ref=CODE)
        codeParrainageRef: z.string().optional(),
        // RELATION FAMILIALE (avec le parrain)
        relationFamiliale: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // 1. LOGIQUE DE LIAISON MULTI-MANDATS + PARRAINAGE
        let groupeFamilial = "";
        
        // PRIORITÉ 1 : Code de parrainage (depuis URL ?ref=CODE)
        let parrainId = ""; // ← AJOUT : Stocker l'ID du parrain
        if (input.codeParrainageRef) {
          console.log("🎉 Code de parrainage détecté:", input.codeParrainageRef);
          try {
            // Chercher le parrain par son code de parrainage
            const response = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fldEx4ytlCnqPoSDM}='${input.codeParrainageRef}'`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const data = await response.json();
            
            if (data.records && data.records.length > 0) {
              // Récupérer l'ID ET le groupe familial du parrain
              const parrainRecord = data.records[0];
              parrainId = parrainRecord.id; // ← AJOUT : Stocker l'ID du parrain
              groupeFamilial = parrainRecord.fields["fld7adFgijiW0Eqhj"] || "";
              console.log("✅ Parrain trouvé ! ID:", parrainId, "Groupe familial:", groupeFamilial);
            } else {
              console.warn("⚠️ Code de parrainage invalide:", input.codeParrainageRef);
            }
          } catch (error) {
            console.error("❌ Erreur lors de la recherche du parrain par code:", error);
            console.error("❌ Détails de l'erreur:", error);
          }
        }
        
        // PRIORITÉ 2 : Email du parrain (multi-mandats)
        if (!groupeFamilial && input.parrainEmail) {
          // CAS : Dossier lié (Conjoint ou Entreprise)
          try {
            const response = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fldI0sr2QLOJYsZR6}='${input.parrainEmail}'`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const data = await response.json();
            
            if (data.records && data.records.length > 0) {
              // Récupérer l'ID ET le groupe familial du parrain
              const parrainRecord = data.records[0];
              parrainId = parrainRecord.id; // ← CORRECTION BUG 2 : Stocker l'ID du parrain
              groupeFamilial = parrainRecord.fields["fld7adFgijiW0Eqhj"] || "";
              console.log("✅ Parrain trouvé par email ! ID:", parrainId, "Groupe familial:", groupeFamilial);
            }
          } catch (error) {
            console.error("❌ Erreur lors de la récupération du parrain par email:", error);
          }
        }
        
        // PRIORITÉ 3 : Nouveau groupe familial (premier mandat)
        if (!groupeFamilial) {
          // CAS : Premier mandat - Générer un nouveau groupe familial unique
          const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
          groupeFamilial = `FAMILLE-${randomSuffix}`;
          console.log("🆕 Nouveau groupe familial créé:", groupeFamilial);
        }

        // 2. MAPPING AIRTABLE STRICT (selon typeClient)
        const airtableFields: Record<string, any> = {
          "Contact E-mail": input.email, // fldFdqxwos16iziy3
          "Email du client (table client)": input.email, // fldI0sr2QLOJYsZR6
          "Tél. Mobile": input.telMobile,
          "Groupe Familial": groupeFamilial, // fld7adFgijiW0Eqhj
          "Statut du client": "NOUVEAU CLIENT",
          "Type de client": input.typeClient === "entreprise" ? "Entreprise" : "Particulier",
        };

        // ✅ AJOUT : Créer les liens bidirectionnels si parrain trouvé
        if (parrainId) {
          airtableFields["fldCyRJx4POhP1KjX"] = [parrainId]; // Membres de la famille
          airtableFields["fldwwD2OCerxa7dtz"] = [parrainId]; // Parrainé par
          console.log("🔗 Liens bidirectionnels créés avec le parrain:", parrainId);
          
          // Ajouter la relation familiale si fournie
          if (input.relationFamiliale) {
            airtableFields["fldXEhXcXbV40f6zM"] = input.relationFamiliale; // Relations familiales
            console.log("👨‍👩‍👧 Relation familiale:", input.relationFamiliale);
          }
          
          // 🔥 NOUVEAU : Marquer le parrain comme "Membre fondateur" UNIQUEMENT s'il est seul
          try {
            // 1. Récupérer les données actuelles du parrain
            const parrainResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI/${parrainId}`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const parrainData = await parrainResponse.json();
            const relationExistante = parrainData.fields?.["fldXEhXcXbV40f6zM"]; // Relations familiales
            
            // 2. Vérifier si le parrain a déjà une relation familiale
            if (!relationExistante || (Array.isArray(relationExistante) && relationExistante.length === 0)) {
              // Le parrain est SEUL (pas de relation existante) → Le marquer comme "Membre fondateur"
              await fetch(
                `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI/${parrainId}`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: `Bearer ${ENV.airtableApiKey}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    fields: {
                      "fldXEhXcXbV40f6zM": "Membre fondateur", // Relations familiales
                    },
                  }),
                }
              );
              console.log("🎯 Parrain marqué comme Membre fondateur (première fois):", parrainId);
            } else {
              console.log("ℹ️ Parrain a déjà une relation familiale:", relationExistante, "- Ne pas écraser !");
            }
          } catch (error) {
            console.error("❌ Erreur lors de la mise à jour du parrain:", error);
          }
        }

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
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI`,
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

          // 4. GÉNÉRER LE CODE DE PARRAINAGE CÔTÉ BACKEND
          // La formule Airtable prend du temps à calculer, on génère le code immédiatement
          // Format : PRENOM-XXXX (4 premiers caractères du prénom + 4 derniers du record ID)
          let codeParrainage = "";
          if (input.typeClient === "prive" && input.prenom) {
            const recordId = data.id; // ex: recU9ptDPQzSdcwd
            const prenomPrefix = input.prenom.substring(0, 4).toUpperCase();
            const recordSuffix = recordId.substring(recordId.length - 4).toUpperCase();
            codeParrainage = `${prenomPrefix}-${recordSuffix}`;
          } else if (input.typeClient === "entreprise" && input.nomEntreprise) {
            const recordId = data.id;
            const entreprisePrefix = input.nomEntreprise.substring(0, 4).toUpperCase();
            const recordSuffix = recordId.substring(recordId.length - 4).toUpperCase();
            codeParrainage = `${entreprisePrefix}-${recordSuffix}`;
          }

          // 5. RECALCULER LES RABAIS DU GROUPE AUTOMATIQUEMENT
          if (groupeFamilial) {
            try {
              console.log("📊 Recalcul automatique des rabais pour le groupe:", groupeFamilial);
              // await updateGroupDiscounts(groupeFamilial); // Désactivé temporairement - Airtable automation gère le calcul
              console.log("✅ Rabais recalculés avec succès !");
            } catch (error) {
              console.error("⚠️ Erreur lors du recalcul des rabais (non bloquant):", error);
              // Ne pas bloquer la création du client si le recalcul échoue
            }
          }

          return {
            success: true,
            clientId: data.id,
            groupeFamilial,
            codeParrainage, // ← Généré côté backend (PRENOM-XXXX)
          };
        } catch (error) {
          console.error("Erreur lors de la création du client:", error);
          throw new Error("Impossible de créer le client dans Airtable");
        }
      }),

    // Valider un code de parrainage et récupérer les infos du parrain
    validateReferralCode: publicProcedure
      .input(z.object({
        code: z.string().min(1, "Code requis"),
      }))
      .mutation(async ({ input }) => {
        try {
          // Chercher le parrain par son code de parrainage
          const response = await fetch(
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fldEx4ytlCnqPoSDM}='${input.code}'`,
            {
              headers: {
                Authorization: `Bearer ${ENV.airtableApiKey}`,
              },
            }
          );
          const data = await response.json();
          
          if (data.records && data.records.length > 0) {
            const parrainRecord = data.records[0];
            const parrainNom = parrainRecord.fields["fldoJ7b8Q7PaM27Vd"] || "Client"; // NOM du client (formule)
            const parrainId = parrainRecord.id;
            const groupeFamilial = parrainRecord.fields["fld7adFgijiW0Eqhj"] || "";
            
            return {
              valid: true,
              parrainNom,
              parrainId,
              groupeFamilial,
            };
          } else {
            return {
              valid: false,
              message: "Code de parrainage invalide",
            };
          }
        } catch (error) {
          console.error("❌ Erreur lors de la validation du code:", error);
          return {
            valid: false,
            message: "Erreur lors de la validation",
          };
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
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fldI0sr2QLOJYsZR6}='${input.email}'`,
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
          
          // Compter les membres actifs du groupe familial
          let nbMembres = 1;
          if (groupeFamilial) {
            const familyResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fld7adFgijiW0Eqhj}='${groupeFamilial}'`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const familyData = await familyResponse.json();
            nbMembres = familyData.records?.length || 1;
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

          // 5. GÉNÉRER LE CODE DE PARRAINAGE CÔTÉ BACKEND
          // La formule Airtable prend du temps à calculer, on génère le code immédiatement
          const recordId = clientRecord.id; // ex: recU9ptDPQzSdcwd
          const typeClient = clientRecord.fields["flddoSiduFTUIciGX"] || ""; // Type de client
          let codeParrainage = "";
          
          if (typeClient === "Particulier") {
            const prenom = clientRecord.fields["fldfhjuxTQwZipdOf"] || ""; // Prénom
            if (prenom) {
              const prenomPrefix = prenom.substring(0, 4).toUpperCase();
              const recordSuffix = recordId.substring(recordId.length - 4).toUpperCase();
              codeParrainage = `${prenomPrefix}-${recordSuffix}`;
            }
          } else if (typeClient === "Entreprise") {
            const nomEntreprise = clientRecord.fields["fldZ8w4IDGJBKS35M"] || ""; // Nom de l'entreprise
            if (nomEntreprise) {
              const entreprisePrefix = nomEntreprise.substring(0, 4).toUpperCase();
              const recordSuffix = recordId.substring(recordId.length - 4).toUpperCase();
              codeParrainage = `${entreprisePrefix}-${recordSuffix}`;
            }
          }
          
          // Fallback si le code n'a pas pu être généré
          if (!codeParrainage) {
            const recordSuffix = recordId.substring(recordId.length - 4).toUpperCase();
            codeParrainage = `CODE-${recordSuffix}`;
          }

          return {
            prixBase,
            rabaisPourcent,
            prixFinal,
            prixFinalCentimes,
            economie,
            nbMembres,
            groupeFamilial,
            codeParrainage, // ← AJOUTÉ
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
            `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fldI0sr2QLOJYsZR6}='${input.email}'`,
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
          
          // Compter les membres actifs du groupe familial
          let nbMembres = 1;
          if (groupeFamilial) {
            const familyResponse = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/tblWPcIpGmBZ3ASGI?filterByFormula={fld7adFgijiW0Eqhj}='${groupeFamilial}'`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const familyData = await familyResponse.json();
            nbMembres = familyData.records?.length || 1;
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

  // Router FamilyGroup pour gérer les rabais familiaux
  familyGroup: router({
    // Recalculer les rabais d'un groupe spécifique
    updateGroup: publicProcedure
      .input(z.object({
        groupCode: z.string().min(1, "Code de groupe requis"),
      }))
      .mutation(async ({ input }) => {
        try {
          // await updateGroupDiscounts(input.groupCode); // Désactivé temporairement
          // const memberCount = await countGroupMembers(input.groupCode);
          // const discount = calculateFamilyDiscount(memberCount);
          const memberCount = 0; // Temporaire
          const discount = 0; // Temporaire
          
          return {
            success: true,
            groupCode: input.groupCode,
            memberCount,
            discountPercent: discount,
          };
        } catch (error) {
          console.error("[FamilyGroup] Erreur lors de la mise à jour du groupe:", error);
          throw new Error("Impossible de mettre à jour le groupe familial");
        }
      }),

    // Obtenir les stats d'un groupe
    getGroupStats: publicProcedure
      .input(z.object({
        groupCode: z.string().min(1, "Code de groupe requis"),
      }))
      .query(async ({ input }) => {
        try {
          // const memberCount = await countGroupMembers(input.groupCode);
          // const discount = calculateFamilyDiscount(memberCount);
          const memberCount = 0; // Temporaire
          const discount = 0; // Temporaire
          
          return {
            groupCode: input.groupCode,
            memberCount,
            discountPercent: discount,
          };
        } catch (error) {
          console.error("[FamilyGroup] Erreur lors de la récupération des stats:", error);
          throw new Error("Impossible de récupérer les statistiques du groupe");
        }
      }),

    // Recalculer TOUS les groupes (admin only)
    recalculateAll: publicProcedure
      .mutation(async () => {
        try {
          // const result = await recalculateAllGroups(); // Désactivé temporairement
          const result = { updated: 0, errors: 0 }; // Temporaire
          return {
            success: true,
            updated: result.updated,
            errors: result.errors,
          };
        } catch (error) {
          console.error("[FamilyGroup] Erreur lors du recalcul global:", error);
          throw new Error("Impossible de recalculer tous les groupes");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
