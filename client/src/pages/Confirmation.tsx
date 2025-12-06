import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  Copy,
  Share2,
  Mail,
  MessageCircle,
  Gift,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { APP_TITLE } from "@/const";
import { useWorkflow } from "@/contexts/WorkflowContext";
import { Link } from "wouter";

export default function Confirmation() {
  const { workflow } = useWorkflow();
  const [copied, setCopied] = useState(false);

  // Générer le code de parrainage basé sur le nom du client
  const generateReferralCode = () => {
    if (!workflow.firstName || !workflow.lastName) return "WINWIN-0000";
    const lastName = workflow.lastName.toUpperCase().replace(/[^A-Z]/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${lastName}-${randomNum}`;
  };

  const referralCode = generateReferralCode();
  const referralLink = `https://www.winwin.swiss/devenir-client?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Code de parrainage copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Lien de parrainage copié !");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Rejoignez ${APP_TITLE} avec mon code de parrainage`);
    const body = encodeURIComponent(
      `Bonjour,\n\nJe vous invite à rejoindre ${APP_TITLE} pour la gestion de vos assurances.\n\nUtilisez mon code de parrainage : ${referralCode}\nOu cliquez directement sur ce lien : ${referralLink}\n\nVous bénéficierez d'un service professionnel et nous profiterons tous les deux d'un rabais familial !\n\nÀ bientôt,\n${workflow.firstName} ${workflow.lastName}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Rejoignez ${APP_TITLE} avec mon code de parrainage ${referralCode} et bénéficiez d'un rabais familial ! ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Tableau des rabais
  const discountTable = [
    { members: 1, discount: "0%", price: "CHF 185.-" },
    { members: 2, discount: "2%", price: "CHF 181.30" },
    { members: 3, discount: "4%", price: "CHF 177.60" },
    { members: 4, discount: "6%", price: "CHF 173.90" },
    { members: 5, discount: "8%", price: "CHF 170.20" },
    { members: 6, discount: "10%", price: "CHF 166.50" },
    { members: 7, discount: "12%", price: "CHF 162.80" },
    { members: 8, discount: "14%", price: "CHF 159.10" },
    { members: 9, discount: "16%", price: "CHF 155.40" },
    { members: 10, discount: "18%", price: "CHF 151.70" },
    { members: "11+", discount: "20%", price: "CHF 148.-" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="container max-w-4xl">
        {/* Confirmation de paiement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 mb-6">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue chez {APP_TITLE} ! 🎉
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre mandat de gestion est maintenant actif
          </p>
        </motion.div>

        {/* Section Parrainage Familial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 mb-8 border-2 border-primary/20 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Rabais Familial WIN WIN</h2>
                <p className="text-muted-foreground">
                  Partagez avec votre famille et économisez ensemble
                </p>
              </div>
            </div>

            {/* Explication du système */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Gift className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Comment ça marche ?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Invitez les membres de votre famille à rejoindre {APP_TITLE} avec votre code de parrainage unique.
                    <strong className="text-foreground"> Chaque membre supplémentaire vous fait bénéficier de 2% de rabais</strong>, jusqu'à un maximum de 20% (10 membres ou plus).
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-600">
                      Le rabais s'applique automatiquement sur votre mandat annuel
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Code de parrainage */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Votre code de parrainage unique
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={referralCode}
                    readOnly
                    className="w-full h-14 px-6 text-2xl font-mono font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl border-0 focus:ring-4 focus:ring-primary/20"
                  />
                  <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/80" />
                </div>
                <Button
                  size="lg"
                  variant={copied ? "default" : "outline"}
                  onClick={handleCopyCode}
                  className="h-14 px-6"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5 mr-2" />
                      Copier
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Boutons de partage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="h-12"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Copier le lien
              </Button>
              <Button
                variant="outline"
                onClick={handleShareEmail}
                className="h-12"
              >
                <Mail className="w-5 h-5 mr-2" />
                Partager par email
              </Button>
              <Button
                variant="outline"
                onClick={handleShareWhatsApp}
                className="h-12"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Partager sur WhatsApp
              </Button>
            </div>

            {/* Tableau des rabais */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                Tableau des rabais familiaux
              </h3>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Membres du groupe
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Rabais
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Prix par membre/an
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {discountTable.map((row, index) => (
                      <tr
                        key={index}
                        className={
                          row.members === "11+"
                            ? "bg-green-50 dark:bg-green-950/20"
                            : "hover:bg-muted/30"
                        }
                      >
                        <td className="px-4 py-3 font-medium">{row.members}</td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              row.members === "11+"
                                ? "font-bold text-green-600"
                                : ""
                            }
                          >
                            {row.discount}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                * Tarif de base pour clients privés &gt; 22 ans : CHF 185.-/an
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <Button variant="outline" size="lg">
              Retour à l'accueil
            </Button>
          </Link>
          <Button size="lg" asChild>
            <a href="tel:0324661100">
              Contactez-nous : 032 466 11 00
            </a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
