/**
 * Router tRPC Contract - Gestion des contrats d'assurance
 * 
 * Ce router permet de créer des contrats liés à un client
 * en remplissant automatiquement les 5 champs de relation client.
 */

import { z } from 'zod';
import { publicProcedure, router } from '../_core/trpc';
import {
  createMultipleContracts,
  type ContractData,
} from '../lib/airtable';

export const contractRouter = router({
  /**
   * Crée plusieurs contrats pour un client
   * Les 5 champs de relation client sont remplis automatiquement
   */
  createMultiple: publicProcedure
    .input(
      z.object({
        clientId: z.string().min(1, 'Client ID requis'),
        contracts: z.array(
          z.object({
            // Champs obligatoires
            numeroContrat: z.string().min(1, 'Numéro de contrat requis'),
            typesContrats: z.array(z.string()).min(1, 'Au moins un type de contrat requis'),
            montantPrime: z.number().min(0, 'Montant de prime invalide'),
            modePaiement: z.enum(['Annuel', 'Semestriel', 'Trimestriel', 'Mensuel']),
            dateDebut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
            dateFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
            
            // Champs optionnels
            compagnieId: z.string().optional(), // Record ID de la compagnie dans Airtable
            objetAssurance: z.string().optional(),
            statutContrat: z.enum([
              'Actif',
              'En attente du contrat',
              'Résilié',
              'Libéré des primes',
              'Racheté',
              'Mandat Résilié',
              'Résilié pour échéance',
              'OFFRE',
              'Confirmation de résiliation en attente'
            ]).optional(),
            contratPdfUrl: z.string().url().optional(),
          })
        ).min(1, 'Au moins un contrat requis'),
      })
    )
    .mutation(async ({ input }) => {
      console.log(`[Contract Router] Creating ${input.contracts.length} contracts for client ${input.clientId}`);
      
      // Transformer les données d'entrée en format Airtable
      const contractsData = input.contracts.map((contract) => {
        const contractData: Omit<ContractData, 'lien table client depuis contrats' | 'Clients' | 'Clients 2' | 'Nom du clients' | 'Clients 3'> = {
          'Numéro du contrat': contract.numeroContrat,
          'types de contrats': contract.typesContrats,
          'Montant de la prime fractionnée ou annuelle CHF': contract.montantPrime,
          'Mode de paiement': contract.modePaiement,
          'Date début du contrat': contract.dateDebut,
          'Date fin du contrat': contract.dateFin,
          'Statut du contrat': contract.statutContrat || 'Actif',
        };
        
        // Ajouter la compagnie si fournie
        if (contract.compagnieId) {
          contractData.Compagnie = [contract.compagnieId];
        }
        
        // Ajouter l'objet d'assurance si fourni
        if (contract.objetAssurance) {
          contractData['Objet de l\'assurance (adresse, personne, véhicule etc )'] = contract.objetAssurance;
        }
        
        // Ajouter le PDF si fourni
        if (contract.contratPdfUrl) {
          contractData['Contrat PDF'] = [{ url: contract.contratPdfUrl }];
        }
        
        return contractData;
      });
      
      // Créer les contrats dans Airtable
      // La fonction createMultipleContracts remplit automatiquement les 5 champs de relation client
      const contractIds = await createMultipleContracts(input.clientId, contractsData);
      
      console.log(`[Contract Router] ${contractIds.length} contracts created successfully`);
      
      return {
        success: true,
        contractIds,
        message: `${contractIds.length} contrat(s) créé(s) avec succès`,
      };
    }),

  /**
   * Crée un seul contrat (helper pour simplifier l'API)
   */
  create: publicProcedure
    .input(
      z.object({
        clientId: z.string().min(1, 'Client ID requis'),
        numeroContrat: z.string().min(1, 'Numéro de contrat requis'),
        typesContrats: z.array(z.string()).min(1, 'Au moins un type de contrat requis'),
        montantPrime: z.number().min(0, 'Montant de prime invalide'),
        modePaiement: z.enum(['Annuel', 'Semestriel', 'Trimestriel', 'Mensuel']),
        dateDebut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
        dateFin: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
        compagnieId: z.string().optional(),
        objetAssurance: z.string().optional(),
        statutContrat: z.enum([
          'Actif',
          'En attente du contrat',
          'Résilié',
          'Libéré des primes',
          'Racheté',
          'Mandat Résilié',
          'Résilié pour échéance',
          'OFFRE',
          'Confirmation de résiliation en attente'
        ]).optional(),
        contratPdfUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { clientId, ...contractData } = input;
      
      // Réutiliser createMultiple avec un seul contrat
      const result = await createMultipleContracts(clientId, [contractData as any]);
      
      return {
        success: true,
        contractId: result[0],
        message: 'Contrat créé avec succès',
      };
    }),
});
