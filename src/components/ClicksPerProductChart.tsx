
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductStats {
  id: string;
  name: string;
  clicks: number;
  revenue: number;
}

export function ClicksPerProductChart() {
  const [products, setProducts] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProductStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        
        // Récupérer la liste des produits actifs
        const { data: dbProducts, error: productsError } = await supabase
          .from('products')
          .select('id, name')
          .eq('active', true);
          
        if (productsError) {
          console.error("Erreur lors de la récupération des produits:", productsError);
          setLoading(false);
          return;
        }
        
        if (!dbProducts || dbProducts.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        // Transformer les produits pour le format d'affichage
        const productsWithStats: ProductStats[] = [];
        
        // Parcourir chaque produit et récupérer ses statistiques de clics
        for (const product of dbProducts) {
          try {
            // Obtenir l'ID du lien d'affiliation pour ce produit et cet utilisateur
            const { data: affiliateLinks } = await supabase
              .from('affiliate_links')
              .select('id')
              .eq('user_id', user.id)
              .eq('product_id', product.id)
              .single();
              
            // Compter les clics pour ce lien d'affiliation
            const { count, error: clicksError } = await supabase
              .from('clicks')
              .select('*', { count: 'exact', head: true })
              .eq('affiliate_link_id', affiliateLinks?.id || '')
              .eq('is_valid', true);
              
            if (clicksError) {
              console.error(`Erreur lors du comptage des clics pour ${product.name}:`, clicksError);
              productsWithStats.push({
                id: product.id,
                name: product.name,
                clicks: 0,
                revenue: 0
              });
            } else {
              // 1 FCFA par clic
              productsWithStats.push({
                id: product.id,
                name: product.name,
                clicks: count || 0,
                revenue: (count || 0) // 1 FCFA par clic
              });
            }
          } catch (err) {
            console.error(`Erreur lors de la récupération des stats pour ${product.name}:`, err);
            productsWithStats.push({
              id: product.id,
              name: product.name,
              clicks: 0,
              revenue: 0
            });
          }
        }
        
        setProducts(productsWithStats);
      } catch (error) {
        console.error("Erreur générale lors de la récupération des statistiques:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Charger les statistiques au chargement du composant
    fetchProductStats();
    
    // Configurer la mise à jour en temps réel avec Supabase Realtime
    const channel = supabase
      .channel('clicks-changes')
      .on('postgres_changes', 
        {
          event: '*', // INSERT, UPDATE ou DELETE
          schema: 'public',
          table: 'clicks',
        }, 
        () => {
          // Recharger les statistiques quand il y a des changements
          fetchProductStats();
        }
      )
      .subscribe();
      
    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Aperçu des Produits</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className="text-right">Clics</TableHead>
                <TableHead className="text-right">Revenus (FCFA)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{product.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{product.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    Aucune donnée disponible
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
