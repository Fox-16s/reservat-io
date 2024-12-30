import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2 } from 'lucide-react';

interface ReservationActionsProps {
  phone: string;
  onEdit: () => void;
  onDelete: () => void;
  onWhatsAppClick: (phone: string) => void;
}

const ReservationActions = ({ phone, onEdit, onDelete, onWhatsAppClick }: ReservationActionsProps) => {
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
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900 dark:border-red-800"
      >
        <Trash2 className="h-4 w-4 mr-1" />
        Eliminar
      </Button>
    </div>
  );
};

export default ReservationActions;