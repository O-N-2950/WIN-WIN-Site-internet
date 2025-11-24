import vision from '@google-cloud/vision';
import path from 'path';

/**
 * Module Google Cloud Vision OCR pour extraction de données de polices d'assurance
 * 
 * Utilise l'API Google Cloud Vision pour extraire le texte des PDF/images de polices
 * et parser les informations clés (compagnie, numéro, type, prime, etc.)
 */

// Initialiser le client Google Vision avec la clé de service
const keyFilePath = path.join(process.cwd(), 'google-cloud-vision-key.json');
const client = new vision.ImageAnnotatorClient({
  keyFilename: keyFilePath,
});

/**
 * Interface pour les données extraites d'une police d'assurance
 */
export interface ExtractedPolicyData {
  compagnie?: string;
  numeroPolice?: string;
  typeContrat?: string;
  nomAssure?: string;
  montantPrime?: number; // Montant payé selon la fréquence
  frequencePaiement?: 'Annuel' | 'Semestriel' | 'Trimestriel' | 'Mensuel';
  primeAnnuelle?: number; // Calculée automatiquement
  dateDebut?: string;
  dateFin?: string;
  confidence: number; // Score de confiance global (0-100)
  rawText?: string; // Texte brut extrait (pour debugging)
}

/**
 * Extraire le texte d'un fichier PDF ou image via Google Cloud Vision
 * 
 * @param fileUrl - URL du fichier à analyser (peut être S3, HTTP, ou chemin local)
 * @returns Texte brut extrait
 */
