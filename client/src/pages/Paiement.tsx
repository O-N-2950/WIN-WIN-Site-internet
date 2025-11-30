import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  CreditCard, 
  Shield, 
  Info,
  ArrowRight,
  Lock
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Paiement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();
  const { workflow, updateWorkflow } = useWorkflow();
  
  const createCheckoutMutation = trpc.workflow.createCheckoutSession.useMutation();
  const createClientMutation = trpc.workflow.createClient.useMutation();
  
  // Récupérer les données du workflow
  const clientData = {
    type: workflow.clientType || "prive",
    age: workflow.clientAge || 25,
    tarif: workflow.annualPrice || 185,
    isFree: workflow.isFree || false
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      console.log('🔵 Paiement déclenché');
      console.log('📊 Données client:', {
        type: workflow.questionnaireData?.typeClient,
        age: workflow.questionnaireData?.dateNaissance,
        employeeCount: workflow.questionnaireData?.nombreEmployes
      });
      
      // Calculer dynamiquement le priceId selon le tarif
      let priceId: string;
      
      if (workflow.questionnaireData?.typeClient === "prive") {
        // Calculer l'âge depuis la date de naissance
        const birthDate = workflow.questionnaireData.dateNaissance;
        const age = birthDate ? new Date().getFullYear() - new Date(birthDate).getFullYear() : 25;
        
        if (age >= 18 && age <= 22) {
          priceId = "price_1STlgKDevWYEIiJ8QqZu9R52"; // Particulier 18-22 ans : CHF 85.-/an
        } else {
          priceId = "price_1STlgKDevWYEIiJ8ExMQznN7"; // Particulier > 22 ans : CHF 185.-/an
        }
      } else {
        // Entreprise
        const employeeCount = workflow.questionnaireData?.nombreEmployes || 0;
        
        if (employeeCount === 0) {
          priceId = "price_1STlgLDevWYEIiJ8fpjNpgAn"; // 0 employé : CHF 160.-/an
        } else if (employeeCount === 1) {
          priceId = "price_1STlgLDevWYEIiJ8TtUOdeBY"; // 1 employé : CHF 260.-/an
        } else if (employeeCount === 2) {
          priceId = "price_1STlgMDevWYEIiJ8LcVUCBzI"; // 2 employés : CHF 360.-/an
        } else if (employeeCount >= 3 && employeeCount <= 5) {
          priceId = "price_1STlgMDevWYEIiJ8lnbNPxVe"; // 3-5 employés : CHF 460.-/an
        } else if (employeeCount >= 6 && employeeCount <= 10) {
          priceId = "price_1STlgNDevWYEIiJ8WHVYyo0l"; // 6-10 employés : CHF 560.-/an
        } else if (employeeCount >= 11 && employeeCount <= 20) {
          priceId = "price_1STlgNDevWYEIiJ8jQRDvTuS"; // 11-20 employés : CHF 660.-/an
        } else if (employeeCount >= 21 && employeeCount <= 30) {
          priceId = "price_1STlgNDevWYEIiJ8r1Ysxivn"; // 21-30 employés : CHF 760.-/an
        } else {
          priceId = "price_1STlgODevWYEIiJ8vMjiO56u"; // 31+ employés : CHF 860.-/an
        }
      }
      
      console.log('✅ PriceId calculé:', priceId);
      
      // Créer Stripe Checkout Session via tRPC
      
      const session = await createCheckoutMutation.mutateAsync({
        priceId,
        clientName: workflow.clientName || "Client Test",
        clientEmail: workflow.clientEmail || "test@example.com",
        clientType: workflow.clientType || "prive",
        clientAge: workflow.clientAge,
        clientEmployeeCount: workflow.clientEmployeeCount,
        annualPrice: workflow.annualPrice || 185,
        signatureUrl: workflow.signatureS3Url, // URL S3 de la signature
        successUrl: `${window.location.origin}/merci`,
        cancelUrl: `${window.location.origin}/paiement`
      });
      
      // Sauvegarder l'ID de session
      updateWorkflow({ stripeSessionId: session.sessionId });
      
      // Redirection vers Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement:", error);
      toast.error("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipPayment = async () => {
    // Pour les mandats offerts (gratuits)
    setIsProcessing(true);

    try {
      // Créer le client dans Airtable sans paiement
      const result = await createClientMutation.mutateAsync({
        nom: workflow.clientName?.split(' ')[1] || "Test",
        prenom: workflow.clientName?.split(' ')[0] || "Client",
        email: workflow.clientEmail || "test@example.com",
        type: workflow.clientType || "prive",
        age: workflow.clientAge,
        employeeCount: workflow.clientEmployeeCount,
        annualPrice: 0,
        isFree: true,
        signatureUrl: workflow.signatureS3Url,
      });
      
      // Sauvegarder les données de confirmation
      updateWorkflow({
        paymentCompleted: true,
        mandatNumber: result.mandatNumber,
        airtableRecordId: result.airtableId,
      });
      
      toast.success("Mandat activé avec succès !");
      setTimeout(() => setLocation("/merci"), 500);
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      toast.error("Erreur. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 py-12">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Paiement du Mandat de Gestion</h1>
            <p className="text-lg text-muted-foreground">
              Dernière étape : activez votre mandat de gestion annuel
            </p>
          </div>

          {/* Mandat Offert */}
          {clientData.isFree && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Bonne nouvelle !</strong> Votre mandat de gestion est offert. 
                Cliquez sur "Activer mon mandat" pour finaliser votre inscription.
              </AlertDescription>
            </Alert>
          )}

          {/* Récapitulatif */}
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif de votre commande</CardTitle>
              <CardDescription>
                Détails de votre mandat de gestion annuel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div>
                    <p className="font-medium">Mandat de Gestion Annuel</p>
                    <p className="text-sm text-muted-foreground">
                      {clientData.type === "prive" 
                        ? `Particulier (${clientData.age} ans)` 
                        : `Entreprise (${clientData.age} employés)`}
                    </p>
                  </div>
                  <p className="text-xl font-bold">
                    {clientData.isFree ? "Offert" : `CHF ${clientData.tarif}.-`}
                  </p>
                </div>

                {!clientData.isFree && (
                  <>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">Sous-total</p>
                      <p>CHF {clientData.tarif}.-</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-muted-foreground">TVA (incluse)</p>
                      <p>CHF 0.-</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-lg font-bold">Total</p>
                      <p className="text-2xl font-bold text-primary">CHF {clientData.tarif}.-</p>
                    </div>
                  </>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Paiement annuel récurrent.</strong> Votre mandat sera automatiquement 
                  renouvelé chaque année sauf résiliation écrite 30 jours avant l'échéance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Ce qui est inclus */}
          <Card>
            <CardHeader>
              <CardTitle>Ce qui est inclus dans votre mandat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Analyse complète de vos assurances",
                  "Suivi personnalisé annuel",
                  "Optimisation des primes",
                  "Conseils d'experts indépendants",
                  "Assistance en cas de sinistre",
                  "Veille réglementaire et tarifaire",
                  "Accès à l'espace client en ligne",
                  "Support prioritaire par téléphone"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Méthode de paiement */}
          {!clientData.isFree && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Méthode de paiement
                </CardTitle>
                <CardDescription>
                  Paiement sécurisé par Stripe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border rounded-lg p-4 flex items-center justify-center bg-white">
                    <img src="/visa.svg" alt="Visa" className="h-8" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-sm font-medium">VISA</span>';
                    }} />
                  </div>
                  <div className="border rounded-lg p-4 flex items-center justify-center bg-white">
                    <img src="/mastercard.svg" alt="Mastercard" className="h-8" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-sm font-medium">Mastercard</span>';
                    }} />
                  </div>
                  <div className="border rounded-lg p-4 flex items-center justify-center bg-white">
                    <img src="/amex.svg" alt="American Express" className="h-8" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-sm font-medium">AMEX</span>';
                    }} />
                  </div>
                  <div className="border rounded-lg p-4 flex items-center justify-center bg-white">
                    <img src="/twint.svg" alt="TWINT" className="h-8" onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-sm font-medium">TWINT</span>';
                    }} />
                  </div>
                </div>

                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Vos informations de paiement sont sécurisées et cryptées. 
                    Nous n'avons jamais accès à vos données bancaires.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Garanties */}
          <Card className="bg-muted">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6 text-center text-sm">
                <div className="space-y-2">
                  <Shield className="h-8 w-8 mx-auto text-primary" />
                  <p className="font-medium">Paiement Sécurisé</p>
                  <p className="text-muted-foreground">SSL 256-bit + Stripe</p>
                </div>
                <div className="space-y-2">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-primary" />
                  <p className="font-medium">Satisfaction Garantie</p>
                  <p className="text-muted-foreground">98% de clients satisfaits</p>
                </div>
                <div className="space-y-2">
                  <Lock className="h-8 w-8 mx-auto text-primary" />
                  <p className="font-medium">Données Protégées</p>
                  <p className="text-muted-foreground">Hébergement Suisse 🇨🇭</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Encadré Rabais de Groupe */}
          {!clientData.isFree && (
            <Alert className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <div className="text-3xl">💰</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 text-green-800 dark:text-green-400">
                    💡 Astuce : Économisez avec le rabais de groupe !
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Invitez votre famille, vos amis ou vos collaborateurs à rejoindre WIN WIN Finance et bénéficiez tous d'un rabais automatique !
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs mb-3">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded text-center">
                      <div className="font-bold text-green-600 dark:text-green-400">2 membres</div>
                      <div className="text-muted-foreground">-4%</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded text-center">
                      <div className="font-bold text-green-600 dark:text-green-400">3 membres</div>
                      <div className="text-muted-foreground">-6%</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded text-center">
                      <div className="font-bold text-green-600 dark:text-green-400">4 membres</div>
                      <div className="text-muted-foreground">-8%</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded text-center">
                      <div className="font-bold text-green-600 dark:text-green-400">5 membres</div>
                      <div className="text-muted-foreground">-10%</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded text-center">
                      <div className="font-bold text-green-700 dark:text-green-300">10+ membres</div>
                      <div className="font-bold text-green-700 dark:text-green-300">-20% MAX</div>
                    </div>
                  </div>
                  <a 
                    href="/pricing#rabais-groupe" 
                    className="text-sm font-medium text-green-700 dark:text-green-400 hover:underline inline-flex items-center gap-1"
                  >
                    En savoir plus sur le rabais de groupe
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setLocation("/signature")}
              disabled={isProcessing}
            >
              Retour à la signature
            </Button>
            <Button
              size="lg"
              onClick={clientData.isFree ? handleSkipPayment : handlePayment}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Traitement...
                </>
              ) : (
                <>
                  {clientData.isFree ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Activer mon mandat
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payer CHF {clientData.tarif}.-
                    </>
                  )}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Sécurité */}
          <div className="text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              Connexion sécurisée SSL • Paiement crypté • Conformité PCI DSS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
