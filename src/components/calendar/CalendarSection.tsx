import { useRef } from 'react';
import { Property, Reservation } from '../../types/types';
import PropertyCalendarCard from '../PropertyCalendarCard';
import BankingDataCard from '../BankingDataCard';
import { useCalendarResize } from '@/hooks/useCalendarResize';
import { DateRange } from "react-day-picker";
import ReservationList from '../ReservationList';

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
    <div className="flex flex-col lg:flex-row gap-4">
      <div ref={calendarContainerRef} className="flex-1">
        <PropertyCalendarCard
          property={selectedProperty}
          reservations={reservations}
          onSelect={onSelect}
          selectedDates={selectedDates}
        />
      </div>
      <div className="flex flex-col gap-4">
        <BankingDataCard />
        <ReservationList
          reservations={reservations.filter(r => r.propertyId === selectedProperty.id)}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      </div>
    </div>
  );
};

export default CalendarSection;