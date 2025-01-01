import { useState, useEffect } from 'react';
import { Reservation } from '../types/types';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useReservationQueries = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

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
          user_id,
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
        userId: reservation.user_id,
        client: {
          name: reservation.client_name,
          phone: reservation.client_phone,
          notes: reservation.client_notes || '',
        },
        startDate: new Date(reservation.start_date),
        endDate: new Date(reservation.end_date),
        totalAmount: parseFloat(reservation.total_amount.toString()),
        paymentMethods: reservation.payment_methods.map((pm: any) => ({
          type: pm.type as 'cash' | 'card' | 'bank_transfer',
          amount: parseFloat(pm.amount.toString()),
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

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    fetchReservations,
  };
};