import vision from '@google-cloud/vision';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration du client Google Cloud Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../google-cloud-vision-key.json')
});

async function analyzeDocument(pdfPath) {
  console.log(`\n📄 Analyse de : ${path.basename(pdfPath)}`);
  console.log('='.repeat(80));
  
  try {
    // Lire le fichier PDF
    const fileBuffer = fs.readFileSync(pdfPath);
    
    // Appel à Google Cloud Vision
    const [result] = await client.documentTextDetection({
      image: { content: fileBuffer }
    });
    
    const fullText = result.fullTextAnnotation?.text || '';
    const confidence = result.fullTextAnnotation?.pages?.[0]?.confidence || 0;
    
    console.log(`✅ Texte extrait (${fullText.length} caractères)`);
    console.log(`📊 Score de confiance : ${(confidence * 100).toFixed(2)}%`);
    console.log('\n--- TEXTE EXTRAIT ---\n');
    console.log(fullText.substring(0, 1000)); // Premiers 1000 caractères
    console.log('\n...(truncated)...\n');
    
    // Sauvegarder le texte complet
    const outputPath = pdfPath.replace('.pdf', '-extracted.txt');
    fs.writeFileSync(outputPath, fullText);
    console.log(`💾 Texte complet sauvegardé : ${path.basename(outputPath)}`);
    
    // Analyse des patterns
    console.log('\n--- PATTERNS DÉTECTÉS ---');
    
    // Numéro de police
    const policyNumberPatterns = [
      /(?:Police|Contrat|N°|Numéro)\s*:?\s*([A-Z0-9.-]+)/i,
      /\b\d{2,3}\.\d{3}\.\d{3}\b/,
      /\b\d{8,10}\b/
    ];
    
    for (const pattern of policyNumberPatterns) {
      const match = fullText.match(pattern);
      if (match) {
        console.log(`🔢 Numéro de police (pattern ${pattern}) : ${match[1] || match[0]}`);
      }
    }
    
    // Compagnie d'assurance
    const companies = ['SwissLife', 'Swiss Life', 'AXA', 'Allianz', 'Zurich', 'Helvetia', 'Mobilière', 'Baloise', 'Generali', 'Emmental'];
    for (const company of companies) {
      if (fullText.includes(company)) {
        console.log(`🏢 Compagnie détectée : ${company}`);
      }
    }
    
    // Montant prime
    const primePattern = /(?:Prime|Montant|CHF)\s*:?\s*CHF?\s*([\d']+\.?\d*)/i;
    const primeMatch = fullText.match(primePattern);
    if (primeMatch) {
      console.log(`💰 Prime détectée : CHF ${primeMatch[1]}`);
    }
    
    // Dates
    const datePattern = /\b(\d{1,2})[./](\d{1,2})[./](\d{2,4})\b/g;
    const dates = [...fullText.matchAll(datePattern)].slice(0, 5);
    if (dates.length > 0) {
      console.log(`📅 Dates détectées : ${dates.map(d => d[0]).join(', ')}`);
    }
    
    return {
      fullText,
      confidence,
      outputPath
    };
    
  } catch (error) {
    console.error(`❌ Erreur lors de l'analyse : ${error.message}`);
    throw error;
  }
}

// Analyser les 3 polices
async function main() {
  console.log('\n🚀 TEST GOOGLE CLOUD VISION OCR\n');
  
  const pdfs = [
    path.join(__dirname, 'police-swisslife.pdf'),
    path.join(__dirname, 'police-emmental.pdf'),
    path.join(__dirname, 'police-axa.pdf')
  ];
  
  for (const pdf of pdfs) {
    try {
      await analyzeDocument(pdf);
    } catch (error) {
      console.error(`Erreur avec ${path.basename(pdf)}:`, error.message);
    }
  }
  
  console.log('\n✅ Test terminé !\n');
}

main().catch(console.error);
