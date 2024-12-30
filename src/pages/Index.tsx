import { useEffect, useState } from 'react';
import PropertyCalendar from '../components/PropertyCalendar';

const landscapes = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80', // Mountain lake
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80', // Yosemite
  'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=2000&q=80', // Alps
  'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=2000&q=80', // Misty mountains
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80', // Mountain peaks
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80', // Foggy valley
];

const Index = () => {
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * landscapes.length);
    setBackgroundImage(landscapes[randomIndex]);
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-700"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url("${backgroundImage}")`,
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