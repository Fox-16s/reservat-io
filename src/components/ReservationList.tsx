import { useState, useEffect } from 'react';
import { Reservation } from '../types/types';
import { UserInfo } from '../types/userInfo';
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
import { supabase } from '@/integrations/supabase/client';
import ReservationCard from './reservation/ReservationCard';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
}

const ReservationList = ({ reservations, onDelete, onEdit }: ReservationListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
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

  // Filter reservations for the current month
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const currentMonthReservations = reservations.filter(reservation => 
    isWithinInterval(reservation.startDate, {
      start: currentMonthStart,
      end: currentMonthEnd
    }) ||
    isWithinInterval(reservation.endDate, {
      start: currentMonthStart,
      end: currentMonthEnd
    }) ||
    (reservation.startDate <= currentMonthStart && reservation.endDate >= currentMonthEnd)
  );

  const sortedReservations = [...currentMonthReservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold tracking-tight mb-4 text-foreground">
        Lista de Reservas - {currentMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="space-y-3">
        {sortedReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            userInfo={userInfoMap[reservation.userId]}
            onSelect={setSelectedReservation}
            onEdit={onEdit}
            onDelete={setSelectedReservation}
            onWhatsAppClick={handleWhatsAppClick}
          />
        ))}
        {sortedReservations.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-4">No hay reservas este mes</p>
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