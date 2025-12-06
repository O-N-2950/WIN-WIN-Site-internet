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
  createClientInAirtable,
  updateClientInAirtable,
  findClientByEmail,
  uploadSignatureToAirtable,
  uploadPdfToAirtable,
} from '../airtable';
import { generateMandatPDF, type MandatData } from '../pdf-generator';
import { uploadToCloudinary } from '../lib/cloudinary-upload';
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
        
        // Parrainage
        codeParrainage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log('[Client Router] Creating new client (Prospect):', input.email);
      
      // Vérifier si le client existe déjà
      const existingClientId = await findClientByEmail(input.email);
      if (existingClientId) {
        throw new Error('Un client avec cet email existe déjà');
      }
      
      // Gérer le parrainage et le groupe familial
      let groupeFamilial: string | undefined;
      let relationsFamiliales: string | undefined;
      
      if (input.codeParrainage) {
        console.log('[Client Router] Code de parrainage fourni:', input.codeParrainage);
        
        // Valider le code et récupérer les infos du parrain
        const { validateReferralCode } = await import('../lib/parrainage');
        const referrer = await validateReferralCode(input.codeParrainage);
        
        if (referrer) {
          console.log('[Client Router] Parrain trouvé:', referrer.nom);
          
          // Récupérer le groupe familial du parrain depuis Airtable
          const { getClientById } = await import('../airtable');
          const referrerData = await getClientById(referrer.id);
          
          if (referrerData && referrerData['Groupe Familial']) {
            // Scénario 1: Le parrain a déjà un groupe familial
            groupeFamilial = referrerData['Groupe Familial'] as string;
            console.log('[Client Router] Rejoindre groupe existant:', groupeFamilial);
          } else {
            // Scénario 2: Le parrain n'a pas de groupe, créer un nouveau groupe
            const { generateFamilyCode } = await import('../lib/parrainage');
            groupeFamilial = `FAMILLE-${generateFamilyCode(referrer.nom)}`;
            console.log('[Client Router] Création nouveau groupe:', groupeFamilial);
            
            // Mettre à jour le parrain avec le nouveau groupe et le marquer comme fondateur
            await updateClientInAirtable(referrer.id, {
              'Groupe Familial': groupeFamilial,
              'Relations familiales': 'Membre fondateur',
            });
            console.log('[Client Router] Parrain mis à jour comme fondateur');
          }
          
          // Le nouveau client rejoint le groupe (pas fondateur)
          relationsFamiliales = undefined; // Sera défini manuellement dans Airtable
        } else {
          console.warn('[Client Router] Code de parrainage invalide:', input.codeParrainage);
        }
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
        'Groupe Familial': groupeFamilial,
        'Relations familiales': relationsFamiliales,
      };
      
      // Créer le client dans Airtable
      const recordId = await createClientInAirtable(clientData);
      
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
        
        // 3. Upload PDF vers Cloudinary
        const fileName = `mandat-${input.email.replace('@', '-at-')}-${Date.now()}.pdf`;
        const base64Data = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
        const pdfUrl = await uploadToCloudinary(base64Data, fileName, 'winwin-mandats');
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
          
          const recordIdPrive = await createClientInAirtable(clientDataPrive);
          console.log('[Client Router] Client PRIVÉ created:', recordIdPrive);
          
          // Upload signature vers Airtable
          if (input.signatureDataUrl) {
            await uploadSignatureToAirtable(recordIdPrive.id, input.signatureDataUrl);
            console.log('[Client Router] Signature uploadée pour client PRIVÉ');
          }
          
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
          const base64DataPrive = `data:application/pdf;base64,${pdfBufferPrive.toString('base64')}`;
          const pdfUrlPrive = await uploadToCloudinary(base64DataPrive, fileNamePrive, 'winwin-mandats');
          console.log('[Client Router] PDF PRIVÉ uploaded:', pdfUrlPrive);
          
          // Upload PDF PRIVÉ vers Airtable
          await uploadPdfToAirtable(recordIdPrive.id, pdfBufferPrive, fileNamePrive);
          console.log('[Client Router] PDF PRIVÉ uploadé vers Airtable');
          
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
          
          const recordIdEntreprise = await createClientInAirtable(clientDataEntreprise);
          console.log('[Client Router] Client ENTREPRISE created:', recordIdEntreprise);
          
          // Upload signature vers Airtable
          if (input.signatureDataUrl) {
            await uploadSignatureToAirtable(recordIdEntreprise.id, input.signatureDataUrl);
            console.log('[Client Router] Signature uploadée pour client ENTREPRISE');
          }
          
          // 4d. Générer PDF mandat ENTREPRISE
          const mandatDataEntreprise: MandatData = {
            ...mandatData,
            typeClient: 'entreprise',
            prenom: undefined,
            dateNaissance: undefined,
          };
          const pdfBufferEntreprise = await generateMandatPDF(mandatDataEntreprise);
          const fileNameEntreprise = `mandat-entreprise-${input.email.replace('@', '-at-')}-${Date.now()}.pdf`;
          const base64DataEntreprise = `data:application/pdf;base64,${pdfBufferEntreprise.toString('base64')}`;
          const pdfUrlEntreprise = await uploadToCloudinary(base64DataEntreprise, fileNameEntreprise, 'winwin-mandats');
          console.log('[Client Router] PDF ENTREPRISE uploaded:', pdfUrlEntreprise);
          
          // Upload PDF ENTREPRISE vers Airtable
          await uploadPdfToAirtable(recordIdEntreprise.id, pdfBufferEntreprise, fileNameEntreprise);
          console.log('[Client Router] PDF ENTREPRISE uploadé vers Airtable');
          
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
        
        const recordId = await createClientInAirtable(clientData);
        console.log('[Client Router] Client created in Airtable:', recordId);
        
        // Upload signature vers Airtable
        if (input.signatureDataUrl) {
          await uploadSignatureToAirtable(recordId.id, input.signatureDataUrl);
          console.log('[Client Router] Signature uploadée pour client');
        }
        
        // Upload PDF mandat vers Airtable
        await uploadPdfToAirtable(recordId.id, pdfBuffer, fileName);
        console.log('[Client Router] PDF mandat uploadé vers Airtable');
        
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
      
      await updateClientInAirtable(input.clientId, updates);
      
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
