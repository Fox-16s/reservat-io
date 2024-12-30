import { Property } from '../types/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertySelectorProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelect: (property: Property) => void;
}

const PropertySelector = ({ properties, selectedProperty, onSelect }: PropertySelectorProps) => {
  return (
    <div className="w-full max-w-xs">
      <Select
        value={selectedProperty?.id}
        onValueChange={(value) => {
          const property = properties.find((p) => p.id === value);
          if (property) onSelect(property);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a property" />
        </SelectTrigger>
        <SelectContent>
          {properties.map((property) => (
            <SelectItem key={property.id} value={property.id}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${property.color}`} />
                <span>{property.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PropertySelector;