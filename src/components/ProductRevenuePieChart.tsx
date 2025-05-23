
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductRevenue {
  name: string;
  value: number;
  color: string;
}

// Constante pour le revenu par clic
const REVENUE_PER_CLICK = 10; // 10 FCFA par clic

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
const COLOR_MAP: {[key: string]: string} = {};

export function ProductRevenuePieChart() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [productRevenue, setProductRevenue] = useState<ProductRevenue[]>([]);
  const [total, setTotal] = useState(0);

  const fetchProductRevenue = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get all products first to make sure we have their names
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name');

      if (productsError) {
        console.error("Error fetching products:", productsError);
        setLoading(false);
        return;
      }

      // Create a map of product IDs to product names
      const productMap: Record<string, string> = {};
      products?.forEach(product => {
        productMap[product.id] = product.name;
        
        // Assign a consistent color for each product
        if (!COLOR_MAP[product.id]) {
          COLOR_MAP[product.id] = COLORS[Object.keys(COLOR_MAP).length % COLORS.length];
        }
      });

      // Get all affiliate links for this user
      const { data: affiliateLinks, error: linksError } = await supabase
        .from('affiliate_links')
        .select('id, product_id, total_clicks')
        .eq('user_id', user.id);

      if (linksError) {
        console.error("Error fetching affiliate links:", linksError);
        setLoading(false);
        return;
      }

      // Create a map to aggregate clicks by product
      const productClicks: Record<string, number> = {};
      let totalClicks = 0;

      if (affiliateLinks && affiliateLinks.length > 0) {
        affiliateLinks.forEach(link => {
          if (!productClicks[link.product_id]) {
            productClicks[link.product_id] = 0;
          }
          productClicks[link.product_id] += link.total_clicks || 0;
          totalClicks += link.total_clicks || 0;
        });
      }

      // Transform the data for the pie chart - multiply by REVENUE_PER_CLICK for 10 FCFA per click
      const revenueData = Object.keys(productClicks).map(productId => ({
        name: productMap[productId] || 'Unknown Product',
        value: productClicks[productId] * REVENUE_PER_CLICK,
        color: COLOR_MAP[productId] || '#CCCCCC'
      }));

      // Sort by revenue (highest first)
      revenueData.sort((a, b) => b.value - a.value);

      setProductRevenue(revenueData);
      setTotal(totalClicks * REVENUE_PER_CLICK); // Apply 10 FCFA per click here too
    } catch (error) {
      console.error("Error in fetchProductRevenue:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductRevenue();
    
    // Set up real-time updates
    const channel = supabase
      .channel('affiliate-links-changes')
      .on('postgres_changes', 
        {
          event: '*', 
          schema: 'public',
          table: 'affiliate_links',
        }, 
        () => {
          fetchProductRevenue();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const formatPercent = (value: number) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Modified to show truncated product names if they are too long
  const renderLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs max-h-28 overflow-y-auto px-1">
        {productRevenue.map((entry, index) => {
          // Tronquer le nom s'il est trop long
          const displayName = entry.name.length > 12 ? entry.name.substring(0, 10) + '...' : entry.name;
          
          return (
            <div key={`legend-${index}`} className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-full px-2 py-1 mb-1">
              <div 
                className="w-2 h-2 rounded-full mr-1 flex-shrink-0" 
                style={{ backgroundColor: entry.color }}
              />
              <span title={entry.name} className="text-gray-700 dark:text-gray-300 mr-1 truncate max-w-20">{displayName}</span>
              <span className="font-semibold">{formatPercent(entry.value)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</p>
          <p className="text-gray-600 dark:text-gray-400">
            Revenus: {formatCurrency(data.value)}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Pourcentage: {formatPercent(data.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-md border border-slate-200 dark:border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Revenus par Produit</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] flex items-center justify-center">
            <Skeleton className="h-[300px] w-[300px] rounded-full" />
          </div>
        ) : productRevenue.length > 0 ? (
          <div className="h-[350px]">
            <div className="flex items-center justify-center">
              <div className="relative">
                <ResponsiveContainer width={240} height={240}>
                  <PieChart>
                    <Pie
                      data={productRevenue}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="rgba(255,255,255,0.5)"
                      strokeWidth={2}
                    >
                      {productRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                    <p className="text-xl font-bold">{formatCurrency(total)}</p>
                  </div>
                </div>
              </div>
            </div>
            {renderLegend()}
          </div>
        ) : (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Aucun revenu à afficher pour le moment
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
