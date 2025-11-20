/**
 * Router tRPC pour la génération de mandats PDF
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { generateMandatPDF, generateMandatFilename } from "../pdf-generator";
import { uploadToTmpFiles } from "../tmpfiles-upload";
import { createLeadInAirtable } from "../airtable-crm";

export const mandatRouter = router({
  /**
   * Générer le PDF du mandat et l'uploader vers S3
   * Utilise les données complètes du questionnaire et la signature Canvas
   */
  generateMandat: publicProcedure
    .input(
      z.object({
        // Informations client
        prenom: z.string().optional(),
        nom: z.string().optional(),
        nomEntreprise: z.string().optional(),
        email: z.string().email(),
        adresse: z.string(),
        npa: z.string(),
        localite: z.string(),
        
        // Informations entreprise (optionnel)
        formeJuridique: z.enum(['entreprise_individuelle', 'sarl', 'sa', 'autre']).optional(),
        nombreEmployes: z.string().optional(),
        
        // Type de client
        typeClient: z.enum(['prive', 'entreprise', 'les_deux']),
        
        // Signature (Canvas data URL)
        signatureDataUrl: z.string(), // Base64 data URL de la signature Canvas
        dateSignature: z.string(), // Format ISO
        
        // Informations de paiement (optionnel)
        mandatNumber: z.string().optional(),
        annualPrice: z.number().optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Générer le PDF avec le template officiel
        const pdfBuffer = await generateMandatPDF(input);
        
        // Générer un nom de fichier unique
        const filename = generateMandatFilename(input);
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        const fileKey = `mandats/${filename.replace('.pdf', '')}-${randomSuffix}.pdf`;
        
        // 1. Uploader la signature PNG vers tmpfiles (pour réutilisation)
        const signatureFilename = `signature_${Date.now()}.png`;
        const signatureResult = await uploadToTmpFiles(
          input.signatureDataUrl,
          signatureFilename,
          'image/png'
        );
        
        console.log(`[Mandat] Signature PNG uploadée: ${signatureResult.url}`);
        
        // 2. Uploader le PDF vers tmpfiles (Airtable téléchargera et stockera définitivement)
        const base64Pdf = pdfBuffer.toString('base64');
        const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
        const pdfResult = await uploadToTmpFiles(dataUrl, filename, 'application/pdf');
        
        console.log(`[Mandat] PDF généré et uploadé: ${pdfResult.url}`);
        
        // 3. Créer/mettre à jour le lead dans Airtable avec signature + PDF
        const clientName = input.typeClient === 'entreprise' 
          ? input.nomEntreprise || 'Entreprise'
          : `${input.prenom || ''} ${input.nom || ''}`.trim();
        
        try {
          await createLeadInAirtable({
            nom: clientName,
            email: input.email,
            telephone: '', // TODO: ajouter téléphone dans le formulaire
            typeClient: input.typeClient === 'entreprise' ? 'Entreprise' : 'Particulier',
            source: 'Questionnaire Mandat',
            signatureUrl: signatureResult.url,
            mandatPdfUrl: pdfResult.url,
            dateSignature: new Date(input.dateSignature).toLocaleDateString('fr-CH'),
          });
          console.log(`[Mandat] Lead créé dans Airtable avec signature + PDF`);
        } catch (airtableError) {
          console.error('[Mandat] Erreur Airtable (non bloquant):', airtableError);
          // Ne pas bloquer si Airtable échoue, le PDF est quand même généré
        }
        
        return {
          url: pdfResult.url,
          key: fileKey,
          filename,
          signatureUrl: signatureResult.url,
        };
      } catch (error) {
        console.error('[Mandat Router] Erreur lors de la génération du mandat:', error);
        throw new Error(`Échec de la génération du mandat: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }),
});
