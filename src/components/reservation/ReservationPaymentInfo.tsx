import { PaymentMethod } from '@/types/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Building2, Pencil, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReservationPaymentInfoProps {
  paymentMethods: PaymentMethod[];
  formatCurrency: (amount: number) => string;
  totalAmount: number;
  reservationId: string;
  onPaymentAdded: () => void;
}

const ReservationPaymentInfo = ({ 
  paymentMethods, 
  formatCurrency,
  totalAmount,
  reservationId,
  onPaymentAdded
}: ReservationPaymentInfoProps) => {
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'bank_transfer'>('cash');
  const [amount, setAmount] = useState('');
  const { toast } = useToast();

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

  const handleAddPayment = async () => {
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
          type: paymentType,
          amount: numAmount,
          payment_date: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Pago agregado correctamente",
      });

      setIsAddingPayment(false);
      setAmount('');
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
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {format(payment.date, 'dd/MM/yyyy')}
            </span>
          </div>
        ))}

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
            <div className="space-y-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="space-y-1">
                <Label className="text-[10px]">Tipo de Pago</Label>
                <Select
                  value={paymentType}
                  onValueChange={(value: 'cash' | 'card' | 'bank_transfer') => setPaymentType(value)}
                >
                  <SelectTrigger className="h-8 text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="bank_transfer">Transferencia</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px]">Monto</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-8 text-[10px]"
                  placeholder="Ingrese el monto"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[10px]"
                  onClick={() => setIsAddingPayment(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-[10px]"
                  onClick={handleAddPayment}
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationPaymentInfo;