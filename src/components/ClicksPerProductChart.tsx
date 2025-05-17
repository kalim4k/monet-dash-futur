import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";

// Enhanced data with revenue information
const data = [{
  name: "WhatsApp Pro",
  clicks: 240,
  revenue: 125000
}, {
  name: "Status Booster",
  clicks: 180,
  revenue: 98000
}, {
  name: "Contact Sync",
  clicks: 120,
  revenue: 65000
}, {
  name: "Media Tool",
  clicks: 310,
  revenue: 156000
}, {
  name: "Message Scheduler",
  clicks: 280,
  revenue: 143000
}];
export function ClicksPerProductChart() {
  return <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Aperçu des Produits</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead className="text-right">Clics</TableHead>
              <TableHead className="text-right">Revenus (FCFA)</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((product, index) => <TableRow key={product.name}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">{product.clicks.toLocaleString()}</TableCell>
                <TableCell className="text-right">{product.revenue.toLocaleString()}</TableCell>
                
              </TableRow>)}
          </TableBody>
        </Table>
      </CardContent>
    </Card>;
}