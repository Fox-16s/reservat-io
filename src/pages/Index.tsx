import PropertyCalendar from '../components/PropertyCalendar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Property Rental Calendar</h1>
        <PropertyCalendar />
      </div>
    </div>
  );
};

export default Index;