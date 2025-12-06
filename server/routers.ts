import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { ENV } from "./_core/env";

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
        email: z.string().email(),
        telMobile: z.string(),
        // Champs PRIVÉ
        formuleAppel: z.string().optional(),
        prenom: z.string().optional(),
        nom: z.string().optional(),
        dateNaissance: z.string().optional(),
        statutProfessionnel: z.string().optional(),
        situationFamiliale: z.string().optional(),
        nationalite: z.string().optional(),
        adresse: z.string().optional(),
        npa: z.string().optional(),
        localite: z.string().optional(),
        banque: z.string().optional(),
        iban: z.string().optional(),
        // Champs ENTREPRISE
        nomEntreprise: z.string().optional(),
        formeJuridique: z.string().optional(),
        nombreEmployes: z.number().optional(),
        adresseEntreprise: z.string().optional(),
        npaEntreprise: z.string().optional(),
        localiteEntreprise: z.string().optional(),
        banqueEntreprise: z.string().optional(),
        ibanEntreprise: z.string().optional(),
        // Polices
        polices: z.array(z.object({
          compagnie: z.string(),
          typesContrats: z.array(z.string()),
          mode: z.string(),
        })).optional(),
        // CLÉ MULTI-MANDATS
        parrainEmail: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // 1. LOGIQUE DE LIAISON MULTI-MANDATS
        let groupeFamilial = "";
        
        if (input.parrainEmail) {
          // CAS : Dossier lié (Conjoint ou Entreprise)
          try {
            const response = await fetch(
              `https://api.airtable.com/v0/${ENV.airtableBaseId}/Clients?filterByFormula={Email}='${input.parrainEmail}'`,
              {
                headers: {
                  Authorization: `Bearer ${ENV.airtableApiKey}`,
                },
              }
            );
            const data = await response.json();
            
            if (data.records && data.records.length > 0) {
              // Récupérer le groupe familial du parrain
              groupeFamilial = data.records[0].fields["Groupe Familial"] || "";
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
          Email: input.email,
          "Téléphone Mobile": input.telMobile,
          "Groupe Familial": groupeFamilial,
          "Statut du client": "NOUVEAU CLIENT",
        };

        if (input.typeClient === "entreprise") {
          // CAS A : ENTREPRISE
          airtableFields["Nom de l'entreprise"] = input.nomEntreprise || "";
          airtableFields["Forme juridique"] = input.formeJuridique || "";
          airtableFields["Nombre d'employés"] = input.nombreEmployes || 0;
          airtableFields["Adresse"] = input.adresseEntreprise || "";
          airtableFields["NPA"] = input.npaEntreprise || "";
          airtableFields["Localité"] = input.localiteEntreprise || "";
          airtableFields["Banque"] = input.banqueEntreprise || "";
          airtableFields["IBAN"] = input.ibanEntreprise || "";
          // LAISSER VIDE : Nom, Prénom
        } else {
          // CAS B : PRIVÉ
          airtableFields["Formule d'appel"] = input.formuleAppel || "";
          airtableFields["Prénom"] = input.prenom || "";
          airtableFields["Nom"] = input.nom || "";
          airtableFields["Date de naissance"] = input.dateNaissance || "";
          airtableFields["Statut professionnel"] = input.statutProfessionnel || "";
          airtableFields["Situation familiale"] = input.situationFamiliale || "";
          airtableFields["Nationalité"] = input.nationalite || "";
          airtableFields["Adresse"] = input.adresse || "";
          airtableFields["NPA"] = input.npa || "";
          airtableFields["Localité"] = input.localite || "";
          airtableFields["Banque"] = input.banque || "";
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
  }),
});

export type AppRouter = typeof appRouter;
