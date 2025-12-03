import React, { useState, useEffect } from 'react';
import { 
  Calculator, Coins, Hourglass, Briefcase, User, Users, 
  Activity, HeartPulse, Umbrella, ShieldCheck, AlertTriangle, 
  Info, Zap, SearchCheck, CheckCircle2, PenTool, CopyCheck, 
  ArrowRight, TrendingDown, Target, FileCheck, Calendar
} from 'lucide-react';

// --- CONSTANTES SUISSES ---
const CONSTANTS = {
  MAX_AVS_RENTE: 2520, // Mensuel
  MAX_LAA_SALARY: 148200, // Annuel
  COORDINATION_LPP: 25725, // Annuel
  RETIREMENT_AGE: 65,
  // Taux techniques pour calcul capital
  TAUX_CAPITALISATION_DECES: 0.05, // 5%
  TAUX_CAPITALISATION_RETRAITE: 0.06 // 6%
};

const ScenarioLabels = { invalidite: 'Invalidité', deces: 'Décès', retraite: 'Retraite' };
const CauseLabels = { maladie: 'Maladie', accident: 'Accident', vie: 'Vie' };

export default function Mapping360() {
  // --- STATE SIMULATION ---
  const [salary, setSalary] = useState(6500);
  const [age, setAge] = useState(40);
  const [status, setStatus] = useState('employee'); // employee | independent
  const [scenario, setScenario] = useState('invalidite');
  const [cause, setCause] = useState('maladie');
  const [investFreq, setInvestFreq] = useState('month');
  const [investAmount, setInvestAmount] = useState(200);
  
  // --- STATE MODALE & FORMULAIRE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState('standard'); // standard | expert
  const [isCouple, setIsCouple] = useState(false);
  
  // Personne 1
  const [p1, setP1] = useState({
    fname: '', lname: '', dob: '', profession: '', smoker: 'non',
    civil: 'Célibataire', marriageDate: '', childrenCount: 0
  });
  
  // Enfants (Liste dynamique)
  const [childrenDetails, setChildrenDetails] = useState([]);

  // Personne 2
  const [p2, setP2] = useState({
    fname: '', lname: '', dob: '', profession: '', status: 'Employé', smoker: 'non'
  });

  // Options Expert
  const [expertOpts, setExpertOpts] = useState({
    mandate: false,
    avs: false, contract: false, lpp: false, apgMaladie: false, apgAccident: false,
    avsP2: false, lppP2: false, pilier3: false
  });

  // Employeurs
  const [empP1, setEmpP1] = useState({ name: '', loc: '', phone: '' });
  const [empP2, setEmpP2] = useState({ name: '', loc: '', phone: '' });

  // --- STATE UI / CALCULS ---
  const [results, setResults] = useState({ p1: 0, p2: 0, gap: 0, capitalNeeded: 0, text: '', alert: 'low', labelCapital: '' });
  const [showToast, setShowToast] = useState(false);

  // --- EFFETS (Calculs Dynamiques) ---
  useEffect(() => {
    calculateResults();
  }, [salary, age, status, scenario, cause]);

  useEffect(() => {
    // Ajuster le tableau des enfants si le nombre change
    const count = parseInt(p1.childrenCount) || 0;
    setChildrenDetails(prev => {
      const newArr = [...prev];
      if (count > prev.length) {
        for (let i = prev.length; i < count; i++) newArr.push({ fname: '', lname: '', dob: '' });
      } else {
        newArr.splice(count);
      }
      return newArr;
    });
  }, [p1.childrenCount]);

  // --- LOGIQUE METIER MISE À JOUR ---
  const calculateResults = () => {
    let p1Amount = 0, p2Amount = 0;
    let text = "", alertLevel = "low";
    let targetIncome = 0;
    let capitalNeeded = 0;
    let labelCapital = "Perte cumulée";

    // Définition des cibles (Target)
    if (scenario === 'invalidite') {
        targetIncome = salary * 0.90; // Cible 90%
        labelCapital = "Rente annuelle manquante"; 
    } else {
        targetIncome = salary * 0.80; // Cible 80% (Décès & Retraite)
    }

    // 1er Pilier (AVS/AI) - Calcul Mensuel
    // L'AI verse toujours ses prestations, même en cas d'accident.
    if (scenario === 'deces') {
      p1Amount = Math.min(salary * 0.6, CONSTANTS.MAX_AVS_RENTE * 0.8);
    } else {
      // Invalidité ou Retraite
      p1Amount = salary < 4000 ? salary * 0.7 : Math.min(salary * 0.8, CONSTANTS.MAX_AVS_RENTE);
    }

    // 2e Pilier (LPP/LAA)
    if (status === 'independent') {
      p2Amount = 0;
    } else {
      if (cause === 'accident' && scenario !== 'retraite') {
        // CORRECTION: Accident (LAA)
        // La LAA complète l'AI pour atteindre 90% du salaire assuré (plafonné à 148'200)
        const salaryAssureLAA = Math.min(salary, CONSTANTS.MAX_LAA_SALARY / 12);
        const targetTotalAccident = salaryAssureLAA * 0.9;
        
        // La LAA paie la différence entre le Target (90%) et ce que l'AI paie déjà.
        p2Amount = Math.max(0, targetTotalAccident - p1Amount);
      } else {
        // Maladie / Retraite : LPP
        const salaireAnnuel = salary * 12;
        const salaireCoordonneAnnuel = Math.max(0, salaireAnnuel - CONSTANTS.COORDINATION_LPP);
        p2Amount = (salaireCoordonneAnnuel * 0.4) / 12;
      }
    }

    // Calcul Lacune Mensuelle
    const totalCovered = p1Amount + p2Amount;
    const gapAmount = Math.max(0, targetIncome - totalCovered);
    
    // Pourcentages pour barres (Base = Salary)
    const p1Percent = Math.min(100, (p1Amount / salary) * 100);
    const p2Percent = Math.min(100, (p2Amount / salary) * 100);
    const gapPercent = Math.min(100, (gapAmount / salary) * 100);

    // Calcul Capital à Assurer (Méthode Expert)
    if (gapAmount > 0) {
        if (scenario === 'deces') {
            capitalNeeded = (gapAmount * 12) / CONSTANTS.TAUX_CAPITALISATION_DECES;
            labelCapital = "Capital Décès à assurer";
        } else if (scenario === 'retraite') {
            capitalNeeded = (gapAmount * 12) / CONSTANTS.TAUX_CAPITALISATION_RETRAITE;
            labelCapital = "Capital Retraite à constituer";
        } else {
            capitalNeeded = gapAmount * 12;
            labelCapital = "Manque à gagner par an";
        }
    }

    // Textes & Alertes
    if (status === 'independent') {
      if (scenario === 'invalidite') {
        text = cause === 'maladie' ? "ALERTE ROUGE. Maladie = AI seule. Chute libre sans privée." : "DANGER. Accident = AI seule sans LAA facultative.";
        alertLevel = "critical";
      } else if (scenario === 'retraite') {
        text = "Précarité. AVS seule insuffisante.";
        alertLevel = "high";
      } else {
        text = "Protection quasi nulle.";
        alertLevel = "critical";
      }
    } else {
      if (cause === 'accident' && scenario !== 'retraite') {
        text = "Couverture Excellente (LAA + AI = 90%).";
        alertLevel = "low";
      } else if (scenario === 'invalidite') {
        text = "Piège 720j. Perte de revenu significative après délai d'attente.";
        alertLevel = "high";
      } else if (scenario === 'retraite') {
        text = "Mur de la Retraite. Perte brutale de pouvoir d'achat.";
        alertLevel = "medium";
      } else {
        text = "Rentes veuves/orphelins légales souvent faibles.";
        alertLevel = "high";
      }
    }

    setResults({ p1: p1Percent, p2: p2Percent, gap: gapPercent, gapAmount, capitalNeeded, text, alert: alertLevel, labelCapital });
  };

  // --- HANDLERS ---
  const handleCopyAndRedirect = () => {
    const freqLabel = investFreq === 'month' ? 'Mensuel' : 'Annuel';
    const statusLabel = status === 'employee' ? 'Employé (avec LPP)' : 'Indépendant';
    
    let message = "";

    if (serviceType === 'expert') {
      const mandateText = expertOpts.mandate ? "✅ OUI, procuration WinWin" : "❌ NON, je fournis les docs";
      const priceLabel = isCouple ? "350.- (Couple)" : "250.- (Individuel)";
      
      // Bloc Employeur P1
      let empP1Txt = "";
      if (status === 'employee' && expertOpts.mandate) {
        empP1Txt = `\n--- EMPLOYEUR P1 (Vous) ---\n• Société : ${empP1.name}\n• Lieu : ${empP1.loc}\n• Tél : ${empP1.phone}`;
      }
      
      // Bloc Employeur P2
      let empP2Txt = "";
      if (isCouple && p2.status === 'Employé' && expertOpts.mandate) {
        empP2Txt = `\n--- EMPLOYEUR P2 (Conjoint) ---\n• Société : ${empP2.name}\n• Lieu : ${empP2.loc}\n• Tél : ${empP2.phone}`;
      }

      // Bloc Conjoint
      let partnerTxt = "";
      if (isCouple) {
        partnerTxt = `\n--- PROFIL 2 (Conjoint) ---\n• Nom : ${p2.fname} ${p2.lname}\n• Né(e) le : ${formatDate(p2.dob)}\n• Prof : ${p2.profession}\n• Statut : ${p2.status}\n• Fumeur : ${p2.smoker.toUpperCase()}`;
      }

      // Bloc Enfants
      let kidsTxt = "";
      if (childrenDetails.length > 0) {
        kidsTxt = `\n--- ENFANTS ---\n` + childrenDetails.map((c, i) => `• Enfant ${i+1} : ${c.fname} ${c.lname} (${formatDate(c.dob)})`).join('\n');
      }

      // Documents Cochés
      const docs = [];
      if(expertOpts.avs) docs.push("CI AVS (Vous)");
      if(expertOpts.contract) docs.push("Contrat Travail (Vous)");
      if(expertOpts.lpp) docs.push("LPP (Vous)");
      if(expertOpts.apgMaladie) docs.push("APG Maladie (Vous)");
      if(expertOpts.apgAccident) docs.push("Accident (Vous)");
      if(expertOpts.avsP2) docs.push("CI AVS (P2)");
      if(expertOpts.lppP2) docs.push("LPP/APG (P2)");
      if(expertOpts.pilier3) docs.push("3e Piliers existants");

      message = `Bonjour,\n\nJ'ai réalisé une simulation Mapping 360° et je souhaite passer à l'étape supérieure.\n\n🚨 JE CHOISIS L'OPTION : BILAN GLOBAL EXPERT (${priceLabel})\n\n--- MON DOSSIER ---\n• Procuration : ${mandateText}\n• Documents disponibles : ${docs.join(', ') || 'Aucun'}\n${empP1Txt}${empP2Txt}\n\n--- PROFIL 1 ---\n• Nom : ${p1.fname} ${p1.lname}\n• Statut : ${statusLabel}\n• Âge : ${age} ans\n• Né(e) le : ${formatDate(p1.dob)}\n• Prof : ${p1.profession}\n• État Civil : ${p1.civil} (${p1.marriageDate})\n• Fumeur : ${p1.smoker.toUpperCase()}\n• Revenu : ${salary} CHF\n${kidsTxt}${partnerTxt}\n\nMerci de me contacter pour lancer la procédure.`;

    } else {
      // Message Standard
      let kidsTxt = p1.childrenCount > 0 ? `(${p1.childrenCount} enfants)` : "";
      message = `Bonjour,\n\nVoici les résultats de ma simulation Mapping 360°.\n\n--- PROFIL ---\n• Statut : ${statusLabel}\n• Âge : ${age}\n• Né(e) le : ${formatDate(p1.dob)}\n• Prof : ${p1.profession}\n• Situation : ${p1.civil} ${kidsTxt}\n• Revenu : ${salary} CHF\n\n--- PROJET ---\n• Lacune mensuelle : ${Math.round(results.gapAmount)} CHF\n• ${results.labelCapital} : ${Math.round(results.capitalNeeded).toLocaleString()} CHF\n• Budget Investissement : ${investAmount} CHF / ${freqLabel}\n\nMerci de me recontacter.`;
    }

    navigator.clipboard.writeText(message).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
      setTimeout(() => window.open("https://www.winwin.swiss/contact", "_blank"), 1500);
    });
    setIsModalOpen(false);
  };

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('fr-CH') : 'Non renseigné';

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 py-12 px-4 selection:bg-[#8CB4D2] selection:text-white">
      
      {/* HEADER */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-[#3176A6] text-white p-3 rounded-2xl shadow-lg">
            <Calculator size={32} />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">
          Votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3176A6] to-[#8CB4D2]">Mapping 360°</span>
        </h1>
        <p className="text-lg text-slate-600">Analysez instantanément votre protection financière et projetez votre avenir.</p>
      </div>

      {/* MAIN CARD */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col lg:flex-row">
        
        {/* LEFT PANEL */}
        <div className="lg:w-1/3 bg-slate-100 p-6 md:p-8 border-r border-slate-200 flex flex-col gap-6">
          
          {/* SALAIRE */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              <Coins size={16} className="text-[#3176A6]" /> Revenu Mensuel Brut
            </label>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full text-3xl font-bold text-slate-800 border-b-2 border-[#8CB4D2] focus:border-[#3176A6] outline-none py-2 bg-transparent" />
                <span className="absolute right-0 top-3 text-slate-400 font-bold">CHF</span>
              </div>
            </div>
            <input type="range" min="3000" max="25000" step="100" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3176A6]" />
          </div>

          {/* AGE */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
              <Hourglass size={16} className="text-[#3176A6]" /> Votre Âge Actuel
            </label>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <input type="number" value={age} onChange={(e) => setAge(Math.min(64, Math.max(18, Number(e.target.value))))} className="w-full text-3xl font-bold text-slate-800 border-b-2 border-[#8CB4D2] focus:border-[#3176A6] outline-none py-2 bg-transparent" />
                <span className="absolute right-0 top-3 text-slate-400 font-bold">Ans</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 font-bold uppercase">Horizon 65 ans</div>
                <div className="text-[#3176A6] font-bold text-lg">{Math.max(0, CONSTANTS.RETIREMENT_AGE - age)} ans restants</div>
              </div>
            </div>
            <input type="range" min="18" max="64" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3176A6]" />
          </div>

          {/* STATUT & SCENARIO */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Votre Statut</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => setStatus('employee')} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${status === 'employee' ? 'border-[#3176A6] bg-[#eef6fa] text-[#3176A6]' : 'border-transparent bg-white text-slate-600'}`}>
                <div className="flex items-center gap-3 font-bold"><Briefcase size={20} /> Employé</div>
                {status === 'employee' && <span className="text-xs bg-white border border-[#8CB4D2] px-2 py-1 rounded-full">Avec LPP</span>}
              </button>
              <button onClick={() => setStatus('independent')} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${status === 'independent' ? 'border-indigo-600 bg-indigo-50 text-indigo-900' : 'border-transparent bg-white text-slate-600'}`}>
                <div className="flex items-center gap-3 font-bold"><User size={20} /> Indépendant</div>
                {status === 'independent' && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">Sans LPP</span>}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scénario</h3>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'invalidite', icon: Activity, color: 'text-orange-400', label: 'Invalidité' },
                { id: 'deces', icon: HeartPulse, color: 'text-red-400', label: 'Décès' },
                { id: 'retraite', icon: Umbrella, color: 'text-green-400', label: 'Retraite' }
              ].map(s => (
                <button key={s.id} onClick={() => { setScenario(s.id); if(s.id==='retraite') setCause('vie'); else if(cause==='vie') setCause('maladie'); }} 
                  className={`p-3 rounded-lg text-left font-bold flex items-center gap-3 transition-all ${scenario === s.id ? 'bg-slate-800 text-white shadow-lg' : 'bg-white text-slate-600'}`}>
                  <s.icon size={20} className={scenario === s.id ? s.color : ''} /> {s.label}
                </button>
              ))}
            </div>
          </div>

          {scenario !== 'retraite' && (
            <div className="flex bg-slate-200 p-1 rounded-xl">
              {['maladie', 'accident'].map(c => (
                <button key={c} onClick={() => setCause(c)} className={`flex-1 py-2 rounded-lg text-sm font-bold capitalize transition-all ${cause === c ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>{c}</button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT PANEL - VISUALISATION */}
        <div className="lg:w-2/3 p-6 md:p-12 flex flex-col relative bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Projection <span className="text-[#3176A6]">{ScenarioLabels[scenario]}</span></h2>
              <p className="text-slate-500 font-medium flex items-center gap-2">{status === 'employee' ? 'Employé' : 'Indépendant'} • {cause === 'vie' ? 'Vie' : `Cause ${CauseLabels[cause]}`}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${
              results.alert === 'critical' ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' :
              results.alert === 'high' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
              'bg-green-50 text-green-600 border border-green-200'
            }`}>
              {results.alert === 'critical' ? <AlertTriangle size={20}/> : results.alert === 'high' ? <AlertTriangle size={20}/> : <ShieldCheck size={20}/>}
              {results.alert === 'critical' ? 'DANGER' : results.alert === 'high' ? 'Risque Élevé' : 'Bien Couvert'}
            </div>
          </div>

          {/* GRAPHIQUE */}
          <div className="relative flex-grow flex flex-col justify-end min-h-[350px] mb-8">
            <div className="absolute top-0 w-full border-t-2 border-dashed border-slate-300 z-10">
              <span className="absolute -top-7 right-0 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">Objectif: {(scenario === 'invalidite' ? salary * 0.9 : salary * 0.8).toLocaleString()} CHF</span>
            </div>
            
            <div className="flex items-end justify-center gap-2 md:gap-8 w-full z-10 pb-8 border-b border-slate-100">
              {/* P1 */}
              <div className="flex flex-col items-center justify-end h-80 w-full md:w-28 gap-2">
                <div className="text-center font-bold text-slate-700 text-sm">{Math.round(results.p1)}%</div>
                <div className="w-full h-64 bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden">
                  <div style={{ height: `${results.p1}%` }} className="w-full bg-slate-600 shadow-lg flex items-start justify-center pt-2 transition-all duration-1000"><ShieldCheck className="text-white/40" /></div>
                </div>
                <div className="font-bold text-slate-600 text-xs uppercase text-center">1er Pilier</div>
              </div>
              <div className="text-slate-300 pb-10 font-bold text-xl">+</div>
              
              {/* P2 */}
              <div className="flex flex-col items-center justify-end h-80 w-full md:w-28 gap-2">
                <div className="text-center font-bold text-slate-700 text-sm">{Math.round(results.p2)}%</div>
                <div className="w-full h-64 bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden">
                  <div style={{ height: `${results.p2}%` }} className={`w-full shadow-lg flex items-start justify-center pt-2 transition-all duration-1000 ${status === 'independent' ? 'bg-slate-200' : 'bg-[#3176A6]'}`}>
                    <Briefcase className="text-white/40" />
                  </div>
                  {results.p2 === 0 && <div className="absolute inset-0 flex items-center justify-center text-red-300 bg-red-50/50"><span className="font-bold text-xs -rotate-45 border border-red-300 px-2 py-1 rounded text-red-500 bg-white">NON COUVERT</span></div>}
                </div>
                <div className="font-bold text-slate-600 text-xs uppercase text-center">{status === 'independent' ? '2e Pilier (Aucun)' : '2e Pilier'}</div>
              </div>
              <div className="text-slate-300 pb-10 font-bold text-xl">=</div>

              {/* GAP */}
              <div className="flex flex-col items-center justify-end h-80 w-full md:w-28 gap-2">
                <div className="text-center font-bold text-red-600 text-xl">{results.gap > 1 ? `-${Math.round(results.gap)}%` : ''}</div>
                <div className="w-full h-64 bg-slate-50 rounded-t-lg relative flex items-end">
                  <div style={{ height: `${results.gap}%` }} className="w-full bg-[#fef2f2] border-2 border-red-500 shadow-xl flex items-center justify-center rounded-t-lg transition-all duration-1000 relative overflow-hidden" 
                       css={{ backgroundImage: 'repeating-linear-gradient(45deg, #fee2e2, #fee2e2 10px, #fca5a5 10px, #fca5a5 20px)' }}>
                    {results.gap > 15 && <div className="bg-white/90 px-2 py-1 rounded text-red-600 font-bold text-xs -rotate-3 border border-red-100 shadow">LACUNE</div>}
                  </div>
                </div>
                <div className="font-bold text-red-600 text-xs uppercase text-center">À Combler</div>
              </div>
            </div>
          </div>

          {/* EXPLANATION */}
          <div className={`p-6 rounded-2xl border-l-4 mb-6 transition-colors ${results.alert === 'critical' ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-[#3176A6]'}`}>
            <div className="flex gap-4">
              <div className="mt-1"><Info className={results.alert === 'critical' ? 'text-red-500' : 'text-[#3176A6]'} /></div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-slate-800">Analyse de situation</h4>
                <p className="text-slate-700">{results.text}</p>
              </div>
            </div>
          </div>

          {/* CAPITAL NEEDED */}
          {results.capitalNeeded > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-xl border-2 border-red-100 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-full text-red-600"><Target size={24}/></div>
                <div>
                    <div className="text-sm text-red-800 font-bold uppercase">{results.labelCapital}</div>
                    <div className="text-xs text-red-600">Objectif financier recommandé</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-red-600">{Math.round(results.capitalNeeded).toLocaleString()} CHF</div>
                <div className="text-xs text-red-500 font-bold">à sécuriser maintenant</div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-center text-xl font-bold text-white mb-6">Quel montant êtes-vous prêt(e) à investir ?</h3>
            <div className="flex justify-center gap-6 mb-8">
              <div className="bg-slate-800 p-1 rounded-lg flex">
                <button onClick={() => setInvestFreq('month')} className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${investFreq === 'month' ? 'bg-[#3176A6] text-white' : 'text-slate-400'}`}>Mensuel</button>
                <button onClick={() => setInvestFreq('year')} className={`px-6 py-2 rounded-md font-bold text-sm transition-all ${investFreq === 'year' ? 'bg-[#3176A6] text-white' : 'text-slate-400'}`}>Annuel</button>
              </div>
              <div className="flex items-center gap-3">
                <input type="number" value={investAmount} onChange={(e) => setInvestAmount(Number(e.target.value))} className="bg-slate-800 text-white font-bold text-3xl w-48 px-4 py-2 rounded-xl border border-slate-600 text-right outline-none" />
                <span className="text-2xl text-white font-bold">CHF</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-slate-700">
              <div className="text-white"><div className="text-slate-400 text-sm font-bold uppercase">Votre Engagement</div><div className="text-lg">Je souhaite combler ma lacune de <span className="text-yellow-400 font-bold">{Math.round(results.gapAmount).toLocaleString()} CHF</span></div></div>
              <button onClick={() => setIsModalOpen(true)} className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold py-4 px-8 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all"><Target /> Obtenir mon plan d'action</button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-[#3176A6] p-5 text-white text-center">
              <FileCheck size={40} className="mx-auto mb-3 opacity-80" />
              <h3 className="text-xl font-bold">Votre Planification</h3>
              <p className="text-[#8CB4D2] text-sm">Choisissez votre niveau d'accompagnement</p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Choix Service */}
              <div className="space-y-3">
                <label className="cursor-pointer relative block">
                    <input type="radio" name="serviceType" value="standard" className="peer sr-only" checked={serviceType === 'standard'} onChange={() => setServiceType('standard')} />
                    <div className={`p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${serviceType === 'standard' ? 'border-[#3176A6] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="bg-slate-100 p-2 rounded-lg text-slate-600"><Zap size={20}/></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800">Offre Ciblée (Standard)</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold mr-6">Gratuit</span>
                            </div>
                            <p className="text-xs text-slate-500">Proposition simple basée sur cette simulation.</p>
                        </div>
                        {serviceType === 'standard' && <CheckCircle2 className="absolute top-4 right-4 text-[#3176A6]" size={20} />}
                    </div>
                </label>

                <label className="cursor-pointer relative block">
                    <input type="radio" name="serviceType" value="expert" className="peer sr-only" checked={serviceType === 'expert'} onChange={() => setServiceType('expert')} />
                    <div className={`p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${serviceType === 'expert' ? 'border-[#3176A6] bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600"><SearchCheck size={20}/></div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-slate-800">Analyse Expert</span>
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">{isCouple ? "350.-" : "250.-"}</span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">Calcul réel sur pièces (AVS/LPP), optimisation & mandat.</p>
                            
                            <div className="mt-3 bg-slate-50 p-2 rounded flex justify-between items-center" onClick={(e) => e.preventDefault()}>
                                <span className="text-xs font-bold text-slate-600">Formule :</span>
                                <div className="flex bg-white rounded border border-slate-200">
                                    <button type="button" onClick={() => setIsCouple(false)} className={`px-3 py-1 text-xs font-bold rounded ${!isCouple ? 'bg-[#3176A6] text-white' : 'text-slate-500'}`}>Individuel (250.-)</button>
                                    <button type="button" onClick={() => setIsCouple(true)} className={`px-3 py-1 text-xs font-bold rounded ${isCouple ? 'bg-[#3176A6] text-white' : 'text-slate-500'}`}>Couple (350.-)</button>
                                </div>
                            </div>
                        </div>
                        {serviceType === 'expert' && <CheckCircle2 className="absolute top-4 right-4 text-[#3176A6]" size={20} />}
                    </div>
                </label>
              </div>

              {/* Formulaire P1 */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-[#3176A6] uppercase mb-4 flex gap-2"><User size={16}/> Votre Profil (P1)</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">Prénom</label><input value={p1.fname} onChange={e => setP1({...p1, fname: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-[#3176A6]"/></div>
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">Nom</label><input value={p1.lname} onChange={e => setP1({...p1, lname: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-[#3176A6]"/></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">Date naissance</label><input type="date" value={p1.dob} onChange={e => setP1({...p1, dob: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-[#3176A6]"/></div>
                  <div><label className="text-xs font-bold text-slate-500 block mb-1">Profession</label><input value={p1.profession} onChange={e => setP1({...p1, profession: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-[#3176A6]"/></div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Fumeur ?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2"><input type="radio" name="smoker1" checked={p1.smoker === 'oui'} onChange={() => setP1({...p1, smoker: 'oui'})} className="accent-[#3176A6]"/><span className="text-sm">Oui</span></label>
                    <label className="flex items-center gap-2"><input type="radio" name="smoker1" checked={p1.smoker === 'non'} onChange={() => setP1({...p1, smoker: 'non'})} className="accent-[#3176A6]"/><span className="text-sm">Non</span></label>
                  </div>
                </div>
              </div>

              {/* Formulaire P2 (Conditionnel) */}
              {isCouple && serviceType === 'expert' && (
                <div className="border-t border-dashed border-slate-300 pt-4 mb-4">
                  <h4 className="text-xs font-bold text-purple-600 uppercase mb-4 flex gap-2"><Users size={16}/> Conjoint / Partenaire (P2)</h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs font-bold text-slate-500 block mb-1">Prénom</label><input value={p2.fname} onChange={e => setP2({...p2, fname: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-purple-500"/></div>
                    <div><label className="text-xs font-bold text-slate-500 block mb-1">Nom</label><input value={p2.lname} onChange={e => setP2({...p2, lname: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-purple-500"/></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs font-bold text-slate-500 block mb-1">Date naissance</label><input type="date" value={p2.dob} onChange={e => setP2({...p2, dob: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-purple-500"/></div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Statut</label>
                      <select value={p2.status} onChange={e => setP2({...p2, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-purple-500">
                        <option>Employé</option><option>Indépendant</option><option>Sans activité</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><label className="text-xs font-bold text-slate-500 block mb-1">Profession</label><input value={p2.profession} onChange={e => setP2({...p2, profession: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-purple-500"/></div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Fumeur ?</label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-1"><input type="radio" name="smoker2" checked={p2.smoker === 'oui'} onChange={() => setP2({...p2, smoker: 'oui'})} className="accent-purple-600"/><span className="text-xs">Oui</span></label>
                        <label className="flex items-center gap-1"><input type="radio" name="smoker2" checked={p2.smoker === 'non'} onChange={() => setP2({...p2, smoker: 'non'})} className="accent-purple-600"/><span className="text-xs">Non</span></label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Famille */}
              <div className="border-t border-slate-100 pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">État Civil</label>
                    <select value={p1.civil} onChange={e => setP1({...p1, civil: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none">
                      <option>Célibataire</option><option>Marié(e)</option><option>Partenariat</option><option>Divorcé(e)</option><option>Veuf/Veuve</option>
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Nombre Enfants</label>
                    <input type="number" value={p1.childrenCount} onChange={e => setP1({...p1, childrenCount: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-[#3176A6]"/>
                  </div>
                </div>
                
                {(p1.civil === 'Marié(e)' || p1.civil === 'Partenariat') && (
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-[#3176A6] block mb-1">Date Mariage</label>
                    <input type="date" value={p1.marriageDate} onChange={e => setP1({...p1, marriageDate: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-[#3176A6]"/>
                    <p className="text-[10px] text-slate-500 mt-1 italic">Règle des 5 ans.</p>
                  </div>
                )}

                {/* Détails Enfants */}
                {childrenDetails.length > 0 && (
                  <div className="mb-4 space-y-3">
                    <h5 className="text-xs font-bold text-slate-400 uppercase">Détails Enfants</h5>
                    {childrenDetails.map((child, idx) => (
                      <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-200 grid grid-cols-3 gap-2">
                        <input placeholder="Prénom" value={child.fname} onChange={e => { const n = [...childrenDetails]; n[idx].fname = e.target.value; setChildrenDetails(n); }} className="text-xs p-1 rounded border outline-none" />
                        <input placeholder="Nom" value={child.lname} onChange={e => { const n = [...childrenDetails]; n[idx].lname = e.target.value; setChildrenDetails(n); }} className="text-xs p-1 rounded border outline-none" />
                        <input type="date" value={child.dob} onChange={e => { const n = [...childrenDetails]; n[idx].dob = e.target.value; setChildrenDetails(n); }} className="text-xs p-1 rounded border outline-none" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checklist Expert */}
              {serviceType === 'expert' && (
                <div className="border-t border-slate-100 pt-4 bg-blue-50 -mx-6 px-6 pb-4 mb-[-24px]">
                  <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200 shadow-sm">
                    <h5 className="text-xs font-bold text-[#3176A6] uppercase mb-1 flex items-center gap-1"><PenTool size={12}/> Conciergerie Administrative</h5>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={expertOpts.mandate} onChange={e => setExpertOpts({...expertOpts, mandate: e.target.checked})} className="accent-[#3176A6] mt-1" />
                      <span className="text-xs text-slate-700"><strong>Je vous donne mandat</strong><br/>WinWin récupère mes documents pour moi.</span>
                    </label>
                    
                    {/* Employeurs si mandat */}
                    {expertOpts.mandate && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                        {status === 'employee' && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Employeur (Vous)</span>
                            <input placeholder="Nom Entreprise" value={empP1.name} onChange={e => setEmpP1({...empP1, name: e.target.value})} className="w-full text-xs p-1 mb-1 border rounded" />
                            <div className="grid grid-cols-2 gap-1">
                              <input placeholder="Localité" value={empP1.loc} onChange={e => setEmpP1({...empP1, loc: e.target.value})} className="text-xs p-1 border rounded" />
                              <input placeholder="Tél RH" value={empP1.phone} onChange={e => setEmpP1({...empP1, phone: e.target.value})} className="text-xs p-1 border rounded" />
                            </div>
                          </div>
                        )}
                        {isCouple && p2.status === 'Employé' && (
                          <div>
                            <span className="text-[10px] font-bold text-purple-600 uppercase">Employeur (Conjoint)</span>
                            <input placeholder="Nom Entreprise" value={empP2.name} onChange={e => setEmpP2({...empP2, name: e.target.value})} className="w-full text-xs p-1 mb-1 border rounded" />
                            <div className="grid grid-cols-2 gap-1">
                              <input placeholder="Localité" value={empP2.loc} onChange={e => setEmpP2({...empP2, loc: e.target.value})} className="text-xs p-1 border rounded" />
                              <input placeholder="Tél RH" value={empP2.phone} onChange={e => setEmpP2({...empP2, phone: e.target.value})} className="text-xs p-1 border rounded" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Documents requis</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.avs} onChange={e => setExpertOpts({...expertOpts, avs: e.target.checked})} className="accent-[#3176A6]"/><span className="text-xs">Compte AVS (Vous)</span></label>
                    
                    {status === 'employee' ? (
                      <>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.contract} onChange={e => setExpertOpts({...expertOpts, contract: e.target.checked})} className="accent-[#3176A6]"/><span className="text-xs">Contrat Travail (Vous) - 720j</span></label>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.lpp} onChange={e => setExpertOpts({...expertOpts, lpp: e.target.checked})} className="accent-[#3176A6]"/><span className="text-xs">Certificat LPP (Vous)</span></label>
                      </>
                    ) : (
                      <>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.apgMaladie} onChange={e => setExpertOpts({...expertOpts, apgMaladie: e.target.checked})} className="accent-[#3176A6]"/><span className="text-xs">APG Maladie (Vous)</span></label>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.apgAccident} onChange={e => setExpertOpts({...expertOpts, apgAccident: e.target.checked})} className="accent-[#3176A6]"/><span className="text-xs">Assurance Accident (Vous)</span></label>
                      </>
                    )}

                    {isCouple && (
                      <div className="pt-2 border-t border-slate-200">
                        <div className="text-[10px] font-bold text-purple-600 mb-1">PARTENAIRE</div>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.avsP2} onChange={e => setExpertOpts({...expertOpts, avsP2: e.target.checked})} className="accent-purple-600"/><span className="text-xs">Compte AVS (P2)</span></label>
                        <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.lppP2} onChange={e => setExpertOpts({...expertOpts, lppP2: e.target.checked})} className="accent-purple-600"/><span className="text-xs">LPP / APG (P2)</span></label>
                      </div>
                    )}
                    
                    <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={expertOpts.pilier3} onChange={e => setExpertOpts({...expertOpts, pilier3: e.target.checked})} className="accent-[#3176A6]"/><span className="text-xs">3e Piliers existants</span></label>
                  </div>
                </div>
              )}

              {/* Boutons Finaux */}
              <div className="pt-2 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-slate-400 font-bold hover:text-slate-600">Annuler</button>
                <button onClick={handleCopyAndRedirect} className={`flex-2 px-8 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-slate-900 bg-yellow-400 hover:bg-yellow-300 transform active:scale-95 transition-all w-full`}>
                  {serviceType === 'expert' ? "Lancer l'audit" : "Valider la demande"} <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <CopyCheck className="text-green-400" />
          <span>Données copiées ! Collez-les dans le message.</span>
        </div>
      )}
    </div>
  );
}