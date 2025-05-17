
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

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tableau de bord</h1>
                <p className="text-muted-foreground mt-1">
                  Bienvenue sur votre tableau de bord de monétisation de vos réseaux sociaux
                </p>
              </div>
              
              <UserProfileCard />
            </div>
            
            <PlatformsCarousel />
          </header>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Résumé des Gains</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <StatCard
                title="Today so far"
                value="$4.080"
                impressions={4212}
                description="vs Yesterday"
                percentage={-51.46}
                comparedTo="$8.406"
                color="pink"
              />
              <StatCard
                title="Yesterday"
                value="$8.406"
                impressions={10773}
                description="vs Previous day"
                percentage={-2.76}
                comparedTo="$8.645"
                color="blue"
              />
              <StatCard
                title="This payment circle"
                value="$12.486"
                impressions={14985}
                description="vs Last payment circle"
                percentage={-89.89}
                comparedTo="$123.539"
                color="green"
              />
              <StatCard
                title="This month so far"
                value="$136.025"
                impressions={236650}
                description="vs Last month"
                percentage={-62.53}
                comparedTo="$363.023"
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
