import { Resend } from 'resend';

const resend = new Resend('re_FVVVMDUg_ETvGedoEuDLr7afSmFZ7QCVj');

console.log('📧 Test email pour ENTREPRISE avec CHF 260.-...\n');

const clientData = {
  prenom: 'Ma petite',
  nom: 'Entreprise',
  email: 'olivier.neukomm@bluewin.ch',
  codeParrainage: 'OLIV-SELS',
  pdfMandatUrl: 'https://example.com/mandat-entreprise.pdf',
  montantPaye: 260
};

// Calcul des prix dynamiques
const prix2membres = (clientData.montantPaye * 0.96).toFixed(2);
const prix3membres = (clientData.montantPaye * 0.94).toFixed(2);
const prix4membres = (clientData.montantPaye * 0.92).toFixed(2);
const prix5membres = (clientData.montantPaye * 0.90).toFixed(2);
const prix10membres = (clientData.montantPaye * 0.80).toFixed(2);

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3176A6 0%, #8CB4D2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bienvenue chez WIN WIN Finance !</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px 20px;">
      <p style="font-size: 18px; color: #333;">Bonjour <strong>${clientData.prenom} ${clientData.nom}</strong>,</p>
      
      <p style="line-height: 1.6; color: #555;">
        Félicitations ! Votre mandat de gestion d'assurances est maintenant actif.
      </p>
      
      <!-- Mandat signé -->
      <div style="background: #e3f2fd; border-left: 4px solid #3176A6; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #3176A6; margin-top: 0;">📄 Votre mandat signé</h3>
        <a href="${clientData.pdfMandatUrl}" 
           style="display: inline-block; background: #3176A6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
          Télécharger le PDF
        </a>
      </div>
      
      <!-- Montant payé -->
      <div style="background: #fff3e0; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #D4AF37; margin-top: 0;">💰 Montant payé</h3>
        <p style="font-size: 24px; font-weight: bold; color: #333; margin: 10px 0;">
          CHF ${clientData.montantPaye}.- <span style="font-size: 14px; color: #666;">(paiement annuel)</span>
        </p>
      </div>
      
      <!-- Parrainage -->
      <div style="background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #2e7d32; margin-top: 0;">🎁 Parrainez vos proches et économisez !</h3>
        
        <p style="margin-bottom: 15px;"><strong>Votre code personnel :</strong></p>
        <div style="text-align: center; margin: 20px 0;">
          <div style="display: inline-block; background: white; border: 3px dashed #4caf50; padding: 20px 40px; border-radius: 10px;">
            <span style="font-size: 32px; font-weight: bold; color: #2e7d32; letter-spacing: 3px;">${clientData.codeParrainage}</span>
          </div>
        </div>
        
        <p style="margin-bottom: 10px;"><strong>📱 Partager avec :</strong></p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://wa.me/?text=🎉%20Rejoins-moi%20chez%20WIN%20WIN%20Finance%20!%0A%0AUtilise%20mon%20code%20de%20parrainage%20%3A%20${clientData.codeParrainage}%0A%0ATu%20bénéficieras%20d'un%20rabais%20immédiat%20et%20nous%20bénéficierons%20tous%20de%20rabais%20de%20groupe%20!%0A%0A👨‍👩‍👧‍👦%20Particuliers%20%3A%20Idéal%20pour%20votre%20famille%20et%20proches%0A🏢%20Entreprises%20%3A%20Idéal%20pour%20vos%20collaborateurs%0A%0APlus%20on%20est%20de%20membres%2C%20plus%20le%20rabais%20est%20élevé%20(jusqu'à%2020%25%20!)%0A%0AInfos%20%3A%20https%3A%2F%2Fwww.winwin.swiss"
             style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 5px;">
            📱 WhatsApp
          </a>
          <a href="mailto:?subject=Rejoins%20WIN%20WIN%20Finance%20!&body=Salut%20!%0A%0AJe%20viens%20de%20rejoindre%20WIN%20WIN%20Finance%20pour%20la%20gestion%20de%20mes%20assurances.%0A%0AUtilise%20mon%20code%20de%20parrainage%20%3A%20${clientData.codeParrainage}%0A%0ATu%20bénéficieras%20d'un%20rabais%20immédiat%20et%20nous%20bénéficierons%20tous%20de%20rabais%20de%20groupe%20!%0A%0AParticuliers%20%3A%20Idéal%20pour%20votre%20famille%20et%20proches%0AEntreprises%20%3A%20Idéal%20pour%20vos%20collaborateurs%0A%0APlus%20on%20est%20de%20membres%2C%20plus%20le%20rabais%20est%20élevé%20(jusqu'à%2020%25%20!)%0A%0APlus%20d'infos%20%3A%20https%3A%2F%2Fwww.winwin.swiss" 
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
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${prix2membres}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">3</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">6%</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${prix3membres}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">4</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">8%</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${prix4membres}</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">5</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: center; font-weight: bold; color: #4caf50;">10%</td>
              <td style="padding: 10px; border-bottom: 1px solid #e0e0e0; text-align: right;">CHF ${prix5membres}</td>
            </tr>
            <tr style="background: #e8f5e9;">
              <td style="padding: 10px; font-weight: bold;">10+</td>
              <td style="padding: 10px; text-align: center; font-weight: bold; color: #2e7d32; font-size: 18px;">20% MAX</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; color: #2e7d32;">CHF ${prix10membres}</td>
            </tr>
          </tbody>
        </table>
        
        <p style="margin-top: 20px; font-size: 14px; color: #666; text-align: center;">
          <em>Plus on est de membres, plus le rabais est élevé !</em>
        </p>
      </div>
      
      <!-- Prochaines étapes -->
      <h3 style="color: #3176A6;">Prochaines étapes :</h3>
      <ol style="line-height: 1.8; color: #555;">
        <li>Votre conseiller vous contactera sous 48h</li>
        <li>Préparez vos polices d'assurance actuelles</li>
        <li>Accédez à votre espace client Airtable (lien envoyé séparément)</li>
      </ol>
      
      <p style="margin-top: 30px; color: #555;">
        Des questions ? Répondez simplement à cet email !
      </p>
      
      <p style="margin-top: 20px; color: #555;">
        Cordialement,<br>
        <strong>L'équipe WIN WIN Finance Group</strong>
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999;">
      <p style="margin: 5px 0;"><strong>WIN WIN Finance Group Sàrl</strong></p>
      <p style="margin: 5px 0;">Courtier en assurances FINMA (F01042365)</p>
      <p style="margin: 5px 0;">Bellevue 7, 2950 Courgenay</p>
      <p style="margin: 5px 0;">
        <a href="https://www.winwin.swiss" style="color: #3176A6; text-decoration: none;">www.winwin.swiss</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

try {
  const result = await resend.emails.send({
    from: 'WIN WIN Finance Group <contact@winwin.swiss>',
    to: clientData.email,
    subject: '🎉 Bienvenue chez WIN WIN Finance !',
    html: htmlContent
  });
  
  console.log('✅ Email envoyé avec succès !');
  console.log('📧 ID:', result.id);
  console.log('📬 Expéditeur: contact@winwin.swiss');
  console.log('📬 Destinataire:', clientData.email);
  console.log('🏢 Nom entreprise:', clientData.prenom, clientData.nom);
  console.log('💰 Montant payé: CHF', clientData.montantPaye);
  console.log('🎫 Code de parrainage:', clientData.codeParrainage);
  console.log('\n📊 TABLEAU DES RABAIS CALCULÉ DYNAMIQUEMENT :');
  console.log('2 membres (4%) : CHF', prix2membres);
  console.log('3 membres (6%) : CHF', prix3membres);
  console.log('4 membres (8%) : CHF', prix4membres);
  console.log('5 membres (10%) : CHF', prix5membres);
  console.log('10+ membres (20%) : CHF', prix10membres);
  console.log('\n🎉 EMAIL ENTREPRISE AVEC TABLEAU DYNAMIQUE !');
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
