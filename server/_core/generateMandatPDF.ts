import { readFileSync } from 'fs';
import { join } from 'path';
import { ENV } from './env';

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
 * Utilise PDFShift pour la conversion HTML → PDF
 * 
 * @param data - Données du client et signature
 * @returns Buffer du PDF généré
 */
export async function generateMandatPDF(data: MandatData): Promise<Buffer> {
  try {
    console.log('[PDF] 📄 Génération PDF avec PDFShift...');
    
    // DEBUG: Vérifier que la clé API est chargée
    console.log('[DEBUG] PDFSHIFT_API_KEY exists?', !!ENV.pdfshiftApiKey);
    console.log('[DEBUG] PDFSHIFT_API_KEY first 10 chars:', ENV.pdfshiftApiKey?.substring(0, 10));
    
    if (!ENV.pdfshiftApiKey) {
      throw new Error('PDFSHIFT_API_KEY non définie dans les variables d\'environnement');
    }
    
    // Lire le template HTML
    const templatePath = join(process.cwd(), 'server/email-templates/mandat-template.html');
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

    console.log('[PDF] 🔄 Envoi à PDFShift...');

    // Appeler PDFShift pour générer le PDF
    const response = await fetch('https://api.pdfshift.io/v3/convert/pdf', {
      method: 'POST',
      headers: {
        'X-API-Key': ENV.pdfshiftApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: htmlContent,
        sandbox: false,
        format: 'A4',
        margin: {
          top: '10mm',
          bottom: '10mm',
          left: '10mm',
          right: '10mm'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[PDF] ❌ Erreur PDFShift:', errorText);
      throw new Error(`PDFShift API error: ${response.status} - ${errorText}`);
    }

    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    console.log('[PDF] ✅ PDF généré avec succès:', pdfBuffer.length, 'bytes');
    
    return pdfBuffer;

  } catch (error) {
    console.error('[PDF] ❌ Erreur lors de la génération du PDF:', error);
    throw error;
  }
}
