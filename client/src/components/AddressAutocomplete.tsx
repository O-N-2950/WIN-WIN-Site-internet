import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { mapCantonToAirtable } from "@/lib/cantonMapping";

/**
 * Composant AddressAutocomplete avec API OpenPLZ (Suisse)
 * 
 * Fonctionnalités :
 * - NPA → Localité : Tape "2950" → Liste déroulante ["Courgenay", "Courtemautruy"]
 * - Localité → NPA : Tape "Bure" → NPA devient "2915" automatiquement
 * - Auto-complétion BIDIRECTIONNELLE
 * - API gratuite et complète pour TOUS les NPA suisses
 */

interface AddressAutocompleteProps {
  npaValue: string;
  localiteValue: string;
  onNpaChange: (value: string) => void;
  onLocaliteChange: (value: string) => void;
  onCantonChange?: (value: string) => void;
  label?: string;
}

interface OpenPLZLocality {
  postalCode: string;
  name: string;
  canton: {
    key: string;
    name: string;
    shortName: string;
  };
}

export function AddressAutocomplete({
  npaValue,
  localiteValue,
  onNpaChange,
  onLocaliteChange,
  onCantonChange,
  label,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<OpenPLZLocality[]>([]);
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

  // RECHERCHE NPA → LOCALITÉ (quand NPA complet = 4 chiffres)
  useEffect(() => {
    if (npaValue.length === 4) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://openplzapi.org/ch/Localities?postalCode=${npaValue}`);
          if (response.ok) {
            const data: OpenPLZLocality[] = await response.json();
            
            if (data.length === 1) {
              // 1 seule localité → Remplissage automatique
              onLocaliteChange(data[0].name);
              setSuggestions([]);
              setShowSuggestions(false);
              
              // Remplir automatiquement le canton
              const cantonName = mapCantonToAirtable(data[0].canton.shortName);
              if (cantonName && onCantonChange) {
                onCantonChange(cantonName);
              }
              
              toast.success(`✓ ${data[0].name} (${data[0].canton.shortName})`);
            } else if (data.length > 1) {
              // Plusieurs localités → Afficher liste déroulante
              setSuggestions(data);
              setShowSuggestions(true);
            } else {
              // NPA invalide
              toast.error("NPA introuvable");
              setSuggestions([]);
              setShowSuggestions(false);
            }
          } else {
            toast.error("Impossible de vérifier le NPA");
          }
        } catch (error) {
          console.error("Erreur API OpenPLZ:", error);
          toast.error("Erreur de connexion");
        } finally {
          setIsLoading(false);
        }
      }, 300); // Debounce 300ms

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [npaValue, onLocaliteChange]);

  // RECHERCHE LOCALITÉ → NPA (quand localité >= 3 caractères)
  useEffect(() => {
    if (localiteValue.length >= 3 && npaValue.length < 4) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          // Recherche regex pour auto-complétion partielle
          const response = await fetch(`https://openplzapi.org/ch/Localities?name=${encodeURIComponent(localiteValue)}`);
          if (response.ok) {
            const data: OpenPLZLocality[] = await response.json();
            
            if (data.length === 1) {
              // 1 seule localité → Remplissage automatique NPA + Localité
              onNpaChange(data[0].postalCode);
              onLocaliteChange(data[0].name);
              setSuggestions([]);
              setShowSuggestions(false);
              
              // Remplir automatiquement le canton
              const cantonName = mapCantonToAirtable(data[0].canton.shortName);
              if (cantonName && onCantonChange) {
                onCantonChange(cantonName);
              }
              
              toast.success(`✓ ${data[0].name} (${data[0].postalCode} - ${data[0].canton.shortName})`);
            } else if (data.length > 1) {
              // Plusieurs localités → Afficher liste déroulante
              setSuggestions(data);
              setShowSuggestions(true);
            } else {
              // Localité introuvable
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }
        } catch (error) {
          console.error("Erreur API OpenPLZ:", error);
        } finally {
          setIsLoading(false);
        }
      }, 500); // Debounce 500ms pour la recherche texte

      return () => clearTimeout(timer);
    }
  }, [localiteValue, npaValue, onNpaChange, onLocaliteChange]);

  const handleSelectSuggestion = (locality: OpenPLZLocality) => {
    onNpaChange(locality.postalCode);
    onLocaliteChange(locality.name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Remplir automatiquement le canton
    const cantonName = mapCantonToAirtable(locality.canton.shortName);
    if (cantonName && onCantonChange) {
      onCantonChange(cantonName);
    }
    
    toast.success(`✓ ${locality.name} (${locality.postalCode} - ${locality.canton.shortName})`);
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
              {suggestions.map((locality, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectSuggestion(locality)}
                  className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors border-b last:border-b-0"
                >
                  <div className="font-medium">{locality.name}</div>
                  <div className="text-sm text-gray-500">
                    {locality.postalCode} · {locality.canton.shortName}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
