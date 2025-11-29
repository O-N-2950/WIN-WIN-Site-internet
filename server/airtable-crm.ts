/**
 * Module d'intégration Airtable CRM pour WIN WIN Finance Group
 * 
 * Ce module permet de :
 * - Créer automatiquement des leads dans Airtable depuis les formulaires du site
 * - Envoyer des notifications email à contact@winwin.swiss
 * - Tracker la source et le statut des leads
 */

interface AirtableConfig {
  baseId: string;
  tableId: string;
  apiKey: string;
}

interface LeadData {
  nom: string;
  email: string;
  telephone: string;
  typeClient: 'Particulier' | 'Entreprise' | 'Les deux';
  source: 'Formulaire Contact' | 'Demande RDV' | 'Questionnaire Mandat';
  message?: string;
  dateRdv?: string;
  heureRdv?: string;
  attachmentUrl?: string;
  attachmentFilename?: string;
}

interface CalBookingData {
  nom: string;
  email: string;
  telephone: string;
  typeClient: string;
  source: string;
  message: string;
  dateRdv: string;
  heureRdv: string;
  statut: string;
  calBookingId: string;
  calBookingUrl: string;
}

/**
 * Configuration Airtable
 * Base: ERP Clients WW
 * Table: Leads Site Web
 */
const AIRTABLE_CONFIG: AirtableConfig = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tableId: 'tbl7kIZd294RTM1de', // ID de la table "Leads Site Web"
  apiKey: process.env.AIRTABLE_API_KEY || '',
};

/**
 * Timeout pour les appels Airtable API (30 secondes)
 * Augmenté pour éviter les timeouts sur Railway
 */
const AIRTABLE_TIMEOUT = 30000;

/**
 * Créer un lead dans Airtable
 * 
 * @param data - Données du lead
 * @returns L'ID du record créé dans Airtable
 */
export async function createLeadInAirtable(data: LeadData): Promise<string> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}`;

  // Préparer les champs selon la structure Airtable
  const fields: Record<string, any> = {
    'Nom': data.nom,
    'Email': data.email,
    'Téléphone': data.telephone,
    'Type Client': data.typeClient,
    'Source': data.source,
    'Statut': 'Nouveau', // Statut par défaut
  };

  // Ajouter les champs optionnels
  if (data.message) {
    fields['Message'] = data.message;
  }

  if (data.dateRdv) {
    fields['Date RDV'] = data.dateRdv;
  }

  if (data.heureRdv) {
    fields['Heure RDV'] = data.heureRdv;
  }

  if (data.attachmentUrl) {
    console.log('[Airtable] Ajout pièce jointe:', data.attachmentUrl, data.attachmentFilename);
    fields['Pièce jointe'] = [{
      url: data.attachmentUrl,
      filename: data.attachmentFilename || 'attachment.pdf'
    }];
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Airtable] Erreur création lead:', errorText);
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[Airtable] Lead créé avec succès:', result.id);
    
    // Envoyer notification email
    await sendLeadNotification(data, result.id);

    return result.id;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Airtable] Timeout lors de la création du lead');
      throw new Error('Airtable API timeout');
    }
    console.error('[Airtable] Erreur:', error);
    throw error;
  }
}

/**
 * Envoyer une notification email à contact@winwin.swiss
 * 
 * @param data - Données du lead
 * @param recordId - ID du record Airtable créé
 */
async function sendLeadNotification(data: LeadData, recordId: string): Promise<void> {
  const airtableRecordUrl = `https://airtable.com/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}/${recordId}`;

  const emailSubject = `🔔 Nouveau Lead - ${data.source}`;
  
  const emailBody = `
Bonjour Olivier,

Un nouveau lead vient d'être créé sur le site WIN WIN Finance Group.

📋 INFORMATIONS DU LEAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nom : ${data.nom}
📧 Email : ${data.email}
📞 Téléphone : ${data.telephone}
🏢 Type de client : ${data.typeClient}
📍 Source : ${data.source}

${data.dateRdv ? `📅 Date RDV demandée : ${data.dateRdv} à ${data.heureRdv || 'N/A'}` : ''}

${data.message ? `💬 Message :\n${data.message}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Voir dans Airtable : ${airtableRecordUrl}

