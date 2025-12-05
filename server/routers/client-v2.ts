/**
 * Router tRPC Client V2 - Gestion multi-mandats avec IBAN
 * 
 * Supporte :
 * - 1 mandat : Client seul
 * - 2 mandats : Couple OU Client + Entreprise
 * - 3 mandats : Couple + Entreprise
 * 
 * Chaque mandat a son propre IBAN et génère un PDF séparé
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import {
  createAirtableClient,
  type ClientData,
} from '../lib/airtable';
import { generateMandatPDF, type MandatData } from '../pdf-generator';
import { storagePut } from '../storage';
import { generateFamilyCode, calculateFamilyDiscount, applyFamilyDiscount } from '../lib/parrainage';
import { cleanIban, validateIbanWithMessage } from '../lib/iban';

/**
 * Schéma de validation IBAN
 */
const ibanSchema = z.string()
  .transform(val => cleanIban(val))
  .refine(
    val => validateIbanWithMessage(val) === null,
    val => ({ message: validateIbanWithMessage(val) || 'IBAN invalide' })
  );

/**
 * Interface pour un mandat créé
 */
interface MandatCree {
  clientId: string;
  type: 'Privé' | 'Entreprise';
  nom: string;
  prenom?: string;
  pdfUrl: string;
  montantBase: number;
  montantFinal: number;
  iban: string;
  banque: string;
}

