/**
 * Router tRPC pour accéder aux données de référence Airtable
 * (Compagnies d'assurance, Types de contrats)
 */

import { publicProcedure, router } from "../_core/trpc";
import { getInsuranceCompanies, getContractTypes } from "../lib/airtable-reference";

export const airtableRouter = router({
  /**
   * Récupère la liste des compagnies d'assurance depuis Airtable
   * Table: Compagnies, Colonne: Nom de la Compagnie
   */
  getCompanies: publicProcedure.query(async () => {
    const companies = await getInsuranceCompanies();
    return {
      success: true,
      companies,
      count: companies.length
    };
  }),

  /**
   * Récupère la liste des types de contrats depuis Airtable
   * Table: Contrats, Colonne: types de contrats
   */
  getContractTypes: publicProcedure.query(async () => {
    const contractTypes = await getContractTypes();
    return {
      success: true,
      contractTypes,
      count: contractTypes.length
    };
  })
});
