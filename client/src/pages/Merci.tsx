import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  Mail, 
  Calendar, 
  FileText, 
  ExternalLink,
  Phone,
  Download,
  ArrowRight
} from "lucide-react";
import { CONTACT_INFO } from "@/const";

export default function Merci() {
  // Données simulées (à remplacer par les vraies données)
  const clientData = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    tarif: 185,
    isFree: false,
    mandatNumber: "WW-2025-00123",
    startDate: new Date().toLocaleDateString("fr-CH")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-primary/5 py-12">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 text-green-600 mx-auto">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold text-green-600">
                Félicitations !
              </h1>
              <p className="text-xl md:text-2xl font-medium">
                Votre mandat de gestion est activé
              </p>
            </div>
          </div>

          {/* Confirmation */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-800">Bienvenue chez WIN WIN Finance Group</CardTitle>
              <CardDescription className="text-green-700">
                Votre mandat a été créé avec succès
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-700 font-medium mb-1">Numéro de mandat</p>
                  <p className="font-mono text-lg">{clientData.mandatNumber}</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium mb-1">Date de début</p>
                  <p className="text-lg">{clientData.startDate}</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium mb-1">Tarif annuel</p>
                  <p className="text-lg">
                    {clientData.isFree ? "Offert" : `CHF ${clientData.tarif}.-/an`}
                  </p>
                </div>
                <div>
                  <p className="text-green-700 font-medium mb-1">Statut</p>
                  <p className="text-lg font-medium text-green-600">✓ Actif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email de confirmation */}
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              Un email de confirmation a été envoyé à <strong>{clientData.email}</strong> avec 
              tous les détails de votre mandat et vos accès à l'espace client.
            </AlertDescription>
          </Alert>

          {/* Prochaines étapes */}
          <Card>
            <CardHeader>
              <CardTitle>Prochaines étapes</CardTitle>
              <CardDescription>
                Voici ce qui va se passer maintenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      1
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email de bienvenue
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Vous recevrez dans quelques minutes un email avec vos identifiants d'accès 
                      à l'espace client et le récapitulatif de votre mandat.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      2
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Rendez-vous de lancement
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Olivier Neukomm vous contactera dans les 48h pour planifier un rendez-vous 
                      de lancement et faire le point sur vos besoins.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      3
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Analyse détaillée
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Nous analyserons en profondeur toutes vos polices d'assurance et vous 
                      présenterons nos recommandations d'optimisation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Accéder à l'Espace Client</CardTitle>
                <CardDescription>
                  Consultez vos polices et documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a 
                  href="https://erp.winwin.swiss" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button className="w-full" variant="default">
                    Ouvrir l'Espace Client
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Télécharger votre Mandat</CardTitle>
                <CardDescription>
                  PDF signé de votre mandat de gestion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le PDF
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold">Une question ?</h3>
                <p className="text-primary-foreground/90">
                  Notre équipe est à votre disposition pour répondre à toutes vos questions
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                  <a 
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-primary-foreground hover:underline"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="font-medium">{CONTACT_INFO.phone}</span>
                  </a>
                  <a 
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="flex items-center gap-2 text-primary-foreground hover:underline"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">{CONTACT_INFO.email}</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partage */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h4 className="font-semibold">Vous êtes satisfait de notre service ?</h4>
                <p className="text-sm text-muted-foreground">
                  Partagez WIN WIN Finance Group avec vos proches et aidez-les à optimiser 
                  leurs assurances. Pour chaque parrainage, vous bénéficiez d'une réduction 
                  de CHF 50.- sur votre prochain renouvellement.
                </p>
                <Button variant="outline">
                  Parrainer un proche
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Retour à l'accueil */}
          <div className="text-center pt-8">
            <a href="/">
              <Button variant="ghost" size="lg">
                Retour à l'accueil
              </Button>
            </a>
          </div>

          {/* Footer sécurité */}
          <div className="text-center text-sm text-muted-foreground pt-8 border-t">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Votre paiement a été traité avec succès • Transaction sécurisée SSL • Hébergement Suisse 🇨🇭
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
