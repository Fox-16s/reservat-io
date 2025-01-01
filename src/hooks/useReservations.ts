import { useReservationQueries } from './useReservationQueries';
import { useReservationMutations } from './useReservationMutations';

export const useReservations = () => {
  const { reservations, fetchReservations } = useReservationQueries();
  const { createReservation, updateReservation, deleteReservation } = useReservationMutations();

  return {
    reservations,
    createReservation: async (...args: Parameters<typeof createReservation>) => {
      const success = await createReservation(...args);
      if (success) await fetchReservations();
      return success;
    },
    updateReservation: async (...args: Parameters<typeof updateReservation>) => {
      const success = await updateReservation(...args);
      if (success) await fetchReservations();
      return success;
    },
    deleteReservation: async (...args: Parameters<typeof deleteReservation>) => {
      const success = await deleteReservation(...args);
      if (success) await fetchReservations();
      return success;
    },
  };
};