export const clientRouterV2 = router({
  /**
   * Crée 1 à 3 mandats depuis la signature
   * Gère : Privé, Conjoint, Entreprise
   */
  createFromSignature: publicProcedure
    .input(
      z.object({
        // Informations personnelles
        prenom: z.string().min(1),
        nom: z.string().min(1),
        formuleAppel: z.enum(['Monsieur', 'Madame']).optional(),
        email: z.string().email(),
        telMobile: z.string(),
        adresse: z.string(),
        npa: z.string(),
        localite: z.string(),
        dateNaissance: z.string().optional(),
        statutProfessionnel: z.string().optional(),
        profession: z.string().optional(),
        employeur: z.string().optional(),
        tauxActivite: z.string().optional(),
        situationFamiliale: z.enum(['Célibataire', 'Marié(e)', 'En couple', 'Divorcé(e)', 'Veuf(ve)', 'Séparé(e)']).optional(),
        nationalite: z.string().optional(),
        permisEtablissement: z.string().optional(),
        
        // Type de client
        typeClient: z.enum(['prive', 'entreprise', 'les_deux']),
        
        // Informations bancaires personnelles
        ibanPersonnel: ibanSchema,
        banquePersonnelle: z.string().min(1),
        
        // Conjoint (si marié)
        conjointPrenom: z.string().optional(),
        conjointNom: z.string().optional(),
        conjointDateNaissance: z.string().optional(),
        conjointHasContracts: z.boolean().optional(),
        ibanConjoint: ibanSchema.optional(),
        banqueConjoint: z.string().optional(),
        
        // Entreprise (si typeClient = 'entreprise' ou 'les_deux')
        nomEntreprise: z.string().optional(),
        adresseEntreprise: z.string().optional(),
        npaEntreprise: z.string().optional(),
        localiteEntreprise: z.string().optional(),
        formeJuridique: z.enum(['entreprise_individuelle', 'sarl', 'sa', 'autre']).optional().or(z.literal('').transform(() => undefined)),
        nombreEmployes: z.string().optional().or(z.literal('').transform(() => undefined)),
        ibanEntreprise: ibanSchema.optional(),
        banqueEntreprise: z.string().optional(),
        
        // Code de parrainage utilisé
        codeParrainageUtilise: z.string().optional(),
        
        // Signature
        signatureDataUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Client V2] Creating mandats for:', input.email);
      
      try {
        // 1. Générer le code de parrainage unique pour ce groupe
        const codeParrainageGenere = generateFamilyCode(input.nom);
        console.log('[Client V2] Generated referral code:', codeParrainageGenere);
        
        const mandatsACréer: MandatCree[] = [];
        const dateSignature = new Date().toISOString().split('T')[0];
        
        // 2. Créer UN SEUL mandat selon le typeClient
        const typeMandat = input.typeClient; // 'prive' ou 'entreprise'
        
        // 3. TODO: Calculer le rabais familial en fonction du nombre de clients existants avec le même code de parrainage
        // Pour l'instant, rabais = 0% (sera recalculé plus tard)
        const rabaisFamilial = 0;
        console.log(`[Client V2] Création mandat ${typeMandat}, rabais: ${rabaisFamilial}%`);
        
        // 4. Créer le mandat selon le type
        if (typeMandat === 'prive') {
          console.log('[Client V2] Creating mandat PRIVÉ...');
          
          // Générer PDF
          const mandatData: MandatData = {
            prenom: input.prenom,
            nom: input.nom,
            email: input.email,
            adresse: input.adresse,
            npa: input.npa,
            localite: input.localite,
            typeClient: 'prive',
            signatureDataUrl: input.signatureDataUrl,
            dateSignature: new Date().toLocaleDateString('fr-CH'),
          };
          
          const pdfBuffer = await generateMandatPDF(mandatData);
          const fileName = `mandat-prive-${input.nom}-${Date.now()}.pdf`;
          const { url: pdfUrl } = await storagePut(`mandats/${fileName}`, pdfBuffer, 'application/pdf');
          
          // Créer dans Airtable
          const clientData: ClientData = {
            Prénom: input.prenom,
            Nom: input.nom,
            "Formule d'appel": input.formuleAppel,
            'Type de client': 'Privé',
            'Date de naissance': input.dateNaissance,
            'Statut professionnel': input.statutProfessionnel,
            Profession: input.profession,
            Employeur: input.employeur,
            'Taux d\'activité %': input.tauxActivite,
            'Situation familiale': input.situationFamiliale,
            'Nationalité': input.nationalite,
            "Permis d'établissement": input.permisEtablissement,
            'Email du client (table client)': input.email,
            'Tél. Mobile': input.telMobile,
            'Adresse et no': input.adresse,
            NPA: input.npa ? parseInt(input.npa) : undefined,
            Localité: input.localite,
            'Nom de la banque': input.banquePersonnelle,
            IBAN: input.ibanPersonnel,
            'Statut du client': 'Prospect',
            'Date signature mandat': dateSignature,
            'Code Parrainage': codeParrainageGenere,
            'Code de parrainage utilisé': input.codeParrainageUtilise,
            Language: 'Français',
          };
          
          const clientId = await createAirtableClient(clientData);
          
          const montantBase = 185;
          const montantFinal = applyFamilyDiscount(montantBase, rabaisFamilial);
          
          mandatsACréer.push({
            clientId,
            type: 'Privé',
            nom: input.nom,
            prenom: input.prenom,
            pdfUrl,
            montantBase,
            montantFinal,
            iban: input.ibanPersonnel,
            banque: input.banquePersonnelle,
          });
          
          console.log('[Client V2] Mandat PRIVÉ created:', clientId);
        } else if (typeMandat === 'entreprise' && input.nomEntreprise) {
          console.log('[Client V2] Creating mandat ENTREPRISE...');
          
          // Générer PDF
          const mandatData: MandatData = {
            nomEntreprise: input.nomEntreprise,
            email: input.email,
            adresse: input.adresseEntreprise || input.adresse,
            npa: input.npaEntreprise || input.npa,
            localite: input.localiteEntreprise || input.localite,
            typeClient: 'entreprise',
            formeJuridique: input.formeJuridique,
            nombreEmployes: input.nombreEmployes,
            signatureDataUrl: input.signatureDataUrl,
            dateSignature: new Date().toLocaleDateString('fr-CH'),
          };
          
          const pdfBuffer = await generateMandatPDF(mandatData);
          const fileName = `mandat-entreprise-${input.nomEntreprise.replace(/\s/g, '-')}-${Date.now()}.pdf`;
          const { url: pdfUrl } = await storagePut(`mandats/${fileName}`, pdfBuffer, 'application/pdf');
          
          // Créer dans Airtable
          const clientData: ClientData = {
            Prénom: input.prenom,
            Nom: input.nom,
            'Type de client': 'Entreprise',
            'Email du client (table client)': input.email,
            'Tél. Mobile': input.telMobile,
            'Adresse et no': input.adresseEntreprise || input.adresse,
            NPA: (input.npaEntreprise || input.npa) ? parseInt(input.npaEntreprise || input.npa) : undefined,
            Localité: input.localiteEntreprise || input.localite,
            'Statut du client': 'Prospect',
            'Nom de l\'entreprise': input.nomEntreprise,
            'Nombre d\'employés': input.nombreEmployes ? parseInt(input.nombreEmployes) : undefined,
            'Date signature mandat': dateSignature,
            'Code Parrainage': codeParrainageGenere,
            'Code de parrainage utilisé': input.codeParrainageUtilise,
            IBAN: input.ibanEntreprise!,
            'Nom de la banque': input.banqueEntreprise!,
            Language: 'Français',
          };
          
          const clientId = await createAirtableClient(clientData);
          
          // Calculer le prix selon le nombre d'employés
          const nombreEmployesNum = input.nombreEmployes ? parseInt(input.nombreEmployes) : 0;
          let montantBase = 160; // Prix de base entreprise
          if (nombreEmployesNum >= 1 && nombreEmployesNum <= 5) montantBase = 260;
          else if (nombreEmployesNum >= 6 && nombreEmployesNum <= 10) montantBase = 360;
          else if (nombreEmployesNum >= 11 && nombreEmployesNum <= 20) montantBase = 460;
          else if (nombreEmployesNum >= 21 && nombreEmployesNum <= 50) montantBase = 560;
          else if (nombreEmployesNum >= 51) montantBase = 860;
          
          const montantFinal = applyFamilyDiscount(montantBase, rabaisFamilial);
          
          mandatsACréer.push({
            clientId,
            type: 'Entreprise',
            nom: input.nomEntreprise,
            pdfUrl,
            montantBase,
            montantFinal,
            iban: input.ibanEntreprise!,
            banque: input.banqueEntreprise!,
          });
          
          console.log('[Client V2] Mandat ENTREPRISE created:', clientId);
        }
        
        // 7. Créer entrée "Mandat offert" pour conjoint sans contrats
        if (input.situationFamiliale === 'Marié(e)' && 
            input.conjointHasContracts === false && 
            input.conjointPrenom && 
            input.conjointNom) {
          console.log('[Client V2] Creating entry "Mandat offert" for conjoint...');
          
          const clientData: ClientData = {
            Prénom: input.conjointPrenom,
            Nom: input.conjointNom,
            'Type de client': 'Privé',
            'Date de naissance': input.conjointDateNaissance,
            'Email du client (table client)': input.email,
            'Statut du client': 'Mandat offert',
            'Code Parrainage': codeParrainageGenere,
            Language: 'Français',
          };
          
          await createAirtableClient(clientData);
          console.log('[Client V2] Entry "Mandat offert" created for conjoint');
        }
        
        // 8. Retourner les mandats créés
        return {
          success: true,
          codeParrainage: codeParrainageGenere,
          nombreMandats: mandatsACréer.length,
          rabaisFamilial,
          mandats: mandatsACréer,
          message: `${mandatsACréer.length} mandat(s) créé(s) avec succès`,
        };
        
      } catch (error) {
        console.error('[Client V2] Error creating mandats:', error);
        throw new Error(`Erreur lors de la création des mandats: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }),
});
