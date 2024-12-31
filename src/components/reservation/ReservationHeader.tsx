import { User, Clock } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { isValid, parseISO } from 'date-fns';

interface ReservationHeaderProps {
  userName: string | null;
  createdAt: string | undefined;
  formatCreatedAt: (date: string | undefined) => string;
}

const ReservationHeader = ({ userName, createdAt, formatCreatedAt }: ReservationHeaderProps) => {
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'Fecha inválida';
      return formatCreatedAt(dateString);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha inválida';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <User className="h-4 w-4" />
      <HoverCard>
        <HoverCardTrigger className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
          <span>
            Creado por: <span className="font-medium">{userName || 'Usuario desconocido'}</span>
            <span className="ml-2 text-xs">
              <Clock className="h-3 w-3 inline-block mx-1" />
              {formatDate(createdAt)}
            </span>
          </span>
        </HoverCardTrigger>
        <HoverCardContent className="w-auto">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Perfil del creador</p>
            <div className="text-xs text-gray-500">
              <Clock className="h-3 w-3 inline-block mr-1" />
              {formatDate(createdAt)}
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default ReservationHeader;