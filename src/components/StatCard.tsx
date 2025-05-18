import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import { Sparkline } from "@/components/ui/sparkline"

export function StatCard({
  title,
  value,
  description,
  color = "blue",
  icon: Icon,
  chartData,
}: {
  title: string;
  value: string;
  description?: string;
  color?: "blue" | "green" | "yellow" | "pink" | "purple";
  icon?: React.ElementType;
  chartData?: number[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description ? <p className="text-sm text-muted-foreground">
          {description}
        </p> : null}
      </CardContent>
    </Card>
  )
}
