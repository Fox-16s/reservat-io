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
  const getDayClassName = (date: Date): string => {
    const propertyReservations = reservations.filter(r => r.propertyId === property.id);
    const isBooked = propertyReservations.some((r) => {
      const currentDate = new Date(date.setHours(0, 0, 0, 0));
      const startDate = new Date(r.startDate.setHours(0, 0, 0, 0));
      const endDate = new Date(r.endDate.setHours(0, 0, 0, 0));
      return currentDate >= startDate && currentDate <= endDate;
    });

    return isBooked ? property.color : '';
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
            booked: (date) => Boolean(getDayClassName(date)),
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: property.color.replace('bg-', ''),
              color: 'white',
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyCalendarCard;