import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

const AuthForm = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    theme="light"
    providers={[]}
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
);

export default AuthForm;