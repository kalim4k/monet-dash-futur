
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

// Constante pour le revenu par clic
const REVENUE_PER_CLICK = 10; // 10 FCFA par clic au lieu de 1 FCFA

export function ClicksPerProductChart() {
  const [products, setProducts] = useState<ProductStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProductStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Get all active products first
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name')
        .eq('active', true);

      if (productsError) {
        console.error("Error fetching products:", productsError);
        setLoading(false);
        return;
      }

      if (!allProducts || allProducts.length === 0) {
        setLoading(false);
        return;
      }

      // Get all affiliate links for this user
      const { data: affiliateLinks, error: linksError } = await supabase
        .from('affiliate_links')
        .select('id, product_id')
        .eq('user_id', user.id);

      if (linksError) {
        console.error("Error fetching affiliate links:", linksError);
        setLoading(false);
        return;
      }

      // Create a map of product_id to links for easier lookup
      const productLinkMap: Record<string, string[]> = {};
      const existingProductIds = new Set<string>();
      
      // Process existing affiliate links
      if (affiliateLinks && affiliateLinks.length > 0) {
        affiliateLinks.forEach(link => {
          if (!productLinkMap[link.product_id]) {
            productLinkMap[link.product_id] = [];
          }
          productLinkMap[link.product_id].push(link.id);
          existingProductIds.add(link.product_id);
        });
      }
      
      // Create affiliate links for products that don't have them
      for (const product of allProducts) {
        if (!existingProductIds.has(product.id)) {
          const { data: newLink, error: createError } = await supabase
            .from('affiliate_links')
            .insert({
              user_id: user.id,
              product_id: product.id,
              code: Math.random().toString(36).substring(2, 12)
            })
            .select('id')
            .single();
            
          if (createError) {
            console.error(`Error creating link for product ${product.id}:`, createError);
            continue;
          }
          
          if (newLink) {
            if (!productLinkMap[product.id]) {
              productLinkMap[product.id] = [];
            }
            productLinkMap[product.id].push(newLink.id);
            existingProductIds.add(product.id);
          }
        }
      }
      
      // Get all link IDs to fetch clicks
      const allLinkIds: string[] = [];
      Object.values(productLinkMap).forEach(links => {
        allLinkIds.push(...links);
      });
      
      if (allLinkIds.length === 0) {
        // No links found or created, show products with zero clicks
        const productsWithNoClicks = allProducts.map(product => ({
          id: product.id,
          name: product.name,
          clicks: 0,
          revenue: 0
        }));
        
        setProducts(productsWithNoClicks);
        setLoading(false);
        return;
      }
      
      // Get clicks for all links in a single query
      const { data: clicksData, error: clicksError } = await supabase
        .from('clicks')
        .select('affiliate_link_id, id')
        .in('affiliate_link_id', allLinkIds as string[])
        .eq('is_valid', true);
        
      if (clicksError) {
        console.error("Error fetching clicks:", clicksError);
        setLoading(false);
        return;
      }
      
      // Count clicks per link ID
      const clicksPerLinkId: Record<string, number> = {};
      if (clicksData && clicksData.length > 0) {
        clicksData.forEach(click => {
          if (!clicksPerLinkId[click.affiliate_link_id]) {
            clicksPerLinkId[click.affiliate_link_id] = 0;
          }
          clicksPerLinkId[click.affiliate_link_id]++;
        });
      }
      
      // Aggregate clicks by product
      const productStats = allProducts.map(product => {
        const linkIds = productLinkMap[product.id] || [];
        let totalClicks = 0;
        
        linkIds.forEach(linkId => {
          totalClicks += clicksPerLinkId[linkId] || 0;
        });
        
        return {
          id: product.id,
          name: product.name,
          clicks: totalClicks,
          revenue: totalClicks * REVENUE_PER_CLICK // 10 FCFA par clic
        };
      });
      
      console.log("Calculated product stats:", productStats);
      setProducts(productStats);
    } catch (error) {
      console.error("General error while fetching product stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load statistics when the component mounts
    fetchProductStats();
    
    // Set up real-time updates with Supabase Realtime
    const channel = supabase
      .channel('clicks-changes')
      .on('postgres_changes', 
        {
          event: '*', // INSERT, UPDATE or DELETE
          schema: 'public',
          table: 'clicks',
        }, 
        (payload) => {
          console.log("Real-time click update detected:", payload);
          // Reload statistics when there are changes
          fetchProductStats();
        }
      )
      .subscribe();
      
    // Clean up subscription
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
