
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Sample data with zeroed earnings and clicks
const affiliates = [
  { id: 1, name: "Marie Diop", earnings: 0, clicks: 0, photo: null },
  { id: 2, name: "Amadou Sow", earnings: 0, clicks: 0, photo: null },
  { id: 3, name: "Fatou Kane", earnings: 0, clicks: 0, photo: null },
  { id: 4, name: "Omar Ndiaye", earnings: 0, clicks: 0, photo: null },
  { id: 5, name: "Aïcha Ba", earnings: 0, clicks: 0, photo: null },
];

export function TopAffiliatesTable() {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Top Affiliés</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Rang</TableHead>
              <TableHead>Affilié</TableHead>
              <TableHead className="text-right">Clics</TableHead>
              <TableHead className="text-right">Gains</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliates.map((affiliate, index) => (
              <TableRow key={affiliate.id}>
                <TableCell className="font-medium">
                  {index === 0 ? (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">{index + 1}</Badge>
                  ) : index === 1 ? (
                    <Badge className="bg-gray-400 hover:bg-gray-500">{index + 1}</Badge>
                  ) : index === 2 ? (
                    <Badge className="bg-amber-700 hover:bg-amber-800">{index + 1}</Badge>
                  ) : (
                    <Badge variant="outline">{index + 1}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={affiliate.photo || ""} alt={affiliate.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {affiliate.name.split(" ").map(name => name[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>{affiliate.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{affiliate.clicks.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">
                  {affiliate.earnings.toLocaleString()} FCFA
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
