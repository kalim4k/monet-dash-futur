
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data - in a real app, this would come from an API
const data = [
  { name: "WhatsApp Pro", clicks: 240 },
  { name: "Status Booster", clicks: 180 },
  { name: "Contact Sync", clicks: 120 },
  { name: "Media Tool", clicks: 310 },
  { name: "Message Scheduler", clicks: 280 },
];

export function ClicksPerProductChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Clics par Produit</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }} 
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                borderRadius: "0.5rem",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }} 
              cursor={{ fill: "rgba(155, 135, 245, 0.1)" }}
            />
            <Bar 
              dataKey="clicks" 
              name="Nombre de clics" 
              radius={[4, 4, 0, 0]}
              fill="url(#colorGradient)" 
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(258 77% 74%)" stopOpacity={1}/>
                <stop offset="100%" stopColor="hsl(199 89% 48%)" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
