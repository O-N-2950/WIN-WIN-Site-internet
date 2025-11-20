import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

/**
 * Données du client pour pré-remplir le mandat
 */
export interface ClientData {
  nom: string;
  prenom: string;
  adresse: string;
  npa: string;
  localite: string;
  telephone?: string;
  email?: string;
  dateNaissance?: string;
}

/**
 * Génère un PDF du mandat de gestion pré-rempli avec les données du client
 * @param clientData Données du client
 * @returns Buffer du PDF généré
 */
export async function generateMandatPDF(clientData: ClientData): Promise<Buffer> {
  try {
    // Charger le template PDF
    const templatePath = path.join(__dirname, 'templates', 'mandat-template.pdf');
    const templateBytes = await fs.readFile(templatePath);
    
    // Charger le PDF
    const pdfDoc = await PDFDocument.load(templateBytes);
    
    // Obtenir la première page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Charger la police
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Dimensions de la page
    const { width, height } = firstPage.getSize();
    
    // Couleur bleue WIN WIN
    const blueColor = rgb(49/255, 118/255, 166/255); // #3176A6
    
    // Coordonnées pour le cadre "Le Mandant" (à gauche)
    // Ces coordonnées sont approximatives et devront être ajustées selon le template
    const mandantBoxX = 80;
    const mandantBoxY = height - 300; // Ajuster selon la position réelle
    
    // Écrire les données du client dans le cadre "Le Mandant"
    const nomComplet = `${clientData.prenom} ${clientData.nom}`;
    const adresseComplete = `${clientData.adresse}\n${clientData.npa} ${clientData.localite}`;
    
    // Nom complet (en gras)
    firstPage.drawText(nomComplet, {
      x: mandantBoxX,
      y: mandantBoxY,
      size: 11,
      font: fontBold,
      color: blueColor,
    });
    
    // Adresse
    const adresseLines = adresseComplete.split('\n');
    adresseLines.forEach((line, index) => {
      firstPage.drawText(line, {
        x: mandantBoxX,
        y: mandantBoxY - 20 - (index * 15),
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
    });
    
    // Téléphone (si fourni)
    if (clientData.telephone) {
      firstPage.drawText(`☎ ${clientData.telephone}`, {
        x: mandantBoxX,
        y: mandantBoxY - 60,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
    
    // Email (si fourni)
    if (clientData.email) {
      firstPage.drawText(`✉ ${clientData.email}`, {
        x: mandantBoxX,
        y: mandantBoxY - 75,
        size: 9,
        font: font,
        color: rgb(0, 0, 0),
      });
    }
    
    // Sérialiser le PDF
    const pdfBytes = await pdfDoc.save();
    
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('[PDF Generator] Error generating mandat PDF:', error);
    throw new Error('Failed to generate mandat PDF');
  }
}

/**
 * Fusionne une signature (image PNG) avec le PDF du mandat
 * @param pdfBuffer Buffer du PDF du mandat
 * @param signatureDataUrl Data URL de la signature (Canvas)
 * @returns Buffer du PDF avec signature
 */
export async function addSignatureToPDF(
  pdfBuffer: Buffer,
  signatureDataUrl: string
): Promise<Buffer> {
  try {
    // Charger le PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Extraire les données de l'image depuis le data URL
    const base64Data = signatureDataUrl.split(',')[1];
    const signatureBytes = Buffer.from(base64Data, 'base64');
    
    // Embarquer l'image de signature
    const signatureImage = await pdfDoc.embedPng(signatureBytes);
    
    // Obtenir la première page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    
    // Dimensions de la page
    const { width, height } = firstPage.getSize();
    
    // Coordonnées pour la signature (cadre "Le Mandant" en bas à gauche)
    // Ces coordonnées sont approximatives et devront être ajustées
    const signatureX = 100;
    const signatureY = 120; // Ajuster selon la position du cadre signature
    const signatureWidth = 200;
    const signatureHeight = 60;
    
    // Dessiner la signature
    firstPage.drawImage(signatureImage, {
      x: signatureX,
      y: signatureY,
      width: signatureWidth,
      height: signatureHeight,
    });
    
    // Ajouter la date de signature
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const today = new Date().toLocaleDateString('fr-CH');
    
    firstPage.drawText(`Signé le ${today}`, {
      x: signatureX,
      y: signatureY - 15,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // Sérialiser le PDF
    const pdfBytes = await pdfDoc.save();
    
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('[PDF Generator] Error adding signature to PDF:', error);
    throw new Error('Failed to add signature to PDF');
  }
}
