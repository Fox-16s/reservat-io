import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const BankingDataCard = () => {
  const { toast } = useToast();

  const bankingData = [
    {
      label: "Macro Account",
      value: "house.port.eagle"
    },
    {
      label: "Giselle Payment Market",
      value: "Arq.giselle"
    },
    {
      label: "Macro Account Diego",
      value: "mars.task.lima"
    }
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado al portapapeles",
      description: `${label}: ${text}`
    });
  };

  return (
    <Card className="max-w-fit mx-auto">
      <CardHeader>
        <CardTitle>Banking Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bankingData.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-sm">
                {item.label}: {item.value}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(item.value, item.label)}
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