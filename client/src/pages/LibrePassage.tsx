import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Target,
  CheckCircle2,
  Clock,
  Shield,
  Award,
  Sparkles,
  ArrowRight,
  Search,
  FileText,
  TrendingUp,
  HelpCircle,
  Phone,
  Mail,
} from "lucide-react";
import { CONTACT_INFO } from "@/const";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

export default function LibrePassage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(142, 71%, 45%), hsl(142, 71%, 50%), hsl(142, 60%, 60%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        
        <div className="container relative z-10 py-20">
          <motion.div 
            className="max-w-4xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-sm">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">SERVICE 100% GRATUIT</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Recherche de Libre Passage
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Retrouvez gratuitement tous vos avoirs de prévoyance professionnelle (2ème pilier) oubliés en Suisse
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://winwin.recherche-libre-passage.ch/fr/homepage" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-white text-green-600 hover:bg-white/90 font-semibold text-lg px-8 py-6 h-auto shadow-xl">
                  <Target className="w-5 h-5 mr-2" />
                  Lancer Ma Recherche Gratuite
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>
            </div>

            <div className="mt-8 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>100% Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Rapide</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Sécurisé</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Qu'est-ce que le Libre Passage ? */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Qu'est-ce que le Libre Passage ?</h2>
              <p className="text-xl text-muted-foreground">
                Comprendre vos avoirs de prévoyance professionnelle
              </p>
            </div>

            <Card className="border-2">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed mb-6">
                  Le <strong>libre passage</strong> désigne l'avoir de prévoyance professionnelle (2ème pilier) que vous avez accumulé 
                  auprès d'un employeur. Lorsque vous quittez un emploi, cet avoir est transféré sur un <strong>compte ou une police de libre passage</strong>.
                </p>

                <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Le saviez-vous ?</h4>
                      <p className="text-muted-foreground">
                        Des <strong className="text-foreground">millions de francs</strong> d'avoirs de libre passage sont actuellement oubliés en Suisse. 
                        Si vous avez changé plusieurs fois d'employeur au cours de votre carrière, vous avez peut-être des avoirs dont vous ne vous souvenez plus !
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Compte de libre passage</h4>
                      <p className="text-sm text-muted-foreground">
                        Compte bancaire spécial où sont déposés vos avoirs de prévoyance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Police de libre passage</h4>
                      <p className="text-sm text-muted-foreground">
                        Assurance-vie liée à votre prévoyance professionnelle
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pourquoi Rechercher ? */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Pourquoi Rechercher Vos Avoirs ?</h2>
              <p className="text-xl text-muted-foreground">
                Les avantages d'une recherche complète
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Retrouvez Votre Argent</CardTitle>
                  <CardDescription>
                    Des milliers de francs peuvent être oubliés sur d'anciens comptes
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Optimisez Votre Patrimoine</CardTitle>
                  <CardDescription>
                    Consolidez vos avoirs pour une meilleure vue d'ensemble
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Sécurisez Votre Retraite</CardTitle>
                  <CardDescription>
                    Assurez-vous que tous vos avoirs sont bien gérés
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comment ça marche ? */}
      <section className="py-20 bg-background">
        <div className="container max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Comment Ça Marche ?</h2>
              <p className="text-xl text-muted-foreground">
                Un processus simple en 3 étapes
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Remplissez le Formulaire</h3>
                  <p className="text-lg text-muted-foreground">
                    Indiquez vos informations personnelles (nom, prénom, date de naissance, anciens employeurs si connus)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Nous Lançons la Recherche</h3>
                  <p className="text-lg text-muted-foreground">
                    Notre équipe effectue une recherche approfondie auprès de la Centrale du 2ème pilier et des institutions de prévoyance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="h-16 w-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">Recevez Vos Résultats</h3>
                  <p className="text-lg text-muted-foreground">
                    Vous recevez un rapport complet avec la liste de tous vos avoirs de libre passage retrouvés (montants, institutions, coordonnées)
                  </p>
                </div>
              </div>
            </div>

            <Alert className="mt-12 bg-green-50 border-green-200">
              <Clock className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Délai de traitement :</strong> Les résultats vous sont généralement communiqués sous 5 à 10 jours ouvrables.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </section>

      {/* Garanties */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-5xl">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Nos Garanties</h2>
              <p className="text-xl text-muted-foreground">
                Un service de confiance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">100% Gratuit</h3>
                  <p className="text-muted-foreground">
                    Aucun frais, aucun engagement. Ce service est entièrement gratuit pour vous.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Confidentiel</h3>
                  <p className="text-muted-foreground">
                    Vos données sont traitées en toute confidentialité selon les normes suisses.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Professionnel</h3>
                  <p className="text-muted-foreground">
                    30 ans d'expérience dans le domaine de la prévoyance professionnelle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-background">
        <div className="container max-w-4xl">
          <motion.div {...fadeInUp}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Questions Fréquentes</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span>Qui peut bénéficier de ce service ?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Toute personne ayant travaillé en Suisse et ayant changé d'employeur au moins une fois peut avoir des avoirs de libre passage oubliés. 
                    Ce service est particulièrement utile si vous avez eu plusieurs employeurs au cours de votre carrière.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span>Pourquoi ce service est-il gratuit ?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    WIN WIN Finance Group offre ce service gratuitement dans le cadre de sa mission de conseil en prévoyance. 
                    Notre objectif est de vous aider à optimiser votre situation de prévoyance et à retrouver des avoirs qui vous appartiennent.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span>Que se passe-t-il si des avoirs sont retrouvés ?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Vous recevez un rapport détaillé avec les coordonnées des institutions de prévoyance concernées. 
                    Vous pouvez ensuite contacter ces institutions pour récupérer vos avoirs ou les transférer vers un compte de votre choix. 
                    Nous pouvons également vous accompagner dans ces démarches si vous le souhaitez.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span>Combien de temps prend la recherche ?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    La recherche prend généralement entre 5 et 10 jours ouvrables. Vous recevrez les résultats par email dès que la recherche sera terminée.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="container max-w-4xl text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à Retrouver Vos Avoirs ?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Lancez votre recherche gratuite dès maintenant. Aucun engagement, résultats garantis.
            </p>

            <a 
              href="https://winwin.recherche-libre-passage.ch/fr/homepage" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" className="bg-white text-green-600 hover:bg-white/90 font-semibold text-lg px-8 py-6 h-auto shadow-xl">
                <Target className="w-5 h-5 mr-2" />
                Lancer Ma Recherche Gratuite
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>

            <div className="mt-12 pt-12 border-t border-white/20">
              <p className="text-lg mb-4">Des questions ? Contactez-nous</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-primary">
                    <Phone className="w-4 h-4 mr-2" />
                    {CONTACT_INFO.phone}
                  </Button>
                </a>
                <a href={`mailto:${CONTACT_INFO.email}`}>
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20 border-white/30 text-primary">
                    <Mail className="w-4 h-4 mr-2" />
                    {CONTACT_INFO.email}
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
