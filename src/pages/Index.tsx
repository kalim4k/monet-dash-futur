
import { ArrowUpRight, ChevronUp, Award, MousePointer, TrendingUp, Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ClicksPerProductChart } from "@/components/ClicksPerProductChart";
import { WeeklyEarnings } from "@/components/WeeklyEarnings";
import { TopAffiliatesTable } from "@/components/TopAffiliatesTable";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";

const Index = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0">
        <div className="container max-w-7xl py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenue sur votre tableau de bord de monétisation de vos réseaux sociaux
            </p>
            <div className="flex space-x-3 mt-2">
              <Facebook size={20} className="text-[#1877F2]" />
              <Instagram size={20} className="text-[#E4405F]" />
              <Twitter size={20} className="text-[#1DA1F2]" />
              <Youtube size={20} className="text-[#FF0000]" />
              <Linkedin size={20} className="text-[#0A66C2]" />
            </div>
          </header>
          
          <section>
            <h2 className="text-xl font-semibold mb-4">Résumé des Gains</h2>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Gains Totaux"
                value="1,248,750 FCFA"
                icon={<TrendingUp className="h-4 w-4" />}
                className="bg-gradient-to-br from-primary/10 to-primary/5"
              />
              <StatCard
                title="Gains cette semaine"
                value="324,000 FCFA"
                description="+12% par rapport à la semaine précédente"
                icon={<ChevronUp className="h-4 w-4" />}
              />
              <StatCard
                title="Clics Générés"
                value="14,820"
                icon={<MousePointer className="h-4 w-4" />}
              />
              <StatCard
                title="Bonus Reçus"
                value="75,000 FCFA"
                icon={<Award className="h-4 w-4" />}
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
