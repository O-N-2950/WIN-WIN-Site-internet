import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { useState, useEffect } from "react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { useLocation } from "wouter";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Sparkles,
  Building2,
  User,
  Users,
  MapPin,
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Shield,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PoliceModal from "@/components/PoliceModal";
import { trpc } from "@/lib/trpc";

// Types de contrats (46 options groupés par catégorie)
const TYPES_CONTRATS_GROUPED = {
  "Santé & Prévoyance": [
    "LAMal (base obligatoire)",
    "LCA (complémentaires)",
    "IJM (perte de gain MALADIE)",
    "LAA",
    "LAA Complémentaire",
    "LPP",
    "Libre Passage LPP",
    "Maladie et Accident de l'indépendant(e)",
    "Appareils auditifs",
  ],
  "Vie & Épargne": [
    "Assurance VIE 3a (déductible)",
    "Assurance VIE 3b (libre)",
    "Compte 3a",
    "Assurance en cas de décès",
    "Plan de versement",
  ],
  "Patrimoine": [
    "Ménage",
    "Incendie et dommage naturel Bâtiment",
    "Dégât d'eau bâtiment",
    "Incendie et dommage naturel Ménage",
    "RC immeuble",
    "Perte de revenus locatifs",
    "Casco ménage",
    "Garantie de loyer",
    "Photovoltaïque",
    "Garantie de Construction/Ouvrage",
    "ART et collections",
  ],
  "Véhicules": [
    "Véhicule",
    "Vélos",
    "Assistance / Dépannage",
    "Bateau",
    "Mobilhome / Caravane",
    "Aéronef",
  ],
  "Entreprise": [
    "RC Professionnelle",
    "COMMERCE",
    "Cautions et garanties",
    "Transport",
    "Cyberassurance",
  ],
  "Protection & Divers": [
    "RC Privée",
    "Protection Juridique",
    "Électronique",
    "Téléphones mobiles et smartphones",
    "Montres",
    "Animaux",
    "RC Locataire de chevaux",
    "Voyage/Annulation/Assistance",
    "AVS",
  ],
};

// Compagnies d'assurance suisses
const COMPAGNIES = [
  "ASSURA",
  "AXA",
  "AXA-ARAG",
  "Allianz",
  "Baloise",
  "Concordia",
  "Coop",
  "CSS",
  "Dextra",
  "Emilia",
  "Emmental",
  "Generali",
  "Groupe Mutuel",
  "Helvetia",
  "Helsana",
  "KPT",
  "La Mobilière",
  "Sanitas",
  "Swica",
  "Swiss Life",
  "Sympany",
  "Vaudoise",
  "Visana",
  "Zurich",
  "Autre compagnie",
];

