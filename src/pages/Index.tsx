import { useEffect, useState } from 'react';
import PropertyCalendar from '../components/PropertyCalendar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState('');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setBackgroundImage("/lovable-uploads/f0bb66d0-9b79-4316-a640-2d76b4644036.png");
  }, []);

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed transition-all duration-700"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6 lg:mb-8">
          <img 
            src="/lovable-uploads/7ed1ad8a-5c46-4f15-92ad-6ce56d9b16e7.png" 
            alt="Reservat.io" 
            className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
          />
          <Button
            variant="outline"
            onClick={handleLogout}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 overflow-x-auto">
          <PropertyCalendar />
        </div>
      </div>
    </div>
  );
};

export default Index;