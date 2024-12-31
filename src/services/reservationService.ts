import { supabase } from "@/integrations/supabase/client";
import { Reservation, Client, PaymentMethod } from '../types/types';
import { DateRange } from "react-day-picker";

export const fetchReservationsFromDB = async () => {
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

  return reservationsData.map(reservation => ({
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
      id: pm.id,
      type: pm.type as 'cash' | 'card' | 'bank_transfer',
      amount: parseFloat(pm.amount.toString()),
      date: new Date(pm.payment_date),
    })),
  }));
};

export const createReservationInDB = async (
  propertyId: string,
  client: Client,
  dateRange: DateRange,
  totalAmount: number,
  paymentMethods: PaymentMethod[]
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !dateRange.from || !dateRange.to) return false;

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
};

export const updateReservationInDB = async (
  reservationId: string,
  client: Client,
  dateRange: DateRange,
  totalAmount: number,
  paymentMethods: PaymentMethod[]
) => {
  if (!dateRange.from || !dateRange.to) return false;

  // First, update the reservation details
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
    .eq('id', reservationId);

  if (reservationError) throw reservationError;

  // Get existing payment methods
  const { data: existingPayments, error: fetchError } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('reservation_id', reservationId);

  if (fetchError) throw fetchError;

  // Insert new payment methods
  const newPayments = paymentMethods.filter(pm => !pm.id);
  if (newPayments.length > 0) {
    const { error: insertError } = await supabase
      .from('payment_methods')
      .insert(newPayments.map(pm => ({
        reservation_id: reservationId,
        type: pm.type,
        amount: pm.amount,
        payment_date: pm.date.toISOString(),
      })));

    if (insertError) throw insertError;
  }

  // Update existing payment methods
  const existingPaymentUpdates = paymentMethods
    .filter(pm => pm.id)
    .map(pm => ({
      id: pm.id,
      type: pm.type,
      amount: pm.amount,
      payment_date: pm.date.toISOString(),
    }));

  for (const payment of existingPaymentUpdates) {
    const { error: updateError } = await supabase
      .from('payment_methods')
      .update(payment)
      .eq('id', payment.id);

    if (updateError) throw updateError;
  }

  return true;
};

export const deleteReservationFromDB = async (id: string) => {
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};