import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { analyzePolicyDocument } from "../_core/googleVision";
import { createContract, getClientByEmail } from "../airtable";

/**
 * Router tRPC pour l'upload de documents et l'analyse OCR
 * 
 * Workflow:
 * 1. Client reçoit email avec lien /upload-documents?token=xxx
 * 2. validateToken() vérifie le token et retourne les infos client
 * 3. upload() reçoit les fichiers, lance OCR, crée contrats dans Airtable
 */

// Store temporaire des tokens (en production, utiliser Redis ou DB)
const tokenStore = new Map<string, {
  email: string;
  prenom: string;
  nom: string;
  typeClient: "Particulier" | "Entreprise";
  expiresAt: number;
}>();

/**
 * Générer un token unique pour un client
 */
export function generateUploadToken(
  email: string,
  prenom: string,
  nom: string,
  typeClient: "Particulier" | "Entreprise"
): string {
  const token = `${Buffer.from(`${email}-${Date.now()}`).toString("base64url")}`;
  
  tokenStore.set(token, {
    email,
    prenom,
    nom,
    typeClient,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 jours
  });
  
  return token;
}

export const documentsRouter = router({
  /**
   * Valider un token d'upload et retourner les infos client
   */
  validateToken: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      const tokenData = tokenStore.get(input.token);
      
      if (!tokenData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token invalide ou expiré",
        });
      }
      
      if (tokenData.expiresAt < Date.now()) {
        tokenStore.delete(input.token);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token expiré",
        });
      }
      
      return {
        email: tokenData.email,
        prenom: tokenData.prenom,
        nom: tokenData.nom,
        typeClient: tokenData.typeClient,
      };
    }),

  /**
   * Uploader des documents et lancer l'analyse OCR
   */
  upload: publicProcedure
    .input(z.object({
      token: z.string(),
      files: z.array(z.object({
        name: z.string(),
        type: z.string(),
        size: z.number(),
        data: z.string(), // base64
      })),
    }))
    .mutation(async ({ input }) => {
      // 1. Valider le token
      const tokenData = tokenStore.get(input.token);
      
      if (!tokenData || tokenData.expiresAt < Date.now()) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Token invalide ou expiré",
        });
      }
      
      // 2. Récupérer le client depuis Airtable
      const client = await getClientByEmail(tokenData.email);
      
      if (!client) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Client non trouvé dans Airtable",
        });
      }
      
      console.log(`[Documents] Upload de ${input.files.length} fichiers pour ${tokenData.email}`);
      
      // 3. Traiter chaque fichier
      const results = [];
      
      for (const file of input.files) {
        try {
          console.log(`[Documents] Analyse OCR de ${file.name}...`);
          
          // Convertir base64 en buffer
          const base64Data = file.data.split(",")[1] || file.data;
          const buffer = Buffer.from(base64Data, "base64");
          
          // Créer un fichier temporaire
          const fs = await import("fs/promises");
          const path = await import("path");
          const tmpDir = "/tmp";
          const tmpFile = path.join(tmpDir, `${Date.now()}-${file.name}`);
          
          await fs.writeFile(tmpFile, buffer);
          
          // Analyser avec Google Vision OCR
          const policyData = await analyzePolicyDocument(tmpFile);
          
          console.log(`[Documents] OCR terminé pour ${file.name}:`, {
            compagnie: policyData.compagnie,
            type: policyData.typeContrat,
            montant: policyData.montantPrime,
            confidence: `${policyData.confidence}%`,
          });
          
          // Créer le contrat dans Airtable
          const contractId = await createContract({
            clientRecordId: client.id,
            numeroPolice: policyData.numeroPolice || `AUTO-${Date.now()}`,
            compagnie: policyData.compagnie,
            typeContrat: policyData.typeContrat,
            montantPrime: policyData.montantPrime,
            frequencePaiement: policyData.frequencePaiement,
            primeAnnuelle: policyData.primeAnnuelle,
            dateDebut: policyData.dateDebut,
            dateFin: policyData.dateFin,
            statut: "En attente du contrat",
            notes: `Document uploadé: ${file.name}\nConfiance OCR: ${policyData.confidence}%\nTexte brut:\n${policyData.rawText?.substring(0, 500)}...`,
          });
          
          console.log(`[Documents] Contrat créé dans Airtable: ${contractId}`);
          
          // Nettoyer le fichier temporaire
          await fs.unlink(tmpFile);
          
          results.push({
            fileName: file.name,
            success: true,
            contractId,
            policyData: {
              compagnie: policyData.compagnie,
              numeroPolice: policyData.numeroPolice,
              montantPrime: policyData.montantPrime,
              confidence: policyData.confidence,
            },
          });
        } catch (error) {
          console.error(`[Documents] Erreur lors du traitement de ${file.name}:`, error);
          
          results.push({
            fileName: file.name,
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
          });
        }
      }
      
      console.log(`[Documents] Upload terminé: ${results.filter(r => r.success).length}/${results.length} réussis`);
      
      return {
        success: true,
        results,
        message: `${results.filter(r => r.success).length} document(s) traité(s) avec succès`,
      };
    }),
});
