import { useMemo } from "react";
import { Trophy, Flame, Target, Star } from "lucide-react";

interface MasteryTimelineProps {
  currentMastery: number; // 0-1000
  className?: string;
}

export function MasteryTimeline({ currentMastery, className = "" }: MasteryTimelineProps) {
  const percentage = useMemo(() => Math.min(100, (currentMastery / 1000) * 100), [currentMastery]);
  
  const milestone = useMemo(() => {
    if (currentMastery >= 1000) return { label: "HSK 3 Master", icon: Trophy, color: "text-gold" };
    if (currentMastery >= 750) return { label: "Advanced", icon: Star, color: "text-crimson" };
    if (currentMastery >= 500) return { label: "Intermediate", icon: Flame, color: "text-primary" };
    if (currentMastery >= 250) return { label: "Beginner", icon: Target, color: "text-jade" };
    return { label: "Starting", icon: Target, color: "text-muted-foreground" };
  }, [currentMastery]);

  const MilestoneIcon = milestone.icon;

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <MilestoneIcon className={`w-4 h-4 ${milestone.color}`} />
          <span className={`text-sm font-medium ${milestone.color}`}>{milestone.label}</span>
        </div>
        <span className="text-sm text-muted-foreground font-mono">
          {currentMastery} / 1000
        </span>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        {/* Milestone markers */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-background/50" />
          <div className="w-1/4 border-r border-background/50" />
          <div className="w-1/4 border-r border-background/50" />
          <div className="w-1/4" />
        </div>
        
        {/* Progress fill */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-jade via-primary to-gold transition-all duration-700 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
        
        {/* Glow at tip */}
        {percentage > 0 && (
          <div 
            className="absolute top-0 bottom-0 w-2 bg-white/50 blur-sm transition-all duration-700"
            style={{ left: `calc(${percentage}% - 4px)` }}
          />
        )}
      </div>
      
      {/* Milestone labels */}
      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
        <span>0</span>
        <span>250</span>
        <span>500</span>
        <span>750</span>
        <span>1000</span>
      </div>
    </div>
  );
}
