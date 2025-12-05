import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(clientData: {
  email: string;
  prenom: string;
  nom: string;
  pdfMandatUrl: string;
  codeParrainage: string;
  montantPaye: number;
  uploadToken?: string; // Token pour upload documents
  typeClient?: 'Particulier' | 'Entreprise';
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'WIN WIN Finance Group <contact@winwin.swiss>',
      to: clientData.email,
      subject: 'Bienvenue chez WIN WIN Finance ! 🎉',
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
              <h2>Bonjour ${clientData.prenom} ${clientData.nom},</h2>
              
              <p>Félicitations ! Votre mandat de gestion d'assurances est maintenant actif.</p>
              
              <div class="info-box">
                <strong>📄 Votre mandat signé</strong><br>
                <a href="${clientData.pdfMandatUrl}" class="button">Télécharger le PDF</a>
              </div>
              
              ${clientData.uploadToken ? `
              <div class="info-box" style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-left: 4px solid #3176A6;">
                <h3 style="color: #3176A6; margin-top: 0;">📋 Prochaine étape : Envoyez-nous vos documents</h3>
                <p>Pour réaliser votre analyse complète et optimiser vos assurances, nous avons besoin de quelques documents.</p>
                <p><strong>Checklist ${clientData.typeClient === 'Entreprise' ? 'Entreprise' : 'Particulier'} :</strong></p>
                <ul style="text-align: left; line-height: 1.8;">
                  ${clientData.typeClient === 'Entreprise' ? `
                    <li>Extrait du registre du commerce</li>
                    <li>IBAN bancaire entreprise</li>
                    <li>Contrats LAA, LPP, IJM</li>
                    <li>RC entreprise</li>
                    <li>Autres contrats d'assurance</li>
                  ` : `
                    <li>Carte d'identité (recto-verso)</li>
                    <li>IBAN bancaire</li>
                    <li>Contrats LAMal et LCA</li>
                    <li>Contrats véhicule et habitation</li>
                    <li>Autres contrats d'assurance</li>
                  `}
                </ul>
                <div style="text-align: center; margin: 20px 0;">
                  <a href="https://www.winwin.swiss/upload-documents?token=${clientData.uploadToken}" 
                     style="display: inline-block; background: linear-gradient(135deg, #3176A6 0%, #8CB4D2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    📤 Uploader mes documents
                  </a>
                </div>
                <p style="font-size: 12px; color: #666; margin-top: 15px;">💡 Vous pouvez uploader vos documents en plusieurs fois, pas besoin de tout avoir maintenant !</p>
                <p style="font-size: 12px; color: #666;">🔒 Vos documents sont transmis de manière sécurisée et confidentielle</p>
              </div>
              ` : ''}
              
              <div class="info-box">
                <strong>💰 Montant payé</strong><br>
                CHF ${clientData.montantPaye}.- (paiement annuel)
              </div>
              
              <div class="info-box" style="background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-left: 4px solid #4caf50;">
                <h3 style="color: #2e7d32; margin-top: 0;">🎁 Parrainez vos proches et économisez !</h3>
                
                <p style="margin-bottom: 15px;"><strong>Votre code personnel :</strong></p>
                <div style="background: white; border: 3px dashed #4caf50; padding: 20px; text-align: center; border-radius: 10px; margin-bottom: 20px;">
                  <code style="font-size: 32px; font-weight: bold; color: #2e7d32; letter-spacing: 3px;">${clientData.codeParrainage}</code>
                </div>
                
                <p style="margin-bottom: 10px;"><strong>📱 Partager avec :</strong></p>
                <div style="text-align: center; margin: 20px 0;">
                 <a href="https://wa.me/?text=🎉%20Rejoins-moi%20chez%20WIN%20WIN%20Finance%20!%0A%0AUtilise%20mon%20code%20de%20parrainage%20%3A%20${clientData.codeParrainage}%0A%0ATu%20b%C3%A9n%C3%A9ficieras%20d'un%20rabais%20imm%C3%A9diat%20et%20nous%20b%C3%A9n%C3%A9ficierons%20tous%20de%20rabais%20de%20groupe%20!%0A%0A👨‍👩‍👧‍👦%20Particuliers%20%3A%20Id%C3%A9al%20pour%20votre%20famille%20et%20proches%0A🏢%20Entreprises%20%3A%20Id%C3%A9al%20pour%20vos%20collaborateurs%0A%0APlus%20on%20est%20de%20membres%2C%20plus%20le%20rabais%20est%20%C3%A9lev%C3%A9%20(jusqu'%C3%A0%2020%25%20!)%0A%0AInfos%20%3A%20https%3A%2F%2Fwww.winwin.swiss"
                     style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
                    📱 WhatsApp
                  </a>
                <a href="mailto:?subject=Rejoins%20WIN%20WIN%20Finance%20!&body=Salut%20!%0A%0AJe%20viens%20de%20rejoindre%20WIN%20WIN%20Finance%20pour%20la%20gestion%20de%20mes%20assurances.%0A%0AUtilise%20mon%20code%20de%20parrainage%20%3A%20${clientData.codeParrainage}%0A%0ATu%20b%C3%A9n%C3%A9ficieras%20d'un%20rabais%20imm%C3%A9diat%20et%20nous%20b%C3%A9n%C3%A9ficierons%20tous%20de%20rabais%20de%20groupe%20!%0A%0AParticuliers%20%3A%20Id%C3%A9al%20pour%20votre%20famille%20et%20proches%0AEntreprises%20%3A%20Id%C3%A9al%20pour%20vos%20collaborateurs%0A%0APlus%20on%20est%20de%20membres%2C%20plus%20le%20rabais%20est%20%C3%A9lev%C3%A9%20(jusqu'%C3%A0%2020%25%20!)%0A%0APlus%20d'infos%20%3A%20https%3A%2F%2Fwww.winwin.swiss" 
                     style="display: inline-block; background: #0066cc; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
                    📧 Email
                  </a>
                  <a href="sms:?&body=Rejoins-moi%20chez%20WIN%20WIN%20Finance%20!%20Utilise%20mon%20code%20%3A%20${clientData.codeParrainage}%20-%20Infos%20%3A%20https%3A%2F%2Fwww.winwin.swiss" 
                     style="display: inline-block; background: #ff9800; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
                    💬 SMS
                  </a>
                </div>
                
                <h4 style="color: #2e7d32; margin-top: 25px;">💡 Comment ça marche ?</h4>
                <ol style="text-align: left; line-height: 1.8;">
                  <li>Partagez votre code avec votre entourage</li>
                  <li>Chaque membre bénéficie d'un rabais immédiat</li>
                  <li>Vous recevez un crédit sur votre prochaine facture annuelle</li>
                </ol>
                
                <h4 style="color: #2e7d32; margin-top: 25px;">👥 Qui peut bénéficier du rabais de groupe ?</h4>
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <p style="margin: 10px 0;"><strong>👨‍👩‍👧‍👦 Particuliers :</strong> Votre famille, vos amis, vos proches</p>
                  <p style="margin: 10px 0;"><strong>🏢 Entreprises :</strong> Vos collaborateurs, partenaires, fournisseurs, clients</p>
                </div>
                <p style="text-align: center; font-weight: bold; color: #2e7d32; margin-top: 15px;">
                  Plus on est de membres, plus le rabais est élevé (jusqu'à 20%) !
                </p>
                
                <h4 style="color: #2e7d32; margin-top: 25px;">💰 Tableau des rabais de groupe :</h4>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0; background: white; border-radius: 5px; overflow: hidden;">
                  <thead>
                    <tr style="background: #4caf50; color: white;">
                      <th style="padding: 12px; text-align: left; border-bottom: 2px solid #388e3c;">Membres</th>
                      <th style="padding: 12px; text-align: center; border-bottom: 2px solid #388e3c;">Rabais</th>
                      <th style="padding: 12px; text-align: right; border-bottom: 2px solid #388e3c;">Prix annuel</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background: #f9f9f9;">
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">2</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">4%</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${(clientData.montantPaye * 0.96).toFixed(2)}</td>
                    </tr>
                    <tr style="background: white;">
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">3</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">6%</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${(clientData.montantPaye * 0.94).toFixed(2)}</td>
                    </tr>
                    <tr style="background: #f9f9f9;">
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">4</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">8%</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${(clientData.montantPaye * 0.92).toFixed(2)}</td>
                    </tr>
                    <tr style="background: white;">
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">5</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">10%</td>
                      <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${(clientData.montantPaye * 0.90).toFixed(2)}</td>
                    </tr>
                    <tr style="background: #e8f5e9;">
                      <td style="padding: 10px; font-weight: bold;">10+</td>
                      <td style="padding: 10px; text-align: center; font-weight: bold; color: #2e7d32; font-size: 18px;">20% MAX</td>
                      <td style="padding: 10px; text-align: right; font-weight: bold; color: #2e7d32;">CHF ${(clientData.montantPaye * 0.80).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                
                <p style="margin-top: 20px; font-size: 14px; color: #666; text-align: center;">
                  <em>Plus on est de membres, plus le rabais est élevé !</em>
                </p>
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
      throw error;
    }

    console.log('✅ Email de bienvenue envoyé:', data);
    return data;

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}
