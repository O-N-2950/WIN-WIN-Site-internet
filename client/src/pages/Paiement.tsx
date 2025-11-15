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

export default function Paiement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  // Données simulées (à remplacer par les vraies données du questionnaire)
  const clientData = {
    type: "particulier",
    age: 25,
    tarif: 185,
    isFree: false // true si "Mandat offert"
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // TODO: Créer Stripe Checkout Session via tRPC
      // const session = await trpc.stripe.createCheckoutSession.mutate({
      //   priceId: "price_xxx", // ID du produit Stripe selon le tarif
      //   successUrl: `${window.location.origin}/merci`,
      //   cancelUrl: `${window.location.origin}/paiement`
      // });
      
      // Redirection vers Stripe Checkout
      // window.location.href = session.url;

      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLocation("/merci");
    } catch (error) {
      console.error("Erreur lors de la création de la session de paiement:", error);
      alert("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkipPayment = async () => {
    // Pour les mandats offerts (gratuits)
    setIsProcessing(true);

    try {
      // TODO: Créer le client dans Airtable sans paiement
      // await trpc.client.createFree.mutate({ ... });

      // Simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLocation("/merci");
    } catch (error) {
      console.error("Erreur lors de la création du client:", error);
      alert("Erreur. Veuillez réessayer.");
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
                      {clientData.type === "particulier" 
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
