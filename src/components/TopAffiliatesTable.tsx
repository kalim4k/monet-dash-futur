
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Award, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Affiliate = {
  id: string;
  name: string;
  photo: string | null;
  earnings: number;
  clicks: number;
};

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
          earnings: item.earnings || 0,
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

  // Calculer le pourcentage pour la barre de progression
  const getEarningsPercentage = (earnings: number) => {
    const maxEarnings = affiliates.length > 0 ? Math.max(...affiliates.map(a => a.earnings)) : 0;
    return maxEarnings ? (earnings / maxEarnings) * 100 : 0;
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="px-4 py-2">
          {affiliates.length > 0 ? (
            <div className="space-y-4">
              {affiliates.map((affiliate, index) => (
                <div key={affiliate.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8">
                    {index === 0 ? (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600 h-6 w-6 flex items-center justify-center p-0">
                        <Award className="h-3 w-3" />
                      </Badge>
                    ) : (
                      <Badge variant={index < 3 ? "default" : "outline"} className="h-6 w-6 flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                    )}
                  </div>
                  
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={affiliate.photo || ""} alt={affiliate.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                      {affiliate.name.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{affiliate.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={getEarningsPercentage(affiliate.earnings)} className="h-2" />
                      <span className="text-xs font-medium">{affiliate.earnings.toLocaleString()} FCFA</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>{affiliate.clicks.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">clics</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun affilié n'a généré de revenus pour le moment
            </div>
          )}
        </div>
      )}
    </div>
  );
}
