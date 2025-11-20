/**
 * Tests pour le webhook Stripe
 * Vérifie que le système de traitement des paiements fonctionne correctement
 */

import { describe, it, expect } from 'vitest';
import Stripe from 'stripe';
import { processStripeWebhook } from './stripe-webhooks';

describe('Stripe Webhook', () => {
  it('devrait traiter un événement invoice.payment_succeeded', async () => {
    // Créer un événement de test
    const mockEvent: Stripe.Event = {
      id: 'evt_test_123',
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'in_test_123',
          customer_email: 'test@example.com',
          amount_paid: 18500, // 185 CHF en centimes
          amount_due: 18500,
          customer: 'cus_test_123',
        } as any,
      },
    } as any;

    const result = await processStripeWebhook(mockEvent);

    expect(result.success).toBe(true);
    expect(result.event.type).toBe('invoice.payment_succeeded');
    expect(result.event.id).toBe('evt_test_123');
  });

  it('devrait traiter un événement invoice.payment_failed', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_456',
      type: 'invoice.payment_failed',
      data: {
        object: {
          id: 'in_test_456',
          customer_email: 'test@example.com',
          amount_paid: 0,
          amount_due: 18500,
          customer: 'cus_test_456',
        } as any,
      },
    } as any;

    const result = await processStripeWebhook(mockEvent);

    expect(result.success).toBe(true);
    expect(result.event.type).toBe('invoice.payment_failed');
  });

  it('devrait traiter un événement invoice.payment_action_required', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_789',
      type: 'invoice.payment_action_required',
      data: {
        object: {
          id: 'in_test_789',
          customer_email: 'test@example.com',
          amount_paid: 0,
          amount_due: 18500,
          customer: 'cus_test_789',
        } as any,
      },
    } as any;

    const result = await processStripeWebhook(mockEvent);

    expect(result.success).toBe(true);
    expect(result.event.type).toBe('invoice.payment_action_required');
  });

  it('devrait gérer les événements non supportés', async () => {
    const mockEvent: Stripe.Event = {
      id: 'evt_test_999',
      type: 'customer.created',
      data: {
        object: {} as any,
      },
    } as any;

    const result = await processStripeWebhook(mockEvent);

    expect(result.success).toBe(true);
    expect(result.message).toContain('Événement customer.created traité avec succès');
  });

  it('devrait vérifier que STRIPE_WEBHOOK_SECRET est configuré', () => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    expect(webhookSecret).toBeDefined();
    expect(webhookSecret).not.toBe('');
    expect(webhookSecret).toMatch(/^whsec_/);
  });
});
