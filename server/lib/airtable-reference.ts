/**
 * Module pour récupérer les données de référence depuis Airtable
 * (Compagnies d'assurance, Types de contrats)
 * 
 * Utilise le MCP Airtable pour accéder aux données
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const BASE_ID = 'appZQkRJ7PwOtdQ3O';
const TABLE_COMPAGNIES = 'tblwnkQFK63KKjFEY';
const TABLE_CONTRATS = 'tblDOIQM3zt7QkZd4';

/**
 * Récupère la liste des compagnies d'assurance depuis Airtable
 * Table: Compagnies
 * Colonne: Nom de la Compagnie
 */
export async function getInsuranceCompanies(): Promise<string[]> {
  try {
    // Appel MCP pour lister les enregistrements de la table Compagnies
    const command = `manus-mcp-cli tool call list_records --server airtable --input '{"baseId":"${BASE_ID}","tableId":"${TABLE_COMPAGNIES}","maxRecords":1000}'`;
    
    const { stdout } = await execAsync(command);
    // Extraire le JSON de la sortie (ignorer les lignes "Tool execution result...")
    const jsonMatch = stdout.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse MCP');
    }
    const records = JSON.parse(jsonMatch[0]);
    
    // Extraire les noms de compagnies (champ "Nom de la Compagnie")
    const companies = records
      .map((record: any) => record.fields?.['Nom de la Compagnie'])
      .filter((name: string) => name && name.trim().length > 0)
      .sort((a: string, b: string) => a.localeCompare(b, 'fr'));
    
    return companies;
  } catch (error) {
    console.error('[Airtable Reference] Erreur lors de la récupération des compagnies:', error);
    // Retourner une liste par défaut en cas d'erreur
    return getFallbackCompanies();
  }
}

/**
 * Récupère la liste des types de contrats depuis Airtable
 * Table: Contrats
 * Colonne: types de contrats (sélection multiple)
 */
export async function getContractTypes(): Promise<string[]> {
  try {
    // Appel MCP pour obtenir les métadonnées de la table Contrats
    const command = `manus-mcp-cli tool call list_tables --server airtable --input '{"baseId":"${BASE_ID}","detailLevel":"full"}'`;
    
    const { stdout } = await execAsync(command);
    // Extraire le JSON de la sortie (ignorer les lignes "Tool execution result...")
    const jsonMatch = stdout.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error('Impossible de parser la réponse MCP');
    }
    const tables = JSON.parse(jsonMatch[0]);
    
    // Trouver la table Contrats
    const contratsTable = tables.find((table: any) => table.name === 'Contrats');
    
    if (!contratsTable) {
      throw new Error('Table Contrats non trouvée');
    }
    
    // Trouver le champ "types de contrats"
    const typesField = contratsTable.fields.find((field: any) => 
      field.name === 'types de contrats'
    );
    
    if (!typesField || !typesField.options?.choices) {
      throw new Error('Champ "types de contrats" non trouvé ou sans options');
    }
    
    // Extraire les noms des options
    const contractTypes = typesField.options.choices
      .map((choice: any) => choice.name)
      .filter((name: string) => name && name.trim().length > 0)
      .sort((a: string, b: string) => a.localeCompare(b, 'fr'));
    
    return contractTypes;
  } catch (error) {
    console.error('[Airtable Reference] Erreur lors de la récupération des types de contrats:', error);
    // Retourner une liste par défaut en cas d'erreur
    return getFallbackContractTypes();
  }
}

/**
 * Liste de compagnies par défaut (fallback en cas d'erreur)
 */
function getFallbackCompanies(): string[] {
  return [
    'AXA Assurances',
    'Allianz Suisse',
    'Baloise assurance',
    'CSS Assurance',
    'Groupe Mutuel',
    'Helsana',
    'La Mobilière',
    'Sanitas',
    'SWICA',
    'Swiss Life',
    'Visana',
    'Zurich Assurances'
  ].sort((a, b) => a.localeCompare(b, 'fr'));
}

/**
 * Liste de types de contrats par défaut (fallback en cas d'erreur)
 */
function getFallbackContractTypes(): string[] {
  return [
    'Appareils auditifs',
    'ART et collections',
    'Assurance VIE 3a (déductible)',
    'Assurance VIE 3b (libre)',
    'AVS',
    'Bateau',
    'Cautions et garanties',
    'LAMal (assurance maladie de base)',
    'LCA (assurance complémentaire)',
    'Protection juridique',
    'RC (responsabilité civile)',
    'Véhicule'
  ].sort((a, b) => a.localeCompare(b, 'fr'));
}
