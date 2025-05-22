import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { SecurityCard } from "./SecurityCard";
import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { PaymentAccountCard } from "./PaymentAccountCard";
import { SocialNetworksCard, UserSettings } from "./SocialNetworksCard";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileTabsProps {
  user: SupabaseUser | null;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  phone: string;
  setPhone: (value: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
}

export function ProfileTabs({
  user,
  fullName,
  setFullName,
  email,
  phone,
  setPhone,
  avatarUrl,
  setAvatarUrl,
  isLoading,
  setIsLoading
}: ProfileTabsProps) {
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);

  // Fetch user settings from database
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (!user?.id) return;
      
      try {
        setLoadingSettings(true);
        
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching user settings:", error);
          return;
        }
        
        if (data) {
          setUserSettings(data);
        } else {
          // Create default settings if not found
          const { data: newSettings, error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("Error creating user settings:", insertError);
            return;
          }
          
          setUserSettings(newSettings);
        }
        
      } catch (error) {
        console.error("Error in user settings fetch:", error);
      } finally {
        setLoadingSettings(false);
      }
    };
    
    fetchUserSettings();
  }, [user]);
  
  // Fetch payment methods to set default
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching payment methods:", error);
          return;
        }
        
        if (data) {
          setPaymentMethod(data.type);
        }
      } catch (error) {
        console.error("Error in payment methods fetch:", error);
      }
    };
    
    fetchPaymentMethods();
  }, [user]);

  return (
    <Tabs defaultValue="user-info" className="w-full">
      <TabsList className="grid grid-cols-3 mb-8">
        <TabsTrigger value="user-info" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">Profil Utilisateur</span>
        </TabsTrigger>
        <TabsTrigger value="payment" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
          <CreditCard className="h-5 w-5" />
          <span className="hidden sm:inline">Méthodes de Paiement</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex flex-col items-center gap-2 py-3 sm:flex-row sm:gap-3">
          <Bell className="h-5 w-5" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
      </TabsList>
      
      {/* Profile Section */}
      <TabsContent value="user-info">
        <div className="grid gap-6 md:grid-cols-2">
          <PersonalInfoCard
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
          
          <SecurityCard />
        </div>
      </TabsContent>
      
      {/* Payment Methods Section */}
      <TabsContent value="payment">
        <div className="grid gap-6 md:grid-cols-2">
          <PaymentMethodsCard 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
          />
          
          <PaymentAccountCard 
            paymentMethod={paymentMethod} 
            setPaymentMethod={setPaymentMethod} 
          />
        </div>
      </TabsContent>
      
      {/* Notifications Section */}
      <TabsContent value="notifications">
        <SocialNetworksCard 
          userSettings={userSettings}
          isLoading={loadingSettings} 
        />
      </TabsContent>
    </Tabs>
  );
}
