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

  const handleClientSubmit = (client: Client, dateRange: DateRange) => {
    if (!dateRange.from || !dateRange.to || !selectedProperty) return;

    const newReservation: Reservation = {
      id: Math.random().toString(),
      propertyId: selectedProperty.id,
      client,
      startDate: dateRange.from,
      endDate: dateRange.to,
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
      return property?.color.replace('bg-', '') || '';
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
                  description: "Por favor seleccione una propiedad primero",
                  variant: "destructive",
                });
                return;
              }
              setShowClientForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            Agregar Reserva
          </Button>
        </div>

        <Calendar
          mode="range"
          selected={selectedDates}
          onSelect={handleSelect}
          className="rounded-lg border-2 border-indigo-100 p-4 bg-white shadow-sm"
          modifiers={{
            booked: (date) => Boolean(getDayClassName(date)),
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: getDayClassName,
            } as any // This fixes the type error
          }}
          onDayMouseEnter={(date) => setHoveredDate(date)}
          onDayMouseLeave={() => setHoveredDate(null)}
        />
      </div>

      <div className="w-80 space-y-8">
        <div className="rounded-lg border-2 border-indigo-100 p-4 space-y-4 bg-white/80 backdrop-blur-sm">
          <h3 className="font-semibold text-gray-700">Colores de Propiedades</h3>
          <div className="space-y-2">
            {PROPERTIES.map((property) => (
              <div key={property.id} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${property.color}`} />
                <span className="text-gray-600">{property.name}</span>
              </div>
            ))}
          </div>
        </div>

        {hoveredDate && (
          <div className="rounded-lg border-2 border-indigo-100 p-4 space-y-4 bg-white/80 backdrop-blur-sm">
            <h3 className="font-semibold text-gray-700">Información de la Fecha</h3>
            <p className="text-sm text-gray-600">
              {format(hoveredDate, 'PPP')}
            </p>
            {getReservationInfo(hoveredDate) ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Propiedad:</span>{' '}
                  {PROPERTIES.find(p => p.id === getReservationInfo(hoveredDate)?.propertyId)?.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Cliente:</span>{' '}
                  {getReservationInfo(hoveredDate)?.client.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Teléfono:</span>{' '}
                  {getReservationInfo(hoveredDate)?.client.phone}
                </p>
                {getReservationInfo(hoveredDate)?.client.notes && (
                  <p className="text-sm">
                    <span className="font-medium">Notas:</span>{' '}
                    {getReservationInfo(hoveredDate)?.client.notes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay reservas para esta fecha</p>
            )}
          </div>
        )}
      </div>

      <Dialog open={showClientForm} onOpenChange={setShowClientForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              Detalles del Cliente
            </DialogTitle>
          </DialogHeader>
          <ReservationForm
            onSubmit={handleClientSubmit}
            onCancel={() => {
              setShowClientForm(false);
              setSelectedDates(undefined);
            }}
            initialDateRange={selectedDates}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyCalendar;