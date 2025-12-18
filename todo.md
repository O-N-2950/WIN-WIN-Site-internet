# TODO - WIN WIN Finance Group

## ✅ TERMINÉ

- [x] Synchroniser listes déroulantes questionnaire avec Airtable
- [x] Implémenter validation IBAN stricte avec auto-formatage
- [x] Corriger backend pour accepter tous les champs
- [x] Corriger tous les noms de champs Airtable
- [x] Corriger conversion NPA string → number
- [x] Améliorer copywriting ("rabais de groupe")
- [x] Ajouter "Tout sélectionner" pour les polices
- [x] Simplifier labels polices + ajouter Protection juridique + Dégâts d'eau
- [x] Validation complète avec messages d'erreur précis
- [x] CSS Header : Cacher texte logo
- [x] Bouton "← Retour" pour préserver données
- [x] Auto-complétion NPA → Localité avec API Zippopotam.us
- [x] Champs Employeur + Taux d'activité pour Employé(e)
- [x] Taux d'activité AUSSI pour Indépendant(e)
- [x] Message humoristique 150% (Indépendant + Employé)
- [x] Corrections TypeScript Durabilis.tsx (0 erreur)

## 🔥 BUG NOMS CHAMPS AIRTABLE (EN COURS)

- [x] **BUG NOMS CHAMPS** : Envoie "Contact Nom" au lieu de "Nom", "Contact Prénom" au lieu de "Prénom" → Corrigé

## 🔥 BUG CODE PARRAINAGE (EN ATTENTE)

- [ ] **BUG AFFICHAGE CODE PARRAINAGE** : Le backend retourne groupeFamilial mais le frontend ne l'affiche pas

## 🔥 SIMPLIFICATION NPA/LOCALITÉ/CANTON (TERMINÉ)

- [x] Remplacer AddressAutocomplete par champs texte simples (NPA + Localité)
- [x] Ajouter dropdown Canton avec valeurs exactes Airtable (26 cantons)
- [x] Supprimer tous les contrôles (icônes vertes, animations, messages)

## 🔥 BUGS CRITIQUES RÉSOLUS (V10)

- [x] **BUG CANTON VIDE** : Airtable refuse Canton vide (INVALID_MULTIPLE_CHOICE_OPTIONS) → Ne pas envoyer si vide

## 🔥 BUGS CRITIQUES RÉSOLUS (V9 - suite)

- [x] **SUPPRIMER 150%** : Airtable n'accepte pas 150%, supprimé du formulaire (type + SelectItem + message)

## 🔥 BUGS CRITIQUES RÉSOLUS (V9)

- [x] **BUG NOM CHAMP AIRTABLE** : Airtable refuse "Taux d'activité" → Le champ s'appelle "Taux d'activité %" (avec %)

## 🔥 BUGS CRITIQUES RÉSOLUS (V8)

- [x] **BUG ERREUR ENVOI AIRTABLE** : "Erreur lors de l'envoi. Vérifiez vos informations." → Manquait employeur + tauxActivite dans schema Zod
- [x] **BUG FORMAT DATE NAISSANCE** : Affiche "1973-05-12" au lieu de "12.05.1973" → Formaté avec toLocaleDateString

## 🔥 BUGS CRITIQUES RÉSOLUS (Récents)

- [x] **BUG SAISIE LOCALITÉ BLOQUÉE** : La key dynamique empêche la saisie manuelle, supprimée complètement

## 🔥 BUGS CRITIQUES RÉSOLUS (Anciens)

- [x] **BUG VALIDATION EMPLOYÉS** : Permettre 0 employés pour les entreprises immobilières
- [x] **BUG LOCALITÉ VIDE** : Railway n'a pas redéployé la V6, forcer le déploiement

## 🔥 BUGS CRITIQUES RÉSOLUS

- [x] **BUG CALCUL PRIX STRIPE** : Erreur 500 lors du calcul du prix (client.getStripePrice)
  - ✅ Filtres Airtable corrigés avec field IDs
  - ✅ Calcul dynamique du nombre de membres (plus besoin de champ Airtable)
  - ✅ 3 mutations corrigées (create, getStripePrice, createCheckoutSession)

- [x] **API Zippopotam 404** : Remplacer par OpenPLZ (API suisse complète)
  - ✅ AddressAutocomplete.tsx réécrit avec OpenPLZ
  - ✅ Plus d'erreurs 404 sur NPA valides

- [x] **Auto-complétion BIDIRECTIONNELLE** :
  - [x] NPA → Localité (déjà fait)
  - [x] Localité → NPA (nouveau !)
  - ✅ Exemple : "Bure" → NPA devient "2915"

## 📝 ERREURS TYPESCRIPT (93 erreurs restantes)

- [ ] Corriger erreurs TypeScript dans Mapping360.tsx (20+ erreurs)
- [ ] Corriger erreurs TypeScript dans ParentsEnfants.tsx (10+ erreurs)
- [ ] Corriger erreurs TypeScript dans Merci.tsx (3 erreurs)
- [ ] Corriger autres erreurs TypeScript (60+ erreurs dans d'autres fichiers)

## 🎨 Améliorations UX AddressAutocomplete (Terminé)

- [x] Ajouter indicateur visuel vert (✓) sur le champ NPA quand une localité est trouvée automatiquement
- [x] Pré-remplir automatiquement le canton dans un champ caché pour l'envoyer à Airtable
- [x] Ajouter un message d'aide sous les champs : "Tapez votre NPA ou votre localité, l'autre champ se remplira automatiquement"
- [x] Ajouter animation bounce sur l'icône verte ✓ pour la rendre plus visible
- [x] Afficher le canton trouvé dans le message d'aide (ex: "✓ Porrentruy, Jura")

## 🚀 PROCHAINES FONCTIONNALITÉS

- [ ] Code de parrainage à l'étape 2
- [ ] Validation temps réel du code
- [ ] Afficher rabais immédiatement

## 🔧 CORRECTIONS 16 DÉC 2024

- [x] Corriger page Conseil : retirer bloc "Dernière étape : Partagez-nous vos contrats"
- [ ] Corriger page Protection Juridique : remettre image parapluie sans animation pluie
- [x] BUG CRITIQUE: Corriger l'upload de fichiers page Conseil (erreur 404 upload.uploadFile)
- [x] BUG: Corriger l'envoi de message page Conseil (erreur 404 appointment.sendContactRequest)
- [x] CRÉER le router contact avec sendMessage et uploadAttachment dans server/routers.ts
- [x] BUG: Erreur 500 lors de l'envoi de message (vérifier table Airtable)

## 🎨 Page Protection Juridique - Améliorations UX/Conversion (17 DÉC 2024)

- [x] Transformer l'image parapluie en bandeau background (bien visible)
- [x] Ajouter 2 CTA dans le hero (Souscrire + Demandez conseil)
- [x] Tester le scroll automatique vers les cartes de souscription
- [x] Vérifier que l'image du parapluie reste reconnaissable

## 🔧 Correction liens "Demandez conseil" (17 DÉC 2024)

- [x] Corriger tous les boutons "Demandez conseil" pour pointer vers /conseil au lieu de /contact

## 🎨 Amélioration icône Protection Juridique (17 DÉC 2024)

- [x] Remplacer emoji cadenas 🔒 par balance ⚖️ (plus pertinent pour la justice)

## 🐛 BUG: Pièces jointes non attachées dans Airtable (17 DÉC 2024)

- [x] Corriger l'upload des PDF pour qu'ils soient attachés directement dans Airtable (champ Attachments)
- [x] Au lieu d'envoyer juste un lien texte Cloudinary, utiliser le format Airtable Attachments

## 🐛 BUG: Pièce jointe non incluse dans la notification (18 DÉC 2024)

- [ ] La pièce jointe uploadée sur Cloudinary n'est pas transmise dans la notification au propriétaire
