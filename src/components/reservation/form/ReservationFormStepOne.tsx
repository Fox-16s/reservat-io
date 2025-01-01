import { Client } from '@/types/types';
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import ClientDetailsCard from '../ClientDetailsCard';
import DateSelectionCard from '../DateSelectionCard';

interface ReservationFormStepOneProps {
  client: Client;
  setClient: (client: Client) => void;
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  onCancel: () => void;
  onNext: () => void;
  isEditing: boolean;
}

const ReservationFormStepOne = ({
  client,
  setClient,
  dateRange,
  setDateRange,
  onCancel,
  onNext,
  isEditing
}: ReservationFormStepOneProps) => {
  return (
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
          onClick={onNext}
          className="text-sm bg-indigo-600 hover:bg-indigo-700"
          tabIndex={9}
        >
          {isEditing ? 'Confirmar' : 'Siguiente'}
        </Button>
      </div>
    </>
  );
};

export default ReservationFormStepOne;