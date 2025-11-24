/**
 * Router tRPC Client - Gestion des clients avec transitions de statuts
 * 
 * Workflow:
 * 1. Inscription → Statut "Prospect"
 * 2. Signature → Statut "En attente"
 * 3. Paiement Stripe → Statut "Actif"
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import {
  createAirtableClient,
  updateAirtableClient,
  findClientByEmail,
  type ClientData,
} from '../lib/airtable';
import { generateMandatPDF, type MandatData } from '../pdf-generator';
import { storagePut } from '../storage';
import { generateFamilyCode } from '../lib/parrainage';

export const clientRouter = router({
  /**
   * Crée un nouveau client avec statut "Prospect"
   */
  create: publicProcedure
    .input(
      z.object({
        // Informations personnelles
        prenom: z.string().min(1, 'Le prénom est requis'),
        nom: z.string().min(1, 'Le nom est requis'),
        typeClient: z.enum(['Privé', 'Entreprise']),
        dateNaissance: z.string().optional(), // Format: YYYY-MM-DD
        email: z.string().email('Email invalide'),
        telMobile: z.string().min(1, 'Le téléphone est requis'),
        
        // Adresse
        adresse: z.string().min(1, 'L\'adresse est requise'),
        npa: z.number().int().min(1000).max(9999),
        localite: z.string().min(1, 'La localité est requise'),
        canton: z.string().optional(),
        
        // Informations complémentaires
        formuleAppel: z.enum(['Monsieur', 'Madame', 'Autre']).optional(),
        situationFamiliale: z.enum(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf(ve)', 'Partenariat enregistré']).optional(),
        statutProfessionnel: z.enum(['Employé(e)', 'Indépendant(e)', 'Retraité(e)', 'Étudiant(e)', 'Sans emploi']).optional(),
        fumeur: z.enum(['oui', 'non']).optional(),
        
        // Entreprise (si typeClient = 'Entreprise')
        nomEntreprise: z.string().optional(),
        nombreEmployes: z.number().int().min(0).optional(),
        
        // Autres
        avs: z.string().optional(),
        language: z.enum(['Français', 'Anglais', 'Allemand', 'Italien', 'Espagnol', 'Autre']).optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Client Router] Creating new client (Prospect):', input.email);
      
      // Vérifier si le client existe déjà
      const existingClientId = await findClientByEmail(input.email);
      if (existingClientId) {
        throw new Error('Un client avec cet email existe déjà');
      }
      
      // Préparer les données pour Airtable
      const clientData: ClientData = {
        Prénom: input.prenom,
        Nom: input.nom,
        'Type de client': input.typeClient,
        'Date de naissance': input.dateNaissance,
        'Email du client (table client)': input.email,
        'Tél. Mobile': input.telMobile,
        'Adresse et no': input.adresse,
        NPA: input.npa,
        Localité: input.localite,
        Canton: input.canton,
        'Statut du client': 'Prospect', // ← Statut initial
        'Formule d\'appel': input.formuleAppel,
        'Situation familiale': input.situationFamiliale,
        'Statut professionnel': input.statutProfessionnel,
        'Fumeur(se)': input.fumeur,
        'Nom de l\'entreprise': input.nomEntreprise,
        'Nombre d\'employés': input.nombreEmployes,
        AVS: input.avs,
        Language: input.language || 'Français',
      };
      
      // Créer le client dans Airtable
      const recordId = await createAirtableClient(clientData);
      
      console.log('[Client Router] Client created successfully:', recordId);
      
      return {
        success: true,
        clientId: recordId,
        message: 'Client créé avec succès (statut: Prospect)',
      };
    }),

  /**
   * Crée un client depuis la signature (workflow simplifié)
   * Combine: création client + génération PDF + upload S3
   */
  createFromSignature: publicProcedure
    .input(
      z.object({
        // Données du questionnaire
        prenom: z.string().optional(),
        nom: z.string().optional(),
        nomEntreprise: z.string().optional(),
        typeClient: z.enum(['prive', 'entreprise', 'les_deux']),
        email: z.string().email(),
        telMobile: z.string().optional(),
        adresse: z.string(),
        npa: z.string(),
        localite: z.string(),
        dateNaissance: z.string().optional(),
        formeJuridique: z.enum(['entreprise_individuelle', 'sarl', 'sa', 'autre']).optional(),
        nombreEmployes: z.string().optional(),
        codeParrainage: z.string().optional(),
        
        // Données de la signature
        signatureDataUrl: z.string(),
        signatureS3Url: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Client Router] Creating client from signature:', input.email);
      
      try {
        // 1. Vérifier si le client existe déjà
        const existingClientId = await findClientByEmail(input.email);
        if (existingClientId) {
          console.log('[Client Router] Client already exists:', existingClientId);
          return {
            success: true,
            clientId: existingClientId,
            clientId2: null,
            message: 'Client existant retrouvé',
            pdfUrl: null,
            pdfUrl2: null,
          };
        }
        
        // 1.5 Générer le code de parrainage unique
        const nom = input.nom || input.nomEntreprise || 'CLIENT';
        const codeParrainageGenere = generateFamilyCode(nom);
        console.log('[Client Router] Generated referral code:', codeParrainageGenere);
        
        // 2. Générer le PDF mandat
        console.log('[Client Router] Generating PDF mandat...');
        const mandatData: MandatData = {
          prenom: input.prenom,
          nom: input.nom,
          nomEntreprise: input.nomEntreprise,
          email: input.email,
          adresse: input.adresse,
          npa: input.npa,
          localite: input.localite,
          typeClient: input.typeClient,
          formeJuridique: input.formeJuridique,
          nombreEmployes: input.nombreEmployes,
          signatureDataUrl: input.signatureDataUrl,
          dateSignature: new Date().toLocaleDateString('fr-CH'),
        };
        
        const pdfBuffer = await generateMandatPDF(mandatData);
        console.log('[Client Router] PDF generated, size:', pdfBuffer.length, 'bytes');
        
        // 3. Upload PDF vers S3
        const fileName = `mandat-${input.email.replace('@', '-at-')}-${Date.now()}.pdf`;
        const { url: pdfUrl } = await storagePut(
          `mandats/${fileName}`,
          pdfBuffer,
          'application/pdf'
        );
        console.log('[Client Router] PDF uploaded to S3:', pdfUrl);
        
        // 4. Gérer le double mandat si typeClient = 'les_deux'
        if (input.typeClient === 'les_deux') {
          console.log('[Client Router] Creating DOUBLE mandat (Privé + Entreprise)...');
          
          // 4a. Créer le client PRIVÉ
          const clientDataPrive: ClientData = {
            Prénom: input.prenom,
            Nom: input.nom,
            'Type de client': 'Privé',
            'Date de naissance': input.dateNaissance,
            'Email du client (table client)': input.email,
            'Tél. Mobile': input.telMobile,
            'Adresse et no': input.adresse,
            NPA: parseInt(input.npa),
            Localité: input.localite,
            'Statut du client': 'Prospect',
            'Date signature mandat': new Date().toISOString().split('T')[0],
            'Code Parrainage': codeParrainageGenere,
            'Code de parrainage utilisé': input.codeParrainage,
            Language: 'Français',
          };
          
          const recordIdPrive = await createAirtableClient(clientDataPrive);
          console.log('[Client Router] Client PRIVÉ created:', recordIdPrive);
          
          // 4b. Générer PDF mandat PRIVÉ
          const mandatDataPrive: MandatData = {
            ...mandatData,
            typeClient: 'prive',
            nomEntreprise: undefined,
            formeJuridique: undefined,
            nombreEmployes: undefined,
          };
          const pdfBufferPrive = await generateMandatPDF(mandatDataPrive);
          const fileNamePrive = `mandat-prive-${input.email.replace('@', '-at-')}-${Date.now()}.pdf`;
          const { url: pdfUrlPrive } = await storagePut(
            `mandats/${fileNamePrive}`,
            pdfBufferPrive,
            'application/pdf'
          );
          console.log('[Client Router] PDF PRIVÉ uploaded:', pdfUrlPrive);
          
          // 4c. Créer le client ENTREPRISE
          const clientDataEntreprise: ClientData = {
            Prénom: input.prenom,
            Nom: input.nom,
            'Type de client': 'Entreprise',
            'Email du client (table client)': input.email,
            'Tél. Mobile': input.telMobile,
            'Adresse et no': input.adresse,
            NPA: parseInt(input.npa),
            Localité: input.localite,
            'Statut du client': 'Prospect',
            'Nom de l\'entreprise': input.nomEntreprise,
            'Nombre d\'employés': input.nombreEmployes ? parseInt(input.nombreEmployes) : undefined,
            'Date signature mandat': new Date().toISOString().split('T')[0],
            'Code Parrainage': codeParrainageGenere,
            'Code de parrainage utilisé': input.codeParrainage,
            Language: 'Français',
          };
          
          const recordIdEntreprise = await createAirtableClient(clientDataEntreprise);
          console.log('[Client Router] Client ENTREPRISE created:', recordIdEntreprise);
          
          // 4d. Générer PDF mandat ENTREPRISE
          const mandatDataEntreprise: MandatData = {
            ...mandatData,
            typeClient: 'entreprise',
            prenom: undefined,
            dateNaissance: undefined,
          };
          const pdfBufferEntreprise = await generateMandatPDF(mandatDataEntreprise);
          const fileNameEntreprise = `mandat-entreprise-${input.email.replace('@', '-at-')}-${Date.now()}.pdf`;
          const { url: pdfUrlEntreprise } = await storagePut(
            `mandats/${fileNameEntreprise}`,
            pdfBufferEntreprise,
            'application/pdf'
          );
          console.log('[Client Router] PDF ENTREPRISE uploaded:', pdfUrlEntreprise);
          
          return {
            success: true,
            clientId: recordIdPrive,
            clientId2: recordIdEntreprise,
            pdfUrl: pdfUrlPrive,
            pdfUrl2: pdfUrlEntreprise,
            codeParrainage: codeParrainageGenere,
            message: 'Double mandat créé avec succès (Privé + Entreprise)',
          };
        }
        
        // 4. Créer le client unique dans Airtable
        const clientData: ClientData = {
          Prénom: input.prenom,
          Nom: input.nom,
          'Type de client': input.typeClient === 'prive' ? 'Privé' : 'Entreprise',
          'Date de naissance': input.dateNaissance,
          'Email du client (table client)': input.email,
          'Tél. Mobile': input.telMobile,
          'Adresse et no': input.adresse,
          NPA: parseInt(input.npa),
          Localité: input.localite,
          'Statut du client': 'Prospect',
          'Nom de l\'entreprise': input.nomEntreprise,
          'Nombre d\'employés': input.nombreEmployes ? parseInt(input.nombreEmployes) : undefined,
          'Date signature mandat': new Date().toISOString().split('T')[0],
          'Code Parrainage': codeParrainageGenere,
          'Code de parrainage utilisé': input.codeParrainage,
          Language: 'Français',
        };
        
        const recordId = await createAirtableClient(clientData);
        console.log('[Client Router] Client created in Airtable:', recordId);
        
        return {
          success: true,
          clientId: recordId,
          clientId2: null,
          pdfUrl,
          pdfUrl2: null,
          codeParrainage: codeParrainageGenere,
          message: 'Client créé avec succès (statut: Prospect)',
        };
      } catch (error) {
        console.error('[Client Router] Error creating client from signature:', error);
        throw new Error(`Erreur lors de la création du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
    }),

  /**
   * Met à jour le statut d'un client
   * Utilisé pour les transitions: Prospect → En attente → Actif
   */
  updateStatus: publicProcedure
    .input(
      z.object({
        clientId: z.string().min(1, 'Client ID requis'),
        status: z.enum(['Prospect', 'En attente', 'Actif', 'Inactif', 'Mandat résilié']),
        signatureUrl: z.string().optional(),
        signatureDate: z.string().optional(), // Format: YYYY-MM-DD
        stripeCustomerId: z.string().optional(),
        stripeSubscriptionId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Client Router] Updating client status:', input.clientId, '→', input.status);
      
      const updates: Partial<ClientData> = {
        'Statut du client': input.status,
      };
      
      // Ajouter la signature si fournie (transition Prospect → En attente)
      if (input.signatureUrl) {
        updates['Date signature mandat'] = input.signatureDate || new Date().toISOString().split('T')[0];
      }
      
      // Ajouter les infos Stripe si fournies (transition En attente → Actif)
      if (input.stripeCustomerId) {
        updates['Stripe Customer ID'] = input.stripeCustomerId;
      }
      if (input.stripeSubscriptionId) {
        updates['Stripe Subscription ID'] = input.stripeSubscriptionId;
      }
      
      await updateAirtableClient(input.clientId, updates);
      
      console.log('[Client Router] Client status updated successfully');
      
      return {
        success: true,
        message: `Statut mis à jour: ${input.status}`,
      };
    }),

  /**
   * Récupère un client par email
   */
  getByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const clientId = await findClientByEmail(input.email);
      
      if (!clientId) {
        return {
          found: false,
          clientId: null,
        };
      }
      
      return {
        found: true,
        clientId,
      };
    }),
});
