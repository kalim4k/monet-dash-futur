
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";

// Enhanced data with revenue information
const data = [
  { name: "WhatsApp Pro", clicks: 240, revenue: 125000 },
  { name: "Status Booster", clicks: 180, revenue: 98000 },
  { name: "Contact Sync", clicks: 120, revenue: 65000 },
  { name: "Media Tool", clicks: 310, revenue: 156000 },
  { name: "Message Scheduler", clicks: 280, revenue: 143000 },
];

export function ClicksPerProductChart() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Aperçu des Produits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((product, index) => (
          <div key={product.name}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <div className="flex items-center mt-1 space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-sm text-muted-foreground">
                      {product.clicks.toLocaleString()} clics
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="text-sm text-muted-foreground">
                      {product.revenue.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-2 rounded-xl flex items-center justify-center">
                <ArrowUpRight 
                  size={18} 
                  className={`text-primary ${
                    index % 2 === 0 ? "rotate-45" : ""
                  }`} 
                />
              </div>
            </div>
            
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary" 
                style={{ width: `${(product.clicks / 310) * 100}%` }}
              />
            </div>
            
            {index < data.length - 1 && (
              <Separator className="mt-6 mb-0" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
