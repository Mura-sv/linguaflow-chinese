import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface HSKLevelSelectorProps {
  selectedLevels: (1 | 2 | 3)[];
  onLevelsChange: (levels: (1 | 2 | 3)[]) => void;
  onStartPractice: () => void;
}

const levels = [
  { 
    level: 1 as const, 
    title: "HSK 1", 
    words: 150, 
    description: "Basic vocabulary",
    color: "jade"
  },
  { 
    level: 2 as const, 
    title: "HSK 2", 
    words: 150, 
    description: "Elementary vocabulary",
    color: "gold"
  },
  { 
    level: 3 as const, 
    title: "HSK 3", 
    words: 300, 
    description: "Intermediate vocabulary",
    color: "crimson"
  },
];

export function HSKLevelSelector({ 
  selectedLevels, 
  onLevelsChange, 
  onStartPractice 
}: HSKLevelSelectorProps) {
  const toggleLevel = (level: 1 | 2 | 3) => {
    if (selectedLevels.includes(level)) {
      onLevelsChange(selectedLevels.filter(l => l !== level));
    } else {
      onLevelsChange([...selectedLevels, level].sort());
    }
  };

  const selectAll = () => {
    onLevelsChange([1, 2, 3]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Choose Your Level
        </h2>
        <p className="text-muted-foreground">
          Select one or more HSK levels to practice
        </p>
      </div>

      <div className="grid gap-4 mb-8">
        {levels.map((item) => {
          const isSelected = selectedLevels.includes(item.level);
          return (
            <button
              key={item.level}
              onClick={() => toggleLevel(item.level)}
              className={`card-interactive p-6 text-left relative overflow-hidden group ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-chinese text-2xl font-bold ${
                    item.color === 'jade' ? 'bg-jade-light text-jade' :
                    item.color === 'gold' ? 'bg-gold-light text-gold' :
                    'bg-crimson-light text-crimson'
                  }`}>
                    {item.level}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.description} • {item.words} words
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-border'
                }`}>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              </div>
              
              {/* Decorative element */}
              <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 ${
                item.color === 'jade' ? 'bg-jade' :
                item.color === 'gold' ? 'bg-gold' :
                'bg-crimson'
              }`} />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={selectAll}
          disabled={selectedLevels.length === 3}
        >
          Mix All Levels
        </Button>
        <Button
          variant="hero"
          size="lg"
          onClick={onStartPractice}
          disabled={selectedLevels.length === 0}
        >
          Start Practice
        </Button>
      </div>
    </div>
  );
}
