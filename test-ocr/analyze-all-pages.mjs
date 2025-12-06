import vision from '@google-cloud/vision';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialiser le client Google Cloud Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '..', 'google-cloud-vision-key.json')
});

/**
 * Convertir un PDF en images (une par page) en utilisant pdf2image
 */
async function pdfToImages(pdfPath) {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);
  
  const outputDir = path.join(__dirname, 'temp-images');
  await fs.mkdir(outputDir, { recursive: true });
  
  const baseName = path.basename(pdfPath, '.pdf');
  const outputPattern = path.join(outputDir, `${baseName}-page`);
  
  // Utiliser pdftoppm pour convertir toutes les pages
  const command = `pdftoppm -png "${pdfPath}" "${outputPattern}"`;
  
  try {
    await execAsync(command);
    
    // Lister toutes les images générées
    const files = await fs.readdir(outputDir);
    const imageFiles = files
      .filter(f => f.startsWith(`${baseName}-page`) && f.endsWith('.png'))
      .sort()
      .map(f => path.join(outputDir, f));
    
    return imageFiles;
  } catch (error) {
    console.error('Erreur conversion PDF:', error);
    return [];
  }
}

/**
 * Extraire le texte d'une image avec Google Cloud Vision
 */
async function extractTextFromImage(imagePath) {
  try {
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    
    if (detections && detections.length > 0) {
      return detections[0].description || '';
    }
    
    return '';
  } catch (error) {
    console.error(`Erreur OCR pour ${imagePath}:`, error.message);
    return '';
  }
}

/**
 * Parser intelligent pour détecter le type de police et extraire les données
 */
