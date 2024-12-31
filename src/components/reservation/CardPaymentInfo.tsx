import { PaymentMethod } from '@/types/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Building2 } from 'lucide-react';

interface CardPaymentInfoProps {
  paymentMethods: PaymentMethod[];
  totalAmount: number;
}

const CardPaymentInfo = ({ paymentMethods, totalAmount }: CardPaymentInfoProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

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

  const totalPaid = paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingAmount = totalAmount - totalPaid;

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Detalles de Pago
        </h4>
        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(totalAmount)}
        </p>
      </div>
      <div className="space-y-1">
        {paymentMethods.map((payment, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-1 border-b last:border-0 dark:border-gray-600"
          >
            <div className="flex items-center gap-2">
              <span className="p-1 bg-white dark:bg-gray-800 rounded-md">
                {getPaymentMethodIcon(payment.type)}
              </span>
              <div>
                <p className="text-sm font-medium dark:text-gray-300">
                  {payment.type === 'cash' && 'Efectivo'}
                  {payment.type === 'card' && 'Tarjeta'}
                  {payment.type === 'bank_transfer' && 'Transferencia'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(payment.date, 'dd MMM yy')}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium dark:text-gray-300">
              {formatCurrency(payment.amount)}
            </span>
          </div>
        ))}
        
        <div className="pt-2 border-t dark:border-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium dark:text-gray-300">Total Pagado:</span>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium dark:text-gray-300">Restante:</span>
            <span className={`text-sm font-medium ${remainingAmount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {formatCurrency(remainingAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentInfo;