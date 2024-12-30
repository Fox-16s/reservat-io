import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone } from 'lucide-react';
import { Client } from '../../types/types';

interface ClientDetailsCardProps {
  client: Client;
  setClient: (client: Client) => void;
}

const ClientDetailsCard = ({ client, setClient }: ClientDetailsCardProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextElement = e.currentTarget.nextElementSibling?.querySelector('input, textarea');
      if (nextElement instanceof HTMLElement) {
        nextElement.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const previousElement = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input, textarea');
      if (previousElement instanceof HTMLElement) {
        previousElement.focus();
      }
    }
  };

  return (
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
            onKeyDown={handleKeyDown}
            placeholder="Juan Pérez"
            className="text-sm"
            tabIndex={1}
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
            onKeyDown={handleKeyDown}
            placeholder="+1 234 567 8900"
            className="text-sm"
            tabIndex={2}
          />
        </div>

        <div className="col-span-2 space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">Notas</Label>
          <Textarea
            id="notes"
            value={client.notes}
            onChange={(e) => setClient({ ...client, notes: e.target.value })}
            onKeyDown={handleKeyDown}
            placeholder="Agregar notas o comentarios adicionales..."
            className="text-sm h-20 resize-none"
            tabIndex={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDetailsCard;