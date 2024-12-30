import { User, Clock } from 'lucide-react';

interface ReservationHeaderProps {
  userName: string | null;
  createdAt: string | undefined;
  formatCreatedAt: (date: string | undefined) => string;
}

const ReservationHeader = ({ userName, createdAt, formatCreatedAt }: ReservationHeaderProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <User className="h-4 w-4" />
      <span>Creado por: {userName || 'Usuario desconocido'}</span>
      <Clock className="h-4 w-4 ml-2" />
      <span>{formatCreatedAt(createdAt)}</span>
    </div>
  );
};

export default ReservationHeader;