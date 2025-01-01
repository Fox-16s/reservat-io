import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { PROPERTIES } from '@/utils/reservationUtils';
import Header from '@/components/layout/Header';
import PropertyTabs from '@/components/calendar/PropertyTabs';

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
      style={{ backgroundImage: `url("${backgroundImage}")` }}
    >
      <Header userEmail={userEmail} onLogout={handleLogout} />

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
            
            <PropertyTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;