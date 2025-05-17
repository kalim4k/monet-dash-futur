
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProfileTabs } from "@/components/profile/ProfileTabs";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load user profile on mount
  useEffect(() => {
    if (user) {
      // Set email from auth
      setEmail(user.email || "");
      
      // Get additional profile data from user metadata or profiles table
      const metadata = user.user_metadata || {};
      setFullName(metadata.full_name || "");
      setPhone(metadata.phone || "");
      setAvatarUrl(metadata.avatar_url || null);
      
      // Load profile from profiles table if needed
      loadUserProfile();
    }
  }, [user]);
  
  const loadUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error("Erreur chargement profil:", error);
        return;
      }
      
      if (data) {
        setFullName(data.full_name || user.user_metadata?.full_name || "");
        setAvatarUrl(data.avatar_url || user.user_metadata?.avatar_url || null);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container max-w-6xl py-6 px-4 sm:px-6 space-y-8">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Votre Profil</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos informations personnelles et paramètres
            </p>
          </header>
          
          <ProfileTabs
            user={user}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            phone={phone}
            setPhone={setPhone}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
