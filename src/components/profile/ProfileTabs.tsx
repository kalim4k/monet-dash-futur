
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell } from "lucide-react";
import { useState } from "react";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { SecurityCard } from "./SecurityCard";
import { PaymentMethodsCard } from "./PaymentMethodsCard";
import { PaymentAccountCard } from "./PaymentAccountCard";
import { SocialNetworksCard } from "./SocialNetworksCard";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
        <SocialNetworksCard />
      </TabsContent>
    </Tabs>
  );
}