export async function extractTextFromDocument(fileUrl: string): Promise<string> {
  try {
    console.log('[Google Vision] Extraction du texte depuis:', fileUrl);
    
    // Télécharger le fichier si c'est une URL
    let fileBuffer: Buffer;
    if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      // Fichier local
      const fs = await import('fs/promises');
      fileBuffer = await fs.readFile(fileUrl);
    }

    // Appeler Google Cloud Vision API
    const [result] = await client.documentTextDetection({
      image: { content: fileBuffer },
    });

    const fullTextAnnotation = result.fullTextAnnotation;
    const extractedText = fullTextAnnotation?.text || '';

    console.log(`[Google Vision] Texte extrait: ${extractedText.length} caractères`);
    return extractedText;
  } catch (error) {
    console.error('[Google Vision] Erreur lors de l\'extraction:', error);
    throw new Error(`Échec de l'extraction OCR: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

/**
 * Parser les données d'une police d'assurance depuis le texte extrait
 * 
 * @param text - Texte brut extrait par OCR
 * @returns Données structurées de la police
 */
export function parsePolicyData(text: string): ExtractedPolicyData {
  const data: ExtractedPolicyData = {
    confidence: 0,
    rawText: text,
  };

  let fieldsFound = 0;
  const totalFields = 7; // Nombre de champs qu'on essaie d'extraire

  // 1. Détecter la compagnie d'assurance
  const compagnies = [
    'AXA', 'ASSURA', 'Allianz', 'Baloise', 'CSS', 'Concordia',
    'Groupe Mutuel', 'Helsana', 'KPT', 'ÖKK', 'Sanitas',
    'SWICA', 'Sympany', 'Visana', 'Zurich', 'Swiss Life',
    'Helvetia', 'Mobilière', 'Vaudoise', 'SIMPEGO', 'Emmental'
  ];
  
  for (const comp of compagnies) {
    if (text.toUpperCase().includes(comp.toUpperCase())) {
      data.compagnie = comp;
      fieldsFound++;
      break;
    }
  }

  // 2. Détecter le type de contrat
  if (text.includes('LAMal') && text.includes('LCA')) {
    data.typeContrat = 'LAMal+LCA';
    fieldsFound++;
  } else if (text.includes('LAMal')) {
    data.typeContrat = 'LAMal';
    fieldsFound++;
  } else if (text.includes('LCA')) {
    data.typeContrat = 'LCA';
    fieldsFound++;
  } else if (text.toLowerCase().includes('protection juridique')) {
    data.typeContrat = 'Protection Juridique';
    fieldsFound++;
  } else if (text.toLowerCase().includes('entreprise') || text.toLowerCase().includes('lpp')) {
    data.typeContrat = 'Entreprise';
    fieldsFound++;
  }

  // 3. Extraire le numéro de police
  const numeroPatterns = [
    /N[°o]\s*(?:de\s*)?(?:police|contrat|assurance)\s*[:\s]*([A-Z0-9\-\.\/]+)/i,
    /Police\s*[:\s]*([A-Z0-9\-\.\/]+)/i,
    /Contrat\s*[:\s]*([A-Z0-9\-\.\/]+)/i,
    /N[°o]\s*([A-Z0-9]{6,})/i,
  ];

  for (const pattern of numeroPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.numeroPolice = match[1].trim();
      fieldsFound++;
      break;
    }
  }

  // 4. Extraire le nom de l'assuré
  const nomPatterns = [
    /Assuré(?:e)?\s*[:\s]*([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)+)/,
    /Nom\s*[:\s]*([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)+)/,
    /Titulaire\s*[:\s]*([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)+)/,
    /Preneur\s*d'assurance\s*[:\s]*([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)+)/,
    /Client\s*[:\s]*([A-ZÀ-ÿ][a-zà-ÿ]+(?:\s+[A-ZÀ-ÿ][a-zà-ÿ]+)+)/,
    /Pour\s*([A-ZÀ-ÿ][a-zà-ÿ]+\s+[A-ZÀ-ÿ][a-zà-ÿ]+)/,
  ];

  for (const pattern of nomPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.nomAssure = match[1].trim();
      fieldsFound++;
      break;
    }
  }

  // 5. Extraire la prime annuelle
  const primePatterns = [
    /Prime\s*annuelle\s*[:\s]*CHF?\s*([\d']+[\.,]?\d*)/i,
    /Montant\s*annuel\s*[:\s]*CHF?\s*([\d']+[\.,]?\d*)/i,
    /Total\s*annuel\s*[:\s]*CHF?\s*([\d']+[\.,]?\d*)/i,
    /Par\s*an\s*[:\s]*CHF?\s*([\d']+[\.,]?\d*)/i,
    /CHF\s*([\d']+[\.,]?\d*)\s*\/\s*an/i,
    /(\d{1,4}[\.,]\d{2})\s*CHF\s*par\s*an/i,
    /Prime\s*[:\s]*CHF?\s*([\d']+[\.,]?\d*)/i,
    /Coût\s*[:\s]*CHF?\s*([\d']+[\.,]?\d*)/i,
  ];

  for (const pattern of primePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const primeStr = match[1].replace(/[']/g, '').replace(/,/g, '.');
      data.primeAnnuelle = parseFloat(primeStr);
      fieldsFound++;
      break;
    }
  }

  // 6. Extraire la date de début
  const dateDebutPatterns = [
    /Date\s*de\s*début\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
    /Début\s*de\s*couverture\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
    /Valable\s*dès\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
    /À\s*partir\s*du\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
  ];

  for (const pattern of dateDebutPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.dateDebut = match[1].trim();
      fieldsFound++;
      break;
    }
  }

  // 7. Extraire la date de fin
  const dateFinPatterns = [
    /Date\s*de\s*fin\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
    /Fin\s*de\s*couverture\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
    /Valable\s*jusqu'au\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
    /Échéance\s*[:\s]*(\d{1,2}[\.\/]\d{1,2}[\.\/]\d{2,4})/i,
  ];

  for (const pattern of dateFinPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data.dateFin = match[1].trim();
      fieldsFound++;
      break;
    }
  }

  // Calculer le score de confiance (% de champs trouvés)
  data.confidence = Math.round((fieldsFound / totalFields) * 100);

  console.log(`[Parser] Données extraites: ${fieldsFound}/${totalFields} champs (${data.confidence}% confiance)`);
  return data;
}

/**
 * Analyser une police d'assurance complète (extraction + parsing)
 * 
 * @param fileUrl - URL du fichier PDF/image de la police
 * @param availableCompanies - Liste des compagnies disponibles dans Airtable (optionnel)
 * @param availableTypes - Liste des types de contrats disponibles dans Airtable (optionnel)
 * @returns Données structurées extraites
 */
export async function analyzePolicyDocument(
  fileUrl: string,
  availableCompanies?: string[],
  availableTypes?: string[]
): Promise<ExtractedPolicyData> {
  console.log('[Google Vision] Analyse de la police:', fileUrl);
  
  // Étape 1: Extraire le texte via OCR
  const rawText = await extractTextFromDocument(fileUrl);
  
  // Étape 2: Parser les données avec LLM (Gemini 2.5 Flash)
  const { parsePolicyDataWithLLM } = await import('./googleVisionLLM');
  const policyData = await parsePolicyDataWithLLM(
    rawText,
    availableCompanies,
    availableTypes
  );
  
  console.log('[Google Vision] Analyse terminée:', {
    compagnie: policyData.compagnie,
    type: policyData.typeContrat,
    montant: policyData.montantPrime,
    frequence: policyData.frequencePaiement,
    primeAnnuelle: policyData.primeAnnuelle,
    confidence: `${policyData.confidence}%`,
  });
  
  return policyData;
}
