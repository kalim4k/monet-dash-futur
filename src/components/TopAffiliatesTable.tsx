
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Top Affiliés</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rang</TableHead>
                <TableHead>Affilié</TableHead>
                <TableHead className="text-right">Clics</TableHead>
                <TableHead className="text-right">Gains</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {affiliates.length > 0 ? (
                affiliates.map((affiliate, index) => (
                  <TableRow key={affiliate.id}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">{index + 1}</Badge>
                      ) : index === 1 ? (
                        <Badge className="bg-gray-400 hover:bg-gray-500">{index + 1}</Badge>
                      ) : index === 2 ? (
                        <Badge className="bg-amber-700 hover:bg-amber-800">{index + 1}</Badge>
                      ) : (
                        <Badge variant="outline">{index + 1}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={affiliate.photo || ""} alt={affiliate.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {affiliate.name.split(" ").map(name => name[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>{affiliate.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{affiliate.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">
                      {affiliate.earnings.toLocaleString()} FCFA
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    Aucun affilié n'a généré de revenus pour le moment
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
