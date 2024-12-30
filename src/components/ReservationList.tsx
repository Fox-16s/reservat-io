import { Reservation } from '../types/types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { PROPERTIES } from '../utils/reservationUtils';
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
import { useState } from 'react';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

const ReservationList = ({ reservations, onDelete, onEdit }: ReservationListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  
  const sortedReservations = [...reservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  const getPropertyName = (propertyId: string) => {
    return PROPERTIES.find(p => p.id === propertyId)?.name || '';
  };

  const getPropertyColor = (propertyId: string) => {
    return PROPERTIES.find(p => p.id === propertyId)?.color || '';
  };

  const handleDeleteConfirm = () => {
    if (selectedReservation) {
      onDelete(selectedReservation);
      setSelectedReservation(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700">Lista de Reservas</h3>
      <div className="space-y-2">
        {sortedReservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm"
          >
            <Checkbox
              id={`reservation-${reservation.id}`}
              onCheckedChange={() => setSelectedReservation(reservation.id)}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getPropertyColor(reservation.propertyId)}`} />
                <span className="font-medium">{getPropertyName(reservation.propertyId)}</span>
              </div>
              <p className="text-sm text-gray-600">
                {format(reservation.startDate, 'dd/MM/yyyy')} - {format(reservation.endDate, 'dd/MM/yyyy')}
              </p>
              <p className="text-sm">
                <span className="font-medium">Cliente:</span> {reservation.client.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Teléfono:</span> {reservation.client.phone}
              </p>
              {reservation.client.notes && (
                <p className="text-sm text-gray-600 italic">
                  {reservation.client.notes}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(reservation)}
              className="ml-auto"
            >
              Editar
            </Button>
          </div>
        ))}
        {sortedReservations.length === 0 && (
          <p className="text-center text-gray-500 py-4">No hay reservas</p>
        )}
      </div>

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
            <AlertDialogAction onClick={handleDeleteConfirm} className="flex flex-col items-center">
              <span>Eliminar</span>
              <span className="text-xs">eliminar</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReservationList;