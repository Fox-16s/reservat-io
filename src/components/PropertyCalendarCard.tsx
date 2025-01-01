import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property, Reservation } from '../types/types';
import { DateRange } from "react-day-picker";
import { es } from 'date-fns/locale';
import { isSameMonth } from 'date-fns';

interface PropertyCalendarCardProps {
  property: Property;
  reservations: Reservation[];
  onSelect: (range: DateRange | undefined) => void;
  selectedDates?: DateRange;
}

const RESERVATION_COLORS = [
  'bg-[#ea384c]',  // Original red
  'bg-[#3b82f6]',  // Blue
  'bg-[#22c55e]',  // Green
  'bg-[#f59e0b]',  // Yellow
  'bg-[#8b5cf6]',  // Purple
];

const PropertyCalendarCard = ({ 
  property, 
  reservations, 
  onSelect,
  selectedDates,
}: PropertyCalendarCardProps) => {
  const getReservationColor = (date: Date): string => {
    const propertyReservations = reservations
      .filter(r => r.propertyId === property.id)
      .filter(r => isSameMonth(r.startDate, date));
    
    const reservation = getReservationForDate(date);
    if (!reservation) return '';

    const index = propertyReservations.findIndex(r => r.id === reservation.id);
    return RESERVATION_COLORS[index % RESERVATION_COLORS.length];
  };

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

  const getReservationForDate = (date: Date): Reservation | undefined => {
    const propertyReservations = reservations.filter(r => r.propertyId === property.id);
    return propertyReservations.find((r) => {
      const currentDate = new Date(date.getTime());
      currentDate.setHours(0, 0, 0, 0);
      const startDate = new Date(r.startDate.getTime());
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(r.endDate.getTime());
      endDate.setHours(0, 0, 0, 0);
      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  const handleDayClick = (date: Date) => {
    const reservation = getReservationForDate(date);
    if (reservation) {
      const element = document.getElementById(`reservation-${reservation.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const modifiersStyles = {
    booked: (date: Date) => ({
      color: 'white',
      backgroundColor: getReservationColor(date) || '#ea384c',
    }),
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${property.color}`} />
          <span>{property.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="range"
          selected={selectedDates}
          onSelect={onSelect}
          className="rounded-lg border-2 border-indigo-100 p-4 bg-white shadow-sm"
          modifiers={{
            booked: (date) => isDateBooked(date),
          }}
          modifiersStyles={modifiersStyles}
          classNames={{
            day: "h-9 w-9 p-0 font-normal text-black font-medium cursor-pointer",
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
          onDayClick={handleDayClick}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyCalendarCard;