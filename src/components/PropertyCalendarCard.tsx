import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property, Reservation } from '../types/types';
import { DateRange } from "react-day-picker";
import { es } from 'date-fns/locale';
import { getDaysInMonth, startOfMonth, endOfMonth } from 'date-fns';

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
  selectedDates,
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

  const calculateOccupancyPercentage = (): number => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    
    let occupiedDays = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
      if (isDateBooked(currentDate)) {
        occupiedDays++;
      }
    }
    
    return Math.round((occupiedDays / daysInMonth) * 100);
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

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${property.color}`} />
            <span>{property.name}</span>
          </div>
          <div className="text-sm font-normal bg-muted px-2 py-1 rounded-md">
            {calculateOccupancyPercentage()}% ocupado
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            day: "h-9 w-9 p-0 font-normal text-black font-medium cursor-pointer",
            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
            day_today: "font-bold underline",
            months: "w-full",
            month: "w-full",
            table: "w-full"
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