
## Système de Relations Familiales - CORRECTION COMPLÈTE

### Phase 1 : Champs de Base
- [x] Créer champ "Membres de la famille" (Link to another record, bidirectionnel)
- [x] Mettre à jour champ "Relations familiales" avec les 26 valeurs

### Phase 2 : Calculs Automatiques (EN COURS)
- [ ] Créer formule "Nb membres famille" (compte les membres liés) - MANUEL REQUIS
- [ ] Créer formule "Rabais familial %" (calcul dynamique) - MANUEL REQUIS
- [ ] Créer formule "Prix mandat avec rabais" (prix final) - MANUEL REQUIS
- [ ] Mettre à jour formule "Groupe Familial" (format FAMILLE-NOM-CODE) - MANUEL REQUIS
- [x] Documentation complète des formules créée

### Phase 3 : Tests
- [ ] Lier les membres de la famille Bussat dans "Membres de la famille"
- [ ] Vérifier calcul automatique du nombre de membres
- [ ] Vérifier calcul automatique du rabais (4 membres = 8%)
- [ ] Vérifier recalcul automatique du prix

### Phase 4 : Documentation
- [ ] Mettre à jour la documentation avec les nouvelles formules
- [ ] Créer guide d'utilisation complet

## Corrections UX

- [x] Supprimer le texte "Pour vous envoyer votre analyse personnalisée" de la page Mapping 360

## Refonte Workflow Séquentiel (1 mandat à la fois)

- [x] Questionnaire : Supprimer "Les deux", garder Privé OU Entreprise
- [x] Questionnaire : Questions entreprise complètes déjà présentes
- [x] Modifier page Confirmation après paiement
- [x] Page Confirmation : 2 boutons (Entreprise / Conjoint ou conjointe) + Terminer
- [x] Backend : Simplifier création 1 mandat à la fois (privé OU entreprise)
- [ ] Backend : Gérer groupe familial et rabais automatique (TODO)
- [ ] Tests complets workflow

## Champs manquants clients PRIVÉS (synchronisation Airtable)

- [ ] Ajouter Formule d'appel (Monsieur/Madame)
- [ ] Ajouter Statut professionnel (8 options)
- [ ] Ajouter Situation familiale (6 options)
- [ ] Ajouter Nationalité (Suisse par défaut, 8 options)
- [ ] Ajouter Permis d'établissement (si non-Suisse, 4 options)
- [ ] Ajouter Banque (liste déroulante 9 banques)
- [ ] Valider format IBAN (CH + 19 caractères)
- [ ] Mettre à jour schéma Zod backend
- [ ] Mettre à jour création Airtable avec tous les champs
