import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useEffect } from "react";
import { AuthError } from "@supabase/supabase-js";

const AuthForm = () => {
  const { theme: currentTheme } = useTheme();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        toast.success('Successfully signed in!');
      } else if (event === 'SIGNED_OUT') {
        toast.success('Successfully signed out!');
      } else if (event === 'USER_UPDATED') {
        toast.success('Profile updated successfully!');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.success('Password recovery email sent!');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleError = (error: AuthError) => {
    console.error('Auth error:', error);
    
    // Handle specific error cases
    if (error.message.includes('Invalid login credentials')) {
      toast.error('Invalid email or password. Please try again.');
    } else if (error.message.includes('Email not confirmed')) {
      toast.error('Please verify your email address before signing in.');
    } else if (error.message.includes('Email rate limit exceeded')) {
      toast.error('Too many attempts. Please try again later.');
    } else if (error.message.includes('Password is too weak')) {
      toast.error('Password should be at least 6 characters long.');
    } else {
      // Generic error message for other cases
      toast.error('An error occurred. Please try again.');
    }
  };

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
      providers={[]}
      redirectTo={window.location.origin}
      onlyThirdPartyProviders={false}
      view="sign_in"
      showLinks={true}
      onError={handleError}
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