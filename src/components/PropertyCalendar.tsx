import { useState } from 'react';
import { useReservations } from '../hooks/useReservations';
import PropertyCalendarCard from './PropertyCalendarCard';
import ReservationList from './ReservationList';
import ReservationDialog from './ReservationDialog';
import { Reservation } from '../types/types';
import { DateRange } from 'react-day-picker';
import MonthlyPaymentsCard from './MonthlyPaymentsCard';
import { PROPERTIES } from '../utils/reservationUtils';

const PropertyCalendar = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
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
            property={PROPERTIES[0]} // Default to first property
            reservations={reservations}
            onSelect={setSelectedDates}
            selectedDates={selectedDates}
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
        open={!!selectedReservation}
        onOpenChange={(open) => {
          if (!open) setSelectedReservation(null);
        }}
        onSubmit={async (client, dateRange, totalAmount, paymentMethods) => {
          if (selectedReservation) {
            await updateReservation(
              selectedReservation.id,
              client,
              dateRange,
              totalAmount,
              paymentMethods
            );
          } else if (dateRange.from && dateRange.to) {
            await createReservation(
              PROPERTIES[0].id, // Default to first property
              client,
              dateRange,
              totalAmount,
              paymentMethods
            );
          }
          setSelectedReservation(null);
        }}
        selectedDates={selectedDates}
        editingReservation={selectedReservation}
        onCancel={() => setSelectedReservation(null)}
      />
    </div>
  );
};

export default PropertyCalendar;