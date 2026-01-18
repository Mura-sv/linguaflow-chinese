import { Button } from "@/components/ui/button";
import { Trophy, Sparkles, ArrowRight, RefreshCw, Flame } from "lucide-react";
import { MasteryTimeline } from "./MasteryTimeline";

interface SessionCliffhangerProps {
  sessionStats: {
    correct: number;
    incorrect: number;
    nearMisses: number;
  };
  almostMasteredCount: number;
  nearMissCount: number;
  currentMastery: number;
  masteryGained: number;
  onContinue: () => void;
  onBack: () => void;
}

export function SessionCliffhanger({
  sessionStats,
  almostMasteredCount,
  nearMissCount,
  currentMastery,
  masteryGained,
  onContinue,
  onBack,
}: SessionCliffhangerProps) {
  const accuracy = sessionStats.correct + sessionStats.incorrect > 0
    ? Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.incorrect)) * 100)
    : 0;

  // Always have a "hook" - never feel complete
  const getHookMessage = () => {
    if (nearMissCount > 0) {
      return {
        icon: Sparkles,
        title: `${nearMissCount} word${nearMissCount > 1 ? 's' : ''} almost mastered!`,
        subtitle: "One more review will lock them in",
        color: "text-gold",
        bgColor: "bg-gold-light",
      };
    }
    if (almostMasteredCount > 0) {
      return {
        icon: Flame,
        title: `${almostMasteredCount} word${almostMasteredCount > 1 ? 's' : ''} at 80%+ mastery`,
        subtitle: "So close to perfection",
        color: "text-crimson",
        bgColor: "bg-crimson-light",
      };
    }
    return {
      icon: Trophy,
      title: "Great momentum!",
      subtitle: "Keep building your Chinese skills",
      color: "text-jade",
      bgColor: "bg-jade-light",
    };
  };

  const hook = getHookMessage();
  const HookIcon = hook.icon;

  return (
    <div className="text-center py-8 animate-fade-in max-w-md mx-auto">
      {/* Hook message - THE CLIFFHANGER */}
      <div className={`${hook.bgColor} rounded-2xl p-6 mb-8`}>
        <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center mx-auto mb-4">
          <HookIcon className={`w-8 h-8 ${hook.color}`} />
        </div>
        <h2 className={`text-2xl font-bold ${hook.color} mb-2`}>
          {hook.title}
        </h2>
        <p className="text-foreground/70">
          {hook.subtitle}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-elevated p-3">
          <div className="text-xl font-bold text-jade">{sessionStats.correct}</div>
          <div className="text-xs text-muted-foreground">Correct</div>
        </div>
        <div className="card-elevated p-3">
          <div className="text-xl font-bold text-gold">{sessionStats.nearMisses}</div>
          <div className="text-xs text-muted-foreground">Almost</div>
        </div>
        <div className="card-elevated p-3">
          <div className="text-xl font-bold text-primary">{accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* Mastery gained */}
      {masteryGained > 0 && (
        <div className="mb-6 text-sm">
          <span className="text-jade font-medium">+{masteryGained}</span>
          <span className="text-muted-foreground"> mastery points</span>
        </div>
      )}

      {/* Timeline */}
      <div className="mb-8">
        <MasteryTimeline currentMastery={currentMastery} />
      </div>

      {/* CTA - Encourage continuation */}
      <div className="flex flex-col gap-3">
        <Button 
          variant="hero" 
          size="lg" 
          onClick={onContinue}
          className="group"
        >
          <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Keep Going
          <span className="ml-2 text-xs opacity-70">(2 min)</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onBack}>
          Take a break
        </Button>
      </div>

      {/* Subtle encouragement */}
      <p className="mt-6 text-xs text-muted-foreground">
        🎯 Short sessions build stronger memories
      </p>
    </div>
  );
}
