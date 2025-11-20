import { Router } from 'express';
import { getAuthUrl, getTokenFromCode } from '../google-calendar';
import { saveGoogleTokens } from '../google-calendar-tokens';

/**
 * Routes OAuth Google Calendar
 * 
 * Ces routes gèrent l'autorisation OAuth d'Olivier pour accéder à son Google Calendar.
 * Une fois autorisé, tous les rendez-vous seront automatiquement synchronisés.
 */

const router = Router();

/**
 * Endpoint pour initier l'autorisation OAuth
 * Redirige Olivier vers Google pour autoriser l'accès
 */
router.get('/api/calendar/auth', (req, res) => {
  try {
    const authUrl = getAuthUrl();
    console.log('[Calendar Auth] Redirection vers Google OAuth');
    res.redirect(authUrl);
  } catch (error) {
    console.error('[Calendar Auth] Erreur:', error);
    res.status(500).send('Erreur lors de la génération de l\'URL d\'autorisation');
  }
});

/**
 * Callback OAuth Google Calendar
 * 
 * Cette route est appelée par Google après que Olivier a autorisé l'accès.
 * Elle échange le code d'autorisation contre un token d'accès et le sauvegarde.
 */
router.get('/api/calendar/callback', async (req, res) => {
  const { code, error } = req.query;

  // Gérer les erreurs OAuth
  if (error) {
    console.error('[Calendar Callback] Erreur OAuth:', error);
    return res.redirect(`/admin/google-calendar-setup?error=${encodeURIComponent(error as string)}`);
  }

  // Vérifier que le code est présent
  if (!code || typeof code !== 'string') {
    console.error('[Calendar Callback] Code manquant');
    return res.redirect('/admin/google-calendar-setup?error=missing_code');
  }

  try {
    console.log('[Calendar Callback] Échange du code contre un token...');
    
    // Échanger le code contre un token
    const tokens = await getTokenFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Tokens incomplets reçus de Google');
    }

    // Sauvegarder les tokens d'Olivier
    await saveGoogleTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope || '',
      token_type: tokens.token_type || 'Bearer',
      expiry_date: tokens.expiry_date || Date.now() + 3600000,
    });

    console.log('[Calendar Callback] ✅ Tokens sauvegardés avec succès');
    console.log('[Calendar Callback] Google Calendar est maintenant activé !');
    
    // Rediriger vers la page d'administration avec succès
    res.redirect(`/admin/google-calendar-setup?code=${encodeURIComponent(code)}`);
  } catch (error) {
    console.error('[Calendar Callback] Erreur:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.redirect(`/admin/google-calendar-setup?error=auth_failed&message=${encodeURIComponent(errorMessage)}`);
  }
});

/**
 * Endpoint pour sauvegarder les tokens (appelé depuis le frontend)
 * Utilisé comme fallback si le callback direct ne fonctionne pas
 */
router.post('/api/calendar/save-tokens', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code manquant' });
  }

  try {
    // Échanger le code contre un token
    const tokens = await getTokenFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Tokens incomplets reçus de Google');
    }

    // Sauvegarder les tokens
    await saveGoogleTokens({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope || '',
      token_type: tokens.token_type || 'Bearer',
      expiry_date: tokens.expiry_date || Date.now() + 3600000,
    });

    console.log('[Save Tokens] ✅ Tokens sauvegardés avec succès');
    res.json({ success: true });
  } catch (error) {
    console.error('[Save Tokens] Erreur:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
