import { motion } from "framer-motion";
import { Shield, CheckCircle2, Scale, Users, Building2, User, ArrowRight, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Page Protection Juridique Emilia
 * Présente les 3 offres Emilia avec liens d'affiliation
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
      {/* Hero Section avec image Vainqueur */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 text-gray-900 py-24 overflow-hidden">
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
            {/* Badge Vainqueur */}
            <motion.div variants={fadeInUp} className="mb-8 flex justify-center">
              <img
                src="/emilia-banner.png"
                alt="Emilia, vainqueur du test Moneyland.ch"
                className="max-w-2xl w-full h-auto drop-shadow-2xl"
              />
            </motion.div>

            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Vainqueur du Test Moneyland.ch 10/2024</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold mb-6">
              🔒 Emilia
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
                className="bg-gray-900 text-yellow-400 hover:bg-gray-800 text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
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
              C'est exactement pour cela qu'existe <strong>Emilia</strong>, la protection juridique la mieux notée de Suisse, désignée <strong className="text-yellow-600">Vainqueur du Test Moneyland</strong>.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700">
              Et aujourd'hui, grâce au partenariat de <strong>WIN WIN Finance Group</strong> avec Emilia, vous bénéficiez d'un accompagnement complet : analyse de votre situation, conseil personnalisé et souscription au meilleur prix.
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
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-primary">
                  <div className="text-5xl mb-4">📞</div>
                  <h3 className="text-2xl font-bold mb-4">Votre point de contact unique</h3>
                  <p className="text-lg leading-relaxed">
                    Avant, pendant et <strong>après</strong> la souscription, vous ne parlez qu'à <strong>une seule personne</strong> : WIN WIN Finance Group. Même en cas de sinistre, c'est nous que vous contactez en premier.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-primary">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-2xl font-bold mb-4">Analyse globale de votre situation</h3>
                  <p className="text-lg leading-relaxed">
                    La protection juridique ne vit pas seule. Elle s'intègre dans votre <strong>stratégie financière globale</strong>. Nous analysons votre situation complète avant de recommander Emilia.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-primary">
                  <div className="text-5xl mb-4">⚖️</div>
                  <h3 className="text-2xl font-bold mb-4">Accompagnement en cas de sinistre</h3>
                  <p className="text-lg leading-relaxed">
                    Vous n'avez pas à gérer seul la relation avec Emilia. Nous vous <strong>accompagnons à chaque étape</strong>, nous gérons les démarches et vous tenons informé.
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="p-8 h-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-primary">
                  <div className="text-5xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold mb-4">Conseil indépendant et personnalisé</h3>
                  <p className="text-lg leading-relaxed">
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

      {/* Section Avantage Unique Emilia */}
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
              🎯 L'avantage unique d'Emilia
            </motion.h2>

            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-4 border-yellow-400 rounded-3xl p-12 mb-12">
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
                  <ul className="mt-3 space-y-2 text-gray-700">
                    <li>• Droit privé <strong>OU</strong></li>
                    <li>• Circulation <strong>OU</strong></li>
                    <li>• Payer un <strong>supplément</strong> pour avoir les deux</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-400">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="text-xl font-bold mb-3 text-gray-900">Emilia</h4>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>LES DEUX sont automatiquement inclus</strong> dans le prix de base :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Droit privé (emploi, logement, contrats, biens, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>Circulation routière et transports publics</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-xl md:text-2xl font-bold text-center text-gray-900">
                💰 Prix : <span className="text-yellow-600">CHF 252.-/an</span> pour une personne seule<br />
                <span className="text-lg font-normal text-gray-700">(CHF 294.-/an pour un ménage)</span>
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h4 className="text-xl font-bold mb-2">Vainqueur du test</h4>
                <p className="text-gray-700">Moneyland.ch 10/2024</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">💵</div>
                <h4 className="text-xl font-bold mb-2">Jusqu'à CHF 600'000</h4>
                <p className="text-gray-700">de couverture en Suisse</p>
              </Card>

              <Card className="p-6 text-center">
                <div className="text-4xl mb-3">⏱️</div>
                <h4 className="text-xl font-bold mb-2">Réponse 24h</h4>
                <p className="text-gray-700">en semaine</p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Pourquoi Emilia */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-16">
              ⭐ Pourquoi choisir Emilia ?
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  icon: Award,
                  title: "La protection juridique n°1 en Suisse",
                  description: "Évaluée et consacrée par Moneyland, Emilia offre une couverture extrêmement complète, fiable et transparente.",
                  color: "text-yellow-600",
                },
                {
                  icon: Zap,
                  title: "Une assistance rapide, moderne et efficace",
                  description: "Emilia vous accompagne dans tous les litiges du quotidien : travail, logement, contrats, circulation, numérique, finances, voisinage, consommation… et bien plus encore.",
                  color: "text-blue-600",
                },
                {
                  icon: Users,
                  title: "Une prise en charge adaptée aux particuliers et aux entreprises",
                  description: "Parce que les défis juridiques ne concernent pas que le privé : Emilia propose également des solutions puissantes pour les indépendants, PME et entrepreneurs.",
                  color: "text-green-600",
                },
                {
                  icon: Scale,
                  title: "Des experts qui se battent réellement pour vous",
                  description: "Votre temps est précieux. Votre sérénité encore plus. Emilia se charge du reste : conseils, analyses, soutien, prise en charge des coûts, défense de vos droits.",
                  color: "text-purple-600",
                },
              ].map((item, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-yellow-400">
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

      {/* Section Pourquoi maintenant */}
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
              🔥 Pourquoi souscrire maintenant ?
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700 mb-8">
              Nous vivons une époque où les conflits se multiplient :
            </motion.p>

            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-4 mb-12">
              {[
                "Litiges avec un employeur ou un collaborateur",
                "Problèmes avec un bailleur ou un locataire",
                "Achats en ligne frauduleux",
                "Arnaques numériques",
                "Retard ou défaut d'exécution d'un prestataire",
                "Conflits commerciaux",
                "Décisions administratives injustes",
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{item}</span>
                </div>
              ))}
            </motion.div>

            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl font-bold text-center mb-4">
              Personne n'est à l'abri.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-gray-700 text-center">
              Avec Emilia, vous avez enfin un partenaire juridique solide qui vous défend, vous soutient et protège vos intérêts à tout moment.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section Offres CTA */}
      <section id="offres" className="py-24 bg-gradient-to-br from-yellow-50 via-white to-yellow-50">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center mb-6">
              ✔️ Souscription directe (optionnelle)
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-center text-gray-700 mb-4">
              Vous pouvez aussi souscrire directement en ligne
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
                  color: "from-yellow-500 to-yellow-600",
                  hoverColor: "hover:from-yellow-600 hover:to-yellow-700",
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
                  <Card className={`p-8 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${offer.featured ? "border-4 border-yellow-400 scale-105" : "border-2"}`}>
                    {offer.featured && (
                      <div className="bg-yellow-400 text-gray-900 font-bold text-center py-2 -mx-8 -mt-8 mb-6 rounded-t-lg">
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

      {/* Section Finale CTA */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-8">
              🎯 Ne laissez plus le hasard décider de votre avenir
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-2xl md:text-3xl mb-6">
              Avec Emilia, vous êtes protégé, accompagné et défendu… quand vous en avez réellement besoin.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl font-bold mb-12 text-yellow-400">
              Faites le choix n°1 en Suisse. Faites le choix de la tranquillité.
            </motion.p>

            <motion.div variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 font-bold"
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
    </div>
  );
}
