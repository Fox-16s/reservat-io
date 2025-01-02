import { useState } from 'react';
import { Property, Reservation, Client, PaymentMethod } from '../types/types';
import ReservationList from './ReservationList';
import { PROPERTIES, isDateRangeAvailable } from '../utils/reservationUtils';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import CalendarHeader from './CalendarHeader';
import ReservationDialog from './ReservationDialog';
import { useReservations } from '@/hooks/useReservations';
import CalendarSection from './calendar/CalendarSection';

interface PropertyCalendarProps {
  selectedPropertyId: string;
}

const PropertyCalendar = ({ selectedPropertyId }: PropertyCalendarProps) => {
  const selectedProperty = PROPERTIES.find(p => p.id === selectedPropertyId) || null;
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();
  const { reservations, createReservation, updateReservation, deleteReservation } = useReservations();

  const filteredReservations = reservations.filter(r => r.propertyId === selectedPropertyId);

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
    setSelectedDates({
      from: reservation.startDate,
      to: reservation.endDate,
    });
    setShowClientForm(true);
  };

  if (!selectedProperty) return null;

  return (
    <div className="space-y-8">
      <CalendarHeader
        properties={[selectedProperty]}
        selectedProperty={selectedProperty}
        onPropertySelect={() => {}}
        onAddReservation={() => setShowClientForm(true)}
      />

      <div className="flex flex-col space-y-8">
        <CalendarSection
          selectedProperty={selectedProperty}
          reservations={reservations}
          selectedDates={selectedDates}
          onSelect={handleSelect}
        />

        <ReservationList
          reservations={filteredReservations}
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