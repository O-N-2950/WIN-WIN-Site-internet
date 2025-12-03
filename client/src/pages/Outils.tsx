import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  Calculator, 
  Home, 
  TrendingUp, 
  Shield, 
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
};

export default function Outils() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary/20 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Outils Gratuits</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Vos Outils d'Analyse Gratuits
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Découvrez nos outils interactifs pour <strong className="text-foreground">évaluer vos besoins</strong> en assurance et prévoyance. 
              Simples, rapides et <strong className="text-foreground">100% gratuits</strong>.
            </p>
          </motion.div>

          {/* Grille des outils */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Outil 1 : Inventaire Ménage */}
            <motion.div variants={scaleIn}>
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/30 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Home className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Inventaire Ménage</CardTitle>
                  <CardDescription className="text-base">
                    Établissez votre inventaire ménage en <strong className="text-foreground">2 minutes</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Calculateur intelligent par catégories</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Simulation de sous-assurance</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Téléchargement PDF gratuit</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-semibold">Durée : 2 minutes</span>
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Évitez la sous-assurance !</strong> 70% des ménages suisses sont sous-assurés et risquent de perdre des milliers de francs en cas de sinistre.
                    </p>
                  </div>

                  <Link href="/outils/inventaire-menage">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all group">
                      <Calculator className="w-5 h-5 mr-2" />
                      Établir mon inventaire
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Outil 2 : Calculateur Retraite (Coming Soon) */}
            <motion.div variants={scaleIn}>
              <Card className="h-full border-2 border-dashed border-muted bg-white/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                  Bientôt
                </div>
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/20 flex items-center justify-center mb-4 opacity-50">
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl text-muted-foreground">Calculateur Retraite</CardTitle>
                  <CardDescription className="text-base">
                    Estimez vos revenus à la retraite (AVS + LPP + 3e pilier)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 opacity-60">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Projection personnalisée</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Identification des lacunes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Conseils d'optimisation</span>
                    </div>
                  </div>

                  <Button disabled className="w-full" variant="outline">
                    <Clock className="w-5 h-5 mr-2" />
                    Disponible prochainement
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Outil 3 : Comparateur Assurances (Coming Soon) */}
            <motion.div variants={scaleIn}>
              <Card className="h-full border-2 border-dashed border-muted bg-white/50 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold">
                  Bientôt
                </div>
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/20 flex items-center justify-center mb-4 opacity-50">
                    <Shield className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl text-muted-foreground">Comparateur Assurances</CardTitle>
                  <CardDescription className="text-base">
                    Comparez les offres et trouvez la meilleure couverture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 opacity-60">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Comparaison multi-critères</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Recommandations personnalisées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">Économies potentielles</span>
                    </div>
                  </div>

                  <Button disabled className="w-full" variant="outline">
                    <Clock className="w-5 h-5 mr-2" />
                    Disponible prochainement
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Besoin d'un conseil personnalisé ?</h3>
                <p className="text-muted-foreground mb-6">
                  Nos experts sont à votre disposition pour analyser votre situation et vous proposer des solutions adaptées.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/conseil">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      Demandez Conseil
                    </Button>
                  </Link>
                  <Link href="/questionnaire-info">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Devenir Client
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
