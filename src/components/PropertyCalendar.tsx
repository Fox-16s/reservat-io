import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Property, Reservation, Client } from '../types/types';
import PropertySelector from './PropertySelector';
import ReservationForm from './ReservationForm';
import PropertyLegend from './PropertyLegend';
import ReservationList from './ReservationList';
import { PROPERTIES, isDateRangeAvailable } from '../utils/reservationUtils';
import { useToast } from "@/components/ui/use-toast";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";

const PropertyCalendar = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const { toast } = useToast();

  const handleSelect = (range: DateRange | undefined) => {
    if (!range || !selectedProperty) return;

    if (!range.from) {
      setSelectedDates(range);
    } else if (range.from && range.to) {
      const startDate = range.from;
      const endDate = range.to;
      
      if (endDate < startDate) {
        toast({
          title: "Rango de fechas inválido",
          description: "La fecha final no puede ser anterior a la fecha inicial",
          variant: "destructive",
        });
        return;
      }

      const isAvailable = editingReservation
        ? isDateRangeAvailable(startDate, endDate, selectedProperty.id, 
            reservations.filter(r => r.id !== editingReservation.id))
        : isDateRangeAvailable(startDate, endDate, selectedProperty.id, reservations);

      if (isAvailable) {
        setSelectedDates(range);
        setShowClientForm(true);
      } else {
        toast({
          title: "Rango de fechas no disponible",
          description: "Esta propiedad ya está reservada para las fechas seleccionadas",
          variant: "destructive",
        });
        setSelectedDates(undefined);
      }
    } else {
      setSelectedDates(range);
    }
  };

  const handleClientSubmit = (client: Client, dateRange: DateRange) => {
    if (!dateRange.from || !dateRange.to || !selectedProperty) return;

    if (editingReservation) {
      const updatedReservations = reservations.map(r => 
        r.id === editingReservation.id
          ? {
              ...r,
              client,
              startDate: dateRange.from,
              endDate: dateRange.to,
            }
          : r
      );
      setReservations(updatedReservations);
      setEditingReservation(null);
      toast({
        title: "Éxito",
        description: "Reserva actualizada correctamente",
      });
    } else {
      const newReservation: Reservation = {
        id: Math.random().toString(),
        propertyId: selectedProperty.id,
        client,
        startDate: dateRange.from,
        endDate: dateRange.to,
      };
      setReservations([...reservations, newReservation]);
      toast({
        title: "Éxito",
        description: "Reserva creada correctamente",
      });
    }

    setSelectedDates(undefined);
    setShowClientForm(false);
  };

  const handleDeleteReservation = (id: string) => {
    setReservations(reservations.filter(r => r.id !== id));
    toast({
      title: "Éxito",
      description: "Reserva eliminada correctamente",
    });
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setSelectedProperty(PROPERTIES.find(p => p.id === reservation.propertyId) || null);
    setSelectedDates({
      from: reservation.startDate,
      to: reservation.endDate,
    });
    setShowClientForm(true);
  };

  const getDayClassName = (date: Date): string => {
    const reservation = reservations.find((r) => {
      const currentDate = new Date(date.setHours(0, 0, 0, 0));
      const startDate = new Date(r.startDate.setHours(0, 0, 0, 0));
      const endDate = new Date(r.endDate.setHours(0, 0, 0, 0));
      return currentDate >= startDate && currentDate <= endDate;
    });

    if (reservation) {
      const property = PROPERTIES.find((p) => p.id === reservation.propertyId);
      return property?.color || '';
    }

    return '';
  };

  return (
    <div className="flex gap-8 p-8">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <PropertySelector
            properties={PROPERTIES}
            selectedProperty={selectedProperty}
            onSelect={setSelectedProperty}
          />
          <Button 
            onClick={() => {
              if (!selectedProperty) {
                toast({
                  title: "Error",
                  description: "Por favor seleccione una propiedad primero",
                  variant: "destructive",
                });
                return;
              }
              setShowClientForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
          >
            Agregar Reserva
          </Button>
        </div>

        <Calendar
          mode="range"
          selected={selectedDates}
          onSelect={handleSelect}
          className="rounded-lg border-2 border-indigo-100 p-4 bg-white shadow-sm"
          modifiers={{
            booked: (date) => Boolean(getDayClassName(date)),
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: 'var(--primary)',
              color: 'white',
            }
          }}
          onDayMouseEnter={(date) => setHoveredDate(date)}
          onDayMouseLeave={() => setHoveredDate(null)}
        />
      </div>

      <div className="w-80 space-y-8">
        <PropertyLegend />
        <ReservationList
          reservations={reservations}
          onDelete={handleDeleteReservation}
          onEdit={handleEditReservation}
        />
      </div>

      <Dialog 
        open={showClientForm} 
        onOpenChange={(open) => {
          setShowClientForm(open);
          if (!open) {
            setEditingReservation(null);
            setSelectedDates(undefined);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800">
              {editingReservation ? 'Editar Reserva' : 'Detalles del Cliente'}
            </DialogTitle>
          </DialogHeader>
          <ReservationForm
            onSubmit={handleClientSubmit}
            onCancel={() => {
              setShowClientForm(false);
              setEditingReservation(null);
              setSelectedDates(undefined);
            }}
            initialDateRange={selectedDates}
            initialData={editingReservation?.client}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PropertyCalendar;
