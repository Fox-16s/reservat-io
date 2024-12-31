import { format } from 'date-fns';
import { MapPin, Mail, Phone } from 'lucide-react';
import { PROPERTIES } from '@/utils/reservationUtils';
import { Reservation } from '@/types/types';

interface ReservationSummaryProps {
  reservation: Reservation;
  propertyName: string;
}

const ReservationSummary = ({ reservation, propertyName }: ReservationSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{propertyName}</h3>
        <div className="flex items-center text-sm text-gray-500">
          ★★★★★
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Ubicación</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{reservation.client.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{reservation.client.phone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary;