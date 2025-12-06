/**
 * Générateur PDF Mandat pour WIN WIN Finance Group
 * Utilise le template officiel et intègre la signature électronique
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Pour ESM (pas de __dirname par défaut)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface MandatData {
  // Informations client
  prenom?: string;
  nom?: string;
  nomEntreprise?: string;
  email: string;
  adresse: string;
  npa: string;
  localite: string;
  
  // Informations entreprise (optionnel)
  formeJuridique?: 'entreprise_individuelle' | 'sarl' | 'sa' | 'autre';
  nombreEmployes?: string;
  
  // Type de client
  typeClient: 'prive' | 'entreprise' | 'les_deux';
  
  // Signature
  signatureDataUrl: string; // Base64 data URL de la signature
  dateSignature: string; // Format ISO ou date lisible
  
  // Informations de paiement (optionnel)
  mandatNumber?: string;
  annualPrice?: number;
  isFree?: boolean;
}

/**
 * Génère un PDF de mandat personnalisé avec les données du client et sa signature
 * Utilise le template officiel Mandatdegestion-WINWINFinanceGroup.pdf
 * 
 * @param data - Les données du client et sa signature
 * @returns Buffer du PDF généré
 */
export async function generateMandatPDF(data: MandatData): Promise<Buffer> {
  try {
    // 1. Charger le template PDF officiel
    // Utiliser process.cwd() pour fonctionner en dev et prod
    const templatePath = join(process.cwd(), 'server', 'templates', 'mandat-template.pdf');
    const templateBytes = await readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    
    // 2. Obtenir la première page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    
    // 3. Charger les polices
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // 4. Définir les positions pour le texte (basé sur l'analyse du template)
    // Section "Le Mandant" (en haut à gauche, dans le cadre bleu clair)
    const mandantX = 85;
    const mandantY = height - 160; // Position remontée dans le cadre
    
    // 5. Ajouter les informations du client dans la section "Le Mandant"
    let currentY = mandantY;
    
    if (data.typeClient === 'entreprise') {
      // Pour les entreprises
      const nomEntreprise = data.nomEntreprise || 'Entreprise';
      firstPage.drawText(nomEntreprise, {
        x: mandantX,
        y: currentY,
        size: 11,
        font: fontBold,
        color: rgb(0.19, 0.46, 0.65), // Bleu WIN WIN #3176A6
      });
      currentY -= 18;
      
      // Forme juridique
      if (data.formeJuridique) {
        const formeText = {
          'entreprise_individuelle': 'Entreprise individuelle',
          'sarl': 'Sàrl',
          'sa': 'SA',
          'autre': 'Autre forme juridique'
        }[data.formeJuridique];
        
        firstPage.drawText(formeText, {
          x: mandantX,
          y: currentY,
          size: 9,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= 15;
      }
      
      // Adresse
      firstPage.drawText(data.adresse, {
        x: mandantX,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= 15;
      
      // NPA + Localité
      firstPage.drawText(`${data.npa} ${data.localite}`, {
        x: mandantX,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= 15;
      
      // Email
      firstPage.drawText(data.email, {
        x: mandantX,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= 15;
      
      // Nombre d'employés (si disponible)
      if (data.nombreEmployes) {
        firstPage.drawText(`Employés: ${data.nombreEmployes}`, {
          x: mandantX,
          y: currentY,
          size: 9,
          font: font,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
      
    } else {
      // Pour les particuliers
      const nomComplet = `${data.prenom || ''} ${data.nom || ''}`.trim();
      firstPage.drawText(nomComplet, {
        x: mandantX,
        y: currentY,
        size: 11,
        font: fontBold,
        color: rgb(0.19, 0.46, 0.65), // Bleu WIN WIN #3176A6
      });
      currentY -= 18;
      
      // Adresse
      firstPage.drawText(data.adresse, {
        x: mandantX,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= 15;
      
      // NPA + Localité
      firstPage.drawText(`${data.npa} ${data.localite}`, {
        x: mandantX,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= 15;
      
      // Email
      firstPage.drawText(data.email, {
        x: mandantX,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
    
    // 6. Intégrer la signature du client
    // Position de la signature (en bas à gauche dans la section "Le Mandant")
    // Basé sur le template, la zone de signature est vers le bas de la page
    const signatureX = 90; // Aligné avec le cadre gauche
    const signatureY = 115; // Juste au-dessus de la ligne "signature"
    const signatureWidth = 200;
    const signatureHeight = 60;
    
    // Convertir le data URL en bytes
    const signatureBase64 = data.signatureDataUrl.split(',')[1];
    if (!signatureBase64) {
      throw new Error('Signature data URL invalide');
    }
    
    const signatureBytes = Buffer.from(signatureBase64, 'base64');
    
    // Embed l'image de signature (PNG par défaut pour Canvas)
    let signatureImage;
    try {
      if (data.signatureDataUrl.startsWith('data:image/png')) {
        signatureImage = await pdfDoc.embedPng(signatureBytes);
      } else if (data.signatureDataUrl.startsWith('data:image/jpeg') || data.signatureDataUrl.startsWith('data:image/jpg')) {
        signatureImage = await pdfDoc.embedJpg(signatureBytes);
      } else {
        // Par défaut, essayer PNG (Canvas génère du PNG)
        signatureImage = await pdfDoc.embedPng(signatureBytes);
      }
    } catch (error) {
      console.error('[PDF Generator] Erreur lors de l\'embedding de la signature:', error);
      throw new Error('Format de signature invalide');
    }
    
    // Dessiner la signature
    firstPage.drawImage(signatureImage, {
      x: signatureX,
      y: signatureY,
      width: signatureWidth,
      height: signatureHeight,
    });
    
    // Ajouter la date de signature sous la signature
    const dateText = `Signé le ${new Date(data.dateSignature).toLocaleDateString('fr-CH')}`;
    firstPage.drawText(dateText, {
      x: signatureX + 10,
      y: 125, // Entre signature et trait
      size: 8,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });
    
    // 7. Générer le PDF final
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
    
  } catch (error) {
    console.error('[PDF Generator] Erreur lors de la génération du mandat:', error);
    throw new Error(`Échec de la génération du PDF: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Génère un nom de fichier unique pour le mandat
 * 
 * @param data - Les données du client
 * @returns Nom de fichier formaté
 */
export function generateMandatFilename(data: MandatData): string {
  const timestamp = Date.now();
  const clientName = data.typeClient === 'entreprise' 
    ? (data.nomEntreprise || 'entreprise').replace(/[^a-zA-Z0-9]/g, '_')
    : `${data.prenom || ''}_${data.nom || ''}`.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  return `mandat_${clientName}_${timestamp}.pdf`;
}

/**
 * Alias pour compatibilité avec l'ancien code
 */
export { generateMandatPDF as generateMandat };
