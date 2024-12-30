import { useEffect, useState } from 'react';
import PropertyCalendar from '../components/PropertyCalendar';

const landscapes = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=80',
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
        backgroundImage: `url("/lovable-uploads/f0bb66d0-9b79-4316-a640-2d76b4644036.png")`,
      }}
    >
      <div className="container mx-auto py-8">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/7ed1ad8a-5c46-4f15-92ad-6ce56d9b16e7.png" 
            alt="Reservat.io" 
            className="h-16 md:h-20 w-auto"
          />
        </div>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl p-6">
          <PropertyCalendar />
        </div>
      </div>
    </div>
  );
};

export default Index;