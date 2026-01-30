import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { join } from 'path';

interface MandatData {
  clientName: string;
  clientAddress: string;
  clientNPA: string;
  clientLocality: string;
  signatureUrl: string;
  signatureDate: string;
}

/**
 * Génère un PDF du mandat de gestion WIN WIN à partir du template HTML
 * 
 * @param data - Données du client et signature
 * @returns Buffer du PDF généré
 */
export async function generateMandatPDF(data: MandatData): Promise<Buffer> {
  // Lire le template HTML
  const templatePath = join(__dirname, '../email-templates/mandat-template.html');
  let htmlContent = readFileSync(templatePath, 'utf-8');

  // Remplacer les variables du template
  htmlContent = htmlContent
    .replace(/\{\{CLIENT_NAME\}\}/g, data.clientName)
    .replace(/\{\{CLIENT_ADDRESS\}\}/g, data.clientAddress)
    .replace(/\{\{CLIENT_NPA\}\}/g, data.clientNPA)
    .replace(/\{\{CLIENT_LOCALITY\}\}/g, data.clientLocality)
    .replace(/\{\{SIGNATURE_URL\}\}/g, data.signatureUrl)
    .replace(/\{\{SIGNATURE_DISPLAY\}\}/g, data.signatureUrl ? 'block' : 'none')
    .replace(/\{\{SIGNATURE_DATE\}\}/g, data.signatureDate);

  // Lancer Puppeteer pour générer le PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    
    // Charger le HTML
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm',
      },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
