import { formatCurrency } from '@/utils/reservationUtils';

interface PaymentSummaryProps {
  totalAmount: number;
  paidAmount: number;
}

const PaymentSummary = ({ totalAmount, paidAmount }: PaymentSummaryProps) => {
  const remainingAmount = totalAmount - paidAmount;

  return (
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
  );
};

export default PaymentSummary;