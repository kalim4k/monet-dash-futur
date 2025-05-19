
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

// Sample data with zeroed values
const data = [
  { name: "Lun", earnings: 0 },
  { name: "Mar", earnings: 0 },
  { name: "Mer", earnings: 0 },
  { name: "Jeu", earnings: 0 },
  { name: "Ven", earnings: 0 },
  { name: "Sam", earnings: 0 },
  { name: "Dim", earnings: 0 },
];

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

export function WeeklyEarnings() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
            ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
            domain={[0, 3000]}
          />
          <Tooltip 
            formatter={(value: number) => [`${formatNumber(value)} FCFA`, "Gains"]} 
            contentStyle={{ 
              borderRadius: "0.5rem", 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              border: "1px solid rgba(229, 231, 235, 1)",
              padding: "8px 12px",
              backgroundColor: "white"
            }}
            labelStyle={{ color: "#6B7280", fontWeight: "600", marginBottom: "4px" }}
            itemStyle={{ color: "hsl(var(--primary))", fontWeight: "600" }}
          />
          <Area 
            type="monotone" 
            dataKey="earnings" 
            name="Gains" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            fill="url(#colorEarnings)" 
            activeDot={{ r: 6, strokeWidth: 0, fill: "hsl(var(--primary))" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
