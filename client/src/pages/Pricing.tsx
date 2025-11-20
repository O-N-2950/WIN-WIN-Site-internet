import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_INFO, PRICING, ROUTES } from "@/const";
import { motion } from "framer-motion";
import { Check, Phone, Shield, Users } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-24 text-white overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 45%), hsl(205, 40%, 69%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tarifs Transparents
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Des tarifs clairs et adaptés à votre profil. Aucun frais caché, aucune surprise.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Résiliable à tout moment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Clients Privés */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">Clients Privés</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tarifs pour Particuliers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un tarif adapté à votre âge pour une protection optimale
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Moins de 18 ans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="p-8 text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🎓</div>
                <h3 className="text-2xl font-bold mb-2">Moins de 18 ans</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  Offert
                </div>
                <p className="text-muted-foreground mb-6">
                  Protection complète pour les jeunes et étudiants
                </p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Conseil personnalisé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Gestion complète</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Accès Espace Client</span>
                  </li>
                </ul>
                <Link href={ROUTES.questionnaire}>
                  <Button className="w-full">Commencer</Button>
                </Link>
              </Card>
            </motion.div>

            {/* 18-22 ans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 text-center h-full hover:shadow-lg transition-shadow border-primary/50">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">18-22 ans</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  CHF 85.-
                  <span className="text-lg font-normal text-muted-foreground">/an</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Tarif préférentiel pour jeunes actifs
                </p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Tout ce qui est inclus dans l'offre de base</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Optimisation fiscale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Suivi annuel</span>
                  </li>
                </ul>
                <Link href={ROUTES.questionnaire}>
                  <Button className="w-full">Commencer</Button>
                </Link>
              </Card>
            </motion.div>

            {/* Plus de 22 ans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-8 text-center h-full hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">💼</div>
                <h3 className="text-2xl font-bold mb-2">Plus de 22 ans</h3>
                <div className="text-4xl font-bold text-primary mb-4">
                  CHF 185.-
                  <span className="text-lg font-normal text-muted-foreground">/an</span>
                </div>
                <p className="text-muted-foreground mb-6">
                  Protection complète pour adultes
                </p>
                <ul className="space-y-3 text-left mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Tout ce qui est inclus précédemment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Planification retraite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>Analyse prévoyance</span>
                  </li>
                </ul>
                <Link href={ROUTES.questionnaire}>
                  <Button className="w-full">Commencer</Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Entreprises */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Entreprises</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tarifs pour Entreprises
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un tarif adapté à la taille de votre entreprise
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-primary text-white">
                      <tr>
                        <th className="text-left p-4">Nombre d'Employés</th>
                        <th className="text-right p-4">Tarif Annuel</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PRICING.entreprise.map((tier, index) => (
                        <tr key={index} className="border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                          <td className="p-4 font-medium">{tier.label}</td>
                          <td className="p-4 text-right">
                            <span className="text-2xl font-bold text-primary">
                              CHF {tier.price}.-
                            </span>
                            <span className="text-muted-foreground">/an</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 text-center"
            >
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demandez Conseil
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce Qui Est Inclus
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tous nos mandats incluent ces prestations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "📋",
                title: "Conseils Professionnels",
                description: "Analyse complète de votre situation et recommandations personnalisées"
              },
              {
                icon: "🔍",
                title: "Appels d'Offres",
                description: "Mise en concurrence des compagnies pour obtenir les meilleures conditions"
              },
              {
                icon: "💰",
                title: "Contrôle des Primes",
                description: "Vérification et optimisation de vos primes d'assurance"
              },
              {
                icon: "🛡️",
                title: "Gestion des Sinistres",
                description: "Accompagnement complet dans la gestion de vos sinistres"
              },
              {
                icon: "📁",
                title: "Archivage Informatique",
                description: "Tous vos documents accessibles 24h/24 via Airtable"
              },
              {
                icon: "📧",
                title: "Correspondance",
                description: "Gestion de toute la correspondance avec les compagnies"
              },
              {
                icon: "📊",
                title: "Mise à Jour Budget",
                description: "Suivi et mise à jour régulière de votre budget assurances"
              },
              {
                icon: "🔎",
                title: "Recherche LPP Incluse",
                description: "Accès à notre outil de recherche de libre passage"
              },
              {
                icon: "💼",
                title: "Analyse Prévoyance",
                description: "Analyse détaillée de votre situation de prévoyance (CHF 250.- en supplément)"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Tarifs */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions Fréquentes
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Puis-je résilier à tout moment ?",
                answer: "Oui, le mandat de gestion est résiliable à tout moment sans préavis ni frais."
              },
              {
                question: "Y a-t-il des frais cachés ?",
                answer: (
                  <>
                    Non, le tarif annuel inclut toutes les prestations listées. L'analyse prévoyance{" "}
                    <a href="https://peps.swiss/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      PEP's
                    </a>{" "}
                    (d'une valeur de CHF 250.-) est offerte gratuitement aux membres actifs de l'application{" "}
                    <a href="https://peps.swiss/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      PEP's
                    </a>.
                  </>
                )
              },
              {
                question: "Comment se fait le paiement ?",
                answer: "Le paiement se fait par carte bancaire via Stripe de manière sécurisée. L'abonnement est renouvelé automatiquement chaque année."
              },
              {
                question: "Que se passe-t-il si je change de situation ?",
                answer: "Nous adaptons votre mandat en fonction de l'évolution de votre situation (changement d'âge, d'employeur, etc.). Le tarif peut être ajusté en conséquence."
              },
              {
                question: "Proposez-vous des mandats offerts ?",
                answer: "Oui, dans certains cas particuliers (famille proche, situations spéciales), nous pouvons offrir le mandat gracieusement."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 44%), hsl(205, 40%, 69%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à Commencer ?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Rejoignez plus de 500+ clients satisfaits et bénéficiez d'un conseil personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaire}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demandez Conseil
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Phone className="w-5 h-5 mr-2" />
                  {CONTACT_INFO.phone}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
