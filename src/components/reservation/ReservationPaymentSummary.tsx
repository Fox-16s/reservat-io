import { PaymentMethod } from '@/types/types';

interface ReservationPaymentSummaryProps {
  totalAmount: number;
  paymentMethods: PaymentMethod[];
}

const ReservationPaymentSummary = ({ totalAmount, paymentMethods }: ReservationPaymentSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Resumen de pago</h4>
      <div className="space-y-2">
        {paymentMethods.map((payment, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">{payment.type}</span>
            <span className="font-medium">{formatCurrency(payment.amount)}</span>
          </div>
        ))}
        <div className="pt-2 border-t flex justify-between text-sm">
          <span className="font-medium">Total</span>
          <span className="font-medium">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReservationPaymentSummary;