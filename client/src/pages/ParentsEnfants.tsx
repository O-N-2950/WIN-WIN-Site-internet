import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, 
  GraduationCap, 
  Home, 
  Plane, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Gift, 
  Umbrella, 
  Phone, 
  Mail, 
  Star,
  Clock
} from 'lucide-react';

// --- Configuration des Animations ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const popIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", bounce: 0.5 } }
};

// --- Composants UI ---

const SectionTitle = ({ children, subtitle }) => (
  <div className="mb-12 text-center px-4">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 font-serif"
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500">
        {children}
      </span>
    </motion.h2>
    {subtitle && <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">{subtitle}</p>}
  </div>
);

// --- Le Simulateur Magique (Cœur de l'effet Wahoo) ---
const SavingsSimulator = () => {
  const [monthly, setMonthly] = useState(100);
  const [years, setYears] = useState(20);
  
  // Calcul simplifié pour l'exemple (Taux hypothétique de 3.5%)
  const rate = 0.035;
  const totalInvested = monthly * 12 * years;
  const futureValue = monthly * 12 * ((Math.pow(1 + rate, years) - 1) / rate);
  const interests = futureValue - totalInvested;

  return (
    <motion.div 
      variants={popIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-violet-100 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
      
      <div className="grid md:grid-cols-2 gap-12 relative z-10">
        <div className="space-y-8">
          <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-fuchsia-500" />
            Simulez leur avenir
          </h3>
          
          <div>
            <label className="block text-slate-600 font-bold mb-2">Épargne Mensuelle : {monthly} CHF</label>
            <input 
              type="range" min="50" max="500" step="10" 
              value={monthly} onChange={(e) => setMonthly(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>50 CHF</span>
              <span>500 CHF</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-2">Durée : {years} ans (jusqu'à {years} ans)</label>
            <input 
              type="range" min="10" max="25" step="1" 
              value={years} onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>10 ans</span>
              <span>25 ans</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-slate-50 rounded-2xl p-6 text-center">
          <p className="text-slate-500 mb-2">Capital estimé à terme</p>
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-4">
            {futureValue.toLocaleString('fr-CH', { maximumFractionDigits: 0 })} CHF
          </div>
          
          <div className="flex justify-center gap-4 text-sm">
            <div className="text-left">
              <span className="block w-3 h-3 bg-slate-300 rounded-full mb-1"></span>
              <span className="text-slate-400">Versé par vous</span>
              <div className="font-bold text-slate-600">{totalInvested.toLocaleString('fr-CH')} CHF</div>
            </div>
            <div className="text-left">
              <span className="block w-3 h-3 bg-yellow-400 rounded-full mb-1"></span>
              <span className="text-yellow-600 font-bold">Intérêts gagnés</span>
              <div className="font-bold text-yellow-600">+{interests.toLocaleString('fr-CH', { maximumFractionDigits: 0 })} CHF</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-6 italic">*Calcul à titre indicatif, taux variable non garanti.</p>
        </div>
      </div>
    </motion.div>
  );
};

const DreamCard = ({ icon: Icon, title, desc, color }) => (
  <motion.div 
    variants={fadeInUp}
    whileHover={{ y: -10 }}
    className="bg-white p-6 rounded-2xl shadow-lg border-2 border-transparent hover:border-violet-100 transition-all text-center group"
  >
    <div className={`w-16 h-16 mx-auto ${color} rounded-full flex items-center justify-center mb-4 text-white shadow-md group-hover:scale-110 transition-transform`}>
      <Icon size={32} />
    </div>
    <h3 className="font-bold text-xl text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

// --- Page Principale ---

export default function ParentsEnfants() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 overflow-x-hidden">
      
      {/* HERO SECTION EMOTIONNELLE */}
      <header className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-violet-900">
        <div className="absolute inset-0 z-0 opacity-40">
           {/* Background Image - Happy Child */}
           <img 
            src="https://images.unsplash.com/photo-1484820540004-1426a71215b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Happy Kid running" 
            className="w-full h-full object-cover mix-blend-overlay"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-violet-900 via-transparent to-transparent"></div>
        
        {/* Animated Shapes */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-20 right-20 text-yellow-300 opacity-60">
          <Star size={64} fill="currentColor" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-2 text-white font-bold mb-8 border border-white/30"
          >
            ✨ Pour Parents, Grands-Parents & Parrains
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            Offrez-leur plus que des jouets.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Offrez-leur la Liberté.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-violet-100 mb-10 max-w-2xl mx-auto font-light"
          >
            Transformez de petites économies aujourd'hui en un immense tremplin pour leurs 20 ans. Le plus beau cadeau, c'est l'avenir.
          </motion.p>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' })}
            className="bg-yellow-400 text-violet-900 px-10 py-5 rounded-full font-bold text-xl shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:bg-yellow-300 transition-all flex items-center gap-2 mx-auto"
          >
            <Baby /> Je simule leur capital
          </motion.button>
        </div>
      </header>

      {/* POURQUOI MAINTENANT ? (Le Facteur Temps) */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute -left-20 top-40 w-64 h-64 bg-fuchsia-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-slate-800 mb-6">Le Temps est votre <span className="text-violet-600 underline decoration-yellow-400 decoration-4 underline-offset-4">Super-Pouvoir</span></h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Quand il s'agit d'épargne pour enfant, le montant compte moins que la durée. Grâce aux intérêts composés, 100 CHF placés à la naissance valent beaucoup plus que 100 CHF placés à 15 ans.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl">
                  <Clock className="text-violet-600 w-8 h-8" />
                  <div>
                    <h4 className="font-bold text-violet-900">Commencez tôt</h4>
                    <p className="text-sm text-violet-700">Même une petite somme devient énorme sur 20 ans.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-fuchsia-50 rounded-2xl">
                  <Gift className="text-fuchsia-600 w-8 h-8" />
                  <div>
                    <h4 className="font-bold text-fuchsia-900">Le Cadeau Ultime</h4>
                    <p className="text-sm text-fuchsia-700">Bien plus utile que des vêtements qui deviennent trop petits.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.8, rotate: 5 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
               <img 
                  src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Plant growing" 
                  className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
                />
               <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full text-green-600">
                   <TrendingUp size={24} />
                 </div>
                 <div>
                   <div className="text-xs text-slate-400">Croissance</div>
                   <div className="font-bold text-slate-800 text-lg">+ 40% "Gratuits"</div>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CALCULATEUR SECTION */}
      <section id="simulator" className="py-24 bg-gradient-to-br from-indigo-50 to-violet-100">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="Déplacez les curseurs pour voir la magie opérer.">
            Jouez avec les chiffres
          </SectionTitle>
          <SavingsSimulator />
        </div>
      </section>

      {/* A QUOI CA SERT ? (Le Rêve) */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <SectionTitle subtitle="À 20 ou 25 ans, ce capital sera leur clé pour ouvrir toutes les portes.">
            Donnez vie à leurs rêves
          </SectionTitle>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DreamCard 
              icon={GraduationCap} 
              color="bg-blue-500"
              title="Grandes Études" 
              desc="Payer une école prestigieuse ou un semestre à l'étranger sans s'endetter." 
            />
            <DreamCard 
              icon={Home} 
              color="bg-emerald-500"
              title="Premier Appart" 
              desc="L'apport indispensable pour devenir propriétaire ou s'installer confortablement." 
            />
            <DreamCard 
              icon={Plane} 
              color="bg-orange-500"
              title="Tour du Monde" 
              desc="Une expérience de vie inoubliable avant de commencer la vie active." 
            />
            <DreamCard 
              icon={Heart} 
              color="bg-red-500"
              title="Passion & Projets" 
              desc="Lancer sa start-up, acheter un véhicule ou financer un mariage de rêve." 
            />
          </div>
        </div>
      </section>

      {/* LE FILET DE SÉCURITÉ (L'argument Massue) */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        {/* Background blobs */}
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600 rounded-full blur-[100px] opacity-30"></motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
             <div>
                <motion.div 
                  initial={{ opacity: 0 }} 
                  whileInView={{ opacity: 1 }} 
                  className="inline-block bg-yellow-400 text-slate-900 font-bold px-4 py-1 rounded-full text-sm mb-6"
                >
                  La vraie différence avec la banque
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Le "Joker" Protection <br/><span className="text-indigo-400">Continuité de l'épargne</span></h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  C'est la question que personne ne veut se poser, mais qui est essentielle : 
                  <strong> "Si je ne suis plus là pour investir, qui construira son avenir ?"</strong>
                </p>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  Contrairement à un compte épargne bancaire qui s'arrête net, notre plan Junior inclut une assurance. En cas de décès ou d'incapacité de gain du parent/parrain :
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <ShieldCheck className="text-green-400 w-6 h-6 flex-shrink-0" />
                    <span>L'assurance prend le relais et <strong>continue l'épargne à votre place</strong>.</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="text-green-400 w-6 h-6 flex-shrink-0" />
                    <span>L'objectif d'épargne est <strong>100% garanti</strong> à l'échéance.</span>
                  </li>
                </ul>
             </div>

             <motion.div 
               initial={{ x: 50, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl"
             >
                <div className="flex items-center justify-center mb-6">
                   <Umbrella size={80} className="text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-center mb-4">Le Parapluie Financier</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span>Compte Bancaire</span>
                    <span className="text-red-300 font-bold">L'épargne s'arrête ❌</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-600/50 border border-indigo-400 rounded-lg">
                    <span>Plan Junior</span>
                    <span className="text-green-300 font-bold">L'assurance investit pour vous ✅</span>
                  </div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="bg-white pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-12 text-center text-white mb-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">Prêt à planter la première graine ?</h2>
            <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
              Nos conseillers WinWin sont là pour créer le plan sur-mesure qui grandira avec votre enfant.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
              <a href="tel:+41324661100" className="flex items-center justify-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-full font-bold hover:bg-violet-50 transition shadow-lg">
                <Phone size={20} /> 032 466 11 00
              </a>
              <a href="/conseil" className="flex items-center justify-center gap-2 bg-yellow-400 text-violet-900 px-8 py-4 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg">
                <Mail size={20} /> Demander un conseil
              </a>
            </div>
          </div>

          <div className="text-center text-slate-400 text-sm">
            <p className="mb-2">WinWin Finance Group - L'expertise au service des familles.</p>
            <p>&copy; {new Date().getFullYear()} Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Petite aide icone check
const Check = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);