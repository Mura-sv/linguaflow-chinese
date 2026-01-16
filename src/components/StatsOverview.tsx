import { useEffect, useState } from "react";
import { loadProgress, calculateStats, StudyStats } from "@/lib/srs";
import { allVocabulary } from "@/data/vocabulary";
import { BookOpen, Brain, Clock, TrendingUp } from "lucide-react";

export function StatsOverview() {
  const [stats, setStats] = useState<StudyStats | null>(null);

  useEffect(() => {
    const progress = loadProgress();
    const calculated = calculateStats(progress);
    setStats(calculated);
  }, []);

  if (!stats) return null;

  const statItems = [
    {
      icon: BookOpen,
      label: "Words Studied",
      value: stats.totalCards,
      total: allVocabulary.length,
      color: "text-jade",
      bg: "bg-jade-light"
    },
    {
      icon: Brain,
      label: "Words Learned",
      value: stats.cardsLearned,
      color: "text-gold",
      bg: "bg-gold-light"
    },
    {
      icon: Clock,
      label: "Due Today",
      value: stats.cardsDue,
      color: "text-crimson",
      bg: "bg-crimson-light"
    },
    {
      icon: TrendingUp,
      label: "Avg. Ease",
      value: stats.averageEase.toFixed(1),
      color: "text-primary",
      bg: "bg-muted"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
      {statItems.map((item, index) => (
        <div 
          key={item.label}
          className="card-elevated p-4"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
            <item.icon className={`w-5 h-5 ${item.color}`} />
          </div>
          <div className="font-semibold text-xl text-foreground">
            {item.value}
            {item.total && (
              <span className="text-sm text-muted-foreground font-normal">
                /{item.total}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
