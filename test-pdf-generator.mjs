/**
 * Script de test pour le générateur PDF mandat
 */

import { generateAndSaveMandatPDF } from './server/pdf-generator.ts';

async function testPDFGenerator() {
  console.log('🧪 Test du Générateur PDF Mandat\n');
  
  const testData = {
    mandatNumber: 'WW-2025-TEST1',
    clientName: 'Jean Dupont',
    clientEmail: 'jean.dupont@example.com',
    clientAddress: 'Rue de la Gare 15, 2900 Porrentruy',
    clientType: 'particulier',
    annualPrice: 185,
    isFree: false,
    signatureDate: new Date().toISOString(),
  };
  
  try {
    console.log('📝 Génération du PDF avec les données suivantes:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('');
    
    const outputPath = '/home/ubuntu/winwin-website/test-mandat.pdf';
    
    await generateAndSaveMandatPDF(testData, outputPath);
    
    console.log('✅ PDF généré avec succès !');
    console.log(`📄 Fichier sauvegardé : ${outputPath}`);
    
    // Vérifier la taille du fichier
    const fs = await import('fs');
    const stats = fs.statSync(outputPath);
    console.log(`📊 Taille du fichier : ${(stats.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération du PDF:', error);
    process.exit(1);
  }
}

testPDFGenerator();
