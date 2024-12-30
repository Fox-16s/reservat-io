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
      if (event === "SIGNED_OUT") {
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
          providers={["google"]}
          localization={{
            variables: {
              sign_in: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                email_input_placeholder: "Tu correo electrónico",
                password_input_placeholder: "Tu contraseña",
                button_label: "Iniciar sesión",
                loading_button_label: "Iniciando sesión ...",
                social_provider_text: "Iniciar sesión con {{provider}}",
                link_text: "¿Ya tienes una cuenta? Inicia sesión"
              },
              sign_up: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                email_input_placeholder: "Tu correo electrónico",
                password_input_placeholder: "Tu contraseña",
                button_label: "Registrarse",
                loading_button_label: "Registrando ...",
                social_provider_text: "Registrarse con {{provider}}",
                link_text: "¿No tienes una cuenta? Regístrate"
              },
              forgotten_password: {
                email_label: "Correo electrónico",
                password_label: "Contraseña",
                email_input_placeholder: "Tu correo electrónico",
                button_label: "Enviar instrucciones",
                loading_button_label: "Enviando instrucciones ...",
                link_text: "¿Olvidaste tu contraseña?"
              },
              update_password: {
                password_label: "Nueva contraseña",
                password_input_placeholder: "Tu nueva contraseña",
                button_label: "Actualizar contraseña",
                loading_button_label: "Actualizando contraseña ...",
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AuthPage;