import { useState, useEffect } from 'react';
import { Client, PaymentMethod } from '../types/types';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import ReservationFormStepOne from './reservation/form/ReservationFormStepOne';
import ReservationFormStepTwo from './reservation/form/ReservationFormStepTwo';

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
      onSubmit(client, dateRange!, 0, []);
      return;
    }

    setStep(2);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      {step === 1 ? (
        <ReservationFormStepOne
          client={client}
          setClient={setClient}
          dateRange={dateRange}
          setDateRange={setDateRange}
          onCancel={onCancel}
          onNext={handleNextStep}
          isEditing={isEditing}
        />
      ) : (
        <ReservationFormStepTwo
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </form>
  );
};

export default ReservationForm;