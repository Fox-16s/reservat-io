import { Reservation, Property } from '../types/types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { PROPERTIES } from '../utils/reservationUtils';
import { toast } from './ui/use-toast';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

const ReservationList = ({ reservations, onDelete, onEdit }: ReservationListProps) => {
  const sortedReservations = [...reservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  const getPropertyName = (propertyId: string) => {
    return PROPERTIES.find(p => p.id === propertyId)?.name || '';
  };

  const getPropertyColor = (propertyId: string) => {
    return PROPERTIES.find(p => p.id === propertyId)?.color || '';
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
              onCheckedChange={() => onDelete(reservation.id)}
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
    </div>
  );
};

export default ReservationList;