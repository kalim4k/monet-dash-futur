
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, TrendingUp, Crown, Medal, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";

type Affiliate = {
  id: string;
  name: string;
  photo: string | null;
  earnings: number;
  clicks: number;
};

// Constante pour le revenu par clic
const REVENUE_PER_CLICK = 10; // 10 FCFA par clic

export function TopAffiliatesTable() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopAffiliates = async () => {
      try {
        setIsLoading(true);
        
        // Utiliser la vue que nous avons créée dans la base de données
        const { data, error } = await supabase
          .from('top_affiliates')
          .select('*')
          .limit(5);
        
        if (error) throw error;
        
        const formattedData: Affiliate[] = (data || []).map((item) => ({
          id: item.id || '',
          name: item.name || 'Utilisateur Anonyme',
          photo: item.photo,
          // Multiplie par 10 pour avoir 10 FCFA par clic
          earnings: (item.earnings || 0) * REVENUE_PER_CLICK,
          clicks: item.clicks || 0
        }));
        
        setAffiliates(formattedData);
      } catch (error) {
        console.error("Erreur lors du chargement des affiliés:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger le classement des affiliés",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAffiliates();
  }, [toast]);

  // Get rank badge component based on position
  const getRankBadge = (index: number) => {
    if (index === 0) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (index === 1) return <Medal className="h-4 w-4 text-gray-400" />;
    if (index === 2) return <Medal className="h-4 w-4 text-amber-700" />;
    return <ShieldCheck className="h-4 w-4 text-blue-500" />;
  };

  // Calculer le pourcentage pour la barre de progression
  const getEarningsPercentage = (earnings: number) => {
    const maxEarnings = affiliates.length > 0 ? Math.max(...affiliates.map(a => a.earnings)) : 0;
    return maxEarnings ? (earnings / maxEarnings) * 100 : 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">Aucun affilié n'a généré de revenus pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      {affiliates.map((affiliate, index) => (
        <div 
          key={affiliate.id} 
          className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all"
        >
          <div className="flex-shrink-0 w-10 flex items-center justify-center">
            <div className={`
              h-9 w-9 rounded-full flex items-center justify-center 
              ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-800' : 
                index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800' : 
                index === 2 ? 'bg-gradient-to-r from-amber-700 to-amber-500 text-amber-100' : 
                'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}
              shadow-sm
            `}>
              {getRankBadge(index)}
            </div>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <Avatar className="h-11 w-11 rounded-xl border-2 border-white dark:border-slate-700 shadow-sm">
              <AvatarImage src={affiliate.photo || ""} alt={affiliate.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl">
                {affiliate.name.split(" ").map(name => name[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0 ml-4">
            <p className="text-sm font-semibold truncate">{affiliate.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Progress 
                value={getEarningsPercentage(affiliate.earnings)} 
                className="h-2 bg-slate-100 dark:bg-slate-700" 
              />
              <span className="text-xs font-medium">{affiliate.earnings.toLocaleString()} FCFA</span>
            </div>
          </div>
          
          <div className="text-right flex items-center px-2 py-1 bg-slate-50 dark:bg-slate-700/50 rounded-full">
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-xs font-medium">{affiliate.clicks.toLocaleString()} clics</span>
          </div>
        </div>
      ))}
    </div>
  );
}
