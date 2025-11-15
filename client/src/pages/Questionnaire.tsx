import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPANY_INFO, CONTACT_INFO } from "@/const";
import { 
  FileText, 
  Clock, 
  Shield, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  Sparkles
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Informations Personnelles",
    description: "Vos coordonnées et situation familiale",
    duration: "3 min"
  },
  {
    icon: Upload,
    title: "Upload de Polices",
    description: "Téléchargez vos polices actuelles (OCR automatique)",
    duration: "5 min"
  },
  {
    icon: Shield,
    title: "Besoins et Objectifs",
    description: "Vos priorités en matière d'assurances",
    duration: "7 min"
  },
  {
    icon: Sparkles,
    title: "Analyse Personnalisée",
    description: "Notre IA analyse votre situation",
    duration: "5 min"
  }
];

const benefits = [
  {
    icon: Clock,
    title: "Rapide",
    description: "Seulement 20 minutes pour une analyse complète"
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Vos données sont cryptées et protégées (SSL + hébergement Suisse)"
  },
  {
    icon: CheckCircle2,
    title: "Gratuit",
    description: "Analyse et recommandations sans engagement"
  }
];

export default function Questionnaire() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Analyse Gratuite de Votre Situation
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Répondez à notre questionnaire intelligent et recevez une analyse personnalisée 
              de vos assurances en seulement 20 minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>20 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>100% gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Sans engagement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Étapes du Questionnaire */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche ?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Un processus simple en 4 étapes pour une analyse complète de votre situation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-center">{step.title}</CardTitle>
                  <CardDescription className="text-center">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {step.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Pourquoi faire ce questionnaire ?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technologie OCR */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-primary to-secondary text-primary-foreground">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm">
                      <Sparkles className="h-4 w-4" />
                      <span>Technologie IA</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">
                      Analyse Automatique de Vos Polices
                    </h2>
                    <p className="text-primary-foreground/90 text-lg">
                      Notre système d'intelligence artificielle analyse automatiquement vos polices 
                      d'assurance existantes grâce à la technologie OCR (reconnaissance optique de caractères).
                    </p>
                    <p className="text-primary-foreground/90">
                      <strong>Gain de temps :</strong> Plus besoin de saisir manuellement toutes les informations. 
                      Uploadez simplement vos polices PDF et notre IA extrait automatiquement les données essentielles.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">Extraction automatique des données</span>
                      </div>
                      <p className="text-sm text-primary-foreground/80 ml-8">
                        Compagnie, numéro de police, primes, franchises...
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">Validation en temps réel</span>
                      </div>
                      <p className="text-sm text-primary-foreground/80 ml-8">
                        Vérifiez et corrigez les données extraites si nécessaire
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">Sécurité maximale</span>
                      </div>
                      <p className="text-sm text-primary-foreground/80 ml-8">
                        Vos documents sont cryptés et stockés en Suisse
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à optimiser vos assurances ?
            </h2>
            <p className="text-lg text-muted-foreground">
              Commencez dès maintenant votre analyse gratuite et découvrez comment économiser 
              sur vos primes tout en améliorant votre couverture.
            </p>

            <div className="space-y-4">
              <a 
                href="/questionnaire/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Commencer le Questionnaire
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <p className="text-sm text-muted-foreground">
                Vous serez redirigé vers notre plateforme sécurisée
              </p>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                Des questions avant de commencer ?
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a 
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <span>{CONTACT_INFO.phone}</span>
                </a>
                <a 
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <span>{CONTACT_INFO.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-12 bg-background border-t">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center text-sm text-muted-foreground">
            <div className="space-y-2">
              <Shield className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium text-foreground">100% Confidentiel</p>
              <p>Vos données sont protégées et ne seront jamais partagées</p>
            </div>
            <div className="space-y-2">
              <CheckCircle2 className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium text-foreground">Sans Engagement</p>
              <p>Aucune obligation d'achat ou de souscription</p>
            </div>
            <div className="space-y-2">
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <p className="font-medium text-foreground">Réponse Rapide</p>
              <p>Analyse disponible immédiatement après le questionnaire</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
