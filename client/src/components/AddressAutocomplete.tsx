import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

/**
 * Composant AddressAutocomplete avec API Zippopotam.us
 * 
 * Fonctionnalités :
 * - Tape NPA → Recherche automatique des localités
 * - Si 1 localité → Remplissage automatique
 * - Si plusieurs localités → Liste déroulante pour choisir
 */

interface AddressAutocompleteProps {
  npaValue: string;
  localiteValue: string;
  onNpaChange: (value: string) => void;
  onLocaliteChange: (value: string) => void;
  label?: string;
}

interface ZippopotamPlace {
  "place name": string;
}

interface ZippopotamResponse {
  places: ZippopotamPlace[];
}

export function AddressAutocomplete({
  npaValue,
  localiteValue,
  onNpaChange,
  onLocaliteChange,
  label = "NPA / Localité",
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fermer les suggestions si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recherche auto avec debounce
  useEffect(() => {
    if (npaValue.length === 4) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://api.zippopotam.us/CH/${npaValue}`);
          if (response.ok) {
            const data: ZippopotamResponse = await response.json();
            const places = data.places.map((p) => p["place name"]);
            
            if (places.length === 1) {
              // 1 seule localité → Remplissage automatique
              onLocaliteChange(places[0]);
              setSuggestions([]);
              setShowSuggestions(false);
            } else if (places.length > 1) {
              // Plusieurs localités → Afficher liste
              setSuggestions(places);
              setShowSuggestions(true);
            }
          } else {
            // NPA invalide
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error("Erreur API Zippopotam:", error);
          toast.error("Impossible de vérifier le NPA");
        } finally {
          setIsLoading(false);
        }
      }, 500); // Debounce 500ms

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [npaValue, onLocaliteChange]);

  const handleSelectSuggestion = (place: string) => {
    onLocaliteChange(place);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="NPA"
          value={npaValue}
          onChange={(e) => onNpaChange(e.target.value)}
          maxLength={4}
        />
        <div className="relative" ref={suggestionsRef}>
          <Input
            type="text"
            placeholder={isLoading ? "Recherche..." : "Localité"}
            value={localiteValue}
            onChange={(e) => onLocaliteChange(e.target.value)}
            disabled={isLoading}
          />
          
          {/* Liste déroulante des suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((place, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(place)}
                  className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors"
                >
                  {place}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