// Composant dropdown Nationalité avec données depuis Airtable
function NationaliteDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { data: nationalitesData, isLoading } = trpc.airtable.getNationalites.useQuery();
  
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="mt-2 text-lg h-14">
        <SelectValue placeholder="Sélectionnez votre nationalité" />
      </SelectTrigger>
      <SelectContent>
        {isLoading ? (
          <SelectItem value="loading" disabled>Chargement...</SelectItem>
        ) : (
          nationalitesData?.nationalites.map((nat) => (
            <SelectItem key={nat} value={nat}>
              {nat}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

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
  tauxActivite: "10 %" | "20 %" | "30 %" | "40 %" | "50 %" | "60 %" | "70 %" | "80 %" | "90 %" | "100 %" | "150 %" | "";
  situationFamiliale: "Célibataire" | "Marié(e)" | "Divorcé(e)" | "Veuf/Veuve" | "Concubin(e)" | "";
  nationalite: string;
  permisEtablissement: string;
  banque: string;
  iban: string;
  typeClient: "prive" | "entreprise" | "";
  
  // Données privé
  adresse: string;
  npa: string;
  localite: string;
  polices: Police[];
  
  // Données entreprise (si typeClient = "entreprise")
  nomEntreprise?: string;
  formeJuridique?: string;
  nombreEmployes?: number;
  adresseEntreprise?: string;
  npaEntreprise?: string;
  localiteEntreprise?: string;
  banqueEntreprise?: string;
  ibanEntreprise?: string;
}

export default function Questionnaire() {
  const [, navigate] = useLocation();
  const { workflow, updateWorkflow } = useWorkflow();
  
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const totalSteps = 7;
  
  const [data, setData] = useState<QuestionnaireData>({
    prenom: "",
    nom: "",
    email: workflow.clientEmail || "",
    telMobile: "",
    dateNaissance: "",
    formuleAppel: "",
    statutProfessionnel: "",
    profession: "",
    employeur: "",
    tauxActivite: "",
    situationFamiliale: "",
    nationalite: "",
    permisEtablissement: "",
    banque: "",
    iban: "",
    typeClient: "",
    adresse: workflow.clientAddress || "",
    npa: "",
    localite: "",
    polices: [],
    
    // Entreprise
    nomEntreprise: "",
    formeJuridique: "",
    nombreEmployes: 0,
    adresseEntreprise: "",
    npaEntreprise: "",
    localiteEntreprise: "",
    banqueEntreprise: "",
    ibanEntreprise: "",
  });

  const [currentPoliceIndex, setCurrentPoliceIndex] = useState(0);
  const [showPoliceForm, setShowPoliceForm] = useState(false);

  // Logger les changements de email et telMobile pour debug
  useEffect(() => {
    console.log('📧 Email changed:', data.email);
    console.log('📱 TelMobile changed:', data.telMobile);
  }, [data.email, data.telMobile]);

  // Sauvegarde automatique
  useEffect(() => {
    if (!showIntro) {
      const timer = setTimeout(() => {
        // Construire l'adresse en filtrant les champs vides
        const addressParts = [
          data.adresse,
          [data.npa, data.localite].filter(Boolean).join(' ')
        ].filter(Boolean);
        const clientAddress = addressParts.length > 0 ? addressParts.join(', ') : '';
        
        updateWorkflow({
          clientName: `${data.prenom} ${data.nom}`,
          clientEmail: data.email,
          clientType: data.typeClient === "prive" ? "prive" : "entreprise",
          clientAddress,
          clientEmployeeCount: data.nombreEmployes,
          questionnaireData: data,
        });
        toast.success("✓ Sauvegarde automatique", { duration: 1000 });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [data, showIntro]);

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

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        // Étape 1 : Type de client (Particulier ou Entreprise)
        if (!data.typeClient) {
          toast.error("Veuillez sélectionner votre type de client");
          return false;
        }
        // Si entreprise, vérifier les champs obligatoires
        if (data.typeClient === "entreprise") {
          if (!data.nomEntreprise) {
            toast.error("Veuillez renseigner le nom de l'entreprise");
            return false;
          }
          if (!data.formeJuridique) {
            toast.error("Veuillez sélectionner la forme juridique");
            return false;
          }
          if (data.nombreEmployes === 0 || data.nombreEmployes === undefined) {
            toast.error("Veuillez indiquer le nombre d'employés");
            return false;
          }
        }
        // Si particulier, vérifier formule d'appel + nom + prénom
        if (data.typeClient === "prive") {
          if (!data.formuleAppel) {
            toast.error("Veuillez sélectionner votre formule d'appel");
            return false;
          }
          if (!data.prenom || !data.nom) {
            toast.error("Veuillez renseigner votre nom et prénom");
            return false;
          }
        }
        return true;
      case 2:
        // Étape 2 : Email et Téléphone
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
        // Étape 3 : Situation (uniquement pour particuliers)
        if (data.typeClient === "prive") {
          if (!data.dateNaissance || !data.situationFamiliale || !data.statutProfessionnel || !data.nationalite) {
            toast.error("Veuillez compléter tous les champs obligatoires");
            return false;
          }
          // Validation conditionnelle pour les employés
          if (data.statutProfessionnel === 'Employé(e)') {
            if (!data.profession || !data.employeur || !data.tauxActivite) {
              toast.error("Veuillez compléter votre profession, employeur et taux d'activité");
              return false;
            }
          }
          // Validation conditionnelle pour les indépendants
          if (data.statutProfessionnel === 'Indépendant(e)') {
            if (!data.profession) {
              toast.error("Veuillez compléter votre profession");
              return false;
            }
          }
        }
        return true;
      case 4:
        // Étape 4 : Adresse + Coordonnées bancaires
        if (!data.adresse || !data.npa || !data.localite) {
          toast.error("Veuillez compléter votre adresse");
          return false;
        }
        // Coordonnées bancaires (particulier uniquement, entreprise les a déjà à l'étape 1)
        if (data.typeClient === "prive") {
          if (!data.banque || !data.iban) {
            toast.error("Veuillez compléter vos coordonnées bancaires");
            return false;
          }
        }
        return true;
      case 5:
        if (!data.adresse || !data.npa || !data.localite) {
          toast.error("Veuillez compléter votre adresse");
          return false;
        }
        if (!data.banque || !data.iban) {
          toast.error("Veuillez compléter vos coordonnées bancaires");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleAddPolice = () => {
    setData({
      ...data,
      polices: [
        ...data.polices,
        {
          compagnie: "",
          typesContrats: [],
          mode: "upload",
        },
      ],
    });
    setCurrentPoliceIndex(data.polices.length);
    setShowPoliceForm(true);
  };

  const handleUpdatePolice = (index: number, updates: Partial<Police>) => {
    const newPolices = [...data.polices];
    newPolices[index] = { ...newPolices[index], ...updates };
    setData({ ...data, polices: newPolices });
  };

  const handleRemovePolice = (index: number) => {
    const newPolices = data.polices.filter((_, i) => i !== index);
    setData({ ...data, polices: newPolices });
    toast.success("Police supprimée");
  };

  const handleFileUpload = (index: number, file: File) => {
    handleUpdatePolice(index, {
      pdfFile: file,
      pdfFileName: file.name,
    });
    toast.success(`📄 ${file.name} uploadé avec succès !`);
    
    // TODO: Appeler l'API OCR ici
    setTimeout(() => {
      toast.success("✨ Analyse terminée !");
    }, 2000);
  };

  const handleSubmit = () => {
    updateWorkflow({
      clientName: `${data.prenom} ${data.nom}`,
      clientEmail: data.email,
      clientType: data.typeClient === "prive" ? "prive" : "entreprise",
      clientAddress: `${data.adresse}, ${data.npa} ${data.localite}`,
      clientEmployeeCount: data.nombreEmployes,
      questionnaireData: data,
      questionnaireCompleted: true,
    });
    
    toast.success("🎉 Questionnaire complété !");
    navigate("/signature");
  };

  const progress = (currentStep / totalSteps) * 100;

  // Intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div 
          className="fixed inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, hsl(203, 55%, 42%) 0%, hsl(205, 40%, 69%) 50%, hsl(203, 55%, 42%) 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient 15s ease infinite',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="container max-w-4xl"
        >
          <Card className="p-12 bg-white/95 backdrop-blur-sm shadow-2xl">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto"
              >
                <Sparkles className="h-12 w-12 text-white" />
              </motion.div>

              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Devenez Client WIN WIN
                </h1>
                <p className="text-xl text-muted-foreground">
                  Libérez-vous de la gestion de vos assurances. Nous nous occupons de tout pour vous.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 py-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Clock className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-semibold">Gestion Complète</h3>
                  <p className="text-sm text-muted-foreground">Nous centralisons et optimisons tous vos contrats</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Shield className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-semibold">Accompagnement Proactif</h3>
                  <p className="text-sm text-muted-foreground">Votre conseiller dédié anticipe vos besoins</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Sparkles className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-semibold">Défense de Vos Intérêts</h3>
                  <p className="text-sm text-muted-foreground">Nous gérons vos sinistres et négocions pour vous</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => setShowIntro(false)}
                  className="group px-12 py-7 text-lg font-bold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary via-primary to-[#D4AF37] hover:from-[#D4AF37] hover:via-primary hover:to-primary"
                >
                  Commencer maintenant
                  <Zap className="ml-3 w-6 h-6 group-hover:rotate-12 group-hover:scale-125 transition-all duration-300" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  À partir de CHF 185.-/an • Résiliable annuellement • Satisfaction garantie
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fond gradient animé */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(135deg, 
            hsl(203, 55%, ${42 + currentStep * 2}%) 0%, 
            hsl(205, 40%, ${69 - currentStep}%) 50%, 
            hsl(203, 55%, ${42 + currentStep * 2}%) 100%)`,
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
        }}
      />

      {/* Particules flottantes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-white/10 backdrop-blur-sm z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-primary to-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

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
                {/* Étape 1: Prénom et Nom */}
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bonjour ! 👋
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Commençons par faire connaissance
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="formuleAppel" className="text-lg">Formule d'appel *</Label>
                        <Select value={data.formuleAppel} onValueChange={(value) => setData({ ...data, formuleAppel: value as "Monsieur" | "Madame" | "" })}>
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
                        <Label htmlFor="prenom" className="text-lg">Prénom</Label>
                        <Input
                          id="prenom"
                          value={data.prenom}
                          onChange={(e) => setData({ ...data, prenom: e.target.value })}
                          placeholder="Jean"
                          className="mt-2 text-lg h-14"
                          onKeyPress={(e) => e.key === 'Enter' && document.getElementById('nom')?.focus()}
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
                    </div>
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

                {/* Étape 3: Situation personnelle complète */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Votre situation
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Pour adapter nos conseils à votre profil
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
                          onBlur={(e) => setData({ ...data, dateNaissance: e.target.value })}
                          onInput={(e) => setData({ ...data, dateNaissance: (e.target as HTMLInputElement).value })}
                          className="mt-2 text-lg h-14"
                          autoFocus
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="statutProfessionnel" className="text-lg">Statut professionnel *</Label>
                        <Select value={data.statutProfessionnel} onValueChange={(value) => {
                          const newData = { ...data, statutProfessionnel: value as any };
                          // Auto-fill tauxActivite pour Indépendant
                          if (value === "Indépendant(e)") {
                            newData.tauxActivite = "150 %";
                          }
                          // Reset champs conditionnels si statut change
                          if (!["Employé(e)", "Indépendant(e)"].includes(value)) {
                            newData.profession = "";
                            newData.employeur = "";
                            newData.tauxActivite = "";
                          }
                          setData(newData);
                        }}>
                          <SelectTrigger className="mt-2 text-lg h-14">
                            <SelectValue placeholder="Sélectionnez..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Employé(e)">Employé(e)</SelectItem>
                            <SelectItem value="Indépendant(e)">Indépendant(e)</SelectItem>
                            <SelectItem value="Retraité(e)">Retraité(e)</SelectItem>
                            <SelectItem value="Sans Emploi">Sans Emploi</SelectItem>
                            <SelectItem value="Au chômage">Au chômage</SelectItem>
                            <SelectItem value="Ai">Ai</SelectItem>
                            <SelectItem value="Etudiant(e)">Etudiant(e)</SelectItem>
                            <SelectItem value="Enfant">Enfant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Profession (si Employé OU Indépendant) */}
                      {(data.statutProfessionnel === "Employé(e)" || data.statutProfessionnel === "Indépendant(e)") && (
                        <div>
                          <Label htmlFor="profession" className="text-lg">Profession *</Label>
                          <Input
                            id="profession"
                            type="text"
                            value={data.profession}
                            onChange={(e) => setData({ ...data, profession: e.target.value })}
                            placeholder="Ex: Comptable, Ingénieur, Consultant..."
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </div>
                      )}

                      {/* Employeur (si Employé uniquement) */}
                      {data.statutProfessionnel === "Employé(e)" && (
                        <div>
                          <Label htmlFor="employeur" className="text-lg">Employeur *</Label>
                          <Input
                            id="employeur"
                            type="text"
                            value={data.employeur}
                            onChange={(e) => setData({ ...data, employeur: e.target.value })}
                            placeholder="Nom de l'entreprise"
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </div>
                      )}

                      {/* Taux d'activité (si Employé uniquement) */}
                      {data.statutProfessionnel === "Employé(e)" && (
                        <div>
                          <Label htmlFor="tauxActivite" className="text-lg">Taux d'activité *</Label>
                          <Select value={data.tauxActivite} onValueChange={(value) => setData({ ...data, tauxActivite: value as any })}>
                            <SelectTrigger className="mt-2 text-lg h-14">
                              <SelectValue placeholder="Sélectionnez..." />
                            </SelectTrigger>
                            <SelectContent>
                              {["10 %", "20 %", "30 %", "40 %", "50 %", "60 %", "70 %", "80 %", "90 %", "100 %"].map(taux => (
                                <SelectItem key={taux} value={taux}>{taux}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Message humoristique pour Indépendant */}
                      {data.statutProfessionnel === "Indépendant(e)" && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
                            <span className="text-2xl">😉</span>
                            <span>En tant qu'indépendant, vous travaillez probablement à <strong>150%</strong> !</span>
                          </p>
                        </div>
                      )}

                      <div>
                        <Label className="text-lg mb-4 block">Situation familiale *</Label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { value: "Célibataire", label: "Célibataire" },
                            { value: "Marié(e)", label: "Marié(e)" },
                            { value: "Divorcé(e)", label: "Divorcé(e)" },
                            { value: "Veuf/Veuve", label: "Veuf/Veuve" },
                            { value: "Concubin(e)", label: "Concubin(e)" },
                          ].map((option) => (
                            <motion.button
                              key={option.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setData({ ...data, situationFamiliale: option.value as any })}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                data.situationFamiliale === option.value
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {option.label}
                              {data.situationFamiliale === option.value && (
                                <CheckCircle2 className="ml-2 inline-block w-5 h-5 text-primary" />
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nationalite" className="text-lg">Nationalité *</Label>
                        <NationaliteDropdown
                          value={data.nationalite}
                          onChange={(value) => {
                            const newData = { ...data, nationalite: value };
                            // Reset permis si Suisse
                            if (value.toLowerCase() === "suisse") {
                              newData.permisEtablissement = "";
                            }
                            setData(newData);
                          }}
                        />
                      </div>

                      {/* Permis d'établissement (si nationalité != Suisse) */}
                      {data.nationalite && data.nationalite.toLowerCase() !== "suisse" && (
                        <div>
                          <Label htmlFor="permisEtablissement" className="text-lg">Permis d'établissement *</Label>
                          <Input
                            id="permisEtablissement"
                            type="text"
                            value={data.permisEtablissement}
                            onChange={(e) => setData({ ...data, permisEtablissement: e.target.value })}
                            placeholder="Ex: Permis B, Permis C, Permis L..."
                            className="mt-2 text-lg h-14"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Étape 4: Type de client */}
                {currentStep === 4 && (
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
                        Vous êtes...
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Particulier, entreprise, ou les deux ?
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
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
                          Assurances personnelles et familiales
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
                          Assurances professionnelles et LPP
                        </p>
                        {data.typeClient === "entreprise" && (
                          <CheckCircle2 className="mt-3 mx-auto w-5 h-5 text-primary" />
                        )}
                      </motion.button>


                    </div>

                    {data.typeClient === "entreprise" && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-4">
                        <div>
                          <Label htmlFor="nomEntreprise" className="text-lg">Nom de l'entreprise</Label>
                          <Input
                            id="nomEntreprise"
                            value={data.nomEntreprise || ""}
                            onChange={(e) => setData({ ...data, nomEntreprise: e.target.value })}
                            placeholder="WIN WIN Finance Group"
                            className="mt-2 text-lg h-14"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-lg mb-3 block">Forme juridique</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { value: 'entreprise_individuelle', label: 'Entreprise individuelle', icon: '👤', desc: 'Raison individuelle' },
                              { value: 'sarl', label: 'Sàrl', icon: '🤝', desc: 'Société à responsabilité limitée' },
                              { value: 'sa', label: 'SA', icon: '🏢', desc: 'Société Anonyme' },
                              { value: 'autre', label: 'Autre', icon: '💼', desc: 'Association, Fondation...' },
                            ].map((forme) => (
                              <button
                                key={forme.value}
                                type="button"
                                onClick={() => setData({ ...data, formeJuridique: forme.value })}
                                className={`
                                  p-4 rounded-lg border-2 transition-all duration-200 text-left
                                  hover:border-primary hover:shadow-md
                                  ${data.formeJuridique === forme.value 
                                    ? 'border-primary bg-primary/5 shadow-md' 
                                    : 'border-border bg-background'
                                  }
                                `}
                              >
                                <div className="text-3xl mb-2">{forme.icon}</div>
                                <div className="font-semibold text-base">{forme.label}</div>
                                <div className="text-xs text-muted-foreground mt-1">{forme.desc}</div>
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

                        <div className="mt-8 pt-8 border-t border-border">
                          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" />
                            Coordonnées bancaires de l'entreprise
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="banqueEntreprise" className="text-lg">Banque *</Label>
                              <Input
                                id="banqueEntreprise"
                                value={data.banqueEntreprise || ""}
                                onChange={(e) => setData({ ...data, banqueEntreprise: e.target.value })}
                                placeholder="Ex: UBS, Crédit Suisse, PostFinance..."
                                className="mt-2 text-lg h-14"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="ibanEntreprise" className="text-lg">IBAN *</Label>
                              <Input
                                id="ibanEntreprise"
                                value={data.ibanEntreprise || ""}
                                onChange={(e) => setData({ ...data, ibanEntreprise: e.target.value })}
                                placeholder="CH00 0000 0000 0000 0000 0"
                                className="mt-2 text-lg h-14"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Étape 5: Adresse */}
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
                        Où habitez-vous ?
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Pour le mandat de gestion
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="adresse" className="text-lg">Adresse et numéro *</Label>
                        <Input
                          id="adresse"
                          value={data.adresse}
                          onChange={(e) => setData({ ...data, adresse: e.target.value })}
                          placeholder="Bellevue 7"
                          className="mt-2 text-lg h-14"
                          autoFocus
                          required
                        />
                      </div>

                      <AddressAutocomplete
                        npaValue={data.npa}
                        localiteValue={data.localite}
                        onNpaChange={(value) => setData({ ...data, npa: value })}
                        onLocaliteChange={(value) => setData({ ...data, localite: value })}
                        required
                      />

                      <div className="mt-8 pt-8 border-t border-border">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <Shield className="h-6 w-6 text-primary" />
                          Coordonnées bancaires
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <Label htmlFor="banque" className="text-lg">Banque *</Label>
                            <Input
                              id="banque"
                              value={data.banque}
                              onChange={(e) => setData({ ...data, banque: e.target.value })}
                              placeholder="Ex: UBS, Crédit Suisse, PostFinance..."
                              className="mt-2 text-lg h-14"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="iban" className="text-lg">IBAN *</Label>
                            <Input
                              id="iban"
                              value={data.iban}
                              onChange={(e) => setData({ ...data, iban: e.target.value })}
                              placeholder="CH00 0000 0000 0000 0000 0"
                              className="mt-2 text-lg h-14"
                              onKeyPress={(e) => e.key === 'Enter' && nextStep()}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 6: Polices d'assurance - Intro */}
                {currentStep === 6 && (
                  <div className="space-y-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center mb-8"
                    >
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Vos polices d'assurance actuelles
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Uploadez vos polices d'assurance actuelles pour une analyse complète
                      </p>
                    </div>

                    {data.polices.length === 0 ? (
                      <div className="text-center space-y-6">
                        <p className="text-muted-foreground">
                          Vous n'avez pas encore ajouté de police
                        </p>
                        <Button onClick={handleAddPolice} size="lg" className="group">
                          <Upload className="mr-2 w-5 h-5" />
                          Ajouter ma première police
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          ou passez cette étape si vous n'avez pas de police actuellement
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {data.polices.map((police, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold">
                                  Police #{index + 1}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {police.compagnie || "Non renseignée"}
                                  {police.typesContrats.length > 0 && ` • ${police.typesContrats.length} couverture(s)`}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentPoliceIndex(index);
                                    setShowPoliceForm(true);
                                  }}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemovePolice(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        <Button onClick={handleAddPolice} variant="outline" className="w-full">
                          <Upload className="mr-2 w-5 h-5" />
                          Ajouter une autre police
                        </Button>
                      </div>
                    )}
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

                    <div className="space-y-4 text-left">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Informations personnelles</h4>
                        <p className="text-sm text-muted-foreground">
                          {data.prenom} {data.nom}<br />
                          {data.email}<br />
                          {data.telMobile}
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Situation</h4>
                        <p className="text-sm text-muted-foreground">
                          Né(e) le {data.dateNaissance}<br />
                          {data.situationFamiliale}
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Type de client</h4>
                        <p className="text-sm text-muted-foreground">
                          {data.typeClient === "prive" ? "Particulier" : "Entreprise"}
                          {data.typeClient === "entreprise" && ` (${data.nombreEmployes} employés)`}
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Adresse</h4>
                        <p className="text-sm text-muted-foreground">
                          {data.adresse}<br />
                          {data.npa} {data.localite}
                        </p>
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Polices d'assurance</h4>
                        <p className="text-sm text-muted-foreground">
                          {data.polices.length} police(s) ajoutée(s)
                        </p>
                      </div>
                    </div>

                    <div className="text-center pt-6">
                      <Button onClick={handleSubmit} size="lg" className="group">
                        Continuer vers la signature
                        <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      className="group"
                    >
                      <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      Précédent
                    </Button>
                  )}

                  {currentStep < totalSteps && (
                    <Button
                      onClick={nextStep}
                      className="ml-auto group"
                    >
                      Suivant
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Modal pour ajouter/modifier une police */}
      <PoliceModal
        isOpen={showPoliceForm}
        onClose={() => setShowPoliceForm(false)}
        policeIndex={currentPoliceIndex}
        police={data.polices[currentPoliceIndex]}
        onSave={(police) => {
          const newPolices = [...data.polices];
          newPolices[currentPoliceIndex] = police;
          setData({ ...data, polices: newPolices });
          toast.success("✅ Police enregistrée");
        }}
      />

      {/* Ancien modal - à supprimer */}
      {false && showPoliceForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                Police #{currentPoliceIndex + 1}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPoliceForm(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Upload PDF */}
              <div>
                <Label className="text-lg mb-2 block">Document PDF de la police</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(currentPoliceIndex, file);
                      }
                    }}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {data.polices[currentPoliceIndex]?.pdfFileName || "Cliquez pour uploader"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Nous analyserons votre contrat pour vous proposer les meilleures solutions
                    </p>
                  </label>
                </div>
              </div>

              {/* Compagnie */}
              <div>
                <Label className="text-lg mb-2 block">Compagnie d'assurance</Label>
                <Select
                  value={data.polices[currentPoliceIndex]?.compagnie}
                  onValueChange={(value) => handleUpdatePolice(currentPoliceIndex, { compagnie: value })}
                >
                  <SelectTrigger className="h-14 text-lg">
                    <SelectValue placeholder="Sélectionnez une compagnie" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPAGNIES.map((compagnie) => (
                      <SelectItem key={compagnie} value={compagnie}>
                        {compagnie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {data.polices[currentPoliceIndex]?.compagnie === "Autre compagnie" && (
                  <Input
                    placeholder="Nom de la compagnie"
                    value={data.polices[currentPoliceIndex]?.autreCompagnie || ""}
                    onChange={(e) => handleUpdatePolice(currentPoliceIndex, { autreCompagnie: e.target.value })}
                    className="mt-4 h-14 text-lg"
                  />
                )}
              </div>

              {/* Types de contrats */}
              <div>
                <Label className="text-lg mb-4 block">Types de couvertures</Label>
                <div className="space-y-4 max-h-96 overflow-y-auto p-4 border rounded-lg">
                  {Object.entries(TYPES_CONTRATS_GROUPED).map(([categorie, types]) => (
                    <div key={categorie}>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-2">{categorie}</h4>
                      <div className="space-y-2 ml-4">
                        {types.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={data.polices[currentPoliceIndex]?.typesContrats.includes(type)}
                              onCheckedChange={(checked) => {
                                const currentTypes = data.polices[currentPoliceIndex]?.typesContrats || [];
                                const newTypes = checked
                                  ? [...currentTypes, type]
                                  : currentTypes.filter((t) => t !== type);
                                handleUpdatePolice(currentPoliceIndex, { typesContrats: newTypes });
                              }}
                            />
                            <label
                              htmlFor={`type-${type}`}
                              className="text-sm cursor-pointer"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center space-x-2 pt-4 border-t">
                    <Checkbox
                      id="type-unknown"
                      checked={data.polices[currentPoliceIndex]?.typesContrats.includes("Je ne sais pas")}
                      onCheckedChange={(checked) => {
                        handleUpdatePolice(currentPoliceIndex, { 
                          typesContrats: checked ? ["Je ne sais pas"] : [] 
                        });
                      }}
                    />
                    <label htmlFor="type-unknown" className="text-sm font-medium cursor-pointer">
                      Je ne sais pas exactement
                    </label>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowPoliceForm(false)}
                className="w-full"
                size="lg"
              >
                <Check className="mr-2 w-5 h-5" />
                Valider cette police
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
