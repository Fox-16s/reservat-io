import { Client } from '@/types/types';

interface ReservationClientInfoProps {
  client: Client;
}

const ReservationClientInfo = ({ client }: ReservationClientInfoProps) => {
  return (
    <div className="border-t dark:border-gray-700 pt-2 mt-2">
      <p className="text-sm dark:text-gray-300">
        <span className="font-medium">Cliente:</span> {client.name}
      </p>
      <p className="text-sm dark:text-gray-300">
        <span className="font-medium">Teléfono:</span> {client.phone}
      </p>
      {client.notes && (
        <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-1">
          {client.notes}
        </p>
      )}
    </div>
  );
};

export default ReservationClientInfo;