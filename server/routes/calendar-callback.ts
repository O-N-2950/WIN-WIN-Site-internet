import { Router } from 'express';
import { getTokenFromCode } from '../google-calendar';

/**
 * Route callback OAuth Google Calendar
 * 
 * Cette route est appelée par Google après que l'utilisateur a autorisé l'accès à son calendrier.
 * Elle récupère le code d'autorisation et le renvoie au frontend pour finaliser la création du RDV.
 */

const router = Router();

router.get('/api/calendar/callback', async (req, res) => {
  const { code, state, error } = req.query;

  // Gérer les erreurs OAuth
  if (error) {
    console.error('[Calendar Callback] Erreur OAuth:', error);
    return res.redirect(`/conseil?error=oauth_failed&message=${encodeURIComponent(error as string)}`);
  }

  // Vérifier que le code est présent
  if (!code || typeof code !== 'string') {
    console.error('[Calendar Callback] Code manquant');
    return res.redirect('/conseil?error=missing_code');
  }

  // Vérifier que le state (appointmentId) est présent
  if (!state || typeof state !== 'string') {
    console.error('[Calendar Callback] State manquant');
    return res.redirect('/conseil?error=missing_state');
  }

  try {
    // Rediriger vers le frontend avec le code et l'appointmentId
    // Le frontend appellera trpc.appointment.confirmAppointment avec ces paramètres
    const redirectUrl = `/conseil?success=true&code=${encodeURIComponent(code)}&appointmentId=${encodeURIComponent(state)}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('[Calendar Callback] Erreur:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.redirect(`/conseil?error=callback_failed&message=${encodeURIComponent(errorMessage)}`);
  }
});

export default router;
