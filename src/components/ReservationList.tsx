import { useState, useEffect } from 'react';
import { Reservation } from '../types/types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { PROPERTIES } from '../utils/reservationUtils';
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
import { Card } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import ReservationHeader from './reservation/ReservationHeader';
import ReservationClientInfo from './reservation/ReservationClientInfo';
import ReservationPaymentInfo from './reservation/ReservationPaymentInfo';
import ReservationActions from './reservation/ReservationActions';
import { useToast } from './ui/use-toast';
import { Separator } from './ui/separator';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

interface UserInfo {
  name: string | null;
  createdAt: string;
}

const ReservationList = ({ reservations, onDelete, onEdit }: ReservationListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [userInfoMap, setUserInfoMap] = useState<Record<string, UserInfo>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userIds = [...new Set(reservations.map(r => r.userId))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, created_at')
        .in('id', userIds);

      if (profiles) {
        const userMap: Record<string, UserInfo> = {};
        profiles.forEach(profile => {
          userMap[profile.id] = {
            name: profile.name || 'Unknown User',
            createdAt: profile.created_at
          };
        });
        setUserInfoMap(userMap);
      }
    };

    fetchUserInfo();
  }, [reservations]);

  const formatCreatedAt = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  const handleWhatsAppClick = (phone: string) => {
    const message = encodeURIComponent('¡Hola! Te escribo por la reserva...');
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleDeleteConfirm = () => {
    if (selectedReservation) {
      onDelete(selectedReservation);
      setSelectedReservation(null);
    }
  };

  const handlePaymentAdded = () => {
    toast({
      title: "Pago agregado",
      description: "El pago se ha registrado correctamente",
    });
  };

  const sortedReservations = [...reservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <div className="space-y-2 max-w-full">
      <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-200">Lista de Reservas</h3>
      <div className="space-y-1.5 grid grid-cols-1 gap-2">
        {sortedReservations.map((reservation) => (
          <Card 
            key={reservation.id} 
            className="p-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm 
                     hover:shadow-md transition-all duration-300 ease-in-out
                     border border-gray-100/50 dark:border-gray-700/50 
                     hover:border-primary/30 dark:hover:border-primary/30
                     hover:scale-[1.01] transform w-full"
          >
            <div className="flex flex-col gap-2">
              {/* Reservation Details Section */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-1.5">
                  <div className="flex items-center h-full">
                    <Checkbox
                      id={`reservation-${reservation.id}`}
                      onCheckedChange={() => setSelectedReservation(reservation.id)}
                      className="h-3 w-3 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${PROPERTIES.find(p => p.id === reservation.propertyId)?.color}`} />
                        <span className="font-medium text-[10px] dark:text-gray-200">
                          {PROPERTIES.find(p => p.id === reservation.propertyId)?.name}
                        </span>
                      </div>
                    </div>

                    <ReservationHeader
                      userName={userInfoMap[reservation.userId]?.name}
                      createdAt={userInfoMap[reservation.userId]?.createdAt}
                      formatCreatedAt={formatCreatedAt}
                    />

                    <ReservationClientInfo client={reservation.client} />

                    <div>
                      <p className="text-[10px] text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Fechas:</span> {format(reservation.startDate, 'dd/MM/yyyy')} - {format(reservation.endDate, 'dd/MM/yyyy')}
                      </p>
                    </div>

                    <ReservationActions
                      phone={reservation.client.phone}
                      onEdit={() => onEdit(reservation)}
                      onDelete={() => setSelectedReservation(reservation.id)}
                      onWhatsAppClick={handleWhatsAppClick}
                    />
                  </div>
                </div>
              </div>

              {/* Separator */}
              <Separator className="my-2" />

              {/* Payment Details Section */}
              <div className="space-y-1">
                <h4 className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Detalles de Pago</h4>
                <ReservationPaymentInfo
                  paymentMethods={reservation.paymentMethods}
                  formatCurrency={formatCurrency}
                  totalAmount={reservation.totalAmount}
                  reservationId={reservation.id}
                  onPaymentAdded={handlePaymentAdded}
                />
              </div>
            </div>
          </Card>
        ))}
        {sortedReservations.length === 0 && (
          <p className="text-center text-[10px] text-gray-500 dark:text-gray-400 py-2">No hay reservas</p>
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
