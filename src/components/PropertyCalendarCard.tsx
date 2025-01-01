import { useEffect, useRef, useState } from 'react';
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
  const calendarRef = useRef<HTMLDivElement>(null);
  const [calendarWidth, setCalendarWidth] = useState<number>(0);

  useEffect(() => {
    const currentRef = calendarRef.current;
    if (!currentRef) return;

    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      // Cancel any pending animation frame
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      // Clear any pending timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Debounce the resize handling
      timeoutId = setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(() => {
          const entry = entries[0];
          if (entry) {
            setCalendarWidth(entry.contentRect.width);
          }
        });
      }, 100); // 100ms debounce
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(currentRef);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      resizeObserver.disconnect();
    };
  }, []);

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
        <div 
          ref={calendarRef} 
          className="relative"
          style={{ minHeight: '300px' }}
        >
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