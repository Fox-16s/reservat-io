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
    <Card className="max-w-fit mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${property.color}`} />
          <span>{property.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <Calendar
            mode="range"
            selected={selectedDates}
            onSelect={(range) => {
              if (range?.from) {
                range.from.setHours(0, 0, 0, 0);
              }
              if (range?.to) {
                range.to.setHours(23, 59, 59, 999);
              }
              onSelect(range);
            }}
            className="rounded-lg border-2 border-indigo-100 p-3 bg-white shadow-sm"
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
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-3",
              caption: "flex justify-center pt-1 relative items-center text-sm",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
              row: "flex w-full mt-1",
              cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
              day: "h-8 w-8 p-0 font-normal text-sm aria-selected:opacity-100",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
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