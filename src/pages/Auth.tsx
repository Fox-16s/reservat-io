import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
      if (event === "USER_UPDATED" && session) {
        navigate("/");
      }
      // Handle specific error cases
      if (event === "SIGNED_OUT") {
        console.log("User signed out");
      }
    });

    // Listen for auth errors
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4"
         style={{ backgroundImage: `url("/lovable-uploads/f0bb66d0-9b79-4316-a640-2d76b4644036.png")` }}>
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <div className="flex justify-center mb-8">
          <img 
            src="/lovable-uploads/7ed1ad8a-5c46-4f15-92ad-6ce56d9b16e7.png" 
            alt="Reservat.io" 
            className="h-12"
          />
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
          onError={(error) => {
            console.error("Auth error:", error);
            if (error.message.includes("User already registered")) {
              toast({
                title: "Account exists",
                description: "This email is already registered. Please sign in instead.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Authentication error",
                description: error.message,
                variant: "destructive",
              });
            }
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;