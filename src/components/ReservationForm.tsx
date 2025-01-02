import { useState, useEffect } from 'react';
import { Client, PaymentMethod } from '../types/types';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import ClientDetailsCard from './reservation/ClientDetailsCard';
import DateSelectionCard from './reservation/DateSelectionCard';
import PaymentDetailsCard from './reservation/PaymentDetailsCard';

interface ReservationFormProps {
  onSubmit: (client: Client, dateRange: DateRange, totalAmount: number, paymentMethods: PaymentMethod[]) => void;
  onCancel: () => void;
  initialDateRange?: DateRange;
  initialData?: Client;
  isEditing?: boolean;
}

const ReservationForm = ({ 
  onSubmit, 
  onCancel, 
  initialDateRange, 
  initialData,
  isEditing = false 
}: ReservationFormProps) => {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<Client>({ name: '', phone: '', notes: '' });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: string }>({
    cash: '',
    card: '',
    bank_transfer: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setClient(initialData);
    }
  }, [initialData]);

  const handlePaymentMethodChange = (method: 'cash' | 'card' | 'bank_transfer', amount: string) => {
    setPaymentAmounts(prev => ({ ...prev, [method]: amount }));
    
    const numAmount = parseFloat(amount) || 0;
    const updatedMethods = paymentMethods.filter(p => p.type !== method);
    
    if (numAmount > 0) {
      updatedMethods.push({ 
        type: method, 
        amount: numAmount,
        date: new Date()
      });
    }
    
    setPaymentMethods(updatedMethods);
  };

  const handleNextStep = () => {
    if (!client.name || !client.phone) {
      toast({
        title: "Error",
        description: "Por favor complete nombre y teléfono",
        variant: "destructive",
      });
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Error",
        description: "Por favor seleccione un rango de fechas",
        variant: "destructive",
      });
      return;
    }
    if (!isEditing) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (isEditing) {
      // When editing, just submit with the existing data
      onSubmit(client, dateRange, 0, []);
      return;
    }

    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingrese un monto total válido",
        variant: "destructive",
      });
      return;
    }
    const total = parseFloat(totalAmount);
    const paymentsTotal = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    
    if (paymentsTotal > total) {
      toast({
        title: "Error",
        description: "La suma de los pagos no puede ser mayor al monto total",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(client, dateRange, total, paymentMethods);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      {step === 1 ? (
        <>
          <ClientDetailsCard client={client} setClient={setClient} />
          <DateSelectionCard dateRange={dateRange} setDateRange={setDateRange} />
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="text-sm"
              tabIndex={8}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleNextStep}
              className="text-sm bg-indigo-600 hover:bg-indigo-700"
              tabIndex={9}
            >
              {isEditing ? 'Confirmar' : 'Siguiente'}
            </Button>
          </div>
        </>
      ) : (
        <>
          <PaymentDetailsCard
            totalAmount={totalAmount}
            setTotalAmount={setTotalAmount}
            paymentAmounts={paymentAmounts}
            onPaymentMethodChange={handlePaymentMethodChange}
          />
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="text-sm"
              tabIndex={8}
            >
              Atrás
            </Button>
            <Button
              type="submit"
              className="text-sm bg-indigo-600 hover:bg-indigo-700"
              tabIndex={9}
            >
              Confirmar
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default ReservationForm;