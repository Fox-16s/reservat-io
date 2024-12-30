import { useState, useEffect } from 'react';
import { Reservation } from '../types/types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { format } from 'date-fns';
import { PROPERTIES } from '../utils/reservationUtils';
import { ChevronRight } from 'lucide-react';
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
  const [expandedReservation, setExpandedReservation] = useState<string | null>(null);
  const [userInfoMap, setUserInfoMap] = useState<Record<string, UserInfo>>({});

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

  const sortedReservations = [...reservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Lista de Reservas</h3>
      <div className="space-y-4">
        {sortedReservations.map((reservation) => (
          <div key={reservation.id} className="space-y-2">
            <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex items-center h-full pt-1">
                  <Checkbox
                    id={`reservation-${reservation.id}`}
                    onCheckedChange={() => setSelectedReservation(reservation.id)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${PROPERTIES.find(p => p.id === reservation.propertyId)?.color}`} />
                      <span className="font-medium dark:text-gray-200">
                        {PROPERTIES.find(p => p.id === reservation.propertyId)?.name}
                      </span>
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

                  <ReservationHeader
                    userName={userInfoMap[reservation.userId]?.name}
                    createdAt={userInfoMap[reservation.userId]?.createdAt}
                    formatCreatedAt={formatCreatedAt}
                  />

                  <ReservationClientInfo client={reservation.client} />

                  <div className="border-t dark:border-gray-700 pt-2 mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Fechas:</span> {format(reservation.startDate, 'dd/MM/yyyy')} - {format(reservation.endDate, 'dd/MM/yyyy')}
                    </p>
                  </div>

                  <ReservationActions
                    phone={reservation.client.phone}
                    onEdit={() => onEdit(reservation)}
                    onWhatsAppClick={handleWhatsAppClick}
                  />
                </div>
              </div>
            </Card>

            {expandedReservation === reservation.id && (
              <Card className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ml-8">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Detalles de Pago</h4>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Total: {formatCurrency(reservation.totalAmount)}
                  </p>
                  <ReservationPaymentInfo
                    paymentMethods={reservation.paymentMethods}
                    formatCurrency={formatCurrency}
                  />
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