import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CONTACT_INFO, ROUTES, SERVICES_LINKS } from "@/const";
import { motion } from "framer-motion";
import { AlertTriangle, Check, FileText, Phone, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";

export default function Durabilis() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative py-32 text-white overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 45%), hsl(205, 40%, 69%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Concept Durabilis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Protégez la Pérennité de Votre Entreprise
            </h1>
            <p className="text-2xl mb-8 text-white/90">
              Anticipez, protégez et assurez la continuité de votre entreprise en cas d'imprévu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demandez Conseil
                </Button>
              </Link>
              <a href={SERVICES_LINKS.durabilis} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  Voir la Présentation Complète
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Le Risque */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Le Risque Souvent Ignoré</h2>
            <p className="text-xl text-muted-foreground">
              Le décès d'un associé peut mettre en péril l'avenir de votre entreprise. Sans préparation, 
              les conséquences peuvent être dramatiques pour l'entreprise, les associés survivants et les familles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <AlertTriangle className="w-12 h-12 text-destructive" />,
                title: "Blocage de l'Entreprise",
                description: "Les héritiers deviennent associés sans avoir les compétences ni la volonté de gérer l'entreprise."
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-destructive" />,
                title: "Problèmes Financiers",
                description: "L'entreprise doit racheter les parts sans avoir les liquidités nécessaires."
              },
              {
                icon: <Users className="w-12 h-12 text-destructive" />,
                title: "Conflits Familiaux",
                description: "Les héritiers et les associés survivants ont des intérêts divergents."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center h-full hover:shadow-lg transition-shadow border-destructive/20">
                  <div className="flex justify-center mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* La Solution Durabilis */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">La Solution Durabilis</h2>
            <p className="text-xl text-muted-foreground">
              Un dispositif complet qui combine assurance décès et convention d'actionnaires pour garantir 
              la continuité de votre entreprise
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 mb-12"
            >
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4">Comment ça marche ?</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Durabilis combine deux éléments essentiels : une <strong>assurance décès croisée</strong> entre 
                    associés et une <strong>convention d'actionnaires</strong> qui organise le rachat des parts. 
                    En cas de décès d'un associé, l'assurance fournit les liquidités nécessaires pour racheter 
                    les parts aux héritiers.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Assurance décès croisée</strong>
                        <span className="text-sm text-muted-foreground">Chaque associé assure ses co-associés</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Convention d'actionnaires</strong>
                        <span className="text-sm text-muted-foreground">Organise le rachat des parts</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Liquidités garanties</strong>
                        <span className="text-sm text-muted-foreground">Capital disponible immédiatement</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <strong className="block mb-1">Protection familiale</strong>
                        <span className="text-sm text-muted-foreground">Les héritiers reçoivent la valeur des parts</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Les 3 Piliers */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Les 3 Piliers de Durabilis</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "1",
                icon: <FileText className="w-10 h-10 text-primary" />,
                title: "Convention d'Actionnaires",
                description: "Document juridique qui définit les règles de rachat des parts en cas de décès, garantissant la continuité de l'entreprise.",
                points: [
                  "Valorisation des parts",
                  "Modalités de rachat",
                  "Droits et obligations"
                ]
              },
              {
                number: "2",
                icon: <Shield className="w-10 h-10 text-primary" />,
                title: "Assurance Décès Croisée",
                description: "Chaque associé souscrit une assurance sur la vie de ses co-associés, garantissant les liquidités nécessaires au rachat.",
                points: [
                  "Capital garanti",
                  "Primes déductibles",
                  "Protection immédiate"
                ]
              },
              {
                number: "3",
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Protection des Familles",
                description: "Les héritiers reçoivent la juste valeur des parts sans avoir à s'impliquer dans la gestion de l'entreprise.",
                points: [
                  "Valeur garantie",
                  "Liquidités immédiates",
                  "Sérénité familiale"
                ]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-lg transition-shadow relative">
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{item.number}</span>
                  </div>
                  <div className="mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.points.map((point, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemple Concret */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-8 text-center">Exemple Concret</h2>
            <Card className="p-8 md:p-12">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Cas Pratique</h3>
                  <p className="text-lg text-muted-foreground">
                    Trois associés détiennent chacun 33% d'une entreprise valorisée à CHF 3'000'000.-
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 py-6 border-t border-b">
                  <div>
                    <h4 className="font-bold mb-3 text-lg">Situation</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Valeur entreprise : CHF 3'000'000.-</li>
                      <li>• Parts par associé : CHF 1'000'000.-</li>
                      <li>• Prime annuelle/associé : ~CHF 3'000.-</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-3 text-lg">En cas de décès</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Capital assuré : CHF 1'000'000.-</li>
                      <li>• Rachat des parts aux héritiers</li>
                      <li>• Entreprise continue avec 2 associés</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-6">
                  <p className="text-lg">
                    <strong className="text-primary">Résultat :</strong> Pour moins de CHF 250.- par mois et par associé, 
                    l'entreprise est protégée et les familles sont assurées de recevoir la juste valeur des parts. 
                    Les associés survivants gardent le contrôle de l'entreprise.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Pourquoi Choisir Durabilis ?</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: "🛡️",
                title: "Continuité Garantie",
                description: "L'entreprise continue sans interruption"
              },
              {
                icon: "💰",
                title: "Liquidités Assurées",
                description: "Capital disponible pour le rachat des parts"
              },
              {
                icon: "👨‍👩‍👧‍👦",
                title: "Familles Protégées",
                description: "Les héritiers reçoivent la valeur des parts"
              },
              {
                icon: "📊",
                title: "Fiscalité Optimisée",
                description: "Primes déductibles fiscalement"
              },
              {
                icon: "⚖️",
                title: "Cadre Juridique",
                description: "Convention claire et opposable"
              },
              {
                icon: "🤝",
                title: "Sérénité",
                description: "Évite les conflits entre héritiers et associés"
              },
              {
                icon: "📈",
                title: "Valorisation",
                description: "Méthode de valorisation définie à l'avance"
              },
              {
                icon: "✅",
                title: "Simplicité",
                description: "Mise en place rapide et efficace"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <Card className="p-6 text-center h-full hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom right, hsl(203, 55%, 42%), hsl(203, 55%, 44%), hsl(205, 40%, 69%))'
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Protégez Votre Entreprise Dès Aujourd'hui
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Ne laissez pas l'imprévu mettre en péril des années de travail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.questionnaireInfo}>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Demandez Conseil
                </Button>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Phone className="w-5 h-5 mr-2" />
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
