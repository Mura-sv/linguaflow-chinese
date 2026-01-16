import { useState, useEffect, useMemo } from "react";
import { FlashCard } from "./FlashCard";
import { VocabWord, getVocabularyByLevel } from "@/data/vocabulary";
import { 
  loadProgress, 
  saveProgress, 
  updateCardProgress, 
  getCardsForReview,
  getNewCards,
  createNewCardProgress,
  CardProgress 
} from "@/lib/srs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Target, Zap } from "lucide-react";

interface PracticeSessionProps {
  selectedLevels: (1 | 2 | 3)[];
  onBack: () => void;
}

export function PracticeSession({ selectedLevels, onBack }: PracticeSessionProps) {
  const [progress, setProgress] = useState<CardProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [isComplete, setIsComplete] = useState(false);

  // Get vocabulary for selected levels
  const vocabulary = useMemo(() => 
    getVocabularyByLevel(selectedLevels),
    [selectedLevels]
  );

  // Build session cards: due cards + new cards
  const sessionCards = useMemo(() => {
    const allWordIds = vocabulary.map(w => w.id);
    const dueCards = getCardsForReview(progress, 15);
    const newCardIds = getNewCards(allWordIds, progress, 5);
    
    const dueWordIds = dueCards.map(c => c.wordId);
    const sessionWordIds = [...dueWordIds, ...newCardIds];
    
    // Shuffle the session
    const shuffled = sessionWordIds.sort(() => Math.random() - 0.5);
    
    return shuffled
      .map(id => vocabulary.find(w => w.id === id))
      .filter((w): w is VocabWord => w !== undefined);
  }, [vocabulary, progress]);

  // Load progress on mount
  useEffect(() => {
    const loaded = loadProgress();
    setProgress(loaded);
  }, []);

  const currentWord = sessionCards[currentIndex];

  const handleReview = (quality: number) => {
    if (!currentWord) return;

    // Update stats
    if (quality >= 3) {
      setSessionStats(s => ({ ...s, correct: s.correct + 1 }));
    } else {
      setSessionStats(s => ({ ...s, incorrect: s.incorrect + 1 }));
    }

    // Update SRS progress
    const newProgress = updateCardProgress(progress, currentWord.id, quality);
    setProgress(newProgress);
    saveProgress(newProgress);

    // Move to next card or complete
    if (currentIndex < sessionCards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setIsComplete(true);
    }
  };

  const restartSession = () => {
    setCurrentIndex(0);
    setSessionStats({ correct: 0, incorrect: 0 });
    setIsComplete(false);
    // Reload progress to get fresh due cards
    const loaded = loadProgress();
    setProgress(loaded);
  };

  if (sessionCards.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-jade-light flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-jade" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          All caught up!
        </h2>
        <p className="text-muted-foreground mb-8">
          No cards due for review right now. Come back later!
        </p>
        <Button variant="outline-primary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = sessionStats.correct + sessionStats.incorrect > 0
      ? Math.round((sessionStats.correct / (sessionStats.correct + sessionStats.incorrect)) * 100)
      : 0;

    return (
      <div className="text-center py-16 animate-fade-in max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-gold-light flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-12 h-12 text-gold" />
        </div>
        
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Session Complete!
        </h2>
        <p className="text-muted-foreground mb-8">
          Great work on your Chinese practice
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card-elevated p-4">
            <div className="text-2xl font-bold text-jade">{sessionStats.correct}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="card-elevated p-4">
            <div className="text-2xl font-bold text-crimson">{sessionStats.incorrect}</div>
            <div className="text-sm text-muted-foreground">To Review</div>
          </div>
          <div className="card-elevated p-4">
            <div className="text-2xl font-bold text-gold">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button variant="hero" size="lg" onClick={restartSession}>
            <Zap className="w-4 h-4 mr-2" />
            Practice More
          </Button>
          <Button variant="outline" size="lg" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit
        </Button>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1 text-jade">
            <Target className="w-4 h-4" />
            {sessionStats.correct}
          </span>
          <span className="flex items-center gap-1 text-crimson">
            <Zap className="w-4 h-4" />
            {sessionStats.incorrect}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / sessionCards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      {currentWord && (
        <FlashCard
          key={currentWord.id}
          word={currentWord}
          onReview={handleReview}
          cardNumber={currentIndex + 1}
          totalCards={sessionCards.length}
        />
      )}
    </div>
  );
}
