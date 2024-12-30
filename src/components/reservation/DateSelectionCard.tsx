import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from 'lucide-react';
import { DateRange } from "react-day-picker";

interface DateSelectionCardProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DateSelectionCard = ({ dateRange, setDateRange }: DateSelectionCardProps) => {
  return (
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
  );
};

export default DateSelectionCard;