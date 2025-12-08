import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { mapCantonToAirtable } from "@/lib/cantonMapping";
import { Loader2 } from "lucide-react";

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
  const [isSelecting, setIsSelecting] = useState(false);
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

  // SEARCH 1: NPA -> LOCALITY
  useEffect(() => {
    if (isSelecting) return;
    
    if (npaValue.length === 4 && /^\d{4}$/.test(npaValue)) {
      const timer = setTimeout(async () => {
        setIsLoading(true);
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
              setIsSelecting(true);
              onLocaliteChange(uniqueData[0].name);
              setSuggestions([]);
              setShowSuggestions(false);
              const cantonName = mapCantonToAirtable(uniqueData[0].canton.shortName);
              if (cantonName && onCantonChange) onCantonChange(cantonName);
              toast.success(`✓ ${uniqueData[0].name}`);
              setTimeout(() => setIsSelecting(false), 800);
            } else if (uniqueData.length > 1) {
              setSuggestions(uniqueData);
              setShowSuggestions(true);
            }
          }
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [npaValue]);

  // SEARCH 2: LOCALITY -> NPA
  useEffect(() => {
    if (isSelecting) return;

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
               setIsSelecting(true);
               onNpaChange(uniqueData[0].postalCode);
               setSuggestions([]);
               setShowSuggestions(false);
               const cantonName = mapCantonToAirtable(uniqueData[0].canton.shortName);
               if (cantonName && onCantonChange) onCantonChange(cantonName);
               toast.success(`✓ ${uniqueData[0].postalCode}`);
               setTimeout(() => setIsSelecting(false), 800);
            } else if (uniqueData.length > 1) {
              setSuggestions(uniqueData);
              setShowSuggestions(true);
            }
          }
        } catch (error) { console.error(error); } finally { setIsLoading(false); }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [localiteValue]);

  const handleSelectSuggestion = (locality: OpenPLZLocality) => {
    setIsSelecting(true);
    onNpaChange(locality.postalCode);
    onLocaliteChange(locality.name);
    setShowSuggestions(false);
    setSuggestions([]);
    const cantonName = mapCantonToAirtable(locality.canton.shortName);
    if (cantonName && onCantonChange) onCantonChange(cantonName);
    setTimeout(() => setIsSelecting(false), 800);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
            <Input type="text" placeholder="NPA" value={npaValue} onChange={(e) => onNpaChange(e.target.value)} maxLength={4} className="h-14 text-lg" />
        </div>
        <div className="col-span-2 relative" ref={suggestionsRef}>
          <div className="relative">
            <Input type="text" placeholder="Localité" value={localiteValue} onChange={(e) => onLocaliteChange(e.target.value)} className="h-14 text-lg" />
            {isLoading && (<div className="absolute right-3 top-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>)}
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {suggestions.map((locality, index) => (
                <button key={`${locality.postalCode}-${index}`} type="button" onClick={() => handleSelectSuggestion(locality)} className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b last:border-b-0">
                  <div className="font-medium text-base">{locality.name}</div>
                  <div className="text-sm text-gray-500">{locality.postalCode} · {locality.canton.shortName}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
