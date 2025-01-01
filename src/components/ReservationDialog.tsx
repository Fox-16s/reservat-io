import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Reservation, Client } from '../types/types';
import ReservationForm from './ReservationForm';
import { DateRange } from "react-day-picker";

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (client: Client, dateRange: DateRange, totalAmount: number, paymentMethods: any[]) => void;
  selectedDates?: DateRange;
  editingReservation: Reservation | null;
  onCancel: () => void;
}

const ReservationDialog = ({
  open,
  onOpenChange,
  onSubmit,
  selectedDates,
  editingReservation,
  onCancel
}: ReservationDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onCancel();
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {editingReservation ? 'Editar Reserva' : 'Detalles del Cliente'}
          </DialogTitle>
        </DialogHeader>
        <ReservationForm
          onSubmit={onSubmit}
          onCancel={onCancel}
          initialDateRange={selectedDates}
          initialData={editingReservation?.client}
          isEditing={!!editingReservation}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;