import vision from '@google-cloud/vision';
import { fromPath } from 'pdf2pic';
import fs from 'fs';
import path from 'path';

// Initialiser le client Google Cloud Vision
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/home/ubuntu/winwin-website/google-cloud-vision-key.json'
});

// Liste des polices à tester
const polices = [
  { file: 'police-axa.pdf', compagnie: 'AXA', type: 'Ménage + RC' },
  { file: 'police-swisslife.pdf', compagnie: 'Swiss Life', type: 'Vie 3a' },
  { file: 'police-emmental.pdf', compagnie: 'Emmental', type: 'Véhicule' },
  { file: 'police-swica-lamal-lca.pdf', compagnie: 'SWICA', type: 'LAMal + LCA' },
  { file: 'police-simpego-vehicule.pdf', compagnie: 'SIMPEGO', type: 'Véhicule' },
  { file: 'police-groupemutuel-ijm.pdf', compagnie: 'Groupe Mutuel', type: 'IJM' }
];

// Parser amélioré
function parseInsurancePolicy(text, compagnie) {
  const data = {
    compagnie: compagnie,
    numeroPolice: null,
    client: null,
    adresse: null,
    primeAnnuelle: null,
    dateDebut: null,
    dateFin: null,
    typeCouverture: null, // Pour caisses maladie: LAMal, LCA, ou LAMal+LCA
    franchise: null // Pour LAMal
  };

  // Détecter le numéro de police (patterns variés)
  const policyPatterns = [
    /(?:Police|Contrat|N°|No\.?|Numéro)\s*:?\s*n?°?\s*([0-9]{2,3}[\.\s]?[0-9]{3}[\.\s]?[0-9]{3})/i,
    /(?:Police|Contrat|N°|No\.?)\s*:?\s*([0-9]{7,10})/i,
    /n°\s*([0-9]{2,3}[\.\s]?[0-9]{3}[\.\s]?[0-9]{3})/i
  ];
  
  for (const pattern of policyPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.numeroPolice = match[1].replace(/\s/g, '');
      break;
    }
  }

  // Détecter le client (après "Preneur d'assurance", "Assuré", "Client")
  const clientPatterns = [
    /(?:Preneur d'assurance|Assuré|Client|Titulaire)\s*:?\s*\n\s*([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+(?:\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)+)/i,
    /(?:Nom|Name)\s*:?\s*([A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+(?:\s+[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)+)/i
  ];
  
  for (const pattern of clientPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.client = match[1].trim();
      break;
    }
  }

  // Détecter la prime annuelle
  const primePatterns = [
    /Prime\s+annuelle\s+totale[²³]?\s*:?\s*CHF\s+([0-9]{1,3}(?:'[0-9]{3})*(?:\.[0-9]{2})?)/i,
    /Prime\s+annuelle\s*:?\s*CHF\s+([0-9]{1,3}(?:'[0-9]{3})*(?:\.[0-9]{2})?)/i,
    /Montant\s+annuel\s*:?\s*CHF\s+([0-9]{1,3}(?:'[0-9]{3})*(?:\.[0-9]{2})?)/i,
    /Total\s+annuel\s*:?\s*CHF\s+([0-9]{1,3}(?:'[0-9]{3})*(?:\.[0-9]{2})?)/i
  ];
  
  for (const pattern of primePatterns) {
    const match = text.match(pattern);
    if (match) {
      data.primeAnnuelle = 'CHF ' + match[1];
      break;
    }
  }

  // Détecter les dates (format DD.MM.YYYY)
  const dateMatches = text.match(/(\d{2}\.\d{2}\.\d{4})/g);
  if (dateMatches && dateMatches.length >= 2) {
    data.dateDebut = dateMatches[0];
    data.dateFin = dateMatches[1];
  }

  // Détecter le type de couverture pour caisses maladie
  const hasLAMal = /LAMal|Assurance\s+obligatoire|Assurance\s+de\s+base/i.test(text);
  const hasLCA = /LCA|Complémentaire|Hospitalisation|HOSPITA/i.test(text);
  
  if (hasLAMal && hasLCA) {
    data.typeCouverture = 'LAMal + LCA';
  } else if (hasLAMal) {
    data.typeCouverture = 'LAMal seule';
  } else if (hasLCA) {
    data.typeCouverture = 'LCA seule';
  }

  // Détecter la franchise (pour LAMal)
  const franchiseMatch = text.match(/Franchise\s*:?\s*CHF\s+([0-9]{1,4})/i);
  if (franchiseMatch) {
    data.franchise = 'CHF ' + franchiseMatch[1];
  }

  return data;
}

// Fonction principale de test
async function testOCR() {
  console.log('='.repeat(80));
  console.log('TEST OCR GOOGLE CLOUD VISION - 6 POLICES');
  console.log('='.repeat(80));
  console.log('');

  const results = [];

  for (const police of polices) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`POLICE: ${police.compagnie} (${police.type})`);
    console.log(`Fichier: ${police.file}`);
    console.log('='.repeat(80));

    try {
      // Convertir PDF en image (première page)
      const options = {
        density: 300,
        saveFilename: path.basename(police.file, '.pdf'),
        savePath: './',
        format: 'png',
        width: 2480,
        height: 3508
      };

      const convert = fromPath(police.file, options);
      const pageToConvertAsImage = 1;
      const result = await convert(pageToConvertAsImage, { responseType: 'image' });

      const imagePath = result.path;
      console.log(`✅ PDF converti en image: ${imagePath}`);

      // Analyser avec Google Cloud Vision
      const [visionResult] = await client.textDetection(imagePath);
      const detections = visionResult.textAnnotations;

      if (!detections || detections.length === 0) {
        console.log('❌ Aucun texte détecté');
        continue;
      }

      const fullText = detections[0].description;
      console.log(`✅ Texte extrait: ${fullText.length} caractères`);

      // Sauvegarder le texte extrait
      const txtFile = police.file.replace('.pdf', '-ocr-v3.txt');
      fs.writeFileSync(txtFile, fullText, 'utf8');
      console.log(`✅ Texte sauvegardé: ${txtFile}`);

      // Parser les données
      const parsedData = parseInsurancePolicy(fullText, police.compagnie);
      
      console.log('\n📊 DONNÉES EXTRAITES:');
      console.log(`  Compagnie: ${parsedData.compagnie}`);
      console.log(`  Numéro police: ${parsedData.numeroPolice || '❌ NON DÉTECTÉ'}`);
      console.log(`  Client: ${parsedData.client || '❌ NON DÉTECTÉ'}`);
      console.log(`  Prime annuelle: ${parsedData.primeAnnuelle || '❌ NON DÉTECTÉE'}`);
      console.log(`  Date début: ${parsedData.dateDebut || '❌ NON DÉTECTÉE'}`);
      console.log(`  Date fin: ${parsedData.dateFin || '❌ NON DÉTECTÉE'}`);
      
      if (parsedData.typeCouverture) {
        console.log(`  Type couverture: ${parsedData.typeCouverture}`);
      }
      if (parsedData.franchise) {
        console.log(`  Franchise: ${parsedData.franchise}`);
      }

      results.push({
        compagnie: police.compagnie,
        type: police.type,
        ...parsedData,
        success: !!(parsedData.numeroPolice && parsedData.client && parsedData.primeAnnuelle)
      });

    } catch (error) {
      console.error(`❌ Erreur: ${error.message}`);
      results.push({
        compagnie: police.compagnie,
        type: police.type,
        error: error.message,
        success: false
      });
    }
  }

  // Résumé final
  console.log('\n\n' + '='.repeat(80));
  console.log('RÉSUMÉ FINAL');
  console.log('='.repeat(80));
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  const successRate = (successCount / totalCount * 100).toFixed(1);

  console.log(`\n✅ Polices analysées avec succès: ${successCount}/${totalCount} (${successRate}%)`);
  
  console.log('\n📊 DÉTAILS PAR COMPAGNIE:');
  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    console.log(`  ${status} ${r.compagnie} (${r.type})`);
    if (!r.success && r.error) {
      console.log(`     Erreur: ${r.error}`);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log(`PRÉCISION GLOBALE: ${successRate}%`);
  console.log('='.repeat(80));
}

// Exécuter le test
testOCR().catch(console.error);
