import { useEffect, useState } from 'react';
import PropertyCalendar from '../components/PropertyCalendar';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROPERTIES } from '@/utils/reservationUtils';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const [backgroundImage, setBackgroundImage] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(PROPERTIES[0].id);
  const isMobile = useIsMobile();

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
              {userEmail && !isMobile && (
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
              {!isMobile && "Logout"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 dark:from-purple-900/20 dark:to-indigo-900/20 pointer-events-none" />
          
          <div className="relative bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-xl 
            shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.24)]
            border border-white/20 dark:border-gray-800/30
            p-4 sm:p-6 md:p-8 lg:p-10
            transition-all duration-300 ease-in-out
            hover:shadow-[0_8px_40px_rgb(0,0,0,0.16)] dark:hover:shadow-[0_8px_40px_rgb(0,0,0,0.32)]
            hover:bg-white/40 dark:hover:bg-gray-900/40
            overflow-x-auto">
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;