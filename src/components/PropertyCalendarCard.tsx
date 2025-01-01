import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property, Reservation } from '../types/types';
import { DateRange } from "react-day-picker";
import { es } from 'date-fns/locale';

interface PropertyCalendarCardProps {
  property: Property;
  reservations: Reservation[];
  onSelect: (range: DateRange | undefined) => void;
  selectedDates?: DateRange;
}

const PropertyCalendarCard = ({ 
  property, 
  reservations, 
  onSelect,
  selectedDates 
}: PropertyCalendarCardProps) => {
  const isDateBooked = (date: Date): boolean => {
    const propertyReservations = reservations.filter(r => r.propertyId === property.id);
    return propertyReservations.some((r) => {
      const currentDate = new Date(date.getTime());
      currentDate.setHours(0, 0, 0, 0);
      const startDate = new Date(r.startDate.getTime());
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(r.endDate.getTime());
      endDate.setHours(0, 0, 0, 0);
      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  if (!property) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${property.color}`} />
          <span>{property.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative min-h-[350px] w-full">
          <Calendar
            mode="range"
            selected={selectedDates}
            onSelect={onSelect}
            className="rounded-lg border-2 border-indigo-100 p-4 bg-white shadow-sm w-full"
            modifiers={{
              booked: (date) => isDateBooked(date),
            }}
            modifiersStyles={{
              booked: {
                color: 'white',
                backgroundColor: '#ea384c',
              },
              default: {
                backgroundColor: '#F2FCE2',
              }
            }}
            classNames={{
              day: "h-9 w-9 p-0 font-normal text-black font-medium",
              day_selected: "bg-blue-500 text-white hover:bg-blue-600",
              day_today: "font-bold underline"
            }}
            locale={es}
            weekStartsOn={1}
            formatters={{
              formatCaption: (date, options) => {
                return date.toLocaleString('es', { month: 'long', year: 'numeric' });
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCalendarCard;