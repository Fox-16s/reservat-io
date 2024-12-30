import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Property, Reservation } from '../types/types';
import { DateRange } from "react-day-picker";

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
          modifiersStyles={{
            booked: {
              color: 'white',
              backgroundColor: '#ea384c', // Red for booked dates
            },
            default: {
              backgroundColor: '#F2FCE2', // Light green for available dates
            }
          }}
          styles={{
            day: { 
              color: 'black',
              fontWeight: '500',
            },
            day_selected: { 
              backgroundColor: '#3b82f6',
              color: 'white' 
            },
            day_today: { 
              fontWeight: 'bold',
              textDecoration: 'underline'
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyCalendarCard;