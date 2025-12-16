import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONTACT_INFO } from "@/const";
import {
  Shield,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Smartphone,
  Lock,
  ExternalLink,
  HelpCircle,
} from "lucide-react";

const avantages = [
  {
    icon: FileText,
    titre: "Vos contrats d'assurance",
    description: "Consultez tous vos contrats en un seul endroit",
  },
  {
    icon: CreditCard,
    titre: "Vos décomptes de primes",
    description: "Suivez vos paiements et téléchargez vos factures",
  },
  {
    icon: AlertCircle,
    titre: "Vos sinistres",
    description: "Suivez l'avancement de vos déclarations de sinistres",
  },
  {
    icon: CheckCircle2,
    titre: "Vos demandes en cours",
    description: "Consultez le statut de vos demandes en temps réel",
  },
];

const etapesConnexion = [
  {
    numero: "1",
    titre: "Vérifiez votre email",
    description: "Vous avez reçu un email d'invitation de notre part (noreply@airtable.com)",
  },
  {
    numero: "2",
    titre: "Acceptez l'invitation",
    description: "Cliquez sur le bouton \"Accept invite\" dans l'email",
  },
  {
    numero: "3",
    titre: "Créez votre mot de passe",
    description: "Choisissez un mot de passe personnel et sécurisé",
  },
  {
    numero: "4",
    titre: "Accédez à votre espace",
    description: "Connectez-vous et consultez toutes vos informations",
  },
];

export default function ClientSpace() {
  const handleAccessSpace = () => {
    // Redirection vers Airtable
    window.open("https://airtable.com/", "_blank");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 text-primary mx-auto mb-4">
              <Lock className="h-10 w-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Accès à votre Espace Client Sécurisé
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              WIN WIN Finance Group met à disposition de ses clients un espace sécurisé en ligne
            </p>
          </div>
        </div>
      </section>

      {/* Message Principal */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 md:p-12 space-y-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg">
                    Bonjour,
                  </p>
                  <p className="text-lg">
                    WIN WIN Finance Group met à disposition de ses clients un <strong>espace client sécurisé en ligne</strong>, 
                    conçu pour simplifier le suivi administratif et offrir un accès centralisé à toutes vos informations d'assurance.
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    Une fois connecté, vous accéderez à :
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {avantages.map((avantage, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <avantage.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{avantage.titre}</h4>
                          <p className="text-sm text-muted-foreground">{avantage.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={handleAccessSpace}
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Accéder à mon espace client
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Première Connexion */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                <Mail className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Première connexion ?</h2>
              <p className="text-lg text-muted-foreground">
                Suivez ces étapes simples pour accéder à votre espace client
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {etapesConnexion.map((etape, index) => (
                <div key={index} className="relative">
                  <Card className="h-full">
                    <CardContent className="p-6 space-y-4">
                      <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                        {etape.numero}
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">{etape.titre}</h4>
                        <p className="text-sm text-muted-foreground">{etape.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {index < etapesConnexion.length - 1 && (
                    <div className="hidden md:block absolute top-1/4 -right-3 w-6 h-0.5 bg-primary/30" />
                  )}
                </div>
              ))}
            </div>

            <Card className="mt-8 bg-secondary/10 border-secondary">
              <CardContent className="p-6 flex items-start gap-4">
                <Smartphone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-2">💡 Astuce : Application Mobile</h4>
                  <p className="text-sm text-muted-foreground">
                    Téléchargez l'application <strong>Airtable</strong> sur votre téléphone mobile (iOS ou Android) 
                    pour un accès encore plus pratique à votre espace client, où que vous soyez !
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                  <Shield className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Vos données sont protégées</h3>
                  <p className="text-muted-foreground">
                    Votre espace client est hébergé sur <strong>Airtable</strong>, une plateforme sécurisée 
                    de niveau entreprise avec chiffrement SSL/TLS. Vos informations personnelles et vos 
                    documents sont protégés selon les normes de sécurité les plus strictes.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Chiffrement SSL/TLS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Accès sécurisé par mot de passe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Données hébergées en Europe</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Aide et Support */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mx-auto">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Besoin d'aide ?</h2>
              <p className="text-lg text-muted-foreground">
                Notre équipe reste à votre disposition pour toute question ou remarque
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Par téléphone</h4>
                    <a
                      href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                      className="text-lg text-primary hover:underline font-medium"
                    >
                      {CONTACT_INFO.phone}
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Lundi - Vendredi<br />
                      9h00 - 12h00 | 14h00 - 17h00
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Par email</h4>
                    <a
                      href={`mailto:${CONTACT_INFO.email}`}
                      className="text-lg text-primary hover:underline font-medium break-all"
                    >
                      {CONTACT_INFO.email}
                    </a>
                    <p className="text-sm text-muted-foreground mt-2">
                      Réponse sous 24h<br />
                      (jours ouvrables)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  <strong>Cet outil étant en constante amélioration</strong>, n'hésitez pas à nous faire part 
                  de vos remarques ou suggestions afin que nous puissions l'adapter au mieux à vos besoins.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Prêt à accéder à votre espace client ?
            </h2>
            <p className="text-lg opacity-90">
              Consultez vos contrats, décomptes, sinistres et demandes en toute simplicité
            </p>
            <Button
              size="lg"
              onClick={handleAccessSpace}
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6"
            >
              <Lock className="mr-2 h-5 w-5" />
              Accéder à mon espace client
              <ExternalLink className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
