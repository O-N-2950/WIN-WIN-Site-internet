/**
 * Module de facturation récurrente automatique avec Stripe
 * 
 * Gère :
 * - Vérification quotidienne des dates de facturation
 * - Création automatique des factures Stripe
 * - Calcul du rabais familial
 * - Affichage des membres de la famille sur la facture
 * - Exclusion des mandats offerts
 * - Mise à jour des dates de facturation
 */

import Stripe from 'stripe';
import { searchRecords, listRecords, updateRecords } from '../airtable-crm';
import { getFamilyMembers, calculateFamilyDiscount } from './parrainage';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

interface ClientRecord {
  id: string;
  fields: {
    'NOM du client': string;
    'Email du client (table client)': string;
    'Tarif applicable mandat de gestion': number;
    'Mandat offert': boolean;
    'Statut du client': string;
    'Date prochaine facturation': string;
    'Stripe Subscription ID'?: string;
    'Groupe Familial'?: string;
    'Lien de Parenté'?: string;
  };
}

/**
 * Vérifier si un client est éligible à la facturation
 */
export function checkBillingEligibility(client: ClientRecord): {
  eligible: boolean;
  reason?: string;
} {
  // 1. Vérifier si le mandat est offert
  if (client.fields['Mandat offert']) {
    return { eligible: false, reason: 'Mandat offert - pas de facturation' };
  }

  // 2. Vérifier le statut du client
  const statut = client.fields['Statut du client'];
  if (statut !== 'Actif') {
    return { eligible: false, reason: `Statut: ${statut} - facturation désactivée` };
  }

  // 3. Vérifier si une date de facturation est définie
  if (!client.fields['Date prochaine facturation']) {
    return { eligible: false, reason: 'Aucune date de facturation définie' };
  }

  // 4. Vérifier si la date de facturation est aujourd'hui ou passée
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const billingDate = new Date(client.fields['Date prochaine facturation']);
  billingDate.setHours(0, 0, 0, 0);

  if (billingDate > today) {
    return { eligible: false, reason: 'Date de facturation future' };
  }

  return { eligible: true };
}

/**
 * Récupérer les détails du rabais familial pour un client
 */
async function getFamilyDiscountDetails(client: ClientRecord): Promise<{
  discount: number;
  members: Array<{ name: string; relation: string }>;
  familyCode: string | null;
}> {
  const familyCode = client.fields['Groupe Familial'];
  
  if (!familyCode) {
    return { discount: 0, members: [], familyCode: null };
  }

  try {
    // Récupérer tous les membres de la famille
    const members = await getFamilyMembers(familyCode);
    
    // Calculer le rabais
    const discountInfo = calculateFamilyDiscount(members.length);
    
    // Formater la liste des membres
    const membersList = members.map(m => ({
      name: m.fields['NOM du client'] || 'Membre',
      relation: m.fields['Lien de Parenté'] || 'Membre de la famille',
    }));

    return {
      discount: discountInfo.pourcentageRabais,
      members: membersList,
      familyCode,
    };
  } catch (error) {
    console.error('[Billing] Erreur récupération rabais familial:', error);
    return { discount: 0, members: [], familyCode };
  }
}

/**
 * Créer une facture Stripe pour un client
 */
