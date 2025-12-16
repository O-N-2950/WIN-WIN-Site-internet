import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Scale, 
  Banknote, 
  FileSignature, 
  ArrowRight, 
  Check, 
  AlertOctagon, 
  HeartHandshake, 
  Phone, 
  Mail, 
  Clock,
  Landmark
} from 'lucide-react';

// --- Animations Config ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// --- Composants UI ---

const SectionTitle = ({ children, subtitle, light = false }: { children: React.ReactNode; subtitle?: string; light?: boolean }) => (
  <div className="mb-16 text-center max-w-3xl mx-auto">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-4xl md:text-5xl font-serif font-bold mb-4 ${light ? 'text-white' : 'text-slate-900'}`}
    >
      {children}
    </motion.h2>
    <div className={`h-1 w-24 mx-auto rounded-full mb-6 ${light ? 'bg-emerald-400' : 'bg-emerald-600'}`}></div>
    {subtitle && (
      <p className={`text-lg md:text-xl ${light ? 'text-slate-300' : 'text-slate-600'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }: { icon: any; title: string; desc: string; delay?: number }) => (
  <motion.div
    variants={fadeInUp}
    className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-emerald-600 hover:shadow-2xl transition-all duration-300 group"
  >
    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
      <Icon className="w-7 h-7 text-emerald-700 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3 font-serif">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </motion.div>
);

const ProcessStep = ({ number, title, desc }: { number: number; title: string; desc: string }) => (
  <motion.div 
    variants={fadeInUp}
    className="relative pl-12 md:pl-0 md:text-center flex flex-col md:items-center"
  >
    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
      {number}
    </div>
    <div className="md:mt-14 p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow w-full">
      <h4 className="text-lg font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  </motion.div>
);

// --- Page Principale ---

