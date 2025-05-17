
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data - in a real app, this would come from an API
const data = [
  { name: "Lun", earnings: 24000 },
  { name: "Mar", earnings: 32000 },
  { name: "Mer", earnings: 28000 },
  { name: "Jeu", earnings: 42000 },
  { name: "Ven", earnings: 54000 },
  { name: "Sam", earnings: 68000 },
  { name: "Dim", earnings: 76000 },
];

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

export function WeeklyEarnings() {
  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle>Gains de la Semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }} 
            />
            <YAxis 
              tickFormatter={(value) => `${value / 700} FCFA`}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              ticks={[0, 700, 1400, 2100, 2800, 3500, 4200, 4900, 5600, 6300, 7000]}
              domain={[0, 7000]}
            />
            <Tooltip 
              formatter={(value: number) => [`${formatNumber(value)} FCFA`, "Gains"]} 
              contentStyle={{ borderRadius: "0.5rem", borderColor: "#e2e8f0" }}
            />
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <Line 
              type="monotone" 
              dataKey="earnings" 
              name="Gains" 
              stroke="hsl(var(--primary))" 
              activeDot={{ r: 6 }}
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4, fill: "#fff" }}
              fillOpacity={1} 
              fill="url(#colorEarnings)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
