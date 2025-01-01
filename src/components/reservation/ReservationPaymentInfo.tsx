import { PaymentMethod } from '@/types/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Building2, Pencil } from 'lucide-react';
import { Button } from '../ui/button';

interface ReservationPaymentInfoProps {
  paymentMethods: PaymentMethod[];
  formatCurrency: (amount: number) => string;
  totalAmount: number;
  onEditPayment?: (payment: PaymentMethod) => void;
}

const ReservationPaymentInfo = ({ 
  paymentMethods, 
  formatCurrency,
  totalAmount,
  onEditPayment 
}: ReservationPaymentInfoProps) => {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'card':
        return 'Tarjeta';
      case 'bank_transfer':
        return 'Transferencia';
      default:
        return method;
    }
  };

  const paidAmount = paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-600 dark:text-gray-400">Total:</span>
          <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-600 dark:text-gray-400">Pagado:</span>
          <span className="text-[11px] font-medium text-green-600 dark:text-green-400">
            {formatCurrency(paidAmount)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-600 dark:text-gray-400">Restante:</span>
          <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400">
            {formatCurrency(remainingAmount)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {paymentMethods.map((payment, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center gap-2">
              {getPaymentMethodIcon(payment.type)}
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                  {formatCurrency(payment.amount)}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  {getPaymentMethodName(payment.type)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                {format(payment.date, 'dd/MM/yyyy')}
              </span>
              {onEditPayment && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onEditPayment(payment)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationPaymentInfo;