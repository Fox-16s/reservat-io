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

export interface Reservation {
  id: string;
  propertyId: string;
  client: Client;
  startDate: Date;
  endDate: Date;
}

export type DateRange = {
  from: Date;
  to: Date;
};
