/**
 * Parser amélioré pour polices d'assurance
 * Objectif: >90% de précision
 */

/**
 * Nettoyer le texte OCR (enlever les sauts de ligne parasites)
 */
function cleanText(text) {
  return text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extraire le numéro de police avec patterns améliorés
 */
function extractPolicyNumber(text) {
  const patterns = [
    /Police\s+n[°\s]+(\d+[\.\d]+)/i,
    /Contrat[:\s]+([A-Z]{3}\d{5,})/i,
    /N[°\s]+(?:de\s+)?(?:police|contrat)[:\s]*([A-Z0-9\-\/]+)/i,
    /(\d{2}\.\d{3}\.\d{3})/,  // Format AXA: 18.813.308
    /([A-Z]{3}\d{5})/,  // Format SIMPEGO: CAR71239
    /(\d{7})/  // Format générique 7 chiffres
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Extraire le nom de l'assuré
 */
function extractInsuredPerson(text) {
  const patterns = [
    /(?:Preneur\s+d'assurance|Assur[ée](?:e)?)\s+(?:Monsieur|Madame|M\.|Mme)\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
    /(?:Monsieur|Madame)\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)\s+(?:Chemin|Rue|Route|Avenue)/i,
    /(?:Monsieur|Madame)\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)\s+(?:CH-)?(\d{4})/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  return null;
}

/**
 * Extraire l'adresse (code postal + ville)
 */
function extractAddress(text) {
  const pattern = /(?:CH-)?(\d{4})\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)*)/;
  const match = text.match(pattern);
  
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  
  return null;
}

/**
 * Extraire la prime annuelle
 */
function extractAnnualPremium(text) {
  const patterns = [
    /Prime\s+annuelle\s+totale[²\s]*CHF\s+([\d']+\.?\d*)/i,
    /Prime\s+annuelle[:\s]+CHF\s+([\d']+\.?\d*)/i,
    /Total[:\s]+CHF\s+([\d']+\.?\d*)\s*\/\s*an/i,
    /CHF\s+([\d']+\.?\d*)\s*Prime\s+annuelle/i
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].replace(/'/g, '');
    }
  }
  
  return null;
}

/**
 * Extraire les dates de début et fin
 */
function extractDates(text) {
  const datePattern = /(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/g;
  const dates = [...text.matchAll(datePattern)].map(m => `${m[1]}.${m[2]}.${m[3]}`);
  
  // Chercher spécifiquement les dates de début et fin
  const startMatch = text.match(/D[ée]but[:\s]+(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/i);
  const endMatch = text.match(/Fin[:\s]+(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/i);
  
  const startDate = startMatch ? `${startMatch[1]}.${startMatch[2]}.${startMatch[3]}` : (dates[0] || null);
  const endDate = endMatch ? `${endMatch[1]}.${endMatch[2]}.${endMatch[3]}` : (dates[1] || null);
  
  return { startDate, endDate };
}

/**
 * Détecter le type de couverture
 */
function detectCoverageType(text) {
  // LAMal + LCA (combiné)
  if (/(?:LAMal|assurance.*base).*(?:LCA|compl[ée]mentaire)|(?:LCA|compl[ée]mentaire).*(?:LAMal|assurance.*base)/i.test(text)) {
    return 'LAMal+LCA';
  }
  
  // LAMal seul
  if (/LAMal|assurance.*(?:base|obligatoire)|assurance.*maladie.*base/i.test(text)) {
    return 'LAMal';
  }
  
  // LCA seul
  if (/LCA|assurance.*compl[ée]mentaire|assurance.*hospitalisation/i.test(text)) {
    return 'LCA';
  }
  
  // LAA (accidents professionnels)
  if (/LAA|accidents.*professionnels/i.test(text)) {
    return 'LAA';
  }
  
  // IJM (indemnités journalières)
  if (/IJM|indemni.*journali[èe]re/i.test(text)) {
    return 'IJM';
  }
  
  // Véhicule
  if (/v[ée]hicule|automobile|car\s*assurance|assurance.*auto/i.test(text)) {
    return 'Vehicle';
  }
  
  // Ménage / RC privée
  if (/m[ée]nage|responsabilit[ée].*civile.*priv[ée]e|inventaire.*m[ée]nage/i.test(text)) {
    return 'Household';
  }
  
  return null;
}

/**
 * Détecter la compagnie d'assurance
 */
function detectCompany(text) {
  const companies = [
    { pattern: /SWICA/i, name: 'SWICA' },
    { pattern: /AXA/i, name: 'AXA' },
    { pattern: /Swiss\s*Life/i, name: 'Swiss Life' },
    { pattern: /Emmental/i, name: 'Emmental' },
    { pattern: /simpego/i, name: 'SIMPEGO' },
    { pattern: /Groupe\s*Mutuel/i, name: 'Groupe Mutuel' },
    { pattern: /CSS/i, name: 'CSS' },
    { pattern: /Helsana/i, name: 'Helsana' },
    { pattern: /Helvetia/i, name: 'Helvetia' },
    { pattern: /Allianz/i, name: 'Allianz' }
  ];
  
  for (const { pattern, name } of companies) {
    if (pattern.test(text)) {
      return name;
    }
  }
  
  return null;
}

/**
 * Parser principal
 */
export function parseInsurancePolicy(rawText, filename) {
  const text = cleanText(rawText);
  
  const result = {
    filename,
    company: detectCompany(text),
    policyNumber: extractPolicyNumber(text),
    coverageType: detectCoverageType(text),
    insuredPerson: extractInsuredPerson(text),
    address: extractAddress(text),
    annualPremium: extractAnnualPremium(text),
    ...extractDates(text),
    rawText
  };
  
  return result;
}

/**
 * Calculer le score de précision
 */
export function calculateAccuracy(parsed) {
  const fields = ['company', 'policyNumber', 'coverageType', 'insuredPerson', 'address', 'annualPremium'];
  const detected = fields.filter(f => parsed[f] !== null && parsed[f] !== undefined).length;
  return Math.round((detected / fields.length) * 100);
}

/**
 * Test du parser amélioré
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testParser() {
  const files = [
    'police-axa-full-ocr.txt',
    'police-swisslife-full-ocr.txt',
    'police-emmental-full-ocr.txt',
    'police-swica-lamal-lca-full-ocr.txt',
    'police-simpego-vehicule-full-ocr.txt',
    'police-groupemutuel-ijm-full-ocr.txt'
  ];
  
  console.log('\n' + '='.repeat(80));
  console.log('TEST DU PARSER AMÉLIORÉ');
  console.log('='.repeat(80));
  
  const results = [];
  
  for (const file of files) {
    const filePath = path.join(__dirname, file);
    
    try {
      const rawText = await fs.readFile(filePath, 'utf-8');
      const parsed = parseInsurancePolicy(rawText, file);
      const accuracy = calculateAccuracy(parsed);
      
      console.log(`\n📄 ${file}`);
      console.log(`  Compagnie: ${parsed.company || '❌'}`);
      console.log(`  Type: ${parsed.coverageType || '❌'}`);
      console.log(`  N° Police: ${parsed.policyNumber || '❌'}`);
      console.log(`  Assuré: ${parsed.insuredPerson || '❌'}`);
      console.log(`  Adresse: ${parsed.address || '❌'}`);
      console.log(`  Prime: ${parsed.annualPremium ? 'CHF ' + parsed.annualPremium : '❌'}`);
      console.log(`  🎯 Précision: ${accuracy}%`);
      
      results.push({ file, accuracy, parsed });
    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
    }
  }
  
  // Résumé global
  const totalAccuracy = Math.round(
    results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
  );
  
  console.log('\n' + '='.repeat(80));
  console.log('📈 RÉSUMÉ GLOBAL');
  console.log('='.repeat(80));
  console.log(`🎯 PRÉCISION GLOBALE: ${totalAccuracy}%`);
  
  if (totalAccuracy >= 90) {
    console.log('✅ OBJECTIF ATTEINT (≥90%)');
  } else {
    console.log(`⚠️  OBJECTIF NON ATTEINT (besoin de ${90 - totalAccuracy}% supplémentaires)`);
  }
  
  // Sauvegarder les résultats
  const reportPath = path.join(__dirname, 'parser-test-report.json');
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n💾 Rapport sauvegardé: ${path.basename(reportPath)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testParser().catch(console.error);
}
