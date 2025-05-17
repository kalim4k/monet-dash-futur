import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Stable state update function that won't trigger re-renders if values are the same
    const updateAuthState = (newSession: Session | null) => {
      setSession(prev => {
        if (prev?.access_token === newSession?.access_token) return prev;
        return newSession;
      });
      
      setUser(prev => {
        if (prev?.id === newSession?.user?.id) return prev;
        return newSession?.user ?? null;
      });
    };

    // First fetch the current session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        updateAuthState(data.session);
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de récupérer votre session",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        updateAuthState(session);
      }
    );

    // Initial session fetch
    getInitialSession();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Échec de la connexion",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data?.user) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur votre tableau de bord",
        });
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Échec de l'inscription",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data?.user) {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast({
        title: "Erreur de déconnexion",
        description: "Une erreur est survenue lors de la déconnexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};
