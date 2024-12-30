import { useState, useEffect } from 'react';
import { Client, PaymentMethod } from '../types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Phone, CalendarDays, CreditCard } from 'lucide-react';

interface ReservationFormProps {
  onSubmit: (client: Client, dateRange: DateRange, totalAmount: number, paymentMethods: PaymentMethod[]) => void;
  onCancel: () => void;
  initialDateRange?: DateRange;
  initialData?: Client;
}

const ReservationForm = ({ onSubmit, onCancel, initialDateRange, initialData }: ReservationFormProps) => {
  const [client, setClient] = useState<Client>({ name: '', phone: '', notes: '' });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: string }>({
    cash: '',
    card: '',
    bank_transfer: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setClient(initialData);
    }
  }, [initialData]);

  const handlePaymentMethodChange = (method: 'cash' | 'card' | 'bank_transfer', amount: string) => {
    setPaymentAmounts(prev => ({ ...prev, [method]: amount }));
    
    const numAmount = parseFloat(amount) || 0;
    const updatedMethods = paymentMethods.filter(p => p.type !== method);
    
    if (numAmount > 0) {
      updatedMethods.push({ 
        type: method, 
        amount: numAmount,
        date: new Date()
      });
    }
    
    setPaymentMethods(updatedMethods);
  };

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
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingrese un monto total válido",
        variant: "destructive",
      });
      return;
    }
    const total = parseFloat(totalAmount);
    const paymentsTotal = paymentMethods.reduce((sum, method) => sum + method.amount, 0);
    
    if (paymentsTotal > total) {
      toast({
        title: "Error",
        description: "La suma de los pagos no puede ser mayor al monto total",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(client, dateRange, total, paymentMethods);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
            </div>
            <Input
              id="name"
              value={client.name}
              onChange={(e) => setClient({ ...client, name: e.target.value })}
              placeholder="Juan Pérez"
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <Label htmlFor="phone" className="text-sm font-medium">Teléfono</Label>
            </div>
            <Input
              id="phone"
              value={client.phone}
              onChange={(e) => setClient({ ...client, phone: e.target.value })}
              placeholder="+1 234 567 8900"
              className="text-sm"
            />
          </div>

          <div className="col-span-2 space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Notas</Label>
            <Textarea
              id="notes"
              value={client.notes}
              onChange={(e) => setClient({ ...client, notes: e.target.value })}
              placeholder="Agregar notas o comentarios adicionales..."
              className="text-sm h-20 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium">Fechas de Reserva</Label>
          </div>
          <ScrollArea className="h-[280px] rounded-md border">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              className="rounded-md"
            />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium">Detalles de Pago</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalAmount" className="text-sm font-medium">Monto Total</Label>
            <Input
              id="totalAmount"
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="0.00"
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['cash', 'card', 'bank_transfer'].map((method) => (
              <div key={method} className="space-y-2">
                <Label className="text-sm font-medium">
                  {method === 'cash' && 'Efectivo'}
                  {method === 'card' && 'Tarjeta'}
                  {method === 'bank_transfer' && 'Transferencia'}
                </Label>
                <Input
                  type="number"
                  value={paymentAmounts[method]}
                  onChange={(e) => handlePaymentMethodChange(method as 'cash' | 'card' | 'bank_transfer', e.target.value)}
                  placeholder="0.00"
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-sm"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="text-sm bg-indigo-600 hover:bg-indigo-700"
        >
          Confirmar
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;