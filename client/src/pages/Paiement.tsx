import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  CreditCard, 
  Shield, 
  Info,
  ArrowRight,
  Lock,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Share2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Paiement() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
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

  // Générer le code de parrainage au chargement
  useEffect(() => {
    if (workflow.clientName && !referralCode) {
      // Générer le code basé sur le nom (format: DUPO-1234)
      const nom = workflow.clientName.split(' ')[0]; // Prendre le premier mot
      const cleanNom = nom
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Enlever accents
        .replace(/[^a-zA-Z]/g, '') // Garder que lettres
        .toUpperCase()
        .slice(0, 4)
        .padEnd(4, 'X'); // Si nom < 4 lettres, compléter avec X
      
      // Générer 4 caractères aléatoires
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomPart = '';
      for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      const code = `${cleanNom}-${randomPart}`;
      setReferralCode(code);
      
      // Sauvegarder dans le workflow
      updateWorkflow({ referralCode: code });
    }
  }, [workflow.clientName, referralCode, updateWorkflow]);

  // Calculer les économies en CHF pour chaque palier
  const calculateSavings = (members: number) => {
    let discount = 0;
    if (members === 2) discount = 4;
    else if (members === 3) discount = 6;
    else if (members === 4) discount = 8;
    else if (members === 5) discount = 10;
    else if (members >= 10) discount = 20;
    
    const savings = (clientData.tarif * discount) / 100;
    return { discount, savings: savings.toFixed(2) };
  };

  // Copier le code de parrainage
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('✅ Code copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 3000);
  };

  // Partager via WhatsApp
  const handleShareWhatsApp = () => {
    const referralLink = `https://www.winwin.swiss/questionnaire-info?ref=${referralCode}`;
    const text = encodeURIComponent(
      `🎯 Salut !\n\nJe viens de trouver LA solution pour mes assurances : WIN WIN Finance Group.\n\n✅ Conseiller neutre et honnête (pas de commission cachée)\n✅ Ils optimisent TOUTES mes assurances\n✅ Gain de temps énorme (ils gèrent tout)\n\nJe te partage mon code de parrainage : *${referralCode}*\n\n👉 On profitera tous les deux d'un rabais familial automatique !\n\nClique ici : ${referralLink}\n\nFranchement, ça vaut le coup. 💪`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Partager via SMS
  const handleShareSMS = () => {
    const referralLink = `https://www.winwin.swiss/questionnaire-info?ref=${referralCode}`;
    const message = `🎯 J'ai trouvé LA solution pour mes assurances : WIN WIN Finance Group (conseiller neutre, optimisation complète). Mon code : ${referralCode} - On profite tous les deux du rabais ! ${referralLink}`;
    const url = `sms:?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  // Partager via Email
  const handleShareEmail = () => {
    const referralLink = `https://www.winwin.swiss/questionnaire-info?ref=${referralCode}`;
    const firstName = workflow.clientName?.split(' ')[0] || '';
    const lastName = workflow.clientName?.split(' ').slice(1).join(' ') || '';
    
    const subject = encodeURIComponent(`🎯 J'ai trouvé LA solution pour mes assurances`);
    const body = encodeURIComponent(
      `Salut,\n\nJe viens de trouver LA solution pour mes assurances et je voulais te la partager : WIN WIN Finance Group.\n\nPourquoi je te recommande ?\n\n✅ Conseiller NEUTRE et honnête (pas de commission cachée)\n✅ Ils optimisent TOUTES mes assurances (santé, prévoyance, patrimoine)\n✅ Gain de temps énorme (ils gèrent tout pour moi)\n✅ Enfin quelqu'un qui me conseille vraiment, sans conflit d'intérêt\n\nBonus : avec mon code de parrainage, on profite tous les deux d'un rabais familial automatique !\n\n🎫 Mon code : ${referralCode}\n🔗 Lien direct : ${referralLink}\n\nFranchement, ça vaut vraiment le coup. Je te rends service en te partageant ça. 💪\n\nÀ bientôt,\n${firstName} ${lastName}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
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
    } catch (error: any) {
      console.error("❌ Erreur lors de la création de la session de paiement:", error);
      
      // Message d'erreur plus explicite
      const errorMessage = error?.message || "Erreur lors du paiement. Veuillez réessayer.";
      
      if (errorMessage.includes('Configuration Stripe manquante')) {
        toast.error("⚠️ Configuration Stripe manquante. Veuillez contacter le support.");
      } else if (errorMessage.includes('No such price')) {
        toast.error("⚠️ Tarif invalide. Veuillez contacter le support.");
      } else {
        toast.error(`❌ ${errorMessage}`);
      }
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

          {/* Section Rabais de Groupe VIRALE */}
          {!clientData.isFree && referralCode && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/40 dark:via-green-950/40 dark:to-teal-950/40 border-2 border-emerald-300 dark:border-emerald-700 shadow-2xl">
              {/* Décoration de fond animée */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-300/30 dark:bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-300/30 dark:bg-green-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="relative p-8">
                {/* En-tête WAOUH */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm mb-4 shadow-lg animate-bounce">
                    <span className="text-2xl">🎁</span>
                    <span>OFFRE SPÉCIALE PARRAINAGE</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-3">
                    Économise avec tes proches !
                  </h3>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    Partage ton code et profitez <strong>tous ensemble</strong> du rabais familial
                  </p>

                  {/* Code de parrainage GÉANT */}
                  <div className="inline-block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-emerald-400 dark:border-emerald-600 mb-6">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      TON CODE DE PARRAINAGE
                    </div>
                    <div className="text-5xl md:text-6xl font-black text-emerald-600 dark:text-emerald-400 tracking-wider font-mono">
                      {referralCode}
                    </div>
                  </div>
                </div>

                {/* Tableau des économies EN CHF */}
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-200">
                    💰 Tes économies potentielles
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { membres: 2, rabais: 4 },
                      { membres: 3, rabais: 6 },
                      { membres: 4, rabais: 8 },
                      { membres: 5, rabais: 10 },
                      { membres: 10, rabais: 20 }
                    ].map((item) => {
                      const { discount, savings } = calculateSavings(item.membres);
                      const isMax = item.membres === 10;
                      
                      return (
                        <div
                          key={item.membres}
                          className={`
                            relative rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-110 hover:shadow-2xl
                            ${
                              isMax
                                ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 text-white shadow-xl'
                                : 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/50 dark:to-green-900/50 border-2 border-emerald-300 dark:border-emerald-700'
                            }
                          `}
                        >
                          {isMax && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                              MAX !
                            </div>
                          )}
                          
                          <div className={`text-3xl font-black mb-1 ${isMax ? 'text-white' : 'text-emerald-700 dark:text-emerald-400'}`}>
                            {item.membres}+
                          </div>
                          <div className={`text-xs font-medium mb-2 ${isMax ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                            {item.membres === 10 ? 'membres' : 'amis'}
                          </div>
                          <div className={`text-2xl font-black mb-1 ${isMax ? 'text-white drop-shadow-lg' : 'text-green-600 dark:text-green-400'}`}>
                            -{discount}%
                          </div>
                          <div className={`text-sm font-bold ${isMax ? 'text-white' : 'text-emerald-700 dark:text-emerald-300'}`}>
                            {savings} CHF/an
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    💡 Plus vous êtes nombreux, plus vous économisez !
                  </div>
                </div>

                {/* Boutons de partage ULTRA-VISIBLES */}
                <div className="space-y-3">
                  <div className="text-center font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
                    🚀 Partage ton code maintenant :
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* WhatsApp */}
                    <Button
                      onClick={handleShareWhatsApp}
                      className="h-16 text-lg font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <MessageCircle className="h-6 w-6 mr-3" />
                      Partager sur WhatsApp
                    </Button>

                    {/* SMS */}
                    <Button
                      onClick={handleShareSMS}
                      className="h-16 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <MessageCircle className="h-6 w-6 mr-3" />
                      Partager par SMS
                    </Button>

                    {/* Email */}
                    <Button
                      onClick={handleShareEmail}
                      className="h-16 text-lg font-bold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Mail className="h-6 w-6 mr-3" />
                      Partager par Email
                    </Button>

                    {/* Copier le code */}
                    <Button
                      onClick={handleCopyCode}
                      variant="outline"
                      className="h-16 text-lg font-bold border-2 border-emerald-500 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {copied ? (
                        <>
                          <Check className="h-6 w-6 mr-3 text-green-600" />
                          Code copié !
                        </>
                      ) : (
                        <>
                          <Copy className="h-6 w-6 mr-3" />
                          Copier mon code
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Message motivant */}
                <div className="mt-6 text-center bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-700 dark:to-green-700 text-white rounded-xl p-4 shadow-lg">
                  <p className="font-bold text-lg">
                    🎯 Chaque ami qui rejoint = plus d'économies pour tous !
                  </p>
                  <p className="text-sm mt-1 opacity-90">
                    Partage dès maintenant et commence à économiser ensemble 💪
                  </p>
                </div>
              </div>
            </div>
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
