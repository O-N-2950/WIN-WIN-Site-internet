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
