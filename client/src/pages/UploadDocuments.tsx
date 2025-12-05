import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, CheckCircle2, Loader2, FileText, Building2, User } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

/**
 * Page d'upload de documents pour les clients après paiement
 * 
 * URL: /upload-documents?token=xxx
 * 
 * Workflow:
 * 1. Client reçoit email de bienvenue avec lien personnalisé
 * 2. Token validé côté serveur
 * 3. Affichage checklist personnalisée (Particulier/Entreprise)
 * 4. Upload multiple de fichiers
 * 5. Google Vision OCR extrait automatiquement les données
 * 6. Création automatique des contrats dans Airtable
 */

// Checklist pour clients Particuliers
const CHECKLIST_PARTICULIERS = [
  "Carte d'identité (recto-verso)",
  "IBAN bancaire",
  "Contrats LAMal (assurance maladie)",
  "Contrats LCA (complémentaires)",
  "Contrats prévoyance (3ème pilier)",
  "Contrats véhicule (RC auto, casco)",
  "Contrats habitation (RC ménage)",
  "Protection juridique",
  "Autres contrats d'assurance",
];

// Checklist pour clients Entreprises
const CHECKLIST_ENTREPRISES = [
  "Extrait du registre du commerce",
  "IBAN bancaire entreprise",
  "Chiffre d'affaires annuel (CA)",
  "Somme salaires AVS (H/F) - dernier doc IJM/LAA",
  "Contrat perte de gain maladie (IJM)",
  "Contrat LAA (accidents professionnels)",
  "Contrat LAA Complémentaire",
  "Contrat LPP (tous plans + détail primes/prestations)",
  "Assurance RC entreprise",
  "Protection juridique",
  "Assurance COMMERCE",
  "Assurance Transport (si existante)",
  "Autres contrats d'assurance",
];

export default function UploadDocuments() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Extraire le token de l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (!urlToken) {
      toast.error("Lien invalide");
      setLocation("/");
    } else {
      setToken(urlToken);
    }
  }, [setLocation]);

  // Valider le token et récupérer les infos client
  const { data: clientData, isLoading: isValidating } = trpc.documents.validateToken.useQuery(
    { token: token || "" },
    { enabled: !!token }
  );

  // Mutation pour uploader les documents
  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => {
      toast.success("Documents envoyés avec succès ! 🎉");
      toast.info("Nous analysons vos documents et vous contacterons sous 48h.");
      setUploadedFiles([]);
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'envoi : ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins un document");
      return;
    }

    setIsUploading(true);

    try {
      // Convertir les fichiers en base64
      const filesData = await Promise.all(
        uploadedFiles.map(async (file) => {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          return {
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64,
          };
        })
      );

      await uploadMutation.mutateAsync({
        token: token!,
        files: filesData,
      });
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3176A6] via-[#8CB4D2] to-[#3176A6]">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-[#3176A6]" />
          <p className="text-lg">Vérification du lien...</p>
        </Card>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3176A6] via-[#8CB4D2] to-[#3176A6]">
        <Card className="p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Lien invalide ou expiré</h1>
          <p className="text-muted-foreground mb-4">
            Ce lien n'est plus valide. Veuillez contacter notre équipe.
          </p>
          <Button onClick={() => setLocation("/conseil")}>Nous contacter</Button>
        </Card>
      </div>
    );
  }

  const checklist = clientData.typeClient === "entreprise" 
    ? CHECKLIST_ENTREPRISES 
    : CHECKLIST_PARTICULIERS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3176A6] via-[#8CB4D2] to-[#3176A6] py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <Upload className="w-10 h-10 text-[#3176A6]" />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            Bienvenue {clientData.prenom} ! 👋
          </h1>
          <p className="text-xl opacity-90">
            Envoyez-nous vos documents pour démarrer votre analyse complète
          </p>
        </div>

        {/* Checklist Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {clientData.typeClient === "entreprise" ? (
              <Building2 className="w-6 h-6 text-[#3176A6]" />
            ) : (
              <User className="w-6 h-6 text-[#3176A6]" />
            )}
            <h2 className="text-2xl font-bold">
              📋 Documents à préparer
              {clientData.typeClient === "entreprise" ? " (Entreprise)" : " (Particulier)"}
            </h2>
          </div>

          <div className="bg-blue-50 border-l-4 border-[#3176A6] p-4 mb-4">
            <p className="text-sm text-gray-700">
              💡 <strong>Astuce :</strong> Vous pouvez envoyer vos documents en plusieurs fois.
              Pas besoin de tout avoir maintenant !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-4 h-4 border-2 border-[#3176A6] rounded flex-shrink-0"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Upload Card */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#3176A6]" />
            Uploader vos documents
          </h2>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 hover:border-[#3176A6] transition-colors">
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold mb-2">
                Cliquez pour sélectionner vos fichiers
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, JPG, PNG • Max 10 MB par fichier
              </p>
            </Label>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Liste des fichiers uploadés */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold">Fichiers sélectionnés ({uploadedFiles.length})</h3>
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Bouton d'envoi */}
          <Button
            onClick={handleUpload}
            disabled={uploadedFiles.length === 0 || isUploading}
            className="w-full bg-gradient-to-r from-[#3176A6] to-[#8CB4D2] hover:opacity-90 text-white text-lg py-6"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Envoyer mes documents ({uploadedFiles.length})
              </>
            )}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-4">
            🔒 Vos documents sont transmis de manière sécurisée et confidentielle
          </p>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-white">
          <p className="text-sm opacity-75">
            Besoin d'aide ? Contactez-nous au{" "}
            <a href="tel:0324661100" className="font-bold underline">
              032 466 11 00
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
