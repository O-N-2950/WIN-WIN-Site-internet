/**
 * Test d'intégration complet - Workflow réel avec Airtable
 * Crée un vrai client test avec code OLIV-SELS
 * 
 * ⚠️  CE TEST CRÉE DE VRAIES DONNÉES DANS AIRTABLE
 * Exécuter manuellement uniquement : pnpm test integration-workflow-reel.test.ts
 */

import { describe, it, expect } from 'vitest';
import { validateReferralCode, generateFamilyCode, calculateFamilyDiscount, applyFamilyDiscount, getFamilyMembers } from '../../lib/parrainage';
import { createClientInAirtable, getClientById } from '../../airtable';

describe('TEST D\'INTÉGRATION COMPLET - WORKFLOW RÉEL', () => {
  const CODE_PARRAINAGE = 'OLIV-SELS';
  const TIMESTAMP = Date.now();
  
  const clientTest = {
    prenom: 'Marie',
    nom: 'Dubois',
    email: `marie.dubois.test.${TIMESTAMP}@example.com`,
    typeClient: 'Particulier' as const,
    dateNaissance: '1990-05-15',
    telMobile: '+41 79 555 1234',
    adresse: 'Rue du Test 42',
    npa: 2900,
    localite: 'Porrentruy',
    canton: 'Jura',
    formuleAppel: 'Madame' as const,
    situationFamiliale: 'Célibataire' as const,
    statutProfessionnel: 'Employé(e)' as const,
    fumeur: 'non' as const,
    language: 'Français' as const,
  };

  it('devrait exécuter le workflow complet de bout en bout', async () => {
    console.log('');
    console.log('='.repeat(80));
    console.log('TEST WORKFLOW COMPLET - CONDITIONS RÉELLES');
    console.log('='.repeat(80));
    console.log('');
    console.log('📋 Client test:');
    console.log(`   Nom: ${clientTest.prenom} ${clientTest.nom}`);
    console.log(`   Email: ${clientTest.email}`);
    console.log(`   Code parrainage: ${CODE_PARRAINAGE}`);
    console.log('');

    // ÉTAPE 1: Valider le code de parrainage
    console.log('─'.repeat(80));
    console.log('🔍 ÉTAPE 1: Validation du code de parrainage');
    console.log('─'.repeat(80));

    const referrer = await validateReferralCode(CODE_PARRAINAGE);
    
    expect(referrer).toBeTruthy();
    expect(referrer?.nom).toBe('Neukomm');
    
    console.log('✅ Code de parrainage VALIDE');
    console.log(`   Parrain: ${referrer!.prenom} ${referrer!.nom}`);
    console.log(`   Email: ${referrer!.email}`);
    console.log(`   ID: ${referrer!.id}`);
    console.log('');

    // ÉTAPE 2: Déterminer le groupe familial
    console.log('─'.repeat(80));
    console.log('📝 ÉTAPE 2: Détermination du groupe familial');
    console.log('─'.repeat(80));

    const referrerData = await getClientById(referrer!.id);
    let groupeFamilial: string;

    if (referrerData && referrerData['Groupe Familial']) {
      groupeFamilial = referrerData['Groupe Familial'] as string;
      console.log('📊 Scénario 1: Rejoindre groupe existant');
      console.log(`   Groupe: ${groupeFamilial}`);
    } else {
      groupeFamilial = `FAMILLE-${generateFamilyCode(referrer!.nom)}`;
      console.log('📊 Scénario 2: Créer nouveau groupe');
      console.log(`   Nouveau groupe: ${groupeFamilial}`);
    }

    expect(groupeFamilial).toBeTruthy();
    console.log('');

    // ÉTAPE 3: Créer le client dans Airtable
    console.log('─'.repeat(80));
    console.log('📝 ÉTAPE 3: Création du client dans Airtable');
    console.log('─'.repeat(80));

    const record = await createClientInAirtable({
      'Prénom': clientTest.prenom,
      'Nom': clientTest.nom,
      'Type de client': clientTest.typeClient,
      'Date de naissance': clientTest.dateNaissance,
      'Email du client (table client)': clientTest.email,
      'Tél. Mobile': clientTest.telMobile,
      'Adresse et no': clientTest.adresse,
      'NPA': clientTest.npa,
      'Localité': clientTest.localite,
      'Canton': clientTest.canton,
      'Statut du client': 'Prospect',
      'Formule d\'appel': clientTest.formuleAppel,
      'Situation familiale': clientTest.situationFamiliale,
      'Statut professionnel': clientTest.statutProfessionnel,
      'Fumeur(se)': clientTest.fumeur,
      'Language': clientTest.language,
      'Groupe Familial': groupeFamilial,
    });

    const clientId = record.id;
    
    expect(clientId).toBeTruthy();
    console.log('✅ Client créé avec succès');
    console.log(`   ID: ${clientId}`);
    console.log(`   Groupe familial: ${groupeFamilial}`);
    console.log('');

    // ÉTAPE 4: Attendre l'automation Airtable
    console.log('─'.repeat(80));
    console.log('⏳ ÉTAPE 4: Attente automation Airtable (5 secondes)');
    console.log('─'.repeat(80));
    console.log('   L\'automation devrait :');
    console.log('   - Créer les liens bidirectionnels');
    console.log('   - Calculer le nombre de membres actifs');
    console.log('   - Calculer le rabais familial');
    console.log('');

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('✅ Attente terminée');
    console.log('');

    // ÉTAPE 5: Vérifier les données après automation
    console.log('─'.repeat(80));
    console.log('🔄 ÉTAPE 5: Vérification après automation');
    console.log('─'.repeat(80));

    const clientData = await getClientById(clientId);
    
    expect(clientData).toBeTruthy();
    
    const nbMembres = (clientData!['Nb membres famille actifs'] as number) || 1;
    const rabaisFamilial = (clientData!['Rabais familial %'] as number) || 0;
    
    console.log('✅ Données récupérées:');
    console.log(`   Groupe familial: ${clientData!['Groupe Familial'] || 'Non défini'}`);
    console.log(`   Nb membres actifs: ${nbMembres}`);
    console.log(`   Rabais familial: ${rabaisFamilial}%`);
    console.log('');

    // ÉTAPE 6: Simuler la création session Stripe
    console.log('─'.repeat(80));
    console.log('💳 ÉTAPE 6: Simulation session Stripe');
    console.log('─'.repeat(80));

    const members = await getFamilyMembers(groupeFamilial);
    const rabais = calculateFamilyDiscount(nbMembres);
    const prixBase = 185;
    const prixFinal = applyFamilyDiscount(prixBase, rabais);
    const economie = prixBase - prixFinal;

    const membersList = members
      .map(m => `${m.prenom || ''} ${m.nom}`.trim())
      .join(', ');

    const description = [
      `Mandat de Gestion Annuel - ${clientTest.prenom} ${clientTest.nom}`,
      '',
      `👥 GROUPE FAMILIAL: ${groupeFamilial}`,
      `Membres actifs (${nbMembres}): ${membersList}`,
      '',
      `💰 CALCUL DU PRIX:`,
      `Prix de base: CHF ${prixBase.toFixed(2)}`,
      `Rabais familial: -${rabais}% (${nbMembres} membres)`,
      `Économie: CHF ${economie.toFixed(2)}`,
      `Prix final: CHF ${prixFinal.toFixed(2)}`,
    ].join('\n');

    console.log('✅ Simulation réussie');
    console.log('');
    console.log('📄 DESCRIPTION STRIPE:');
    console.log('┌' + '─'.repeat(78) + '┐');
    description.split('\n').forEach(line => {
      console.log('│ ' + line.padEnd(77) + '│');
    });
    console.log('└' + '─'.repeat(78) + '┘');
    console.log('');
    console.log('📊 RÉSUMÉ:');
    console.log(`   Groupe: ${groupeFamilial}`);
    console.log(`   Membres: ${nbMembres}`);
    console.log(`   Rabais: ${rabais}%`);
    console.log(`   Prix base: ${prixBase} CHF`);
    console.log(`   Prix final: ${prixFinal} CHF`);
    console.log(`   Économie: ${economie} CHF`);
    console.log(`   Montant Stripe: ${Math.round(prixFinal * 100)} centimes`);
    console.log('');

    // Vérifications finales
    expect(nbMembres).toBeGreaterThan(0);
    expect(rabais).toBeGreaterThanOrEqual(0);
    expect(rabais).toBeLessThanOrEqual(20);
    expect(prixFinal).toBeLessThanOrEqual(prixBase);

    console.log('='.repeat(80));
    console.log('✅ TEST TERMINÉ AVEC SUCCÈS');
    console.log('='.repeat(80));
    console.log('');
    console.log('📝 RÉSULTATS:');
    console.log(`   ✅ Client créé: ${clientId}`);
    console.log(`   ✅ Groupe familial: ${groupeFamilial}`);
    console.log(`   ✅ Code parrainage validé: ${CODE_PARRAINAGE}`);
    console.log(`   ✅ Simulation Stripe réussie`);
    console.log('');
    console.log('⚠️  NETTOYAGE:');
    console.log(`   Pour supprimer le client test, allez dans Airtable`);
    console.log(`   et supprimez le record ${clientId}`);
    console.log('');
  }, 30000); // Timeout de 30 secondes
});
