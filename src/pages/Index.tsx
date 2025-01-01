import { useEffect, useState } from 'react';
import PropertyCalendar from '../components/PropertyCalendar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROPERTIES } from '@/utils/reservationUtils';

const Index = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(PROPERTIES[0].id);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      } else {
        setUserEmail(null);
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      localStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-jlxcyqegecillqbhtaww-auth-token');
      
      if (session) {
        await supabase.auth.signOut();
      }
      
      navigate('/auth');
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      navigate('/auth');
      toast({
        title: "Session ended",
        description: "Your session has been cleared.",
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/7ed1ad8a-5c46-4f15-92ad-6ce56d9b16e7.png" 
                alt="Reservat.io" 
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto rounded-lg"
              />
              {userEmail && (
                <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{userEmail}</span>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40">
        <div className="bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-md sm:shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 overflow-x-auto">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex justify-start overflow-x-auto mb-6">
              {PROPERTIES.map((property) => (
                <TabsTrigger 
                  key={property.id} 
                  value={property.id}
                  className="flex items-center gap-2"
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
        </div>
      </div>
    </div>
  );
};

export default Index;