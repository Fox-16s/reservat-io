import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface PaymentNotesProps {
  reservationId: string;
  initialNotes?: string;
}

const PaymentNotes = ({ reservationId, initialNotes }: PaymentNotesProps) => {
  const [notes, setNotes] = useState(initialNotes || '');
  const { toast } = useToast();

  const handleNotesChange = async (value: string) => {
    setNotes(value);
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ payment_notes: value })
        .eq('id', reservationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment notes:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar las notas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-medium text-gray-700 dark:text-gray-300">
        Notas de pago
      </label>
      <Textarea
        placeholder="Agregar notas sobre el pago..."
        value={notes}
        onChange={(e) => handleNotesChange(e.target.value)}
        className="text-[10px] min-h-[60px] resize-none"
      />
    </div>
  );
};

export default PaymentNotes;