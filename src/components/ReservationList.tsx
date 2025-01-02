import { useState, useEffect } from 'react';
import { Reservation } from '../types/types';
import { format } from 'date-fns';
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
import { useToast } from './ui/use-toast';
import ReservationCard from './reservation/ReservationCard';

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
    <div className="space-y-1.5 max-w-[300px] mx-auto">
      <h3 className="text-[10px] font-semibold text-gray-700 dark:text-gray-200">Lista de Reservas</h3>
      <div className="space-y-1 grid grid-cols-1 gap-1.5">
        {sortedReservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            userInfo={userInfoMap[reservation.userId] || { name: null, createdAt: '' }}
            onSelect={setSelectedReservation}
            onEdit={onEdit}
            onDelete={setSelectedReservation}
            onPaymentAdded={handlePaymentAdded}
            formatCreatedAt={formatCreatedAt}
            formatCurrency={formatCurrency}
            handleWhatsAppClick={handleWhatsAppClick}
          />
        ))}
        {sortedReservations.length === 0 && (
          <p className="text-center text-[8px] text-gray-500 dark:text-gray-400 py-1.5">No hay reservas</p>
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