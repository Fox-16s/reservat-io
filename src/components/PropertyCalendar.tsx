import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Property, Reservation, Client } from '../types/types';
import PropertySelector from './PropertySelector';
import ReservationForm from './ReservationForm';
import { PROPERTIES, isDateRangeAvailable } from '../utils/reservationUtils';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";

const PropertyCalendar = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const { toast } = useToast();

  const handleSelect = (range: DateRange | undefined) => {
    if (!range || !selectedProperty) return;

    if (!range.from) {
      setSelectedDates(range);
    } else if (range.from && range.to) {
      const startDate = range.from;
      const endDate = range.to;
      
      if (endDate < startDate) {
        toast({
          title: "Invalid date range",
          description: "End date cannot be before start date",
          variant: "destructive",
        });
        return;
      }

      if (isDateRangeAvailable(startDate, endDate, selectedProperty.id, reservations)) {
        setSelectedDates(range);
        setShowClientForm(true);
      } else {
        toast({
          title: "Date range unavailable",
          description: "This property is already reserved for the selected dates",
          variant: "destructive",
        });
        setSelectedDates(undefined);
      }
    } else {
      setSelectedDates(range);
    }
  };

  const handleClientSubmit = (client: Client) => {
    if (!selectedDates?.from || !selectedDates?.to || !selectedProperty) return;

    const newReservation: Reservation = {
      id: Math.random().toString(),
      propertyId: selectedProperty.id,
      client,
      startDate: selectedDates.from,
      endDate: selectedDates.to,
    };

    setReservations([...reservations, newReservation]);
    setSelectedDates(undefined);
    setShowClientForm(false);
    
    toast({
      title: "Success",
      description: "Reservation created successfully",
    });
  };

  const getDayClassName = (date: Date) => {
    const reservation = reservations.find((r) => {
      const property = PROPERTIES.find((p) => p.id === r.propertyId);
      return (
        date >= r.startDate &&
        date <= r.endDate &&
        property
      );
    });

    if (reservation) {
      const property = PROPERTIES.find((p) => p.id === reservation.propertyId);
      return property?.color || '';
    }

    return '';
  };

  return (
    <div className="space-y-8 p-8">
      <PropertySelector
        properties={PROPERTIES}
        selectedProperty={selectedProperty}
        onSelect={setSelectedProperty}
      />

      <Calendar
        mode="range"
        selected={selectedDates}
        onSelect={handleSelect}
        className="rounded-md border"
        modifiers={{
          booked: (date) => Boolean(getDayClassName(date)),
        }}
        modifiersStyles={{
          booked: (date) => ({
            backgroundColor: getDayClassName(date),
          }),
        }}
      />

      <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Client Details</DialogTitle>
          </DialogHeader>
          <ReservationForm
            onSubmit={handleClientSubmit}
            onCancel={() => {
              setShowClientForm(false);
              setSelectedDates(undefined);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyCalendar;