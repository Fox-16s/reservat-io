import PropertyCalendar from '../components/PropertyCalendar';

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80")',
      }}
    >
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Calendario de Reservas
        </h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <PropertyCalendar />
        </div>
      </div>
    </div>
  );
};

export default Index;