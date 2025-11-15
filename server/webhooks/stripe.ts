/**
 * Webhook Stripe pour WIN WIN Finance Group
 * Gère les événements Stripe (paiements, abonnements)
 */

import type { Request, Response } from 'express';
import Stripe from 'stripe';
import { ENV } from '../_core/env';
import { createClientInAirtable } from '../airtable';
import { notifyOwner } from '../_core/notification';

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
});

/**
 * Envoyer un email de bienvenue au client
 */
async function sendWelcomeEmail(clientEmail: string, clientName: string, mandatNumber: string) {
  // TODO: Implémenter avec un service d'email (SendGrid, Mailgun, etc.)
  // Pour le moment, on log simplement
  console.log('[Email] Envoi email de bienvenue à:', clientEmail);
  console.log('[Email] Nom:', clientName);
  console.log('[Email] Numéro de mandat:', mandatNumber);
  
  // Template email :
  // Sujet: Bienvenue chez WIN WIN Finance Group - Votre mandat est activé !
  // Corps:
  // Bonjour {clientName},
  //
  // Félicitations ! Votre mandat de gestion WIN WIN Finance Group est maintenant activé.
  //
  // Numéro de mandat : {mandatNumber}
  //
  // Prochaines étapes :
  // 1. Vous recevrez un email dans les 48h pour planifier votre rendez-vous d'analyse
  // 2. Olivier Neukomm vous contactera personnellement pour faire le point sur vos besoins
  // 3. Vous aurez accès à votre espace client pour suivre vos contrats
  //
  // Accédez à votre espace client : https://airtable.com/appZQkRJ7PwOtdQ3O/shrJqT8kxxxxxxx
  //
  // Merci de votre confiance !
  //
  // L'équipe WIN WIN Finance Group
  // 032 466 11 00
  // contact@winwin.swiss
  
  return true;
}

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
      
      // Séparer nom et prénom (format "Prénom Nom")
      const nameParts = clientName.split(' ');
      const prenom = nameParts[0] || '';
      const nom = nameParts.slice(1).join(' ') || '';
      
      try {
        // Créer le client dans Airtable
        const airtableRecord = await createClientInAirtable({
          nom,
          prenom,
          email: clientEmail,
          typeClient: clientType === 'particulier' ? 'Particulier' : 'Entreprise',
          age: clientAge,
          nbEmployes: clientEmployeeCount,
          tarifApplicable: annualPrice,
          mandatOffert: isFree,
          dateSignatureMandat: new Date().toISOString().split('T')[0],
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
        });
        
        const mandatNumber = `WW-${new Date().getFullYear()}-${airtableRecord.id.substring(3, 8).toUpperCase()}`;
        
        console.log('[Webhook] Client créé dans Airtable:', airtableRecord.id);
        console.log('[Webhook] Numéro de mandat:', mandatNumber);
        
        // Envoyer l'email de bienvenue au client
        await sendWelcomeEmail(clientEmail, clientName, mandatNumber);
        
        // Notifier Olivier
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
        
        console.log('[Webhook] Notification envoyée à Olivier');
        
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
    
    default:
      console.log('[Webhook] Événement non géré:', event.type);
  }
  
  // Renvoyer une réponse 200 à Stripe
  res.json({ received: true });
}
