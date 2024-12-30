import { Reservation } from '../types/types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { PROPERTIES } from '../utils/reservationUtils';
import { MessageSquare, CreditCard, Banknote, Building2, ChevronRight } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { Card } from './ui/card';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

const ReservationList = ({ reservations, onDelete, onEdit }: ReservationListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  
  const sortedReservations = [...reservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  const getPropertyName = (propertyId: string) => {
    return PROPERTIES.find(p => p.id === propertyId)?.name || '';
  };

  const getPropertyColor = (propertyId: string) => {
    return PROPERTIES.find(p => p.id === propertyId)?.color || '';
  };

  const handleDeleteConfirm = () => {
    if (selectedReservation) {
      onDelete(selectedReservation);
      setSelectedReservation(null);
    }
  };

  const handleWhatsAppClick = (phone: string) => {
    const message = encodeURIComponent('¡Hola! Te escribo por la reserva...');
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Lista de Reservas</h3>
      <div className="space-y-4">
        {sortedReservations.map((reservation) => (
          <div key={reservation.id} className="space-y-2">
            {/* First Card - Client Information */}
            <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Checkbox
                  id={`reservation-${reservation.id}`}
                  onCheckedChange={() => setSelectedReservation(reservation.id)}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getPropertyColor(reservation.propertyId)}`} />
                      <span className="font-medium dark:text-gray-200">{getPropertyName(reservation.propertyId)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedReservation(expandedReservation === reservation.id ? null : reservation.id)}
                      className="ml-2"
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform ${expandedReservation === reservation.id ? 'rotate-90' : ''}`} />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(reservation.startDate, 'dd/MM/yyyy')} - {format(reservation.endDate, 'dd/MM/yyyy')}
                  </p>
                  <p className="text-sm dark:text-gray-300">
                    <span className="font-medium">Cliente:</span> {reservation.client.name}
                  </p>
                  <p className="text-sm dark:text-gray-300">
                    <span className="font-medium">Teléfono:</span> {reservation.client.phone}
                  </p>
                  {reservation.client.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {reservation.client.notes}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleWhatsAppClick(reservation.client.phone)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(reservation)}
                      className="dark:border-gray-600 dark:text-gray-300"
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Second Card - Payment Information (Expandable) */}
            {expandedReservation === reservation.id && (
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ml-8">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Detalles de Pago</h4>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Total: {formatCurrency(reservation.totalAmount)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reservation.paymentMethods.map((payment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-sm"
                      >
                        {getPaymentMethodIcon(payment.type)}
                        <span className="text-gray-700 dark:text-gray-300">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        ))}
        {sortedReservations.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay reservas</p>
        )}
      </div>

      <AlertDialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReservationList;