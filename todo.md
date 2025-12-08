
- [x] Synchroniser listes déroulantes questionnaire avec Airtable (Nationalité, Permis, Banque)
- [x] Implémenter logique conditionnelle : afficher champ Permis uniquement si nationalité !== "Suisse"
- [x] Ajouter option "Autre" dans listes Banque et Nationalité avec champ texte libre
- [x] Corriger backend server/routers.ts pour accepter tous les nouveaux champs du questionnaire
- [ ] Tester enregistrement complet (frontend → backend → Airtable)
- [x] Implémenter validation IBAN stricte (CH + 19 chiffres ou CH + 18 chiffres + 1 lettre) avec auto-formatage
- [x] Ajouter champ Profession conditionnel (si Employé ou Indépendant)
- [x] Mapper champ Profession vers Airtable
- [x] Bloquer soumission si IBAN invalide (afficher erreur claire)
- [x] Corriger schéma Zod polices (array de strings au lieu d'objets)
- [x] Déboguer erreur d'enregistrement (tester localement + analyser logs)
- [x] Corriger format polices dans handleSubmit (objects → strings)
- [x] Corriger tous les noms de champs Airtable (11 champs corrigés)
- [x] Analyser logs Railway récents pour identifier l'erreur exacte
- [x] Vérifier TOUS les champs envoyés vs schéma Airtable
- [x] Corriger champ Banque (espaces supprimés dans Airtable)
- [x] Analyser les logs Railway pour voir l'erreur exacte côté serveur
- [x] Identifier le champ ou la valeur qui cause le rejet par Airtable (Contact NPA)
- [x] Corriger le code backend (conversion NPA string → number)
- [x] Forcer Railway à redéployer avec le dernier commit GitHub

## 🎨 AMÉLIORATIONS UX - Questionnaire Polices

- [x] Remplacer "Voulez-vous payer moins cher ?" par "Souhaitez-vous bénéficier d'un rabais de groupe ?"
- [x] Ajouter option "Tout sélectionner" en premier choix (coche/décoche toutes les polices)
- [x] Simplifier les labels des polices (enlever "Police" répété : "Ménage" au lieu de "Police Ménage")
- [x] Ajouter "Protection juridique" dans la liste des polices
- [x] Ajouter "Dégâts d'eau bâtiment" dans la liste des polices
- [x] Corriger validation email (z.string().min(1) au lieu de z.string().email())
- [x] Ajouter validation complète avec messages d'erreur précis pour champs manquants

## 🚀 PROCHAINE FONCTIONNALITÉ - Code de Parrainage

- [ ] Ajouter champ "Code de parrainage (optionnel)" à l'étape 2 du questionnaire
- [ ] Implémenter validation temps réel du code de parrainage
- [ ] Afficher message de confirmation si code valide ("✓ Vous rejoignez le groupe de [Nom]")
- [ ] Calculer et afficher le rabais immédiatement
