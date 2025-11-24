import { invokeLLM } from './llm';
import { ExtractedPolicyData } from './googleVision';

/**
 * Parser les données d'une police d'assurance avec Gemini 2.5 Flash
 * 
 * Utilise le LLM pour extraire intelligemment les données au lieu de regex
 * 
 * @param rawText - Texte brut extrait par OCR
 * @param availableCompanies - Liste des compagnies disponibles dans Airtable
 * @param availableTypes - Liste des types de contrats disponibles dans Airtable
 * @returns Données structurées de la police
 */
export async function parsePolicyDataWithLLM(
  rawText: string,
  availableCompanies: string[] = [],
  availableTypes: string[] = []
): Promise<ExtractedPolicyData> {
  const prompt = `Tu es un expert en analyse de polices d'assurance suisses. Extrait les informations suivantes depuis ce texte OCR d'une police d'assurance:

TEXTE OCR:
${rawText}

${availableCompanies.length > 0 ? `COMPAGNIES DISPONIBLES (match avec cette liste si possible):
${availableCompanies.join(', ')}
` : ''}

${availableTypes.length > 0 ? `TYPES DE CONTRATS DISPONIBLES (match avec cette liste si possible):
${availableTypes.join(', ')}
` : ''}

INSTRUCTIONS IMPORTANTES:

1. **Compagnie d'assurance**: Identifie le nom de la compagnie (AXA, Allianz, Groupe Mutuel, Emmental, etc.)
   - Match avec la liste ci-dessus si disponible
   - Sinon, utilise le nom trouvé dans le document

2. **Type de contrat**: Identifie le type (LAMal, LCA, RC Privée, Protection Juridique, etc.)
   - Match avec la liste ci-dessus si disponible
   - Sinon, utilise le type trouvé dans le document

3. **Numéro de police**: Trouve le numéro de contrat/police (ex: "22.913.008", "ABC-12345")

4. **Nom de l'assuré**: Trouve le nom complet de la personne assurée

5. **MONTANT DE LA PRIME** (TRÈS IMPORTANT):
   - Trouve le montant QUE LE CLIENT PAIE selon la fréquence
   - NE PAS confondre avec la prime annuelle totale
   - Exemples:
     * Si "350 CHF/mois" → montantPrime = 350
     * Si "600 CHF/semestre" → montantPrime = 600
     * Si "1200 CHF/an" → montantPrime = 1200

6. **FRÉQUENCE DE PAIEMENT** (TRÈS IMPORTANT):
   - Cherche les mots-clés:
     * "mensuel", "par mois", "/mois", "monthly", "mois" → Mensuel
     * "semestriel", "par semestre", "/semestre", "6 mois", "semestre" → Semestriel
     * "trimestriel", "par trimestre", "/trimestre", "3 mois", "trimestre" → Trimestriel
     * "annuel", "par an", "/an", "yearly", "année" → Annuel

7. **Date de début**: Format DD.MM.YYYY ou YYYY-MM-DD

8. **Date de fin/échéance**: Format DD.MM.YYYY ou YYYY-MM-DD

9. **Score de confiance**: Estime un score de 0 à 100 basé sur:
   - Clarté du texte OCR
   - Nombre de champs trouvés
   - Certitude des informations

RÈGLES:
- Si une information est introuvable, laisse le champ vide (null)
- Les montants doivent être des nombres (pas de texte)
- Les dates doivent être au format YYYY-MM-DD
- Le score de confiance doit être entre 0 et 100

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de texte avant/après).`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant spécialisé dans l\'extraction de données depuis des polices d\'assurance suisses. Tu réponds toujours avec du JSON valide sans markdown.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'insurance_policy_data',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              compagnie: { type: 'string' },
              numeroPolice: { type: 'string' },
              typeContrat: { type: 'string' },
              nomAssure: { type: 'string' },
              montantPrime: { type: 'number' },
              frequencePaiement: { 
                type: 'string',
                enum: ['Annuel', 'Semestriel', 'Trimestriel', 'Mensuel']
              },
              dateDebut: { type: 'string' },
              dateFin: { type: 'string' },
              confidence: { type: 'number' },
            },
            required: [
              'compagnie',
              'numeroPolice',
              'typeContrat',
              'nomAssure',
              'montantPrime',
              'frequencePaiement',
              'dateDebut',
              'dateFin',
              'confidence',
            ],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error('No valid response from LLM');
    }

    const data = JSON.parse(content);

    // Calculer la prime annuelle
    let primeAnnuelle: number | undefined;
    if (data.montantPrime && data.frequencePaiement) {
      switch (data.frequencePaiement) {
        case 'Mensuel':
          primeAnnuelle = data.montantPrime * 12;
          break;
        case 'Trimestriel':
          primeAnnuelle = data.montantPrime * 4;
          break;
        case 'Semestriel':
          primeAnnuelle = data.montantPrime * 2;
          break;
        case 'Annuel':
          primeAnnuelle = data.montantPrime;
          break;
      }
    }

    console.log('[LLM Parser] Données extraites:', {
      compagnie: data.compagnie,
      type: data.typeContrat,
      montant: data.montantPrime,
      frequence: data.frequencePaiement,
      primeAnnuelle,
      confidence: data.confidence,
    });

    return {
      compagnie: data.compagnie || undefined,
      numeroPolice: data.numeroPolice || undefined,
      typeContrat: data.typeContrat || undefined,
      nomAssure: data.nomAssure || undefined,
      montantPrime: data.montantPrime || undefined,
      frequencePaiement: data.frequencePaiement || undefined,
      primeAnnuelle,
      dateDebut: data.dateDebut || undefined,
      dateFin: data.dateFin || undefined,
      confidence: data.confidence || 0,
      rawText,
    };
  } catch (error: any) {
    console.error('[LLM Parser] Erreur lors du parsing:', error);
    
    // Fallback: retourner des données vides avec faible confiance
    return {
      confidence: 0,
      rawText,
    };
  }
}
