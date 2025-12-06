import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface Locality {
  key: string;
  name: string;
  postalcode: string;
  commune: {
    name: string;
  };
  canton: {
    shortName: string;
  };
}

interface AddressAutocompleteProps {
  npaValue: string;
  localiteValue: string;
  onNpaChange: (value: string) => void;
  onLocaliteChange: (value: string) => void;
  onSelect?: (locality: Locality) => void;
  required?: boolean;
  className?: string;
}

/**
 * Composant d'auto-complétion pour NPA et Localité suisse
 * Utilise l'API OpenPLZ (gratuite, open source)
 */
export function AddressAutocomplete({
  npaValue,
  localiteValue,
  onNpaChange,
  onLocaliteChange,
  onSelect,
  required = false,
  className = '',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Locality[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeField, setActiveField] = useState<'npa' | 'localite' | null>(null);
  const [isNpaValid, setIsNpaValid] = useState(false);
  
  const npaInputRef = useRef<HTMLInputElement>(null);
  const localiteInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Fermer les suggestions si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !npaInputRef.current?.contains(event.target as Node) &&
        !localiteInputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Rechercher les localités via OpenPLZ API
  const searchLocalities = async (npa: string, localite: string) => {
    if (!npa && !localite) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      
      // Si NPA saisi, rechercher par NPA (avec regex pour auto-complétion)
      if (npa) {
        params.append('postalCode', `^${npa}`);
      }
      
      // Si Localité saisie, rechercher par nom (avec regex pour auto-complétion)
      if (localite) {
        params.append('name', `^${localite}`);
      }

      const response = await fetch(
        `https://openplzapi.org/ch/Localities?${params.toString()}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      setSuggestions(data.slice(0, 10)); // Limiter à 10 résultats
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('[AddressAutocomplete] Error:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce la recherche
  const debouncedSearch = (npa: string, localite: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      searchLocalities(npa, localite);
    }, 300);
  };

  // Gérer le changement de NPA
  const handleNpaChange = async (value: string) => {
    // Autoriser uniquement les chiffres (4 max)
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    onNpaChange(cleaned);
    setActiveField('npa');
    
    if (cleaned.length === 4) {
      // NPA complet : vérifier s'il correspond à une localité unique
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://openplzapi.org/ch/Localities?postalCode=${cleaned}`,
          { headers: { 'Accept': 'application/json' } }
        );
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.length === 1) {
            // Une seule localité → Auto-remplir
            onLocaliteChange(data[0].name);
            setSuggestions([]);
            setShowSuggestions(false);
            setIsNpaValid(true);
          } else if (data.length > 1) {
            // Plusieurs localités → Afficher suggestions
            setSuggestions(data.slice(0, 10));
            setShowSuggestions(true);
            setIsNpaValid(true);
          } else {
            // Aucune localité trouvée
            setSuggestions([]);
            setShowSuggestions(false);
            setIsNpaValid(false);
          }
        }
      } catch (error) {
        console.error('[AddressAutocomplete] Error:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (cleaned.length > 0) {
      setIsNpaValid(false);
      debouncedSearch(cleaned, '');
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsNpaValid(false);
    }
  };

  // Gérer le changement de Localité
  const handleLocaliteChange = (value: string) => {
    onLocaliteChange(value);
    setActiveField('localite');
    
    if (value.length > 1) {
      debouncedSearch('', value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Sélectionner une suggestion
  const selectSuggestion = (locality: Locality) => {
    onNpaChange(locality.postalcode);
    onLocaliteChange(locality.name);
    setShowSuggestions(false);
    setSuggestions([]);
    
    if (onSelect) {
      onSelect(locality);
    }
  };

  // Navigation clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSuggestions([]);
        break;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        {/* Champ NPA */}
        <div className="relative">
          <Label htmlFor="npa" className="text-lg">
            NPA {required && '*'}
          </Label>
          <div className="relative">
            <Input
              ref={npaInputRef}
              id="npa"
              type="text"
              inputMode="numeric"
              value={npaValue}
              onChange={(e) => handleNpaChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setActiveField('npa');
                if (npaValue) {
                  debouncedSearch(npaValue, '');
                }
              }}
              placeholder="1000"
              className={`mt-2 text-lg h-14 ${
                isNpaValid ? 'pr-12 border-green-500 focus:ring-green-500' : ''
              }`}
              required={required}
              maxLength={4}
            />
            {isNpaValid && (
              <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 mt-1 h-6 w-6 text-green-500" />
            )}
          </div>
        </div>

        {/* Champ Localité */}
        <div className="relative">
          <Label htmlFor="localite" className="text-lg">
            Localité {required && '*'}
          </Label>
          <Input
            ref={localiteInputRef}
            id="localite"
            type="text"
            value={localiteValue}
            onChange={(e) => handleLocaliteChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setActiveField('localite');
              if (localiteValue) {
                debouncedSearch('', localiteValue);
              }
            }}
            placeholder="Lausanne"
            className="mt-2 text-lg h-14"
            required={required}
          />
        </div>
      </div>

      {/* Dropdown de suggestions */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="ml-2 text-sm text-muted-foreground">
                Recherche en cours...
              </span>
            </div>
          ) : (
            <ul className="py-2">
              {suggestions.map((locality, index) => (
                <li
                  key={locality.key}
                  onClick={() => selectSuggestion(locality)}
                  className={`
                    px-4 py-3 cursor-pointer transition-colors
                    hover:bg-accent hover:text-accent-foreground
                    ${index === selectedIndex ? 'bg-accent text-accent-foreground' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">
                        {locality.postalcode} {locality.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {locality.commune.name}, {locality.canton.shortName}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
