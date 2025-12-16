import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Pen, RotateCcw, Download } from "lucide-react";
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
      
      // REDIRECTION IMMÉDIATE vers la page de paiement
      console.log('[Signature] 🔄 Redirection immédiate vers /paiement');
      toast.success("✅ Signature enregistrée !");
      
      // Redirection sans attendre la création Airtable
      setTimeout(() => setLocation("/paiement"), 500);
      
      // Création du client dans Airtable EN ARRIÈRE-PLAN (non bloquant)
      // Cela continuera même après la redirection
      console.log('[Signature] Création du client en arrière-plan...');
      createClientMutation.mutate({
        prenom: workflow.questionnaireData.prenom,
        nom: workflow.questionnaireData.nom,
        nomEntreprise: workflow.questionnaireData.nomEntreprise,
        typeClient: workflow.questionnaireData.typeClient,
        email: workflow.questionnaireData.email,
        telMobile: workflow.questionnaireData.telMobile,
        adresse: workflow.questionnaireData.adresse || '',
        npa: workflow.questionnaireData.npa || '',
        localite: workflow.questionnaireData.localite || '',
        dateNaissance: workflow.questionnaireData.dateNaissance,
        formeJuridique: workflow.questionnaireData.formeJuridique,
        nombreEmployes: workflow.questionnaireData.nombreEmployes,
        codeParrainage: workflow.questionnaireData.codeParrainage,
        signatureDataUrl,
        signatureS3Url: signatureResult.url,
      }, {
        onSuccess: (clientResult) => {
          console.log('[Signature] ✅ Client créé en arrière-plan:', clientResult.clientId);
          console.log('[Signature] PDF mandat généré:', clientResult.pdfUrl);
          
          // Sauvegarder les infos dans le workflow
          updateWorkflow({
            clientId: clientResult.clientId,
            mandatPdfUrl: clientResult.pdfUrl || undefined,
          });
        },
        onError: (error) => {
          console.error('[Signature] ❌ Erreur création Airtable (arrière-plan):', error);
          // L'utilisateur est déjà sur la page paiement, pas grave si ça échoue ici
          // On pourra recréer le client au moment du paiement
        }
      });
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
    <div className="min-h-screen bg-muted/50 py-12">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Signature du Mandat de Gestion</h1>
            <p className="text-lg text-muted-foreground">
              Signez électroniquement votre mandat de gestion annuel
            </p>
          </div>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pen className="h-5 w-5" />
                Votre signature électronique
              </CardTitle>
              <CardDescription>
                Signez dans le cadre ci-dessous avec votre souris ou votre doigt (sur mobile)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 bg-white">
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

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={clearSignature}
                  disabled={isEmpty}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Effacer
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadSignature}
                  disabled={isEmpty}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger
                </Button>
              </div>

              {isEmpty && (
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Veuillez signer dans le cadre ci-dessus pour continuer
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  En signant ce document, je confirme avoir pris connaissance et accepter les 
                  <a href="/conditions" className="text-primary hover:underline ml-1">
                    conditions générales
                  </a> du mandat de gestion WIN WIN Finance Group.
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
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setLocation("/questionnaire")}
            >
              Retour au questionnaire
            </Button>
            <Button
              size="lg"
              onClick={saveSignature}
              disabled={isEmpty || isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Valider et Continuer
                </>
              )}
            </Button>
          </div>

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
