import { PaymentMethod } from '@/types/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Building2 } from 'lucide-react';

interface ReservationPaymentInfoProps {
  paymentMethods: PaymentMethod[];
  formatCurrency: (amount: number) => string;
}

const ReservationPaymentInfo = ({ paymentMethods, formatCurrency }: ReservationPaymentInfoProps) => {
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

  return (
    <div className="space-y-2">
      {paymentMethods.map((payment, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
          <div className="flex items-center gap-2">
            {getPaymentMethodIcon(payment.type)}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {formatCurrency(payment.amount)}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(payment.date, 'dd/MM/yyyy')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ReservationPaymentInfo;