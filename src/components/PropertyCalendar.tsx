import { useState } from "react";
import { useReservations } from "../hooks/useReservations";
import PropertyCalendarCard from "./PropertyCalendarCard";
import ReservationList from "./ReservationList";
import ReservationDialog from "./ReservationDialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Reservation } from "@/types/types";
import { toast } from "./ui/use-toast";

const properties = [
  { id: "1", name: "Casa 1", color: "bg-blue-500" },
  { id: "2", name: "Casa 2", color: "bg-green-500" },
  { id: "3", name: "Casa 3", color: "bg-purple-500" },
];

const PropertyCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<DateRange>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation>();
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string>();
  const { reservations, createReservation, updateReservation, deleteReservation } =
    useReservations();

  const handleCreateReservation = () => {
    setSelectedReservation(undefined);
    setIsDialogOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDialogOpen(true);
  };

  const handleDeleteReservation = async (id: string) => {
    const success = await deleteReservation(id);
    if (success) {
      toast({
        title: "Reserva eliminada",
        description: "La reserva ha sido eliminada exitosamente.",
      });
    }
  };

  const handleBookedDateClick = (propertyId: string) => {
    setHighlightedPropertyId(propertyId);
    // Remove highlight after 2 seconds
    setTimeout(() => {
      setHighlightedPropertyId(undefined);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Calendario</h2>
          <Button onClick={handleCreateReservation}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>
        <div className="space-y-6">
          {properties.map((property) => (
            <PropertyCalendarCard
              key={property.id}
              property={property}
              reservations={reservations}
              selectedDates={selectedDates}
              onSelect={setSelectedDates}
              onBookedDateClick={handleBookedDateClick}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Reservas</h2>
        <ReservationList
          reservations={reservations}
          onEdit={handleEditReservation}
          onDelete={handleDeleteReservation}
          highlightedPropertyId={highlightedPropertyId}
        />
      </div>

      <ReservationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        properties={properties}
        reservation={selectedReservation}
        onSubmit={selectedReservation ? updateReservation : createReservation}
      />
    </div>
  );
};

export default PropertyCalendar;