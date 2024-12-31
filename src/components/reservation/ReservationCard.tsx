import { Reservation } from '@/types/types';
import { UserInfo } from '@/types/userInfo';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { PROPERTIES } from '@/utils/reservationUtils';
import CardHeader from './CardHeader';
import CardClientInfo from './CardClientInfo';
import CardPaymentInfo from './CardPaymentInfo';
import ReservationActions from '../ReservationActions';

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
  userInfo, 
  onSelect, 
  onEdit, 
  onDelete,
  onWhatsAppClick,
  isHighlighted
}: ReservationCardProps) => {
  const property = PROPERTIES.find(p => p.id === reservation.propertyId);

  return (
    <Card 
      id={`reservation-${reservation.id}`}
      className={`p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                hover:shadow-md transition-all duration-300 ease-in-out
                border border-gray-100/50 dark:border-gray-700/50 
                hover:border-primary/30 dark:hover:border-primary/30
                hover:scale-[1.005] transform max-w-md
                ${isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          id={`checkbox-${reservation.id}`}
          onCheckedChange={() => onSelect(reservation.id)}
          className="mt-1 h-3 w-3 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        
        <div className="flex-1 space-y-3">
          <CardHeader
            property={property}
            totalAmount={reservation.totalAmount}
            startDate={reservation.startDate}
            endDate={reservation.endDate}
            userInfo={userInfo}
          />
          
          <CardClientInfo client={reservation.client} />
          
          <CardPaymentInfo paymentMethods={reservation.paymentMethods} />
          
          <ReservationActions
            phone={reservation.client.phone}
            onEdit={() => onEdit(reservation)}
            onDelete={() => onDelete(reservation.id)}
            onWhatsAppClick={onWhatsAppClick}
          />
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;