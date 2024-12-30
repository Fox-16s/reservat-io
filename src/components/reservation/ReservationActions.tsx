import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface ReservationActionsProps {
  phone: string;
  onEdit: () => void;
  onWhatsAppClick: (phone: string) => void;
}

const ReservationActions = ({ phone, onEdit, onWhatsAppClick }: ReservationActionsProps) => {
  return (
    <div className="flex gap-2 mt-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onWhatsAppClick(phone)}
        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="dark:border-gray-600 dark:text-gray-300"
      >
        Editar
      </Button>
    </div>
  );
};

export default ReservationActions;