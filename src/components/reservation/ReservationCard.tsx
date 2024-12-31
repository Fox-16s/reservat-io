import { format } from 'date-fns';
import { Reservation } from '@/types/types';
import { UserInfo } from '@/types/userInfo';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import ReservationHeader from './ReservationHeader';
import ReservationClientInfo from './ReservationClientInfo';
import ReservationPaymentInfo from './ReservationPaymentInfo';
import ReservationActions from '../ReservationActions';
import { PROPERTIES } from '@/utils/reservationUtils';

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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const property = PROPERTIES.find(p => p.id === reservation.propertyId);

  return (
    <Card 
      id={`reservation-${reservation.id}`}
      className={`p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                hover:shadow-md transition-all duration-300 ease-in-out
                border border-gray-100/50 dark:border-gray-700/50 
                hover:border-primary/30 dark:hover:border-primary/30
                hover:scale-[1.01] transform
                ${isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="flex items-start gap-4">
        <Checkbox
          id={`checkbox-${reservation.id}`}
          onCheckedChange={() => onSelect(reservation.id)}
          className="mt-1 h-3 w-3 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        
        <div className="flex-1 space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${property?.color}`} />
                <span className="font-medium text-sm dark:text-gray-200">
                  {property?.name}
                </span>
              </div>
              <ReservationHeader
                userName={userInfo?.name}
                createdAt={userInfo?.createdAt}
                formatCreatedAt={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm')}
              />
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(reservation.totalAmount)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {format(reservation.startDate, 'dd MMM yy')} - {format(reservation.endDate, 'dd MMM yy')}
              </p>
            </div>
          </div>

          {/* Client Info Section */}
          <ReservationClientInfo client={reservation.client} />

          {/* Payment Info Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detalles de Pago
            </h4>
            <ReservationPaymentInfo
              paymentMethods={reservation.paymentMethods}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Actions Section */}
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