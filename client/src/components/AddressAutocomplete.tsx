import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { mapCantonToAirtable } from "@/lib/cantonMapping";
import { Loader2 } from "lucide-react";

// VERSION V4 - FORCE RENDER FIX
// Ce composant force la mise à jour visuelle des inputs

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
  // Cette logique est MAÎTRE. Si le NPA change, on veut toujours voir la ville correspondante.
  useEffect(() => {
    // On lance la recherche seulement si on a 4 chiffres
    if (npaValue.length === 4 && /^\d{4}$/.test(npaValue)) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`https://openplzapi.org/ch/Localities?postalCode=${npaValue}`);
          if (response.ok) {
            const data: OpenPLZLocality[] = await response.json();
            
            // Déduplication
            const uniqueData = data.reduce((acc: OpenPLZLocality[], current) => {
              const key = `${current.postalCode}-${current.name}`;
              if (!acc.find(item => `${item.postalCode}-${item.name}` === key)) acc.push(current);
              return acc;
            }, []);
            
            if (uniqueData.length === 1) {
              // FORCE UPDATE: On met à jour même si c'est déjà la même valeur pour être sûr
              onLocaliteChange(uniqueData[0].name);
              
              const cantonName = mapCantonToAirtable(uniqueData[0].canton.shortName);
              if (cantonName && onCantonChange) onCantonChange(cantonName);
              
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
        // Si on efface le NPA, on ferme les suggestions mais on laisse la ville (choix UX)
        setSuggestions([]);
        setShowSuggestions(false);
    }
  }, [npaValue]); 

  // --- LOGIQUE 2 : VILLE CHANGE -> ON CHERCHE LE NPA ---
  useEffect(() => {
    // On ne cherche que si NPA incomplet pour éviter les boucles
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
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
            <Input
            type="text"
            placeholder="NPA"
            value={npaValue}
            onChange={(e) => onNpaChange(e.target.value)}
            maxLength={4}
            className="h-14 text-lg"
            />
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
    </div>
  );
}
