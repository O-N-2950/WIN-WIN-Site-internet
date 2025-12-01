import { useState, useMemo } from 'react';

// --- CHARTE GRAPHIQUE WINWIN ---
const THEME = {
  primary: '#3176A6',
  secondary: '#8CB4D2',
  bg: '#f8fafc',
  glass: 'rgba(255, 255, 255, 0.95)',
  glassBorder: '1px solid rgba(255, 255, 255, 0.5)',
  text: '#1e293b',
  textLight: '#64748b',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
  success: '#10b981',
  shadow: '0 25px 50px -12px rgba(49, 118, 166, 0.15)',
  disabled: '#cbd5e1'
};

const CANTONS = [
  "", "Argovie (AG)", "Appenzell Rh.-Int. (AI)", "Appenzell Rh.-Ext. (AR)", "Berne (BE)", 
  "Bâle-Campagne (BL)", "Bâle-Ville (BS)", "Fribourg (FR)", "Genève (GE)", "Glaris (GL)", 
  "Grisons (GR)", "Jura (JU)", "Lucerne (LU)", "Neuchâtel (NE)", "Nidwald (NW)", 
  "Obwald (OW)", "Saint-Gall (SG)", "Schaffhouse (SH)", "Soleure (SO)", "Schwytz (SZ)", 
  "Thurgovie (TG)", "Tessin (TI)", "Uri (UR)", "Vaud (VD)", "Valais (VS)", "Zoug (ZG)", "Zurich (ZH)"
];

