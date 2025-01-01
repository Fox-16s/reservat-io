import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Reservation } from '@/types/types';
import { DollarSign, ChartBar } from 'lucide-react';

interface MonthlyPaymentsCardProps {
  reservations: Reservation[];
}

interface MonthlyTotal {
  month: Date;
  total: number;
  paid: number;
  pending: number;
}

const MonthlyPaymentsCard = ({ reservations }: MonthlyPaymentsCardProps) => {
  const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);

  useEffect(() => {
    const calculateMonthlyTotals = () => {
      const totalsMap = new Map<string, MonthlyTotal>();

      reservations.forEach(reservation => {
        const monthStart = startOfMonth(reservation.startDate);
        const monthKey = format(monthStart, 'yyyy-MM');

        const paidAmount = reservation.paymentMethods.reduce((sum, payment) => sum + payment.amount, 0);
        const pendingAmount = reservation.totalAmount - paidAmount;

        const existing = totalsMap.get(monthKey);
        if (existing) {
          existing.total += reservation.totalAmount;
          existing.paid += paidAmount;
          existing.pending += pendingAmount;
        } else {
          totalsMap.set(monthKey, {
            month: monthStart,
            total: reservation.totalAmount,
            paid: paidAmount,
            pending: pendingAmount,
          });
        }
      });

      const sortedTotals = Array.from(totalsMap.values()).sort(
        (a, b) => b.month.getTime() - a.month.getTime()
      );

      setMonthlyTotals(sortedTotals);
    };

    calculateMonthlyTotals();
  }, [reservations]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <ChartBar className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-medium">Totales Mensuales</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {monthlyTotals.map((monthData, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-white/50 dark:bg-gray-700/50 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {format(monthData.month, 'MMMM yyyy')}
              </span>
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Total:</span>
                <p className="font-medium text-gray-700 dark:text-gray-200">
                  {formatCurrency(monthData.total)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Pagado:</span>
                <p className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(monthData.paid)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Pendiente:</span>
                <p className="font-medium text-orange-600 dark:text-orange-400">
                  {formatCurrency(monthData.pending)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {monthlyTotals.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-2">
            No hay pagos registrados
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlyPaymentsCard;