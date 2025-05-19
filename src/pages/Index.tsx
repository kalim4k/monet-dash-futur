import { ArrowUpRight, ChevronUp, Award, MousePointer, TrendingUp, User, CreditCard, DollarSign, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ClicksPerProductChart } from "@/components/ClicksPerProductChart";
import { WeeklyEarnings } from "@/components/WeeklyEarnings";
import { TopAffiliatesTable } from "@/components/TopAffiliatesTable";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PlatformsCarousel } from "@/components/PlatformsCarousel";
import { UserProfileCard } from "@/components/UserProfileCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ProductRevenuePieChart } from "@/components/ProductRevenuePieChart";

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
            .in('affiliate_link_id', linkIds as string[]);
            
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
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          {/* Modern header inspired by the provided designs */}
          <header className="mb-8 bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white dark:bg-slate-800 rounded-full h-10 w-10 flex items-center justify-center shadow-md">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Dashboard
                  </h1>
                  {!isMobile && (
                    <p className="text-muted-foreground text-sm mt-1">
                      Suivez vos gains et performances
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <UserProfileCard />
              </div>
            </div>
            
            <div className="mt-6">
              <PlatformsCarousel />
            </div>
          </header>
          
          {/* Section des gains avec design moderne */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-primary" />
              Résumé des Gains
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-pink-600 dark:text-pink-300">Gains Totaux</p>
                      <h3 className="text-3xl font-bold mt-2">{earnings.total} FCFA</h3>
                      <p className="text-xs text-muted-foreground mt-1">1 FCFA par clic généré</p>
                    </div>
                    <div className="h-10 w-10 bg-pink-200 dark:bg-pink-800/30 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-pink-600 dark:text-pink-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-300">Gains de la semaine</p>
                      <h3 className="text-3xl font-bold mt-2">{earnings.weekly} FCFA</h3>
                      <p className="text-xs text-muted-foreground mt-1">&nbsp;</p>
                    </div>
                    <div className="h-10 w-10 bg-blue-200 dark:bg-blue-800/30 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-green-600 dark:text-green-300">Clics totaux générés</p>
                      <h3 className="text-3xl font-bold mt-2">{earnings.clicks}</h3>
                      <p className="text-xs text-muted-foreground mt-1">&nbsp;</p>
                    </div>
                    <div className="h-10 w-10 bg-green-200 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                      <MousePointer className="h-5 w-5 text-green-600 dark:text-green-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-yellow-600 dark:text-yellow-300">Bonus Reçus</p>
                      <h3 className="text-3xl font-bold mt-2">{earnings.bonus} FCFA</h3>
                      <p className="text-xs text-muted-foreground mt-1">&nbsp;</p>
                    </div>
                    <div className="h-10 w-10 bg-yellow-200 dark:bg-yellow-800/30 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Section des statistiques réorganisée */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Activity className="mr-2 h-5 w-5 text-primary" />
                Statistiques de Performance
              </h2>
              <Button variant="outline" size="sm" className="text-xs">
                Exporter <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Card className="shadow-md border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Gains de la Semaine</CardTitle>
                </CardHeader>
                <CardContent>
                  <WeeklyEarnings />
                </CardContent>
              </Card>
              
              <Card className="shadow-md border border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Clics par Produit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClicksPerProductChart />
                </CardContent>
              </Card>
            </div>
          </section>
          
          {/* Nouvelle section pour le graphique circulaire des revenus par produit */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-primary" />
              Répartition des Revenus
            </h2>
            <div className="grid gap-4 grid-cols-1">
              <ProductRevenuePieChart />
            </div>
          </section>
          
          {/* Section Top Affiliés modernisée */}
          <section className="mb-10">
            <Card className="shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden">
              <CardHeader className="pb-2 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary" />
                    Top Affiliés
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Voir tout
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <TopAffiliatesTable />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