// --- COMPOSANTS UI ---
const ModernSlider = ({ label, value, onChange, max = 20000, step = 100, presets = [] }: any) => (
  <div style={{ marginBottom: '35px', background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
      <span style={{ fontWeight: 600, fontSize: '1rem', color: THEME.text }}>{label}</span>
      <span style={{ color: THEME.primary, fontWeight: '800', fontSize: '1.2rem', fontVariantNumeric: 'tabular-nums' }}>
        {value.toLocaleString('fr-CH')} <span style={{fontSize:'0.8rem'}}>CHF</span>
      </span>
    </div>
    <input type="range" min="0" max={max} step={step} value={value} onChange={(e) => onChange(parseInt(e.target.value))} style={{ width: '100%', accentColor: THEME.primary, cursor: 'pointer', height: '6px', borderRadius: '10px', marginBottom: '15px' }} />
    {presets.length > 0 && (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {presets.map((preset: any, index: number) => (
          <button key={index} type="button" onClick={() => onChange(preset.val)} style={{ background: value === preset.val ? THEME.primary : '#f8fafc', color: value === preset.val ? 'white' : THEME.textLight, border: value === preset.val ? 'none' : '1px solid #e2e8f0', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
            {preset.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

const InputField = ({ label, type = "text", name, value, onChange, placeholder, required = false }: any) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '5px', color: THEME.textLight, textTransform: 'uppercase', letterSpacing:'0.5px' }}>
      {label} {required && <span style={{color: THEME.danger, fontSize:'1.2rem', verticalAlign:'middle'}}>*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '14px', borderRadius: '8px', border: value ? '1px solid #e2e8f0' : '1px solid #cbd5e1',
        fontSize: '1rem', background: '#fff', boxSizing: 'border-box', color: THEME.text, outline: 'none', transition: 'all 0.2s'
      }}
      onFocus={(e) => {e.target.style.borderColor = THEME.secondary; e.target.style.boxShadow = `0 0 0 3px ${THEME.secondary}20`;}}
      onBlur={(e) => {e.target.style.borderColor = value ? '#e2e8f0' : '#cbd5e1'; e.target.style.boxShadow = 'none';}}
    />
  </div>
);

const LossSimulator = ({ realValue }: any) => {
  const [oldValue, setOldValue] = useState(Math.round(realValue * 0.7)); 
  const damageExample = 20000;
  const ratio = Math.min(oldValue / realValue, 1);
  const loss = damageExample - (damageExample * ratio);

  return (
    <div style={{ marginTop: '20px', background: 'white', borderRadius: '16px', border: `1px solid ${THEME.dangerBg}`, overflow: 'hidden' }}>
      <div style={{ padding: '12px', background: THEME.dangerBg, color: THEME.danger, fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>⚠️</span> Testez le danger de la sous-assurance
      </div>
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: '0.85rem', color: THEME.textLight, marginBottom: '15px' }}>
          Si vous déclarez <strong>{oldValue.toLocaleString()}</strong> au lieu de <strong>{realValue.toLocaleString()}</strong> (Valeur à neuf), voici le résultat d'un sinistre à 20'000.- :
        </p>
        <input type="range" min={0} max={realValue} step={1000} value={oldValue} onChange={(e) => setOldValue(parseInt(e.target.value))} style={{ width: '100%', accentColor: THEME.danger, marginBottom: '10px' }} />
        {loss > 100 && (
          <div style={{ textAlign: 'center', color: THEME.danger, fontWeight: 'bold', fontSize: '1rem' }}>
            Perte sèche pour vous : - {Math.round(loss).toLocaleString()} CHF 💸
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP PRINCIPALE ---
export default function Outils() {
  const [step, setStep] = useState(1);
  const [actionType, setActionType] = useState<string | null>(null);

  const [values, setValues] = useState({
    canape: 0, media: 0, meubles: 0,
    cuisine: 0, habits: 0,
    sport: 0, vin: 0, autre: 0
  });

  const [clientInfo, setClientInfo] = useState({
    prenom: '', nom: '', email: '', mobile: '',
    dob: '', 
    adresse: '', npa: '', ville: '', canton: '',
    statut: 'locataire', type: 'famille',
    includeRC: false, driveThirdParty: 'non' 
  });

  const total = useMemo(() => Object.values(values).reduce((a, b) => a + b, 0), [values]);
  const finalAmount = useMemo(() => Math.ceil((total * 1.10) / 1000) * 1000, [total]);

  const updateVal = (key: string, val: number) => setValues(prev => ({ ...prev, [key]: val }));
  const handleInfoChange = (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setClientInfo(prev => ({ ...prev, [e.target.name]: value }));
  };

  // VALIDATION STRICTE
  const isFormValid = useMemo(() => {
    const base = clientInfo.prenom && clientInfo.nom && clientInfo.email && clientInfo.mobile;
    const address = clientInfo.adresse && clientInfo.npa && clientInfo.ville;
    
    if (actionType === 'update') return base && address;
    if (actionType === 'quote') return base && address && clientInfo.dob && clientInfo.canton;
    return false;
  }, [clientInfo, actionType]);

  const navigate = (newStep: number) => {
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  };

  const generateMailto = () => {
    if (!isFormValid) return "#";

    const subject = actionType === 'quote' 
      ? `Demande d'offre - Assurance Ménage ${clientInfo.includeRC ? '+ RC Privée' : ''} - ${clientInfo.nom}` 
      : `Mise à jour Inventaire Ménage - ${clientInfo.nom}`;
    
    let body = '';

    if (actionType === 'quote') {
      const dob = formatDate(clientInfo.dob);
      const cantonCode = clientInfo.canton.split('(')[1]?.replace(')', '') || '';
      
      let rcSection = "";
      if (clientInfo.includeRC) {
        const rcVehicule = clientInfo.driveThirdParty === 'oui' ? 'Oui (+CHF 38.-/an)' : 'Non';
        rcSection = `\nAssurance RC Privée :\n- Couverture ${clientInfo.type}\n- Option véhicule de tiers : ${rcVehicule}\n`;
      }

      const cantonNote = `\n=== REMARQUES ===\nCanton ${cantonCode} : Vérifier l'assurance incendie cantonale obligatoire`;

      body = `Bonjour,\n\n` +
             `Je souhaite obtenir une offre pour une assurance ménage via votre calculateur en ligne.\n\n` +
             `=== INFORMATIONS CLIENT ===\n` +
             `Nom : ${clientInfo.prenom} ${clientInfo.nom}\n` +
             `Date de naissance : ${dob}\n` +
             `Téléphone : ${clientInfo.mobile}\n` +
             `Email : ${clientInfo.email}\n\n` +
             `Adresse du risque :\n` +
             `${clientInfo.adresse}\n` +
             `${clientInfo.npa} ${clientInfo.ville} (${cantonCode})\n\n` +
             `Statut : ${clientInfo.statut.charAt(0).toUpperCase() + clientInfo.statut.slice(1)}\n` +
             `Composition du ménage : ${clientInfo.type.charAt(0).toUpperCase() + clientInfo.type.slice(1)}\n\n` +
             `=== COUVERTURE SOUHAITÉE ===\n` +
             `Assurance Ménage :\n` +
             `- Valeur inventaire (à neuf + 10%) : CHF ${finalAmount.toLocaleString('fr-CH')}.-\n` +
             rcSection +
             cantonNote +
             `\n\nMerci de me faire parvenir une offre détaillée.\n\n` +
             `Cordialement,\n${clientInfo.prenom} ${clientInfo.nom}`;
    } else {
      body = `Bonjour,\n\n` +
             `Je souhaite mettre à jour la valeur de mon inventaire ménage.\n\n` +
             `=== INFORMATIONS CLIENT ===\n` +
             `Nom : ${clientInfo.prenom} ${clientInfo.nom}\n` +
             `Téléphone : ${clientInfo.mobile}\n` +
             `Email : ${clientInfo.email}\n\n` +
             `Adresse actuelle :\n` +
             `${clientInfo.adresse}\n` +
             `${clientInfo.npa}\n\n` +
             `=== NOUVELLE VALEUR ===\n` +
             `Valeur inventaire (à neuf + 10%) : CHF ${finalAmount.toLocaleString('fr-CH')}.-\n\n` +
             `Merci de procéder à la mise à jour de mon contrat.\n\n` +
             `Cordialement,\n${clientInfo.prenom} ${clientInfo.nom}`;
    }

    return `mailto:contact@winwin.swiss?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", minHeight: '100vh', background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      
      <div style={{ width: '100%', maxWidth: '700px', background: THEME.glass, backdropFilter: 'blur(12px)', borderRadius: '24px', boxShadow: THEME.shadow, border: THEME.glassBorder, overflow: 'hidden', marginTop: '20px' }}>

        {/* HEADER */}
        <div style={{ background: 'white', padding: '25px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
           <div style={{ color: THEME.primary, fontWeight: '900', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
             WINWIN <span style={{color: THEME.secondary}}>FINANCE</span>
           </div>
           <div style={{ fontSize: '0.8rem', color: THEME.textLight, marginTop: '5px' }}>CALCULATEUR OFFICIEL SUISSE</div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ height: '4px', background: '#e2e8f0', width: '100%' }}>
          <div style={{ height: '100%', background: THEME.primary, width: `${(step / 4) * 100}%`, transition: 'width 0.5s ease' }} />
        </div>

        {/* STICKY TOTAL */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '15px 30px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: THEME.textLight, fontWeight: 600 }}>Total Estimé (Neuf)</span>
          <span style={{ fontSize: '1.4rem', color: THEME.primary, fontWeight: '800' }}>{total.toLocaleString('fr-CH')} CHF</span>
        </div>

        <div style={{ padding: '30px', minHeight: '400px' }}>
          
          {/* ÉTAPES 1 à 3 */}
          {step === 1 && (
            <div className="step-animation">
              <h2 style={{ color: THEME.primary, fontSize: '1.5rem', marginBottom: '10px' }}>🛋️ Le Salon & Séjour</h2>
              <p style={{ color: THEME.textLight, marginBottom: '30px' }}>Valeur à neuf = Prix actuel en magasin.</p>
              <ModernSlider label="Canapés & Fauteuils" value={values.canape} onChange={(v: number) => updateVal('canape', v)} presets={[{label:'IKEA', val:2000}, {label:'Cuir/Design', val:8000}]} />
              <ModernSlider label="Multimédia (TV, PC...)" value={values.media} onChange={(v: number) => updateVal('media', v)} max={30000} presets={[{label:'Standard', val:3000}, {label:'Gamer', val:12000}]} />
              <ModernSlider label="Meubles & Déco" value={values.meubles} onChange={(v: number) => updateVal('meubles', v)} />
            </div>
          )}

          {step === 2 && (
            <div className="step-animation">
              <h2 style={{ color: THEME.primary, fontSize: '1.5rem', marginBottom: '10px' }}>👗 Dressing & Cuisine</h2>
              <ModernSlider label="Cuisine (Vaisselle, Robots)" value={values.cuisine} onChange={(v: number) => updateVal('cuisine', v)} max={20000} presets={[{label:'Locataire', val:5000}, {label:'Propriétaire', val:15000}]} />
              <ModernSlider label="Habits & Chaussures" value={values.habits} onChange={(v: number) => updateVal('habits', v)} max={80000} step={500} presets={[{label:'Solo', val:20000}, {label:'Couple', val:40000}, {label:'Famille', val:60000}]} />
            </div>
          )}

          {step === 3 && (
            <div className="step-animation">
              <h2 style={{ color: THEME.primary, fontSize: '1.5rem', marginBottom: '10px' }}>🚲 Loisirs & Cave</h2>
              <ModernSlider label="Matériel de Sport" value={values.sport} onChange={(v: number) => updateVal('sport', v)} max={40000} />
              <ModernSlider label="Vins & Spiritueux" value={values.vin} onChange={(v: number) => updateVal('vin', v)} max={15000} step={100} />
              <ModernSlider label="Divers (Cave, Outils)" value={values.autre} onChange={(v: number) => updateVal('autre', v)} />
            </div>
          )}

          {/* ÉTAPE 4 : RÉSULTAT */}
          {step === 4 && (
            <div className="step-animation">
              
              {/* BOUTON RETOUR EN HAUT */}
              <div style={{ marginBottom: '20px' }}>
                <button 
                  onClick={() => navigate(1)} 
                  style={{ 
                    background: 'white', 
                    border: `2px solid ${THEME.primary}`, 
                    color: THEME.primary, 
                    padding: '12px 24px', 
                    borderRadius: '10px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = THEME.primary;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = THEME.primary;
                  }}
                >
                  ← Modifier l'inventaire
                </button>
              </div>

              {/* CARD RESULTAT */}
              <div style={{ textAlign: 'center', padding: '30px', background: `linear-gradient(135deg, ${THEME.primary} 0%, #1e40af 100%)`, color: 'white', borderRadius: '20px', marginBottom: '20px' }}>
                <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>VALEUR À ASSURER (Sécurité incluse)</div>
                <div style={{ fontSize: '3rem', fontWeight: 900, margin: '10px 0' }}>{finalAmount.toLocaleString('fr-CH')}</div>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '10px', marginTop: '15px', fontSize: '0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px' }}>
                  <span>💡</span> 
                  <span>Ne calculez pas au franc près !<br/>Une différence de <strong>10'000.-</strong> représente un investissement d'environ <strong>15.-/an</strong>.</span>
                </div>
              </div>

              {!actionType && <LossSimulator realValue={finalAmount} />}

              {/* SELECTEUR D'ACTION */}
              {!actionType && (
                <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                   <button onClick={() => setActionType('quote')} style={{ padding: '20px', border: `2px solid ${THEME.primary}`, background: 'white', borderRadius: '15px', color: THEME.primary, cursor: 'pointer', fontWeight:'bold' }}>
                     📝 Demander une Offre
                   </button>
                   <button onClick={() => setActionType('update')} style={{ padding: '20px', border: '2px solid #cbd5e1', background: 'white', borderRadius: '15px', color: THEME.text, cursor: 'pointer', fontWeight:'bold' }}>
                     🔄 Mettre à jour contrat
                   </button>
                </div>
              )}

              {/* FORMULAIRE FINAL */}
              {actionType && (
                <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s' }}>
                  <h3 style={{ color: THEME.primary, borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                    {actionType === 'quote' ? '📝 Nouvelle Offre' : '👤 Identification'}
                  </h3>

                  {/* INFO PERSO */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <InputField label="Prénom" name="prenom" value={clientInfo.prenom} onChange={handleInfoChange} required />
                    <InputField label="Nom" name="nom" value={clientInfo.nom} onChange={handleInfoChange} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <InputField label="Email" name="email" type="email" value={clientInfo.email} onChange={handleInfoChange} required />
                    <InputField label="Mobile" name="mobile" type="tel" value={clientInfo.mobile} onChange={handleInfoChange} required />
                  </div>

                  {/* ADRESSE DETAILLÉE ET OBLIGATOIRE */}
                  <div style={{ marginTop: '10px' }}>
                     <InputField label="Rue & N° Bâtiment" name="adresse" value={clientInfo.adresse} onChange={handleInfoChange} placeholder="Ex: Grand-Rue 15" required />
                     
                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px' }}>
                       <InputField label="NPA" name="npa" value={clientInfo.npa} onChange={handleInfoChange} placeholder="1000" required />
                       <InputField label="Localité" name="ville" value={clientInfo.ville} onChange={handleInfoChange} placeholder="Lausanne" required />
                     </div>
                  </div>

                  {/* CHAMPS SPÉCIFIQUES OFFRE */}
                  {actionType === 'quote' && (
                    <>
                      <div style={{marginBottom:'15px'}}>
                        <label style={{display:'block', fontSize:'0.75rem', fontWeight:800, marginBottom:'5px', color:THEME.textLight, textTransform:'uppercase'}}>Canton <span style={{color:THEME.danger}}>*</span></label>
                        <select name="canton" value={clientInfo.canton} onChange={handleInfoChange} style={{width:'100%', padding:'12px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white', fontSize:'1rem'}}>
                           <option value="" disabled>Sélectionnez un canton</option>
                           {CANTONS.map((c,i) => <option key={i} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <InputField label="Date Naissance" name="dob" type="date" value={clientInfo.dob} onChange={handleInfoChange} required />

                      {/* STATUT & MÉNAGE */}
                      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                        <div style={{ display:'flex', gap:'20px', marginBottom:'10px' }}>
                          <label style={{cursor:'pointer'}}><input type="radio" name="statut" value="locataire" checked={clientInfo.statut === 'locataire'} onChange={handleInfoChange} /> Locataire</label>
                          <label style={{cursor:'pointer'}}><input type="radio" name="statut" value="proprietaire" checked={clientInfo.statut === 'proprietaire'} onChange={handleInfoChange} /> Propriétaire</label>
                        </div>
                        <div style={{ display:'flex', gap:'20px' }}>
                          <label style={{cursor:'pointer'}}><input type="radio" name="type" value="seul" checked={clientInfo.type === 'seul'} onChange={handleInfoChange} /> Pers. Seule</label>
                          <label style={{cursor:'pointer'}}><input type="radio" name="type" value="famille" checked={clientInfo.type === 'famille'} onChange={handleInfoChange} /> Famille/Couple</label>
                        </div>
                      </div>

                      {/* OPTION RC */}
                      <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '10px', border: `1px solid ${THEME.secondary}`, marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: THEME.primary }}>
                          <input type="checkbox" name="includeRC" checked={clientInfo.includeRC} onChange={handleInfoChange} style={{ width: '18px', height: '18px' }} />
                          Ajouter RC Privée ?
                        </label>
                        {clientInfo.includeRC && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #cbd5e1' }}>
                            <p style={{ fontSize: '0.85rem', marginBottom: '10px' }}>Conduite de véhicule tiers (+38.-/an) ?</p>
                            <div style={{ display: 'flex', gap: '20px' }}>
                              <label style={{cursor:'pointer'}}><input type="radio" name="driveThirdParty" value="oui" checked={clientInfo.driveThirdParty === 'oui'} onChange={handleInfoChange} /> Oui</label>
                              <label style={{cursor:'pointer'}}><input type="radio" name="driveThirdParty" value="non" checked={clientInfo.driveThirdParty === 'non'} onChange={handleInfoChange} /> Non</label>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* BOUTON D'ENVOI AVEC VALIDATION */}
                  <a 
                    href={generateMailto()} 
                    onClick={(e) => !isFormValid && e.preventDefault()}
                    style={{ 
                      display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none', 
                      background: isFormValid ? THEME.primary : THEME.disabled, 
                      color: 'white', padding: '16px', borderRadius: '12px', fontWeight: 'bold', marginTop: '20px',
                      cursor: isFormValid ? 'pointer' : 'not-allowed', transition: 'background 0.3s'
                    }}
                  >
                    {isFormValid ? 'Envoyer ma demande 🚀' : 'Remplissez les champs obligatoires *'}
                  </a>
                  
                  <button onClick={() => setActionType(null)} style={{ background: 'transparent', border: 'none', width: '100%', padding: '10px', color: THEME.textLight, cursor: 'pointer', textDecoration:'underline', marginTop:'10px' }}>
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FOOTER NAV */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
              {step > 1 ? <button onClick={() => navigate(step - 1)} style={{ background: 'transparent', border: 'none', color: THEME.textLight, fontWeight: 600, cursor: 'pointer' }}>← Retour</button> : <div></div>}
              <button onClick={() => navigate(step + 1)} style={{ background: THEME.primary, color: 'white', border: 'none', padding: '14px 35px', borderRadius: '30px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(49, 118, 166, 0.4)', cursor: 'pointer' }}>
                {step === 3 ? 'Voir le Résultat 🎉' : 'Suivant'}
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .step-animation { animation: fadeIn 0.5s ease-out; } body { margin: 0; } input:focus { outline: none; }`}</style>
    </div>
  );
}