export default function Durabilis() {
  const [activeTab, setActiveTab] = useState('problem');

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden selection:bg-emerald-200">
      
      {/* HERO SECTION */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
            alt="Heritage and Legacy" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-emerald-900/70 to-amber-900/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Durabilis
            </motion.h1>
            <motion.p 
              className="text-xl md:text-3xl text-emerald-200 mb-4 font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Héritage & Prestige
            </motion.p>
            <motion.p 
              className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Protégez ce que vous avez construit. Assurez la pérennité de votre entreprise et la sécurité financière de vos proches.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => document.getElementById('context')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Comprendre l'enjeu <ArrowRight size={20}/>
              </motion.button>
            </div>
          </motion.div>

          {/* Abstract Visual Element */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <div className="w-8 h-12 border-2 border-emerald-400 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-emerald-400 rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* SECTION CONTEXTE */}
      <section id="context" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Une réalité souvent ignorée">
            Le Risque Invisible
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl">
                <div className="flex items-start gap-4">
                  <AlertOctagon className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Le Scénario Catastrophe</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Un associé clé décède ou devient invalide. Sans protection, l'entreprise doit racheter ses parts à ses héritiers... 
                      avec quels fonds ? Les survivants se retrouvent associés avec des inconnus, ou pire : l'entreprise est vendue.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">La Solution Durabilis</h3>
                    <p className="text-slate-700 leading-relaxed">
                      Un pacte d'associés couplé à des assurances vie croisées garantit que l'entreprise dispose des liquidités nécessaires 
                      pour racheter les parts, indemniser les héritiers, et poursuivre son activité sereinement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-slate-100 to-emerald-50 p-8 rounded-2xl shadow-xl"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif">Chiffres Clés</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-emerald-700">70%</span>
                    <span className="text-slate-600 text-lg">des PME</span>
                  </div>
                  <p className="text-slate-700">n'ont aucune protection en cas de décès d'un associé</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-amber-600">3-5x</span>
                    <span className="text-slate-600 text-lg">le CA annuel</span>
                  </div>
                  <p className="text-slate-700">Valeur moyenne d'une entreprise à racheter</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-bold text-red-600">6 mois</span>
                    <span className="text-slate-600 text-lg">en moyenne</span>
                  </div>
                  <p className="text-slate-700">Délai avant faillite sans solution de rachat</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION AVANTAGES */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Une protection complète et sur-mesure">
            Pourquoi Durabilis ?
          </SectionTitle>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            <FeatureCard 
              icon={Shield}
              title="Protection Juridique"
              desc="Pacte d'associés blindé rédigé par nos juristes partenaires. Clause d'achat/vente automatique en cas de décès ou invalidité."
            />
            <FeatureCard 
              icon={Banknote}
              title="Liquidités Garanties"
              desc="Les assurances vie croisées fournissent instantanément les fonds nécessaires au rachat des parts, sans endettement."
            />
            <FeatureCard 
              icon={Users}
              title="Continuité Assurée"
              desc="Les associés survivants gardent le contrôle total. Les héritiers sont indemnisés équitablement. L'entreprise poursuit son activité."
            />
            <FeatureCard 
              icon={Scale}
              title="Valorisation Objective"
              desc="Estimation professionnelle de la valeur de l'entreprise pour fixer des montants justes et acceptés par tous."
            />
            <FeatureCard 
              icon={HeartHandshake}
              title="Sérénité Familiale"
              desc="Les proches du défunt reçoivent une compensation financière immédiate, sans conflit ni procédure judiciaire."
            />
            <FeatureCard 
              icon={FileSignature}
              title="Simplicité Administrative"
              desc="Nous gérons toute la complexité : valorisation, rédaction juridique, souscription des polices, suivi annuel."
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION PROCESSUS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Un accompagnement de A à Z">
            Notre Méthode en 3 Étapes
          </SectionTitle>

          <div className="max-w-5xl mx-auto">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              <ProcessStep 
                number={1}
                title="Valorisation"
                desc="Estimation objective de la valeur de l'entreprise pour fixer les montants à assurer."
              />
              <ProcessStep 
                number={2}
                title="Convention"
                desc="Rédaction du pacte d'associés (Clause d'achat/vente) par nos juristes partenaires."
              />
              <ProcessStep 
                number={3}
                title="Financement"
                desc="Mise en place des polices d'assurance sur la tête de chaque associé clé."
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 text-center"
          >
            <div className="inline-block bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-2xl">
              <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <p className="text-slate-700 text-lg">
                <span className="font-bold text-emerald-700">Durée moyenne :</span> 4 à 6 semaines de la première rencontre à la signature des contrats.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION CAS PRATIQUE */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-emerald-900 text-white">
        <div className="container mx-auto px-6">
          <SectionTitle light subtitle="Un exemple concret">
            Cas d'École
          </SectionTitle>

          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 font-serif text-emerald-300">Garage Müller SA</h3>
              
              <div className="space-y-6 text-slate-200 leading-relaxed">
                <p>
                  <span className="font-bold text-white">Situation :</span> Trois associés à parts égales (33% chacun). 
                  Valeur de l'entreprise : <span className="text-emerald-300 font-bold">CHF 1'500'000.-</span>
                </p>
                
                <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="font-bold text-red-300 mb-2">❌ Sans Durabilis</p>
                  <p>
                    Un associé décède. Ses héritiers réclament CHF 500'000.- Les deux survivants n'ont pas ces liquidités. 
                    Ils doivent vendre l'entreprise ou s'endetter lourdement. L'entreprise périclite.
                  </p>
                </div>

                <div className="bg-emerald-900/30 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                  <p className="font-bold text-emerald-300 mb-2">✅ Avec Durabilis</p>
                  <p>
                    Les assurances vie croisées versent automatiquement CHF 500'000.- aux survivants. 
                    Ils rachètent les parts, indemnisent les héritiers selon le pacte d'associés, et poursuivent l'activité sereinement.
                  </p>
                </div>

                <div className="bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="font-bold text-amber-300 mb-2">💰 Coût de la solution</p>
                  <p>
                    Prime annuelle totale : <span className="font-bold">CHF 4'500.-</span> (soit CHF 1'500.- par associé). 
                    Un investissement dérisoire comparé au risque de perdre l'entreprise.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION FAQ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Réponses aux questions fréquentes">
            Questions Fréquentes
          </SectionTitle>

          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-600" />
                Qui paie les primes d'assurance ?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Généralement, c'est l'entreprise qui paie les primes (déductibles fiscalement). 
                Les associés peuvent aussi payer individuellement selon la structure choisie.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-600" />
                Que se passe-t-il en cas d'invalidité ?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Le pacte d'associés peut prévoir une clause de rachat en cas d'invalidité totale. 
                Des assurances complémentaires (perte de gain, rente invalidité) peuvent être ajoutées.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-600" />
                Combien de temps dure le contrat ?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Le pacte d'associés et les assurances sont généralement conclus pour une durée indéterminée, 
                avec révision tous les 3-5 ans pour ajuster la valorisation de l'entreprise.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-slate-50 rounded-xl p-6 border border-slate-200"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                <Check className="w-6 h-6 text-emerald-600" />
                Est-ce adapté aux petites structures ?
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Oui ! Même une Sàrl à deux associés bénéficie grandement de cette protection. 
                Plus la structure est petite, plus la perte d'un associé est critique.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION CTA FINAL */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Landmark className="w-16 h-16 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Protégez Votre Héritage Dès Aujourd'hui
            </h2>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Ne laissez pas le hasard décider du sort de votre entreprise. 
              Contactez-nous pour une analyse gratuite et sans engagement.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="/conseil"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-emerald-700 px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-emerald-50 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Demandez Conseil
              </motion.a>
              <motion.a 
                href="mailto:contact@winwin.swiss"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-700 text-white px-10 py-4 rounded-full font-bold border-2 border-white hover:bg-emerald-800 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                contact@winwin.swiss
              </motion.a>
            </div>

            <p className="mt-8 text-emerald-200 text-sm">
              ✓ Analyse gratuite · ✓ Sans engagement · ✓ Réponse sous 48h
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
