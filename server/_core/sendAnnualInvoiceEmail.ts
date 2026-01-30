import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AnnualInvoiceEmailData {
  clientName: string;
  clientEmail: string;
  yearsWithUs: number;
  nbMembres: number;
  rabaisPourcent: number;
  prixBase: number;
  montantRabais: number;
  prixFinal: number;
  codeParrainage: string;
}

/**
 * Envoie l'email personnalisé de facturation annuelle
 * Cet email est envoyé AVANT la facture Stripe
 */
export async function sendAnnualInvoiceEmail(data: AnnualInvoiceEmailData): Promise<boolean> {
  try {
    // Lire le template HTML
    const templatePath = path.join(__dirname, '../email-templates/annual-invoice.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Remplacer les variables dynamiques
    htmlContent = htmlContent
      .replace(/{{clientName}}/g, data.clientName)
      .replace(/{{clientEmail}}/g, data.clientEmail)
      .replace(/{{yearsWithUs}}/g, data.yearsWithUs.toString())
      .replace(/{{nbMembres}}/g, data.nbMembres.toString())
      .replace(/{{rabaisPourcent}}/g, data.rabaisPourcent.toString())
      .replace(/{{prixBase}}/g, data.prixBase.toFixed(2))
      .replace(/{{montantRabais}}/g, data.montantRabais.toFixed(2))
      .replace(/{{prixFinal}}/g, data.prixFinal.toFixed(2))
      .replace(/{{codeParrainage}}/g, data.codeParrainage);

    // TODO: Implémenter l'envoi d'email via un service (SendGrid, AWS SES, etc.)
    // Pour l'instant, on log le contenu pour le test
    console.log('[Email] Envoi de l email personnalise a:', data.clientEmail);
    console.log('[Email] Sujet: Votre facturation annuelle WIN WIN Finance');
    
    // Sauvegarder l'email dans un fichier pour le test
    const emailFileName = data.clientEmail.replace('@', '_at_').replace(/\./g, '_');
    const testEmailPath = path.join(__dirname, '../../test-emails', `${emailFileName}.html`);
    const testEmailDir = path.dirname(testEmailPath);
    if (!fs.existsSync(testEmailDir)) {
      fs.mkdirSync(testEmailDir, { recursive: true });
    }
    fs.writeFileSync(testEmailPath, htmlContent);
    console.log('[Email] Email sauvegardé pour test:', testEmailPath);

    return true;
  } catch (error) {
    console.error('[Email] Erreur lors de l envoi de l email:', error);
    return false;
  }
}
