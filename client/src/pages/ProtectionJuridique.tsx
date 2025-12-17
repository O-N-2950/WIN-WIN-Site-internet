import { motion } from "framer-motion";
import { Shield, CheckCircle2, Scale, Users, Building2, User, ArrowRight, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Page Protection Juridique
 * Présente la meilleure protection juridique de Suisse avec liens directs
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Image parapluie protection juridique */}
            <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
              <img
                src="/protection-juridique-parapluie.png"
                alt="Protection juridique - Une femme protégée par un parapluie"
                className="max-w-3xl w-full h-auto drop-shadow-2xl rounded-2xl"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Vainqueur du Test Moneyland.ch 10/2024</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6">
              🔒 Protection Juridique
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-4">
              La meilleure protection juridique de Suisse
            </motion.p>

            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl mb-12 font-medium">
              Défendez vos droits. Protégez votre avenir.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 font-bold"
                onClick={() => document.getElementById('winwin-contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Zap className="w-6 h-6 mr-2" />
                Demandez conseil à WIN WIN
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Contexte */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-6">
              Dans un monde où les litiges explosent, où les réglementations se complexifient et où les risques juridiques touchent aussi bien les particuliers que les entreprises, se protéger n'est plus une option… <strong>c'est une nécessité</strong>.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-6">
              C'est exactement pour cela que WIN WIN Finance Group vous conseille <strong>la meilleure protection juridique de Suisse</strong>, désignée <strong className="text-blue-600">Vainqueur du Test Moneyland</strong>.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700">
              Grâce à notre expertise, vous bénéficiez d'un accompagnement complet : analyse de votre situation, conseil personnalisé et souscription au meilleur prix.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section WIN WIN Finance Group - Point de Contact Unique */}
      <section id="winwin-contact" className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-12">
              🤝 Pourquoi passer par WIN WIN Finance Group ?
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20">
                  <div className="text-5xl mb-4">📞</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Votre point de contact unique</h3>
                  <p className="text-lg leading-relaxed text-white">
                    Avant, pendant et <strong>après</strong> la souscription, vous ne parlez qu'à <strong>une seule personne</strong> : WIN WIN Finance Group. Même en cas de sinistre, c'est nous que vous contactez en premier.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Analyse globale de votre situation</h3>
                  <p className="text-lg leading-relaxed text-white">
                    La protection juridique ne vit pas seule. Elle s'intègre dans votre <strong>stratégie financière globale</strong>. Nous analysons votre situation complète avant de recommander la meilleure solution.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20">
                  <div className="text-5xl mb-4">⚖️</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Accompagnement en cas de sinistre</h3>
                  <p className="text-lg leading-relaxed text-white">
                    Vous n'avez pas à gérer seul la relation avec votre assureur. Nous vous <strong>accompagnons à chaque étape</strong>, nous gérons les démarches et vous tenons informé.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Conseil indépendant et personnalisé</h3>
                  <p className="text-lg leading-relaxed text-white">
                    Nous ne vendons pas juste une assurance. Nous <strong>construisons une stratégie</strong> adaptée à vos besoins réels, avec transparence et expertise.
                  </p>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="text-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 font-bold"
                onClick={() => window.location.href = '/contact'}
              >
                <Zap className="w-6 h-6 mr-2" />
                Demandez conseil à WIN WIN
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Avantage Unique */}
      <section className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-12">
              🎯 L'avantage unique de cette protection
            </motion.h2>

            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-400 rounded-3xl p-12 mb-12">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                  Droit privé + Circulation<br />AUTOMATIQUEMENT INCLUS
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl p-6 border-2 border-red-300">
                  <div className="text-4xl mb-3">❌</div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Autres assurances</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Vous devez <strong>choisir</strong> entre :
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-700">
                    <li>• Protection circulation seule</li>
                    <li>• Protection droit privé seule</li>
                    <li>• Payer un supplément pour les deux</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6 border-2 border-green-400">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Notre solution recommandée</h4>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Les deux modules inclus d'office</strong> :
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-700">
                    <li>✓ Protection circulation complète</li>
                    <li>✓ Protection droit privé complète</li>
                    <li>✓ Sans supplément de prix</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">
                  = Une couverture 2-en-1 au prix d'une seule protection
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 3 Offres avec CTA directs */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-4">
              Souscrivez directement en 2 minutes chrono
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl text-center text-gray-600 mb-12">
              Choisissez l'offre adaptée à votre situation
            </motion.p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Offre Particuliers */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full flex flex-col border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-2xl">
                  <div className="text-center mb-6">
                    <User className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-2xl font-bold mb-2">Particuliers</h3>
                    <p className="text-gray-600">Protection complète pour vous et votre famille</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Droit privé + Circulation inclus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Protection famille complète</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Assistance juridique 24/7</span>
                    </li>
                  </ul>

                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open(AFFILIATE_LINKS.particuliers, '_blank')}
                  >
                    Souscrire maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Card>
              </motion.div>

              {/* Offre Ménage */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full flex flex-col border-2 border-blue-400 hover:border-blue-600 transition-all hover:shadow-2xl relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    RECOMMANDÉ
                  </div>

                  <div className="text-center mb-6">
                    <Users className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-2xl font-bold mb-2">Ménage</h3>
                    <p className="text-gray-600">Protection optimale pour votre foyer</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Droit privé + Circulation inclus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Protection logement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Litiges de voisinage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Meilleur rapport qualité/prix</span>
                    </li>
                  </ul>

                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open(AFFILIATE_LINKS.menage, '_blank')}
                  >
                    Souscrire maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Card>
              </motion.div>

              {/* Offre Entreprises */}
              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full flex flex-col border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-2xl">
                  <div className="text-center mb-6">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-2xl font-bold mb-2">Entreprises</h3>
                    <p className="text-gray-600">Protection professionnelle sur mesure</p>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Droit du travail</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Litiges commerciaux</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Protection contractuelle</span>
                    </li>
                  </ul>

                  <Button
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open(AFFILIATE_LINKS.entreprises, '_blank')}
                  >
                    Souscrire maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={fadeInUp} className="text-center mt-12">
              <p className="text-lg text-gray-600 mb-6">
                Vous avez des questions ou besoin d'un conseil personnalisé ?
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => window.location.href = '/contact'}
              >
                Contactez WIN WIN Finance Group
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
