/**
 * Webhook Stripe pour WIN WIN Finance Group
 * Gère les événements Stripe (paiements, abonnements)
 */

import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { ENV } from '../_core/env';
import { createClientInAirtable } from '../airtable';
import { notifyOwner } from '../_core/notification';
import { sendWelcomeEmail as sendWelcomeEmailOld, sendOwnerNotificationEmail } from '../email';
import { sendWelcomeEmail } from '../lib/email-service';
import { generateUploadToken } from '../routers/documents';
import { enrichClientWithReferral } from '../lib/family-referral';

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
});



/**
 * Handler du webhook Stripe
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('[Webhook] Signature Stripe manquante');
    return res.status(400).send('Signature manquante');
  }
  
  let event: Stripe.Event;
  
  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error('[Webhook] Erreur de vérification signature:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  console.log('[Webhook] Événement reçu:', event.type);
  
  // Gérer les différents types d'événements
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('[Webhook] Paiement réussi pour session:', session.id);
      console.log('[Webhook] Customer:', session.customer);
      console.log('[Webhook] Subscription:', session.subscription);
      console.log('[Webhook] Metadata:', session.metadata);
      
      // Extraire les données du client depuis les metadata
      const clientName = session.metadata?.clientName || '';
      const clientEmail = session.customer_email || session.metadata?.clientEmail || '';
      const clientType = session.metadata?.clientType as 'particulier' | 'entreprise' || 'particulier';
      const clientAge = session.metadata?.clientAge ? parseInt(session.metadata.clientAge) : undefined;
      const clientEmployeeCount = session.metadata?.clientEmployeeCount ? parseInt(session.metadata.clientEmployeeCount) : undefined;
      const annualPrice = session.metadata?.annualPrice ? parseFloat(session.metadata.annualPrice) : 0;
      const isFree = session.metadata?.isFree === 'true';
      const signatureUrl = session.metadata?.signatureUrl;
      const codeParrainageUtilise = session.metadata?.codeParrainageUtilise;
      const lienParente = session.metadata?.lienParente;
      
      // Séparer nom et prénom (format "Prénom Nom")
      const nameParts = clientName.split(' ');
      const prenom = nameParts[0] || '';
      const nom = nameParts.slice(1).join(' ') || '';
      
      try {
        // Préparer les données client de base
        const baseClientData = {
          nom,
          prenom,
          email: clientEmail,
          typeClient: (clientType === 'particulier' ? 'Particulier' : 'Entreprise') as 'Particulier' | 'Entreprise',
          age: clientAge,
          nbEmployes: clientEmployeeCount,
          tarifApplicable: annualPrice,
          mandatOffert: isFree,
          dateSignatureMandat: new Date().toISOString().split('T')[0],
          signatureUrl, // URL S3 de la signature
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        };
        
        // Enrichir avec le système de parrainage
        const clientDataWithReferral = await enrichClientWithReferral(
          baseClientData,
          codeParrainageUtilise,
          lienParente
        );
        
        // Créer le client dans Airtable
        const airtableRecord = await createClientInAirtable(clientDataWithReferral);
        
        const mandatNumber = `WW-${new Date().getFullYear()}-${airtableRecord.id.substring(3, 8).toUpperCase()}`;
        
        console.log('[Webhook] Client créé dans Airtable:', airtableRecord.id);
        console.log('[Webhook] Numéro de mandat:', mandatNumber);
        
        // Générer le token d'upload de documents
        const typeClientForToken = clientDataWithReferral.typeClient === 'Particulier' ? 'Particulier' : 'Entreprise';
        const uploadToken = generateUploadToken(
          clientEmail,
          prenom,
          nom,
          typeClientForToken
        );
        
        console.log('[Webhook] Token upload généré pour', clientEmail);
        
        // Envoyer l'email de bienvenue au client avec lien upload
        await sendWelcomeEmail({
          email: clientEmail,
          prenom,
          nom,
          pdfMandatUrl: 'https://www.winwin.swiss/merci', // TODO: Générer le PDF mandat
          codeParrainage: clientDataWithReferral.codeParrainage || 'N/A',
          montantPaye: annualPrice,
          uploadToken,
          typeClient: typeClientForToken,
        });
        
        // Notifier Olivier (notification Manus)
        await notifyOwner({
          title: 'Nouveau client payé ✅',
          content: `**Nouveau client WIN WIN Finance Group**\n\n` +
                   `👤 **Nom** : ${clientName}\n` +
                   `📧 **Email** : ${clientEmail}\n` +
                   `💰 **Tarif** : CHF ${annualPrice}.-/an\n` +
                   `📋 **Type** : ${clientType === 'particulier' ? 'Particulier' : 'Entreprise'}\n` +
                   `🔢 **Mandat** : ${mandatNumber}\n` +
                   `📅 **Date** : ${new Date().toLocaleDateString('fr-CH')}\n\n` +
                   `[Voir dans Airtable](https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${airtableRecord.id})`
        });
        
        // Envoyer email notification à Olivier
        await sendOwnerNotificationEmail(
          clientName,
          clientEmail,
          clientType === 'particulier' ? 'Particulier' : 'Entreprise',
          annualPrice,
          mandatNumber,
          airtableRecord.id
        );
        
        console.log('[Webhook] Notifications envoyées à Olivier');
        
      } catch (error: any) {
        console.error('[Webhook] Erreur lors de la création du client:', error);
        // Ne pas renvoyer d'erreur à Stripe pour éviter les retries infinis
        // On log l'erreur et on continue
      }
      
      break;
    }
    
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('[Webhook] Abonnement créé:', subscription.id);
      // TODO: Mettre à jour Airtable si nécessaire
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('[Webhook] Abonnement mis à jour:', subscription.id);
      // TODO: Mettre à jour Airtable si nécessaire
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('[Webhook] Abonnement annulé:', subscription.id);
      // TODO: Mettre à jour le statut dans Airtable
      break;
    }
    
    case 'invoice.payment_succeeded':
    case 'invoice.payment_failed':
    case 'invoice.payment_action_required': {
      // Déléguer au module de traitement des webhooks
      const { processStripeWebhook } = await import('../lib/stripe-webhooks');
      const result = await processStripeWebhook(event);
      
      if (!result.success) {
        console.error(`[Webhook] Erreur traitement ${event.type}:`, result.message);
      }
      break;
    }
    
    default:
      console.log('[Webhook] Événement non géré:', event.type);
  }
  
  // Renvoyer une réponse 200 à Stripe
  res.json({ received: true });
}
