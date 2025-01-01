import { PaymentMethod } from '@/types/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Building2 } from 'lucide-react';

interface PaymentListProps {
  payments: PaymentMethod[];
  formatCurrency: (amount: number) => string;
}

const PaymentList = ({ payments, formatCurrency }: PaymentListProps) => {
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

  return (
    <div className="space-y-2">
      {payments.map((payment, index) => (
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
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            {format(payment.date, 'dd/MM/yyyy')}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PaymentList;