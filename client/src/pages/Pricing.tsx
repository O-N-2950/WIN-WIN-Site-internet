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
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">Commencer</Button>
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
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">Commencer</Button>
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
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">Commencer</Button>
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
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Demandez Conseil
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rabais de Groupe */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-green-600/10 text-green-700 dark:text-green-400 px-4 py-2 rounded-full mb-4">
              <Users className="w-5 h-5" />
              <span className="font-medium">Économisez Ensemble</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              💰 Économisez avec le Rabais de Groupe !
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Plus vous êtes nombreux, plus vous économisez ! Invitez votre famille, vos amis ou vos collaborateurs à rejoindre WIN WIN Finance et bénéficiez tous d'un rabais automatique.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* Tableau des rabais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-600 text-white">
                      <tr>
                        <th className="text-left p-4">Nombre de Membres</th>
                        <th className="text-center p-4">Rabais</th>
                        <th className="text-right p-4">Exemple (CHF 185.-)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-green-50 dark:hover:bg-green-950/10 transition-colors">
                        <td className="p-4 font-medium">2 membres</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                            4%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">CHF 177.60</span>
                          <span className="text-sm text-muted-foreground">/an</span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-green-50 dark:hover:bg-green-950/10 transition-colors">
                        <td className="p-4 font-medium">3 membres</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                            6%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">CHF 173.90</span>
                          <span className="text-sm text-muted-foreground">/an</span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-green-50 dark:hover:bg-green-950/10 transition-colors">
                        <td className="p-4 font-medium">4 membres</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                            8%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">CHF 170.20</span>
                          <span className="text-sm text-muted-foreground">/an</span>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-green-50 dark:hover:bg-green-950/10 transition-colors">
                        <td className="p-4 font-medium">5 membres</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-bold">
                            10%
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-xl font-bold text-green-600 dark:text-green-400">CHF 166.50</span>
                          <span className="text-sm text-muted-foreground">/an</span>
                        </td>
                      </tr>
                      <tr className="bg-green-100 dark:bg-green-950/20 hover:bg-green-200 dark:hover:bg-green-950/30 transition-colors">
                        <td className="p-4 font-bold">10+ membres</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center bg-green-600 text-white px-4 py-1 rounded-full font-bold text-lg">
                            20% MAX
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">CHF 148.-</span>
                          <span className="text-sm text-muted-foreground">/an</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>

            {/* Exemples concrets */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="p-6 border-green-200 dark:border-green-800">
                  <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
                  <h3 className="text-xl font-bold mb-3">Exemple Famille</h3>
                  <p className="text-muted-foreground mb-4">
                    Une famille de 5 personnes (parents + 3 enfants) devient cliente :
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prix normal (5 x CHF 185.-)</span>
                      <span className="font-medium line-through text-muted-foreground">CHF 925.-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Avec rabais 10%</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">CHF 832.50</span>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        Économie annuelle : CHF 92.50 !
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-6 border-green-200 dark:border-green-800">
                  <div className="text-4xl mb-4">🏢</div>
                  <h3 className="text-xl font-bold mb-3">Exemple Entreprise</h3>
                  <p className="text-muted-foreground mb-4">
                    Une entreprise de 2 employés + 3 collaborateurs deviennent clients :
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Prix normal (CHF 360.-)</span>
                      <span className="font-medium line-through text-muted-foreground">CHF 360.-</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Avec rabais 10% (5 membres)</span>
                      <span className="text-xl font-bold text-green-600 dark:text-green-400">CHF 324.-</span>
                    </div>
                    <div className="pt-2 border-t">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        Économie annuelle : CHF 36.- !
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <Card className="p-8 bg-gradient-to-br from-green-600 to-emerald-600 text-white border-0">
                <h3 className="text-2xl font-bold mb-3">💡 Conseil : Parlez-en à votre entourage !</h3>
                <p className="text-lg mb-6 text-white/90">
                  Plus vous êtes nombreux, plus vous économisez. Discutez-en lors de votre prochain repas de famille ou avec vos collègues !
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Rabais automatique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Valable à vie</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Famille & amis acceptés</span>
                  </div>
                </div>
              </Card>
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
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Demandez Conseil
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-primary border-white/30">
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
// Force redeploy - Mon Dec  1 02:00:14 EST 2025
