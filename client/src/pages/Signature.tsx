import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Pen, RotateCcw, Download, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useRef, useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Signature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [, setLocation] = useLocation();
  const { workflow, updateWorkflow } = useWorkflow();
  
  const uploadSignatureMutation = trpc.workflow.uploadSignature.useMutation();
  const createClientMutation = trpc.customers.createFromSignature.useMutation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration du canvas
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Ajuster la taille du canvas pour le responsive
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 200;

      // Redessiner le fond blanc
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setIsEmpty(false);

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // S'assurer que isEmpty est bien à false pendant le dessin
    if (isEmpty) {
      setIsEmpty(false);
    }

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const saveSignature = async () => {
    if (isEmpty) {
      toast.error("Veuillez signer avant de continuer");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("Erreur technique: canvas non trouvé");
      return;
    }

    // Vérifier que les données du questionnaire sont présentes
    if (!workflow.questionnaireData?.email) {
      toast.error("Données du questionnaire manquantes. Veuillez recommencer.");
      setLocation("/questionnaire-info");
      return;
    }

    setIsSaving(true);

    try {
      console.log('[Signature] Début de la sauvegarde...');
      
      // Convertir le canvas en data URL
      const signatureDataUrl = canvas.toDataURL("image/png");
      console.log('[Signature] Signature convertie en data URL');
      
      // Sauvegarder dans le workflow
      updateWorkflow({
        signatureDataUrl,
        signatureDate: new Date().toISOString(),
      });
      console.log('[Signature] Workflow mis à jour');
      
      // Upload signature vers S3 (pour affichage immédiat)
      const email = workflow.questionnaireData.email;
      console.log(`[Signature] Upload signature vers S3 pour ${email}...`);
      
      const signatureResult = await uploadSignatureMutation.mutateAsync({
        signatureDataUrl,
        clientEmail: email,
      });
      
      console.log('[Signature] Upload S3 signature réussi:', signatureResult.url);
      updateWorkflow({ signatureS3Url: signatureResult.url });
      
      // Sauvegarder la signature dans le workflow (pour utilisation ultérieure)
      console.log('[Signature] Signature sauvegardée dans workflow');
      
      // Création du client dans Airtable AVANT redirection (BLOQUANT)
      // On doit attendre pour récupérer le code de parrainage réel
      console.log('[Signature] Création du client dans Airtable...');
      toast.success("✅ Signature enregistrée ! Création de votre compte...");
      
      const clientResult = await createClientMutation.mutateAsync({
        prenom: workflow.questionnaireData.prenom,
        nom: workflow.questionnaireData.nom,
        formuleAppel: workflow.questionnaireData.formuleAppel,
        nomEntreprise: workflow.questionnaireData.nomEntreprise,
        typeClient: workflow.questionnaireData.typeClient,
        email: workflow.questionnaireData.email,
        telMobile: workflow.questionnaireData.telMobile,
        adresse: workflow.questionnaireData.adresse || '',
        npa: workflow.questionnaireData.npa || '',
        localite: workflow.questionnaireData.localite || '',
        dateNaissance: workflow.questionnaireData.dateNaissance,
        statutProfessionnel: workflow.questionnaireData.statutProfessionnel,
        profession: workflow.questionnaireData.profession,
        employeur: workflow.questionnaireData.employeur,
        tauxActivite: workflow.questionnaireData.tauxActivite,
        situationFamiliale: workflow.questionnaireData.situationFamiliale,
        nationalite: workflow.questionnaireData.nationalite,
        permisEtablissement: workflow.questionnaireData.permisEtablissement,
        ibanPersonnel: workflow.questionnaireData.iban,
        banquePersonnelle: workflow.questionnaireData.banque,
        ...(workflow.questionnaireData.formeJuridique && { formeJuridique: workflow.questionnaireData.formeJuridique }),
        ...(workflow.questionnaireData.nombreEmployes && { nombreEmployes: workflow.questionnaireData.nombreEmployes }),
        ...(workflow.questionnaireData.adresseEntreprise && { adresseEntreprise: workflow.questionnaireData.adresseEntreprise }),
        ...(workflow.questionnaireData.npaEntreprise && { npaEntreprise: workflow.questionnaireData.npaEntreprise }),
        ...(workflow.questionnaireData.localiteEntreprise && { localiteEntreprise: workflow.questionnaireData.localiteEntreprise }),
        ...(workflow.questionnaireData.banqueEntreprise && { banqueEntreprise: workflow.questionnaireData.banqueEntreprise }),
        ...(workflow.questionnaireData.ibanEntreprise && { ibanEntreprise: workflow.questionnaireData.ibanEntreprise }),
        codeParrainage: workflow.questionnaireData.codeParrainage,
        signatureDataUrl,
        signatureS3Url: signatureResult.url,
      });
      
      console.log('[Signature] ✅ Client créé:', clientResult.clientId);
      console.log('[Signature] 🎁 Code de parrainage:', clientResult.referralCode);
      console.log('[Signature] 📄 PDF mandat généré:', clientResult.pdfUrl);
      
      // Sauvegarder les infos dans le workflow (IMPORTANT: le code de parrainage réel !)
      updateWorkflow({
        clientId: clientResult.clientId,
        mandatPdfUrl: clientResult.pdfUrl || undefined,
        referralCode: clientResult.referralCode, // CODE RÉEL depuis Airtable
      });
      
      // REDIRECTION vers la page de paiement (avec le vrai code de parrainage)
      console.log('[Signature] 🔄 Redirection vers /paiement avec code:', clientResult.referralCode);
      toast.success("✅ Compte créé ! Redirection...");
      setTimeout(() => setLocation("/paiement"), 500);
    } catch (error) {
      console.error("[Signature] Erreur lors de la sauvegarde:", error);
      
      // Message d'erreur détaillé
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('[Signature] Détails:', errorMessage);
      
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const link = document.createElement("a");
    link.download = "signature.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950 py-12">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-12"
          >
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="h-20 w-20 rounded-full bg-gradient-to-br from-[#3176A6] to-[#8CB4D2] flex items-center justify-center shadow-2xl"
              >
                <Pen className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#3176A6] to-[#8CB4D2] bg-clip-text text-transparent mb-4">
                Signature du Mandat de Gestion
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                ✨ Votre signature scelle votre tranquillité d'esprit
              </p>
            </div>
          </motion.div>

          {/* Récapitulatif */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de votre mandat</CardTitle>
              <CardDescription>
                Veuillez vérifier les informations avant de signer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Informations personnelles</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Nom complet</p>
                    <p className="font-medium">
                      {workflow.questionnaireData?.typeClient === "entreprise" 
                        ? workflow.questionnaireData?.nomEntreprise
                        : `${workflow.questionnaireData?.prenom} ${workflow.questionnaireData?.nom}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{workflow.questionnaireData?.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Adresse</p>
                    <p className="font-medium">{workflow.questionnaireData?.adresse}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">NPA / Localité</p>
                    <p className="font-medium">{workflow.questionnaireData?.npa} {workflow.questionnaireData?.localite}</p>
                  </div>
                  {workflow.questionnaireData?.typeClient === "entreprise" && workflow.questionnaireData?.formeJuridique && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Forme juridique</p>
                        <p className="font-medium">
                          {workflow.questionnaireData.formeJuridique === "entreprise_individuelle" && "Entreprise individuelle"}
                          {workflow.questionnaireData.formeJuridique === "sarl" && "Sàrl"}
                          {workflow.questionnaireData.formeJuridique === "sa" && "SA"}
                          {workflow.questionnaireData.formeJuridique === "autre" && "Autre"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nombre d'employés</p>
                        <p className="font-medium">{workflow.questionnaireData?.nombreEmployes}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Détails du mandat */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Détails du mandat</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type de client</p>
                    <p className="font-medium">
                      {workflow.questionnaireData?.typeClient === "prive" && "Particulier"}
                      {workflow.questionnaireData?.typeClient === "entreprise" && (
                        workflow.questionnaireData?.nombreEmployes !== undefined
                          ? `Entreprise (${workflow.questionnaireData.nombreEmployes} employé${workflow.questionnaireData.nombreEmployes > 1 ? 's' : ''})`
                          : "Entreprise"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tarif annuel</p>
                    <p className="font-medium">
                      {workflow.calculatedPrice?.annualPrice !== undefined
                        ? `CHF ${workflow.calculatedPrice.annualPrice}.-/an`
                        : "À calculer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Durée du mandat</p>
                    <p className="font-medium">12 mois (renouvelable)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date de début</p>
                    <p className="font-medium">{new Date().toLocaleDateString("fr-CH", { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Votre mandat de gestion vous donne accès à un suivi personnalisé de toutes vos assurances, 
                  des conseils d'optimisation, et une assistance en cas de sinistre.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Canvas de signature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-[#D4AF37]/30 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#3176A6]/10 to-[#8CB4D2]/10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#3176A6] to-[#8CB4D2] flex items-center justify-center">
                    <Pen className="h-5 w-5 text-white" />
                  </div>
                  Votre signature électronique
                </CardTitle>
                <CardDescription className="text-base">
                  🖊️ Signez avec votre souris ou votre doigt (sur mobile)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                {/* Canvas avec bordure dorée */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] via-[#F4E5A6] to-[#D4AF37] rounded-xl opacity-75 blur-sm"></div>
                  <div className="relative border-4 border-[#D4AF37] rounded-xl p-4 bg-white shadow-inner">
                    <canvas
                      ref={canvasRef}
                      className="w-full cursor-crosshair touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                </motion.div>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="outline"
                    onClick={clearSignature}
                    disabled={isEmpty}
                    className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Effacer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={downloadSignature}
                    disabled={isEmpty}
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                </div>

                {isEmpty && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800 dark:text-amber-200">
                        🖊️ Veuillez signer dans le cadre doré ci-dessus pour continuer
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Conditions */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  En signant ce document, je confirme avoir pris connaissance et accepter les conditions générales du mandat de gestion WIN WIN Finance Group.
                </p>
                <p>
                  Je comprends que ce mandat est valable pour une durée de 12 mois et se renouvelle 
                  automatiquement sauf résiliation écrite 30 jours avant l'échéance.
                </p>
                <p>
                  Ma signature électronique a la même valeur juridique qu'une signature manuscrite 
                  conformément à la loi suisse sur la signature électronique (SCSE).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-between items-center"
          >
            <Button
              variant="outline"
              onClick={() => setLocation("/questionnaire")}
              className="w-full sm:w-auto"
            >
              Retour au questionnaire
            </Button>
            
            <Button
              size="lg"
              onClick={() => {
                // Confettis avant la sauvegarde
                if (!isEmpty) {
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3176A6', '#8CB4D2', '#D4AF37', '#F4E5A6']
                  });
                }
                saveSignature();
              }}
              disabled={isEmpty || isSaving}
              className="group relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 hover:from-green-700 hover:via-emerald-700 hover:to-green-700 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl hover:shadow-[0_20px_60px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-105 border-2 border-white/20 w-full sm:w-auto"
            >
              {isSaving ? (
                <span className="flex items-center gap-3">
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-current border-t-transparent" />
                  <span className="text-lg">Enregistrement...</span>
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-3">
                  <CheckCircle2 className="h-7 w-7 group-hover:scale-125 transition-transform" />
                  <span>Valider et Continuer</span>
                  <Sparkles className="h-6 w-6 group-hover:rotate-12 group-hover:scale-125 transition-all duration-300" />
                </span>
              )}
              {/* Effet de brillance animé */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </Button>
          </motion.div>

          {/* Sécurité */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Connexion sécurisée SSL • Hébergement Suisse 🇨🇭 • Données cryptées
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
