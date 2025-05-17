
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  comparedTo?: string;
  percentage?: number;
  impressions?: number;
  className?: string;
  color?: "pink" | "blue" | "green" | "yellow";
}
export function StatCard({
  title,
  value,
  description,
  comparedTo,
  percentage,
  impressions,
  className,
  color = "pink"
}: StatCardProps) {
  const isNegative = percentage && percentage < 0;

  // Color classes based on the card type
  const colorClasses = {
    pink: "bg-pink-50",
    blue: "bg-blue-50",
    green: "bg-green-50",
    yellow: "bg-yellow-50"
  };
  
  // Don't show any stats if they are zero or undefined
  const showImpressions = impressions && impressions > 0;
  const showPercentage = percentage !== undefined && percentage !== 0;
  const showComparedTo = comparedTo && showPercentage;
  
  return <div className={cn("relative rounded-3xl p-6 shadow-sm", colorClasses[color], className)}>
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-2">{value}</p>
      
      {showImpressions && <div className="text-sm text-gray-700 mb-2">
          Clics: <span className="font-semibold">{impressions.toLocaleString()}</span>
        </div>}

      {description}

      {showPercentage && <div className={cn("flex items-center text-sm mt-2", isNegative ? "text-red-500" : "text-green-500")}>
          {isNegative ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
          <span>{Math.abs(percentage).toFixed(2)}% {showComparedTo && `(${comparedTo})`}</span>
        </div>}
      
      <div className="absolute bottom-4 right-4">
        
      </div>
    </div>;
}
