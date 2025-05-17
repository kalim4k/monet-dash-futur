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

const Index = () => {
  const isMobile = useIsMobile();
  
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
                value="0 FCFA"
                color="pink"
              />
              <StatCard
                title="Gains de la semaine"
                value="0 FCFA"
                color="blue"
              />
              <StatCard
                title="Clics totaux générés"
                value="0 FCFA"
                color="green"
              />
              <StatCard
                title="Bonus Reçus"
                value="0 FCFA"
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
