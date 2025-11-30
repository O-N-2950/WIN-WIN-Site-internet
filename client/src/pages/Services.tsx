import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES_LINKS, CONTACT_INFO, ROUTES } from "@/const";
import {
  Shield,
  Users,
  TrendingUp,
  Heart,
  Building2,
  FileText,
  Home,
  Car,
  Briefcase,
  GraduationCap,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  Phone,
  ExternalLink,
  Sparkles,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";

const servicesDetailles = [
  {
    icon: Shield,
    title: "Conseil Global & Retraite",
    description: "Une planification complète de votre prévoyance et de votre retraite",
    details: [
      "Analyse approfondie de votre situation personnelle et professionnelle",
      "Optimisation de vos 1er, 2e et 3e piliers",
      "Projection de vos revenus à la retraite",
      "Stratégies de rachat LPP et optimisation fiscale",
      "Planification successorale et transmission de patrimoine",
    ],
    benefices: [
      "Vision claire de votre avenir financier",
      "Maximisation de vos revenus futurs",
      "Sécurité pour vous et votre famille",
    ],
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Building2,
    title: "Prévoyance Professionnelle (LPP)",
    description: "Optimisation de votre 2e pilier pour une sécurité maximale",
    details: [
      "Analyse de votre certificat de prévoyance",
      "Optimisation des prestations en cas de décès et d'invalidité",
      "Conseil sur les rachats LPP et avantages fiscaux",
      "Comparaison des plans de prévoyance",
      "Accompagnement lors de changement d'employeur",
    ],
    benefices: [
      "Protection optimale de votre famille",
      "Économies fiscales significatives",
      "Meilleure retraite garantie",
    ],
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Concept Talentis",
    description: "Programme de fidélisation des talents clés via une assurance-vie 3e pilier B",
    details: [
      "Assurance-vie 3e pilier B financée par l'entreprise",
      "Fidélisation des collaborateurs stratégiques",
      "Avantages fiscaux pour l'entreprise et le collaborateur",
      "Capital garanti au terme du contrat",
      "Flexibilité dans la structuration du plan",
    ],
    benefices: [
      "Rétention des talents clés",
      "Optimisation fiscale entreprise",
      "Motivation et engagement accrus",
    ],
    link: SERVICES_LINKS.talentis,
    external: true,
    badge: "PREMIUM",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Heart,
    title: "Assurances Vie & 3e Pilier",
    description: "Solutions de prévoyance individuelle et produits spécialisés",
    details: [
      "3e pilier A (lié) : économies fiscales maximales",
      "3e pilier B (libre) : flexibilité totale",
      "Assurance Parents-Enfants : protection de toute la famille",
      "Assurance-vie mixte : épargne et protection combinées",
      "Rentes viagères : revenus garantis à vie",
    ],
    benefices: [
      "Déductions fiscales importantes",
      "Capital garanti pour vos projets",
      "Protection de vos proches",
    ],
    link: SERVICES_LINKS.parentsEnfants,
    external: true,
    gradient: "from-rose-500 to-red-500",
  },
  {
    icon: TrendingUp,
    title: "Concept Durabilis",
    description: "Protection en cas de décès d'un associé pour pérenniser votre entreprise",
    details: [
      "Assurance décès pour associés et actionnaires",
      "Garantie de rachat des parts en cas de décès",
      "Protection de la continuité de l'entreprise",
      "Clause bénéficiaire adaptée à votre structure",
      "Financement sécurisé du rachat de parts",
    ],
    benefices: [
      "Continuité de l'entreprise assurée",
      "Protection des familles des associés",
      "Éviter la vente forcée de l'entreprise",
    ],
    link: SERVICES_LINKS.durabilis,
    external: true,
    badge: "PREMIUM",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: FileText,
    title: "Financement Hypothécaire",
    description: "Montage et gestion de dossiers immobiliers pour concrétiser vos projets",
    details: [
      "Conseil pour l'achat de votre résidence principale",
      "Financement d'investissements locatifs",
      "Renégociation de votre hypothèque existante",
      "Optimisation de votre stratégie d'amortissement",
      "Accompagnement complet du dossier",
    ],
    benefices: [
      "Taux compétitifs négociés",
      "Gain de temps dans les démarches",
      "Stratégie optimale pour votre situation",
    ],
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    icon: Home,
    title: "Assurances Ménage & Bâtiment",
    description: "Protection complète de votre patrimoine immobilier",
    details: [
      "Assurance ménage : mobilier, objets de valeur, responsabilité civile",
      "Assurance bâtiment : incendie, dégâts d'eau, catastrophes naturelles",
      "Assurance protection juridique : défense de vos intérêts",
      "Assurance vol et vandalisme",
      "Couverture des dommages électriques",
    ],
    benefices: [
      "Protection totale de votre patrimoine",
      "Assistance 24/7 en cas de sinistre",
      "Indemnisation rapide",
    ],
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Car,
    title: "Assurances Véhicules",
    description: "Couverture optimale pour tous vos véhicules",
    details: [
      "Assurance auto : RC, casco complète, casco partielle",
      "Assurance moto et scooter",
      "Assurance flotte pour entreprises",
      "Protection du conducteur",
      "Assistance dépannage 24/7",
    ],
    benefices: [
      "Primes compétitives",
      "Couverture adaptée à votre usage",
      "Service sinistre simplifié",
    ],
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Briefcase,
    title: "Assurances Entreprises",
    description: "Solutions complètes pour protéger votre activité professionnelle",
    details: [
      "Responsabilité civile entreprise",
      "Assurance perte de gain",
      "Protection juridique entreprise",
      "Assurance cyber-risques",
      "Prévoyance collective pour vos employés",
    ],
    benefices: [
      "Continuité de votre activité",
      "Protection contre les risques majeurs",
      "Conformité légale assurée",
    ],
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: GraduationCap,
    title: "Assurance Maladie Complémentaire",
    description: "Couverture santé optimale au-delà de la LAMal",
    details: [
      "Assurance complémentaire ambulatoire",
      "Assurance hospitalisation (division privée, semi-privée)",
      "Médecines alternatives et naturelles",
      "Soins dentaires",
      "Assistance à l'étranger",
    ],
    benefices: [
      "Accès aux meilleurs soins",
      "Libre choix du médecin et hôpital",
      "Remboursements étendus",
    ],
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: PiggyBank,
    title: "Planification Financière",
    description: "Stratégie globale pour optimiser votre patrimoine",
    details: [
      "Analyse complète de votre situation financière",
      "Optimisation fiscale personnalisée",
      "Stratégie d'investissement adaptée",
      "Planification de la retraite",
      "Conseil en succession et donation",
    ],
    benefices: [
      "Vision claire de votre patrimoine",
      "Optimisation fiscale maximale",
      "Atteinte de vos objectifs financiers",
    ],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Recherche de Libre Passage",
    description: "Service gratuit pour retrouver vos avoirs de prévoyance oubliés",
    details: [
      "Recherche gratuite auprès de la Centrale du 2ème pilier",
      "Identification de tous vos comptes de libre passage",
      "Rapport détaillé avec coordonnées des institutions",
      "Conseil pour consolider vos avoirs",
      "Accompagnement dans les démarches de récupération",
    ],
    benefices: [
      "100% gratuit, aucun engagement",
      "Retrouvez des milliers de francs oubliés",
      "Optimisez votre prévoyance professionnelle",
    ],
    link: "https://winwin.recherche-libre-passage.ch/fr/homepage",
    external: true,
    badge: "GRATUIT",
    gradient: "from-yellow-500 to-amber-500",
  },
];

const processus = [
  {
    etape: "1",
    titre: "Premier Contact",
    description: "Prise de contact par téléphone, email ou formulaire. Nous fixons un rendez-vous à votre convenance.",
    icon: Phone,
  },
  {
    etape: "2",
    titre: "Analyse de Situation",
    description: "Entretien approfondi pour comprendre vos besoins, objectifs et contraintes. Analyse de vos contrats existants.",
    icon: FileText,
  },
  {
    etape: "3",
    titre: "Proposition Sur Mesure",
    description: "Élaboration d'une stratégie personnalisée avec plusieurs scénarios et comparaison des solutions du marché.",
    icon: TrendingUp,
  },
  {
    etape: "4",
    titre: "Mise en Place",
    description: "Accompagnement dans toutes les démarches administratives. Gestion complète des formalités.",
    icon: CheckCircle2,
  },
  {
    etape: "5",
    titre: "Suivi Long Terme",
    description: "Révision annuelle de votre situation. Ajustements en fonction de l'évolution de vos besoins.",
    icon: Shield,
  },
];

export default function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      {/* Hero Section avec gradient animé */}
      <section 
        className="relative py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(203, 55%, 42%) 0%, hsl(205, 40%, 69%) 50%, hsl(203, 55%, 42%) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
        }}
      >
        <style>{`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.1); }
            50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.3); }
          }
        `}</style>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center space-y-6 text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Intelligence Artificielle + Expertise Humaine</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Nos Services
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Des solutions complètes et personnalisées pour tous vos besoins en assurances et prévoyance.
              <br />
              <span className="font-semibold">Conseil indépendant • Expertise reconnue • Accompagnement sur le long terme</span>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white group">
                  Souscrire au Mandat
                  <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone}`}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Phone className="mr-2 w-5 h-5" />
                  {CONTACT_INFO.phone}
                </Button>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid avec Glass Morphism */}
      <section className="py-20 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesDetailles.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                <Card 
                  className="h-full relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl"
                  style={{
                    background: hoveredIndex === index 
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(255, 255, 255, 0.02)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Gradient animé au hover */}
                  <div 
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${service.gradient}`}
                  />

                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      {/* Icône avec gradient */}
                      <motion.div
                        className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} text-white shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <service.icon className="h-8 w-8" />
                      </motion.div>

                      {/* Badge */}
                      {service.badge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            service.badge === "GRATUIT"
                              ? "bg-green-100 text-green-700 border border-green-300"
                              : "bg-amber-100 text-amber-700 border border-amber-300"
                          }`}
                        >
                          {service.badge}
                        </motion.div>
                      )}
                    </div>

                    <CardTitle className="text-2xl mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Prestations */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Nos prestations
                      </h4>
                      <ul className="space-y-2">
                        {service.details.slice(0, 3).map((detail, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Bénéfices */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-accent" />
                        Vos bénéfices
                      </h4>
                      <ul className="space-y-2">
                        {service.benefices.map((benefice, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * i }}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                            <span>{benefice}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    {service.link && (
                      <div className="pt-4">
                        {service.external ? (
                          <a href={service.link} target="_blank" rel="noopener noreferrer" className="block">
                            <Button 
                              variant="outline" 
                              className="w-full group/btn"
                            >
                              En savoir plus
                              <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </a>
                        ) : (
                          <Link href={service.link}>
                            <Button 
                              variant="outline" 
                              className="w-full group/btn"
                            >
                              En savoir plus
                              <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus avec animations */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Notre Processus</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un accompagnement structuré en 5 étapes pour une solution parfaitement adaptée à vos besoins
            </p>
          </motion.div>

          <div className="grid md:grid-cols-5 gap-8">
            {processus.map((etape, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white text-2xl font-bold mb-4 shadow-lg mx-auto"
                >
                  {etape.etape}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {etape.titre}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {etape.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <h2 className="text-4xl font-bold">Prêt à optimiser votre prévoyance ?</h2>
            <p className="text-xl text-muted-foreground">
              Bénéficiez d'un conseil personnalisé et sans engagement. Nos experts analysent votre situation et vous proposent les meilleures solutions du marché.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  Souscrire au Mandat
                  <Zap className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone}`}>
                <Button size="lg" variant="outline">
                  <Phone className="mr-2 w-5 h-5" />
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
