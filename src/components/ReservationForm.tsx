import { useState } from 'react';
import { Client } from '../types/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ReservationFormProps {
  onSubmit: (client: Client) => void;
  onCancel: () => void;
}

const ReservationForm = ({ onSubmit, onCancel }: ReservationFormProps) => {
  const [client, setClient] = useState<Client>({ name: '', phone: '' });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.name || !client.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    onSubmit(client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={client.name}
          onChange={(e) => setClient({ ...client, name: e.target.value })}
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={client.phone}
          onChange={(e) => setClient({ ...client, phone: e.target.value })}
          placeholder="+1 234 567 8900"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default ReservationForm;