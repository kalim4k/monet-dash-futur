
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
    // Vérifier la session existante
    const getInitialSession = async () => {
      try {
        setLoading(true);
        
        // Établir le listener d'authentification AVANT de vérifier la session
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
          }
        );

        // Vérifier si une session existe déjà
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);

        return subscription; // Retourner la subscription directement
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        toast({
          title: "Erreur d'authentification",
          description: "Impossible de récupérer votre session",
          variant: "destructive",
        });
        return undefined;
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      const subscription = await getInitialSession();
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    };

    const unsubscribe = init();
    return () => {
      unsubscribe.then((unsub) => {
        if (typeof unsub === "function") unsub();
      });
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
