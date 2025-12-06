/**
 * Module de paiement Stripe avec gestion des rabais familiaux
 * WIN WIN Finance Group
 */

import Stripe from 'stripe';
import { ENV } from '../_core/env';
import { getClientById } from './airtable';

// Initialiser Stripe
const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2024-11-20.acacia',
});

/**
 * Interface pour les données de création d'abonnement
 */
export interface CreateSubscriptionData {
  clientId: string; // ID du client dans Airtable
  email: string;
  nom: string;
  prenom: string;
  prixBase: number; // Prix de base du mandat (avant rabais)
  prixFinal: number; // Prix final avec rabais familial
  rabaisFamilial: number; // Pourcentage de rabais (0-20)
  groupeFamilial?: string; // Code du groupe familial (ex: FAMILLE-NEUKOMM-SeLs)
  membresFamille?: string[]; // Liste des noms des membres du groupe
}

/**
 * Créer un abonnement Stripe avec rabais familial pour un nouveau client
 * 
 * @param data Données du client et du rabais
 * @returns Session de paiement Stripe
 */
export async function createSubscriptionWithDiscount(
  data: CreateSubscriptionData
): Promise<Stripe.Checkout.Session> {
  try {
    // 1. Créer un Price ID dynamique avec le prix final (au lieu d'utiliser un coupon)
    const price = await stripe.prices.create({
      currency: 'chf',
      unit_amount: Math.round(data.prixFinal * 100), // Convertir en centimes
      recurring: {
        interval: 'year',
        interval_count: 1,
      },
      product_data: {
        name: 'Mandat de Gestion Annuel - WIN WIN Finance Group',
        description: data.groupeFamilial
          ? `Groupe familial: ${data.groupeFamilial} (${data.rabaisFamilial}% de rabais)`
          : 'Mandat de gestion individuel',
      },
    });

    // 2. Construire la description détaillée de la facture
    const descriptionLignes: string[] = [
      '🏦 MANDAT DE GESTION ANNUEL - WIN WIN FINANCE GROUP',
      '',
    ];

    // Ajouter les informations du groupe familial si applicable
    if (data.groupeFamilial && data.membresFamille && data.membresFamille.length > 0) {
      descriptionLignes.push(`👨‍👩‍👧‍👦 Groupe Familial: ${data.groupeFamilial}`);
      descriptionLignes.push(`📊 Nombre de membres: ${data.membresFamille.length}`);
      descriptionLignes.push('');
      descriptionLignes.push('👥 Membres actifs du groupe:');
      data.membresFamille.forEach((membre, index) => {
        descriptionLignes.push(`   ${index + 1}. ${membre}`);
      });
      descriptionLignes.push('');
      descriptionLignes.push('💰 CALCUL DU TARIF:');
      descriptionLignes.push(`   Prix base mandat:        CHF ${data.prixBase.toFixed(2)}`);
      descriptionLignes.push(`   Rabais familial (-${data.rabaisFamilial}%):  -CHF ${(data.prixBase * data.rabaisFamilial / 100).toFixed(2)}`);
      descriptionLignes.push(`   ────────────────────────────────`);
      descriptionLignes.push(`   PRIX FINAL:              CHF ${data.prixFinal.toFixed(2)}`);
      descriptionLignes.push(`   Économie annuelle:       CHF ${(data.prixBase - data.prixFinal).toFixed(2)}`);
    } else {
      descriptionLignes.push('💰 TARIF:');
      descriptionLignes.push(`   Prix annuel:             CHF ${data.prixFinal.toFixed(2)}`);
    }

    descriptionLignes.push('');
    descriptionLignes.push('✅ Prestations incluses:');
    descriptionLignes.push('   • Analyse complète de vos assurances');
    descriptionLignes.push('   • Optimisation des primes');
    descriptionLignes.push('   • Gestion des sinistres');
    descriptionLignes.push('   • Suivi personnalisé annuel');
    descriptionLignes.push('   • Conseil indépendant (sans commission)');

    const description = descriptionLignes.join('\n');

    // 3. Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      customer_email: data.email,
      subscription_data: {
        description: description,
        metadata: {
          clientId: data.clientId,
          groupeFamilial: data.groupeFamilial || '',
          rabaisFamilial: data.rabaisFamilial.toString(),
          prixBase: data.prixBase.toString(),
          prixFinal: data.prixFinal.toString(),
          membresFamille: data.membresFamille?.join(', ') || '',
          nombreMembres: data.membresFamille?.length.toString() || '1',
        },
      },
      metadata: {
        clientId: data.clientId,
        nom: data.nom,
        prenom: data.prenom,
        groupeFamilial: data.groupeFamilial || '',
        rabaisFamilial: data.rabaisFamilial.toString(),
      },
      success_url: `${ENV.frontendUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${ENV.frontendUrl}/paiement?canceled=true`,
    });

    console.log('[Stripe Payment] Session créée:', {
      sessionId: session.id,
      clientId: data.clientId,
      prixFinal: data.prixFinal,
      rabaisFamilial: data.rabaisFamilial,
      groupeFamilial: data.groupeFamilial,
    });

    return session;
  } catch (error) {
    console.error('[Stripe Payment] Erreur création session:', error);
    throw new Error(
      `Erreur lors de la création de la session de paiement: ${
        error instanceof Error ? error.message : 'Erreur inconnue'
      }`
    );
  }
}

