import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_INFO, ROUTES, SERVICES_LINKS } from "@/const";
import { motion } from "framer-motion";
import { Award, Check, Heart, Phone, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Talentis() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-32 text-white overflow-hidden"
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
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Award className="w-5 h-5" />
              <span className="font-medium">Concept Talentis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Fidélisez vos Talents Clés
            </h1>
            <p className="text-2xl mb-8 text-white/90">
              Retenez vos collaborateurs stratégiques et boostez la croissance de votre entreprise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaire}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demander une Analyse Gratuite
                </Button>
              </Link>
              <a href={SERVICES_LINKS.talentis} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Voir la Présentation Complète
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Le Défi */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Le Défi de la Fidélisation</h2>
            <p className="text-xl text-muted-foreground">
              Dans un marché du travail compétitif, retenir vos collaborateurs clés est devenu un enjeu stratégique majeur. 
              Le concept <strong className="text-accent">Talentis</strong> vous offre une solution innovante pour fidéliser 
              vos talents tout en optimisant votre fiscalité.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="w-12 h-12 text-primary" />,
                title: "Guerre des Talents",
                description: "La concurrence pour attirer et retenir les meilleurs collaborateurs n'a jamais été aussi forte."
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-primary" />,
                title: "Coûts de Rotation",
                description: "Remplacer un collaborateur clé coûte en moyenne 150% de son salaire annuel."
              },
              {
                icon: <Heart className="w-12 h-12 text-primary" />,
                title: "Engagement",
                description: "Les collaborateurs recherchent des avantages qui vont au-delà du salaire."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* La Solution Talentis */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">La Solution Talentis</h2>
            <p className="text-xl text-muted-foreground">
              Une assurance vie collective qui fidélise vos collaborateurs clés tout en optimisant votre fiscalité
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                    <Award className="w-8 h-8 text-accent" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Comment ça marche ?</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Talentis est une assurance vie collective qui permet à l'entreprise de constituer un capital 
                    pour ses collaborateurs clés. Ce capital est versé au collaborateur après une période définie 
                    (généralement 5 à 10 ans), créant ainsi un puissant levier de fidélisation.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Primes déductibles</strong>
                        <span className="text-sm text-muted-foreground">Les primes sont déductibles fiscalement pour l'entreprise</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Capital garanti</strong>
                        <span className="text-sm text-muted-foreground">Le collaborateur reçoit un capital garanti à l'échéance</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Protection décès</strong>
                        <span className="text-sm text-muted-foreground">En cas de décès, le capital est versé aux bénéficiaires</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Flexibilité</strong>
                        <span className="text-sm text-muted-foreground">Durée et montants adaptables selon vos besoins</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Les Avantages pour Votre Entreprise</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Fidélisation Renforcée",
                description: "Créez un engagement fort en offrant un avantage unique qui incite vos talents à rester sur le long terme."
              },
              {
                icon: <TrendingUp className="w-10 h-10 text-primary" />,
                title: "Optimisation Fiscale",
                description: "Les primes versées sont déductibles fiscalement, réduisant ainsi le coût net de cet avantage."
              },
              {
                icon: <Award className="w-10 h-10 text-primary" />,
                title: "Attractivité Employeur",
                description: "Différenciez-vous sur le marché du travail en proposant un package de rémunération attractif."
              },
              {
                icon: <Shield className="w-10 h-10 text-primary" />,
                title: "Protection Sociale",
                description: "Offrez une protection supplémentaire à vos collaborateurs et leurs familles en cas de décès."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemple Concret */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8 text-center">Exemple Concret</h2>
            <Card className="p-8 md:p-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Cas Pratique</h3>
                  <p className="text-lg text-muted-foreground">
                    Une PME souhaite fidéliser son directeur commercial, élément clé de son développement.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 py-6 border-t border-b">
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Paramètres</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Prime annuelle : CHF 10'000.-</li>
                      <li>• Durée : 10 ans</li>
                      <li>• Total versé : CHF 100'000.-</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Résultats</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Capital garanti à 10 ans : ~CHF 110'000.-</li>
                      <li>• Économie fiscale entreprise : ~CHF 15'000.-</li>
                      <li>• Coût net : CHF 85'000.-</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-6">
                  <p className="text-lg">
                    <strong className="text-accent">Résultat :</strong> Le collaborateur reçoit un capital de CHF 110'000.- 
                    après 10 ans, tout en étant protégé en cas de décès. L'entreprise fidélise son talent clé pour un coût 
                    net de seulement CHF 8'500.- par an.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
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
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Fidéliser Vos Talents ?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Découvrez comment Talentis peut transformer votre stratégie de fidélisation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaire}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demander une Analyse Gratuite
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
