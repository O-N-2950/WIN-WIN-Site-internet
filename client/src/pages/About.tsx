import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { COMPANY_INFO, CONTACT_INFO } from "@/const";
import {
  Shield,
  Award,
  Users,
  Heart,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Link } from "wouter";

const valeurs = [
  {
    icon: Shield,
    titre: "Indépendance",
    description: "Conseil totalement indépendant, sans lien capitalistique avec les compagnies d'assurance. Nous travaillons uniquement dans votre intérêt.",
  },
  {
    icon: Heart,
    titre: "Proximité",
    description: "Relation de confiance sur le long terme. Nous sommes à votre écoute et disponibles pour vous accompagner à chaque étape de votre vie.",
  },
  {
    icon: Award,
    titre: "Excellence",
    description: "Expertise reconnue et certifications professionnelles (FINMA, CICERO). Formation continue pour rester à la pointe du marché.",
  },
  {
    icon: Users,
    titre: "Personnalisation",
    description: "Chaque client est unique. Nous élaborons des solutions sur mesure adaptées à votre situation et vos objectifs spécifiques.",
  },
];

const chiffres = [
  {
    nombre: "30",
    label: "Années d'expérience",
  },
  {
    nombre: "500+",
    label: "Clients satisfaits",
  },
  {
    nombre: "98%",
    label: "Taux de satisfaction",
  },
  {
    nombre: "100%",
    label: "Indépendance",
  },
];

const certifications = [
  "Courtier en assurances agréé FINMA",
  "Membre CICERO (Centre d'Information des Courtiers en Assurances)",
  "Certification en prévoyance professionnelle",
  "Expert en planification financière",
];

const equipe = {
  directeur: {
    nom: COMPANY_INFO.director.name,
    titre: "Directeur & Fondateur",
    description: "Expert en assurances et prévoyance avec 30 ans d'expérience. Passionné par la création de solutions innovantes pour sécuriser l'avenir de ses clients.",
    specialites: [
      "Prévoyance professionnelle",
      "Planification retraite",
      "Assurances entreprises",
      "Concepts de fidélisation",
    ],
  },
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">À propos de WIN WIN Finance Group</h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Votre partenaire de confiance pour tous vos besoins en assurances et prévoyance depuis 30 ans.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Notre Histoire</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fondé par {COMPANY_INFO.director.name}, WIN WIN Finance Group est né d'une conviction forte : 
                  chaque personne mérite un conseil en assurances et prévoyance totalement indépendant, 
                  personnalisé et orienté vers ses intérêts.
                </p>
                <p>
                  Fort de plus de 20 ans d'expérience dans le domaine des assurances et de la prévoyance, 
                  nous avons développé une expertise reconnue et une approche unique centrée sur la création 
                  de valeur pour nos clients.
                </p>
                <p>
                  Notre nom, <strong className="text-foreground">WIN WIN</strong>, reflète notre philosophie : 
                  créer des solutions où tout le monde gagne. Vous gagnez en sécurité, en optimisation fiscale 
                  et en tranquillité d'esprit. Nous gagnons votre confiance et votre fidélité.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 space-y-4">
                  <Shield className="h-12 w-12" />
                  <h3 className="text-2xl font-bold">Notre Mission</h3>
                  <p className="text-primary-foreground/90">
                    Accompagner nos clients dans la sécurisation de leur avenir et celui de leurs proches, 
                    en proposant des solutions d'assurances et de prévoyance parfaitement adaptées à leurs 
                    besoins et objectifs de vie.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-secondary text-secondary-foreground">
                <CardContent className="p-8 space-y-4">
                  <TrendingUp className="h-12 w-12" />
                  <h3 className="text-2xl font-bold">Notre Vision</h3>
                  <p className="text-secondary-foreground/90">
                    Devenir le partenaire de référence en Suisse romande pour le conseil en assurances 
                    et prévoyance, reconnu pour notre indépendance, notre expertise et la qualité de 
                    notre accompagnement.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Nos Valeurs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {valeurs.map((valeur, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                    <valeur.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{valeur.titre}</h3>
                  <p className="text-sm text-muted-foreground">{valeur.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Chiffres Clés */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">WIN WIN en Chiffres</h2>
            <p className="text-lg opacity-90">
              Des résultats qui témoignent de notre engagement
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {chiffres.map((chiffre, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-5xl md:text-6xl font-bold">{chiffre.nombre}</div>
                <div className="text-lg opacity-90">{chiffre.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Notre Équipe</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des experts passionnés à votre service
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <div className="aspect-square rounded-lg overflow-hidden border-4 border-primary shadow-xl">
                      <img 
                        src="/olivier-neukomm.jpg" 
                        alt="Olivier Neukomm" 
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold">{equipe.directeur.nom}</h3>
                      <p className="text-primary font-medium">{equipe.directeur.titre}</p>
                    </div>

                    <p className="text-muted-foreground">
                      {equipe.directeur.description}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-3">Spécialités</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {equipe.directeur.specialites.map((specialite, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{specialite}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                      <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Phone className="h-4 w-4" />
                        {CONTACT_INFO.phone}
                      </a>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Certifications & Agréments</h2>
              <p className="text-lg text-muted-foreground">
                Une expertise reconnue et certifiée
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <Card key={index}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium">{cert}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-background rounded-lg border">
              <div className="flex items-start gap-4">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">Numéro FINMA : {COMPANY_INFO.finma}</h4>
                  <p className="text-sm text-muted-foreground">
                    WIN WIN Finance Group est enregistré auprès de l'Autorité fédérale de surveillance 
                    des marchés financiers (FINMA), garantissant le respect des normes les plus strictes 
                    en matière de conseil et d'intermédiation en assurances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Nous Contacter</h2>
              <p className="text-lg text-muted-foreground">
                Nous sommes à votre disposition pour répondre à toutes vos questions
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Téléphone</h4>
                    <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="text-primary hover:underline">
                      {CONTACT_INFO.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <a href={`mailto:${CONTACT_INFO.email}`} className="text-primary hover:underline break-all">
                      {CONTACT_INFO.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Adresse</h4>
                    <p className="text-sm text-muted-foreground">
                      {CONTACT_INFO.address.street}<br />
                      {CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}<br />
                      {CONTACT_INFO.address.country}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center">
              <Link href="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Prendre rendez-vous
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
