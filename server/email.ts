/**
 * Module Email pour WIN WIN Finance Group
 * Utilise Resend pour l'envoi d'emails transactionnels
 */

import { Resend } from 'resend';

// Initialiser Resend avec la clé API (à configurer via secrets)
const resend = new Resend(process.env.RESEND_API_KEY || '');

/**
 * Template email de bienvenue client
 */
function getWelcomeEmailHTML(clientName: string, mandatNumber: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue chez WIN WIN Finance Group</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #3176A6 0%, #5B9BD5 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      background: #ffffff;
      padding: 30px 20px;
      border: 1px solid #e0e0e0;
      border-top: none;
    }
    .mandat-box {
      background: #f8f9fa;
      border-left: 4px solid #3176A6;
      padding: 15px;
      margin: 20px 0;
    }
    .mandat-number {
      font-size: 18px;
      font-weight: 600;
      color: #3176A6;
    }
    .steps {
      margin: 20px 0;
    }
    .step {
      margin: 15px 0;
      padding-left: 25px;
      position: relative;
    }
    .step:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #3176A6;
      font-weight: bold;
    }
    .cta-button {
      display: inline-block;
      background: #3176A6;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: 600;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-radius: 0 0 8px 8px;
    }
    .footer a {
      color: #3176A6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎉 Bienvenue chez WIN WIN Finance Group !</h1>
  </div>
  
  <div class="content">
    <p>Bonjour <strong>${clientName}</strong>,</p>
    
    <p>Félicitations ! Votre mandat de gestion WIN WIN Finance Group est maintenant <strong>activé</strong>.</p>
    
    <div class="mandat-box">
      <div class="mandat-number">Numéro de mandat : ${mandatNumber}</div>
    </div>
    
    <h2>Prochaines étapes</h2>
    
    <div class="steps">
      <div class="step">Vous recevrez un email dans les <strong>48 heures</strong> pour planifier votre rendez-vous d'analyse personnalisée</div>
      <div class="step">Olivier Neukomm vous contactera personnellement pour faire le point sur vos besoins</div>
      <div class="step">Vous aurez accès à votre <strong>espace client</strong> pour suivre l'évolution de vos contrats</div>
    </div>
    
    <p style="text-align: center;">
      <a href="https://airtable.com/appZQkRJ7PwOtdQ3O/shrJqT8kxxxxxxx" class="cta-button">
        Accéder à mon espace client
      </a>
    </p>
    
    <p>Merci de votre confiance ! Notre équipe est à votre disposition pour toute question.</p>
    
    <p>Cordialement,<br>
    <strong>L'équipe WIN WIN Finance Group</strong></p>
  </div>
  
  <div class="footer">
    <p><strong>WIN WIN Finance Group Sàrl</strong></p>
    <p>Finma 75642 | RC JU CHE-114.276.458</p>
    <p>📞 <a href="tel:+41324661100">032 466 11 00</a> | 
       📧 <a href="mailto:contact@winwin.swiss">contact@winwin.swiss</a></p>
    <p><a href="https://www.winwin.swiss">www.winwin.swiss</a></p>
  </div>
</body>
</html>
  `;
}

/**
 * Envoyer l'email de bienvenue au client
 */
export async function sendWelcomeEmail(
  clientEmail: string,
  clientName: string,
  mandatNumber: string
): Promise<boolean> {
  // Si pas de clé API Resend, logger et retourner false
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] ⚠️  RESEND_API_KEY non configurée - Email non envoyé');
    console.log('[Email] Destinataire:', clientEmail);
    console.log('[Email] Nom:', clientName);
    console.log('[Email] Numéro de mandat:', mandatNumber);
    return false;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'WIN WIN Finance Group <noreply@winwin.swiss>',
      to: [clientEmail],
      subject: 'Bienvenue chez WIN WIN Finance Group - Votre mandat est activé !',
      html: getWelcomeEmailHTML(clientName, mandatNumber),
    });
    
    if (error) {
      console.error('[Email] ❌ Erreur lors de l\'envoi:', error);
      return false;
    }
    
    console.log('[Email] ✅ Email de bienvenue envoyé avec succès');
    console.log('[Email] ID:', data?.id);
    console.log('[Email] Destinataire:', clientEmail);
    
    return true;
  } catch (error: any) {
    console.error('[Email] ❌ Exception lors de l\'envoi:', error.message);
    return false;
  }
}

/**
 * Envoyer une notification email à Olivier
 */
export async function sendOwnerNotificationEmail(
  clientName: string,
  clientEmail: string,
  clientType: string,
  annualPrice: number,
  mandatNumber: string,
  airtableRecordId: string
): Promise<boolean> {
  // Si pas de clé API Resend, logger et retourner false
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] ⚠️  RESEND_API_KEY non configurée - Notification Olivier non envoyée');
    return false;
  }
  
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #3176A6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .info { background: #f8f9fa; padding: 15px; margin: 15px 0; border-left: 4px solid #3176A6; }
    .info-row { margin: 8px 0; }
    .label { font-weight: bold; color: #3176A6; }
    .cta { display: inline-block; background: #3176A6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Nouveau client payé !</h1>
  </div>
  
  <div class="content">
    <p>Bonjour Olivier,</p>
    
    <p>Un nouveau client vient de compléter son paiement et son mandat est maintenant actif.</p>
    
    <div class="info">
      <div class="info-row"><span class="label">👤 Nom :</span> ${clientName}</div>
      <div class="info-row"><span class="label">📧 Email :</span> ${clientEmail}</div>
      <div class="info-row"><span class="label">💰 Tarif :</span> CHF ${annualPrice}.-/an</div>
      <div class="info-row"><span class="label">📋 Type :</span> ${clientType}</div>
      <div class="info-row"><span class="label">🔢 Mandat :</span> ${mandatNumber}</div>
      <div class="info-row"><span class="label">📅 Date :</span> ${new Date().toLocaleDateString('fr-CH')}</div>
    </div>
    
    <p style="text-align: center;">
      <a href="https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${airtableRecordId}" class="cta">
        Voir dans Airtable
      </a>
    </p>
    
    <p>L'email de bienvenue a été automatiquement envoyé au client.</p>
    
    <p>Cordialement,<br>
    <strong>Système WIN WIN Finance Group</strong></p>
  </div>
</body>
</html>
  `;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'WIN WIN System <noreply@winwin.swiss>',
      to: ['contact@winwin.swiss'], // Email d'Olivier
      subject: `✅ Nouveau client payé - ${clientName}`,
      html,
    });
    
    if (error) {
      console.error('[Email] ❌ Erreur lors de l\'envoi notification Olivier:', error);
      return false;
    }
    
    console.log('[Email] ✅ Notification Olivier envoyée avec succès');
    console.log('[Email] ID:', data?.id);
    
    return true;
  } catch (error: any) {
    console.error('[Email] ❌ Exception lors de l\'envoi notification Olivier:', error.message);
    return false;
  }
}
