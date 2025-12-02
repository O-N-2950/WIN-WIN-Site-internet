import { createClientInAirtable, uploadSignatureToAirtable, uploadPdfToAirtable } from './server/airtable';
import { generateMandatPDF, type MandatData } from './server/pdf-generator';
import { generateFamilyCode } from './server/lib/parrainage';

// Signatures de test en base64 (petits carrés de couleurs différentes)
const signatureJean = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9Qz0AEYBxVSF+FAAhKDveksOjmAAAAAElFTkSuQmCC'; // Bleu
const signatureMarie = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mP8z8BQz0AEYBxVSF+FABJADveWkH6oAAAAAElFTkSuQmCC'; // Rouge
const signatureEntreprise = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNkYPhfz0AEYBxVSF+FAP5FDvcJxL1fAAAAAElFTkSuQmCC'; // Vert

async function testFamille3Mandats() {
  console.log('🧪 Test création famille avec 3 mandats (Jean + Marie + Entreprise)\n');
  
  // Générer le code famille unique
  const codeFamille = generateFamilyCode('Exemple');
  console.log('👨‍👩‍👧 Code famille généré:', codeFamille);
  
  try {
    // Générer UN SEUL code de parrainage pour toute la famille
    const codeFamille = `EXEM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    console.log(`\n👨‍👩‍👧 Code famille généré: ${codeFamille}`);
    
    // ========================================
    // 1. JEAN EXEMPLE (PRIVÉ)
    // ========================================
    console.log('\n📤 1/3 - Création de Jean Exemple (Privé)...');
    
    const clientJean = {
      nom: 'Exemple',
      prenom: 'Jean',
      email: 'olivier.neukomm@bluewin.ch',
      typeClient: 'Privé' as const,
      dateNaissance: '1980-05-15',
      adresse: 'Rue de la Paix 123',
      npa: '2900',
      localite: 'Porrentruy',
      telMobile: '+41 79 123 45 67',
      tarifApplicable: 185,
      mandatOffert: false,
      dateSignatureMandat: '2025-01-29',
      relationsFamiliales: 'Membre fondateur',
      groupeFamilial: codeFamille,
    };
    
    const recordJean = await createClientInAirtable(clientJean);
    console.log('✅ Jean créé:', recordJean.id);
    
    // Upload signature Jean
    await uploadSignatureToAirtable(recordJean.id, signatureJean);
    console.log('✅ Signature Jean uploadée');
    
    // Générer et uploader PDF mandat Jean
    const mandatJean: MandatData = {
      typeClient: 'prive',
      prenom: clientJean.prenom,
      nom: clientJean.nom,
      email: clientJean.email,
      telMobile: clientJean.telMobile,
      adresse: clientJean.adresse,
      npa: clientJean.npa,
      localite: clientJean.localite,
      dateNaissance: clientJean.dateNaissance,
      signatureDataUrl: signatureJean,
      dateSignature: '2025-01-29',
    };
    
    const pdfJean = await generateMandatPDF(mandatJean);
    await uploadPdfToAirtable(recordJean.id, pdfJean, `mandat-jean-exemple-${Date.now()}.pdf`);
    console.log('✅ PDF mandat Jean uploadé');
    
    // ========================================
    // 2. MARIE EXEMPLE (Privé - Épouse)
    // ========================================
    console.log('\n📤 2/3 - Création de Marie Exemple (Épouse)...');
    
    const clientMarie = {
      nom: 'Exemple',
      prenom: 'Marie',
      email: 'olivier.neukomm@bluewin.ch',
      typeClient: 'Privé' as const,
      dateNaissance: '1982-08-20',
      adresse: 'Rue de la Paix 123',
      npa: '2900',
      localite: 'Porrentruy',
      telMobile: '+41 79 987 65 43',
      tarifApplicable: 185,
      mandatOffert: false,
      dateSignatureMandat: '2025-01-29',
      relationsFamiliales: 'épouse',
      groupeFamilial: codeFamille,
    };
    
    const recordMarie = await createClientInAirtable(clientMarie);
    console.log('✅ Marie créée:', recordMarie.id);
    
    // Upload signature Marie
    await uploadSignatureToAirtable(recordMarie.id, signatureMarie);
    console.log('✅ Signature Marie uploadée');
    
    // Générer et uploader PDF mandat Marie
    const mandatMarie: MandatData = {
      typeClient: 'prive',
      prenom: clientMarie.prenom,
      nom: clientMarie.nom,
      email: clientMarie.email,
      telMobile: clientMarie.telMobile,
      adresse: clientMarie.adresse,
      npa: clientMarie.npa,
      localite: clientMarie.localite,
      dateNaissance: clientMarie.dateNaissance,
      signatureDataUrl: signatureMarie,
      dateSignature: '2025-01-29',
    };
    
    const pdfMarie = await generateMandatPDF(mandatMarie);
    await uploadPdfToAirtable(recordMarie.id, pdfMarie, `mandat-marie-exemple-${Date.now()}.pdf`);
    console.log('✅ PDF mandat Marie uploadé');
    
    // ========================================
    // 3. MA PETITE ENTREPRISE SÀRL
    // ========================================
    console.log('\n📤 3/3 - Création de Ma petite Entreprise Sàrl...');
    
    const clientEntreprise = {
      nom: 'Ma petite Entreprise Sàrl',
      prenom: '', // Vide pour une entreprise
      email: 'info@winwin.swiss',
      typeClient: 'Entreprise' as const,
      adresse: 'Rue de la Paix 123',
      npa: '2900',
      localite: 'Porrentruy',
      telMobile: '+41 79 123 45 67',
      nbEmployes: 5,
      tarifApplicable: 185,
      mandatOffert: false,
      dateSignatureMandat: '2025-01-29',
      relationsFamiliales: 'Entreprise de ',
      groupeFamilial: codeFamille,
    };
    
    const recordEntreprise = await createClientInAirtable(clientEntreprise);
    console.log('✅ Entreprise créée:', recordEntreprise.id);
    
    // Upload signature Entreprise
    await uploadSignatureToAirtable(recordEntreprise.id, signatureEntreprise);
    console.log('✅ Signature Entreprise uploadée');
    
    // Générer et uploader PDF mandat Entreprise
    const mandatEntreprise: MandatData = {
      typeClient: 'entreprise',
      nomEntreprise: clientEntreprise.nomEntreprise,
      email: clientEntreprise.email,
      telMobile: clientEntreprise.telMobile,
      adresse: clientEntreprise.adresse,
      npa: clientEntreprise.npa,
      localite: clientEntreprise.localite,
      nombreEmployes: clientEntreprise.nbEmployes?.toString(),
      signatureDataUrl: signatureEntreprise,
      dateSignature: '2025-01-29',
    };
    
    const pdfEntreprise = await generateMandatPDF(mandatEntreprise);
    await uploadPdfToAirtable(recordEntreprise.id, pdfEntreprise, `mandat-entreprise-exemple-${Date.now()}.pdf`);
    console.log('✅ PDF mandat Entreprise uploadé');
    
    // ========================================
    // RÉSUMÉ
    // ========================================
    console.log('\n\n🎉 ========================================');
    console.log('✅ FAMILLE CRÉÉE AVEC SUCCÈS !');
    console.log('========================================\n');
    
    console.log('👨 Jean Exemple (Privé):');
    console.log(`   - Record ID: ${recordJean.id}`);
    console.log(`   - Email: olivier.neukomm@bluewin.ch`);
    console.log(`   - Lien: https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${recordJean.id}`);
    
    console.log('\n👩 Marie Exemple (Épouse):');
    console.log(`   - Record ID: ${recordMarie.id}`);
    console.log(`   - Email: olivier.neukomm@bluewin.ch`);
    console.log(`   - Lien: https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${recordMarie.id}`);
    
    console.log('\n🏢 Ma petite Entreprise Sàrl:');
    console.log(`   - Record ID: ${recordEntreprise.id}`);
    console.log(`   - Email: info@winwin.swiss`);
    console.log(`   - Lien: https://airtable.com/appZQkRJ7PwOtdQ3O/tblWPcIpGmBZ3ASGI/${recordEntreprise.id}`);
    
    console.log('\n📊 Groupe familial:', codeFamille);
    console.log('💰 Rabais familial attendu: 6% (3 mandats)');
    console.log('\n✅ Vérifiez vos emails:');
    console.log('   - olivier.neukomm@bluewin.ch (Jean + Marie)');
    console.log('   - info@winwin.swiss (Entreprise)');
    
  } catch (error: any) {
    console.error('\n❌ Erreur lors du test:');
    console.error('Message:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
}

testFamille3Mandats();
