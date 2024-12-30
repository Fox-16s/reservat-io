import { format } from 'date-fns';
import { Reservation } from '@/types/types';
import { UserInfo } from '@/types/userInfo';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import ReservationHeader from './ReservationHeader';
import ReservationClientInfo from './ReservationClientInfo';
import ReservationPaymentInfo from './ReservationPaymentInfo';
import ReservationActions from './ReservationActions';
import { PROPERTIES } from '@/utils/reservationUtils';

interface ReservationCardProps {
  reservation: Reservation;
  userInfo?: UserInfo;
  onSelect: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  onWhatsAppClick: (phone: string) => void;
  isHighlighted?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

const ReservationCard = ({ 
  reservation, 
  userInfo, 
  onSelect, 
  onEdit, 
  onDelete,
  onWhatsAppClick,
  isHighlighted,
  ref
}: ReservationCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <Card 
      ref={ref}
      className={`p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                hover:shadow-md transition-all duration-300 ease-in-out
                border border-gray-100/50 dark:border-gray-700/50 
                hover:border-primary/30 dark:hover:border-primary/30
                hover:scale-[1.01] transform
                ${isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
    >
      <div className="flex justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-start gap-1.5">
            <div className="flex items-center h-full">
              <Checkbox
                id={`reservation-${reservation.id}`}
                onCheckedChange={() => onSelect(reservation.id)}
                className="h-3 w-3 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${PROPERTIES.find(p => p.id === reservation.propertyId)?.color}`} />
                  <span className="font-medium text-[10px] dark:text-gray-200">
                    {PROPERTIES.find(p => p.id === reservation.propertyId)?.name}
                  </span>
                </div>
              </div>

              <ReservationHeader
                userName={userInfo?.name}
                createdAt={userInfo?.createdAt}
                formatCreatedAt={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm')}
              />

              <ReservationClientInfo client={reservation.client} />

              <div>
                <p className="text-[10px] text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fechas:</span> {format(reservation.startDate, 'dd/MM/yyyy')} - {format(reservation.endDate, 'dd/MM/yyyy')}
                </p>
              </div>

              <ReservationActions
                phone={reservation.client.phone}
                onEdit={() => onEdit(reservation)}
                onDelete={() => onDelete(reservation.id)}
                onWhatsAppClick={onWhatsAppClick}
              />
            </div>
          </div>
        </div>

        <div className="w-64 border-l dark:border-gray-700 pl-4 space-y-1">
          <h4 className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Detalles de Pago</h4>
          <p className="text-[11px] font-medium text-green-600 dark:text-green-400">
            Total: {formatCurrency(reservation.totalAmount)}
          </p>
          <ReservationPaymentInfo
            paymentMethods={reservation.paymentMethods}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;