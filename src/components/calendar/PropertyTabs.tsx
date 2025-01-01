import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROPERTIES } from '@/utils/reservationUtils';
import PropertyCalendar from '../PropertyCalendar';

interface PropertyTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const PropertyTabs = ({ activeTab, onTabChange }: PropertyTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full flex justify-start overflow-x-auto mb-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg">
        {PROPERTIES.map((property) => (
          <TabsTrigger 
            key={property.id} 
            value={property.id}
            className="flex items-center gap-2 transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80"
          >
            <div className={`w-3 h-3 rounded-full ${property.color}`} />
            {property.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {PROPERTIES.map((property) => (
        <TabsContent key={property.id} value={property.id}>
          <PropertyCalendar selectedPropertyId={property.id} />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PropertyTabs;