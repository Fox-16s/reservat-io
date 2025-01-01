import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BankingDataCard = () => {
  const { toast } = useToast();

  const bankingData = [
    {
      label: "Bank Details",
      value: "casa.puerto.aguila"
    },
    {
      label: "Bank Details",
      value: "Arq.giselle"
    },
    {
      label: "Bank Details",
      value: "marte.tarea.lima"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: text
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bank Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bankingData.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm">
                {item.value}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(item.value)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BankingDataCard;