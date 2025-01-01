import { useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import PropertyCalendarCard from './PropertyCalendarCard';
import ReservationList from './ReservationList';
import ReservationDialog from './ReservationDialog';
import { Reservation } from '../types/types';
import { DateRange } from 'react-day-picker';
import MonthlyPaymentsCard from './MonthlyPaymentsCard';

const PropertyCalendar = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const { reservations, createReservation, updateReservation, deleteReservation } = useReservations();

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
  };

  const handleDelete = async (id: string) => {
    await deleteReservation(id);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PropertyCalendarCard
            reservations={reservations}
            onEdit={handleEdit}
          />
        </div>
        <div className="space-y-4">
          <MonthlyPaymentsCard reservations={reservations} />
          <ReservationList
            reservations={reservations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <ReservationDialog
        reservation={selectedReservation}
        onClose={() => setSelectedReservation(null)}
        onSave={async (propertyId, client, dateRange: DateRange, totalAmount, paymentMethods) => {
          if (selectedReservation) {
            await updateReservation(
              selectedReservation.id,
              client,
              dateRange,
              totalAmount,
              paymentMethods
            );
          } else {
            await createReservation(
              propertyId,
              client,
              dateRange,
              totalAmount,
              paymentMethods
            );
          }
          setSelectedReservation(null);
        }}
      />
    </div>
  );
};

export default PropertyCalendar;