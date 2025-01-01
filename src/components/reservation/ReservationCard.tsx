import { Reservation } from '../../types/types';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { PROPERTIES } from '../../utils/reservationUtils';
import ReservationHeader from './ReservationHeader';
import ReservationClientInfo from './ReservationClientInfo';
import ReservationPaymentInfo from './ReservationPaymentInfo';
import ReservationActions from './ReservationActions';
import { Separator } from '../ui/separator';

interface ReservationCardProps {
  reservation: Reservation;
  userInfo: { name: string | null; createdAt: string };
  onSelect: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onDelete: (id: string) => void;
  onPaymentAdded: () => void;
  formatCreatedAt: (date: string | undefined) => string;
  formatCurrency: (amount: number) => string;
  handleWhatsAppClick: (phone: string) => void;
}

const ReservationCard = ({
  reservation,
  userInfo,
  onSelect,
  onEdit,
  onDelete,
  onPaymentAdded,
  formatCreatedAt,
  formatCurrency,
  handleWhatsAppClick,
}: ReservationCardProps) => {
  return (
    <Card 
      className="p-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                hover:shadow-md transition-all duration-300 ease-in-out
                border border-gray-100/50 dark:border-gray-700/50 
                hover:border-primary/30 dark:hover:border-primary/30
                hover:scale-[1.01] transform w-[300px] mx-auto
                text-xs"
    >
      <div className="flex flex-col gap-1.5">
        <div className="space-y-1">
          <div className="flex items-start gap-1">
            <div className="flex items-center h-full">
              <Checkbox
                id={`reservation-${reservation.id}`}
                onCheckedChange={() => onSelect(reservation.id)}
                className="h-2 w-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className={`w-1 h-1 rounded-full ${PROPERTIES.find(p => p.id === reservation.propertyId)?.color}`} />
                  <span className="font-medium text-[8px] dark:text-gray-200">
                    {PROPERTIES.find(p => p.id === reservation.propertyId)?.name}
                  </span>
                </div>
              </div>

              <ReservationHeader
                userName={userInfo.name}
                createdAt={userInfo.createdAt}
                formatCreatedAt={formatCreatedAt}
              />

              <ReservationClientInfo client={reservation.client} />

              <div>
                <p className="text-[8px] text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Fechas:</span> {format(reservation.startDate, 'dd/MM/yyyy')} - {format(reservation.endDate, 'dd/MM/yyyy')}
                </p>
              </div>

              <ReservationActions
                phone={reservation.client.phone}
                onEdit={() => onEdit(reservation)}
                onDelete={() => onDelete(reservation.id)}
                onWhatsAppClick={handleWhatsAppClick}
              />
            </div>
          </div>
        </div>

        <Separator className="my-1" />

        <div className="space-y-0.5">
          <h4 className="text-[8px] font-medium text-gray-700 dark:text-gray-300">Detalles de Pago</h4>
          <ReservationPaymentInfo
            paymentMethods={reservation.paymentMethods}
            formatCurrency={formatCurrency}
            totalAmount={reservation.totalAmount}
            reservationId={reservation.id}
            onPaymentAdded={onPaymentAdded}
          />
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;