export async function createStripeInvoice(client: ClientRecord): Promise<{
  success: boolean;
  invoiceId?: string;
  error?: string;
}> {
  try {
    const email = client.fields['Email du client (table client)'];
    const name = client.fields['NOM du client'];
    const basePrice = client.fields['Tarif applicable mandat de gestion'];

    if (!email) {
      return { success: false, error: 'Email client manquant' };
    }

    // Récupérer les détails du rabais familial
    const familyDetails = await getFamilyDiscountDetails(client);
    
    // Calculer le prix final
    const discountAmount = (basePrice * familyDetails.discount) / 100;
    const finalPrice = basePrice - discountAmount;

    // Créer ou récupérer le customer Stripe
    let customerId = client.fields['Stripe Subscription ID'];
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          airtable_record_id: client.id,
          family_code: familyDetails.familyCode || '',
        },
      });
      customerId = customer.id;
      
      // Mettre à jour Airtable avec le customer ID
      await updateRecords([{
        id: client.id,
        fields: { 'Stripe Subscription ID': customerId },
      }]);
    }

    // Construire la description de la facture avec les membres de la famille
    let description = `Mandat de Gestion WIN WIN Finance Group - ${name}\n\n`;
    description += `Prix de base : CHF ${basePrice.toFixed(2)}\n\n`;

    if (familyDetails.members.length > 0) {
      description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      description += `RABAIS FAMILIAL (${familyDetails.discount}%)\n`;
      description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      
      familyDetails.members.forEach((member, index) => {
        const icon = member.relation.includes('Fondateur') ? '👤' :
                     member.relation.includes('Conjoint') ? '💑' :
                     member.relation.includes('Enfant') || member.relation.includes('Fils') || member.relation.includes('Fille') ? '👶' :
                     member.relation.includes('Parent') || member.relation.includes('Père') || member.relation.includes('Mère') ? '👴' :
                     member.relation.includes('Entreprise') ? '🏢' : '👥';
        
        description += `${icon} ${member.name} (${member.relation})\n`;
      });
      
      description += `\n${familyDetails.members.length} membres × 2% = ${familyDetails.discount}% de rabais\n`;
      description += `Économie : -CHF ${discountAmount.toFixed(2)}\n\n`;
      description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
      description += `TOTAL À PAYER : CHF ${finalPrice.toFixed(2)}/an\n`;
      description += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
      description += `💡 Partagez votre code de parrainage pour augmenter le rabais !\n`;
    } else {
      description += `TOTAL À PAYER : CHF ${finalPrice.toFixed(2)}/an\n`;
    }

    // Créer la facture Stripe
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true, // Finaliser automatiquement
      collection_method: 'charge_automatically',
      description,
      metadata: {
        airtable_record_id: client.id,
        family_code: familyDetails.familyCode || '',
        family_discount: familyDetails.discount.toString(),
        base_price: basePrice.toString(),
        final_price: finalPrice.toString(),
      },
    });

    // Ajouter l'item de facturation
    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      amount: Math.round(finalPrice * 100), // Montant en centimes
      currency: 'chf',
      description: `Mandat de Gestion Annuel${familyDetails.discount > 0 ? ` (Rabais familial ${familyDetails.discount}%)` : ''}`,
    });

    // Finaliser et envoyer la facture
    await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(invoice.id);

    console.log('[Billing] Facture créée:', {
      invoiceId: invoice.id,
      client: name,
      basePrice,
      discount: familyDetails.discount,
      finalPrice,
      familyMembers: familyDetails.members.length,
    });

    // Mettre à jour la date de prochaine facturation (+1 an)
    const nextBillingDate = new Date(client.fields['Date prochaine facturation']);
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    
    await updateRecords([{
      id: client.id,
      fields: {
        'Date prochaine facturation': nextBillingDate.toISOString().split('T')[0],
      },
    }]);

    return { success: true, invoiceId: invoice.id };
  } catch (error: any) {
    console.error('[Billing] Erreur création facture:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Traiter toutes les facturations du jour
 */
export async function processDailyBilling(): Promise<{
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  details: Array<{ client: string; status: string; reason?: string }>;
}> {
  const results = {
    processed: 0,
    succeeded: 0,
    failed: 0,
    skipped: 0,
    details: [] as Array<{ client: string; status: string; reason?: string }>,
  };

  try {
    // Récupérer tous les clients actifs
    const clients = await listRecords({
      filterByFormula: "{Statut du client}='Actif'",
    });

    console.log(`[Billing] ${clients.length} clients actifs trouvés`);

    for (const client of clients as ClientRecord[]) {
      results.processed++;
      const clientName = client.fields['NOM du client'] || 'Client inconnu';

      // Vérifier l'éligibilité
      const eligibility = checkBillingEligibility(client);
      
      if (!eligibility.eligible) {
        results.skipped++;
        results.details.push({
          client: clientName,
          status: 'skipped',
          reason: eligibility.reason,
        });
        continue;
      }

      // Créer la facture
      const result = await createStripeInvoice(client);
      
      if (result.success) {
        results.succeeded++;
        results.details.push({
          client: clientName,
          status: 'success',
          reason: `Facture ${result.invoiceId} créée`,
        });
      } else {
        results.failed++;
        results.details.push({
          client: clientName,
          status: 'failed',
          reason: result.error,
        });
      }
    }

    console.log('[Billing] Traitement terminé:', results);
    return results;
  } catch (error: any) {
    console.error('[Billing] Erreur traitement quotidien:', error);
    throw error;
  }
}
