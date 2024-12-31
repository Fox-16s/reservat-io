import { useState } from 'react';
import { Reservation } from '../types/types';
import { PROPERTIES } from '@/utils/reservationUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ReservationCard from './reservation/ReservationCard';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

const ReservationList = ({ reservations, onDelete, onEdit }: ReservationListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);

  const handleWhatsAppClick = (phone: string) => {
    const message = encodeURIComponent('¡Hola! Te escribo por la reserva...');
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleDeleteConfirm = () => {
    if (selectedReservation) {
      onDelete(selectedReservation);
      setSelectedReservation(null);
    }
  };

  const groupedReservations = PROPERTIES.map(property => ({
    property,
    reservations: reservations
      .filter(r => r.propertyId === property.id)
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  }));

  return (
    <div className="space-y-8">
      {groupedReservations.map(({ property, reservations }) => (
        <div key={property.id} className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${property.color}`} />
            <span>{property.name}</span>
          </h3>
          <div className="grid gap-4">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onEdit={onEdit}
                onWhatsAppClick={handleWhatsAppClick}
              />
            ))}
            {reservations.length === 0 && (
              <p className="text-sm text-gray-500">No hay reservas para esta propiedad</p>
            )}
          </div>
        </div>
      ))}

      <AlertDialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReservationList;