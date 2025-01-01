import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [currencies, setCurrencies] = useState<{ [key: string]: 'ARS' | 'USD' }>({
    cash: initialPaymentMethods.find(p => p.type === 'cash')?.currency || 'ARS',
    card: initialPaymentMethods.find(p => p.type === 'card')?.currency || 'ARS',
    bank_transfer: initialPaymentMethods.find(p => p.type === 'bank_transfer')?.currency || 'ARS',
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
          currency: currencies[method],
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
        date: new Date(),
        currency: currencies[method],
      });
    }
    
    setPaymentMethods(updatedMethods);
    onPaymentMethodsChange(updatedMethods);
  };

  const handleCurrencyChange = (method: 'cash' | 'card' | 'bank_transfer', currency: 'ARS' | 'USD') => {
    setCurrencies(prev => ({ ...prev, [method]: currency }));
    
    // Update existing payment method if it exists
    const existingMethodIndex = paymentMethods.findIndex(p => p.type === method);
    if (existingMethodIndex >= 0 && paymentMethods[existingMethodIndex].amount > 0) {
      const updatedMethods = [...paymentMethods];
      updatedMethods[existingMethodIndex] = {
        ...updatedMethods[existingMethodIndex],
        currency,
      };
      setPaymentMethods(updatedMethods);
      onPaymentMethodsChange(updatedMethods);
    }
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
          {[
            { type: 'cash' as const, icon: Banknote, label: 'Efectivo' },
            { type: 'card' as const, icon: CreditCard, label: 'Tarjeta' },
            { type: 'bank_transfer' as const, icon: Building2, label: 'Transferencia' }
          ].map(({ type, icon: Icon, label }) => (
            <div key={type} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={paymentAmounts[type]}
                  onChange={(e) => handlePaymentMethodChange(type, e.target.value)}
                  placeholder="0.00"
                  className="border-2 border-indigo-100 dark:border-indigo-800 focus:border-indigo-300"
                />
              </div>
              <Select
                value={currencies[type]}
                onValueChange={(value: 'ARS' | 'USD') => handleCurrencyChange(type, value)}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">ARS</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 min-w-[120px] text-gray-700 dark:text-gray-200">
                <Icon className="h-4 w-4" />
                <Label>{label}</Label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;