import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentMethod } from '../types/types';
import { CreditCard, Building2, Banknote } from 'lucide-react';

interface PaymentFormProps {
  onPaymentMethodsChange: (methods: PaymentMethod[]) => void;
  onTotalAmountChange: (amount: number) => void;
  initialPaymentMethods?: PaymentMethod[];
  initialTotalAmount?: number;
}

const PaymentForm = ({ 
  onPaymentMethodsChange, 
  onTotalAmountChange,
  initialPaymentMethods = [],
  initialTotalAmount = 0
}: PaymentFormProps) => {
  const [totalAmount, setTotalAmount] = useState<string>(initialTotalAmount.toString());
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [paymentAmounts, setPaymentAmounts] = useState<{ [key: string]: string }>({
    cash: initialPaymentMethods.find(p => p.type === 'cash')?.amount.toString() || '',
    card: initialPaymentMethods.find(p => p.type === 'card')?.amount.toString() || '',
    bank_transfer: initialPaymentMethods.find(p => p.type === 'bank_transfer')?.amount.toString() || '',
  });

  const handlePaymentMethodChange = (method: 'cash' | 'card' | 'bank_transfer', amount: string) => {
    setPaymentAmounts(prev => ({ ...prev, [method]: amount }));
    
    const numAmount = parseFloat(amount) || 0;
    const existingMethodIndex = paymentMethods.findIndex(p => p.type === method);
    const updatedMethods = [...paymentMethods];
    
    if (existingMethodIndex >= 0) {
      if (numAmount > 0) {
        // Update existing payment method
        updatedMethods[existingMethodIndex] = {
          ...updatedMethods[existingMethodIndex],
          amount: numAmount,
        };
      } else {
        // Remove payment method if amount is 0
        updatedMethods.splice(existingMethodIndex, 1);
      }
    } else if (numAmount > 0) {
      // Add new payment method
      updatedMethods.push({ 
        type: method, 
        amount: numAmount,
        date: new Date()
      });
    }
    
    setPaymentMethods(updatedMethods);
    onPaymentMethodsChange(updatedMethods);
  };

  const handleTotalAmountChange = (value: string) => {
    setTotalAmount(value);
    onTotalAmountChange(parseFloat(value) || 0);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="totalAmount" className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Monto Total
        </Label>
        <Input
          id="totalAmount"
          type="number"
          value={totalAmount}
          onChange={(e) => handleTotalAmountChange(e.target.value)}
          placeholder="0.00"
          className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
        />
      </div>
      <div className="space-y-4">
        <Label className="text-lg font-semibold text-gray-700 dark:text-gray-200">Métodos de Pago</Label>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={paymentAmounts.cash}
              onChange={(e) => handlePaymentMethodChange('cash', e.target.value)}
              placeholder="0.00"
              className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
            />
            <div className="flex items-center gap-2 min-w-[120px] text-gray-700 dark:text-gray-200">
              <Banknote className="h-4 w-4" />
              <Label>Efectivo</Label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={paymentAmounts.card}
              onChange={(e) => handlePaymentMethodChange('card', e.target.value)}
              placeholder="0.00"
              className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
            />
            <div className="flex items-center gap-2 min-w-[120px] text-gray-700 dark:text-gray-200">
              <CreditCard className="h-4 w-4" />
              <Label>Tarjeta</Label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={paymentAmounts.bank_transfer}
              onChange={(e) => handlePaymentMethodChange('bank_transfer', e.target.value)}
              placeholder="0.00"
              className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
            />
            <div className="flex items-center gap-2 min-w-[120px] text-gray-700 dark:text-gray-200">
              <Building2 className="h-4 w-4" />
              <Label>Transferencia</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;