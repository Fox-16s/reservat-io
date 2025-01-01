import { useState, useEffect, useRef } from 'react';
import { Property, Reservation, Client, PaymentMethod } from '../types/types';
import ReservationList from './ReservationList';
import PropertyCalendarCard from './PropertyCalendarCard';
import { PROPERTIES, isDateRangeAvailable } from '../utils/reservationUtils';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import CalendarHeader from './CalendarHeader';
import ReservationDialog from './ReservationDialog';
import { useReservations } from '@/hooks/useReservations';

const PropertyCalendar = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();
  const { reservations, createReservation, updateReservation, deleteReservation } = useReservations();
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = calendarContainerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      // Force a re-render of the calendar when container size changes
      window.dispatchEvent(new Event('resize'));
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleSelect = (range: DateRange | undefined) => {
    if (!range || !selectedProperty) return;

    if (!range.from) {
      setSelectedDates(range);
    } else if (range.from && range.to) {
      const startDate = range.from;
      const endDate = range.to;
      
      if (endDate < startDate) {
        toast({
          title: "Rango de fechas inválido",
          description: "La fecha final no puede ser anterior a la fecha inicial",
          variant: "destructive",
        });
        return;
      }

      const isAvailable = editingReservation
        ? isDateRangeAvailable(startDate, endDate, selectedProperty.id, 
            reservations.filter(r => r.id !== editingReservation.id))
        : isDateRangeAvailable(startDate, endDate, selectedProperty.id, reservations);

      if (isAvailable) {
        setSelectedDates(range);
        setShowClientForm(true);
      } else {
        toast({
          title: "Rango de fechas no disponible",
          description: "Esta propiedad ya está reservada para las fechas seleccionadas",
          variant: "destructive",
        });
        setSelectedDates(undefined);
      }
    } else {
      setSelectedDates(range);
    }
  };

  const handleClientSubmit = async (client: Client, dateRange: DateRange, totalAmount: number, paymentMethods: PaymentMethod[]) => {
    if (!dateRange.from || !dateRange.to || !selectedProperty) return;

    let success;
    if (editingReservation) {
      success = await updateReservation(
        editingReservation.id,
        client,
        dateRange,
        totalAmount,
        paymentMethods
      );
    } else {
      success = await createReservation(
        selectedProperty.id,
        client,
        dateRange,
        totalAmount,
        paymentMethods
      );
    }

    if (success) {
      toast({
        title: "Éxito",
        description: editingReservation ? "Reserva actualizada correctamente" : "Reserva creada correctamente",
      });
      setSelectedDates(undefined);
      setShowClientForm(false);
      setEditingReservation(null);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    const success = await deleteReservation(id);
    if (success) {
      toast({
        title: "Éxito",
        description: "Reserva eliminada correctamente",
      });
    }
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setSelectedProperty(PROPERTIES.find(p => p.id === reservation.propertyId) || null);
    setSelectedDates({
      from: reservation.startDate,
      to: reservation.endDate,
    });
    setShowClientForm(true);
  };

  return (
    <div className="space-y-8 p-8">
      <CalendarHeader
        properties={PROPERTIES}
        selectedProperty={selectedProperty}
        onPropertySelect={setSelectedProperty}
        onAddReservation={() => setShowClientForm(true)}
      />

      <div ref={calendarContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROPERTIES.map((property) => (
          <PropertyCalendarCard
            key={property.id}
            property={property}
            reservations={reservations}
            onSelect={(range) => {
              setSelectedProperty(property);
              handleSelect(range);
            }}
            selectedDates={selectedProperty?.id === property.id ? selectedDates : undefined}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <ReservationList
          reservations={reservations}
          onDelete={handleDeleteReservation}
          onEdit={handleEditReservation}
        />
      </div>

      <ReservationDialog
        open={showClientForm}
        onOpenChange={setShowClientForm}
        onSubmit={handleClientSubmit}
        selectedDates={selectedDates}
        editingReservation={editingReservation}
        onCancel={() => {
          setShowClientForm(false);
          setEditingReservation(null);
          setSelectedDates(undefined);
        }}
      />
    </div>
  );
};

export default PropertyCalendar;
