import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Globe, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  CreditCard, 
  Building2, 
  Users,
  Landmark,
  MessageSquare,
  FileSignature,
  Laptop
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * ZONE DE CONFIGURATION DES LIENS
 * ------------------------------------------------------------------
 * Email de réception : contact@winwin.swiss
 */
const PAYMENT_LINKS = {
  monthly: {
    0: "/conseil",
    1: "/conseil",
    2: "/conseil"
  },
  cash: {
    0: "/conseil",
    1: "/conseil",
    2: "/conseil"
  }
};
/** ------------------------------------------------------------------ */

const WinWinSynergis = () => {
  const [scrolled, setScrolled] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activePack, setActivePack] = useState(1);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = document.querySelectorAll('.animate-on-scroll');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
          setIsVisible(prev => ({ ...prev, [section.id]: true }));
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = (packId) => {
    const link = PAYMENT_LINKS[billingCycle][packId];
    if (link) {
      window.location.href = link;
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Configuration des Packs
  const packs = [
    {
      id: 0,
      name: "PACK LAUNCH",
      subtitle: "L'essentiel juridique",
      priceCash: 2890,
      priceMonthly: 245,
      features: [
        "Création Sàrl/SA complète (Notaire inclus)",
        "Inscription Registre du Commerce",
        "Affiliation AVS (Employeur)",
        "Ouverture Compte Bancaire",
        "Setup Assurances (LPP/LAA/RC)"
      ],
      icon: <ShieldCheck size={32} />,
      color: "from-slate-400 to-slate-200"
    },
    {
      id: 1,
      name: "PACK DIGITAL",
      subtitle: "Le Best-Seller",
      isPopular: true,
      priceCash: 4490,
      priceMonthly: 375,
      features: [
        "Tout le contenu Pack Launch",
        "Site Web One-Page (Design + IA)",
        "Email Pro & Domaine .ch",
        "Identité Visuelle (Logo)",
        "Audit Risques Étendu (Commerce/Transport)"
      ],
      icon: <Globe size={32} />,
      color: "from-[#3176A6] to-[#8CB4D2]"
    },
    {
      id: 2,
      name: "SYNERGIS INFINITY",
      subtitle: "L'effet Wahooo",
      priceCash: 7990,
      priceMonthly: 665,
      features: [
        "Tout le contenu Pack Digital",
        "Site Web Multi-Pages Premium",
        "Automatisations (CRM, Facturation)",
        "Package Assurances 'Directeur'",
        "Coaching Business (2h)"
      ],
      icon: <Rocket size={32} />,
      color: "from-purple-500 to-[#3176A6]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden font-sans selection:bg-[#3176A6] selection:text-white pb-20">
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .glow-line {
          box-shadow: 0 0 15px #3176A6, 0 0 30px #3176A6;
        }
      `}</style>
      
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#3176A6]/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#8CB4D2]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-md border-b border-[#3176A6]/20 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => window.location.href = '/'}>
              WIN<span className="text-[#8CB4D2]">WIN</span>
            </div>
            <div className="hidden sm:block h-6 w-[1px] bg-slate-600 mx-2"></div>
            <span className="hidden sm:block text-sm font-medium text-[#8CB4D2] tracking-widest uppercase">Synergis</span>
          </div>
          <button 
            onClick={() => scrollToSection('pricing')}
            className="bg-[#3176A6] hover:bg-[#265a80] text-white px-6 py-2 rounded-full transition-all text-sm font-medium shadow-lg shadow-[#3176A6]/20 border border-[#8CB4D2]/20"
          >
            Démarrer mon projet
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-44 pb-32 px-6">
        <div className="container mx-auto text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3176A6]/10 border border-[#3176A6]/30 mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#8CB4D2] animate-ping"></span>
            <span className="text-sm text-[#8CB4D2] font-semibold tracking-wide">NOUVEAU CONCEPT D'IMPLANTATION SUISSE</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-tight">
            <span className="block text-white drop-shadow-xl">
              Expertise Humaine.
            </span>
            <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#8CB4D2] via-[#3176A6] to-white">
              Puissance de l'IA.
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
            Créez, implantez et digitalisez votre entreprise en Suisse avec <strong className="text-[#8CB4D2]">SYNERGIS</strong>. 
            WinWin s'occupe de tout : Notaire, Fiduciaire, Banque, Assurances et Site Web.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => scrollToSection('pricing')}
              className="px-8 py-4 bg-gradient-to-r from-[#3176A6] to-[#265a80] hover:from-[#3a8bc4] hover:to-[#3176A6] text-white rounded-full font-bold shadow-lg shadow-[#3176A6]/30 transition-all transform hover:scale-105 flex items-center justify-center gap-3 border border-[#8CB4D2]/30"
            >
              <Rocket size={20} />
              Voir les Packs
            </button>
            <button 
              onClick={() => scrollToSection('process')}
              className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800 border border-slate-700 hover:border-[#8CB4D2]/50 text-white rounded-full font-bold transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <Zap size={20} className="text-[#8CB4D2]" />
              Comment ça marche ?
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-10 px-6 relative z-10 bg-[#0f172a]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Landmark size={32} className="text-[#8CB4D2]" />}
              title="Juridique & Fiduciaire"
              desc="Constitution, Notaire, Inscription RC et gestion comptable. Nous gérons toute la bureaucratie suisse."
            />
            <FeatureCard 
              icon={<ShieldCheck size={32} className="text-[#3176A6]" />}
              title="Assurances 360°"
              desc="Audit complet : LPP, LAA, Perte de Gain, RC Entreprise. Vos risques sont couverts dès le jour 1."
            />
            <FeatureCard 
              icon={<Globe size={32} className="text-[#8CB4D2]" />}
              title="Digital & Web"
              desc="Création de votre site internet et identité visuelle. Votre business est en ligne immédiatement."
            />
          </div>
        </div>
      </section>

      {/* NOUVEAU: COMMENT CA MARCHE (PROCESS) */}
      <section id="process" className="py-24 px-6 relative z-10 animate-on-scroll">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">De l'Idée à l'Empire<span className="text-[#8CB4D2]">.</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Un processus fluide en 4 étapes pour transformer votre projet en entreprise suisse opérationnelle.
            </p>
          </div>

          <div className="relative">
            {/* Ligne de connexion (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
            <div className="hidden md:block absolute top-1/2 left-0 w-3/4 h-1 bg-gradient-to-r from-[#3176A6] to-[#8CB4D2] -translate-y-1/2 z-0 opacity-50"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Etape 1 */}
              <ProcessStep 
                number="01" 
                title="Stratégie" 
                icon={<MessageSquare size={24} />} 
                desc="Call découverte. On définit la structure (SA/Sàrl) et on optimise la fiscalité."
              />
              {/* Etape 2 */}
              <ProcessStep 
                number="02" 
                title="Création" 
                icon={<FileSignature size={24} />} 
                desc="Notaire, Statuts IA, Banque et RC. Tout est signé en un temps record."
              />
              {/* Etape 3 */}
              <ProcessStep 
                number="03" 
                title="Sécurité" 
                icon={<ShieldCheck size={24} />} 
                desc="Mise en place des protections : LPP, LAA, RC et Mandat de gestion."
              />
              {/* Etape 4 */}
              <ProcessStep 
                number="04" 
                title="Décollage" 
                icon={<Laptop size={24} />} 
                desc="Votre site web est en ligne. Vos accès automatisés sont prêts. Vous facturez."
                isLast={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SIMULATOR */}
      <section id="pricing" className="py-24 px-6 relative z-10 bg-slate-900/50 border-y border-[#3176A6]/20 animate-on-scroll">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Investissez dans <span className="text-[#8CB4D2]">votre succès</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Des forfaits transparents. Pas de frais cachés. Facilités de paiement incluses.
            </p>

            {/* Switch Payment Mode */}
            <div className="inline-flex bg-slate-950 p-1 rounded-full border border-slate-800 relative">
              <div className={`absolute top-1 bottom-1 w-[50%] rounded-full bg-[#3176A6] transition-all duration-300 ${billingCycle === 'monthly' ? 'left-[49%]' : 'left-1'}`}></div>
              <button 
                onClick={() => setBillingCycle('cash')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors ${billingCycle === 'cash' ? 'text-white' : 'text-slate-400'}`}
              >
                Paiement Comptant
              </button>
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}
              >
                Paiement Mensuel
                <span className="text-[10px] bg-white text-[#3176A6] px-1.5 rounded font-bold">12x</span>
              </button>
            </div>
            
            {billingCycle === 'monthly' && (
              <p className="text-sm text-[#8CB4D2] mt-4 animate-fade-in-up">
                <span className="inline-block mr-2">✨</span>
                Partenariat <strong>HeyLight</strong> : Préservez votre trésorerie, payez en douceur.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {packs.map((pack) => (
              <div 
                key={pack.id}
                onClick={() => setActivePack(pack.id)}
                className={`relative rounded-3xl p-8 border transition-all duration-300 cursor-pointer group ${
                  activePack === pack.id 
                    ? 'bg-slate-800 border-[#3176A6] shadow-2xl shadow-[#3176A6]/20 scale-105 z-10' 
                    : 'bg-slate-900/50 border-slate-800 hover:border-[#8CB4D2]/30 hover:bg-slate-800/50'
                }`}
              >
                {pack.isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#3176A6] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase border border-[#8CB4D2]">
                    Recommandé
                  </div>
                )}

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${pack.color} text-white shadow-lg`}>
                  {pack.icon}
                </div>

                <h3 className="text-2xl font-bold mb-1">{pack.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{pack.subtitle}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      CHF {billingCycle === 'cash' ? pack.priceCash.toLocaleString() : pack.priceMonthly}
                    </span>
                    {billingCycle === 'monthly' && <span className="text-slate-400">/ mois</span>}
                  </div>
                  {billingCycle === 'monthly' && (
                    <div className="text-xs text-slate-500 mt-1">
                      Total sur 12 mois : CHF {(pack.priceMonthly * 12).toLocaleString()}
                    </div>
                  )}
                  {billingCycle === 'cash' && (
                    <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                      <CheckCircle size={12} /> Meilleur prix global
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {pack.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle size={16} className={`shrink-0 mt-0.5 ${activePack === pack.id ? 'text-[#8CB4D2]' : 'text-slate-500'}`} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={(e) => { e.stopPropagation(); handlePurchase(pack.id); }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    activePack === pack.id
                      ? 'bg-white text-[#0f172a] hover:bg-slate-200 shadow-lg'
                      : 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Choisir ce pack
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-400 text-sm mb-4">
              Inclus dans tous les packs :
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-300">
              <span className="flex items-center gap-2"><CreditCard size={16} className="text-[#8CB4D2]" /> Compte Bancaire Simplifié</span>
              <span className="flex items-center gap-2"><Building2 size={16} className="text-[#8CB4D2]" /> Gestion AVS</span>
              <span className="flex items-center gap-2"><Users size={16} className="text-[#8CB4D2]" /> Mandat WinWin (An 1 offert)</span>
            </div>
          </div>

        </div>
      </section>

      {/* TECH & WEB SECTION */}
      <section className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-6">
              Plus qu'une Fiduciaire.<br/>
              <span className="text-[#8CB4D2]">Une Agence Digitale.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              La plupart des fiduciaires vous laissent vous débrouiller avec votre marketing. 
              Pas nous. Avec le Pack Digital, nous construisons votre **Site Web** et votre **Identité Visuelle** en parallèle de vos statuts.
            </p>
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 border-[#3176A6] rounded-r-xl mb-8">
              <p className="italic text-slate-300">
                "Votre entreprise existe légalement le lundi, elle est visible sur Google le mardi."
              </p>
            </div>
            <button className="text-[#8CB4D2] font-semibold hover:text-white transition-colors flex items-center gap-2">
              Voir nos réalisations Web <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 transform rotate-2 hover:rotate-0 transition-duration-500">
              <div className="bg-[#0f172a] rounded-lg overflow-hidden aspect-video relative">
                 <div className="absolute top-0 w-full h-8 bg-slate-800 flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 </div>
                 <div className="mt-12 px-8">
                    <div className="w-3/4 h-8 bg-slate-800 rounded mb-4"></div>
                    <div className="w-1/2 h-4 bg-slate-800/50 rounded mb-8"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 bg-[#3176A6]/20 rounded border border-[#3176A6]/30"></div>
                        <div className="h-32 bg-[#3176A6]/20 rounded border border-[#3176A6]/30"></div>
                    </div>
                 </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8CB4D2]/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-20 px-6 text-center bg-gradient-to-b from-[#0f172a] to-[#080c17]">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-bold mb-8">Prêt à lancer votre projet ?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => window.location.href = "https://www.winwin.swiss/contact"}
              className="px-8 py-4 bg-[#3176A6] hover:bg-[#265a80] text-white rounded-full font-bold shadow-lg shadow-[#3176A6]/25 transition-all"
            >
              Contactez-nous
            </button>
            <div className="flex items-center gap-2 justify-center text-slate-400 text-sm mt-4 sm:mt-0 px-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Réponse sous 24h
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Component for Feature Cards
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 hover:border-[#3176A6]/50 hover:bg-slate-800/80 transition-all group">
    <div className="mb-4 p-3 bg-slate-950 rounded-xl inline-block border border-slate-800 group-hover:shadow-[0_0_15px_rgba(49,118,166,0.3)] transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#8CB4D2] transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

// Helper Component for Process Steps (NEW)
const ProcessStep = ({ number, title, icon, desc, isLast }) => (
  <div className="relative group">
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl relative z-10 hover:-translate-y-2 transition-transform duration-300 h-full">
      <div className="absolute -top-4 -right-4 text-4xl font-bold text-slate-800 opacity-50 select-none group-hover:text-[#3176A6]/20 transition-colors">
        {number}
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isLast ? 'bg-[#3176A6] text-white shadow-lg shadow-[#3176A6]/50' : 'bg-slate-800 text-[#8CB4D2]'}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
    {/* Connecting dot for mobile */}
    <div className="md:hidden absolute left-1/2 -bottom-8 w-1 h-8 bg-slate-800 -translate-x-1/2 z-0"></div>
  </div>
);

export default WinWinSynergis;