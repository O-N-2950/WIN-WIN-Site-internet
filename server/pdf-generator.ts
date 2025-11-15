/**
 * Générateur PDF Mandat pour WIN WIN Finance Group
 * Crée un PDF personnalisé du mandat de gestion avec signature
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export interface MandatData {
  mandatNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientType: 'particulier' | 'entreprise';
  annualPrice: number;
  isFree: boolean;
  signatureUrl?: string;
  signatureDate: string; // Format ISO
}

/**
 * Générer le PDF du mandat de gestion
 */
export async function generateMandatPDF(data: MandatData): Promise<Buffer> {
  // Créer un nouveau document PDF
  const pdfDoc = await PDFDocument.create();
  
  // Ajouter une page A4
  const page = pdfDoc.addPage([595, 842]); // A4 en points (210mm x 297mm)
  
  // Charger les polices
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  const { width, height } = page.getSize();
  
  // Couleur WIN WIN (bleu)
  const winwinBlue = rgb(0.192, 0.463, 0.651); // #3176A6
  
  let y = height - 80;
  
  // === EN-TÊTE ===
  
  // Logo WIN WIN (texte pour le moment, à remplacer par image si nécessaire)
  page.drawText('WIN WIN', {
    x: 50,
    y,
    size: 24,
    font: fontBold,
    color: winwinBlue,
  });
  
  page.drawText('FINANCE GROUP', {
    x: 50,
    y: y - 20,
    size: 12,
    font: fontRegular,
    color: winwinBlue,
  });
  
  y -= 60;
  
  // Ligne de séparation
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 2,
    color: winwinBlue,
  });
  
  y -= 40;
  
  // === TITRE ===
  
  page.drawText('MANDAT DE GESTION', {
    x: 50,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  
  y -= 30;
  
  page.drawText(`Numéro de mandat : ${data.mandatNumber}`, {
    x: 50,
    y,
    size: 12,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  y -= 40;
  
  // === INFORMATIONS CLIENT ===
  
  page.drawText('INFORMATIONS CLIENT', {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: winwinBlue,
  });
  
  y -= 25;
  
  // Nom
  page.drawText('Nom :', {
    x: 50,
    y,
    size: 11,
    font: fontBold,
  });
  
  page.drawText(data.clientName, {
    x: 150,
    y,
    size: 11,
    font: fontRegular,
  });
  
  y -= 20;
  
  // Email
  page.drawText('Email :', {
    x: 50,
    y,
    size: 11,
    font: fontBold,
  });
  
  page.drawText(data.clientEmail, {
    x: 150,
    y,
    size: 11,
    font: fontRegular,
  });
  
  y -= 20;
  
  // Type de client
  page.drawText('Type de client :', {
    x: 50,
    y,
    size: 11,
    font: fontBold,
  });
  
  page.drawText(data.clientType === 'particulier' ? 'Particulier' : 'Entreprise', {
    x: 150,
    y,
    size: 11,
    font: fontRegular,
  });
  
  y -= 20;
  
  // Adresse (si disponible)
  if (data.clientAddress) {
    page.drawText('Adresse :', {
      x: 50,
      y,
      size: 11,
      font: fontBold,
    });
    
    page.drawText(data.clientAddress, {
      x: 150,
      y,
      size: 11,
      font: fontRegular,
    });
    
    y -= 20;
  }
  
  y -= 20;
  
  // === OBJET DU MANDAT ===
  
  page.drawText('OBJET DU MANDAT', {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: winwinBlue,
  });
  
  y -= 25;
  
  const mandatText = [
    'Par le présent mandat, le client confie à WIN WIN Finance Group Sàrl la gestion',
    'et l\'optimisation de ses contrats d\'assurance. Le mandat inclut :',
    '',
    '• Analyse complète de la situation actuelle',
    '• Identification des optimisations possibles',
    '• Négociation avec les compagnies d\'assurance',
    '• Suivi annuel et ajustements',
    '• Conseil personnalisé',
  ];
  
  for (const line of mandatText) {
    page.drawText(line, {
      x: 50,
      y,
      size: 10,
      font: fontRegular,
    });
    y -= 15;
  }
  
  y -= 20;
  
  // === TARIFICATION ===
  
  page.drawText('TARIFICATION', {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: winwinBlue,
  });
  
  y -= 25;
  
  if (data.isFree) {
    page.drawText('Mandat offert', {
      x: 50,
      y,
      size: 12,
      font: fontBold,
      color: rgb(0, 0.6, 0),
    });
    
    y -= 20;
    
    page.drawText('Ce mandat vous est offert gracieusement.', {
      x: 50,
      y,
      size: 10,
      font: fontRegular,
    });
  } else {
    page.drawText(`Tarif annuel : CHF ${data.annualPrice}.-`, {
      x: 50,
      y,
      size: 12,
      font: fontBold,
    });
    
    y -= 20;
    
    page.drawText('Paiement annuel par abonnement Stripe.', {
      x: 50,
      y,
      size: 10,
      font: fontRegular,
    });
  }
  
  y -= 40;
  
  // === SIGNATURE ===
  
  page.drawText('SIGNATURE CLIENT', {
    x: 50,
    y,
    size: 14,
    font: fontBold,
    color: winwinBlue,
  });
  
  y -= 25;
  
  page.drawText(`Date : ${new Date(data.signatureDate).toLocaleDateString('fr-CH')}`, {
    x: 50,
    y,
    size: 10,
    font: fontRegular,
  });
  
  y -= 20;
  
  // Si une signature est fournie, l'intégrer (TODO: implémenter)
  if (data.signatureUrl) {
    page.drawText('[Signature électronique]', {
      x: 50,
      y,
      size: 10,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    // TODO: Télécharger l'image de signature et l'intégrer
    // const signatureImage = await fetch(data.signatureUrl).then(r => r.arrayBuffer());
    // const image = await pdfDoc.embedPng(signatureImage);
    // page.drawImage(image, { x: 50, y: y - 60, width: 200, height: 60 });
  }
  
  y -= 80;
  
  // === PIED DE PAGE ===
  
  page.drawLine({
    start: { x: 50, y: 100 },
    end: { x: width - 50, y: 100 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  page.drawText('WIN WIN Finance Group Sàrl', {
    x: 50,
    y: 80,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  page.drawText('Finma 75642 | RC JU CHE-114.276.458', {
    x: 50,
    y: 65,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  page.drawText('032 466 11 00 | contact@winwin.swiss', {
    x: 50,
    y: 50,
    size: 9,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Sauvegarder le PDF
  const pdfBytes = await pdfDoc.save();
  
  return Buffer.from(pdfBytes);
}

/**
 * Générer et sauvegarder le PDF du mandat
 */
export async function generateAndSaveMandatPDF(
  data: MandatData,
  outputPath: string
): Promise<string> {
  const pdfBuffer = await generateMandatPDF(data);
  
  // Créer le répertoire si nécessaire
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Sauvegarder le fichier
  fs.writeFileSync(outputPath, pdfBuffer);
  
  return outputPath;
}
