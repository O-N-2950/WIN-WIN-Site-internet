/**
 * Parser OCR Amélioré pour WIN WIN Finance Group
 * Objectif: Atteindre 90%+ de précision d'extraction
 * 
 * Améliorations:
 * - Nouveaux patterns pour extraction nom assuré
 * - Nouveaux patterns pour extraction prime annuelle
 * - Meilleure gestion des formats de montants
 */

import fs from 'fs';
import path from 'path';

/**
 * Extraire la compagnie d'assurance
 */
function extractCompany(text) {
  const companies = [
    { pattern: /\bAXA\b/i, name: 'AXA' },
    { pattern: /Swiss\s*Life/i, name: 'Swiss Life' },
    { pattern: /\bEmmental\b/i, name: 'Emmental' },
    { pattern: /\bSWICA\b/i, name: 'SWICA' },
    { pattern: /\bSIMPEGO\b/i, name: 'SIMPEGO' },
    { pattern: /Groupe\s*Mutuel/i, name: 'Groupe Mutuel' },
  ];
  
  for (const company of companies) {
    if (company.pattern.test(text)) {
      return company.name;
    }
  }
  
  return null;
}

/**
 * Extraire le numéro de police
 */
function extractPolicyNumber(text) {
  const patterns = [
    /N[°o]\s*(?:de\s+)?(?:police|contrat|client)[:\s]+([A-Z0-9.]+)/i,
    /Police\s+n[°o][:\s]+([A-Z0-9.]+)/i,
    /Contrat\s+n[°o][:\s]+([A-Z0-9.]+)/i,
    /N[°o]\s+client[:\s]+([A-Z0-9.]+)/i,
    /N[°o]\s+ASSURANCE[:\s]+([A-Z0-9.]+)/i,
    /N[°o]\s+DE\s+CONTRAT[:\s]+([A-Z0-9.]+)/i,
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
 * Extraire le nom de l'assuré (AMÉLIORÉ)
 */
function extractInsuredName(text) {
  const patterns = [
    // NOUVEAU: Preneur d'assurance suivi directement du nom (ligne suivante)
    /Preneur\s+d'assurance\s*\n\s*(?:Monsieur|Madame|M\.|Mme)?\s*([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
    
    // Pattern original
    /(?:Preneur\s+d'assurance|Assuré(?:e)?)\s+(?:Monsieur|Madame|M\.|Mme)\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
    
    // NOUVEAU: Personne assurée
    /Personne\s+assur[ée]e[:\s]+(?:Monsieur|Madame|M\.|Mme)?\s*([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
    
    // NOUVEAU: Assuré principal
    /Assuré\s+principal[:\s]+(?:Monsieur|Madame|M\.|Mme)?\s*([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
    
    // NOUVEAU: Titulaire
    /Titulaire[:\s]+(?:Monsieur|Madame|M\.|Mme)?\s*([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
    
    // Nom après civilité seule (doit être en dernier pour éviter faux positifs)
    /(?:Monsieur|Madame)\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const name = match[1].trim();
      // Filtrer les faux positifs (mots trop courts, mots communs)
      if (name.length > 3 && !/(Assurance|Police|Contrat|Client)/i.test(name)) {
        return name;
      }
    }
  }
  
  return null;
}

/**
 * Extraire l'adresse (code postal + ville)
 */
function extractAddress(text) {
  const pattern = /(\d{4})\s+([A-ZÀ-Ü][a-zàéèêëïôûüç]+(?:\s+[A-ZÀ-Ü][a-zàéèêëïôûüç]+)*)/;
  const match = text.match(pattern);
  
  if (match) {
    return {
      postalCode: match[1],
      city: match[2].trim(),
    };
  }
  
  return null;
}

/**
 * Extraire la prime annuelle (AMÉLIORÉ)
 */
function extractAnnualPremium(text) {
  const patterns = [
    // Pattern original (prime annuelle)
    /Prime\s+annuelle[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Versement annuel (prévoyance)
    /Versement\s+annuel[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Prime semestrielle (x2)
    /Prime\s+semestrielle[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Prime mensuelle (x12)
    /Prime\s+mensuelle[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Montant annuel
    /Montant\s+annuel[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Total annuel
    /Total\s+annuel[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Prime totale
    /Prime\s+totale[:\s]+CHF\s+([\d']+\.?\d*)/i,
    
    // NOUVEAU: Cotisation annuelle
    /Cotisation\s+annuelle[:\s]+CHF\s+([\d']+\.?\d*)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let amount = parseFloat(match[1].replace(/'/g, ''));
      
      // Si c'est une prime semestrielle, multiplier par 2
      if (/semestrielle/i.test(pattern.source)) {
        amount *= 2;
      }
      
      // Si c'est une prime mensuelle, multiplier par 12
      if (/mensuelle/i.test(pattern.source)) {
        amount *= 12;
      }
      
      return amount;
    }
  }
  
  return null;
}

/**
 * Détecter le type de couverture
 */
function detectCoverageType(text) {
  const types = [
    { pattern: /LAMal.*LCA/i, type: 'LAMal+LCA' },
    { pattern: /\bLAMal\b/i, type: 'LAMal' },
    { pattern: /\bLCA\b/i, type: 'LCA' },
    { pattern: /(?:Assurance\s+)?(?:ménage|household)/i, type: 'Household' },
    { pattern: /(?:Assurance\s+)?(?:véhicule|vehicle|automobile)/i, type: 'Vehicle' },
    { pattern: /(?:Indemnités?\s+)?journalières?|IJM/i, type: 'IJM' },
    { pattern: /Prévoyance\s+3a/i, type: 'Prévoyance 3a' },
    { pattern: /RC\s+(?:privée|entreprise)/i, type: 'RC' },
  ];
  
  for (const type of types) {
    if (type.pattern.test(text)) {
      return type.type;
    }
  }
  
  return 'Unknown';
}

/**
 * Parser une police d'assurance
 */
function parsePolicy(text) {
  return {
    company: extractCompany(text),
    policyNumber: extractPolicyNumber(text),
    insuredName: extractInsuredName(text),
    address: extractAddress(text),
    coverageType: detectCoverageType(text),
    annualPremium: extractAnnualPremium(text),
  };
}

/**
 * Tester le parser amélioré sur toutes les polices
 */
async function testEnhancedParser() {
  const testDir = '/home/ubuntu/winwin-website/test-ocr';
  const policies = [
    'police-axa-full-ocr.txt',
    'police-swisslife-full-ocr.txt',
    'police-emmental-full-ocr.txt',
    'police-swica-lamal-lca-full-ocr.txt',
    'police-simpego-vehicule-full-ocr.txt',
    'police-groupemutuel-ijm-full-ocr.txt',
  ];
  
  console.log('🧪 Test du Parser OCR Amélioré\n');
  console.log('='.repeat(80));
  
  let totalFields = 0;
  let extractedFields = 0;
  
  const results = [];
  
  for (const policyFile of policies) {
    const filePath = path.join(testDir, policyFile);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé: ${policyFile}`);
      continue;
    }
    
    const text = fs.readFileSync(filePath, 'utf-8');
    const parsed = parsePolicy(text);
    
    // Compter les champs extraits
    const fields = [
      parsed.company,
      parsed.policyNumber,
      parsed.insuredName,
      parsed.address,
      parsed.coverageType !== 'Unknown',
      parsed.annualPremium,
    ];
    
    const extracted = fields.filter(f => f !== null && f !== false).length;
    totalFields += 6;
    extractedFields += extracted;
    
    const precision = Math.round((extracted / 6) * 100);
    
    console.log(`\n📄 ${policyFile.replace('-full-ocr.txt', '')}`);
    console.log(`   Compagnie: ${parsed.company || '❌'}`);
    console.log(`   N° Police: ${parsed.policyNumber || '❌'}`);
    console.log(`   Nom Assuré: ${parsed.insuredName || '❌'}`);
    console.log(`   Adresse: ${parsed.address ? `${parsed.address.postalCode} ${parsed.address.city}` : '❌'}`);
    console.log(`   Type: ${parsed.coverageType}`);
    console.log(`   Prime Annuelle: ${parsed.annualPremium ? `CHF ${parsed.annualPremium}.-` : '❌'}`);
    console.log(`   Précision: ${precision}% (${extracted}/6)`);
    
    results.push({
      policy: policyFile.replace('-full-ocr.txt', ''),
      ...parsed,
      precision,
      extracted,
    });
  }
  
  const globalPrecision = Math.round((extractedFields / totalFields) * 100);
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 RÉSULTATS GLOBAUX`);
  console.log(`   Champs extraits: ${extractedFields}/${totalFields}`);
  console.log(`   Précision globale: ${globalPrecision}%`);
  console.log(`   Objectif: 90%`);
  console.log(`   Statut: ${globalPrecision >= 90 ? '✅ OBJECTIF ATTEINT' : '⚠️  OBJECTIF NON ATTEINT'}`);
  
  // Sauvegarder les résultats
  fs.writeFileSync(
    path.join(testDir, 'enhanced-parser-results.json'),
    JSON.stringify(results, null, 2)
  );
  
  console.log(`\n💾 Résultats sauvegardés dans enhanced-parser-results.json`);
}

testEnhancedParser().catch(console.error);
