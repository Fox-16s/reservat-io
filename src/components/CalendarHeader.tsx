import { Property } from '../types/types';
import PropertySelector from './PropertySelector';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CalendarHeaderProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  onAddReservation: () => void;
}

const CalendarHeader = ({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  onAddReservation 
}: CalendarHeaderProps) => {
  const { toast } = useToast();

  const handleAddClick = () => {
    if (!selectedProperty) {
      toast({
        title: "Error",
        description: "Por favor seleccione una propiedad primero",
        variant: "destructive",
      });
      return;
    }
    onAddReservation();
  };

  return (
    <div className="flex items-center gap-4">
      <PropertySelector
        properties={properties}
        selectedProperty={selectedProperty}
        onSelect={onPropertySelect}
      />
      <Button 
        onClick={handleAddClick}
        className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
      >
        Agregar Reserva
      </Button>
    </div>
  );
};

export default CalendarHeader;