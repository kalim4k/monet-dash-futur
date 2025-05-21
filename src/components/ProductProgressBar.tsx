
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ProductProgressBarProps {
  currentCount: number;
  requiredCount: number;
}

const ProductProgressBar = ({ currentCount, requiredCount }: ProductProgressBarProps) => {
  // Calculer le pourcentage de progression
  const progressPercentage = Math.min(Math.floor((currentCount / requiredCount) * 100), 100);
  
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>Progression</span>
        <span>{progressPercentage}%</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
      <p className="text-sm text-center text-muted-foreground">
        {currentCount < requiredCount ? 
          `${currentCount}/${requiredCount} clics effectués` : 
          "Vous avez débloqué le téléchargement !"}
      </p>
    </div>
  );
};

export default ProductProgressBar;
