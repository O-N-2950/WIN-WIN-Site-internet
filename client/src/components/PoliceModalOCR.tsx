import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Building2, Calendar, Check, FileText, HelpCircle, Loader2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

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

const TYPES_CONTRATS_SIMPLES = [
  "Santé (LAMal, LCA)",
  "Ménage & RC Privée",
  "Véhicule",
  "Protection Juridique",
  "Vie & Prévoyance (3a, 3b)",
  "Entreprise (LAA, LPP, RC Pro)",
  "Autre",
  "Je ne sais pas",
];

interface Police {
  compagnie: string;
  autreCompagnie?: string;
  typesContrats: string[];
  pdfFile?: File;
  pdfFileName?: string;
  pdfUrl?: string;
  mode: "upload" | "demande" | "plus_tard";
  numeroPolice?: string;
  nomAssure?: string;
  primeAnnuelle?: number;
  dateDebut?: string;
  dateFin?: string;
  ocrConfidence?: number;
}

interface PoliceModalProps {
  isOpen: boolean;
  onClose: () => void;
  policeIndex: number;
  police?: Police;
  onSave: (police: Police) => void;
}

export default function PoliceModalOCR({ isOpen, onClose, policeIndex, police, onSave }: PoliceModalProps) {
  const [mode, setMode] = useState<"selection" | "upload" | "demande" | "plus_tard">(
    police?.mode ? (police.mode === "upload" ? "upload" : police.mode === "demande" ? "demande" : "plus_tard") : "selection"
  );
  
  const [data, setData] = useState<Police>(police || {
    compagnie: "",
    typesContrats: [],
    mode: "upload",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);

  const uploadMutation = trpc.upload.uploadFile.useMutation();
  const ocrMutation = trpc.ocr.analyzeDocument.useMutation();

  const handleFileUpload = async (file: File) => {
    console.log('[PoliceModal] Fichier sélectionné:', file.name);
    setIsUploading(true);
    
    try {
      // Étape 1: Upload vers S3
      toast.info("📤 Upload du PDF en cours...");
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        
        try {
          const uploadResult = await uploadMutation.mutateAsync({
            fileName: file.name,
            fileData: base64,
            fileType: file.type,
          });

          console.log('[PoliceModal] Upload S3 réussi:', uploadResult.url);
          toast.success("✅ PDF uploadé avec succès");

          setData(prev => ({ 
            ...prev, 
            pdfFile: file, 
            pdfFileName: file.name,
            pdfUrl: uploadResult.url 
          }));

          // Étape 2: Analyse OCR
          setIsUploading(false);
          setIsAnalyzing(true);
          toast.info("🔍 Analyse OCR en cours...");

          const ocrResult = await ocrMutation.mutateAsync({
            fileUrl: uploadResult.url,
          });

          console.log('[PoliceModal] OCR terminé:', ocrResult);
          toast.success(`✨ Données extraites (${ocrResult.confidence}% confiance)`);

          // Étape 3: Pré-remplir les champs
          setData(prev => ({
            ...prev,
            compagnie: ocrResult.compagnie || prev.compagnie,
            numeroPolice: ocrResult.numeroPolice || prev.numeroPolice,
            nomAssure: ocrResult.nomAssure || prev.nomAssure,
            primeAnnuelle: ocrResult.primeAnnuelle || prev.primeAnnuelle,
            dateDebut: ocrResult.dateDebut || prev.dateDebut,
            dateFin: ocrResult.dateFin || prev.dateFin,
            ocrConfidence: ocrResult.confidence,
            typesContrats: ocrResult.typeContrat ? [mapTypeContrat(ocrResult.typeContrat)] : prev.typesContrats,
          }));

          setOcrComplete(true);
          setIsAnalyzing(false);

        } catch (error) {
          console.error('[PoliceModal] Erreur upload/OCR:', error);
          toast.error("❌ Erreur lors de l'analyse");
          setIsUploading(false);
          setIsAnalyzing(false);
        }
      };

      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('[PoliceModal] Erreur:', error);
      toast.error("❌ Erreur lors de l'upload");
      setIsUploading(false);
    }
  };

  // Mapper les types de contrats OCR vers les types simples
  const mapTypeContrat = (type: string): string => {
    if (type.includes('LAMal') || type.includes('LCA')) return "Santé (LAMal, LCA)";
    if (type.includes('Protection Juridique')) return "Protection Juridique";
    if (type.includes('Entreprise')) return "Entreprise (LAA, LPP, RC Pro)";
    return "Autre";
  };

  const handleSave = () => {
    onSave({ ...data, mode: mode as any });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-background rounded-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Police #{policeIndex + 1}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "selection" && "Comment souhaitez-vous procéder ?"}
              {mode === "upload" && !ocrComplete && "Uploadez votre PDF, nous extrayons automatiquement les données"}
              {mode === "upload" && ocrComplete && "Vérifiez et modifiez les données extraites si nécessaire"}
              {mode === "demande" && "Nous demanderons une copie à votre compagnie"}
              {mode === "plus_tard" && "Nous ferons l'inventaire ensemble"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {/* Sélection du mode */}
          {mode === "selection" && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("upload")}
                className="w-full p-6 border-2 border-border hover:border-primary rounded-xl text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">✅ Oui, j'ai le PDF</h4>
                    <p className="text-sm text-muted-foreground">
                      Uploadez votre police, nous extrairons automatiquement toutes les informations (compagnie, numéro, prime, dates...)
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("demande")}
                className="w-full p-6 border-2 border-border hover:border-primary rounded-xl text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">🤷 Non, mais je connais la compagnie</h4>
                    <p className="text-sm text-muted-foreground">
                      Nous demanderons une copie de vos contrats directement à votre compagnie avec votre mandat signé
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("plus_tard")}
                className="w-full p-6 border-2 border-border hover:border-primary rounded-xl text-left transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">❓ Je ne sais plus exactement</h4>
                    <p className="text-sm text-muted-foreground">
                      Nous ferons un inventaire complet de vos assurances lors de notre premier entretien
                    </p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Mode Upload avec OCR */}
          {mode === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Zone d'upload */}
              {!data.pdfFileName && (
                <div className="relative border-2 border-dashed border-primary/30 rounded-xl p-12 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                    className="hidden"
                    id="pdf-upload"
                    disabled={isUploading || isAnalyzing}
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4"
                    >
                      <Upload className="h-10 w-10 text-white" />
                    </motion.div>
                    <p className="text-xl font-semibold mb-2">
                      Cliquez ou glissez votre PDF ici
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ✨ Extraction automatique : compagnie, numéro, prime, dates, couvertures
                    </p>
                  </label>
                </div>
              )}

              {/* État d'upload/analyse */}
              {(isUploading || isAnalyzing) && (
                <div className="p-6 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        {isUploading && "Upload du PDF en cours..."}
                        {isAnalyzing && "Analyse OCR en cours..."}
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {isUploading && "Envoi vers le serveur"}
                        {isAnalyzing && "Extraction des données (cela peut prendre 5-10 secondes)"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Résultat OCR */}
              {ocrComplete && data.ocrConfidence !== undefined && (
                <div className={`p-6 rounded-xl border-2 ${
                  data.ocrConfidence >= 70 
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                }`}>
                  <div className="flex items-start gap-3">
                    {data.ocrConfidence >= 70 ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        Extraction terminée ({data.ocrConfidence}% de confiance)
                      </p>
                      <p className="text-sm">
                        {data.ocrConfidence >= 70 
                          ? "Les données ont été extraites avec succès. Vérifiez-les ci-dessous."
                          : "Certaines données n'ont pas pu être extraites. Complétez manuellement les champs manquants."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulaire avec données extraites */}
              {data.pdfFileName && !isUploading && !isAnalyzing && (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium">📄 {data.pdfFileName}</p>
                  </div>

                  <div>
                    <Label>Compagnie d'assurance</Label>
                    <Select
                      value={data.compagnie}
                      onValueChange={(value) => setData({ ...data, compagnie: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une compagnie" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {COMPAGNIES.map((compagnie) => (
                          <SelectItem key={compagnie} value={compagnie}>
                            {compagnie}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Numéro de police (optionnel)</Label>
                    <Input
                      value={data.numeroPolice || ""}
                      onChange={(e) => setData({ ...data, numeroPolice: e.target.value })}
                      placeholder="Ex: 123456789"
                    />
                  </div>

                  <div>
                    <Label>Nom de l'assuré (optionnel)</Label>
                    <Input
                      value={data.nomAssure || ""}
                      onChange={(e) => setData({ ...data, nomAssure: e.target.value })}
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>

                  <div>
                    <Label>Prime annuelle (optionnel)</Label>
                    <Input
                      type="number"
                      value={data.primeAnnuelle || ""}
                      onChange={(e) => setData({ ...data, primeAnnuelle: parseFloat(e.target.value) })}
                      placeholder="Ex: 2500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date de début (optionnel)</Label>
                      <Input
                        value={data.dateDebut || ""}
                        onChange={(e) => setData({ ...data, dateDebut: e.target.value })}
                        placeholder="Ex: 01.01.2024"
                      />
                    </div>
                    <div>
                      <Label>Date de fin (optionnel)</Label>
                      <Input
                        value={data.dateFin || ""}
                        onChange={(e) => setData({ ...data, dateFin: e.target.value })}
                        placeholder="Ex: 31.12.2024"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons */}
              {data.pdfFileName && !isUploading && !isAnalyzing && (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setMode("selection")} className="flex-1">
                    Retour
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    <Check className="mr-2 w-5 h-5" />
                    Valider
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Mode Demande (inchangé) */}
          {mode === "demande" && (
            <motion.div
              key="demande"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-300 dark:border-green-700 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-green-900 dark:text-green-100 mb-1">
                      Pas de souci !
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                      Avec votre mandat signé, nous obtiendrons tous vos contrats et décomptes de primes auprès de cette compagnie.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Compagnie d'assurance</Label>
                <Select
                  value={data.compagnie}
                  onValueChange={(value) => setData({ ...data, compagnie: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez une compagnie" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {COMPAGNIES.map((compagnie) => (
                      <SelectItem key={compagnie} value={compagnie}>
                        {compagnie}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setMode("selection")} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={!data.compagnie}>
                  <Check className="mr-2 w-5 h-5" />
                  Valider
                </Button>
              </div>
            </motion.div>
          )}

          {/* Mode Plus Tard (inchangé) */}
          {mode === "plus_tard" && (
            <motion.div
              key="plus_tard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-1">
                      Aucun problème !
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      Nous ferons un inventaire complet de toutes vos assurances lors de notre premier entretien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setMode("selection")} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  <Check className="mr-2 w-5 h-5" />
                  Valider
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
