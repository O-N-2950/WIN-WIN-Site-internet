import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Building2, Calendar, Check, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
  mode: "upload" | "demande" | "plus_tard";
  numeroPolice?: string;
}

interface PoliceModalProps {
  isOpen: boolean;
  onClose: () => void;
  policeIndex: number;
  police?: Police;
  onSave: (police: Police) => void;
}

export default function PoliceModal({ isOpen, onClose, policeIndex, police, onSave }: PoliceModalProps) {
  const [mode, setMode] = useState<"selection" | "upload" | "demande" | "plus_tard">(
    police?.mode ? (police.mode === "upload" ? "upload" : police.mode === "demande" ? "demande" : "plus_tard") : "selection"
  );
  
  const [data, setData] = useState<Police>(police || {
    compagnie: "",
    typesContrats: [],
    mode: "upload",
  });

  const handleFileUpload = (file: File) => {
    setData({ ...data, pdfFile: file, pdfFileName: file.name });
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
        className="bg-background rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">Police #{policeIndex + 1}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "selection" && "Comment souhaitez-vous procéder ?"}
              {mode === "upload" && "Uploadez votre PDF, nous nous occupons du reste"}
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
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">✅ Oui, j'ai le PDF</h4>
                    <p className="text-sm text-muted-foreground">
                      Uploadez votre police, nous extrairons automatiquement toutes les informations
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
                      <span className="font-medium text-foreground">😊 Pas de souci !</span> Nous demanderons une copie de vos contrats et décomptes directement à votre compagnie avec votre mandat signé
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
                      <span className="font-medium text-foreground">😊 Aucun problème !</span> Nous ferons un inventaire complet de vos assurances lors de notre premier entretien
                    </p>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Mode Upload */}
          {mode === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
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
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4"
                  >
                    <Upload className="h-10 w-10 text-white" />
                  </motion.div>
                  <p className="text-xl font-semibold mb-2">
                    {data.pdfFileName || "Cliquez ou glissez votre PDF ici"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ✨ Extraction automatique : compagnie, numéro, prime, dates, couvertures
                  </p>
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setMode("selection")} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleSave} className="flex-1" disabled={!data.pdfFileName}>
                  <Check className="mr-2 w-5 h-5" />
                  Valider
                </Button>
              </div>
            </motion.div>
          )}

          {/* Mode Demande */}
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

                {data.compagnie === "Autre compagnie" && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <Input
                      placeholder="Nom de la compagnie"
                      value={data.autreCompagnie || ""}
                      onChange={(e) => setData({ ...data, autreCompagnie: e.target.value })}
                      className="mt-3 h-12"
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Type de contrat (si vous savez)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {TYPES_CONTRATS_SIMPLES.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-simple-${type}`}
                        checked={data.typesContrats.includes(type)}
                        onCheckedChange={(checked) => {
                          const newTypes = checked
                            ? [...data.typesContrats, type]
                            : data.typesContrats.filter((t) => t !== type);
                          setData({ ...data, typesContrats: newTypes });
                        }}
                      />
                      <label htmlFor={`type-simple-${type}`} className="text-sm cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Numéro de police (optionnel)</Label>
                <Input
                  placeholder="Si vous le connaissez"
                  value={data.numeroPolice || ""}
                  onChange={(e) => setData({ ...data, numeroPolice: e.target.value })}
                  className="h-12"
                />
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

          {/* Mode Plus tard */}
          {mode === "plus_tard" && (
            <motion.div
              key="plus_tard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-amber-600" />
                <h4 className="font-semibold text-lg mb-2">😊 Aucun problème !</h4>
                <p className="text-sm text-muted-foreground">
                  Nous ferons un inventaire complet de vos assurances lors de notre premier entretien. 
                  Vous pouvez continuer le questionnaire sans cette information.
                </p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setMode("selection")} className="flex-1">
                  Retour
                </Button>
                <Button onClick={() => { setData({ ...data, compagnie: "À définir", typesContrats: ["Inventaire lors entretien"] }); handleSave(); }} className="flex-1">
                  <Check className="mr-2 w-5 h-5" />
                  Continuer
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
