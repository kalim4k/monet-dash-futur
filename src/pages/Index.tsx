
import { ArrowUpRight, ChevronUp, Award, MousePointer, TrendingUp, Facebook, Instagram, Twitter, Youtube, Linkedin, User } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ClicksPerProductChart } from "@/components/ClicksPerProductChart";
import { WeeklyEarnings } from "@/components/WeeklyEarnings";
import { TopAffiliatesTable } from "@/components/TopAffiliatesTable";
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
              
              <div className="flex items-center gap-3">
                <Card className="bg-gradient-to-r from-primary/30 to-secondary/20 border-0 p-2 flex items-center gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <Avatar className="h-10 w-10 border-2 border-white/30 cursor-pointer">
                        <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200" />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          <User size={18} />
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>Mon profil</DropdownMenuItem>
                      <DropdownMenuItem>Paramètres</DropdownMenuItem>
                      <DropdownMenuItem>Déconnexion</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="hidden sm:block">
                    <p className="font-medium text-sm">Emma Dupont</p>
                    <p className="text-xs text-muted-foreground">Influenceur Premium</p>
                  </div>
                </Card>
              </div>
            </div>
            
            <Card className="p-3 bg-gradient-to-r from-primary/10 to-secondary/5 border-0">
              <p className="text-sm font-medium mb-2">Plateformes de monétisation</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
                  <img src="https://orawin.fun/wp-content/uploads/2025/05/tik-tok4.png" alt="TikTok" className="w-6 h-6" />
                  <span className="text-xs font-medium">TikTok</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
                  <img src="https://orawin.fun/wp-content/uploads/2025/05/whatsapp1.png" alt="WhatsApp" className="w-6 h-6" />
                  <span className="text-xs font-medium">WhatsApp</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
                  <img src="https://orawin.fun/wp-content/uploads/2025/05/telegram1.png" alt="Telegram" className="w-6 h-6" />
                  <span className="text-xs font-medium">Telegram</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
                  <img src="https://orawin.fun/wp-content/uploads/2025/05/facebook2.png" alt="Facebook" className="w-6 h-6" />
                  <span className="text-xs font-medium">Facebook</span>
                </div>
              </div>
            </Card>
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
