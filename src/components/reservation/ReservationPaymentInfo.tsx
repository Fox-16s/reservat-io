import { PaymentMethod } from '@/types/types';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PaymentSummary from './payment/PaymentSummary';
import PaymentList from './payment/PaymentList';
import PaymentForm from './payment/PaymentForm';
import PaymentNotes from './payment/PaymentNotes';

interface ReservationPaymentInfoProps {
  paymentMethods: PaymentMethod[];
  formatCurrency: (amount: number) => string;
  totalAmount: number;
  reservationId: string;
  onPaymentAdded: () => void;
  paymentNotes?: string;
}

const ReservationPaymentInfo = ({ 
  paymentMethods, 
  formatCurrency,
  totalAmount,
  reservationId,
  onPaymentAdded,
  paymentNotes
}: ReservationPaymentInfoProps) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const { toast } = useToast();

  const paidAmount = paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);

  const handleAddPayment = async (type: 'cash' | 'card' | 'bank_transfer', amount: string) => {
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        toast({
          title: "Error",
          description: "Por favor ingrese un monto válido",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('payment_methods')
        .insert({
          reservation_id: reservationId,
          type: type,
          amount: numAmount,
          payment_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Pago agregado correctamente",
      });

      setIsAddingPayment(false);
      
      // Call onPaymentAdded to refresh the data
      onPaymentAdded();
    } catch (error) {
      console.error('Error adding payment:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el pago",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-3">
      <PaymentSummary totalAmount={totalAmount} paidAmount={paidAmount} />

      <div className="space-y-2">
        <PaymentList payments={paymentMethods} formatCurrency={formatCurrency} />

        <div>
          {!isAddingPayment ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full text-[10px]"
              onClick={() => setIsAddingPayment(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Agregar Pago
            </Button>
          ) : (
            <PaymentForm
              onSubmit={handleAddPayment}
              onCancel={() => setIsAddingPayment(false)}
            />
          )}
        </div>

        <PaymentNotes 
          reservationId={reservationId}
          initialNotes={paymentNotes}
        />
      </div>
    </div>
  );
};

export default ReservationPaymentInfo;