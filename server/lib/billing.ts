/**
 * Module de facturation automatique pour WIN WIN Finance Group
 * 
 * Fonctionnalités :
 * - Vérification quotidienne des clients à facturer
 * - Création automatique des factures Stripe
 * - Calcul automatique des rabais familiaux
 * - Gestion des mandats offerts (pas de facturation)
 * - Mise à jour automatique de la date de prochaine facturation
 */

import Stripe from "stripe";
import { ENV } from "../_core/env";
import {
  getFamilyMembers,
  calculateFamilyDiscount,
  applyFamilyDiscount,
  generateInvoiceDescription,
  generateFamilyMembersSummary,
} from "./parrainage";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Configuration Airtable pour la table Clients
 */
const AIRTABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tableId: 'tblWPcIpGmBZ3ASGI', // Table Clients
  apiKey: process.env.AIRTABLE_API_KEY || '',
};

/**
 * Interface pour un client à facturer
 */
interface ClientToBill {
  recordId: string;
  nom: string;
  prenom?: string;
  email: string;
  stripeCustomerId: string;
  tarifApplicable: number;
  groupeFamilial?: string;
  mandatOffert: boolean;
  dateProchaineFact: string;
}

/**
 * Récupérer tous les clients à facturer aujourd'hui
 * 
 * @returns Liste des clients à facturer
 */
async function getClientsToBillToday(): Promise<ClientToBill[]> {
  const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

  try {
    // Rechercher tous les clients dont la date de prochaine facturation est aujourd'hui
    // ET qui n'ont PAS de mandat offert
    const filterFormula = `AND({Date prochaine facturation}='${today}', {Mandat offert}=FALSE(), {Stripe Customer ID}!='')`;
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Billing] Erreur récupération clients:', errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const result = await response.json();

    return result.records.map((record: any) => ({
      recordId: record.id,
      nom: record.fields['NOM du client'] as string,
      prenom: record.fields['Prénom'] as string | undefined,
      email: record.fields['Email'] as string,
      stripeCustomerId: record.fields['Stripe Customer ID'] as string,
      tarifApplicable: record.fields['Tarif applicable'] as number,
      groupeFamilial: record.fields['Groupe Familial'] as string | undefined,
      mandatOffert: record.fields['Mandat offert'] as boolean || false,
      dateProchaineFact: record.fields['Date prochaine facturation'] as string,
    }));
  } catch (error) {
    console.error('[Billing] Erreur:', error);
    throw error;
  }
}

/**
 * Créer une facture Stripe pour un client
 * 
 * @param client - Client à facturer
 * @returns ID de la facture créée
 */
async function createInvoiceForClient(client: ClientToBill): Promise<string> {
  console.log(`[Billing] Création facture pour ${client.email}...`);

  // Récupérer les membres de la famille si applicable
  let familyMembers: Awaited<ReturnType<typeof getFamilyMembers>> = [];
  let discountPercent = 0;
  let finalPrice = client.tarifApplicable;

  if (client.groupeFamilial) {
    familyMembers = await getFamilyMembers(client.groupeFamilial);
    discountPercent = calculateFamilyDiscount(familyMembers.length);
    finalPrice = applyFamilyDiscount(client.tarifApplicable, discountPercent);

    console.log(`[Billing] Famille de ${familyMembers.length} membres, rabais ${discountPercent}%`);
    console.log(`[Billing] Prix: ${client.tarifApplicable} CHF → ${finalPrice} CHF`);
  }

  // Générer la description de la facture
  const description = generateInvoiceDescription(familyMembers, discountPercent);

  try {
    // Créer un item de facture (invoice item)
    await stripe.invoiceItems.create({
      customer: client.stripeCustomerId,
      amount: Math.round(finalPrice * 100), // Convertir en centimes
      currency: 'chf',
      description,
    });

    // Créer la facture
    const invoice = await stripe.invoices.create({
      customer: client.stripeCustomerId,
      auto_advance: true, // Finaliser automatiquement la facture
      collection_method: 'charge_automatically', // Prélèvement automatique
      description,
      metadata: {
        clientName: client.prenom ? `${client.prenom} ${client.nom}` : client.nom,
        clientEmail: client.email,
        basePrice: client.tarifApplicable.toString(),
        familyDiscount: discountPercent.toString(),
        finalPrice: finalPrice.toString(),
        familyMembers: familyMembers.length > 0 ? generateFamilyMembersSummary(familyMembers) : '',
        groupeFamilial: client.groupeFamilial || '',
      },
    });

    // Finaliser la facture pour déclencher le paiement
    await stripe.invoices.finalizeInvoice(invoice.id);

    console.log(`[Billing] Facture créée: ${invoice.id}`);

    return invoice.id;
  } catch (error: any) {
    console.error(`[Billing] Erreur création facture pour ${client.email}:`, error.message);
    throw error;
  }
}

