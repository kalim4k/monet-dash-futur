
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Generate days of the week in French
const getDaysOfWeek = () => {
  return [
    { name: "Lun", earnings: 0 },
    { name: "Mar", earnings: 0 },
    { name: "Mer", earnings: 0 },
    { name: "Jeu", earnings: 0 },
    { name: "Ven", earnings: 0 },
    { name: "Sam", earnings: 0 },
    { name: "Dim", earnings: 0 },
  ];
};

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

const dayMap: Record<number, number> = {
  0: 6, // Sunday is index 6
  1: 0, // Monday is index 0
  2: 1, // Tuesday is index 1
  3: 2, // Wednesday is index 2 
  4: 3, // Thursday is index 3
  5: 4, // Friday is index 4
  6: 5  // Saturday is index 5
};

export function WeeklyEarnings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState(getDaysOfWeek());

  const fetchWeeklyEarnings = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get the current date
      const now = new Date();
      
      // Calculate the start of the week (Monday)
      const startDate = new Date(now);
      const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday, etc.
      startDate.setDate(now.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
      startDate.setHours(0, 0, 0, 0);
      
      // Get all affiliate links for this user
      const { data: affiliateLinks, error: linksError } = await supabase
        .from('affiliate_links')
        .select('id')
        .eq('user_id', user.id);

      if (linksError) {
        console.error("Error fetching affiliate links:", linksError);
        setLoading(false);
        return;
      }

      if (!affiliateLinks || affiliateLinks.length === 0) {
        setLoading(false);
        return;
      }

      const linkIds = affiliateLinks.map(link => link.id);
      
      // Get clicks for the past 7 days, grouped by day
      const { data: clicksData, error: clicksError } = await supabase
        .from('clicks')
        .select('clicked_at')
        .in('affiliate_link_id', linkIds)
        .eq('is_valid', true)
        .gte('clicked_at', startDate.toISOString());

      if (clicksError) {
        console.error("Error fetching clicks:", clicksError);
        setLoading(false);
        return;
      }

      // Initialize weekly data with zero values
      const initialData = getDaysOfWeek();
      
      // Count clicks for each day of the week
      if (clicksData && clicksData.length > 0) {
        clicksData.forEach(click => {
          const clickDate = new Date(click.clicked_at);
          const dayOfWeek = clickDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
          const dayIndex = dayMap[dayOfWeek]; // Map to our array index (0 for Monday)
          
          // Each click is worth 1 FCFA
          initialData[dayIndex].earnings += 1;
        });
      }
      
      setWeeklyData(initialData);
    } catch (error) {
      console.error("Error in fetchWeeklyEarnings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyEarnings();
    
    // Set up real-time updates with Supabase Realtime
    const channel = supabase
      .channel('clicks-changes')
      .on('postgres_changes', 
        {
          event: 'INSERT', 
          schema: 'public',
          table: 'clicks',
        }, 
        () => {
          fetchWeeklyEarnings();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  // Calculate the maximum value for better y-axis scaling
  const maxEarning = Math.max(...weeklyData.map(day => day.earnings));
  const yAxisMax = maxEarning > 0 ? Math.ceil(maxEarning * 1.2) : 3000;
  const yAxisTicks = [0];
  
  // Calculate reasonable Y-axis ticks based on the max value
  for (let i = 1; i <= 5; i++) {
    yAxisTicks.push(Math.ceil(yAxisMax * (i / 5) / 100) * 100);
  }

  return (
    <div className="h-[250px] w-full">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="h-[200px] w-full" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              tickFormatter={(value) => `${value}`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              ticks={yAxisTicks}
              domain={[0, yAxisMax]}
            />
            <Tooltip 
              formatter={(value: number) => [`${formatNumber(value)} FCFA`, "Gains"]} 
              contentStyle={{ 
                borderRadius: "0.75rem", 
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                border: "none",
                padding: "10px 14px",
                backgroundColor: "rgba(255, 255, 255, 0.95)"
              }}
              labelStyle={{ color: "#6B7280", fontWeight: "600", marginBottom: "4px" }}
              itemStyle={{ color: "hsl(var(--primary))", fontWeight: "600" }}
            />
            <Area 
              type="monotone" 
              dataKey="earnings" 
              name="Gains" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2.5}
              fill="url(#colorEarnings)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
