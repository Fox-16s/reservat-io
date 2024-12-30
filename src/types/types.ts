export interface Client {
  name: string;
  phone: string;
  notes?: string;
}

export interface Property {
  id: string;
  name: string;
  color: string;
}

export interface PaymentMethod {
  type: 'cash' | 'card' | 'bank_transfer';
  amount: number;
  date: Date; // Added payment date
}

export interface Reservation {
  id: string;
  propertyId: string;
  client: Client;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  paymentMethods: PaymentMethod[];
}

export type DateRange = {
  from: Date;
  to: Date;
};