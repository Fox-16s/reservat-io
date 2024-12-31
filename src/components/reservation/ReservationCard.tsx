import { Reservation } from '@/types/types';
import { UserInfo } from '@/types/userInfo';
import { Card } from '../ui/card';
import { PROPERTIES } from '@/utils/reservationUtils';
import ReservationSummary from './ReservationSummary';
import ReservationDates from './ReservationDates';
import ReservationPaymentSummary from './ReservationPaymentSummary';
import { Button } from '../ui/button';

interface ReservationCardProps {
  reservation: Reservation;
  userInfo?: UserInfo;
  onSelect: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  onWhatsAppClick: (phone: string) => void;
  isHighlighted?: boolean;
}

const ReservationCard = ({ 
  reservation, 
  onEdit, 
  onWhatsAppClick,
  isHighlighted
}: ReservationCardProps) => {
  const property = PROPERTIES.find(p => p.id === reservation.propertyId);
  const propertyName = property?.name || 'Propiedad';

  return (
    <Card 
      id={`reservation-${reservation.id}`}
      className={`max-w-md mx-auto bg-white shadow-sm hover:shadow-md transition-all duration-300
                ${isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="p-4 space-y-6">
        <ReservationSummary 
          reservation={reservation}
          propertyName={propertyName}
        />
        
        <ReservationDates
          startDate={reservation.startDate}
          endDate={reservation.endDate}
          onEdit={() => onEdit(reservation)}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Habitación estándar</span>
            <span className="font-medium">
              {new Intl.NumberFormat('es-AR', {
                style: 'currency',
                currency: 'ARS'
              }).format(reservation.totalAmount)}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onEdit(reservation)}
          >
            Modificar
          </Button>
        </div>

        <ReservationPaymentSummary
          totalAmount={reservation.totalAmount}
          paymentMethods={reservation.paymentMethods}
        />

        <div className="pt-4 border-t">
          <Button 
            className="w-full"
            onClick={() => onWhatsAppClick(reservation.client.phone)}
          >
            Contactar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;