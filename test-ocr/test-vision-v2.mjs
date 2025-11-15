import vision from '@google-cloud/vision';
import { fromPath } from 'pdf2pic';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du client Google Cloud Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../google-cloud-vision-key.json')
});

async function convertPdfToImages(pdfPath) {
  console.log(`📸 Conversion PDF → Images : ${path.basename(pdfPath)}`);
  
  const options = {
    density: 300,           // DPI (qualité)
    saveFilename: path.basename(pdfPath, '.pdf'),
    savePath: __dirname,
    format: "png",
    width: 2480,           // Largeur en pixels (A4 à 300 DPI)
    height: 3508           // Hauteur en pixels (A4 à 300 DPI)
  };
  
  const convert = fromPath(pdfPath, options);
  
  // Convertir la première page (pour le test)
  const pageToConvertAsImage = 1;
  
  try {
    const result = await convert(pageToConvertAsImage, { responseType: "image" });
    console.log(`✅ Page 1 convertie : ${result.name}`);
    return result.path;
  } catch (error) {
    console.error(`❌ Erreur conversion : ${error.message}`);
    throw error;
  }
}

async function analyzeImage(imagePath) {
  console.log(`🔍 Analyse OCR : ${path.basename(imagePath)}`);
  
  try {
    // Lire l'image
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Appel à Google Cloud Vision
    const [result] = await client.textDetection({
      image: { content: imageBuffer }
    });
    
    const detections = result.textAnnotations;
    const fullText = detections?.[0]?.description || '';
    
    console.log(`✅ Texte extrait : ${fullText.length} caractères`);
    
    return fullText;
    
  } catch (error) {
    console.error(`❌ Erreur OCR : ${error.message}`);
    throw error;
  }
}

function parseInsurancePolicy(text, pdfName) {
  console.log('\n--- ANALYSE DES DONNÉES ---');
  
  const data = {
    source: pdfName,
    numeroPolice: null,
    compagnie: null,
    primeAnnuelle: null,
    dateDebut: null,
    dateFin: null,
    client: null,
    adresse: null
  };
  
  // Numéro de police
  const policyPatterns = [
    /(?:Police|Contrat|N°|Numéro)\s*:?\s*n?°?\s*([A-Z0-9.-]+)/i,
    /\b(\d{2,3}\.\d{3}\.\d{3})\b/,
    /\b(\d{8,10})\b/
  ];
  
  for (const pattern of policyPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.numeroPolice = match[1] || match[0];
      console.log(`🔢 Numéro de police : ${data.numeroPolice}`);
      break;
    }
  }
  
  // Compagnie d'assurance
  const companies = [
    'Swiss Life', 'SwissLife',
    'AXA', 'AXA Assurances',
    'Allianz', 'Allianz Suisse',
    'Zurich', 'Zurich Assurances',
    'Helvetia',
    'La Mobilière', 'Mobilière',
    'Baloise',
    'Generali',
    'Emmental', 'Emmental Assurance'
  ];
  
  for (const company of companies) {
    if (text.includes(company)) {
      data.compagnie = company;
      console.log(`🏢 Compagnie : ${data.compagnie}`);
      break;
    }
  }
  
  // Prime annuelle
  const primePatterns = [
    /(?:Prime annuelle totale|Prime totale|Total)\s*:?\s*CHF\s*([\d']+\.?\d*)/i,
    /CHF\s*([\d']+\.?\d*)\s*(?:par an|annuel)/i
  ];
  
  for (const pattern of primePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.primeAnnuelle = parseFloat(match[1].replace("'", ""));
      console.log(`💰 Prime annuelle : CHF ${data.primeAnnuelle}`);
      break;
    }
  }
  
  // Dates
  const datePattern = /(\d{1,2})[./](\d{1,2})[./](\d{4})/g;
  const dates = [...text.matchAll(datePattern)];
  
  if (dates.length >= 2) {
    data.dateDebut = dates[0][0];
    data.dateFin = dates[1][0];
    console.log(`📅 Date début : ${data.dateDebut}`);
    console.log(`📅 Date fin : ${data.dateFin}`);
  }
  
  // Client (nom)
  const namePattern = /(?:Preneur d'assurance|Assuré|Client)\s*:?\s*([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+(?:\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)+)/i;
  const nameMatch = text.match(namePattern);
  if (nameMatch) {
    data.client = nameMatch[1];
    console.log(`👤 Client : ${data.client}`);
  }
  
  return data;
}

async function analyzeDocument(pdfPath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 ANALYSE : ${path.basename(pdfPath)}`);
  console.log('='.repeat(80));
  
  try {
    // 1. Convertir PDF en image
    const imagePath = await convertPdfToImages(pdfPath);
    
    // 2. OCR avec Google Cloud Vision
    const fullText = await analyzeImage(imagePath);
    
    // 3. Sauvegarder le texte
    const txtPath = pdfPath.replace('.pdf', '-ocr.txt');
    fs.writeFileSync(txtPath, fullText);
    console.log(`💾 Texte sauvegardé : ${path.basename(txtPath)}`);
    
    // 4. Parser les données
    const parsedData = parseInsurancePolicy(fullText, path.basename(pdfPath));
    
    // 5. Sauvegarder les données structurées
    const jsonPath = pdfPath.replace('.pdf', '-data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(parsedData, null, 2));
    console.log(`📊 Données structurées : ${path.basename(jsonPath)}`);
    
    return parsedData;
    
  } catch (error) {
    console.error(`❌ Erreur : ${error.message}`);
    return null;
  }
}

// Analyser les 3 polices
async function main() {
  console.log('\n🚀 TEST GOOGLE CLOUD VISION OCR (v2 - avec conversion images)\n');
  
  const pdfs = [
    path.join(__dirname, 'police-axa.pdf'),
    path.join(__dirname, 'police-swisslife.pdf'),
    path.join(__dirname, 'police-emmental.pdf')
  ];
  
  const results = [];
  
  for (const pdf of pdfs) {
    const data = await analyzeDocument(pdf);
    if (data) {
      results.push(data);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 RÉSUMÉ DES RÉSULTATS');
  console.log('='.repeat(80));
  console.table(results);
  
  console.log('\n✅ Test terminé !\n');
}

main().catch(console.error);
