import { Button } from "@/components/ui/button";
import PaymentDetailsCard from '../PaymentDetailsCard';

interface ReservationFormStepTwoProps {
  onBack: () => void;
  onSubmit: () => void;
}

const ReservationFormStepTwo = ({ onBack, onSubmit }: ReservationFormStepTwoProps) => {
  return (
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
          onClick={onBack}
          className="text-sm"
          tabIndex={8}
        >
          Atrás
        </Button>
        <Button
          type="submit"
          onClick={onSubmit}
          className="text-sm bg-indigo-600 hover:bg-indigo-700"
          tabIndex={9}
        >
          Confirmar
        </Button>
      </div>
    </>
  );
};

export default ReservationFormStepTwo;