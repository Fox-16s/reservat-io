import { useState, useEffect } from 'react';
import { Reservation, Client, PaymentMethod } from '../types/types';
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchReservationsFromDB,
  createReservationInDB,
  updateReservationInDB,
  deleteReservationFromDB
} from '../services/reservationService';
import type { ReservationHookReturn } from '../types/reservationTypes';

export const useReservations = (): ReservationHookReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { toast } = useToast();

  const fetchReservations = async () => {
    try {
      const reservationsData = await fetchReservationsFromDB();
      setReservations(reservationsData);
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas",
        variant: "destructive",
      });
    }
  };

  const createReservation = async (
    propertyId: string,
    client: Client,
    dateRange: DateRange,
    totalAmount: number,
    paymentMethods: PaymentMethod[]
  ) => {
    try {
      const success = await createReservationInDB(
        propertyId,
        client,
        dateRange,
        totalAmount,
        paymentMethods
      );
      if (success) {
        await fetchReservations();
      }
      return success;
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
      const success = await updateReservationInDB(
        reservationId,
        client,
        dateRange,
        totalAmount,
        paymentMethods
      );
      if (success) {
        await fetchReservations();
      }
      return success;
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
      const success = await deleteReservationFromDB(id);
      if (success) {
        await fetchReservations();
      }
      return success;
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

  useEffect(() => {
    fetchReservations();
  }, []);

  return {
    reservations,
    createReservation,
    updateReservation,
    deleteReservation,
  };
};