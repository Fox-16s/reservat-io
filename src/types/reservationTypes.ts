import { Reservation, Client, PaymentMethod } from './types';
import { DateRange } from "react-day-picker";

export interface ReservationHookReturn {
  reservations: Reservation[];
  createReservation: (
    propertyId: string,
    client: Client,
    dateRange: DateRange,
    totalAmount: number,
    paymentMethods: PaymentMethod[]
  ) => Promise<boolean>;
  updateReservation: (
    reservationId: string,
    client: Client,
    dateRange: DateRange,
    totalAmount: number,
    paymentMethods: PaymentMethod[]
  ) => Promise<boolean>;
  deleteReservation: (id: string) => Promise<boolean>;
}