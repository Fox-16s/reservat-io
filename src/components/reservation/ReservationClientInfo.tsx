import { Client } from '@/types/types';
import { User, Phone, StickyNote } from 'lucide-react';

interface ReservationClientInfoProps {
  client: Client;
}

const ReservationClientInfo = ({ client }: ReservationClientInfoProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <p className="text-[10px] text-gray-600 dark:text-gray-400">
          <span className="font-medium">Cliente:</span> {client.name}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-gray-500" />
        <p className="text-[10px] text-gray-600 dark:text-gray-400">
          <span className="font-medium">Teléfono:</span> {client.phone}
        </p>
      </div>
      {client.notes && (
        <div className="flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-gray-500" />
          <p className="text-[10px] text-gray-600 dark:text-gray-400">
            <span className="font-medium">Notas:</span> {client.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReservationClientInfo;