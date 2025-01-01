import { supabase } from "@/integrations/supabase/client";
import { Client, PaymentMethod } from '../types/types';
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";

export const useReservationMutations = () => {
  const { toast } = useToast();

  const createReservation = async (
    propertyId: string,
    client: Client,
    dateRange: DateRange,
    totalAmount: number,
    paymentMethods: PaymentMethod[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      if (!dateRange.from || !dateRange.to) return;

      const { data: newReservation, error: reservationError } = await supabase
        .from('reservations')
        .insert({
          property_id: propertyId,
          client_name: client.name,
          client_phone: client.phone,
          client_notes: client.notes,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          total_amount: totalAmount,
          user_id: user.id
        })
        .select()
        .single();

      if (reservationError) throw reservationError;

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

      return true;
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la reserva",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateReservation = async (
    reservationId: string,
    client: Client,
    dateRange: DateRange,
    totalAmount: number,
    paymentMethods: PaymentMethod[]
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      if (!dateRange.from || !dateRange.to) return;

      const { error: reservationError } = await supabase
        .from('reservations')
        .update({
          client_name: client.name,
          client_phone: client.phone,
          client_notes: client.notes,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
        })
        .eq('id', reservationId);

      if (reservationError) throw reservationError;

      return true;
    } catch (error: any) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la reserva",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la reserva",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    createReservation,
    updateReservation,
    deleteReservation,
  };
};