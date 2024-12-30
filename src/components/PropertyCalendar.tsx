import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Property, Reservation, Client } from '../types/types';
import PropertySelector from './PropertySelector';
import ReservationForm from './ReservationForm';
import { PROPERTIES, isDateRangeAvailable } from '../utils/reservationUtils';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const PropertyCalendar = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
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

  const getReservationInfo = (date: Date) => {
    return reservations.find((r) => 
      date >= r.startDate && date <= r.endDate
    );
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <PropertySelector
            properties={PROPERTIES}
            selectedProperty={selectedProperty}
            onSelect={setSelectedProperty}
          />
          <Button 
            onClick={() => {
              if (!selectedProperty) {
                toast({
                  title: "Error",
                  description: "Please select a property first",
                  variant: "destructive",
                });
                return;
              }
              setShowClientForm(true);
            }}
          >
            Add Reservation
          </Button>
        </div>

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
              backgroundColor: getDayClassName(date).replace('bg-', ''),
            }),
          }}
          onDayMouseEnter={(date) => setHoveredDate(date)}
          onDayMouseLeave={() => setHoveredDate(null)}
        />
      </div>

      <div className="w-80 space-y-8">
        <div className="rounded-md border p-4 space-y-4">
          <h3 className="font-semibold">Property Colors</h3>
          <div className="space-y-2">
            {PROPERTIES.map((property) => (
              <div key={property.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${property.color}`} />
                <span>{property.name}</span>
              </div>
            ))}
          </div>
        </div>

        {hoveredDate && (
          <div className="rounded-md border p-4 space-y-4">
            <h3 className="font-semibold">Date Information</h3>
            <p className="text-sm text-gray-600">
              {format(hoveredDate, 'PPP')}
            </p>
            {getReservationInfo(hoveredDate) ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Property:</span>{' '}
                  {PROPERTIES.find(p => p.id === getReservationInfo(hoveredDate)?.propertyId)?.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Client:</span>{' '}
                  {getReservationInfo(hoveredDate)?.client.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span>{' '}
                  {getReservationInfo(hoveredDate)?.client.phone}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No reservation for this date</p>
            )}
          </div>
        )}
      </div>

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