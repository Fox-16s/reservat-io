import { useRef } from 'react';
import { Property, Reservation } from '../../types/types';
import PropertyCalendarCard from '../PropertyCalendarCard';
import BankingDataCard from '../BankingDataCard';
import { useCalendarResize } from '@/hooks/useCalendarResize';
import { DateRange } from "react-day-picker";

interface CalendarSectionProps {
  selectedProperty: Property;
  reservations: Reservation[];
  selectedDates: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

const CalendarSection = ({
  selectedProperty,
  reservations,
  selectedDates,
  onSelect,
}: CalendarSectionProps) => {
  const calendarContainerRef = useRef<HTMLDivElement>(null);
  useCalendarResize(calendarContainerRef);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div ref={calendarContainerRef} className="flex-1">
          <PropertyCalendarCard
            property={selectedProperty}
            reservations={reservations}
            onSelect={onSelect}
            selectedDates={selectedDates}
          />
        </div>
        <div className="flex-1">
          <BankingDataCard />
        </div>
      </div>
      <div className="w-full flex justify-center">
        <ReservationList
          reservations={reservations}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
};

export default CalendarSection;