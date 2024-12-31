import { Reservation } from '@/types/types';
import { Card } from '@/components/ui/card';
import { PROPERTIES } from '@/utils/reservationUtils';
import ReservationSummary from './ReservationSummary';
import ReservationDates from './ReservationDates';
import ReservationPaymentSummary from './ReservationPaymentSummary';
import { Button } from '@/components/ui/button';

interface ReservationCardProps {
  reservation: Reservation;
  onEdit: (reservation: Reservation) => void;
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
      className={`w-full bg-white shadow-sm hover:shadow-md transition-all duration-300
                ${isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="p-4 space-y-4">
        <ReservationSummary 
          reservation={reservation}
          propertyName={propertyName}
        />
        
        <ReservationDates
          startDate={reservation.startDate}
          endDate={reservation.endDate}
          onEdit={() => onEdit(reservation)}
        />

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