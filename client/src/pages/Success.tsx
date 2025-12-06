import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles, Share2 } from "lucide-react";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Success() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [codeParrainage, setCodeParrainage] = useState("");

  // Récupérer l'email depuis l'URL (Stripe redirige avec ?email=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    
    if (!emailParam) {
      toast.error("Email manquant. Retour à l'accueil.");
      navigate("/");
      return;
    }
    
    setEmail(emailParam);
  }, [navigate]);

  // Récupérer le code de parrainage depuis Airtable
  const getPriceMutation = trpc.client.getStripePrice.useMutation();

  useEffect(() => {
    if (!email) return;

    // Récupérer les infos du client (incluant le code de parrainage)
    getPriceMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          // Le code de parrainage est généré automatiquement dans Airtable
          // On peut l'extraire du groupeFamilial ou le récupérer directement
          // Pour l'instant, on génère un code temporaire (TODO: récupérer depuis Airtable)
          const code = data.groupeFamilial.replace("FAMILLE-", "") || "DEMO-1234";
          setCodeParrainage(code);
        },
        onError: (error) => {
          console.error("Erreur lors de la récupération du code:", error);
          setCodeParrainage("DEMO-1234"); // Fallback
        },
      }
    );
  }, [email]);

  // Effet de confettis à l'arrivée
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["#3176A6", "#8CB4D2", "#D4AF37", "#10b981"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const handleWhatsAppShare = () => {
    const message = `🎉 Je viens de passer chez WIN WIN Finance Group, j'ai économisé sur mes assurances ! 

Utilise mon code ${codeParrainage} pour avoir un rabais toi aussi : https://www.winwin.swiss/questionnaire

Plus on est nombreux, plus on économise (jusqu'à 20% de rabais) ! 💰`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeParrainage);
    toast.success("Code copié dans le presse-papiers !");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-4 border-green-500">
          {/* Icône de succès animée */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
              <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>

          {/* Message de félicitations */}
          <h1 className="text-4xl md:text-5xl font-bold text-center text-primary mb-4">
            Félicitations ! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-center text-gray-700 mb-8">
            Vous êtes officiellement client <span className="font-bold text-primary">WIN WIN Finance Group</span>
          </p>

          {/* Séparateur */}
          <div className="border-t-2 border-gray-200 my-8"></div>

          {/* Section Code de Parrainage VIRAL */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 mb-8 border-2 border-green-500">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Share2 className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-green-800">
                Partagez et Économisez Encore Plus !
              </h2>
            </div>
            
            <p className="text-center text-gray-700 mb-6">
              Plus vous parrainez de proches, plus vous économisez (jusqu'à <span className="font-bold text-green-600">20% de rabais</span>) !
            </p>

            {/* Code de parrainage GÉANT */}
            <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-500 shadow-lg">
              <p className="text-sm text-gray-600 text-center mb-2">Votre code de parrainage :</p>
              <div className="flex items-center justify-center gap-4">
                <p className="text-5xl md:text-6xl font-black text-green-600 tracking-wider">
                  {codeParrainage || "Chargement..."}
                </p>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Copier
                </Button>
              </div>
            </div>

            {/* Bouton WhatsApp VIRAL */}
            <Button
              onClick={handleWhatsAppShare}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Share2 className="w-6 h-6 mr-2" />
              Partager sur WhatsApp
            </Button>

            <p className="text-sm text-center text-gray-600 mt-4">
              💡 <span className="font-semibold">Astuce :</span> Partagez avec vos proches, amis, collègues... Plus vous êtes nombreux, plus vous économisez !
            </p>
          </div>

          {/* Séparateur */}
          <div className="border-t-2 border-gray-200 my-8"></div>

          {/* Prochaines étapes */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border-2 border-primary">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              Prochaines étapes
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Vous recevrez votre <span className="font-semibold">mandat contresigné</span> par email dans quelques minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Un email de <span className="font-semibold">confirmation de paiement</span> vous sera également envoyé</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span>Notre équipe vous contactera sous <span className="font-semibold">48h</span> pour planifier l'analyse de vos contrats</span>
              </li>
            </ul>
          </div>

          {/* Bouton retour à l'accueil */}
          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="w-full text-lg py-6 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Retour à l'accueil
            </Button>
          </Link>
        </div>

        {/* Message de remerciement */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Merci de votre confiance ! 🙏 L'équipe WIN WIN Finance Group
        </p>
      </div>
    </div>
  );
}
