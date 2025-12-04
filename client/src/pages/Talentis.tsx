import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Briefcase, 
  TrendingUp, 
  Users, 
  Award, 
  HeartPulse, 
  FileText, 
  Calculator, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Globe 
} from 'lucide-react';

// --- Configuration des Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// --- Composants UI ---

const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
    >
      {children}
    </motion.h2>
    {subtitle && <p className="text-slate-500 text-lg max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const Card = ({ title, icon: Icon, children, delay = 0 }) => (
  <motion.div
    variants={fadeInUp}
    whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-start h-full"
  >
    <div className="p-3 bg-blue-50 rounded-xl mb-4">
      <Icon className="w-8 h-8 text-blue-600" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <div className="text-slate-600 leading-relaxed text-sm">
      {children}
    </div>
  </motion.div>
);

const BenefitItem = ({ number, title, desc }) => (
  <motion.div variants={fadeInUp} className="flex gap-4 items-start mb-8 last:mb-0">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
      {number}
    </div>
    <div>
      <h4 className="text-lg font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-slate-600 text-sm">{desc}</p>
    </div>
  </motion.div>
);

const ScenarioCard = ({ title, status, desc, color }) => (
  <motion.div 
    variants={fadeInUp}
    className={`p-6 rounded-xl border-l-4 ${color} bg-white shadow-md hover:shadow-xl transition-shadow`}
  >
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-bold text-lg text-slate-800">{title}</h4>
      {status === 'success' ? <CheckCircle className="text-green-500" /> : 
       status === 'fail' ? <XCircle className="text-red-500" /> : 
       <AlertTriangle className="text-amber-500" />}
    </div>
    <p className="text-slate-600 text-sm">{desc}</p>
  </motion.div>
);

// --- Page Principale ---

