import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { mapCantonToAirtable } from "@/lib/cantonMapping";
import { Loader2, CheckCircle2 } from "lucide-react";

// VERSION V6 - UX AMÉLIORÉE FINALE
// Indicateur visuel vert avec animation + Message d'aide avec canton + Pré-remplissage canton

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
  const [npaIsValid, setNpaIsValid] = useState(false); // État pour l'indicateur vert
  const [foundCanton, setFoundCanton] = useState<string>(""); // Canton trouvé pour le message d'aide
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIQUE 1 : NPA CHANGE -> ON CHERCHE LA VILLE ---
  useEffect(() => {
    if (npaValue.length === 4 && /^\d{4}$/.test(npaValue)) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        setNpaIsValid(false); // Reset l'indicateur pendant la recherche
        try {
          const response = await fetch(`https://openplzapi.org/ch/Localities?postalCode=${npaValue}`);
          if (response.ok) {
            const data: OpenPLZLocality[] = await response.json();
            
            const uniqueData = data.reduce((acc: OpenPLZLocality[], current) => {
              const key = `${current.postalCode}-${current.name}`;
              if (!acc.find(item => `${item.postalCode}-${item.name}` === key)) acc.push(current);
              return acc;
            }, []);
            
            if (uniqueData.length === 1) {
              // FORCE UPDATE: On met à jour même si c'est déjà la même valeur
              onLocaliteChange(uniqueData[0].name);
              
              const cantonName = mapCantonToAirtable(uniqueData[0].canton.shortName);
              if (cantonName && onCantonChange) onCantonChange(cantonName);
              
              setNpaIsValid(true); // ✅ INDICATEUR VERT ACTIVÉ
              setFoundCanton(cantonName || ""); // ✅ SAUVEGARDER LE CANTON POUR LE MESSAGE
              toast.success(`✓ ${uniqueData[0].name}`);
              
              setSuggestions([]);
              setShowSuggestions(false);
            } else if (uniqueData.length > 1) {
              setSuggestions(uniqueData);
              setShowSuggestions(true);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else if (npaValue.length < 4) {
        setNpaIsValid(false); // Reset l'indicateur si NPA incomplet
        setFoundCanton(""); // Reset le canton
        setSuggestions([]);
        setShowSuggestions(false);
    }
  }, [npaValue]); 

  // --- LOGIQUE 2 : VILLE CHANGE -> ON CHERCHE LE NPA ---
  useEffect(() => {
    if (localiteValue.length > 2 && npaValue.length < 4) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://openplzapi.org/ch/Localities?name=${encodeURIComponent(localiteValue)}`);
          if (response.ok) {
            const data: OpenPLZLocality[] = await response.json();
             const uniqueData = data.reduce((acc: OpenPLZLocality[], current) => {
                const key = `${current.postalCode}-${current.name}`;
                if (!acc.find(item => `${item.postalCode}-${item.name}` === key)) acc.push(current);
                return acc;
              }, []);
            
            if (uniqueData.length === 1) {
               onNpaChange(uniqueData[0].postalCode);
               
               const cantonName = mapCantonToAirtable(uniqueData[0].canton.shortName);
               if (cantonName && onCantonChange) onCantonChange(cantonName);
               
               setNpaIsValid(true); // ✅ INDICATEUR VERT ACTIVÉ
               setFoundCanton(cantonName || ""); // ✅ SAUVEGARDER LE CANTON POUR LE MESSAGE
               
               setSuggestions([]);
               setShowSuggestions(false);
            } else if (uniqueData.length > 1) {
              setSuggestions(uniqueData);
              setShowSuggestions(true);
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [localiteValue]);

  const handleSelectSuggestion = (locality: OpenPLZLocality) => {
    onNpaChange(locality.postalCode);
    onLocaliteChange(locality.name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    const cantonName = mapCantonToAirtable(locality.canton.shortName);
    if (cantonName && onCantonChange) onCantonChange(cantonName);
    
    setNpaIsValid(true); // ✅ INDICATEUR VERT ACTIVÉ
    setFoundCanton(cantonName || ""); // ✅ SAUVEGARDER LE CANTON POUR LE MESSAGE
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 relative">
            <Input
            type="text"
            placeholder="NPA"
            value={npaValue}
            onChange={(e) => onNpaChange(e.target.value)}
            maxLength={4}
            className={`h-14 text-lg ${npaIsValid ? 'border-green-500 border-2' : ''}`}
            />
            {/* ✅ INDICATEUR VERT SUR LE CHAMP NPA AVEC ANIMATION BOUNCE */}
            {npaIsValid && (
              <div className="absolute right-3 top-4 animate-bounce">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            )}
        </div>
        <div className="col-span-2 relative" ref={suggestionsRef}>
          <div className="relative">
            {/* KEY AJOUTÉE POUR FORCER LE RENDER SI LA VALEUR CHANGE MAIS NE S'AFFICHE PAS */}
            <Input
                key={localiteValue ? `loc-${localiteValue}` : 'loc-empty'}
                type="text"
                placeholder="Localité"
                value={localiteValue}
                onChange={(e) => onLocaliteChange(e.target.value)}
                className="h-14 text-lg"
            />
            {isLoading && (
                <div className="absolute right-3 top-4">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            )}
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((locality, index) => (
                <button
                  key={`${locality.postalCode}-${index}`}
                  type="button"
                  onClick={() => handleSelectSuggestion(locality)}
                  className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b last:border-b-0"
                >
                  <div className="font-medium text-base">{locality.name}</div>
                  <div className="text-sm text-gray-500">
                    {locality.postalCode} · {locality.canton.shortName}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* ✅ MESSAGE D'AIDE SOUS LES CHAMPS AVEC CANTON */}
      <p className="text-sm text-gray-500 mt-2">
        {npaIsValid && foundCanton ? (
          <span className="text-green-600 font-medium">
            ✓ {localiteValue}, {foundCanton}
          </span>
        ) : (
          <span>💡 Tapez votre NPA ou votre localité, l'autre champ se remplira automatiquement</span>
        )}
      </p>
    </div>
  );
}
