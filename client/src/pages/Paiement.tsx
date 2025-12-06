import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, Users, TrendingDown, Share2, Copy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

/**
 * Page de Paiement avec Prix Dynamique + Code de Parrainage
 * 
 * Fonctionnalités :
 * - Calcul automatique du rabais familial
 * - Affichage visuel du prix (barré si rabais)
 * - Code de parrainage réel depuis Airtable
 * - Boutons de partage viral
 */

export default function Paiement() {
  const [, params] = useRoute("/paiement/:email");
  const [, navigate] = useLocation();
  
  const email = params?.email || "";
  
  // État local
  const [prixInfo, setPrixInfo] = useState<any>(null);
  const [codeParrainage, setCodeParrainage] = useState("");
  
  // Mutations tRPC
  const getPriceMutation = trpc.client.getStripePrice.useMutation();
  const createCheckoutMutation = trpc.workflow.createCheckoutSession.useMutation();
  
  useEffect(() => {
    if (!email) {
      toast.error("Email manquant. Retour au questionnaire.");
      navigate("/questionnaire");
      return;
    }
    
    // Charger le prix dynamique
    loadPriceInfo();
  }, [email]);
  
  const loadPriceInfo = async () => {
    try {
      const result = await getPriceMutation.mutateAsync({ email });
      setPrixInfo(result);
      
      // Générer le code de parrainage (format : PRENOM-XXX)
      // TODO: Récupérer le vrai code depuis Airtable
      const code = result.groupeFamilial.replace("FAMILLE-", "");
      setCodeParrainage(code);
      
      console.log("✅ Prix calculé:", result);
    } catch (error) {
      console.error("Erreur lors du calcul du prix:", error);
      toast.error("Impossible de calculer le prix. Veuillez réessayer.");
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeParrainage);
    toast.success("Code copié dans le presse-papier !");
  };
  
  const handleShare = (platform: string) => {
    const message = `🎁 J'ai trouvé LA solution pour mes assurances !
WIN WIN Finance Group m'a fait gagner du temps ET de l'argent.
✅ Conseiller neutre et honnête
✅ Ils optimisent TOUTES mes assurances
👉 Utilise mon code : ${codeParrainage}`;
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://winwin-finance.ch/questionnaire?ref=${codeParrainage}`;
    
    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedMessage}%20${url}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${url}&text=${encodedMessage}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=Découvre WIN WIN Finance&body=${encodedMessage}%20${url}`;
        break;
      case "sms":
        shareUrl = `sms:?body=${encodedMessage}%20${url}`;
        break;
    }
    
    window.open(shareUrl, "_blank");
  };
  
  const handlePayment = async () => {
    try {
      toast.info("Création de la session de paiement...");
      
      const result = await createCheckoutMutation.mutateAsync({
        email,
        clientName: prixInfo.groupeFamilial, // TODO: Récupérer le vrai nom du client
      });
      
      // Redirection vers Stripe
      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Erreur lors de la création de la session Stripe:", error);
      toast.error("Impossible de créer la session de paiement. Veuillez réessayer.");
    }
  };
  
  if (!prixInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Calcul du prix en cours...</p>
        </div>
      </div>
    );
  }
  
  const hasDiscount = prixInfo.rabaisPourcent > 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Finalisez votre inscription
          </h1>
          <p className="text-lg text-muted-foreground">
            Votre mandat de courtage WIN WIN Finance
          </p>
        </motion.div>
        
        {/* Carte principale */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 mb-8">
            {/* Récapitulatif du prix */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Check className="h-6 w-6 text-green-600" />
                Récapitulatif
              </h2>
              
              <div className="space-y-4">
                {/* Prix de base */}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Prix de base :</span>
                  <span className={hasDiscount ? "line-through text-muted-foreground" : "text-2xl font-bold"}>
                    {prixInfo.prixBase.toFixed(2)} CHF
                  </span>
                </div>
                
                {/* Rabais (si applicable) */}
                {hasDiscount && (
                  <>
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center gap-2">
                        <TrendingDown className="h-5 w-5" />
                        Rabais Groupe appliqué ({prixInfo.nbMembres} membre{prixInfo.nbMembres > 1 ? 's' : ''}) :
                      </span>
                      <span className="font-semibold">-{prixInfo.rabaisPourcent}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-green-600">
                      <span>Économie :</span>
                      <span className="font-semibold">-{prixInfo.economie.toFixed(2)} CHF</span>
                    </div>
                    
                    <div className="h-px bg-border my-4" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Prix final :</span>
                      <span className="text-3xl font-bold text-green-600">
                        {prixInfo.prixFinal.toFixed(2)} CHF
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Badge groupe */}
              {hasDiscount && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-900 dark:text-green-100 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <strong>Groupe familial :</strong> {prixInfo.groupeFamilial}
                  </p>
                </div>
              )}
            </div>
            
            {/* Bouton de paiement */}
            <Button
              onClick={handlePayment}
              size="lg"
              className="w-full text-lg py-6"
            >
              Procéder au paiement ({prixInfo.prixFinal.toFixed(2)} CHF)
            </Button>
          </Card>
        </motion.div>
        
        {/* Code de parrainage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Share2 className="h-6 w-6 text-primary" />
                Votre code de parrainage
              </h2>
              <p className="text-muted-foreground">
                Partagez-le avec vos proches pour augmenter votre rabais !
              </p>
            </div>
            
            {/* Code géant */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 mb-6 border-2 border-primary/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Votre code :</p>
                  <p className="text-4xl md:text-5xl font-bold text-primary tracking-wider">
                    {codeParrainage}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="shrink-0"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Tableau des économies */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Membres</th>
                    <th className="text-right py-2">Rabais</th>
                    <th className="text-right py-2">Prix</th>
                    <th className="text-right py-2">Économie</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { membres: 2, rabais: 4, prix: 177.60, economie: 7.40 },
                    { membres: 3, rabais: 6, prix: 173.90, economie: 11.10 },
                    { membres: 4, rabais: 8, prix: 170.20, economie: 14.80 },
                    { membres: 5, rabais: 10, prix: 166.50, economie: 18.50 },
                    { membres: 10, rabais: 20, prix: 148.00, economie: 37.00 },
                  ].map((row) => (
                    <tr
                      key={row.membres}
                      className={`border-b ${prixInfo.nbMembres === row.membres ? 'bg-green-50 dark:bg-green-950/30 font-semibold' : ''}`}
                    >
                      <td className="py-2">{row.membres} membres</td>
                      <td className="text-right text-green-600">-{row.rabais}%</td>
                      <td className="text-right">{row.prix.toFixed(2)} CHF</td>
                      <td className="text-right text-green-600">-{row.economie.toFixed(2)} CHF</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Boutons de partage */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                className="gap-2"
              >
                <span className="text-xl">📱</span>
                WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("telegram")}
                className="gap-2"
              >
                <span className="text-xl">✈️</span>
                Telegram
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("email")}
                className="gap-2"
              >
                <span className="text-xl">📧</span>
                Email
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("sms")}
                className="gap-2"
              >
                <span className="text-xl">💬</span>
                SMS
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
