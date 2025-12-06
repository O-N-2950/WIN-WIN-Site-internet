import { google } from 'googleapis';
import { ENV } from './_core/env';

/**
 * Module d'intégration Google Calendar pour WIN WIN Finance Group
 * 
 * Ce module permet de :
 * - Créer des événements dans Google Calendar
 * - Gérer les réservations d'entretiens clients
 * - Synchroniser automatiquement les rendez-vous
 */

// Configuration OAuth2 Google
const oauth2Client = new google.auth.OAuth2(
  ENV.googleClientId,
  ENV.googleClientSecret,
  `${ENV.backendUrl}/api/calendar/callback`
);

// Initialiser le client Calendar
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Interface pour les données de réservation d'entretien
 */
export interface AppointmentData {
  nom: string;
  email: string;
  telephone: string;
  typeClient: 'particulier' | 'entreprise' | 'les-deux';
  dateRdv: string; // Format: YYYY-MM-DD
  heureRdv: string; // Format: HH:MM
  message?: string;
}

/**
 * Créer un événement dans Google Calendar
 * Utilise les tokens sauvegardés d'Olivier (automatique)
 * 
 * @param data - Données de la réservation
 * @returns L'événement créé avec son lien Google Meet
 */
export async function createCalendarEvent(
  data: AppointmentData
) {
  // Charger les tokens sauvegardés d'Olivier
  const { loadGoogleTokens } = await import('./google-calendar-tokens');
  const tokens = await loadGoogleTokens();
  
  if (!tokens) {
    throw new Error('Tokens Google Calendar non disponibles. Olivier doit autoriser l\'accès.');
  }
  
  // Configurer le token d'accès
  oauth2Client.setCredentials(tokens);

  // Construire la date/heure de début (timezone Suisse)
  const startDateTime = `${data.dateRdv}T${data.heureRdv}:00+01:00`;
  
  // Calculer la date/heure de fin (30 minutes après)
  const startDate = new Date(startDateTime);
  const endDate = new Date(startDate.getTime() + 30 * 60000); // +30 minutes
  const endDateTime = endDate.toISOString();

  // Préparer la description de l'événement
  const description = `
Entretien avec ${data.nom}
Type de client : ${data.typeClient}
Téléphone : ${data.telephone}
Email : ${data.email}

${data.message ? `Message du client :\n${data.message}` : ''}

---
Créé automatiquement par WIN WIN Finance Group
  `.trim();

  // Créer l'événement
  const event = {
    summary: `Entretien - ${data.nom}`,
    description,
    start: {
      dateTime: startDateTime,
      timeZone: 'Europe/Zurich',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Europe/Zurich',
    },
    attendees: [
      { email: data.email },
      { email: 'contact@winwin.swiss' }, // Email WIN WIN
    ],
    conferenceData: {
      createRequest: {
        requestId: `winwin-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 24h avant
        { method: 'popup', minutes: 30 }, // 30min avant
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all', // Envoyer invitations à tous les participants
    });

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
      meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri,
    };
  } catch (error) {
    console.error('[Google Calendar] Erreur création événement:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    throw new Error(`Impossible de créer l'événement: ${errorMessage}`);
  }
}

/**
 * Générer l'URL d'authentification OAuth Google
 * 
 * @returns URL vers laquelle rediriger l'utilisateur pour autoriser l'accès
 */
export function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
}

/**
 * Échanger le code d'autorisation contre un token d'accès
 * 
 * @param code - Code d'autorisation reçu du callback OAuth
 * @returns Token d'accès et refresh token
 */
export async function getTokenFromCode(code: string) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error('[Google Calendar] Erreur obtention token:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    throw new Error(`Impossible d'obtenir le token: ${errorMessage}`);
  }
}

/**
 * Vérifier si le token d'accès est valide
 * 
 * @param accessToken - Token à vérifier
 * @returns true si le token est valide
 */
export async function verifyAccessToken(accessToken: string): Promise<boolean> {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    await calendar.calendarList.list({ maxResults: 1 });
    return true;
  } catch (error) {
    console.error('[Google Calendar] Token invalide:', error);
    return false;
  }
}
