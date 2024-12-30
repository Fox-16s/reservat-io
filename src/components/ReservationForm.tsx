import { useState, useEffect } from 'react';
import { Client } from '../types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Textarea } from "@/components/ui/textarea";

interface ReservationFormProps {
  onSubmit: (client: Client, dateRange: DateRange) => void;
  onCancel: () => void;
  initialDateRange?: DateRange;
  initialData?: Client;
}

const ReservationForm = ({ onSubmit, onCancel, initialDateRange, initialData }: ReservationFormProps) => {
  const [client, setClient] = useState<Client>({ name: '', phone: '', notes: '' });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setClient(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.name || !client.phone) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Error",
        description: "Por favor seleccione un rango de fechas",
        variant: "destructive",
      });
      return;
    }
    onSubmit(client, dateRange);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-lg font-semibold text-gray-700">Nombre</Label>
        <Input
          id="name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          placeholder="Juan Pérez"
          className="border-2 border-indigo-100 focus:border-indigo-300"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-lg font-semibold text-gray-700">Teléfono</Label>
        <Input
          id="phone"
          value={client.phone}
          onChange={(e) => setClient({ ...client, phone: e.target.value })}
          placeholder="+1 234 567 8900"
          className="border-2 border-indigo-100 focus:border-indigo-300"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-lg font-semibold text-gray-700">Notas</Label>
        <Textarea
          id="notes"
          value={client.notes}
          onChange={(e) => setClient({ ...client, notes: e.target.value })}
          placeholder="Agregar notas o comentarios adicionales..."
          className="border-2 border-indigo-100 focus:border-indigo-300 min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-gray-700">Seleccionar Fechas</Label>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-md border-2 border-indigo-100 p-3 bg-white shadow-sm"
        />
      </div>
      <div className="flex gap-4 pt-4">
        <Button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
        >
          Confirmar
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 px-6 py-2 rounded-md transition-colors duration-200"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;
