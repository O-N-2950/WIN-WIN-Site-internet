import Stripe from "stripe";
import { ENV } from "../_core/env";
import { sendOwnerNotificationEmail } from "../email";
import { updateClientAfterPayment } from "../airtable-crm";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-10-29.clover",
});

/**
 * Traite un événement webhook Stripe
 * Synchronise les paiements avec Airtable et envoie des notifications
 */
export async function processStripeWebhook(event: Stripe.Event): Promise<{
  success: boolean;
  message: string;
  event: {
    id: string;
    type: string;
  };
}> {
  console.log(`[Stripe Webhook] Événement reçu: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case "invoice.payment_action_required": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentActionRequired(invoice);
        break;
      }

      default:
        console.log(`[Stripe Webhook] Type d'événement non géré: ${event.type}`);
    }

    return {
      success: true,
      message: `Événement ${event.type} traité avec succès`,
      event: {
        id: event.id,
        type: event.type,
      },
    };
  } catch (error) {
    console.error(`[Stripe Webhook] Erreur lors du traitement de l'événement ${event.id}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erreur inconnue",
      event: {
        id: event.id,
        type: event.type,
      },
    };
  }
}

/**
 * Gère un paiement réussi
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  console.log(`[Stripe Webhook] Paiement réussi: ${invoice.id}`);

  const customerEmail = invoice.customer_email;
  const amount = invoice.amount_paid / 100; // Convertir centimes en CHF
  const invoiceId = invoice.id;
  const customerId = invoice.customer as string;

  if (!customerEmail) {
    console.error("[Stripe Webhook] Email client manquant dans la facture");
    return;
  }

  // Calculer la prochaine date de facturation (+1 an)
  const nextBillingDate = new Date();
  nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);

  // Mettre à jour Airtable
  try {
    await updateClientAfterPayment({
      email: customerEmail,
      statutPaiement: "Payé",
      dateDernierPaiement: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
      montantDernierPaiement: amount,
      stripeInvoiceId: invoiceId,
      dateProchaineFact: nextBillingDate.toISOString().split("T")[0],
    });

    console.log(`[Stripe Webhook] Client ${customerEmail} mis à jour dans Airtable`);
  } catch (error) {
    console.error(`[Stripe Webhook] Erreur mise à jour Airtable pour ${customerEmail}:`, error);
  }

  // Envoyer notification email à Olivier
  try {
    // TODO: Récupérer le nom du client depuis Airtable pour personnaliser
    console.log(`[Stripe Webhook] Notification: Paiement reçu de ${customerEmail} - CHF ${amount.toFixed(2)}`);
    console.log(`[Stripe Webhook] Prochaine facturation: ${nextBillingDate.toLocaleDateString("fr-CH")}`);
    // Note: sendOwnerNotificationEmail nécessite 6 paramètres, à implémenter après récupération des données client
  } catch (error) {
    console.error("[Stripe Webhook] Erreur logging notification:", error);
  }
}

/**
 * Gère un paiement échoué
 */
async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  console.log(`[Stripe Webhook] Paiement échoué: ${invoice.id}`);

  const customerEmail = invoice.customer_email;
  const amount = invoice.amount_due / 100;
  const invoiceId = invoice.id;

  if (!customerEmail) {
    console.error("[Stripe Webhook] Email client manquant dans la facture");
    return;
  }

  // Mettre à jour Airtable
  try {
    await updateClientAfterPayment({
      email: customerEmail,
      statutPaiement: "Échec",
      stripeInvoiceId: invoiceId,
    });

    console.log(`[Stripe Webhook] Statut "Échec" enregistré pour ${customerEmail}`);
  } catch (error) {
    console.error(`[Stripe Webhook] Erreur mise à jour Airtable pour ${customerEmail}:`, error);
  }

  // Envoyer notification email à Olivier
  try {
    console.log(`[Stripe Webhook] ALERTE: Échec de paiement pour ${customerEmail} - CHF ${amount.toFixed(2)}`);
    console.log(`[Stripe Webhook] Action requise: Contacter le client`);
    // Note: sendOwnerNotificationEmail nécessite 6 paramètres, à implémenter après récupération des données client
  } catch (error) {
    console.error("[Stripe Webhook] Erreur logging alerte:", error);
  }
}

/**
 * Gère un paiement nécessitant une action (ex: 3D Secure)
 */
async function handlePaymentActionRequired(invoice: Stripe.Invoice): Promise<void> {
  console.log(`[Stripe Webhook] Action requise pour le paiement: ${invoice.id}`);

  const customerEmail = invoice.customer_email;
  const amount = invoice.amount_due / 100;
  const invoiceId = invoice.id;

  if (!customerEmail) {
    console.error("[Stripe Webhook] Email client manquant dans la facture");
    return;
  }

  // Mettre à jour Airtable
  try {
    await updateClientAfterPayment({
      email: customerEmail,
      statutPaiement: "Tentative en cours",
      stripeInvoiceId: invoiceId,
    });

    console.log(`[Stripe Webhook] Statut "Tentative en cours" enregistré pour ${customerEmail}`);
  } catch (error) {
    console.error(`[Stripe Webhook] Erreur mise à jour Airtable pour ${customerEmail}:`, error);
  }

  // Envoyer notification email à Olivier
  try {
    console.log(`[Stripe Webhook] INFO: Action requise pour ${customerEmail} - CHF ${amount.toFixed(2)}`);
    console.log(`[Stripe Webhook] Le client doit compléter l'authentification 3D Secure`);
    // Note: sendOwnerNotificationEmail nécessite 6 paramètres, à implémenter après récupération des données client
  } catch (error) {
    console.error("[Stripe Webhook] Erreur logging info:", error);
  }
}


