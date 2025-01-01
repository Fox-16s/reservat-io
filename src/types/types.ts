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
  id?: string;
  type: 'cash' | 'card' | 'bank_transfer';
  amount: number;
  date: Date;
}

export interface Reservation {
  id: string;
  propertyId: string;
  userId: string;
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