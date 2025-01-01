import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface PaymentFormProps {
  onSubmit: (type: 'cash' | 'card' | 'bank_transfer', amount: string) => void;
  onCancel: () => void;
}

const PaymentForm = ({ onSubmit, onCancel }: PaymentFormProps) => {
  const [paymentType, setPaymentType] = useState<'cash' | 'card' | 'bank_transfer'>('cash');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    onSubmit(paymentType, amount);
    setAmount('');
  };

  return (
    <div className="space-y-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
      <div className="space-y-1">
        <Label className="text-[10px]">Tipo de Pago</Label>
        <Select
          value={paymentType}
          onValueChange={(value: 'cash' | 'card' | 'bank_transfer') => setPaymentType(value)}
        >
          <SelectTrigger className="h-8 text-[10px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Efectivo</SelectItem>
            <SelectItem value="card">Tarjeta</SelectItem>
            <SelectItem value="bank_transfer">Transferencia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px]">Monto</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-8 text-[10px]"
          placeholder="Ingrese el monto"
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-[10px]"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          className="flex-1 text-[10px]"
          onClick={handleSubmit}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;