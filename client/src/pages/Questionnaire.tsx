import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { formatIBAN, getIBANError } from "@/lib/ibanUtils";
import { useState, useEffect } from "react";

import { useLocation } from "wouter";
import {
  ArrowRight, ArrowLeft, Check, Upload, Sparkles, Building2, User, Users,
  MapPin, FileText, Zap, CheckCircle2, Shield, X, Camera
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PoliceModal from "@/components/PoliceModal";
import { trpc } from "@/lib/trpc";

// --- CONSTANTES & TYPES ---

const STORAGE_KEY = "winwin_form_autosave";

const CHECKLIST_PRIVE = [
  { id: "tout", label: "Tout sélectionner", icon: "✅" },
  { id: "maladie", label: "Assurance Maladie (Base + Compl.)", icon: "🏥" },
  { id: "menage", label: "Ménage & RC Privée", icon: "🏠" },
  { id: "voiture", label: "Véhicule / Moto", icon: "🚗" },
  { id: "vie", label: "Vie / 3ème pilier", icon: "🌱" },
  { id: "batiment", label: "Bâtiment (si propriétaire)", icon: "🏗️" },
  { id: "degats_eau", label: "Dégâts d'eau bâtiment", icon: "💧" },
  { id: "protection_juridique", label: "Protection juridique", icon: "⚖️" },
];

const CHECKLIST_ENTREPRISE = [
  { id: "rc_pro", label: "RC Professionnelle / Entreprise", icon: "🏢" },
  { id: "lpp", label: "Prévoyance Professionnelle (LPP)", icon: "👥" },
  { id: "laa", label: "Accident (LAA / LAA-C)", icon: "🚑" },
  { id: "ijm", label: "Perte de gain Maladie (IJM)", icon: "📉" },
  { id: "choses", label: "Assurance Choses / Inventaire", icon: "📦" },
];

interface Police {
  compagnie: string;
  autreCompagnie?: string;
  typesContrats: string[];
  pdfFile?: File;
  pdfFileName?: string;
  mode: "upload" | "demande" | "plus_tard";
  numeroPolice?: string;
}

interface QuestionnaireData {
  prenom: string;
  nom: string;
  email: string;
  telMobile: string;
  dateNaissance: string;
  formuleAppel: "Monsieur" | "Madame" | "";
  statutProfessionnel: "Employé(e)" | "Indépendant(e)" | "Retraité(e)" | "Sans Emploi" | "Au chômage" | "Ai" | "Etudiant(e)" | "Enfant" | "";
  profession: string;
  employeur: string;
  tauxActivite: "10 %" | "20 %" | "30 %" | "40 %" | "50 %" | "60 %" | "70 %" | "80 %" | "90 %" | "100 %" | "";
  situationFamiliale: "Célibataire" | "Marié(e)" | "Divorcé(e)" | "Veuf/Veuve" | "Concubin(e)" | "";
  nationalite: string;
  autreNationalite: string; // Si nationalite === "Autre"
  permisEtablissement: string;
  banque: string;
  autreBanque: string; // Si banque === "Autre"
  iban: string;
  typeClient: "prive" | "entreprise" | "";
  
  // Données privé
  adresse: string;
  npa: string;
  localite: string;
  canton: string; // Rempli automatiquement par OpenPLZ
  polices: Police[];
  
  // Données entreprise (si typeClient = "entreprise")
  nomEntreprise?: string;
  formeJuridique?: string;
  nombreEmployes?: number;
  adresseEntreprise?: string;
  npaEntreprise?: string;
  localiteEntreprise?: string;
  banqueEntreprise?: string;
  autreBanqueEntreprise?: string; // Si banqueEntreprise === "Autre"
  ibanEntreprise?: string;
  
  // Champ technique pour le rabais familial
  parrainEmail?: string;
  codeParrainageRef?: string; // Code de parrainage du parrain (depuis URL ?ref=CODE)
}

// --- COMPOSANT PRINCIPAL ---

export default function Questionnaire() {
  const [, navigate] = useLocation();
  // Workflow context removed - using trpc.client.create instead
  
  // États de navigation
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [parentDossier, setParentDossier] = useState<{email: string, nom: string} | null>(null);
  const [previousData, setPreviousData] = useState<QuestionnaireData | null>(null);

  // État des données (Initialisation COMPLÈTE)
  const [data, setData] = useState<QuestionnaireData>({
    prenom: "", nom: "", email: "", telMobile: "",
    dateNaissance: "", formuleAppel: "", statutProfessionnel: "",
    profession: "", employeur: "", tauxActivite: "",
    situationFamiliale: "", nationalite: "", autreNationalite: "", permisEtablissement: "",
    banque: "", autreBanque: "", iban: "", typeClient: "",
    adresse: "", npa: "", localite: "", canton: "", polices: [],
    // Entreprise
    nomEntreprise: "", formeJuridique: "", nombreEmployes: 0,
    adresseEntreprise: "", npaEntreprise: "", localiteEntreprise: "",
    banqueEntreprise: "", autreBanqueEntreprise: "", ibanEntreprise: "",
    // Champ technique pour le rabais familial
    parrainEmail: "",
    codeParrainageRef: "" // Récupéré depuis URL ?ref=CODE 
  });

  const [currentPoliceIndex, setCurrentPoliceIndex] = useState(0);
  const [showPoliceForm, setShowPoliceForm] = useState(false);

  // 0. RÉCUPÉRATION DU CODE DE PARRAINAGE DEPUIS URL (?ref=CODE)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get("ref");
    
    if (refCode) {
      console.log("🎉 Code de parrainage détecté dans l'URL:", refCode);
      setData(prev => ({ ...prev, codeParrainageRef: refCode }));
      toast.success("Code de parrainage appliqué !", {
        description: `Vous bénéficierez du rabais groupe familial grâce au code ${refCode}`
      });
    }
  }, []); // Exécuté UNE SEULE FOIS au montage

  // 1. CHARGEMENT AUTO (LocalStorage)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && showIntro) {
      try {
        const parsed = JSON.parse(saved);
        toast("Reprise de votre dossier", {
          description: "Nous avons restauré vos données saisies précédemment.",
          action: { label: "Effacer", onClick: () => localStorage.removeItem(STORAGE_KEY) }
        });
        setData(parsed);
        setShowIntro(false);
      } catch (e) { localStorage.removeItem(STORAGE_KEY); }
    }
  }, [showIntro]);

  // 2. SAUVEGARDE AUTO
  useEffect(() => {
    if (!showIntro && !isSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
       // Sync Backend silencieuse désactivée (utilise trpc.client.create à la soumission)
    }
  }, [data, showIntro, isSubmitted]);

  // --- LOGIQUE DE NAVIGATION ---

  const totalSteps = 7;
  // Définition dynamique des étapes selon le type
  const stepsPrive = [1, 2, 3, 5, 6, 7]; // Saute 4 (Entreprise details)
  const stepsEntreprise = [1, 2, 4, 6, 7]; // Saute 3 (Situation perso) et 5 (Adresse perso)

  const nextStep = () => {
    if (validateCurrentStep()) {
      setDirection(1);
      const flow = data.typeClient === 'entreprise' ? stepsEntreprise : stepsPrive;
      const currentIndex = flow.indexOf(currentStep);
      const next = flow[currentIndex + 1] || currentStep;
      
      if (currentStep === flow[flow.length - 1]) {
          // C'est le récapitulatif - on soumet
      } else {
          setCurrentStep(next);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setDirection(-1);
    const flow = data.typeClient === 'entreprise' ? stepsEntreprise : stepsPrive;
    const currentIndex = flow.indexOf(currentStep);
    const prev = flow[currentIndex - 1] || 1;
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const validateCurrentStep = (): boolean => {
    // Validation Step 1
    if (currentStep === 1 && !data.typeClient) {
        toast.error("Veuillez sélectionner un type de client");
        return false;
    }
    
    // Validation Step 2 (Email + Téléphone)
    if (currentStep === 2) {
      if (!data.email || !data.email.includes('@')) {
        toast.error("Veuillez saisir un email valide");
        return false;
      }
      if (!data.telMobile) {
        toast.error("Veuillez saisir un numéro de téléphone");
        return false;
      }
    }
    
    return true;
  };

  // --- LOGIQUE DE SOUMISSION ET UPSELL ---
  const createClientMutation = trpc.client.create.useMutation();

  const handleSubmit = async () => {
    try {
      // VALIDATION COMPLÈTE DES CHAMPS OBLIGATOIRES
      const missingFields: string[] = [];
      
      // Champs communs
      if (!data.email) missingFields.push("Émail");
      if (!data.telMobile) missingFields.push("Téléphone mobile");
      
      if (data.typeClient === "prive") {
        // Champs PRIVÉ obligatoires
        if (!data.formuleAppel) missingFields.push("Formule d'appel");
        if (!data.prenom) missingFields.push("Prénom");
        if (!data.nom) missingFields.push("Nom");
        if (!data.dateNaissance) missingFields.push("Date de naissance");
        if (!data.statutProfessionnel) missingFields.push("Statut professionnel");
        if ((data.statutProfessionnel === "Employé(e)" || data.statutProfessionnel === "Indépendant(e)") && !data.profession) {
          missingFields.push("Profession");
        }
        if (data.statutProfessionnel === "Employé(e)" && !data.employeur) {
          missingFields.push("Employeur");
        }
        if ((data.statutProfessionnel === "Employé(e)" || data.statutProfessionnel === "Indépendant(e)") && !data.tauxActivite) {
          missingFields.push("Taux d'activité");
        }
        if (!data.situationFamiliale) missingFields.push("Situation familiale");
        if (!data.nationalite) missingFields.push("Nationalité");
        if (data.nationalite === "Autre" && !data.autreNationalite) missingFields.push("Autre nationalité (préciser)");
        if (data.nationalite && data.nationalite !== "Suisse" && !data.permisEtablissement) {
          missingFields.push("Permis d'établissement");
        }
        if (!data.adresse) missingFields.push("Adresse");
        if (!data.npa) missingFields.push("NPA");
        if (!data.localite) missingFields.push("Localité");
        if (!data.banque) missingFields.push("Banque");
        if (data.banque === "Autre" && !data.autreBanque) missingFields.push("Autre banque (préciser)");
        if (!data.iban) missingFields.push("IBAN");
      } else if (data.typeClient === "entreprise") {
        // Champs ENTREPRISE obligatoires
        if (!data.nomEntreprise) missingFields.push("Nom de l'entreprise");
        if (!data.formeJuridique) missingFields.push("Forme juridique");
        if (data.nombreEmployes === undefined || data.nombreEmployes === null) missingFields.push("Nombre d'employés");
        if (!data.adresseEntreprise) missingFields.push("Adresse de l'entreprise");
        if (!data.npaEntreprise) missingFields.push("NPA de l'entreprise");
        if (!data.localiteEntreprise) missingFields.push("Localité de l'entreprise");
        if (!data.banqueEntreprise) missingFields.push("Banque de l'entreprise");
        if (data.banqueEntreprise === "Autre" && !data.autreBanqueEntreprise) missingFields.push("Autre banque (préciser)");
        if (!data.ibanEntreprise) missingFields.push("IBAN de l'entreprise");
      }
      
      // Polices obligatoires (au moins 1)
      if (data.polices.length === 0) {
        missingFields.push("Au moins une police à optimiser");
      }
      
      if (missingFields.length > 0) {
        toast.error(
          `⚠️ Formulaire incomplet\n\nVeuillez remplir les champs suivants :\n• ${missingFields.join('\n• ')}`,
          { duration: 8000 }
        );
        return;
      }
      
      // VALIDATION IBAN AVANT ENVOI
      if (data.typeClient === "prive" && data.iban) {
        const ibanError = getIBANError(data.iban);
        if (ibanError) {
          toast.error(`IBAN invalide : ${ibanError}`);
          return;
        }
      }
      if (data.typeClient === "entreprise" && data.ibanEntreprise) {
        const ibanError = getIBANError(data.ibanEntreprise);
        if (ibanError) {
          toast.error(`IBAN invalide : ${ibanError}`);
          return;
        }
      }

      // Appel au nouveau backend avec mapping Airtable strict
      const result = await createClientMutation.mutateAsync({
        typeClient: data.typeClient as "prive" | "entreprise",
        email: data.email,
        telMobile: data.telMobile,
        // Champs PRIVÉ
        formuleAppel: data.formuleAppel,
        prenom: data.prenom,
        nom: data.nom,
        dateNaissance: data.dateNaissance,
        statutProfessionnel: data.statutProfessionnel,
        profession: data.profession,
        employeur: data.employeur,
        tauxActivite: data.tauxActivite,
        situationFamiliale: data.situationFamiliale,
        nationalite: data.nationalite,
        autreNationalite: data.autreNationalite,
        permis: data.permisEtablissement,
        adresse: data.adresse,
        npa: data.npa,
        localite: data.localite,
        banque: data.banque,
        autreBanque: data.autreBanque,
        iban: data.iban,
        // Champs ENTREPRISE
        nomEntreprise: data.nomEntreprise,
        formeJuridique: data.formeJuridique,
        nombreEmployes: data.nombreEmployes,
        adresseEntreprise: data.adresseEntreprise,
        npaEntreprise: data.npaEntreprise,
        localiteEntreprise: data.localiteEntreprise,
        banqueEntreprise: data.banqueEntreprise,
        autreBanqueEntreprise: data.autreBanqueEntreprise,
        ibanEntreprise: data.ibanEntreprise,
        // Polices (convertir objets en strings)
        polices: data.polices.flatMap(p => p.typesContrats),
        // CLÉ MULTI-MANDATS
        parrainEmail: data.parrainEmail,
      });

      console.log("✅ Client créé dans Airtable:", result);

      localStorage.removeItem(STORAGE_KEY);

      setParentDossier({
        email: data.email,
        nom: data.typeClient === 'entreprise' ? (data.nomEntreprise || "") : data.nom
      });

      toast.success(`🎉 Dossier enregistré ! Groupe: ${result.groupeFamilial}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi. Vérifiez vos informations.");
    }
  };

  // --- LE GRAND RESET (Logique Airtable stricte) ---
  const handleNewDossier = (targetType: "prive" | "entreprise") => {
    const isConjoint = targetType === "prive";
    
    // SAUVEGARDER l'état actuel avant de réinitialiser
    setPreviousData({ ...data });
    
    const commonContact = {
        email: data.email,
        telMobile: data.telMobile,
    };
    
    // RESET TOTAL
    setData({
        prenom: "", nom: "", 
        email: commonContact.email, 
        telMobile: commonContact.telMobile,
        
        // Adresse : On garde UNIQUEMENT si c'est un conjoint (même ménage)
        adresse: isConjoint ? data.adresse : "",
        npa: isConjoint ? data.npa : "",
        localite: isConjoint ? data.localite : "",

        dateNaissance: "", formuleAppel: "", statutProfessionnel: "", 
        profession: "", employeur: "", tauxActivite: "", situationFamiliale: "",
        nationalite: "", autreNationalite: "", permisEtablissement: "", banque: "", autreBanque: "", iban: "",
        
        nomEntreprise: "", formeJuridique: "", nombreEmployes: 0,
        adresseEntreprise: "", npaEntreprise: "", localiteEntreprise: "",
        banqueEntreprise: "", autreBanqueEntreprise: "", ibanEntreprise: "",

        polices: [],
        typeClient: targetType,

        // CLÉ DU SYSTÈME RABAIS : On lie ce dossier au précédent
        parrainEmail: parentDossier?.email || "" 
    });

    setIsSubmitted(false);
    setCurrentStep(1);
    toast.info(targetType === 'entreprise' ? "Ajout de l'entreprise : Champs initialisés" : "Ajout du conjoint : Champs initialisés");
  };

  // Fonction pour revenir en arrière
  const handleRetour = () => {
    if (previousData) {
      setData(previousData);
      setPreviousData(null);
      setIsSubmitted(true);
      setCurrentStep(1);
      toast.success("Retour au dossier précédent");
    }
  };

  // Écran Upsell Final
  if (isSubmitted) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
            <Card className="p-12 max-w-4xl text-center shadow-2xl">
                 <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
                    <Check className="h-12 w-12 text-green-600" />
                 </div>
                 <h2 className="text-4xl font-bold mb-4">Dossier enregistré !</h2>
                 <p className="text-xl text-muted-foreground mb-8">
                    Le tarif standard est de 185.-/an. <br/>
                    <span className="text-primary font-bold">Souhaitez-vous bénéficier d'un rabais de groupe ?</span>
                 </p>
                 
                 <div className="grid md:grid-cols-3 gap-6">
                    <button onClick={() => handleNewDossier("entreprise")} className="p-6 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-all">
                        <Building2 className="w-10 h-10 mx-auto text-primary mb-3"/>
                        <div className="font-bold">Ajouter mon Entreprise</div>
                        <div className="text-xs text-muted-foreground">Rabais groupe immédiat</div>
                    </button>
                    <button onClick={() => handleNewDossier("prive")} className="p-6 border-2 border-dashed border-purple-500/30 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all">
                        <Users className="w-10 h-10 mx-auto text-purple-600 mb-3"/>
                        <div className="font-bold">Ajouter mon Conjoint</div>
                        <div className="text-xs text-muted-foreground">Rabais groupe immédiat</div>
                    </button>
                    <button onClick={() => navigate(`/paiement/${encodeURIComponent(data.email)}`)} className="p-6 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
                        <ArrowRight className="w-10 h-10 mx-auto mb-3"/>
                        <div className="font-bold">Terminer & Signer</div>
                        <div className="text-xs opacity-70">Procéder au paiement</div>
                    </button>
                 </div>
            </Card>
        </div>
    );
  }

  // Écran intro
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <Card className="p-8 md:p-12 text-center shadow-2xl bg-white/95 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent mb-6"
            >
              <Sparkles className="h-12 w-12 text-white" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bienvenue ! 👋
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Nous allons créer ensemble votre dossier personnalisé en quelques minutes.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Rapide</h3>
                  <p className="text-sm text-muted-foreground">5-10 minutes seulement</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5">
                <Shield className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Sécurisé</h3>
                  <p className="text-sm text-muted-foreground">Données 100% protégées</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
                <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Automatique</h3>
                  <p className="text-sm text-muted-foreground">Sauvegarde en temps réel</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowIntro(false)}
              size="lg"
              className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
            >
              Commencer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      {/* Bouton Retour (si previousData existe) */}
      {previousData && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            onClick={handleRetour}
            className="bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      )}

      {/* Indicateur de progression */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
        >
          <span className="text-sm font-semibold text-primary">
            Étape {currentStep} / {totalSteps}
          </span>
        </motion.div>
      </div>

      {/* Contenu */}
      <div className="container py-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 md:p-12 bg-white/95 backdrop-blur-sm shadow-2xl">
                {/* Étape 1: Choix Type Client + Identité */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bonjour ! 👋
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Vous souhaitez assurer un particulier ou une entreprise ?
                      </p>
                    </div>

                    {/* CHOIX TYPE CLIENT */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setData({ ...data, typeClient: "prive" })}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          data.typeClient === "prive"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <User className="h-10 w-10 mx-auto mb-3 text-primary" />
                        <h3 className="text-lg font-semibold mb-2">Particulier</h3>
                        <p className="text-xs text-muted-foreground">
                          Pour moi ou ma famille
                        </p>
                        {data.typeClient === "prive" && (
                          <CheckCircle2 className="mt-3 mx-auto w-5 h-5 text-primary" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setData({ ...data, typeClient: "entreprise" })}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          data.typeClient === "entreprise"
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Building2 className="h-10 w-10 mx-auto mb-3 text-primary" />
                        <h3 className="text-lg font-semibold mb-2">Entreprise</h3>
                        <p className="text-xs text-muted-foreground">
                          Pour ma société (SA, Sàrl...)
                        </p>
                        {data.typeClient === "entreprise" && (
                          <CheckCircle2 className="mt-3 mx-auto w-5 h-5 text-primary" />
                        )}
                      </motion.button>
                    </div>

                    {/* CHAMPS CONDITIONNELS PARTICULIER */}
                    {data.typeClient === "prive" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <div>
                          <Label htmlFor="formuleAppel" className="text-lg">Formule d'appel *</Label>
                          <Select value={data.formuleAppel} onValueChange={(value) => setData({ ...data, formuleAppel: value as any })}>
                            <SelectTrigger className="mt-2 text-lg h-14">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Monsieur">Monsieur</SelectItem>
                              <SelectItem value="Madame">Madame</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="prenom" className="text-lg">Prénom *</Label>
                          <Input
                            id="prenom"
                            value={data.prenom}
                            onChange={(e) => setData({ ...data, prenom: e.target.value })}
                            placeholder="Jean"
                            className="mt-2 text-lg h-14"
                          />
                        </div>

                        <div>
                          <Label htmlFor="nom" className="text-lg">Nom *</Label>
                          <Input
                            id="nom"
                            value={data.nom}
                            onChange={(e) => setData({ ...data, nom: e.target.value })}
                            placeholder="Dupont"
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* CHAMPS CONDITIONNELS ENTREPRISE */}
                    {data.typeClient === "entreprise" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4"
                      >
                        <div>
                          <Label htmlFor="nomEntreprise" className="text-lg">Nom de l'entreprise *</Label>
                          <Input
                            id="nomEntreprise"
                            value={data.nomEntreprise || ""}
                            onChange={(e) => setData({ ...data, nomEntreprise: e.target.value })}
                            placeholder="WIN WIN Finance Group"
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label className="text-lg mb-3 block">Forme juridique *</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { value: 'entreprise_individuelle', label: 'Raison Indiv.', icon: '👤' },
                              { value: 'sarl', label: 'Sàrl', icon: '🤝' },
                              { value: 'sa', label: 'SA', icon: '🏢' },
                              { value: 'autre', label: 'Autre', icon: '💼' },
                            ].map((forme) => (
                              <button
                                key={forme.value}
                                type="button"
                                onClick={() => setData({ ...data, formeJuridique: forme.value })}
                                className={`
                                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                                  hover:border-primary hover:shadow-md
                                  ${
                                    data.formeJuridique === forme.value 
                                      ? 'border-primary bg-primary/5 shadow-md' 
                                      : 'border-border bg-background'
                                  }
                                `}
                              >
                                <div className="text-2xl mb-1">{forme.icon}</div>
                                <div className="font-semibold text-sm">{forme.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="nombreEmployes" className="text-lg">Nombre d'employés *</Label>
                          <Input
                            id="nombreEmployes"
                            type="number"
                            value={data.nombreEmployes || ""}
                            onChange={(e) => setData({ ...data, nombreEmployes: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                            className="mt-2 text-lg h-14"
                            required
                            min="0"
                          />
                        </div>

                        {/* Coordonnées bancaires déplacées ici pour l'entreprise */}
                        <div className="mt-6 pt-6 border-t border-border">
                          <p className="text-muted-foreground mb-4">
                            Sur quel compte souhaitez-vous recevoir vos prestations en cas de sinistre ?
                          </p>
                          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            Coordonnées bancaires
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="banqueEntreprise" className="text-lg">Banque *</Label>
                              <Select value={data.banqueEntreprise || ""} onValueChange={(value) => setData({ ...data, banqueEntreprise: value })}>
                                <SelectTrigger className="mt-2 text-lg h-14">
                                  <SelectValue placeholder="Sélectionnez..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="UBS SA">UBS SA</SelectItem>
                                  <SelectItem value="Crédit Suisse">Crédit Suisse</SelectItem>
                                  <SelectItem value="PostFinance">PostFinance</SelectItem>
                                  <SelectItem value="Banque RAIFFEISEN">Banque RAIFFEISEN</SelectItem>
                                  <SelectItem value="Banque Cantonale Vaudoise (BCV)">Banque Cantonale Vaudoise (BCV)</SelectItem>
                                  <SelectItem value="Banque Cantonale Neuchâteloise (BCN)">Banque Cantonale Neuchâteloise (BCN)</SelectItem>
                                  <SelectItem value="Banque Cantonale du Jura (BCJ)">Banque Cantonale du Jura (BCJ)</SelectItem>
                                  <SelectItem value="Banque Cantonale Bernoise (BCBE)">Banque Cantonale Bernoise (BCBE)</SelectItem>
                                  <SelectItem value="Banque Cantonale de Genève (BCGE)">Banque Cantonale de Genève (BCGE)</SelectItem>
                                  <SelectItem value="Banque Cantonale du Valais (BCVS)">Banque Cantonale du Valais (BCVS)</SelectItem>
                                  <SelectItem value="Banque Cantonale de Zurich (Zürcher Kantonalbank)">Banque Cantonale de Zurich (Zürcher Kantonalbank)</SelectItem>
                                  <SelectItem value="Banque Migros">Banque Migros</SelectItem>
                                  <SelectItem value="Banque COOP">Banque COOP</SelectItem>
                                  <SelectItem value="Banque Cler">Banque Cler</SelectItem>
                                  <SelectItem value="Valiant">Valiant</SelectItem>
                                  <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Champ "Autre banque entreprise" (conditionnel) */}
                            {data.banqueEntreprise === "Autre" && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                              >
                                <Label htmlFor="autreBanqueEntreprise" className="text-lg">Précisez le nom de la banque *</Label>
                                <Input
                                  id="autreBanqueEntreprise"
                                  value={data.autreBanqueEntreprise || ""}
                                  onChange={(e) => setData({ ...data, autreBanqueEntreprise: e.target.value })}
                                  placeholder="Ex: Banque Lombard Odier, etc."
                                  className="mt-2 text-lg h-14"
                                  required
                                />
                              </motion.div>
                            )}

                            <div>
                              <Input
                                placeholder="IBAN (CH...)"
                                value={data.ibanEntreprise || ""}
                                onChange={(e) => {
                                  const formatted = formatIBAN(e.target.value);
                                  setData({ ...data, ibanEntreprise: formatted });
                                }}
                                className="text-lg h-14"
                              />
                              {data.ibanEntreprise && getIBANError(data.ibanEntreprise) && (
                                <p className="text-sm text-destructive mt-2">
                                  {getIBANError(data.ibanEntreprise)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Étape 2: Email et Téléphone */}
                {currentStep === 2 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Comment vous contacter ?
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="email" className="text-lg">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={data.email}
                          onChange={(e) => setData({ ...data, email: e.target.value })}
                          placeholder="jean.dupont@example.com"
                          className="mt-2 text-lg h-14"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="telMobile" className="text-lg">Téléphone *</Label>
                        <Input
                          id="telMobile"
                          type="tel"
                          value={data.telMobile}
                          onChange={(e) => setData({ ...data, telMobile: e.target.value })}
                          placeholder="+41 79 123 45 67"
                          className="mt-2 text-lg h-14"
                          onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Étapes 3-7 : À venir */}
                {/* Étape 3: Situation personnelle (PRIVÉ uniquement) */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Votre situation personnelle
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Ces informations nous aident à mieux vous conseiller
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="dateNaissance" className="text-lg">Date de naissance *</Label>
                        <Input
                          id="dateNaissance"
                          type="date"
                          value={data.dateNaissance}
                          onChange={(e) => setData({ ...data, dateNaissance: e.target.value })}
                          className="mt-2 text-lg h-14"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="statutProfessionnel" className="text-lg">Statut professionnel *</Label>
                        <Select value={data.statutProfessionnel} onValueChange={(value) => setData({ ...data, statutProfessionnel: value as any })}>
                          <SelectTrigger className="mt-2 text-lg h-14">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Employé(e)">Employé(e)</SelectItem>
                            <SelectItem value="Indépendant(e)">Indépendant(e)</SelectItem>
                            <SelectItem value="Retraité(e)">Retraité(e)</SelectItem>
                            <SelectItem value="Sans Emploi">Sans Emploi</SelectItem>
                            <SelectItem value="Au chômage">Au chômage</SelectItem>
                            <SelectItem value="Ai">AI</SelectItem>
                            <SelectItem value="Etudiant(e)">Étudiant(e)</SelectItem>
                            <SelectItem value="Enfant">Enfant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Champ Profession (conditionnel) */}
                      {(data.statutProfessionnel === "Employé(e)" || data.statutProfessionnel === "Indépendant(e)") && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Label htmlFor="profession" className="text-lg">Profession *</Label>
                          <Input
                            id="profession"
                            value={data.profession}
                            onChange={(e) => setData({ ...data, profession: e.target.value })}
                            placeholder="Ex: Comptable, Ingénieur, etc."
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>
                      )}

                      {/* Champ Employeur (conditionnel pour Employé(e) uniquement) */}
                      {data.statutProfessionnel === "Employé(e)" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Label htmlFor="employeur" className="text-lg">Employeur *</Label>
                          <Input
                            id="employeur"
                            value={data.employeur}
                            onChange={(e) => setData({ ...data, employeur: e.target.value })}
                            placeholder="Ex: WIN WIN Finance Group"
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>
                      )}

                      {/* Champ Taux d'activité (conditionnel pour Employé(e) ET Indépendant(e)) */}
                      {(data.statutProfessionnel === "Employé(e)" || data.statutProfessionnel === "Indépendant(e)") && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Label htmlFor="tauxActivite" className="text-lg">Taux d'activité *</Label>
                          <Select 
                            value={data.tauxActivite} 
                            onValueChange={(value) => {
                              setData({ ...data, tauxActivite: value as any });
                            }}
                          >
                            <SelectTrigger className="mt-2 text-lg h-14">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10 %">10 %</SelectItem>
                              <SelectItem value="20 %">20 %</SelectItem>
                              <SelectItem value="30 %">30 %</SelectItem>
                              <SelectItem value="40 %">40 %</SelectItem>
                              <SelectItem value="50 %">50 %</SelectItem>
                              <SelectItem value="60 %">60 %</SelectItem>
                              <SelectItem value="70 %">70 %</SelectItem>
                              <SelectItem value="80 %">80 %</SelectItem>
                              <SelectItem value="90 %">90 %</SelectItem>
                              <SelectItem value="100 %">100 %</SelectItem>

                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}

                      <div>
                        <Label htmlFor="situationFamiliale" className="text-lg">Situation familiale *</Label>
                        <Select value={data.situationFamiliale} onValueChange={(value) => setData({ ...data, situationFamiliale: value as any })}>
                          <SelectTrigger className="mt-2 text-lg h-14">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Célibataire">Célibataire</SelectItem>
                            <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                            <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                            <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                            <SelectItem value="Concubin(e)">Concubin(e)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="nationalite" className="text-lg">Nationalité *</Label>
                        <Select value={data.nationalite} onValueChange={(value) => setData({ ...data, nationalite: value, permisEtablissement: value === "Suisse" ? "" : data.permisEtablissement })}>
                          <SelectTrigger className="mt-2 text-lg h-14">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Suisse">Suisse</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Allemagne">Allemagne</SelectItem>
                            <SelectItem value="Italie">Italie</SelectItem>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Espagne">Espagne</SelectItem>
                            <SelectItem value="Belgique">Belgique</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Champ "Autre nationalité" (conditionnel) */}
                      {data.nationalite === "Autre" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Label htmlFor="autreNationalite" className="text-lg">Précisez votre nationalité *</Label>
                          <Input
                            id="autreNationalite"
                            value={data.autreNationalite}
                            onChange={(e) => setData({ ...data, autreNationalite: e.target.value })}
                            placeholder="Ex: Brésil, Maroc, etc."
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>
                      )}

                      {/* Champ Permis d'établissement (conditionnel) */}
                      {data.nationalite && data.nationalite !== "Suisse" && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Label htmlFor="permisEtablissement" className="text-lg">Permis d'établissement *</Label>
                          <Select value={data.permisEtablissement} onValueChange={(value) => setData({ ...data, permisEtablissement: value })}>
                            <SelectTrigger className="mt-2 text-lg h-14">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Permis C (autorisation d'établissement)">Permis C (autorisation d'établissement)</SelectItem>
                              <SelectItem value="Permis B (autorisation de séjour)">Permis B (autorisation de séjour)</SelectItem>
                              <SelectItem value="Permis L (autorisation de courte durée)">Permis L (autorisation de courte durée)</SelectItem>
                              <SelectItem value="Permis G (autorisation frontalière)">Permis G (autorisation frontalière)</SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* Étape 4: Adresse entreprise (ENTREPRISE uniquement) */}
                {currentStep === 4 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Où se situe votre entreprise ?
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Adresse du siège social
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="adresseEntreprise" className="text-lg">Adresse et numéro *</Label>
                        <Input
                          id="adresseEntreprise"
                          value={data.adresseEntreprise || ""}
                          onChange={(e) => setData({ ...data, adresseEntreprise: e.target.value })}
                          placeholder="Rue de la Gare 15"
                          className="mt-2 text-lg h-14"
                          autoFocus
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                          <Label htmlFor="npaEntreprise" className="text-lg">NPA *</Label>
                          <Input
                            id="npaEntreprise"
                            type="text"
                            placeholder="2900"
                            value={data.npaEntreprise || ""}
                            onChange={(e) => setData({ ...data, npaEntreprise: e.target.value })}
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                          <Label htmlFor="localiteEntreprise" className="text-lg">Localité *</Label>
                          <Input
                            id="localiteEntreprise"
                            type="text"
                            placeholder="Porrentruy"
                            value={data.localiteEntreprise || ""}
                            onChange={(e) => setData({ ...data, localiteEntreprise: e.target.value })}
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>
                      </div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
                        <Label htmlFor="cantonEntreprise" className="text-lg">Canton *</Label>
                        <Select value={data.canton} onValueChange={(value) => setData({ ...data, canton: value })} required>
                          <SelectTrigger className="mt-2 text-lg h-14">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Appenzell Rhodes-Extérieures">Appenzell Rhodes-Extérieures</SelectItem>
                            <SelectItem value="Appenzell Rhodes-Intérieures">Appenzell Rhodes-Intérieures</SelectItem>
                            <SelectItem value="Argovie">Argovie</SelectItem>
                            <SelectItem value="Bâle_Campagne">Bâle-Campagne</SelectItem>
                            <SelectItem value="Bâle_Ville">Bâle-Ville</SelectItem>
                            <SelectItem value="Berne">Berne</SelectItem>
                            <SelectItem value="Fribourg">Fribourg</SelectItem>
                            <SelectItem value="Genève">Genève</SelectItem>
                            <SelectItem value="Glaris">Glaris</SelectItem>
                            <SelectItem value="Grisons">Grisons</SelectItem>
                            <SelectItem value="Jura">Jura</SelectItem>
                            <SelectItem value="Lucerne">Lucerne</SelectItem>
                            <SelectItem value="Neuchâtel">Neuchâtel</SelectItem>
                            <SelectItem value="Nidwald">Nidwald</SelectItem>
                            <SelectItem value="Obwald">Obwald</SelectItem>
                            <SelectItem value="Saint-Gall">Saint-Gall</SelectItem>
                            <SelectItem value="Schaffhouse">Schaffhouse</SelectItem>
                            <SelectItem value="Schwytz">Schwytz</SelectItem>
                            <SelectItem value="Soleure">Soleure</SelectItem>
                            <SelectItem value="Tessin">Tessin</SelectItem>
                            <SelectItem value="Thurgovie">Thurgovie</SelectItem>
                            <SelectItem value="Uri">Uri</SelectItem>
                            <SelectItem value="Valais">Valais</SelectItem>
                            <SelectItem value="Vaud">Vaud</SelectItem>
                            <SelectItem value="Zoug">Zoug</SelectItem>
                            <SelectItem value="Zurich">Zurich</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>
                    </div>
                  </div>
                )}

                {/* Étape 5: Adresse + Banque (PRIVÉ uniquement) */}
                {currentStep === 5 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Votre adresse
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Où habitez-vous ?
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="adresse" className="text-lg">Adresse et numéro *</Label>
                        <Input
                          id="adresse"
                          value={data.adresse}
                          onChange={(e) => setData({ ...data, adresse: e.target.value })}
                          placeholder="Rue de la Gare 15"
                          className="mt-2 text-lg h-14"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                          <Label htmlFor="npa" className="text-lg">NPA *</Label>
                          <Input
                            id="npa"
                            type="text"
                            placeholder="2900"
                            value={data.npa}
                            onChange={(e) => setData({ ...data, npa: e.target.value })}
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                          <Label htmlFor="localite" className="text-lg">Localité *</Label>
                          <Input
                            id="localite"
                            type="text"
                            placeholder="Porrentruy"
                            value={data.localite}
                            onChange={(e) => setData({ ...data, localite: e.target.value })}
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </motion.div>
                      </div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4">
                        <Label htmlFor="canton" className="text-lg">Canton *</Label>
                        <Select value={data.canton} onValueChange={(value) => setData({ ...data, canton: value })} required>
                          <SelectTrigger className="mt-2 text-lg h-14">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Appenzell Rhodes-Extérieures">Appenzell Rhodes-Extérieures</SelectItem>
                            <SelectItem value="Appenzell Rhodes-Intérieures">Appenzell Rhodes-Intérieures</SelectItem>
                            <SelectItem value="Argovie">Argovie</SelectItem>
                            <SelectItem value="Bâle_Campagne">Bâle-Campagne</SelectItem>
                            <SelectItem value="Bâle_Ville">Bâle-Ville</SelectItem>
                            <SelectItem value="Berne">Berne</SelectItem>
                            <SelectItem value="Fribourg">Fribourg</SelectItem>
                            <SelectItem value="Genève">Genève</SelectItem>
                            <SelectItem value="Glaris">Glaris</SelectItem>
                            <SelectItem value="Grisons">Grisons</SelectItem>
                            <SelectItem value="Jura">Jura</SelectItem>
                            <SelectItem value="Lucerne">Lucerne</SelectItem>
                            <SelectItem value="Neuchâtel">Neuchâtel</SelectItem>
                            <SelectItem value="Nidwald">Nidwald</SelectItem>
                            <SelectItem value="Obwald">Obwald</SelectItem>
                            <SelectItem value="Saint-Gall">Saint-Gall</SelectItem>
                            <SelectItem value="Schaffhouse">Schaffhouse</SelectItem>
                            <SelectItem value="Schwytz">Schwytz</SelectItem>
                            <SelectItem value="Soleure">Soleure</SelectItem>
                            <SelectItem value="Tessin">Tessin</SelectItem>
                            <SelectItem value="Thurgovie">Thurgovie</SelectItem>
                            <SelectItem value="Uri">Uri</SelectItem>
                            <SelectItem value="Valais">Valais</SelectItem>
                            <SelectItem value="Vaud">Vaud</SelectItem>
                            <SelectItem value="Zoug">Zoug</SelectItem>
                            <SelectItem value="Zurich">Zurich</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <div className="mt-8 pt-8 border-t border-border">
                        <p className="text-muted-foreground mb-4">
                          Sur quel compte souhaitez-vous recevoir vos prestations en cas de sinistre ?
                        </p>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Coordonnées bancaires
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="banque" className="text-lg">Banque *</Label>
                            <Select value={data.banque} onValueChange={(value) => setData({ ...data, banque: value })}>
                              <SelectTrigger className="mt-2 text-lg h-14">
                                <SelectValue placeholder="Sélectionnez..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UBS SA">UBS SA</SelectItem>
                                <SelectItem value="Crédit Suisse">Crédit Suisse</SelectItem>
                                <SelectItem value="PostFinance">PostFinance</SelectItem>
                                <SelectItem value="Banque RAIFFEISEN">Banque RAIFFEISEN</SelectItem>
                                <SelectItem value="Banque Cantonale Vaudoise (BCV)">Banque Cantonale Vaudoise (BCV)</SelectItem>
                                <SelectItem value="Banque Cantonale Neuchâteloise (BCN)">Banque Cantonale Neuchâteloise (BCN)</SelectItem>
                                <SelectItem value="Banque Cantonale du Jura (BCJ)">Banque Cantonale du Jura (BCJ)</SelectItem>
                                <SelectItem value="Banque Cantonale Bernoise (BCBE)">Banque Cantonale Bernoise (BCBE)</SelectItem>
                                <SelectItem value="Banque Cantonale de Genève (BCGE)">Banque Cantonale de Genève (BCGE)</SelectItem>
                                <SelectItem value="Banque Cantonale du Valais (BCVS)">Banque Cantonale du Valais (BCVS)</SelectItem>
                                <SelectItem value="Banque Cantonale de Zurich (Zürcher Kantonalbank)">Banque Cantonale de Zurich (Zürcher Kantonalbank)</SelectItem>
                                <SelectItem value="Banque Migros">Banque Migros</SelectItem>
                                <SelectItem value="Banque COOP">Banque COOP</SelectItem>
                                <SelectItem value="Banque Cler">Banque Cler</SelectItem>
                                <SelectItem value="Valiant">Valiant</SelectItem>
                                <SelectItem value="Autre">Autre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Champ "Autre banque" (conditionnel) */}
                          {data.banque === "Autre" && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <Label htmlFor="autreBanque" className="text-lg">Précisez le nom de votre banque *</Label>
                              <Input
                                id="autreBanque"
                                value={data.autreBanque}
                                onChange={(e) => setData({ ...data, autreBanque: e.target.value })}
                                placeholder="Ex: Banque Lombard Odier, etc."
                                className="mt-2 text-lg h-14"
                                required
                              />
                            </motion.div>
                          )}

                          <div>
                            <Input
                              placeholder="IBAN (CH...)"
                              value={data.iban}
                              onChange={(e) => {
                                const formatted = formatIBAN(e.target.value);
                                setData({ ...data, iban: formatted });
                              }}
                              className="text-lg h-14"
                              required
                            />
                            {data.iban && getIBANError(data.iban) && (
                              <p className="text-sm text-destructive mt-2">
                                {getIBANError(data.iban)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 6: Upload polices + Checklist */}
                {currentStep === 6 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Vos documents d'assurance
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Cochez les polices que vous souhaitez optimiser
                      </p>
                    </div>

                    {/* Checklist dynamique */}
                    <div className="space-y-3">
                      {(data.typeClient === 'entreprise' ? CHECKLIST_ENTREPRISE : CHECKLIST_PRIVE).map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary/50 cursor-pointer transition-all bg-background"
                        >
                          <Checkbox
                            checked={item.id === "tout" ? 
                              (data.typeClient === 'prive' ? CHECKLIST_PRIVE : CHECKLIST_ENTREPRISE)
                                .filter(i => i.id !== "tout")
                                .every(i => data.polices.some(p => p.typesContrats.includes(i.id)))
                              : data.polices.some(p => p.typesContrats.includes(item.id))}
                            onCheckedChange={(checked) => {
                              if (item.id === "tout") {
                                // Tout sélectionner / désélectionner
                                const checklist = data.typeClient === 'prive' ? CHECKLIST_PRIVE : CHECKLIST_ENTREPRISE;
                                const allIds = checklist.filter(i => i.id !== "tout").map(i => i.id);
                                if (checked) {
                                  // Cocher toutes les polices
                                  const newPolices = allIds.map(id => ({
                                    compagnie: "",
                                    typesContrats: [id],
                                    mode: "plus_tard" as const
                                  }));
                                  setData({ ...data, polices: newPolices });
                                } else {
                                  // Décocher toutes les polices
                                  setData({ ...data, polices: [] });
                                }
                              } else {
                                // Logique normale pour une police individuelle
                                if (checked) {
                                  setData({
                                    ...data,
                                    polices: [...data.polices, {
                                      compagnie: "",
                                      typesContrats: [item.id],
                                      mode: "plus_tard"
                                    }]
                                  });
                                } else {
                                  setData({
                                    ...data,
                                    polices: data.polices.filter(p => !p.typesContrats.includes(item.id))
                                  });
                                }
                              }
                            }}
                          />
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-lg font-medium flex-1">{item.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        💡 <strong>Astuce :</strong> Vous pourrez télécharger vos polices après la signature du mandat.
                      </p>
                    </div>
                  </div>
                )}

                {/* Étape 7: Récapitulatif */}
                {currentStep === 7 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Récapitulatif
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Vérifiez vos informations avant de continuer
                      </p>
                    </div>

                    <div className="space-y-6 text-left">
                      {/* Identité */}
                      <div className="p-6 bg-primary/5 rounded-lg border border-primary/20">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Identité
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {data.typeClient === 'prive' ? (
                            <>
                              <div><span className="text-muted-foreground">Nom :</span> <strong>{data.formuleAppel} {data.prenom} {data.nom}</strong></div>
                              <div><span className="text-muted-foreground">Date de naissance :</span> <strong>{data.dateNaissance ? new Date(data.dateNaissance).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.') : ''}</strong></div>
                              <div><span className="text-muted-foreground">Nationalité :</span> <strong>{data.nationalite}</strong></div>
                              <div><span className="text-muted-foreground">Situation :</span> <strong>{data.situationFamiliale}</strong></div>
                            </>
                          ) : (
                            <>
                              <div><span className="text-muted-foreground">Entreprise :</span> <strong>{data.nomEntreprise}</strong></div>
                              <div><span className="text-muted-foreground">Forme juridique :</span> <strong>{data.formeJuridique}</strong></div>
                              <div><span className="text-muted-foreground">Employés :</span> <strong>{data.nombreEmployes}</strong></div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="p-6 bg-accent/5 rounded-lg border border-accent/20">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-accent" />
                          Contact
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div><span className="text-muted-foreground">Email :</span> <strong>{data.email}</strong></div>
                          <div><span className="text-muted-foreground">Téléphone :</span> <strong>{data.telMobile}</strong></div>
                        </div>
                      </div>

                      {/* Adresse */}
                      <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          Adresse
                        </h3>
                        <div className="text-sm">
                          {data.typeClient === 'prive' ? (
                            <p><strong>{data.adresse}, {data.npa} {data.localite}</strong></p>
                          ) : (
                            <p><strong>{data.adresseEntreprise}, {data.npaEntreprise} {data.localiteEntreprise}</strong></p>
                          )}
                        </div>
                      </div>

                      {/* Polices */}
                      <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          Polices à optimiser
                        </h3>
                        <div className="text-sm">
                          {data.polices.length > 0 ? (
                            <p><strong>{data.polices.length} police(s) sélectionnée(s)</strong></p>
                          ) : (
                            <p className="text-muted-foreground">Aucune police sélectionnée</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSubmit} className="w-full mt-8" size="lg">
                      Enregistrer le dossier
                      <Check className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-8 border-t border-border">
                  {currentStep > 1 && (
                    <Button
                      onClick={prevStep}
                      variant="outline"
                      size="lg"
                      className="text-lg"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Précédent
                    </Button>
                  )}
                  <div className="flex-1" />
                  {currentStep < totalSteps && (
                    <Button
                      onClick={nextStep}
                      size="lg"
                      className="text-lg"
                    >
                      Suivant
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
