import { Resend } from 'resend';

const resend = new Resend('re_FVVVMDUg_ETvGedoEuDLr7afSmFZ7QCVj');

async function testEmail() {
  try {
    console.log('📧 Test envoi email de bienvenue...\n');
    
    const { data, error } = await resend.emails.send({
      from: 'WIN WIN Finance Group <onboarding@resend.dev>',
      to: 'olivier.neukomm@bluewin.ch', // Email de test
      subject: '🧪 TEST - Bienvenue chez WIN WIN Finance ! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066cc; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; background: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Bienvenue chez WIN WIN Finance !</h1>
            </div>
            
            <div class="content">
              <h2>Bonjour Jean Dupont,</h2>
              
              <p>Félicitations ! Votre mandat de gestion d'assurances est maintenant actif.</p>
              
              <div class="info-box">
                <strong>📄 Votre mandat signé</strong><br>
                <a href="https://example.com/mandat.pdf" class="button">Télécharger le PDF</a>
              </div>
              
              <div class="info-box">
                <strong>💰 Montant payé</strong><br>
                CHF 185.- (paiement annuel)
              </div>
              
              <div class="info-box">
                <strong>🎁 Votre code de parrainage</strong><br>
                <code style="font-size: 18px; font-weight: bold; color: #0066cc;">DUPO-XY12</code><br>
                <small>Partagez ce code avec vos proches et bénéficiez de CHF 50.- de crédit par filleul !</small>
              </div>
              
              <h3>Prochaines étapes :</h3>
              <ol>
                <li>Votre conseiller vous contactera sous 48h</li>
                <li>Préparez vos polices d'assurance actuelles</li>
                <li>Accédez à votre espace client Airtable (lien envoyé séparément)</li>
              </ol>
              
              <p><strong>10 prestations incluses :</strong></p>
              <ul>
                <li>✅ Conseils professionnels illimités</li>
                <li>✅ Appels d'offres et mise en concurrence</li>
                <li>✅ Réception et contrôle des primes</li>
                <li>✅ Gestion complète des sinistres</li>
                <li>✅ Archivage informatique 24h/24</li>
                <li>✅ Accès Web via Airtable</li>
                <li>✅ Correspondance avec les compagnies</li>
                <li>✅ Mise à jour budget et échéancier</li>
                <li>✅ Recherche gratuite avoirs LPP</li>
                <li>✅ Analyse de prévoyance (PEP's - valeur CHF 250.-)</li>
              </ul>
              
              <p>Des questions ? Répondez simplement à cet email !</p>
              
              <p>Cordialement,<br>
              <strong>L'équipe WIN WIN Finance Group</strong></p>
            </div>
            
            <div class="footer">
              <p>WIN WIN Finance Group Sàrl<br>
              Courtier en assurances FINMA (F01042365)<br>
              Bellevue 7, 2950 Courgenay<br>
              <a href="https://www.winwin.swiss">www.winwin.swiss</a></p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('❌ Erreur Resend:', error);
      process.exit(1);
    }

    console.log('✅ Email envoyé avec succès !');
    console.log('📧 ID:', data.id);
    console.log('📬 Destinataire: contact@winwin.swiss');
    console.log('\n✅ Le système d\'email fonctionne parfaitement !');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testEmail();
