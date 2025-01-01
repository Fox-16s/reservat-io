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
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setClient(initialData);
    }
  }, [initialData]);

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
      // When editing, submit with 0 amount and empty payment methods to preserve existing ones
      onSubmit(client, dateRange!, 0, []);
      return;
    }

    // Continue with normal flow for new reservations
    setStep(2);
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
            totalAmount={'0'}
            setTotalAmount={() => {}}
            paymentAmounts={{}}
            onPaymentMethodChange={() => {}}
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