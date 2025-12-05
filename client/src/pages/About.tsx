import {
  Shield,
  Heart,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Target,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { APP_TITLE, COMPANY_INFO, CONTACT_INFO } from "@/const";

export default function About() {
  const stats = [
    { value: "30+", label: "Années d'expérience", icon: Award },
    { value: "500+", label: "Clients satisfaits", icon: Users },
    { value: "300+", label: "Collaborateurs managés", icon: Users },
    { value: "7", label: "Sociétés créées", icon: TrendingUp },
  ];

  const values = [
    {
      icon: Shield,
      title: "Indépendance",
      description:
        "Conseil totalement indépendant, sans lien capitalistique avec les compagnies d'assurance. Nous travaillons uniquement dans votre intérêt.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Proximité",
      description:
        "Relation de confiance sur le long terme. Nous sommes à votre écoute et disponibles pour vous accompagner à chaque étape de votre vie.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Expertise reconnue et certifications professionnelles (FINMA, CICERO). Formation continue pour rester à la pointe du marché.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "Personnalisation",
      description:
        "Chaque client est unique. Nous élaborons des solutions sur mesure adaptées à votre situation et vos objectifs spécifiques.",
      gradient: "from-orange-500 to-yellow-500",
    },
  ];

  const timeline = [
    {
      year: "~1995",
      title: "Débuts dans le domaine bancaire",
      description: "Premiers pas dans le secteur financier à Bâle, acquisition d'une expertise solide en finance et gestion patrimoniale.",
    },
    {
      year: "~1998",
      title: "Agent Général à 29 ans",
      description: "Nomination comme Agent Général, début d'un leadership précoce dans le secteur des assurances.",
    },
    {
      year: "~1999-2006",
      title: "Responsable Suisse romande",
      description: "Management de plus de 300 collaborateurs pour une grande compagnie d'assurance. 7 ans à Lausanne, développement d'une expertise reconnue en management et stratégie commerciale.",
    },
    {
      year: "2011-2012",
      title: "Création des premières sociétés",
      description: "Fondation de Win & Win SA, Winax SA (2011) et Winergie SA (2012). Début de l'aventure entrepreneuriale.",
    },
    {
      year: "2015",
      title: "Expansion du groupe",
      description: "Fondation de Win & Jura SA, consolidation de l'offre de services en Suisse romande.",
    },
    {
      year: "2017",
      title: "Création WW Finance Group",
      description: "Fondation de WW Finance Group, structure centrale regroupant l'ensemble des activités et services.",
    },
    {
      year: "2023",
      title: "Lancement PEP's Swiss SA",
      description: "Création de PEP's Swiss SA (www.peps.swiss), innovation dans les concepts de fidélisation et prévoyance d'entreprise.",
    },
    {
      year: "2024",
      title: "Directeur & Administrateur",
      description: "Directeur et Administrateur de WW Finance Group. 30 ans d'expertise au service de plus de 500 clients satisfaits.",
    },
  ];

  const certifications = [
    { title: "Agréé FINMA", subtitle: `N° ${COMPANY_INFO.finma}`, icon: Shield },
    { title: "Membre CICERO", subtitle: "Centre d'Information", icon: CheckCircle2 },
    { title: "Diplôme IAF", subtitle: "Fonds de placement", icon: Award },
    { title: "Prévoyance Pro", subtitle: "Certification", icon: Award },
    { title: "Planification", subtitle: "Expert financier", icon: Target },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Spectaculaire */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Gradient animé en fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-green-500 to-blue-700 opacity-90" />
        
        {/* Pattern géométrique */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container relative z-10 px-4 py-20">
          <div className="text-center text-white animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/30">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Autorisé FINMA {COMPANY_INFO.finma}</span>
              <Sparkles className="w-5 h-5" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              À propos de
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                {APP_TITLE}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Votre partenaire de confiance pour tous vos besoins en assurances et prévoyance depuis{" "}
              <span className="font-bold text-yellow-300">30 ans</span>
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold text-lg h-14 px-8"
                onClick={() => window.location.href = '/conseil'}
              >
                Nous contacter
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm font-semibold text-lg h-14 px-8"
                onClick={() => window.location.href = '/tarifs'}
              >
                Découvrir nos tarifs
              </Button>
            </div>
          </div>
        </div>

        {/* Vague de séparation */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2">
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="container px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Notre Histoire</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-green-500 mx-auto rounded-full" />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Fondé par <span className="font-semibold text-blue-600">{COMPANY_INFO.director.name}</span>, {APP_TITLE} est né d'une conviction forte : chaque personne mérite un conseil en assurances et prévoyance totalement indépendant, personnalisé et orienté vers ses intérêts.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Fort de plus de <span className="font-bold text-green-600">30 ans d'expérience</span> dans le domaine des assurances et de la prévoyance, nous avons développé une expertise reconnue et une approche unique centrée sur la création de valeur pour nos clients.
            </p>

            <p className="text-xl text-gray-700 leading-relaxed">
              Notre nom, <span className="font-bold">WIN WIN</span>, reflète notre philosophie : créer des solutions où tout le monde gagne. Vous gagnez en sécurité, en optimisation fiscale et en tranquillité d'esprit. Nous gagnons votre confiance et votre fidélité.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Interactive */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-white rounded-2xl mb-6 shadow-lg">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Notre Parcours</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              30 ans d'excellence au service de nos clients
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <div
                key={index}
                className="relative pl-8 pb-12 border-l-4 border-blue-600 last:pb-0"
              >
                {/* Point sur la timeline */}
                <div className="absolute left-0 top-0 w-6 h-6 bg-blue-600 rounded-full -translate-x-[13px] border-4 border-white shadow-lg" />
                
                <Card className="p-6 ml-6 bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-3xl font-bold text-blue-600">{item.year}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Mission */}
          <Card className="p-8 h-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl border-0 hover:scale-105 transition-transform duration-300">
            <Target className="w-16 h-16 mb-6" />
            <h3 className="text-3xl font-bold mb-4">Notre Mission</h3>
            <p className="text-lg text-blue-50 leading-relaxed">
              Accompagner nos clients dans la sécurisation de leur avenir et celui de leurs proches, en proposant des solutions d'assurances et de prévoyance parfaitement adaptées à leurs besoins et objectifs de vie.
            </p>
          </Card>

          {/* Vision */}
          <Card className="p-8 h-full bg-gradient-to-br from-green-600 to-green-700 text-white shadow-2xl border-0 hover:scale-105 transition-transform duration-300">
            <Eye className="w-16 h-16 mb-6" />
            <h3 className="text-3xl font-bold mb-4">Notre Vision</h3>
            <p className="text-lg text-green-50 leading-relaxed">
              Devenir le partenaire de référence en Suisse romande pour le conseil en assurances et prévoyance, reconnu pour notre indépendance, notre expertise et la qualité de notre accompagnement.
            </p>
          </Card>
        </div>
      </section>

      {/* Nos Valeurs - Glassmorphism */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 py-20">
        <div className="container px-4">
          <div className="text-center mb-16">
            <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Nos Valeurs</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="p-6 h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 group hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 leading-relaxed">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="container px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-purple-100 rounded-2xl mb-6">
            <Award className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Certifications & Agréments
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une expertise reconnue et certifiée
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <Card key={index} className="p-6 text-center bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-0 hover:-translate-y-2 group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <cert.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{cert.title}</h4>
              <p className="text-sm text-gray-600">{cert.subtitle}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border-0">
            <p className="text-lg font-semibold mb-2">Numéro FINMA</p>
            <p className="text-3xl font-bold">{COMPANY_INFO.finma}</p>
            <p className="text-sm text-blue-100 mt-2">
              Enregistré auprès de l'Autorité fédérale de surveillance des marchés financiers
            </p>
          </Card>
        </div>
      </section>

      {/* Olivier Neukomm - Fondateur */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-20">
        <div className="container px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden bg-white shadow-2xl border-0">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Photo Olivier Neukomm */}
                <div className="relative overflow-hidden">
                  <img 
                    src="/olivier-neukomm.jpg" 
                    alt="Olivier Neukomm - Directeur & Fondateur" 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Contenu */}
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{COMPANY_INFO.director.name}</h3>
                  <p className="text-xl text-blue-600 font-semibold mb-6">Directeur & Fondateur</p>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Expert en assurances, prévoyance et fonds de placement avec <span className="font-bold text-green-600">30 ans d'expérience</span>. Parcours remarquable démarré dans le domaine bancaire à Bâle, suivi d'un management de plus de 300 collaborateurs en Suisse romande. Entrepreneur passionné, fondateur de 7 sociétés dont <a href="https://www.peps.swiss" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold underline">PEP's Swiss SA</a>.
                  </p>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 mb-3">Spécialités</h4>
                    {[
                      "Prévoyance professionnelle",
                      "Planification retraite",
                      "Fonds de placement (Diplôme IAF)",
                      "Assurances entreprises",
                      "Concepts de fidélisation",
                      "Management & Leadership",
                    ].map((spec, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container px-4 py-20">
        <Card className="max-w-4xl mx-auto p-12 bg-gradient-to-br from-blue-600 via-green-500 to-blue-700 text-white shadow-2xl border-0 relative overflow-hidden">
          {/* Pattern de fond */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nous Contacter</h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Nous sommes à votre disposition pour répondre à toutes vos questions
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Phone className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-1">Téléphone</p>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="text-xl font-bold hover:text-yellow-300 transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-1">Email</p>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-xl font-bold hover:text-yellow-300 transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <MapPin className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-white/80 mb-1">Adresse</p>
                  <p className="text-xl font-bold">{CONTACT_INFO.address.street}</p>
                  <p className="text-lg">{CONTACT_INFO.address.postalCode} {CONTACT_INFO.address.city}</p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold text-lg h-14 px-8"
              onClick={() => window.location.href = '/conseil'}
            >
              Prendre rendez-vous
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
