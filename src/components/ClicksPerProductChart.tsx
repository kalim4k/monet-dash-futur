
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
        
        // 1. Récupérer les liens d'affiliation de l'utilisateur et les produits associés en une requête
        const { data: affiliateLinks, error: linksError } = await supabase
          .from('affiliate_links')
          .select(`
            id,
            product_id,
            products:product_id (
              id,
              name
            )
          `)
          .eq('user_id', user.id);
          
        if (linksError) {
          console.error("Erreur lors de la récupération des liens d'affiliation:", linksError);
          setLoading(false);
          return;
        }

        if (!affiliateLinks || affiliateLinks.length === 0) {
          // Si l'utilisateur n'a pas encore de liens, chercher tous les produits actifs
          const { data: allProducts, error: productsError } = await supabase
            .from('products')
            .select('id, name')
            .eq('active', true);

          if (productsError || !allProducts) {
            console.error("Erreur lors de la récupération des produits:", productsError);
            setLoading(false);
            return;
          }

          // Créer des liens pour tous les produits actifs
          for (const product of allProducts) {
            await supabase
              .from('affiliate_links')
              .insert({
                user_id: user.id,
                product_id: product.id,
                code: Math.random().toString(36).substring(2, 12)
              });
          }

          // Récupérer les liens nouvellement créés
          const { data: newLinks, error: newLinksError } = await supabase
            .from('affiliate_links')
            .select(`
              id,
              product_id,
              products:product_id (
                id,
                name
              )
            `)
            .eq('user_id', user.id);

          if (newLinksError || !newLinks) {
            console.error("Erreur lors de la récupération des nouveaux liens:", newLinksError);
            setLoading(false);
            return;
          }

          // Utiliser les nouveaux liens (qui n'auront pas encore de clics)
          const statsWithNoClicks = newLinks.map(link => ({
            id: link.product_id,
            name: link.products?.name || "Produit inconnu",
            clicks: 0,
            revenue: 0
          }));

          setProducts(statsWithNoClicks);
          setLoading(false);
          return;
        }

        // 2. Récupérer les clics pour chaque lien d'affiliation
        const linkIds = affiliateLinks.map(link => link.id);
        const { data: clicksData, error: clicksError } = await supabase
          .from('clicks')
          .select('affiliate_link_id')
          .in('affiliate_link_id', linkIds)
          .eq('is_valid', true);

        if (clicksError) {
          console.error("Erreur lors de la récupération des clics:", clicksError);
          setLoading(false);
          return;
        }

        // 3. Compter les clics par lien d'affiliation
        const clickCounts = {};
        if (clicksData && clicksData.length > 0) {
          clicksData.forEach(click => {
            if (!clickCounts[click.affiliate_link_id]) {
              clickCounts[click.affiliate_link_id] = 0;
            }
            clickCounts[click.affiliate_link_id]++;
          });
        }

        // 4. Créer les statistiques par produit
        const productStats = affiliateLinks.map(link => {
          const clickCount = clickCounts[link.id] || 0;
          return {
            id: link.product_id,
            name: link.products?.name || "Produit inconnu",
            clicks: clickCount,
            revenue: clickCount // 1 FCFA par clic
          };
        });

        setProducts(productStats);
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
        (payload) => {
          console.log("Mise à jour en temps réel des clics détectée:", payload);
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