⚡ ACTIONS RECOMMANDÉES :
1. Contacter le lead dans les 24h
2. Qualifier le besoin
3. Proposer un entretien si pertinent
4. Mettre à jour le statut dans Airtable

---
Notification automatique - WIN WIN Finance Group
  `.trim();

  try {
    // TODO: Implémenter l'envoi d'email via Resend ou autre service
    // Pour l'instant, on log dans la console
    console.log('[Email Notification]', {
      to: 'contact@winwin.swiss',
      subject: emailSubject,
      body: emailBody,
    });

    // Si vous avez configuré Resend, décommenter :
    /*
    const { ENV } = await import('./_core/env');
    if (ENV.resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ENV.resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'notifications@winwin.swiss',
          to: 'contact@winwin.swiss',
          subject: emailSubject,
          text: emailBody,
        }),
      });

      if (!response.ok) {
        console.error('[Email] Erreur envoi:', await response.text());
      }
    }
    */
  } catch (error) {
    console.error('[Email Notification] Erreur:', error);
    // Ne pas bloquer la création du lead si l'email échoue
  }
}

/**
 * Mettre à jour le statut d'un lead dans Airtable
 * 
 * @param recordId - ID du record Airtable
 * @param statut - Nouveau statut
  */
export async function updateLeadStatus(
  recordId: string,
  statut: 'Nouveau' | 'Contacté' | 'Qualifié' | 'Converti' | 'Perdu'
): Promise<void> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}/${recordId}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: { 'Statut': statut },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Airtable] Erreur mise à jour statut:', errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    console.log('[Airtable] Statut mis à jour:', statut);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Airtable] Timeout lors de la mise à jour du statut');
      throw new Error('Airtable API timeout');
    }
    console.error('[Airtable] Erreur:', error);
    throw error;
  }
}

/**
 * Récupérer tous les leads avec un statut donné
 * 
 * @param statut - Statut à filtrer
 * @returns Liste des leads
 */
export async function getLeadsByStatus(
  statut: 'Nouveau' | 'Contacté' | 'Qualifié' | 'Converti' | 'Perdu'
): Promise<any[]> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}?filterByFormula={Statut}='${statut}'`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Airtable] Erreur récupération leads:', errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const result = await response.json();
    return result.records;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Airtable] Timeout lors de la récupération des leads');
      throw new Error('Airtable API timeout');
    }
    console.error('[Airtable] Erreur:', error);
    throw error;
  }
}

/**
 * Créer un lead depuis une réservation Cal.com
 * 
 * @param data - Données de la réservation Cal.com
 * @returns L'ID du record créé dans Airtable
 */
export async function createLeadFromCalBooking(data: CalBookingData): Promise<string> {
  const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableId)}`;

  // Préparer les champs selon la structure Airtable
  const fields: Record<string, any> = {
    'Nom': data.nom,
    'Email': data.email,
    'Téléphone': data.telephone,
    'Type Client': data.typeClient,
    'Source': data.source,
    'Message': data.message,
    'Date RDV': data.dateRdv,
    'Heure RDV': data.heureRdv,
    'Statut': data.statut,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Airtable] Erreur création lead Cal.com:', errorText);
      throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[Airtable] Lead Cal.com créé avec succès:', result.id);
    
    // Envoyer notification email spécifique pour Cal.com
    await sendCalBookingNotification(data, result.id);

    return result.id;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Airtable] Timeout lors de la création du lead Cal.com');
      throw new Error('Airtable API timeout');
    }
    console.error('[Airtable] Erreur:', error);
    throw error;
  }
}

/**
 * Envoyer une notification email pour une réservation Cal.com
 * 
 * @param data - Données de la réservation
 * @param recordId - ID du record Airtable créé
 */
async function sendCalBookingNotification(data: CalBookingData, recordId: string): Promise<void> {
  const airtableRecordUrl = `https://airtable.com/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.tableId}/${recordId}`;

  const emailSubject = `📅 Nouveau RDV confirmé - ${data.nom}`;
  
  const emailBody = `
Bonjour Olivier,

Un nouveau rendez-vous vient d'être réservé via Cal.com !

📋 INFORMATIONS DU CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Nom : ${data.nom}
📧 Email : ${data.email}
📞 Téléphone : ${data.telephone}
🏢 Type de client : ${data.typeClient}

📅 DÉTAILS DU RENDEZ-VOUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📆 Date : ${data.dateRdv}
⏰ Heure : ${data.heureRdv}
✅ Statut : ${data.statut}

${data.message ? `💬 Message du client :\n${data.message}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔗 Voir dans Airtable : ${airtableRecordUrl}
🔗 Voir dans Cal.com : ${data.calBookingUrl}

