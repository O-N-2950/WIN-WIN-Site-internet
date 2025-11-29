import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { 
  Upload, 
  User, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  Sparkles,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


// Types
interface ClientFormData {
  prenom: string;
  nom: string;
  typeClient: 'Privé' | 'Entreprise';
  dateNaissance?: string;
  email: string;
  telMobile: string;
  adresse: string;
  npa: number | '';
  localite: string;
  canton?: string;
  formuleAppel?: 'Monsieur' | 'Madame' | 'Autre';
  situationFamiliale?: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf(ve)' | 'Partenariat enregistré';
  statutProfessionnel?: 'Employé(e)' | 'Indépendant(e)' | 'Retraité(e)' | 'Étudiant(e)' | 'Sans emploi';
  fumeur?: 'oui' | 'non';
  nomEntreprise?: string;
  nombreEmployes?: number;
}

interface ExtractedContract {
  id: string;
  compagnie: string;
  compagnieId?: string;
  typeContrat: string;
  typeContratId?: string;
  numeroPolice: string;
  montantPrime: number;
  frequencePaiement: 'Annuel' | 'Semestriel' | 'Trimestriel' | 'Mensuel';
  primeAnnuelle: number;
  dateDebut: string;
  dateFin: string;
  confiance: number;
  fileName: string;
}

const STEPS = [
  { id: 1, title: 'Informations', icon: User },
  { id: 2, title: 'Polices', icon: Upload },
  { id: 3, title: 'Analyse', icon: Sparkles },
  { id: 4, title: 'Validation', icon: CheckCircle2 },
  { id: 5, title: 'Récapitulatif', icon: FileText },
];

export default function Inscription() {
  const [location, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientData, setClientData] = useState<ClientFormData>({
    prenom: '',
    nom: '',
    typeClient: 'Privé',
    email: '',
    telMobile: '',
    adresse: '',
    npa: '',
    localite: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedContracts, setExtractedContracts] = useState<ExtractedContract[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // tRPC queries
  const { data: compagnies } = trpc.airtable.getCompanies.useQuery();
  const { data: typesContratsData } = trpc.airtable.getContractTypes.useQuery();
  const typesContrats = typesContratsData?.contractTypes || [];
  const createClientMutation = trpc.customers.create.useMutation();
  const createContractsMutation = trpc.contract.createMultiple.useMutation();

  // Calculer la prime annuelle selon la fréquence
  const calculerPrimeAnnuelle = (montant: number, frequence: string): number => {
    switch (frequence) {
      case 'Annuel':
        return montant;
      case 'Semestriel':
        return montant * 2;
      case 'Trimestriel':
        return montant * 4;
      case 'Mensuel':
        return montant * 12;
      default:
        return montant;
    }
  };

  // Gérer l'upload de fichiers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    toast.success(`${files.length} fichier(s) ajouté(s)`);
  };

  // Analyser les polices avec OCR
  const analyzePolices = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Veuillez uploader au moins une police d\'assurance');
      return;
    }

    setIsAnalyzing(true);
    setCurrentStep(3);

    try {
      // TODO: Implémenter l'appel OCR réel
      // Pour l'instant, simulation avec timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Données simulées pour démonstration
      const mockContracts: ExtractedContract[] = uploadedFiles.map((file, index) => ({
        id: `contract-${index}`,
        compagnie: 'Emmental Assurance',
        typeContrat: 'RC Privée',
        numeroPolice: `${Math.floor(Math.random() * 100000)}`,
        montantPrime: 350,
        frequencePaiement: 'Mensuel',
        primeAnnuelle: 4200,
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        confiance: 0.92,
        fileName: file.name,
      }));

      setExtractedContracts(mockContracts);
      setCurrentStep(4);
      toast.success('Analyse terminée ! Vérifiez les données extraites.');
    } catch (error) {
      toast.error('Erreur lors de l\'analyse OCR');
      setCurrentStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 1. Créer le client (statut "Prospect")
      const clientResult = await createClientMutation.mutateAsync({
        ...clientData,
        npa: Number(clientData.npa),
      });

      // 2. Créer les contrats
      await createContractsMutation.mutateAsync({
        clientId: clientResult.clientId,
        contracts: extractedContracts.map((contract) => ({
          numeroContrat: contract.numeroPolice,
          typesContrats: [contract.typeContratId || contract.typeContrat],
          montantPrime: contract.montantPrime,
          modePaiement: contract.frequencePaiement,
          dateDebut: contract.dateDebut,
          dateFin: contract.dateFin,
          compagnieId: contract.compagnieId,
        })),
      });

      toast.success('Inscription réussie ! Passons à la signature.');
      
      // Rediriger vers la page de signature
      setLocation('/signature');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rendu des étapes
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepInformations clientData={clientData} setClientData={setClientData} />;
      case 2:
        return (
          <StepUpload
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            handleFileUpload={handleFileUpload}
          />
        );
      case 3:
        return <StepAnalyzing />;
      case 4:
        return (
          <StepValidation
            contracts={extractedContracts}
            setContracts={setExtractedContracts}
            compagnies={compagnies?.companies || []}
            typesContrats={typesContrats}
            calculerPrimeAnnuelle={calculerPrimeAnnuelle}
          />
        );
      case 5:
        return (
          <StepRecapitulatif
            clientData={clientData}
            contracts={extractedContracts}
          />
        );
      default:
        return null;
    }
  };

  // Navigation
  const goNext = () => {
    if (currentStep === 2) {
      analyzePolices();
    } else if (currentStep === 5) {
      handleSubmit();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const goBack = () => {
    if (currentStep === 3 && isAnalyzing) return;
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return (
          clientData.prenom &&
          clientData.nom &&
          clientData.email &&
          clientData.telMobile &&
          clientData.adresse &&
          clientData.npa &&
          clientData.localite
        );
      case 2:
        return uploadedFiles.length > 0;
      case 3:
        return false; // En cours d'analyse
      case 4:
        return extractedContracts.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4">
      <div className="container max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">
            Inscription WIN WIN
          </h1>
          <p className="text-muted-foreground">
            Libérez-vous de la gestion de vos assurances en quelques minutes
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / 5) * 100} className="h-2 mb-4" />
          <div className="flex justify-between">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? 'border-primary bg-primary text-white scale-110'
                        : isCompleted
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-muted-foreground bg-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={goBack}
            disabled={currentStep === 1 || isAnalyzing || isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>

          <Button
            onClick={goNext}
            disabled={!canGoNext() || isAnalyzing || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Inscription...
              </>
            ) : currentStep === 5 ? (
              'Finaliser l\'inscription'
            ) : (
              <>
                Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Composants pour chaque étape
function StepInformations({
  clientData,
  setClientData,
}: {
  clientData: ClientFormData;
  setClientData: React.Dispatch<React.SetStateAction<ClientFormData>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Vos Informations
        </CardTitle>
        <CardDescription>
          Commençons par quelques informations de base
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="prenom">Prénom *</Label>
            <Input
              id="prenom"
              value={clientData.prenom}
              onChange={(e) => setClientData({ ...clientData, prenom: e.target.value })}
              placeholder="Jean"
            />
          </div>
          <div>
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={clientData.nom}
              onChange={(e) => setClientData({ ...clientData, nom: e.target.value })}
              placeholder="Dupont"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                className="pl-10"
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                placeholder="jean.dupont@example.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="telMobile">Téléphone Mobile *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                id="telMobile"
                type="tel"
                className="pl-10"
                value={clientData.telMobile}
                onChange={(e) => setClientData({ ...clientData, telMobile: e.target.value })}
                placeholder="+41 79 123 45 67"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="adresse">Adresse *</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="adresse"
              className="pl-10"
              value={clientData.adresse}
              onChange={(e) => setClientData({ ...clientData, adresse: e.target.value })}
              placeholder="Rue de la Paix 15"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="npa">NPA *</Label>
            <Input
              id="npa"
              type="number"
              value={clientData.npa}
              onChange={(e) => setClientData({ ...clientData, npa: e.target.value ? Number(e.target.value) : '' })}
              placeholder="2900"
            />
          </div>
          <div>
            <Label htmlFor="localite">Localité *</Label>
            <Input
              id="localite"
              value={clientData.localite}
              onChange={(e) => setClientData({ ...clientData, localite: e.target.value })}
              placeholder="Porrentruy"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="dateNaissance">Date de Naissance (optionnel)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="dateNaissance"
              type="date"
              className="pl-10"
              value={clientData.dateNaissance || ''}
              onChange={(e) => setClientData({ ...clientData, dateNaissance: e.target.value })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StepUpload({
  uploadedFiles,
  setUploadedFiles,
  handleFileUpload,
}: {
  uploadedFiles: File[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Vos Polices d'Assurance
        </CardTitle>
        <CardDescription>
          Uploadez vos polices (PDF, JPG, PNG) pour une analyse automatique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-12 text-center hover:border-primary/60 transition-colors cursor-pointer">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium mb-2">
              Glissez vos polices ici
            </p>
            <p className="text-sm text-muted-foreground">
              ou cliquez pour parcourir (PDF, JPG, PNG)
            </p>
          </label>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Fichiers uploadés ({uploadedFiles.length})</h3>
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  Supprimer
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StepAnalyzing() {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-6"
        >
          <Sparkles className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2">Analyse en cours...</h2>
        <p className="text-muted-foreground">
          Notre IA extrait automatiquement les informations de vos polices
        </p>
      </CardContent>
    </Card>
  );
}

function StepValidation({
  contracts,
  setContracts,
  compagnies,
  typesContrats,
  calculerPrimeAnnuelle,
}: {
  contracts: ExtractedContract[];
  setContracts: React.Dispatch<React.SetStateAction<ExtractedContract[]>>;
  compagnies: string[];
  typesContrats: string[];
  calculerPrimeAnnuelle: (montant: number, frequence: string) => number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Validation des Contrats
        </CardTitle>
        <CardDescription>
          Vérifiez les données extraites et corrigez si nécessaire
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {contracts.map((contract, index) => (
          <Card key={contract.id} className="border-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Contrat {index + 1}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Confiance: {Math.round(contract.confiance * 100)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Compagnie</Label>
                  <Input value={contract.compagnie} readOnly />
                </div>
                <div>
                  <Label>Type de Contrat</Label>
                  <Input value={contract.typeContrat} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>N° de Police</Label>
                  <Input value={contract.numeroPolice} readOnly />
                </div>
                <div>
                  <Label>Fréquence de Paiement</Label>
                  <Input value={contract.frequencePaiement} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Montant Payé</Label>
                  <Input value={`${contract.montantPrime} CHF`} readOnly />
                </div>
                <div>
                  <Label>Prime Annuelle (calculée)</Label>
                  <Input
                    value={`${contract.primeAnnuelle} CHF`}
                    readOnly
                    className="font-bold text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date Début</Label>
                  <Input type="date" value={contract.dateDebut} readOnly />
                </div>
                <div>
                  <Label>Date Fin</Label>
                  <Input type="date" value={contract.dateFin} readOnly />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function StepRecapitulatif({
  clientData,
  contracts,
}: {
  clientData: ClientFormData;
  contracts: ExtractedContract[];
}) {
  const totalPrimeAnnuelle = contracts.reduce((sum, c) => sum + c.primeAnnuelle, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Récapitulatif
        </CardTitle>
        <CardDescription>
          Vérifiez vos informations avant de finaliser
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Informations Client</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Nom complet:</span>
            <span className="font-medium">{clientData.prenom} {clientData.nom}</span>
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{clientData.email}</span>
            <span className="text-muted-foreground">Téléphone:</span>
            <span className="font-medium">{clientData.telMobile}</span>
            <span className="text-muted-foreground">Adresse:</span>
            <span className="font-medium">
              {clientData.adresse}, {clientData.npa} {clientData.localite}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contrats d'Assurance ({contracts.length})</h3>
          <div className="space-y-2">
            {contracts.map((contract, index) => (
              <div key={contract.id} className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{contract.compagnie}</p>
                    <p className="text-sm text-muted-foreground">{contract.typeContrat}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{contract.primeAnnuelle} CHF/an</p>
                    <p className="text-xs text-muted-foreground">
                      {contract.montantPrime} CHF ({contract.frequencePaiement})
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Prime Annuelle:</span>
              <span className="text-2xl font-bold text-primary">
                {totalPrimeAnnuelle.toLocaleString('fr-CH')} CHF
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
