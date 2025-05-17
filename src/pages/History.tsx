
import { Sidebar } from "@/components/Sidebar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { Card } from "@/components/ui/card";

const History = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="container px-4 sm:px-6 max-w-7xl py-6">
          <header className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Historique de Paiement</h1>
                <p className="text-muted-foreground mt-1">
                  Consultez l'historique de vos paiements et transactions
                </p>
              </div>
              
              <Card className="bg-gradient-to-r from-primary/30 to-secondary/20 border-0 p-2 flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/30">
                  <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&h=200" />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User size={18} />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Emma Dupont</p>
                  <p className="text-xs text-muted-foreground">Influenceur Premium</p>
                </div>
              </Card>
            </div>
          </header>
          
          <div className="border p-4 sm:p-6 rounded-lg shadow-sm bg-white">
            <h3 className="font-semibold">Contenu à venir</h3>
            <p className="text-muted-foreground mt-2">
              Cette page est en cours de développement
            </p>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default History;
