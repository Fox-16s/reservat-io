import { PaymentMethod } from '@/types/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Building2, DollarSign } from 'lucide-react';

interface ReservationPaymentInfoProps {
  paymentMethods: PaymentMethod[];
  formatCurrency: (amount: number) => string;
}

const ReservationPaymentInfo = ({ paymentMethods, formatCurrency }: ReservationPaymentInfoProps) => {
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4 text-gray-500" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-gray-500" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="h-4 w-4 text-gray-500" />
        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
          Métodos de Pago
        </span>
      </div>
      {paymentMethods.map((payment, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50"
        >
          <div className="flex items-center gap-2">
            {getPaymentMethodIcon(payment.type)}
            <span className="text-[10px] text-gray-700 dark:text-gray-300">
              {formatCurrency(payment.amount)}
            </span>
          </div>
          <span className="text-[9px] text-gray-500 dark:text-gray-400">
            {format(payment.date, 'dd/MM/yyyy')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ReservationPaymentInfo;