⚡ RAPPEL :
- Le client recevra un rappel automatique 24h avant le RDV
- Le lien Google Meet a été envoyé au client
- Pensez à préparer l'entretien en consultant son profil

---
Notification automatique - WIN WIN Finance Group
  `.trim();

  try {
    console.log('[Email Notification Cal.com]', {
      to: 'contact@winwin.swiss',
      subject: emailSubject,
      body: emailBody,
    });

    // TODO: Implémenter l'envoi d'email via Resend si configuré
  } catch (error) {
    console.error('[Email Notification Cal.com] Erreur:', error);
  }
}

/**
 * Configuration pour la table Clients
 */
const CLIENTS_TABLE_CONFIG = {
  baseId: 'appZQkRJ7PwOtdQ3O',
  tableId: 'tblTODO_CLIENTS', // TODO: Remplacer par le vrai ID de la table "Clients"
  apiKey: process.env.AIRTABLE_API_KEY || '',
};

/**
 * Interface pour les données de mise à jour après paiement
 */
interface PaymentUpdateData {
  email: string;
  statutPaiement?: 'Payé' | 'En attente' | 'Échec' | 'Tentative en cours' | 'Retard de paiement';
  dateDernierPaiement?: string;
  montantDernierPaiement?: number;
  stripeInvoiceId?: string;
  dateProchaineFact?: string;
}

/**
 * Mettre à jour un client dans Airtable après un paiement
 * 
 * @param data - Données de mise à jour
 */
export async function updateClientAfterPayment(data: PaymentUpdateData): Promise<void> {
  // 1. Trouver le client par email
  const filterFormula = `{Email}='${data.email.replace(/'/g, "\\'")}'`;
  const searchUrl = `https://api.airtable.com/v0/${CLIENTS_TABLE_CONFIG.baseId}/${encodeURIComponent(CLIENTS_TABLE_CONFIG.tableId)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

  try {
    // Rechercher le client
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AIRTABLE_TIMEOUT);
    
    const searchResponse = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${CLIENTS_TABLE_CONFIG.apiKey}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      console.error('[Airtable] Erreur recherche client:', errorText);
      throw new Error(`Airtable API error: ${searchResponse.status}`);
    }

    const searchResult = await searchResponse.json();

    if (searchResult.records.length === 0) {
      console.error(`[Airtable] Client non trouvé avec email: ${data.email}`);
      throw new Error(`Client not found: ${data.email}`);
    }

    const clientRecord = searchResult.records[0];
    const recordId = clientRecord.id;

    // 2. Préparer les champs à mettre à jour
    const fields: Record<string, any> = {};

    if (data.statutPaiement) {
      fields['Statut Paiement'] = data.statutPaiement;
    }

    if (data.dateDernierPaiement) {
      fields['Date dernier paiement'] = data.dateDernierPaiement;
    }

    if (data.montantDernierPaiement !== undefined) {
      fields['Montant dernier paiement'] = data.montantDernierPaiement;
    }

    if (data.stripeInvoiceId) {
      fields['Stripe Invoice ID'] = data.stripeInvoiceId;
    }

    if (data.dateProchaineFact) {
      fields['Date prochaine facturation'] = data.dateProchaineFact;
    }

    // 3. Mettre à jour le client
    const updateUrl = `https://api.airtable.com/v0/${CLIENTS_TABLE_CONFIG.baseId}/${encodeURIComponent(CLIENTS_TABLE_CONFIG.tableId)}/${recordId}`;

    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), AIRTABLE_TIMEOUT);
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${CLIENTS_TABLE_CONFIG.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
      signal: controller2.signal,
    });

    clearTimeout(timeoutId2);

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error('[Airtable] Erreur mise à jour client:', errorText);
      throw new Error(`Airtable API error: ${updateResponse.status}`);
    }

    console.log(`[Airtable] Client ${data.email} mis à jour avec succès`);
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('[Airtable] Timeout lors de la mise à jour du client');
      throw new Error('Airtable API timeout');
    }
    console.error('[Airtable] Erreur:', error);
    throw error;
  }
}
