/**
 * Système de stockage des tokens Google Calendar pour Olivier
 * 
 * Ce module gère le stockage sécurisé des tokens OAuth Google Calendar
 * pour permettre la création automatique d'événements dans l'agenda d'Olivier
 * sans intervention manuelle.
 */

import fs from 'fs/promises';
import path from 'path';

interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

const TOKENS_FILE_PATH = path.join(process.cwd(), '.google-calendar-tokens.json');

/**
 * Sauvegarder les tokens Google Calendar
 * 
 * @param tokens - Tokens OAuth reçus de Google
 */
export async function saveGoogleTokens(tokens: GoogleTokens): Promise<void> {
  try {
    await fs.writeFile(TOKENS_FILE_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
    console.log('[Google Calendar] Tokens sauvegardés avec succès');
  } catch (error) {
    console.error('[Google Calendar] Erreur sauvegarde tokens:', error);
    throw error;
  }
}

/**
 * Charger les tokens Google Calendar
 * 
 * @returns Les tokens OAuth ou null si non disponibles
 */
export async function loadGoogleTokens(): Promise<GoogleTokens | null> {
  try {
    const data = await fs.readFile(TOKENS_FILE_PATH, 'utf-8');
    const tokens = JSON.parse(data);
    console.log('[Google Calendar] Tokens chargés avec succès');
    return tokens;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('[Google Calendar] Aucun token trouvé (première utilisation)');
      return null;
    }
    console.error('[Google Calendar] Erreur chargement tokens:', error);
    throw error;
  }
}

/**
 * Vérifier si les tokens sont disponibles et valides
 * 
 * @returns true si les tokens sont disponibles et non expirés
 */
export async function hasValidTokens(): Promise<boolean> {
  const tokens = await loadGoogleTokens();
  
  if (!tokens) {
    return false;
  }

  // Vérifier si le token est expiré (avec marge de 5 minutes)
  const now = Date.now();
  const expiryWithMargin = tokens.expiry_date - (5 * 60 * 1000);
  
  if (now >= expiryWithMargin) {
    console.log('[Google Calendar] Token expiré, refresh nécessaire');
    return false;
  }

  return true;
}

/**
 * Supprimer les tokens (déconnexion)
 */
export async function deleteGoogleTokens(): Promise<void> {
  try {
    await fs.unlink(TOKENS_FILE_PATH);
    console.log('[Google Calendar] Tokens supprimés');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[Google Calendar] Erreur suppression tokens:', error);
      throw error;
    }
  }
}