export default function Talentis() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden">
      
      {/* HEADER / HERO */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-90"></div>
          {/* Abstract background shapes */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" 
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold mb-6 backdrop-blur-sm">
              Stratégie RH & Finance
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          >
            Les Indemnités <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              de Départ
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto"
          >
            Fidélisation des personnes clés. Sécurité financière. Optimisation fiscale. 
            <br/><span className="text-sm text-slate-400 mt-2 block">Présenté par Winwin Finance Group & AI Innovation Sàrl</span>
          </motion.p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-blue-500/50 transition-all"
            onClick={() => document.getElementById('definition').scrollIntoView({ behavior: 'smooth' })}
          >
            Découvrir le concept
          </motion.button>
        </div>
      </header>

      {/* DEFINITION SECTION */}
      <section id="definition" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer}
            >
              <h2 className="text-4xl font-bold mb-6 text-slate-800">Qu'est-ce qu'une Indemnité de Départ ?</h2>
              <p className="text-lg text-slate-600 mb-6">
                C'est une <strong>compensation financière</strong> stratégique accordée aux employés clés. Elle se distingue par son versement différé et conditionnel.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <CheckCircle className="text-green-500 w-6 h-6" />
                  <span className="text-slate-700">Versée à la fin du contrat (sous conditions)</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <XCircle className="text-red-500 w-6 h-6" />
                  <span className="text-slate-700">PAS versée en cas de démission simple</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <FileText className="text-blue-500 w-6 h-6" />
                  <span className="text-slate-700">Avenant au contrat OBLIGATOIRE</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl transform rotate-3 opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Business meeting" 
                className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[400px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* AVANTAGES EMPLOYEUR (GRID) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Pourquoi mettre cela en place pour votre entreprise ?">
            Avantages pour l'Employeur
          </SectionTitle>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <Card title="Fidélisation" icon={Users}>
              Outil puissant de rétention ("Menottes dorées"). Plus le temps passe, plus l'employé a intérêt à rester pour toucher son capital.
            </Card>
            <Card title="Sécurité" icon={ShieldCheck}>
              Si l'employé part avant terme (démission), l'entreprise récupère intégralement la valeur de l'assurance.
            </Card>
            <Card title="Fiscalité" icon={TrendingUp}>
              Les primes payées sont déductibles comme charges professionnelles, réduisant l'impôt sur le bénéfice.
            </Card>
            <Card title="Image Marque" icon={Award}>
              Renforce la marque employeur en montrant que vous investissez concrètement dans l'avenir de vos talents.
            </Card>
          </motion.div>
        </div>
      </section>

      {/* AVANTAGES EMPLOYÉ (LISTE ANIMÉE) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            
            <motion.div
               initial={{ opacity: 0, scale: 0.8 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="order-2 md:order-1 flex items-center justify-center"
            >
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-indigo-500 to-blue-700 rounded-full flex items-center justify-center text-white p-12 text-center shadow-2xl">
                <div>
                  <div className="text-6xl font-bold mb-2">1/5</div>
                  <div className="text-xl opacity-90">Du taux d'impôt ordinaire</div>
                  <div className="mt-4 text-sm bg-white/20 p-2 rounded backdrop-blur-md">Avantage Fiscal Majeur</div>
                </div>
              </div>
            </motion.div>

            <div className="order-1 md:order-2">
              <SectionTitle>Avantages pour l'Employé</SectionTitle>
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <BenefitItem 
                  number="01" 
                  title="Sécurité Financière" 
                  desc="Capital important pour la retraite, la retraite anticipée ou le rachat d'entreprise."
                />
                <BenefitItem 
                  number="02" 
                  title="Protection Décès & Invalidité" 
                  desc="En cas de coup dur, le capital est versé à la famille ou les primes sont prises en charge."
                />
                <BenefitItem 
                  number="03" 
                  title="Fiscalité Exceptionnelle" 
                  desc="Imposition séparée du revenu à un taux très réduit (1/5ème du taux ordinaire)."
                />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* IMPLEMENTATION STEPS */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Une méthodologie rigoureuse pour une conformité totale">
            <span className="text-white">Comment mettre en place ?</span>
          </SectionTitle>

          <div className="grid md:grid-cols-4 gap-4 mt-12">
             {[
               { icon: Users, title: "Identifier", text: "Cibler les employés clés (Cadres, Experts)." },
               { icon: Calculator, title: "Calculer", text: "Définir la lacune de prévoyance (cotisations perdues)." },
               { icon: FileText, title: "Contractualiser", text: "Signer un avenant (conditions d'âge et d'ancienneté)." },
               { icon: ShieldCheck, title: "Financer", text: "Souscrire une Assurance Vie (3e Pilier B) nantie." },
             ].map((step, idx) => (
               <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.2 }}
                 className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-colors"
               >
                 <step.icon className="w-10 h-10 text-blue-400 mb-4" />
                 <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                 <p className="text-slate-400 text-sm">{step.text}</p>
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* CAS PRATIQUE / SCENARIOS */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Exemple : M. Martin, 40 ans, objectif 60 ans">
            Scénarios Possibles
          </SectionTitle>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ScenarioCard 
              title="Scénario A : Succès" 
              status="success"
              color="border-green-500"
              desc="Il reste jusqu'à 60 ans. Il perçoit le capital (ex: CHF 684k) avec impôt réduit. L'entreprise a fidélisé son talent."
            />
            <ScenarioCard 
              title="Scénario B : Démission" 
              status="fail"
              color="border-red-500"
              desc="Il part à 55 ans. Aucune indemnité versée. L'entreprise récupère tout le capital pour réinvestir."
            />
            <ScenarioCard 
              title="Scénario C : Décès" 
              status="alert"
              color="border-amber-500"
              desc="Le capital est versé à la famille (héritiers). Protection financière immédiate."
            />
            <ScenarioCard 
              title="Scénario D : Invalidité" 
              status="alert"
              color="border-amber-500"
              desc="Libération du paiement des primes. M. Martin touchera le capital à l'échéance prévue."
            />
          </div>
        </div>
      </section>

      {/* CONTACT & CTA */}
      <footer className="bg-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white mb-16 shadow-2xl">
            <h2 className="text-3xl font-bold mb-6">Prêt à fidéliser vos talents ?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Winwin Finance Group est à votre disposition pour analyser votre situation, calculer les lacunes et rédiger les avenants.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
              <a href="tel:+41324661100" className="flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition">
                <Phone size={20} /> 032 466 11 00
              </a>
              <a href="/conseil" className="flex items-center justify-center gap-2 bg-blue-800 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-900 transition">
                <Mail size={20} /> Demander un conseil
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end border-t border-slate-200 pt-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Winwin Finance Group</h3>
              <p className="text-slate-500 text-sm mt-2">
                Bellevue 7, 2950 Courgenay<br/>
                FINMA: F01042365
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex gap-4">
              <a href="https://www.winwin.swiss" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600 transition">
                <Globe />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}