function parseInsurancePolicy(text, filename) {
  const result = {
    filename,
    company: null,
    policyNumber: null,
    policyType: null,
    insuredPerson: null,
    address: null,
    annualPremium: null,
    startDate: null,
    endDate: null,
    franchise: null,
    coverageType: null, // LAMal, LCA, LAMal+LCA, LAA, IJM, Vehicle, etc.
    rawText: text
  };
  
  // Détecter la compagnie
  const companyPatterns = [
    { pattern: /SWICA/i, name: 'SWICA' },
    { pattern: /AXA/i, name: 'AXA' },
    { pattern: /Swiss\s*Life/i, name: 'Swiss Life' },
    { pattern: /Emmental/i, name: 'Emmental' },
    { pattern: /simpego/i, name: 'SIMPEGO' },
    { pattern: /Groupe\s*Mutuel/i, name: 'Groupe Mutuel' },
    { pattern: /CSS/i, name: 'CSS' },
    { pattern: /Helsana/i, name: 'Helsana' }
  ];
  
  for (const { pattern, name } of companyPatterns) {
    if (pattern.test(text)) {
      result.company = name;
      break;
    }
  }
  
  // Détecter le type de couverture
  if (/LAMal.*LCA|LCA.*LAMal|assurance.*base.*compl[ée]mentaire/i.test(text)) {
    result.coverageType = 'LAMal+LCA';
  } else if (/LAMal|assurance.*base|assurance.*obligatoire/i.test(text)) {
    result.coverageType = 'LAMal';
  } else if (/LCA|assurance.*compl[ée]mentaire/i.test(text)) {
    result.coverageType = 'LCA';
  } else if (/LAA|accidents.*professionnels/i.test(text)) {
    result.coverageType = 'LAA';
  } else if (/IJM|indemni.*journali[èe]re/i.test(text)) {
    result.coverageType = 'IJM';
  } else if (/v[ée]hicule|automobile|car\s*assurance/i.test(text)) {
    result.coverageType = 'Vehicle';
  }
  
  // Extraire le numéro de police (patterns variés)
  const policyPatterns = [
    /police[:\s]+([A-Z0-9\-\/]+)/i,
    /contrat[:\s]+([A-Z0-9\-\/]+)/i,
    /n[°\s]+(?:de\s+)?(?:police|contrat)[:\s]*([A-Z0-9\-\/]+)/i,
    /([A-Z]{3}\d{5,})/,
    /(\d{7,}\/\d{4})/,
    /(\d{7,})/
  ];
  
  for (const pattern of policyPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.policyNumber = match[1].trim();
      break;
    }
  }
  
  // Extraire le nom de l'assuré
  const namePatterns = [
    /(?:Monsieur|Madame|M\.|Mme)\s+([A-Z][a-zéèêàâôûç]+(?:\s+[A-Z][a-zéèêàâôûç]+)+)/,
    /Assur[ée](?:e)?[:\s]+([A-Z][a-zéèêàâôûç]+(?:\s+[A-Z][a-zéèêàâôûç]+)+)/i,
    /Preneur[:\s]+([A-Z][a-zéèêàâôûç]+(?:\s+[A-Z][a-zéèêàâôûç]+)+)/i
  ];
  
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match) {
      result.insuredPerson = match[1].trim();
      break;
    }
  }
  
  // Extraire l'adresse
  const addressPattern = /(?:CH-)?(\d{4})\s+([A-Z][a-zéèêàâôûç]+(?:\s+[A-Z][a-zéèêàâôûç]+)*)/;
  const addressMatch = text.match(addressPattern);
  if (addressMatch) {
    result.address = `${addressMatch[1]} ${addressMatch[2]}`;
  }
  
  // Extraire la prime annuelle
  const premiumPatterns = [
    /prime\s+annuelle[:\s]+CHF\s+([\d']+\.?\d*)/i,
    /CHF\s+([\d']+\.?\d*)\s*\/\s*an/i,
    /total[:\s]+CHF\s+([\d']+\.?\d*)/i
  ];
  
  for (const pattern of premiumPatterns) {
    const match = text.match(pattern);
    if (match) {
      result.annualPremium = match[1].replace(/'/g, '');
      break;
    }
  }
  
  // Extraire la franchise (pour LAMal)
  const franchisePattern = /franchise[:\s]+CHF\s+([\d']+)/i;
  const franchiseMatch = text.match(franchisePattern);
  if (franchiseMatch) {
    result.franchise = franchiseMatch[1].replace(/'/g, '');
  }
  
  // Extraire les dates
  const datePattern = /(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/g;
  const dates = [...text.matchAll(datePattern)].map(m => `${m[1]}.${m[2]}.${m[3]}`);
  if (dates.length >= 2) {
    result.startDate = dates[0];
    result.endDate = dates[1];
  }
  
  return result;
}

/**
 * Nettoyer le dossier temporaire
 */
async function cleanupTempImages() {
  const tempDir = path.join(__dirname, 'temp-images');
  try {
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    // Ignorer les erreurs de nettoyage
  }
}

/**
 * Analyser un PDF complet (toutes les pages)
 */
async function analyzePDF(pdfPath) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Analyse de: ${path.basename(pdfPath)}`);
  console.log('='.repeat(80));
  
  // Convertir le PDF en images
  console.log('Conversion PDF → Images...');
  const imageFiles = await pdfToImages(pdfPath);
  
  if (imageFiles.length === 0) {
    console.log('❌ Aucune page convertie');
    return null;
  }
  
  console.log(`✅ ${imageFiles.length} page(s) convertie(s)`);
  
  // Extraire le texte de chaque page
  let fullText = '';
  for (let i = 0; i < imageFiles.length; i++) {
    console.log(`Extraction OCR page ${i + 1}/${imageFiles.length}...`);
    const pageText = await extractTextFromImage(imageFiles[i]);
    fullText += `\n\n--- PAGE ${i + 1} ---\n\n${pageText}`;
    console.log(`  → ${pageText.length} caractères extraits`);
  }
  
  // Parser les données
  console.log('\nParsing des données...');
  const parsed = parseInsurancePolicy(fullText, path.basename(pdfPath));
  
  // Afficher les résultats
  console.log('\n📊 RÉSULTATS:');
  console.log(`  Compagnie: ${parsed.company || '❌ Non détecté'}`);
  console.log(`  Type: ${parsed.coverageType || '❌ Non détecté'}`);
  console.log(`  N° Police: ${parsed.policyNumber || '❌ Non détecté'}`);
  console.log(`  Assuré: ${parsed.insuredPerson || '❌ Non détecté'}`);
  console.log(`  Adresse: ${parsed.address || '❌ Non détecté'}`);
  console.log(`  Prime annuelle: ${parsed.annualPremium ? 'CHF ' + parsed.annualPremium : '❌ Non détecté'}`);
  console.log(`  Franchise: ${parsed.franchise ? 'CHF ' + parsed.franchise : 'N/A'}`);
  console.log(`  Début: ${parsed.startDate || '❌ Non détecté'}`);
  console.log(`  Fin: ${parsed.endDate || '❌ Non détecté'}`);
  
  // Calculer le score de précision
  const fields = ['company', 'coverageType', 'policyNumber', 'insuredPerson', 'address', 'annualPremium'];
  const detected = fields.filter(f => parsed[f] !== null).length;
  const accuracy = Math.round((detected / fields.length) * 100);
  console.log(`\n🎯 Précision: ${accuracy}% (${detected}/${fields.length} champs détectés)`);
  
  // Sauvegarder le texte complet
  const outputPath = pdfPath.replace('.pdf', '-full-ocr.txt');
  await fs.writeFile(outputPath, fullText, 'utf-8');
  console.log(`\n💾 Texte complet sauvegardé: ${path.basename(outputPath)}`);
  
  // Sauvegarder les données parsées
  const jsonPath = pdfPath.replace('.pdf', '-parsed.json');
  await fs.writeFile(jsonPath, JSON.stringify(parsed, null, 2), 'utf-8');
  console.log(`💾 Données parsées sauvegardées: ${path.basename(jsonPath)}`);
  
  return parsed;
}

/**
 * Main
 */
async function main() {
  const pdfFiles = [
    'police-axa.pdf',
    'police-swisslife.pdf',
    'police-emmental.pdf',
    'police-swica-lamal-lca.pdf',
    'police-simpego-vehicule.pdf',
    'police-groupemutuel-ijm.pdf'
  ];
  
  const results = [];
  
  for (const pdfFile of pdfFiles) {
    const pdfPath = path.join(__dirname, pdfFile);
    
    try {
      const result = await analyzePDF(pdfPath);
      if (result) {
        results.push(result);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de l'analyse de ${pdfFile}:`, error.message);
    }
    
    // Nettoyer les images temporaires
    await cleanupTempImages();
  }
  
  // Résumé global
  console.log('\n\n' + '='.repeat(80));
  console.log('📈 RÉSUMÉ GLOBAL');
  console.log('='.repeat(80));
  
  const totalFields = 6; // company, coverageType, policyNumber, insuredPerson, address, annualPremium
  let totalDetected = 0;
  let totalPossible = 0;
  
  for (const result of results) {
    const fields = ['company', 'coverageType', 'policyNumber', 'insuredPerson', 'address', 'annualPremium'];
    const detected = fields.filter(f => result[f] !== null).length;
    totalDetected += detected;
    totalPossible += totalFields;
    
    const accuracy = Math.round((detected / totalFields) * 100);
    console.log(`${result.filename}: ${accuracy}% (${detected}/${totalFields})`);
  }
  
  const globalAccuracy = Math.round((totalDetected / totalPossible) * 100);
  console.log(`\n🎯 PRÉCISION GLOBALE: ${globalAccuracy}% (${totalDetected}/${totalPossible} champs détectés)`);
  
  if (globalAccuracy >= 90) {
    console.log('✅ OBJECTIF ATTEINT (>90%)');
  } else {
    console.log(`⚠️  OBJECTIF NON ATTEINT (besoin de ${90 - globalAccuracy}% supplémentaires)`);
  }
}

main().catch(console.error);
