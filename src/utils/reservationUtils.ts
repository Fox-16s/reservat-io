import { Property, Reservation } from '../types/types';

export const PROPERTIES: Property[] = [
  { id: '1', name: 'Beach House', color: 'bg-[#E5DEFF]' },
  { id: '2', name: 'Mountain Cabin', color: 'bg-[#F2FCE2]' },
  { id: '3', name: 'City Apartment', color: 'bg-[#FEC6A1]' },
  { id: '4', name: 'Lake House', color: 'bg-[#D3E4FD]' },
];

export const isDateRangeAvailable = (
  startDate: Date,
  endDate: Date,
  propertyId: string,
  reservations: Reservation[]
): boolean => {
  return !reservations.some((reservation) => {
    if (reservation.propertyId !== propertyId) return false;
    return (
      (startDate >= reservation.startDate && startDate <= reservation.endDate) ||
      (endDate >= reservation.startDate && endDate <= reservation.endDate) ||
      (startDate <= reservation.startDate && endDate >= reservation.endDate)
    );
  });
};