/**
 * Récupérer les informations de paiement d'un client depuis Airtable
 * 
 * @param clientId ID du client dans Airtable
 * @returns Données nécessaires pour créer l'abonnement Stripe
 */
export async function getClientPaymentData(
  clientId: string
): Promise<CreateSubscriptionData | null> {
  try {
    const client = await getClientById(clientId);
    if (!client) {
      console.error('[Stripe Payment] Client non trouvé:', clientId);
      return null;
    }

    // Récupérer les données du client depuis Airtable
    const prixBase = client.fields['Prix base mandat'] as number || 0;
    const prixFinal = client.fields['Prix final avec rabais'] as number || prixBase;
    const rabaisFamilial = client.fields['Rabais familial %'] as number || 0;
    const groupeFamilial = client.fields['Groupe Familial'] as string;
    const email = client.fields['Email du client (table client)'] as string;
    const nom = client.fields['Nom'] as string;
    const prenom = client.fields['Prénom'] as string;

    // Récupérer la liste des membres de la famille (si disponible)
    // TODO: Implémenter la récupération de la liste des membres via le champ "Membres de la famille"
    const membresFamille: string[] = [];
    if (groupeFamilial) {
      // Pour l'instant, on utilise juste le nom du client
      membresFamille.push(`${prenom} ${nom}`);
    }

    return {
      clientId,
      email,
      nom,
      prenom,
      prixBase,
      prixFinal,
      rabaisFamilial,
      groupeFamilial,
      membresFamille,
    };
  } catch (error) {
    console.error('[Stripe Payment] Erreur récupération données client:', error);
    return null;
  }
}

/**
 * Créer une facture Stripe pour un client existant (facturation récurrente)
 * 
 * @param clientId ID du client dans Airtable
 * @param subscriptionId ID de l'abonnement Stripe
 * @returns Facture Stripe créée
 */
export async function createRecurringInvoice(
  clientId: string,
  subscriptionId: string
): Promise<Stripe.Invoice | null> {
  try {
    // Récupérer les données du client
    const paymentData = await getClientPaymentData(clientId);
    if (!paymentData) {
      console.error('[Stripe Payment] Impossible de récupérer les données du client:', clientId);
      return null;
    }

    // Récupérer l'abonnement Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!subscription) {
      console.error('[Stripe Payment] Abonnement non trouvé:', subscriptionId);
      return null;
    }

    // Créer la facture avec les informations à jour
    const invoice = await stripe.invoices.create({
      customer: subscription.customer as string,
      subscription: subscriptionId,
      description: `Mandat de Gestion Annuel - ${paymentData.groupeFamilial || 'Individuel'}`,
      metadata: {
        clientId: paymentData.clientId,
        groupeFamilial: paymentData.groupeFamilial || '',
        rabaisFamilial: paymentData.rabaisFamilial.toString(),
        prixFinal: paymentData.prixFinal.toString(),
      },
    });

    console.log('[Stripe Payment] Facture récurrente créée:', {
      invoiceId: invoice.id,
      clientId: paymentData.clientId,
      prixFinal: paymentData.prixFinal,
    });

    return invoice;
  } catch (error) {
    console.error('[Stripe Payment] Erreur création facture récurrente:', error);
    return null;
  }
}
