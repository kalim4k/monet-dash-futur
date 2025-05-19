
import { ArrowDown, ArrowRight, ArrowUp, MousePointer, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  comparedTo?: string;
  percentage?: number;
  impressions?: number;
  validClicks?: number;
  conversionRate?: number;
  className?: string;
  color?: "pink" | "blue" | "green" | "yellow";
  lastUpdated?: Date | string;
}

export function StatCard({
  title,
  value,
  description,
  comparedTo,
  percentage,
  impressions,
  validClicks,
  conversionRate,
  className,
  color = "pink",
  lastUpdated
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
  const showImpressions = impressions !== undefined && impressions > 0;
  const showValidClicks = validClicks !== undefined && validClicks > 0;
  const showConversionRate = conversionRate !== undefined;
  const showPercentage = percentage !== undefined && percentage !== 0;
  const showComparedTo = comparedTo && showPercentage;
  const showLastUpdated = lastUpdated !== undefined;
  
  // Format the last updated date/time
  const formattedDate = showLastUpdated 
    ? typeof lastUpdated === 'string' 
      ? new Date(lastUpdated).toLocaleString()
      : lastUpdated.toLocaleString()
    : null;
  
  return (
    <div className={cn("relative rounded-3xl p-6 shadow-sm", colorClasses[color], className)}>
      <h3 className="text-base font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold mb-2">{value}</p>
      
      {showImpressions && (
        <div className="text-sm text-gray-700 mb-2">
          <div className="flex items-center gap-1">
            <MousePointer className="h-4 w-4" />
            <span>Impressions: <span className="font-semibold">{impressions.toLocaleString()}</span></span>
          </div>
        </div>
      )}
      
      {showValidClicks && (
        <div className="text-sm text-gray-700 mb-2">
          <div className="flex items-center gap-1">
            <MousePointer className="h-4 w-4 text-green-600" />
            <span>Clics valides: <span className="font-semibold">{validClicks.toLocaleString()}</span></span>
          </div>
        </div>
      )}
      
      {showConversionRate && (
        <div className="text-sm text-gray-700 mb-2">
          Taux de conversion: <span className="font-semibold">{conversionRate.toFixed(2)}%</span>
        </div>
      )}

      {description && <div className="text-sm text-gray-700 mb-2">{description}</div>}

      {showPercentage && (
        <div className={cn("flex items-center text-sm mt-2", isNegative ? "text-red-500" : "text-green-500")}>
          {isNegative ? <ArrowDown className="h-4 w-4 mr-1" /> : <ArrowUp className="h-4 w-4 mr-1" />}
          <span>{Math.abs(percentage).toFixed(2)}% {showComparedTo && `(${comparedTo})`}</span>
        </div>
      )}
      
      {showLastUpdated && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute bottom-4 right-4 text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Mis à jour</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Dernière mise à jour: {formattedDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
