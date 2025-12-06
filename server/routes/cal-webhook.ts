import { Router } from 'express';
import crypto from 'crypto';
import { createLeadFromCalBooking } from '../airtable-crm';

/**
 * Webhook Cal.com
 * 
 * Reçoit les notifications de réservation depuis Cal.com et crée automatiquement
 * des leads dans Airtable CRM avec notification email à Olivier.
 */

const router = Router();

/**
 * Interface pour le payload Cal.com
 */
interface CalBookingPayload {
  triggerEvent: 'BOOKING_CREATED' | 'BOOKING_CANCELLED' | 'BOOKING_RESCHEDULED';
  createdAt: string;
  payload: {
    type: string; // "15min" ou "30min"
    title: string;
    startTime: string; // ISO 8601
    endTime: string; // ISO 8601
    organizer: {
      id: number;
      name: string;
      email: string;
      timeZone: string;
    };
    attendees: Array<{
      email: string;
      name: string;
      timeZone: string;
    }>;
    responses: {
      name?: { value: string };
      email?: { value: string };
      notes?: { value: string };
      phone?: { value: string };
    };
    uid: string;
    bookingId: number;
    status: string;
    metadata?: Record<string, any>;
  };
}

/**
 * Vérifier la signature HMAC du webhook (si secret configuré)
 */
function verifyCalWebhook(payload: string, signature: string | undefined, secret: string): boolean {
  if (!signature || !secret) {
    // Si pas de secret configuré, on accepte (à sécuriser en production)
    return true;
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const calculatedSignature = hmac.digest('hex');
  
  return calculatedSignature === signature;
}

/**
 * Formater la date ISO en format suisse JJ.MM.AAAA
 */
function formatDateSwiss(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Extraire l'heure d'une date ISO (HH:MM)
 */
function extractTime(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('fr-CH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Endpoint webhook Cal.com
 */
router.post('/api/cal/webhook', async (req, res) => {
  try {
    console.log('[Cal Webhook] Webhook reçu');
    
    // Récupérer la signature pour vérification
    const signature = req.headers['x-cal-signature-256'] as string | undefined;
    const secret = process.env.CAL_WEBHOOK_SECRET || '';
    
    // Convertir le body en string pour vérification HMAC
    const rawBody = JSON.stringify(req.body);
    
    // Vérifier la signature (si secret configuré)
    if (secret && !verifyCalWebhook(rawBody, signature, secret)) {
      console.error('[Cal Webhook] Signature invalide');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const webhookData: CalBookingPayload = req.body;
    
    console.log('[Cal Webhook] Event:', webhookData.triggerEvent);
    console.log('[Cal Webhook] Booking ID:', webhookData.payload.bookingId);
    
    // Traiter uniquement les créations de réservation
    if (webhookData.triggerEvent === 'BOOKING_CREATED') {
      const { payload } = webhookData;
      
      // Extraire les informations du client
      const attendee = payload.attendees[0];
      const clientName = attendee?.name || payload.responses.name?.value || 'Nom inconnu';
      const clientEmail = attendee?.email || payload.responses.email?.value || '';
      const clientPhone = payload.responses.phone?.value || '';
      const clientMessage = payload.responses.notes?.value || '';
      
      // Extraire la date et l'heure
      const dateRdv = formatDateSwiss(payload.startTime);
      const heureRdv = extractTime(payload.startTime);
      
      // Déterminer le type de RDV
      const dureeRdv = payload.type.includes('15') ? '15 minutes' : '30 minutes';
      
      console.log('[Cal Webhook] Création lead pour:', clientName, clientEmail);
      console.log('[Cal Webhook] RDV:', dateRdv, 'à', heureRdv, `(${dureeRdv})`);
      
      // Créer le lead dans Airtable
      try {
        await createLeadFromCalBooking({
          nom: clientName,
          email: clientEmail,
          telephone: clientPhone,
          typeClient: 'Particulier', // Par défaut
          source: `Site Web - Cal.com (${dureeRdv})`,
          message: clientMessage || `Réservation d'un entretien de ${dureeRdv}`,
          dateRdv: dateRdv,
          heureRdv: heureRdv,
          statut: 'RDV Confirmé',
          calBookingId: payload.uid,
          calBookingUrl: `https://app.cal.com/bookings/${payload.bookingId}`,
        });
        
        console.log('[Cal Webhook] ✅ Lead créé avec succès dans Airtable');
        
        // Répondre à Cal.com
        res.status(200).json({ 
          success: true, 
          message: 'Booking processed successfully' 
        });
        
      } catch (airtableError) {
        console.error('[Cal Webhook] Erreur création Airtable:', airtableError);
        
        // On répond quand même 200 à Cal.com pour éviter les retry
        // mais on log l'erreur pour investigation
        res.status(200).json({ 
          success: false, 
          message: 'Booking received but Airtable sync failed',
          error: airtableError instanceof Error ? airtableError.message : 'Unknown error'
        });
      }
      
    } else if (webhookData.triggerEvent === 'BOOKING_CANCELLED') {
      console.log('[Cal Webhook] Réservation annulée:', webhookData.payload.bookingId);
      // TODO: Mettre à jour le statut dans Airtable
      res.status(200).json({ success: true, message: 'Cancellation noted' });
      
    } else if (webhookData.triggerEvent === 'BOOKING_RESCHEDULED') {
      console.log('[Cal Webhook] Réservation reprogrammée:', webhookData.payload.bookingId);
      // TODO: Mettre à jour la date/heure dans Airtable
      res.status(200).json({ success: true, message: 'Reschedule noted' });
      
    } else {
      console.log('[Cal Webhook] Event non géré:', webhookData.triggerEvent);
      res.status(200).json({ success: true, message: 'Event received but not processed' });
    }
    
  } catch (error) {
    console.error('[Cal Webhook] Erreur:', error);
    
    // Répondre 200 quand même pour éviter les retry de Cal.com
    res.status(200).json({ 
      success: false, 
      message: 'Error processing webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
