import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Composant AddressAutocomplete
 * 
 * Pour l'instant, c'est un simple input.
 * TODO: Intégrer l'API Google Places pour l'autocomplétion
 */

interface AddressAutocompleteProps {
  npaValue: string;
  localiteValue: string;
  onNpaChange: (value: string) => void;
  onLocaliteChange: (value: string) => void;
  label?: string;
}

export function AddressAutocomplete({
  npaValue,
  localiteValue,
  onNpaChange,
  onLocaliteChange,
  label = "NPA / Localité",
}: AddressAutocompleteProps) {
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
        <Input
          type="text"
          placeholder="Localité"
          value={localiteValue}
          onChange={(e) => onLocaliteChange(e.target.value)}
        />
      </div>
    </div>
  );
}
