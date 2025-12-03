import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_INFO, ROUTES } from "@/const";
import { motion } from "framer-motion";
import { Bot, Brain, Check, FileText, Phone, Rocket, Target, Users, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Synergis() {
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
              <Zap className="w-5 h-5" />
              <span className="font-medium">Plateforme Synergis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              La Synergie Parfaite Entre Expertise Humaine et IA
            </h1>
            <p className="text-2xl mb-8 text-white/90">
              La première plateforme collaborative suisse pour créer, gérer et développer votre entreprise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaire}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Découvrir Synergis
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-primary border-white/30">
                  <Phone className="w-5 h-5 mr-2" />
                  Nous Contacter
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Notre Mission</h2>
            <p className="text-xl text-muted-foreground">
              Devenir le <strong className="text-primary">partenaire incontournable</strong> de toute entreprise 
              en quête d'efficacité, de simplicité et de croissance durable dans le paysage économique suisse.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Rocket className="w-12 h-12 text-primary" />,
                title: "Création Simplifiée",
                description: "Créez votre entreprise en quelques clics avec l'accompagnement de nos experts et de notre IA."
              },
              {
                icon: <Target className="w-12 h-12 text-primary" />,
                title: "Gestion Optimisée",
                description: "Gérez votre entreprise efficacement grâce à nos outils intelligents et notre expertise."
              },
              {
                icon: <Brain className="w-12 h-12 text-primary" />,
                title: "Développement Durable",
                description: "Développez votre activité avec des stratégies personnalisées et un accompagnement continu."
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

      {/* La Synergie Humain + IA */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">L'Alliance Parfaite</h2>
            <p className="text-xl text-muted-foreground">
              Synergis combine le meilleur de deux mondes : l'expertise humaine et la puissance de l'intelligence artificielle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Expertise Humaine */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Expertise Humaine</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "30 ans d'expérience entrepreneuriale",
                    "Connaissance approfondie du marché suisse",
                    "Accompagnement personnalisé",
                    "Réseau de partenaires qualifiés",
                    "Conseil stratégique sur mesure",
                    "Support juridique et fiscal"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            {/* Intelligence Artificielle */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 h-full border-accent/50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-2xl font-bold">Intelligence Artificielle</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "Automatisation des tâches administratives",
                    "Analyse prédictive et recommandations",
                    "Génération de documents intelligente",
                    "Disponibilité 24/7",
                    "Optimisation continue des processus",
                    "Veille réglementaire automatisée"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Synergis */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Nos Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une suite complète d'outils et de services pour accompagner votre entreprise à chaque étape
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Rocket className="w-10 h-10 text-primary" />,
                title: "Création d'Entreprise",
                description: "Accompagnement complet de l'idée à la création : statuts, inscriptions, comptes bancaires.",
                features: ["Choix de la forme juridique", "Rédaction des statuts", "Inscriptions officielles"]
              },
              {
                icon: <FileText className="w-10 h-10 text-primary" />,
                title: "Comptabilité & Fiscalité",
                description: "Gestion comptable automatisée et optimisation fiscale avec nos experts.",
                features: ["Comptabilité automatisée", "Déclarations fiscales", "Optimisation TVA"]
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Ressources Humaines",
                description: "Gestion complète des RH : contrats, salaires, assurances sociales.",
                features: ["Contrats de travail", "Gestion des salaires", "Assurances sociales"]
              },
              {
                icon: <Target className="w-10 h-10 text-primary" />,
                title: "Stratégie & Développement",
                description: "Conseil stratégique pour développer votre activité et atteindre vos objectifs.",
                features: ["Business plan", "Stratégie marketing", "Levée de fonds"]
              },
              {
                icon: <Brain className="w-10 h-10 text-primary" />,
                title: "Outils IA",
                description: "Suite d'outils intelligents pour automatiser et optimiser votre gestion.",
                features: ["Assistant IA 24/7", "Génération documents", "Analyse prédictive"]
              },
              {
                icon: <Zap className="w-10 h-10 text-primary" />,
                title: "Support Continu",
                description: "Accompagnement permanent avec nos experts et notre plateforme collaborative.",
                features: ["Support prioritaire", "Formations", "Réseau d'entrepreneurs"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Synergis */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Pourquoi Choisir Synergis ?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: "🇨🇭", title: "100% Suisse", description: "Expertise locale et conformité garantie" },
              { icon: "⚡", title: "Rapide & Efficace", description: "Création d'entreprise en quelques jours" },
              { icon: "💰", title: "Tarifs Transparents", description: "Pas de frais cachés, tout est clair" },
              { icon: "🤖", title: "Technologie Avancée", description: "IA de pointe pour automatiser" },
              { icon: "👥", title: "Experts Dédiés", description: "Accompagnement personnalisé" },
              { icon: "📊", title: "Tout-en-Un", description: "Une seule plateforme pour tout gérer" },
              { icon: "🔒", title: "Sécurisé", description: "Données protégées et conformes" },
              { icon: "📈", title: "Évolutif", description: "Grandit avec votre entreprise" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
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
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Lancer Votre Entreprise ?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Rejoignez Synergis et bénéficiez de la synergie parfaite entre expertise humaine et IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaire}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  Découvrir Synergis
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
