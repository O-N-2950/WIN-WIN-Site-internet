import puppeteer from 'puppeteer';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Obtenir __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Trouve le chemin de Chromium dans le conteneur Docker
 * Essaie plusieurs chemins possibles et utilise 'which' en dernier recours
 */
function findChromiumPath(): string | undefined {
  // Liste des chemins possibles
  const possiblePaths = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
  ];

  // Essayer chaque chemin
  for (const path of possiblePaths) {
    if (path && existsSync(path)) {
      console.log(`[Puppeteer] Chromium trouvé à: ${path}`);
      return path;
    }
  }

  // Utiliser 'which' pour trouver Chromium
  try {
    const result = execSync('which chromium || which chromium-browser || which google-chrome', {
      encoding: 'utf-8',
    }).trim();
    if (result) {
      console.log(`[Puppeteer] Chromium trouvé via 'which': ${result}`);
      return result;
    }
  } catch (error) {
    console.error('[Puppeteer] Impossible de trouver Chromium avec which:', error);
  }

  // Aucun chemin trouvé, laisser Puppeteer utiliser son Chrome par défaut
  console.warn('[Puppeteer] Aucun Chromium trouvé, utilisation du Chrome par défaut de Puppeteer');
  return undefined;
}

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
  // Utiliser process.cwd() pour pointer vers la racine du projet en production
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

  // Lancer Puppeteer pour générer le PDF
  // Détecter automatiquement le chemin de Chromium
  const chromiumPath = findChromiumPath();
  console.log(`[Puppeteer] Lancement avec executablePath: ${chromiumPath || 'default'}`);
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: chromiumPath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ],
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
