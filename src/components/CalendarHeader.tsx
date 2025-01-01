import { Property } from '../types/types';
import PropertySelector from './PropertySelector';

interface CalendarHeaderProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
}

const CalendarHeader = ({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
}: CalendarHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <PropertySelector
        properties={properties}
        selectedProperty={selectedProperty}
        onSelect={onPropertySelect}
      />
    </div>
  );
};

export default CalendarHeader;