import { sendWelcomeEmail } from './server/lib/email-service.ts';

console.log('📧 Test email pour ENTREPRISE avec CHF 260.-...\n');

const clientDataEntreprise = {
  prenom: 'Ma petite',
  nom: 'Entreprise',
  email: 'olivier.neukomm@bluewin.ch',
  codeParrainage: 'OLIV-SELS',
  pdfMandatUrl: 'https://example.com/mandat-entreprise.pdf',
  montantPaye: 260
};

try {
  const result = await sendWelcomeEmail(clientDataEntreprise);
  
  console.log('✅ Email envoyé avec succès !');
  console.log('📧 ID:', result.id);
  console.log('📬 Expéditeur: contact@winwin.swiss');
  console.log('📬 Destinataire:', clientDataEntreprise.email);
  console.log('🏢 Nom entreprise:', clientDataEntreprise.prenom, clientDataEntreprise.nom);
  console.log('💰 Montant payé: CHF', clientDataEntreprise.montantPaye);
  console.log('🎫 Code de parrainage:', clientDataEntreprise.codeParrainage);
  console.log('\n📊 TABLEAU DES RABAIS CALCULÉ DYNAMIQUEMENT :');
  console.log('2 membres (4%) : CHF', (clientDataEntreprise.montantPaye * 0.96).toFixed(2));
  console.log('3 membres (6%) : CHF', (clientDataEntreprise.montantPaye * 0.94).toFixed(2));
  console.log('4 membres (8%) : CHF', (clientDataEntreprise.montantPaye * 0.92).toFixed(2));
  console.log('5 membres (10%) : CHF', (clientDataEntreprise.montantPaye * 0.90).toFixed(2));
  console.log('10+ membres (20%) : CHF', (clientDataEntreprise.montantPaye * 0.80).toFixed(2));
  console.log('\n🎉 EMAIL ENTREPRISE AVEC TABLEAU DYNAMIQUE !');
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}
