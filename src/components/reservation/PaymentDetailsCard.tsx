import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';
import { PaymentMethod } from '../../types/types';

interface PaymentDetailsCardProps {
  totalAmount: string;
  setTotalAmount: (amount: string) => void;
  paymentAmounts: { [key: string]: string };
  onPaymentMethodChange: (method: 'cash' | 'card' | 'bank_transfer', amount: string) => void;
}

const PaymentDetailsCard = ({
  totalAmount,
  setTotalAmount,
  paymentAmounts,
  onPaymentMethodChange
}: PaymentDetailsCardProps) => {
  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <Label className="text-sm font-medium">Detalles de Pago</Label>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
            onClick={() => {
              // Here you would handle the Booking confirmation
              console.log('Booking confirmation clicked');
            }}
          >
            ¿Reserva por Booking?
          </Button>
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
                onChange={(e) => onPaymentMethodChange(method as 'cash' | 'card' | 'bank_transfer', e.target.value)}
                placeholder="0.00"
                className="text-sm"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentDetailsCard;