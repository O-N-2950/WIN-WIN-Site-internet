import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SERVICES_LINKS, CONTACT_INFO } from "@/const";
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
} from "lucide-react";
import { Link } from "wouter";

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
  },
  {
    icon: FileText,
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
    link: "/libre-passage",
    external: false,
    badge: "GRATUIT",
  },
];

const processus = [
  {
    etape: "1",
    titre: "Premier Contact",
    description: "Prise de contact par téléphone, email ou formulaire. Nous fixons un rendez-vous à votre convenance.",
  },
  {
    etape: "2",
    titre: "Analyse de Situation",
    description: "Entretien approfondi pour comprendre vos besoins, objectifs et contraintes. Analyse de vos contrats existants.",
  },
  {
    etape: "3",
    titre: "Proposition Sur Mesure",
    description: "Élaboration d'une stratégie personnalisée avec plusieurs scénarios et comparaison des solutions du marché.",
  },
  {
    etape: "4",
    titre: "Mise en Place",
    description: "Accompagnement dans toutes les démarches administratives. Gestion complète des formalités.",
  },
  {
    etape: "5",
    titre: "Suivi Long Terme",
    description: "Révision annuelle de votre situation. Ajustements en fonction de l'évolution de vos besoins.",
  },
];

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Nos Services</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Des solutions complètes et personnalisées pour tous vos besoins en assurances et prévoyance.
              Conseil indépendant, expertise reconnue, accompagnement sur le long terme.
            </p>
          </div>
        </div>
      </section>

      {/* Services Détaillés */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="space-y-16">
            {servicesDetailles.map((service, index) => (
              <div
                key={index}
                className={`grid lg:grid-cols-2 gap-12 items-start ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary/10 text-primary">
                      <service.icon className="h-8 w-8" />
                    </div>
                    {service.badge && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 border border-green-300">
                        <span className="text-sm font-bold text-green-700">{service.badge}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                    <p className="text-lg text-muted-foreground mb-6">{service.description}</p>
                  </div>
                  
                  {service.link && (
                    service.external ? (
                      <a
                        href={service.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        En savoir plus sur {service.title}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link href={service.link}>
                        <Button variant="outline" className="inline-flex items-center gap-2">
                          En savoir plus sur {service.title}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Ce que nous proposons</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-3">Nos prestations</h4>
                      <ul className="space-y-2">
                        {service.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Vos bénéfices</h4>
                      <ul className="space-y-2">
                        {service.benefices.map((benefice, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm font-medium text-primary">
                            <ArrowRight className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span>{benefice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Processus */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Notre Processus</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un accompagnement structuré en 5 étapes pour une solution parfaitement adaptée à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {processus.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                      {step.etape}
                    </div>
                    <CardTitle className="text-lg">{step.titre}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{step.description}</CardDescription>
                  </CardContent>
                </Card>
                {index < processus.length - 1 && (
                  <div className="hidden md:block absolute top-1/4 -right-3 w-6 h-0.5 bg-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à optimiser votre prévoyance ?
            </h2>
            <p className="text-lg opacity-90">
              Bénéficiez d'un conseil personnalisé et sans engagement. 
              Nos experts analysent votre situation et vous proposent les meilleures solutions du marché.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/questionnaire-info">
                <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90">
                  Demandez Conseil
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                  <Phone className="mr-2 h-5 w-5" />
                  {CONTACT_INFO.phone}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
