import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { APP_LOGO } from "@/const";

interface InventoryValues {
  canape: number;
  media: number;
  meubles: number;
  cuisine: number;
  habits: number;
  chambre: number;
  bijoux: number;
  sport: number;
  cave: number;
  jardin: number;
}

export default function Outils() {
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState<InventoryValues>({
    canape: 0,
    media: 0,
    meubles: 0,
    cuisine: 0,
    habits: 0,
    chambre: 0,
    bijoux: 0,
    sport: 0,
    cave: 0,
    jardin: 0,
  });

  const totalSteps = 4;
  const total = Object.values(values).reduce((sum, val) => sum + val, 0);
  const progress = (currentStep / totalSteps) * 100;

  const updateValue = (key: keyof InventoryValues, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatCHF = (amount: number) => {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "CHF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          {/* En-tête de la page */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              🛠️ Outils Pratiques
            </h1>
            <p className="text-lg text-gray-600">
              Des outils gratuits pour vous aider à mieux gérer vos assurances
            </p>
          </div>

          {/* Calculateur d'Inventaire */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-4 border-primary">
            {/* Bandeau pédagogique */}
            <div className="bg-blue-50 border-l-4 border-primary p-4 flex items-center gap-3">
              <span className="text-xl">💡</span>
              <span className="text-sm text-blue-900">
                <strong>Important :</strong> Calculez toujours la{" "}
                <strong>"Valeur à neuf"</strong> (prix magasin actuel) et non la
                valeur d'occasion, sinon vous serez mal remboursé.
              </span>
            </div>

            {/* Header avec logo */}
            <div className="bg-white p-6 text-center border-b">
              <img
                src={APP_LOGO}
                alt="WIN WIN Finance"
                className="h-16 mx-auto mb-2"
              />
              <h2 className="text-2xl font-bold text-primary">
                Calculateur Inventaire Ménage
              </h2>
              <p className="text-gray-600 mt-1">
                Estimation rapide & précise en CHF
              </p>
            </div>

            {/* Barre de progression */}
            <div className="w-full h-1.5 bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-400"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Total sticky */}
            <div className="bg-primary/5 p-4 flex justify-between items-center font-bold text-primary sticky top-0 z-10 backdrop-blur-sm">
              <span>Total (Valeur à neuf)</span>
              <span className="text-2xl">{formatCHF(total)}</span>
            </div>

            {/* Étape 1 : Salon & Multimédia */}
            {currentStep === 1 && (
              <div className="p-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  🛋️ Salon & Multimédia
                </h2>
                <p className="text-gray-600 mb-6">
                  Imaginez que vous devez tout racheter neuf aujourd'hui.
                </p>

                <SliderInput
                  label="Canapés, Fauteuils, Tapis"
                  value={values.canape}
                  onChange={(val) => updateValue("canape", val)}
                  max={20000}
                  presets={[
                    { label: "IKEA (2k)", value: 2000 },
                    { label: "Standard (5k)", value: 5000 },
                    { label: "Design (12k)", value: 12000 },
                  ]}
                />

                <SliderInput
                  label="TV, Sonos, Ordinateurs, Consoles"
                  value={values.media}
                  onChange={(val) => updateValue("media", val)}
                  max={25000}
                  presets={[
                    { label: "Base", value: 3000 },
                    { label: "Équipé", value: 8000 },
                    { label: "Pro/Gamer", value: 15000 },
                  ]}
                />

                <SliderInput
                  label="Bibliothèque, Table, Buffet, Déco"
                  value={values.meubles}
                  onChange={(val) => updateValue("meubles", val)}
                  max={20000}
                />

                <NavButtons
                  onPrev={prevStep}
                  onNext={nextStep}
                  showPrev={false}
                />
              </div>
            )}

            {/* Étape 2 : Cuisine & Habits */}
            {currentStep === 2 && (
              <div className="p-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  👗 Cuisine & Habits
                </h2>

                <SliderInput
                  label="Vaisselle, Robots (Thermomix..), Casseroles"
                  value={values.cuisine}
                  onChange={(val) => updateValue("cuisine", val)}
                  max={15000}
                  presets={[
                    { label: "Locataire std", value: 4000 },
                    { label: "Cuisine équipée", value: 10000 },
                  ]}
                />

                <SliderInput
                  label="Habits, Chaussures, Sacs, Manteaux"
                  value={values.habits}
                  onChange={(val) => updateValue("habits", val)}
                  max={30000}
                  presets={[
                    { label: "H&M (5k)", value: 5000 },
                    { label: "Zara (12k)", value: 12000 },
                    { label: "Luxe (25k)", value: 25000 },
                  ]}
                />

                <NavButtons onPrev={prevStep} onNext={nextStep} showPrev />
              </div>
            )}

            {/* Étape 3 : Chambre & Objets de Valeur */}
            {currentStep === 3 && (
              <div className="p-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  💎 Chambre & Objets de Valeur
                </h2>

                <SliderInput
                  label="Lit, Matelas, Armoire, Linge"
                  value={values.chambre}
                  onChange={(val) => updateValue("chambre", val)}
                  max={20000}
                />

                <SliderInput
                  label="Bijoux, Montres, Œuvres d'Art"
                  value={values.bijoux}
                  onChange={(val) => updateValue("bijoux", val)}
                  max={50000}
                  presets={[
                    { label: "Aucun", value: 0 },
                    { label: "Quelques bijoux", value: 5000 },
                    { label: "Collection", value: 20000 },
                  ]}
                />

                <SliderInput
                  label="Équipement Sport, Vélos, Ski"
                  value={values.sport}
                  onChange={(val) => updateValue("sport", val)}
                  max={15000}
                />

                <NavButtons onPrev={prevStep} onNext={nextStep} showPrev />
              </div>
            )}

            {/* Étape 4 : Résultat Final */}
            {currentStep === 4 && (
              <div className="p-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">
                  📊 Résultat de votre Estimation
                </h2>

                {/* Carte résultat */}
                <div className="bg-gradient-to-br from-primary to-blue-900 text-white rounded-2xl p-8 text-center mb-8 shadow-xl">
                  <p className="text-lg mb-2">Valeur totale à neuf</p>
                  <p className="text-5xl font-black">{formatCHF(total)}</p>
                  <p className="text-sm mt-4 opacity-90">
                    Montant recommandé pour votre assurance ménage
                  </p>
                </div>

                {/* Carte explicative sous-assurance */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-2 text-red-700 font-bold mb-4">
                    <span className="text-xl">⚠️</span>
                    <span>Attention à la Sous-Assurance</span>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Si vous assurez <strong>moins que la valeur réelle</strong>,
                    l'assurance applique la{" "}
                    <strong>règle proportionnelle</strong> :
                  </p>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-500 font-mono text-sm text-gray-700">
                    <div className="flex justify-between mb-1">
                      <span>Valeur réelle :</span>
                      <span className="font-bold">100'000 CHF</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Somme assurée :</span>
                      <span className="font-bold">50'000 CHF</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Dégât (incendie) :</span>
                      <span className="font-bold">20'000 CHF</span>
                    </div>
                    <div className="h-px bg-gray-300 my-2" />
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Remboursement :</span>
                      <span>10'000 CHF (50% seulement !)</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    💡 <strong>Conseil :</strong> Assurez toujours la valeur à
                    neuf complète pour éviter les mauvaises surprises.
                  </p>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Besoin d'aide pour optimiser votre assurance ménage ?
                  </p>
                  <a
                    href="/conseil"
                    className="inline-block bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all hover:scale-105 shadow-lg"
                  >
                    Demandez Conseil Gratuitement
                  </a>
                </div>

                <div className="mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    ← Retour
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section autres outils (à venir) */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Autres Outils à Venir
            </h3>
            <p className="text-gray-600">
              Nous travaillons sur d'autres outils pratiques pour vous aider à
              mieux gérer vos assurances et votre patrimoine.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Composant SliderInput
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  max: number;
  presets?: { label: string; value: number }[];
}

function SliderInput({
  label,
  value,
  onChange,
  max,
  presets,
}: SliderInputProps) {
  const formatCHF = (amount: number) => {
    return new Intl.NumberFormat("fr-CH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-end mb-2">
        <span className="font-medium text-gray-800">{label}</span>
        <span className="text-primary font-bold text-lg">
          {formatCHF(value)} CHF
        </span>
      </div>
      <input
        type="range"
        min="0"
        max={max}
        step="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      {presets && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.value)}
              className="bg-white border border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-blue-50 px-3 py-1 rounded-full text-xs transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Composant NavButtons
interface NavButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  showPrev: boolean;
}

function NavButtons({ onPrev, onNext, showPrev }: NavButtonsProps) {
  return (
    <div className="flex justify-between mt-10 pt-6 border-t">
      {showPrev ? (
        <button
          type="button"
          onClick={onPrev}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          ← Précédent
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-7 rounded-lg transition-all hover:scale-105 shadow-lg"
      >
        Suivant →
      </button>
    </div>
  );
}
