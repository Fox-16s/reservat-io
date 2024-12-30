import { useState, useEffect } from 'react';
import { Client, PaymentMethod } from '../types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { Textarea } from "@/components/ui/textarea";

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
        date: new Date() // Add current date for new payment methods
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-lg font-semibold text-gray-700 dark:text-gray-200">Nombre</Label>
        <Input
          id="name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          placeholder="Juan Pérez"
          className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-lg font-semibold text-gray-700 dark:text-gray-200">Teléfono</Label>
        <Input
          id="phone"
          value={client.phone}
          onChange={(e) => setClient({ ...client, phone: e.target.value })}
          placeholder="+1 234 567 8900"
          className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-lg font-semibold text-gray-700 dark:text-gray-200">Notas</Label>
        <Textarea
          id="notes"
          value={client.notes}
          onChange={(e) => setClient({ ...client, notes: e.target.value })}
          placeholder="Agregar notas o comentarios adicionales..."
          className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300 min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-gray-700 dark:text-gray-200">Seleccionar Fechas</Label>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-md border-2 border-indigo-100 dark:border-indigo-800 p-3 bg-white dark:bg-gray-800 shadow-sm"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="totalAmount" className="text-lg font-semibold text-gray-700 dark:text-gray-200">Monto Total</Label>
        <Input
          id="totalAmount"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="0.00"
          className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
        />
      </div>
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-700 dark:text-gray-200">Métodos de Pago</Label>
        <div className="space-y-4">
          {['cash', 'card', 'bank_transfer'].map((method) => (
            <div key={method} className="flex items-center gap-4">
              <Input
                type="number"
                value={paymentAmounts[method]}
                onChange={(e) => handlePaymentMethodChange(method as 'cash' | 'card' | 'bank_transfer', e.target.value)}
                placeholder="0.00"
                className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
              />
              <Label className="min-w-[120px] text-gray-700 dark:text-gray-200">
                {method === 'cash' && 'Efectivo'}
                {method === 'card' && 'Tarjeta'}
                {method === 'bank_transfer' && 'Transferencia'}
              </Label>
            </div>
          ))}
        </div>
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
          className="border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 px-6 py-2 rounded-md transition-colors duration-200"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;