/**
 * Mettre à jour la date de prochaine facturation dans Airtable
 * 
 * @param recordId - ID du record Airtable
 * @param invoiceId - ID de la facture Stripe créée
 */
async function updateNextBillingDate(recordId: string, invoiceId: string): Promise<void> {
  // Calculer la prochaine date de facturation (+360 jours)
  const today = new Date();
  const nextBillingDate = new Date(today);
  nextBillingDate.setDate(nextBillingDate.getDate() + 360);
  const nextBillingDateStr = nextBillingDate.toISOString().split('T')[0];
  const todayStr = today.toISOString().split('T')[0];

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}/${recordId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          'Date prochaine facturation': nextBillingDateStr,
          'Stripe Invoice ID': invoiceId,
          'Statut Paiement': 'En attente', // Sera mis à jour par le webhook après paiement
          'date dernière facture établie': todayStr, // Mettre à jour la date de dernière facturation
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Billing] Erreur mise à jour date:', errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    console.log(`[Billing] Prochaine facturation: ${nextBillingDateStr} (+360 jours)`);
    console.log(`[Billing] Date dernière facture: ${todayStr}`);
  } catch (error) {
    console.error('[Billing] Erreur:', error);
    throw error;
  }
}

/**
 * Traiter la facturation quotidienne
 * Cette fonction doit être appelée chaque jour (via cron job)
 * 
 * @returns Résumé de la facturation
 */
export async function processDailyBilling(): Promise<{
  success: boolean;
  processed: number;
  failed: number;
  skipped: number;
  errors: string[];
}> {
  console.log('[Billing] Démarrage de la facturation quotidienne...');

  const result = {
    success: true,
    processed: 0,
    failed: 0,
    skipped: 0,
    errors: [] as string[],
  };

  try {
    // Récupérer les clients à facturer aujourd'hui
    const clients = await getClientsToBillToday();

    console.log(`[Billing] ${clients.length} client(s) à facturer aujourd'hui`);

    if (clients.length === 0) {
      console.log('[Billing] Aucun client à facturer aujourd\'hui');
      return result;
    }

    // Traiter chaque client
    for (const client of clients) {
      try {
        // Vérifier si le mandat est offert (double sécurité)
        if (client.mandatOffert) {
          console.log(`[Billing] SKIP ${client.email} - Mandat offert`);
          result.skipped++;
          continue;
        }

        // Créer la facture
        const invoiceId = await createInvoiceForClient(client);

        // Mettre à jour la date de prochaine facturation
        await updateNextBillingDate(client.recordId, invoiceId);

        result.processed++;
        console.log(`[Billing] ✅ ${client.email} - Facture ${invoiceId} créée`);
      } catch (error: any) {
        result.failed++;
        result.errors.push(`${client.email}: ${error.message}`);
        console.error(`[Billing] ❌ ${client.email} - Erreur:`, error.message);
      }
    }

    console.log('[Billing] Facturation quotidienne terminée');
    console.log(`[Billing] Résumé: ${result.processed} traités, ${result.failed} échoués, ${result.skipped} ignorés`);

    if (result.failed > 0) {
      result.success = false;
    }

    return result;
  } catch (error: any) {
    console.error('[Billing] Erreur fatale:', error);
    result.success = false;
    result.errors.push(`Erreur fatale: ${error.message}`);
    return result;
  }
}
