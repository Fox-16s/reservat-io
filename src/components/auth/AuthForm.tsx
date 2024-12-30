import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { toast } from "@/hooks/use-toast";

const AuthForm = () => {
  const { theme: currentTheme } = useTheme();

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ 
        theme: ThemeSupa,
        style: {
          button: { background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
          anchor: { color: 'hsl(var(--primary))' },
        },
      }}
      theme={currentTheme as 'dark' | 'light'}
      providers={["google"]}
      redirectTo={window.location.origin}
      view="sign_in"
      showLinks={true}
      onlyThirdPartyProviders={false}
      localization={{
        variables: {
          sign_in: {
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email",
            password_input_placeholder: "Your password",
            button_label: "Sign in",
            loading_button_label: "Signing in ...",
            social_provider_text: "Sign in with {{provider}}",
            link_text: "Already have an account? Sign in"
          },
          sign_up: {
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email",
            password_input_placeholder: "Your password",
            button_label: "Sign up",
            loading_button_label: "Signing up ...",
            social_provider_text: "Sign up with {{provider}}",
            link_text: "Don't have an account? Sign up"
          },
          forgotten_password: {
            email_label: "Email",
            password_label: "Password",
            email_input_placeholder: "Your email",
            button_label: "Send instructions",
            loading_button_label: "Sending instructions ...",
            link_text: "Forgot your password?"
          },
          update_password: {
            password_label: "New password",
            password_input_placeholder: "Your new password",
            button_label: "Update password",
            loading_button_label: "Updating password ...",
          }
        }
      }}
    />
  );
};

export default AuthForm;