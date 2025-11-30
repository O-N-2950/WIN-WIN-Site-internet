import { Resend } from 'resend';

const resend = new Resend('re_FVVVMDUg_ETvGedoEuDLr7afSmFZ7QCVj');

console.log('📧 Envoi email de test...\n');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'olivier.neukomm@bluewin.ch',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
}).then((result) => {
  console.log('✅ Email envoyé avec succès !');
  console.log('Résultat:', result);
}).catch((error) => {
  console.error('❌ Erreur:', error);
});
