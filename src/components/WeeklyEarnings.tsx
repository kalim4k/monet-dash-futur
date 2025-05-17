
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

// Sample data - in a real app, this would come from an API
const data = [
  { name: "Lun", earnings: 240 },
  { name: "Mar", earnings: 320 },
  { name: "Mer", earnings: 280 },
  { name: "Jeu", earnings: 420 },
  { name: "Ven", earnings: 540 },
  { name: "Sam", earnings: 680 },
  { name: "Dim", earnings: 700 },
];

const formatNumber = (number: number) => {
  return new Intl.NumberFormat('fr-FR').format(number);
};

export function WeeklyEarnings() {
  const yAxisTicks = [0, 700, 1400, 2100, 2800];
  
  return (
    <Card className="col-span-full md:col-span-2">
      <CardHeader>
        <CardTitle>Gains de la Semaine</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12 }}
              height={50}
            >
              <Label 
                value="Jours de la semaine" 
                offset={-10} 
                position="insideBottom"
              />
            </XAxis>
            <YAxis 
              tickFormatter={(value) => `${value} FCFA`} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              domain={[0, 2800]}
              ticks={yAxisTicks}
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
              label={{
                position: 'bottom',
                offset: 15,
                fill: 'hsl(var(--foreground))',
                fontSize: 10,
                formatter: (value: any) => `${value} FCFA`,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
