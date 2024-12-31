import { Client } from '@/types/types';
import { User, Phone, FileText } from 'lucide-react';

interface CardClientInfoProps {
  client: Client;
}

const CardClientInfo = ({ client }: CardClientInfoProps) => {
  return (
    <div className="space-y-2 mb-3">
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-gray-500" />
        <span className="text-sm dark:text-gray-300">{client.name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-gray-500" />
        <span className="text-sm dark:text-gray-300">{client.phone}</span>
      </div>
      
      {client.notes && (
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {client.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default CardClientInfo;