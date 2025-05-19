
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
  
  // Utilisation de React Query pour charger les statistiques
  const { data: userStats, isLoading, error, refetch } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log("Chargement des statistiques pour l'utilisateur:", user.id);
      
      // Récupérer les statistiques d'affiliation directement depuis la table affiliate_links
      const { data: linksData, error: linksError } = await supabase
        .from('affiliate_links')
        .select('id, total_clicks, earnings')
        .eq('user_id', user.id);
      
      if (linksError) {
        console.error("Erreur lors de la récupération des liens d'affiliation:", linksError);
        throw linksError;
      }
      
      console.log("Liens d'affiliation trouvés:", linksData);
      
      // Calculer les totaux
      const totalClicks = linksData?.reduce((sum, link) => sum + (link.total_clicks || 0), 0) || 0;
      const totalEarnings = linksData?.reduce((sum, link) => sum + (Number(link.earnings) || 0), 0) || 0;
      
      // Récupérer les clics de la semaine
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      // Récupérer tous les clics valides de la semaine pour cet utilisateur
      const { data: weeklyClicks, error: weeklyError } = await supabase
        .from('clicks')
        .select('id, affiliate_link_id, product_id, is_valid')
        .gte('clicked_at', oneWeekAgo.toISOString())
        .eq('is_valid', true);
      
      if (weeklyError) {
        console.error("Erreur lors de la récupération des clics hebdomadaires:", weeklyError);
        throw weeklyError;
      }
      
      console.log("Tous les clics hebdomadaires:", weeklyClicks);
      
      // Filtrer les clics pour ne garder que ceux associés aux liens d'affiliation de l'utilisateur
      const linkIds = linksData?.map(link => link.id) || [];
      const userWeeklyClicks = weeklyClicks?.filter(click => 
        linkIds.includes(click.affiliate_link_id || '')
      ) || [];
      
      console.log("Clics hebdomadaires de l'utilisateur:", userWeeklyClicks);
      
      // Compter uniquement les clics valides appartenant à l'utilisateur
      const validWeeklyClicks = userWeeklyClicks.length;
      
      return {
        total: totalEarnings,
        weekly: validWeeklyClicks, // 1 FCFA par clic valide hebdomadaire
        clicks: totalClicks,
        bonus: 0 // Pour le moment, pas de système de bonus
      };
    },
    enabled: !!user?.id
  });
  
  useEffect(() => {
    if (userStats) {
      console.log("Statistiques utilisateur mises à jour:", userStats);
      setEarnings(userStats);
    }
  }, [userStats]);
  
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
                description={`1 FCFA par clic validé`}
                color="pink"
                icon={TrendingUp}
              />
              <StatCard
                title="Gains de la semaine"
                value={`${earnings.weekly} FCFA`}
                color="blue"
                icon={ChevronUp}
              />
              <StatCard
                title="Clics totaux générés"
                value={earnings.clicks.toString()}
                color="green"
                icon={MousePointer}
              />
              <StatCard
                title="Bonus Reçus"
                value={`${earnings.bonus} FCFA`}
                color="yellow"
                icon={Award}
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
