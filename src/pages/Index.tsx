
import { ArrowUpRight, ChevronUp, Award, MousePointer, TrendingUp, User } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ClicksPerProductChart } from "@/components/ClicksPerProductChart";
import { WeeklyEarnings } from "@/components/WeeklyEarnings";
import { TopAffiliatesTable } from "@/components/TopAffiliatesTable";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlatformsCarousel } from "@/components/PlatformsCarousel";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Index = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({ total: 0, weekly: 0, clicks: 0, bonus: 0 });
  
  // Fonction pour charger les statistiques de l'utilisateur
  const loadUserStats = async (userId: string) => {
    try {
      // Récupérer les revenus totaux (1 FCFA par clic)
      const { data: totalEarnings, error: totalError } = await supabase.rpc(
        'get_affiliate_earnings', 
        { user_id: userId }
      );
      
      // Récupérer les revenus hebdomadaires (1 FCFA par clic)
      const { data: weeklyEarnings, error: weeklyError } = await supabase.rpc(
        'get_affiliate_weekly_earnings',
        { user_id: userId }
      );
      
      // Récupérer le nombre total de clics
      const { data: clicksData, error: clicksError } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('user_id', userId)
        .then(async ({ data, error }) => {
          if (error) throw error;
          if (!data || data.length === 0) return { data: 0, error: null };
          
          const linkIds = data.map(link => link.id);
          const { count, error: countError } = await supabase
            .from('clicks')
            .select('*', { count: 'exact', head: true })
            .in('affiliate_link_id', linkIds);
            
          return { data: count || 0, error: countError };
        });
      
      if (totalError || weeklyError || clicksError) {
        throw new Error("Erreur lors du chargement des statistiques");
      }
      
      setEarnings({
        // 1 FCFA par clic
        total: totalEarnings || 0, 
        weekly: weeklyEarnings || 0,
        clicks: clicksData || 0,
        bonus: 0 // Pour le moment, pas de système de bonus
      });
      
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
    }
  };
  
  // Charger les statistiques si l'utilisateur est connecté
  useEffect(() => {
    if (user?.id) {
      loadUserStats(user.id);
    }
  }, [user]);
  
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={isMobile ? "flex-1" : ""}>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground mt-1">
                  Bienvenue sur votre tableau de bord de monétisation de vos réseaux sociaux
                </p>
              </div>
              
              <div className={isMobile ? "ml-4" : ""}>
                <UserProfileCard />
              </div>
            </div>
            
            <PlatformsCarousel />
          </header>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Résumé des Gains</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2">
              <StatCard
                title="Gains Totaux"
                value={`${earnings.total} FCFA`}
                description={`1 FCFA par clic généré`}
                color="pink"
              />
              <StatCard
                title="Gains de la semaine"
                value={`${earnings.weekly} FCFA`}
                color="blue"
              />
              <StatCard
                title="Clics totaux générés"
                value={earnings.clicks.toString()}
                color="green"
              />
              <StatCard
                title="Bonus Reçus"
                value={`${earnings.bonus} FCFA`}
                color="yellow"
              />
            </div>
          </section>
          
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Statistiques de Performance</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <WeeklyEarnings />
              <ClicksPerProductChart />
            </div>
          </section>
          
          <section className="mt-10 mb-10">
            <TopAffiliatesTable />
          </section>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
