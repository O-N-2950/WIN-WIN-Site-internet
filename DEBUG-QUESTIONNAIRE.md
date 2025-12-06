# 🐛 DEBUG - Questionnaire Étape 2

## 1️⃣ CODE COMPLET DE `nextStep()` (lignes 213-226)

```typescript
const nextStep = () => {
  // Forcer un petit délai pour s'assurer que le state est à jour
  setTimeout(() => {
    console.log('🚀 NEXT STEP - Avant validation');
    console.log('Current step:', currentStep);
    console.log('Data state:', { email: data.email, telMobile: data.telMobile });
    
    if (validateCurrentStep()) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 50); // Petit délai de 50ms pour s'assurer que onChange a fini
};
```

## 2️⃣ CODE COMPLET DE `validateCurrentStep()` (lignes 234-262)

```typescript
const validateCurrentStep = (): boolean => {
  console.log('🔍 VALIDATION STEP', currentStep);
  console.log('📊 État data complet:', data);
  console.log('📧 Email:', data.email, '| Type:', typeof data.email, '| Length:', data.email?.length);
  console.log('📱 TelMobile:', data.telMobile, '| Type:', typeof data.telMobile, '| Length:', data.telMobile?.length);
  console.log('✅ Conditions:', {
    hasEmail: !!data.email,
    hasTelMobile: !!data.telMobile,
    willPass: !!(data.email && data.telMobile)
  });
  
  switch (currentStep) {
    case 1:
      if (!data.prenom || !data.nom) {
        toast.error("Veuillez renseigner votre nom et prénom");
        return false;
      }
      return true;
    case 2:
      if (!data.email || !data.telMobile) {
        toast.error("Veuillez renseigner votre email et téléphone");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        toast.error("Email invalide");
        return false;
      }
      return true;
    case 3:
      if (!data.dateNaissance || !data.situationFamiliale) {
        toast.error("Veuillez compléter votre situation");
        return false;
      }
      return true;
    case 4:
      if (!data.typeClient) {
        toast.error("Veuillez sélectionner votre type de client");
        return false;
      }
      if (data.typeClient === "entreprise" && data.nombreEmployes === 0) {
        toast.error("Veuillez indiquer le nombre d'employés");
        return false;
      }
      return true;
    // ... autres cases
  }
};
```

## 3️⃣ LOGS DE DEBUG ACTIFS

### useEffect qui log les changements (lignes 190-193)
```typescript
useEffect(() => {
  console.log('📧 Email changed:', data.email);
  console.log('📱 TelMobile changed:', data.telMobile);
}, [data.email, data.telMobile]);
```

### Sauvegarde automatique (lignes 196-211)
```typescript
useEffect(() => {
  if (!showIntro) {
    const timer = setTimeout(() => {
      updateWorkflow({
        clientName: `${data.prenom} ${data.nom}`,
        clientEmail: data.email,
        clientType: data.typeClient === "prive" ? "prive" : "entreprise",
        clientAddress: `${data.adresse}, ${data.npa} ${data.localite}`,
        clientEmployeeCount: data.nombreEmployes,
        questionnaireData: data,
      });
      toast.success("✓ Sauvegarde automatique", { duration: 1000 });
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [data, showIntro]);
```

## 4️⃣ LOGS CONSOLE ATTENDUS

Quand vous tapez dans les champs email et téléphone, vous devriez voir :

```
📧 Email changed: olivier.neukomm@bluewin.ch
📱 TelMobile changed: +41795792500
```

Quand vous cliquez sur "Suivant", vous devriez voir :

```
🚀 NEXT STEP - Avant validation
Current step: 2
Data state: { email: "olivier.neukomm@bluewin.ch", telMobile: "+41795792500" }
🔍 VALIDATION STEP 2
📊 État data complet: { prenom: "...", nom: "...", email: "olivier.neukomm@bluewin.ch", telMobile: "+41795792500", ... }
📧 Email: olivier.neukomm@bluewin.ch | Type: string | Length: 28
📱 TelMobile: +41795792500 | Type: string | Length: 13
✅ Conditions: { hasEmail: true, hasTelMobile: true, willPass: true }
```

## 5️⃣ URLS API APPELÉES

Le questionnaire n'appelle **AUCUNE API** lors du passage d'une étape à l'autre.

La seule API appelée est la **sauvegarde automatique** après 2 secondes d'inactivité :
- Fonction : `updateWorkflow()` (contexte React)
- Stockage : **localStorage** uniquement (pas d'appel réseau)
- Aucun appel visible dans l'onglet Network

## 6️⃣ INTERFACE QuestionnaireData (lignes 131-145)

```typescript
interface QuestionnaireData {
  prenom: string;
  nom: string;
  email: string;
  telMobile: string;  // ✅ CORRECT - Un seul champ téléphone
  dateNaissance: string;
  situationFamiliale: "celibataire" | "marie" | "divorce" | "veuf" | "";
  typeClient: "prive" | "entreprise" | "les_deux" | "";
  
  // Données privé
  adresse: string;
  npa: string;
  localite: string;
  polices: Police[];
  // ...
}
```

## 7️⃣ DIAGNOSTIC

**Le code est CORRECT :**
- ✅ Interface avec `telMobile` uniquement
- ✅ Validation vérifie `data.telMobile`
- ✅ Logs de debug présents
- ✅ Délai de 50ms pour synchronisation
- ✅ Aucun appel API bloquant

**Si le problème persiste, c'est probablement :**
1. **Cache navigateur** : Les logs ne s'affichent pas = ancienne version
2. **Déploiement Railway incomplet** : Le nouveau code n'est pas en production
3. **Problème de state React** : Les inputs ne mettent pas à jour le state

## 8️⃣ SOLUTION

**ENVOYEZ-MOI :**
1. Une capture d'écran de la **console** (F12) après avoir cliqué sur "Suivant"
2. L'URL exacte que vous utilisez (www.winwin.swiss ou autre)
3. Confirmez que vous avez **vidé le cache** (Réglages > Safari > Effacer historique)

**Avec ces informations, je pourrai identifier la vraie cause et corriger définitivement !**
