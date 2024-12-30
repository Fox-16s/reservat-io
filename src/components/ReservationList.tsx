import { useState, useEffect, useRef } from 'react';
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

interface ReservationListProps {
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  scrollToReservationId?: string;
}

const ReservationList = ({ reservations, onDelete, onEdit, scrollToReservationId }: ReservationListProps) => {
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [userInfoMap, setUserInfoMap] = useState<Record<string, UserInfo>>({});
  const reservationRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (scrollToReservationId && reservationRefs.current[scrollToReservationId]) {
      reservationRefs.current[scrollToReservationId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [scrollToReservationId]);

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

  const sortedReservations = [...reservations].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-200">Lista de Reservas</h3>
      <div className="space-y-1.5">
        {sortedReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            ref={(el) => reservationRefs.current[reservation.id] = el}
            reservation={reservation}
            userInfo={userInfoMap[reservation.userId]}
            onSelect={setSelectedReservation}
            onEdit={onEdit}
            onDelete={setSelectedReservation}
            onWhatsAppClick={handleWhatsAppClick}
            isHighlighted={scrollToReservationId === reservation.id}
          />
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