import { Button } from "@/components/ui/button";
import { Eye, Keyboard, ArrowRight, ArrowLeft } from "lucide-react";

export type PracticeMode = "flashcard" | "typing";

interface PracticeModeSelectorProps {
  selectedMode: PracticeMode;
  onModeChange: (mode: PracticeMode) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function PracticeModeSelector({
  selectedMode,
  onModeChange,
  onContinue,
  onBack,
}: PracticeModeSelectorProps) {
  const modes = [
    {
      id: "flashcard" as const,
      title: "Flashcard Mode",
      description: "Reveal answers and self-assess your knowledge",
      icon: Eye,
      features: ["Quick review", "Self-paced", "Good for initial learning"],
    },
    {
      id: "typing" as const,
      title: "Active Recall",
      description: "Type translations for deeper learning",
      icon: Keyboard,
      features: [
        "Chinese → English",
        "English → Chinese",
        "Pinyin or Hanzi accepted",
      ],
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <button
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose Practice Mode
        </h2>
        <p className="text-muted-foreground">
          Select how you want to practice your vocabulary
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`card-elevated p-6 text-left transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <mode.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {mode.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {mode.description}
                  </p>
                  <ul className="space-y-1">
                    {mode.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button variant="hero" size="xl" className="w-full" onClick={onContinue}>
        Start Practice
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
}
