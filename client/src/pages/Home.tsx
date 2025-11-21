import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SpectacularHero from "@/components/SpectacularHero";
import { 
  APP_TITLE, 
  CONTACT_INFO, 
  COMPANY_INFO, 
  PRICING_DISPLAY,
  ROUTES,
  SERVICES_LINKS 
} from "@/const";
import {
  Shield,
  TrendingUp,
  Users,
  Heart,
  Building2,
  FileText,
  ArrowRight,
  CheckCircle2,
  Star,
  Phone,
  Mail,
  Sparkles,
  Target,
  Award,
  Clock,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  fadeInUp, 
  staggerContainer, 
  scaleIn, 
  cardHover, 
  buttonHover,
  revealFromBottom,
  revealFromLeft,
  revealFromRight,
  iconFloat,
  badgePulse
} from "@/lib/animations";

// Compteur animé
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section Spectaculaire */}
      <SpectacularHero />

      {/* Section Mandat de Gestion - Offre Principale */}
      <section 
        className="py-24 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 44%))'
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={fadeInUp} className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Autorisé FINMA F01042365 • 30 ans d'expérience</span>
              </div>
            </motion.div>

            {/* Titre */}
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-bold text-center mb-6">
              📄 Mandat de Gestion de Portefeuille d'Assurances
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-center mb-4 text-white/90">
              Confiez-nous la gestion complète de vos assurances.
            </motion.p>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-center mb-12 text-white/80 max-w-3xl mx-auto">
              <strong>Conseil indépendant</strong>, contrôle des décomptes, accompagnement sinistres, appels d'offres, suivi des échéances. <strong>Zéro souci pour vous.</strong>
            </motion.p>

            {/* Grille 2 colonnes : Entreprises vs Privés */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Clients Privés */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-10 h-10" />
                      <CardTitle className="text-2xl">Clients Privés</CardTitle>
                    </div>
                    <CardDescription className="text-white/70 text-base">
                      Protection et sérénité pour vous et votre famille
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {[
                        "Contrôle des décomptes de primes",
                        "Gestion des sinistres (santé, accidents, RC)",
                        "Recherche gratuite avoirs LPP (2e pilier)",
                        "Analyse de prévoyance (PEP's)",
                        "Conseil indépendant pour optimiser vos primes"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold mb-2">💰 Tarifs Privés :</p>
                      <ul className="text-sm space-y-1">
                        <li>• {'<'} 18 ans : <strong>Gratuit</strong></li>
                        <li>• 18-22 ans : <strong>CHF 85.-/an</strong></li>
                        <li>• {'>'} 22 ans : <strong>CHF 185.-/an</strong></li>
                      </ul>
                    </div>
                    <Link href={ROUTES.questionnaireInfo}>
                      <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Devenir client
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Clients Entreprises */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-10 h-10" />
                      <CardTitle className="text-2xl">Clients Entreprises</CardTitle>
                    </div>
                    <CardDescription className="text-white/70 text-base">
                      Solutions professionnelles pour votre entreprise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {[
                        "Appels d'offres et mise en concurrence",
                        "Gestion LPP collective (prévoyance employés)",
                        "Contrôle décomptes (LAA, IJM, RC entreprise)",
                        "Gestion sinistres professionnels",
                        "Conseil stratégique en prévoyance d'entreprise"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold mb-2">💰 Tarifs Entreprises :</p>
                      <ul className="text-sm space-y-1">
                        <li>• 0 employé : <strong>CHF 160.-/an</strong></li>
                        <li>• 1-2 employés : <strong>CHF 260-360.-/an</strong></li>
                        <li>• 3-10 employés : <strong>CHF 460-560.-/an</strong></li>
                        <li>• 11+ employés : <strong>CHF 660-860.-/an</strong></li>
                      </ul>
                    </div>
                    <Link href={ROUTES.questionnaireInfo}>
                      <Button className="w-full bg-white text-primary hover:bg-gray-100 font-bold">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Devenir client
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* 10 Prestations Incluses */}
            <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
                ✅ 10 Prestations Incluses dans le Mandat
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: Phone, text: "Conseils professionnels (agence, téléphone, domicile)" },
                  { icon: Target, text: "Appels d'offres et mise en concurrence" },
                  { icon: CheckCircle2, text: "Réception et contrôle des primes" },
                  { icon: Shield, text: "Gestion complète des sinistres" },
                  { icon: FileText, text: "Archivage informatique et réexpédition" },
                  { icon: Clock, text: "Accès Web via Airtable 24h/24" },
                  { icon: Mail, text: "Correspondance avec les compagnies" },
                  { icon: TrendingUp, text: "Mise à jour budget assurances et échéancier" },
                  { icon: Star, text: "Recherche gratuite avoirs LPP (2e pilier)" },
                  { icon: Award, text: "Analyse de prévoyance offerte (PEP's - CHF 250.-)" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                    <item.icon className="w-6 h-6 text-green-300 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTA Final */}
            <motion.div variants={fadeInUp} className="text-center mt-12">
              <p className="text-lg mb-6 text-white/90">
                <strong>Conseil indépendant</strong> • <strong>30 ans d'expérience</strong> • <strong>Autorisé FINMA</strong>
              </p>
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-[#D4AF37] text-white hover:bg-[#C19F2F] text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105 font-bold">
                  <Sparkles className="w-6 h-6 mr-2" />
                  Souscrire au mandat de gestion
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={scaleIn} className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <p className="text-xl font-semibold text-foreground/80">Clients Actifs</p>
              <p className="text-sm text-muted-foreground mt-2">Familles et entreprises qui nous font confiance</p>
            </motion.div>

            <motion.div variants={scaleIn} className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                <AnimatedCounter end={30} suffix=" ans" />
              </div>
              <p className="text-xl font-semibold text-foreground/80">D'Expérience</p>
              <p className="text-sm text-muted-foreground mt-2">Au service de la protection et de la prévoyance</p>
            </motion.div>

            <motion.div variants={scaleIn} className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="text-xl font-semibold text-foreground/80">Satisfaction Client</p>
              <p className="text-sm text-muted-foreground mt-2">De nos clients recommandent nos services</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nos Services d'Assurance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une gamme complète de solutions pour protéger ce qui compte le plus pour vous
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: "Conseil Global & Retraite",
                description: "Analyse complète de votre situation et planification de votre retraite pour un avenir serein",
                color: "text-primary"
              },
              {
                icon: Building2,
                title: "Prévoyance Professionnelle",
                description: "Optimisation de votre 2ème pilier (LPP) et solutions de prévoyance pour indépendants",
                color: "text-secondary"
              },
              {
                icon: Users,
                title: "Assurances Entreprises",
                description: "Protection complète pour votre entreprise et vos collaborateurs",
                color: "text-accent"
              }
            ].map((service, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4`}>
                      <service.icon className={`w-8 h-8 ${service.color}`} />
                    </div>
                    <CardTitle className="text-2xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                    <Link href={ROUTES.services}>
                      <Button variant="link" className="mt-4 p-0 h-auto text-primary">
                        En savoir plus <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href={ROUTES.services}>
              <Button size="lg" variant="outline">
                Voir Tous Nos Services
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Libre Passage Section - Service Gratuit */}
      <section className="py-24 bg-gradient-to-br from-green-50 via-background to-primary/5">
        <div className="container">
          <motion.div
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="border-2 border-green-200 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/30 backdrop-blur-sm mb-2">
                        <Sparkles className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">SERVICE GRATUIT</span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Recherche de Libre Passage
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Avez-vous changé d'employeur plusieurs fois ? Vous avez peut-être <strong className="text-foreground">oublié des avoirs de libre passage</strong> chez d'anciens employeurs. 
                    Nous vous aidons à <strong className="text-foreground">retrouver gratuitement</strong> tous vos avoirs de prévoyance professionnelle (2ème pilier) en Suisse.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 my-8">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">100% Gratuit</h4>
                        <p className="text-sm text-muted-foreground">Aucun frais, aucun engagement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Rapide</h4>
                        <p className="text-sm text-muted-foreground">Résultats en quelques jours</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Sécurisé</h4>
                        <p className="text-sm text-muted-foreground">Conforme aux normes suisses</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Award className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Pourquoi rechercher vos avoirs ?</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>Des <strong className="text-foreground">millions de francs</strong> d'avoirs de libre passage sont oubliés en Suisse</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>Consolidez vos avoirs pour une <strong className="text-foreground">meilleure visibilité</strong> de votre patrimoine</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            <span>Optimisez la gestion de votre <strong className="text-foreground">prévoyance professionnelle</strong></span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a 
                      href="https://winwin.recherche-libre-passage.ch/fr/homepage" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                        <Target className="w-5 h-5 mr-2" />
                        Lancer Ma Recherche Gratuite
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </a>
                    <Link href={ROUTES.librePassage}>
                      <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-lg px-8 py-6 h-auto">
                        En Savoir Plus
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Concepts Section */}
      <section className="py-24 bg-gradient-to-br from-accent/5 to-accent/10">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-accent/20">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Nos Concepts Innovants</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Solutions Sur Mesure</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des concepts uniques développés pour répondre à vos besoins spécifiques
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: "Talentis",
                subtitle: "Fidélisation des Talents",
                description: "Retenez vos collaborateurs clés grâce à des solutions de prévoyance attractives",
                link: ROUTES.talentis,
                gradient: "from-primary to-secondary"
              },
              {
                title: "Durabilis",
                subtitle: "Protection des Associés",
                description: "Protégez votre entreprise et vos associés contre les imprévus",
                link: ROUTES.durabilis,
                gradient: "from-secondary to-accent"
              },
              {
                title: "Synergis",
                subtitle: "Plateforme Collaborative",
                description: "La synergie parfaite entre expertise humaine et technologie pour créer, gérer et développer votre entreprise",
                link: ROUTES.synergis,
                gradient: "from-accent to-primary"
              }
            ].map((concept, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Link href={concept.link}>
                  <Card className={`h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-accent/30 hover:border-accent overflow-hidden group cursor-pointer`}>
                    <div className={`h-2 bg-gradient-to-r ${concept.gradient}`} />
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-accent fill-accent" />
                        <span className="text-sm font-semibold text-accent">{concept.subtitle}</span>
                      </div>
                      <CardTitle className="text-3xl font-bold">{concept.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-4">{concept.description}</CardDescription>
                      <div className="flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform">
                        Découvrir <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Comment Ça Marche ?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Un processus simple et transparent pour devenir client
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div 
              className="grid md:grid-cols-5 gap-6"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { step: "1", icon: FileText, title: "Questionnaire", desc: "20 minutes en ligne" },
                { step: "2", icon: Shield, title: "Mandat", desc: "Génération automatique" },
                { step: "3", icon: CheckCircle2, title: "Signature", desc: "Électronique sécurisée" },
                { step: "4", icon: Star, title: "Paiement", desc: "Sécurisé par Stripe" },
                { step: "5", icon: Heart, title: "Activation", desc: "Sous 48h" }
              ].map((item, index) => (
                <motion.div key={index} variants={scaleIn} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 relative">
                      <item.icon className="w-10 h-10 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-secondary" />
                  )}
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-foreground font-semibold">
                  <Target className="w-5 h-5 mr-2" />
                  Demandez Conseil
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Tarifs Transparents</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des tarifs clairs et adaptés à votre profil
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={scaleIn}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">Clients Privés</CardTitle>
                  <CardDescription>Tarifs selon votre âge</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{PRICING_DISPLAY.private.under18.label}</span>
                    <span className="font-semibold text-lg">{PRICING_DISPLAY.private.under18.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{PRICING_DISPLAY.private.age18_22.label}</span>
                    <span className="font-semibold text-lg text-primary">{PRICING_DISPLAY.private.age18_22.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">{PRICING_DISPLAY.private.age22Plus.label}</span>
                    <span className="font-semibold text-lg text-primary">{PRICING_DISPLAY.private.age22Plus.price}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={scaleIn}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl">Entreprises</CardTitle>
                  <CardDescription>Tarifs selon le nombre d'employés</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{PRICING_DISPLAY.business.employee0.label}</span>
                    <span className="font-semibold text-lg text-primary">{PRICING_DISPLAY.business.employee0.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">{PRICING_DISPLAY.business.employee1.label}</span>
                    <span className="font-semibold text-lg text-primary">{PRICING_DISPLAY.business.employee1.price}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">...</span>
                    <span className="font-semibold text-lg text-primary">Jusqu'à CHF 860.-/an</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div 
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href={ROUTES.pricing}>
              <Button variant="outline" size="lg">
                Voir la Grille Tarifaire Complète
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section 
        className="py-24 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 44%), hsl(205, 40%, 69%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à Protéger Votre Avenir ?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Rejoignez plus de {COMPANY_INFO.stats.clients} clients satisfaits et bénéficiez d'un conseil personnalisé
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-foreground font-semibold text-lg px-8 py-6 h-auto">
                  <Target className="w-5 h-5 mr-2" />
                  Demandez Conseil
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href={ROUTES.contact}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-white font-semibold text-lg px-8 py-6 h-auto backdrop-blur-sm">
                  <Phone className="w-5 h-5 mr-2" />
                  Nous Contacter
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Réponse sous 48h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Sans engagement</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
