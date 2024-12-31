import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReservationDatesProps {
  startDate: Date;
  endDate: Date;
  onEdit?: () => void;
}

const ReservationDates = ({ startDate, endDate, onEdit }: ReservationDatesProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Llegada</p>
          <p className="text-sm font-medium">
            {format(startDate, "EEE, dd.MM.yyyy", { locale: es })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Salida</p>
          <p className="text-sm font-medium">
            {format(endDate, "EEE, dd.MM.yyyy", { locale: es })}
          </p>
        </div>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Cambiar fechas
        </button>
      )}
    </div>
  );
};

export default ReservationDates;