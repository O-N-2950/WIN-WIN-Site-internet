import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReferralCodeInputProps {
  data: any;
  setData: (data: any) => void;
}

const RELATIONS_FAMILIALES = [
  "époux",
  "épouse",
  "fils",
  "fille",
  "frère",
  "sœur",
  "mère",
  "père",
  "grand-père",
  "grand-mère",
  "oncle",
  "tante",
  "beau-frère",
  "belle-soeur",
  "beau-fils",
  "belle-fille",
  "beau-père",
  "Belle-mère",
  "neveu",
  "nièce",
  "filleul",
  "filleule",
  "conjoint",
  "conjointe",
  "collègue",
  "ami(e)",
  "autre",
];

export default function ReferralCodeInput({ data, setData }: ReferralCodeInputProps) {
  const [codeInput, setCodeInput] = useState(data.codeParrainageRef || "");
  const [validationState, setValidationState] = useState<"idle" | "validating" | "valid" | "invalid">("idle");
  const [parrainNom, setParrainNom] = useState("");

  const validateCode = trpc.client.validateReferralCode.useMutation({
    onSuccess: (result) => {
      if (result.valid) {
        setValidationState("valid");
        setParrainNom(result.parrainNom || "");
        setData({ ...data, codeParrainageRef: codeInput });
        toast.success("Code de parrainage valide !", {
          description: `Vous bénéficierez du rabais groupe familial grâce à ${result.parrainNom}`,
        });
      } else {
        setValidationState("invalid");
        toast.error("Code de parrainage invalide", {
          description: "Vérifiez l'orthographe ou contactez la personne qui vous l'a envoyé.",
        });
      }
    },
    onError: () => {
      setValidationState("invalid");
      toast.error("Erreur lors de la validation", {
        description: "Veuillez réessayer dans quelques instants.",
      });
    },
  });

  const handleVerify = () => {
    if (!codeInput.trim()) {
      toast.error("Veuillez saisir un code de parrainage");
      return;
    }
    setValidationState("validating");
    validateCode.mutate({ code: codeInput.trim().toUpperCase() });
  };

  const handleReset = () => {
    setCodeInput("");
    setValidationState("idle");
    setParrainNom("");
    setData({ ...data, codeParrainageRef: "", relationFamiliale: "" });
  };

  return (
    <div className="space-y-4">
      {/* Champ de saisie du code */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="Ex: JEAN-A1B2"
            className="text-lg h-12"
            disabled={validationState === "valid"}
            onKeyPress={(e) => e.key === "Enter" && handleVerify()}
          />
        </div>
        {validationState !== "valid" ? (
          <Button
            onClick={handleVerify}
            disabled={validationState === "validating" || !codeInput.trim()}
            className="h-12"
          >
            {validationState === "validating" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Vérification...
              </>
            ) : (
              "Vérifier"
            )}
          </Button>
        ) : (
          <Button onClick={handleReset} variant="outline" className="h-12">
            Modifier
          </Button>
        )}
      </div>

      {/* Messages de validation */}
      <AnimatePresence mode="wait">
        {validationState === "valid" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-green-100 dark:bg-green-950/50 border border-green-300 dark:border-green-800"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Code valide ! 🎉
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Vous bénéficierez du rabais groupe familial grâce à <strong>{parrainNom}</strong>
                </p>
              </div>
            </div>

            {/* Dropdown Relations familiales */}
            <div className="mt-4">
              <Label className="text-sm font-medium text-green-900 dark:text-green-100">
                Quelle est votre relation avec {parrainNom} ? *
              </Label>
              <Select
                value={data.relationFamiliale || ""}
                onValueChange={(value) => setData({ ...data, relationFamiliale: value })}
              >
                <SelectTrigger className="mt-2 h-12 bg-white dark:bg-gray-950">
                  <SelectValue placeholder="Sélectionnez..." />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONS_FAMILIALES.map((relation) => (
                    <SelectItem key={relation} value={relation}>
                      {relation.charAt(0).toUpperCase() + relation.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}

        {validationState === "invalid" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800"
          >
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Code invalide
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Vérifiez l'orthographe ou contactez la personne qui vous l'a envoyé.
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                  Pas de code ? Aucun problème ! Vous pourrez partager votre propre code après votre inscription.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
