import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// --- Composants UI ---

const SectionTitle = ({ children, subtitle, light = false }) => (
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

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
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

const ProcessStep = ({ number, title, desc }) => (
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
            alt="Handshake Meeting" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="h-[1px] w-12 bg-amber-400"></span>
              <span className="text-amber-400 font-bold tracking-widest uppercase text-sm">Concept Durabilis</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Anticipez.<br/>
              Protégez.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Transmettez.
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
              Assurez la pérennité de votre entreprise et la paix financière de vos familles en cas de coup dur entre associés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => document.getElementById('context').scrollIntoView({ behavior: 'smooth' })}
              >
                Comprendre l'enjeu <ArrowRight size={20}/>
              </motion.button>
            </div>
          </motion.div>

          {/* Abstract Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden md:block relative"
          >
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
            <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl text-white">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-500 p-3 rounded-lg"><Shield size={32} className="text-white"/></div>
                <div>
                  <h3 className="text-xl font-bold">Pacte d'Associés</h3>
                  <p className="text-sm text-slate-300">Sécurité juridique</p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-white/20 mb-6"></div>
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500 p-3 rounded-lg"><Banknote size={32} className="text-white"/></div>
                <div>
                  <h3 className="text-xl font-bold">Financement Garanti</h3>
                  <p className="text-sm text-slate-300">Assurance croisée</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* THE CONTEXT (PROBLEM) */}
      <section id="context" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Que se passe-t-il si un associé décède ou devient invalide demain ?">
            La réalité du risque
          </SectionTitle>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mt-12">
            {/* The Risk Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50 p-8 rounded-2xl border border-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <AlertOctagon className="text-red-500" size={32} />
                <h3 className="text-2xl font-bold text-slate-800">Sans Planification</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Les héritiers incompétents entrent dans l'entreprise.",
                  "Conflits d'intérêts entre survivants et famille.",
                  "Manque de liquidités pour racheter les parts.",
                  "Risque de vente forcée à un tiers concurrent.",
                  "Mise en péril de la continuité de l'activité."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <span className="mt-1 min-w-[6px] min-h-[6px] rounded-full bg-red-400 block"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* The Solution Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-900 p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-32 bg-emerald-500 rounded-full blur-[80px] opacity-20"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Check className="text-emerald-400" size={32} />
                <h3 className="text-2xl font-bold">Avec Durabilis</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                {[
                  "Les associés survivants gardent le contrôle total.",
                  "La famille reçoit immédiatement la valeur en cash.",
                  "Le financement est garanti par l'assurance.",
                  "La fiscalité est maîtrisée et optimisée.",
                  "La pérennité de l'entreprise est assurée."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-emerald-100">
                    <span className="mt-1 min-w-[6px] min-h-[6px] rounded-full bg-emerald-400 block"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (MECHANISM) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                Le Mécanisme <span className="text-amber-400">Gagnant-Gagnant</span>
              </h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Durabilis combine une convention d'actionnaires précise avec une solution de financement par assurance-vie risque pur. C'est la garantie que les fonds seront là exactement quand il le faut.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg h-fit"><FileSignature className="text-emerald-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">1. Convention d'actionnaires</h4>
                    <p className="text-slate-400 text-sm">Les associés s'engagent contractuellement à racheter les parts en cas de décès ou d'invalidité.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg h-fit"><HeartHandshake className="text-emerald-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">2. Protection Croisée</h4>
                    <p className="text-slate-400 text-sm">Chaque associé est assuré. La société (ou les associés) paie les primes.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-800 p-3 rounded-lg h-fit"><Landmark className="text-emerald-400" /></div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">3. Exécution Automatique</h4>
                    <p className="text-slate-400 text-sm">Au décès, l'assurance verse le capital aux survivants pour racheter les parts aux héritiers.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Visual Diagram */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative h-[500px] bg-slate-800 rounded-3xl p-8 flex flex-col justify-between border border-slate-700"
            >
               {/* Simplified Diagram logic */}
               <div className="absolute inset-0 flex items-center justify-center opacity-10">
                 <Shield size={300} />
               </div>

               <div className="flex justify-between items-center relative z-10">
                 <div className="bg-slate-700 p-4 rounded-xl text-center w-32">
                   <Users size={32} className="mx-auto mb-2 text-blue-400"/>
                   <span className="font-bold text-sm">Associés Survivants</span>
                 </div>
                 <ArrowRight className="text-slate-500 animate-pulse" />
                 <div className="bg-emerald-600 p-4 rounded-xl text-center w-32 shadow-lg shadow-emerald-500/20">
                   <div className="font-bold text-2xl mb-1">CASH</div>
                   <span className="text-xs">Capital Décès</span>
                 </div>
                 <ArrowRight className="text-slate-500 animate-pulse" />
                 <div className="bg-slate-700 p-4 rounded-xl text-center w-32">
                    <Users size={32} className="mx-auto mb-2 text-amber-400"/>
                    <span className="font-bold text-sm">Héritiers / Famille</span>
                 </div>
               </div>

               <div className="text-center my-4 relative z-10">
                 <div className="inline-block bg-slate-900 border border-slate-600 px-4 py-2 rounded-full text-xs text-slate-400 mb-2">
                    Echange Simultané
                 </div>
               </div>

               <div className="flex justify-between items-center relative z-10">
                 <div className="h-1 bg-slate-600 flex-grow mx-4 rounded-full"></div>
                 <div className="bg-white text-slate-900 p-4 rounded-xl text-center w-40 font-bold shadow-lg">
                   <FileSignature size={24} className="mx-auto mb-2 text-emerald-600"/>
                   Parts Sociales
                 </div>
                 <div className="h-1 bg-slate-600 flex-grow mx-4 rounded-full"></div>
               </div>
               
               <div className="flex justify-between text-xs text-slate-400 mt-2 px-2">
                  <span>Reçoivent 100% des parts</span>
                  <span>Reçoivent la juste valeur</span>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* IMPLEMENTATION STEPS */}
      <section className="py-24 bg-emerald-50/50">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Une mise en place structurée en 3 étapes">
            Le Parcours Durabilis
          </SectionTitle>

          <div className="relative mt-16">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-slate-200"></div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              <ProcessStep 
                number="1"
                title="Valorisation"
                desc="Estimation objective de la valeur de l'entreprise pour fixer les montants à assurer."
              />
              <ProcessStep 
                number="2"
                title="Convention"
                desc="Rédaction du pacte d'associés (Clause d'achat/vente) par nos juristes partenaires."
              />
              <ProcessStep 
                number="3"
                title="Financement"
                desc="Mise en place des polices d'assurance sur la tête de chaque associé clé."
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Pourquoi les entreprises familiales et PME nous choisissent">
            Les Avantages Clés
          </SectionTitle>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={Scale}
              title="Équité Totale"
              desc="La famille reçoit la valeur réelle de l'entreprise, sans avoir à s'immiscer dans la gestion."
            />
            <FeatureCard 
              icon={Shield}
              title="Contrôle Assuré"
              desc="Les associés restants conservent le pouvoir décisionnel sans interférence extérieure."
            />
            <FeatureCard 
              icon={Banknote}
              title="Liquidités Immédiates"
              desc="Les fonds sont disponibles sous 30 jours, sans toucher à la trésorerie de l'entreprise."
            />
            <FeatureCard 
              icon={Landmark}
              title="Fiscalité Optimisée"
              desc="Structure optimisée pour minimiser l'impact fiscal lors de la transmission."
            />
            <FeatureCard 
              icon={Clock}
              title="Rapidité d'Exécution"
              desc="Évite les longues procédures de succession et les blocages bancaires."
            />
            <FeatureCard 
              icon={HeartHandshake}
              title="Paix d'Esprit"
              desc="Savoir que ses associés et sa famille sont protégés permet de se concentrer sur le business."
            />
          </motion.div>
        </div>
      </section>

      {/* CTA / FOOTER */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="container mx-auto px-6">
          
          <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-12 md:p-16 text-center shadow-2xl mb-20 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             
             <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} transition={{duration:0.6}}>
               <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Protégez l'œuvre de votre vie.</h2>
               <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                 Ne laissez pas l'imprévu décider de l'avenir de votre entreprise. Contactez WinWin Finance Group pour un audit gratuit de votre situation actionnariale.
               </p>
               <div className="flex flex-col md:flex-row justify-center gap-6">
                <a href="tel:+41324661100" className="flex items-center justify-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 transition shadow-lg">
                  <Phone size={20} /> 032 466 11 00
                </a>
                <a href="mailto:contact@winwin.swiss" className="flex items-center justify-center gap-2 border-2 border-emerald-400 text-emerald-400 px-8 py-4 rounded-full font-bold hover:bg-emerald-400 hover:text-white transition">
                  <Mail size={20} /> contact@winwin.swiss
                </a>
               </div>
             </motion.div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <div className="mb-4 md:mb-0">
              <span className="font-bold text-slate-300 text-lg block mb-1">WinWin Finance Group</span>
              <span>Expertise en planification financière & succession d'entreprise</span>
            </div>
            <div>
              &copy; {new Date().getFullYear()} Durabilis. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}