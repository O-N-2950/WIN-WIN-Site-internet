import { motion } from "framer-motion";
import { Shield, CheckCircle2, Scale, Users, Building2, User, ArrowRight, Award, Zap, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Page Protection Juridique WIN WIN
 * Conforme FINMA : Sans mention d'Emilia, liens directs de souscription
 */

const AFFILIATE_LINKS = {
  particuliers: "https://www.emilia.ch/fr/protection-juridique/demande/particuliers/produit?affiliate_id=b9677e78-8a90-4317-aaef-2cf928f7cf80",
  menage: "https://www.emilia.ch/fr/protection-juridique/demande/particuliers/produit?productCode=household&affiliate_id=b9677e78-8a90-4317-aaef-2cf928f7cf80",
  entreprises: "https://www.emilia.ch/fr/protection-juridique/demande/entreprises/produit?affiliate_id=b9677e78-8a90-4317-aaef-2cf928f7cf80",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function ProtectionJuridique() {
  return (
    <div className="min-h-screen">
      {/* Hero Section avec image parapluie */}
      <section className="relative bg-gradient-to-br from-[#3176A6] via-[#4A8FBF] to-[#8CB4D2] text-white py-24 overflow-hidden">
        {/* Image de fond parapluie */}
        <div className="absolute inset-0 opacity-70">
          <img
            src="/protection-juridique-banner.png"
            alt="Protection juridique - Parapluie sous la pluie"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overlay gradient léger */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3176A6]/40 via-[#4A8FBF]/30 to-[#8CB4D2]/20" />

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Protection Juridique</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6">
              Parce que vos droits<br />doivent être respectés
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl mb-12 font-medium">
              Nous recherchons pour vous les meilleures protections juridiques du marché suisse
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-white text-[#3176A6] hover:bg-gray-100 text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 font-bold"
                onClick={() => document.getElementById('winwin-contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Phone className="w-6 h-6 mr-2" />
                Demandez conseil à WIN WIN
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Pourquoi une protection juridique */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#3176A6]">
              Pourquoi souscrire une protection juridique ?
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-8 text-center max-w-4xl mx-auto">
              Les conflits juridiques peuvent survenir à tout moment : litiges avec un employeur, problèmes de logement, accidents de la route, arnaques en ligne... Les frais d'avocat peuvent rapidement atteindre plusieurs milliers de francs.
            </motion.p>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="p-6 text-center border-2 border-[#3176A6]/20 hover:border-[#3176A6] transition-all duration-300">
                <div className="text-4xl mb-3">⚖️</div>
                <h4 className="text-xl font-bold mb-2 text-[#3176A6]">Conseils juridiques</h4>
                <p className="text-gray-700">Assistance téléphonique et analyses de votre situation</p>
              </Card>

              <Card className="p-6 text-center border-2 border-[#3176A6]/20 hover:border-[#3176A6] transition-all duration-300">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="text-xl font-bold mb-2 text-[#3176A6]">Prise en charge des frais</h4>
                <p className="text-gray-700">Avocats, tribunaux, expertises jusqu'à CHF 600'000</p>
              </Card>

              <Card className="p-6 text-center border-2 border-[#3176A6]/20 hover:border-[#3176A6] transition-all duration-300">
                <div className="text-4xl mb-3">🛡️</div>
                <h4 className="text-xl font-bold mb-2 text-[#3176A6]">Défense de vos droits</h4>
                <p className="text-gray-700">Experts qui se battent pour vous</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Domaines couverts */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#3176A6]">
              Domaines couverts
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Scale,
                  title: "Droit privé",
                  description: "Emploi, logement, contrats, biens, voisinage, consommation, numérique, finances...",
                  color: "text-[#3176A6]",
                },
                {
                  icon: Shield,
                  title: "Circulation routière",
                  description: "Accidents, amendes, retraits de permis, litiges avec assurances, transports publics...",
                  color: "text-[#8CB4D2]",
                },
                {
                  icon: Users,
                  title: "Protection familiale",
                  description: "Couverture étendue pour toute la famille avec un seul contrat adapté.",
                  color: "text-[#3176A6]",
                },
                {
                  icon: Building2,
                  title: "Protection professionnelle",
                  description: "Solutions puissantes pour indépendants, PME et entrepreneurs.",
                  color: "text-[#8CB4D2]",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-[#3176A6]">
                    <item.icon className={`w-16 h-16 ${item.color} mb-6`} />
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Souscription directe */}
      <section id="souscription" className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-6 text-[#3176A6]">
              ✔️ Souscription directe
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-center text-gray-700 mb-4">
              Vous pouvez souscrire directement en ligne en 2 minutes
            </motion.p>

            <motion.p variants={fadeInUp} className="text-base text-center text-gray-600 mb-12">
              <strong>Recommandation</strong> : Contactez WIN WIN Finance Group pour une analyse globale de votre situation avant de souscrire.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: User,
                  title: "Particuliers",
                  subtitle: "Protection individuelle",
                  description: "Couverture complète pour vous protéger dans tous les litiges du quotidien.",
                  link: AFFILIATE_LINKS.particuliers,
                  color: "from-blue-500 to-blue-600",
                  hoverColor: "hover:from-blue-600 hover:to-blue-700",
                },
                {
                  icon: Users,
                  title: "Ménage",
                  subtitle: "Protection familiale",
                  description: "Protégez toute votre famille avec une couverture étendue et adaptée.",
                  link: AFFILIATE_LINKS.menage,
                  color: "from-[#3176A6] to-[#4A8FBF]",
                  hoverColor: "hover:from-[#4A8FBF] hover:to-[#3176A6]",
                  featured: true,
                },
                {
                  icon: Building2,
                  title: "Entreprises",
                  subtitle: "Protection professionnelle",
                  description: "Solutions juridiques puissantes pour indépendants, PME et entrepreneurs.",
                  link: AFFILIATE_LINKS.entreprises,
                  color: "from-green-500 to-green-600",
                  hoverColor: "hover:from-green-600 hover:to-green-700",
                },
              ].map((offer, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={offer.featured ? "md:-mt-4" : ""}
                >
                  <Card className={`p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${offer.featured ? "border-4 border-[#3176A6] scale-105" : "border-2"}`}>
                    {offer.featured && (
                      <div className="bg-[#3176A6] text-white font-bold text-center py-2 -mx-8 -mt-8 mb-6 rounded-t-lg">
                        ⭐ RECOMMANDÉ
                      </div>
                    )}

                    <div className={`w-20 h-20 bg-gradient-to-br ${offer.color} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
                      <offer.icon className="w-10 h-10 text-white" />
                    </div>

                    <h3 className="text-3xl font-bold text-center mb-2">{offer.title}</h3>
                    <p className="text-lg text-gray-600 text-center mb-6">{offer.subtitle}</p>
                    <p className="text-base text-gray-700 text-center mb-8 leading-relaxed">{offer.description}</p>

                    <Button
                      size="lg"
                      className={`w-full bg-gradient-to-r ${offer.color} ${offer.hoverColor} text-white text-xl py-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
                      onClick={() => window.open(offer.link, '_blank')}
                    >
                      <Shield className="w-6 h-6 mr-2" />
                      Souscrire maintenant
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section Finale CTA WIN WIN */}
      <section id="winwin-contact" className="py-20 bg-gradient-to-br from-[#3176A6] to-[#4A8FBF] text-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-8">
              🎯 Besoin de conseils personnalisés ?
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl mb-6">
              WIN WIN Finance Group analyse votre situation et vous recommande la meilleure protection juridique adaptée à vos besoins.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl font-bold mb-12">
              Analyse gratuite • Sans engagement • Réponse rapide
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#3176A6] hover:bg-gray-100 text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 font-bold"
                onClick={() => window.location.href = '/contact'}
              >
                <Phone className="w-6 h-6 mr-2" />
                Demandez conseil
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3176A6] text-xl px-12 py-8 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 font-bold"
                onClick={() => window.location.href = '/'}
              >
                <FileText className="w-6 h-6 mr-2" />
                Retour à l'accueil
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
