export interface Property {
  id: string;
  name: string;
  color: string;
}

export interface Client {
  name: string;
  phone: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  client: Client;
  startDate: Date;
  endDate: Date;
}