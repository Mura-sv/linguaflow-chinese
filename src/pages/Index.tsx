import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HSKLevelSelector } from "@/components/HSKLevelSelector";
import { PracticeSession } from "@/components/PracticeSession";
import { StatsOverview } from "@/components/StatsOverview";
import { BookOpen, Sparkles } from "lucide-react";

type View = "home" | "select-level" | "practice";

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [selectedLevels, setSelectedLevels] = useState<(1 | 2 | 3)[]>([1]);

  const handleStartPractice = () => {
    if (selectedLevels.length > 0) {
      setView("practice");
    }
  };

  if (view === "practice") {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-lg mx-auto">
          <PracticeSession
            selectedLevels={selectedLevels}
            onBack={() => setView("home")}
          />
        </div>
      </div>
    );
  }

  if (view === "select-level") {
    return (
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setView("home")}
            className="text-muted-foreground hover:text-foreground mb-8 flex items-center gap-2 transition-colors"
          >
            ← Back
          </button>
          <HSKLevelSelector
            selectedLevels={selectedLevels}
            onLevelsChange={setSelectedLevels}
            onStartPractice={handleStartPractice}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-crimson/5 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-20 w-60 h-60 bg-jade/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gold/5 rounded-full blur-2xl" />
        </div>

        <div className="relative px-4 pt-16 pb-12">
          <div className="max-w-lg mx-auto text-center">
            {/* Logo */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-crimson-light mb-4">
                <span className="font-chinese text-4xl font-bold text-crimson">汉</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                HànZì Master
              </h1>
              <p className="text-muted-foreground">
                Master Chinese vocabulary with science-backed spaced repetition
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-slide-up">
              <Button
                variant="hero"
                size="xl"
                onClick={() => setView("select-level")}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Practice
              </Button>
              <Button
                variant="outline-primary"
                size="xl"
                onClick={() => setView("select-level")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Choose Level
              </Button>
            </div>

            {/* Stats */}
            <StatsOverview />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-12 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center text-foreground mb-8">
            Evidence-Based Learning
          </h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: "🧠",
                title: "Spaced Repetition",
                desc: "SM-2 algorithm optimizes review timing for long-term retention"
              },
              {
                icon: "🎯",
                title: "Active Recall",
                desc: "Test yourself first, then reveal answers for deeper learning"
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                desc: "Watch your knowledge grow with detailed statistics"
              }
            ].map((feature, i) => (
              <div 
                key={feature.title} 
                className="card-elevated p-5 text-center"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HSK Level Preview */}
      <div className="px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Complete HSK Coverage
          </h2>
          <p className="text-muted-foreground mb-8">
            Practice vocabulary from HSK levels 1, 2, and 3
          </p>
          
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { level: 1, words: 150, color: "jade" },
              { level: 2, words: 150, color: "gold" },
              { level: 3, words: 300, color: "crimson" }
            ].map((hsk) => (
              <div 
                key={hsk.level}
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center ${
                  hsk.color === 'jade' ? 'bg-jade-light' :
                  hsk.color === 'gold' ? 'bg-gold-light' :
                  'bg-crimson-light'
                }`}
              >
                <span className={`font-bold text-2xl ${
                  hsk.color === 'jade' ? 'text-jade' :
                  hsk.color === 'gold' ? 'text-gold' :
                  'text-crimson'
                }`}>
                  HSK {hsk.level}
                </span>
                <span className="text-sm text-muted-foreground">
                  {hsk.words} words
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-border">
        <div className="max-w-lg mx-auto text-center text-sm text-muted-foreground">
          <p className="font-chinese text-lg mb-2">学无止境</p>
          <p>Learning never ends</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
