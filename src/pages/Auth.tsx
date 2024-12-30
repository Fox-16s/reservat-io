import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/auth/Logo";
import AuthForm from "@/components/auth/AuthForm";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all auth-related data on mount
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('sb-jlxcyqegecillqbhtaww-auth-token');
    
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
      if (event === "USER_UPDATED" && session) {
        navigate("/");
      }
      if (event === "SIGNED_OUT") {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('sb-jlxcyqegecillqbhtaww-auth-token');
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión exitosamente.",
        });
      }

      // Handle auth errors for any event
      const error = session as unknown as { error: { message: string; code: string } };
      if (error?.error?.message?.includes("User already registered")) {
        toast({
          title: "Cuenta existente",
          description: "Este correo ya está registrado. Por favor, inicia sesión.",
          variant: "destructive",
        });
      } else if (error?.error?.message) {
        toast({
          title: "Error de autenticación",
          description: error.error.message,
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4"
         style={{ backgroundImage: `url("/lovable-uploads/f0bb66d0-9b79-4316-a640-2d76b4644036.png")` }}>
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 rounded-lg shadow-xl">
        <Logo />
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;