import { useState, useEffect } from 'react';
import { Property, Reservation, Client, PaymentMethod } from '../types/types';
import PropertyLegend from './PropertyLegend';
import ReservationList from './ReservationList';
import PropertyCalendarCard from './PropertyCalendarCard';
import { PROPERTIES, isDateRangeAvailable } from '../utils/reservationUtils';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import CalendarHeader from './CalendarHeader';
import ReservationDialog from './ReservationDialog';
import { supabase } from "@/integrations/supabase/client";

const PropertyCalendar = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data: reservationsData, error } = await supabase
        .from('reservations')
        .select(`
          id,
          property_id,
          client_name,
          client_phone,
          client_notes,
          start_date,
          end_date,
          total_amount,
          payment_methods (
            id,
            type,
            amount,
            payment_date
          )
        `);

      if (error) throw error;

      const formattedReservations: Reservation[] = reservationsData.map(reservation => ({
        id: reservation.id,
        propertyId: reservation.property_id,
        client: {
          name: reservation.client_name,
          phone: reservation.client_phone,
          notes: reservation.client_notes || '',
        },
        startDate: new Date(reservation.start_date),
        endDate: new Date(reservation.end_date),
        totalAmount: parseFloat(reservation.total_amount),
        paymentMethods: reservation.payment_methods.map((pm: any) => ({
          type: pm.type as 'cash' | 'card' | 'bank_transfer',
          amount: parseFloat(pm.amount),
          date: new Date(pm.payment_date),
        })),
      }));

      setReservations(formattedReservations);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas",
        variant: "destructive",
      });
    }
  };

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

    try {
      if (editingReservation) {
        // Update existing reservation
        const { error: reservationError } = await supabase
          .from('reservations')
          .update({
            client_name: client.name,
            client_phone: client.phone,
            client_notes: client.notes,
            start_date: dateRange.from.toISOString(),
            end_date: dateRange.to.toISOString(),
            total_amount: totalAmount,
          })
          .eq('id', editingReservation.id);

        if (reservationError) throw reservationError;

        // Delete existing payment methods
        const { error: deleteError } = await supabase
          .from('payment_methods')
          .delete()
          .eq('reservation_id', editingReservation.id);

        if (deleteError) throw deleteError;

        // Insert new payment methods
        if (paymentMethods.length > 0) {
          const { error: paymentError } = await supabase
            .from('payment_methods')
            .insert(paymentMethods.map(pm => ({
              reservation_id: editingReservation.id,
              type: pm.type,
              amount: pm.amount,
              payment_date: pm.date.toISOString(),
            })));

          if (paymentError) throw paymentError;
        }

        toast({
          title: "Éxito",
          description: "Reserva actualizada correctamente",
        });
      } else {
        // Create new reservation
        const { data: newReservation, error: reservationError } = await supabase
          .from('reservations')
          .insert({
            property_id: selectedProperty.id,
            client_name: client.name,
            client_phone: client.phone,
            client_notes: client.notes,
            start_date: dateRange.from.toISOString(),
            end_date: dateRange.to.toISOString(),
            total_amount: totalAmount,
          })
          .select()
          .single();

        if (reservationError) throw reservationError;

        // Insert payment methods
        if (paymentMethods.length > 0) {
          const { error: paymentError } = await supabase
            .from('payment_methods')
            .insert(paymentMethods.map(pm => ({
              reservation_id: newReservation.id,
              type: pm.type,
              amount: pm.amount,
              payment_date: pm.date.toISOString(),
            })));

          if (paymentError) throw paymentError;
        }

        toast({
          title: "Éxito",
          description: "Reserva creada correctamente",
        });
      }

      // Refresh reservations
      await fetchReservations();
    } catch (error: any) {
      console.error('Error saving reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la reserva",
        variant: "destructive",
      });
    }

    setSelectedDates(undefined);
    setShowClientForm(false);
    setEditingReservation(null);
  };

  const handleDeleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchReservations();
      toast({
        title: "Éxito",
        description: "Reserva eliminada correctamente",
      });
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la reserva",
        variant: "destructive",
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PropertyLegend />
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
