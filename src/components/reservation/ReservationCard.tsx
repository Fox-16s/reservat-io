import { Reservation } from '../../types/types';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { format } from 'date-fns';
import { Card } from '../ui/card';
import { PROPERTIES } from '../../utils/reservationUtils';
import { Separator } from '../ui/separator';
import { MessageSquare, Trash2 } from 'lucide-react';

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
  formatCreatedAt,
  formatCurrency,
  handleWhatsAppClick,
}: ReservationCardProps) => {
  const property = PROPERTIES.find(p => p.id === reservation.propertyId);
  
  const formatDate = (date: Date) => {
    return format(new Date(date), 'dd/MM/yyyy');
  };

  return (
    <Card className="p-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                    hover:shadow-md transition-all duration-300 ease-in-out
                    border border-gray-100/50 dark:border-gray-700/50 
                    hover:border-primary/30 dark:hover:border-primary/30
                    hover:scale-[1.01] transform w-full">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id={`reservation-${reservation.id}`}
              onCheckedChange={() => onSelect(reservation.id)}
              className="h-4 w-4"
            />
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${property?.color}`} />
                <span className="font-medium text-sm dark:text-gray-200">
                  {property?.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Created by: {userInfo.name || 'Unknown'} on {formatCreatedAt(userInfo.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-2">
          <h3 className="font-medium text-sm">{reservation.client.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {reservation.client.phone}
          </p>
          {reservation.client.notes && (
            <p className="text-sm text-gray-500 italic">
              {reservation.client.notes}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Check-in:</span> {formatDate(reservation.startDate)}
          </p>
          <p>
            <span className="font-medium">Check-out:</span> {formatDate(reservation.endDate)}
          </p>
        </div>

        <Separator />

        {/* Payment Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Payment Details</h4>
          <p className="text-sm">
            <span className="font-medium">Total Amount:</span>{' '}
            {formatCurrency(reservation.totalAmount)}
          </p>
          <div className="space-y-1">
            {reservation.paymentMethods.map((payment, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                {payment.type}: {formatCurrency(payment.amount)}
                {payment.date && ` - ${format(new Date(payment.date), 'dd/MM/yyyy')}`}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleWhatsAppClick(reservation.client.phone)}
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(reservation)}
            className="dark:border-gray-600 dark:text-gray-300"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(reservation.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-800"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReservationCard;