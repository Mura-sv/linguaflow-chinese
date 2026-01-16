import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VocabWord } from "@/data/vocabulary";
import { SIMPLE_REVIEW_OPTIONS } from "@/lib/srs";
import { Volume2, Eye, EyeOff } from "lucide-react";

interface FlashCardProps {
  word: VocabWord;
  onReview: (quality: number) => void;
  cardNumber: number;
  totalCards: number;
}

export function FlashCard({ word, onReview, cardNumber, totalCards }: FlashCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleReveal = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
    }, 150);
  };

  const handleReview = (quality: number) => {
    setIsRevealed(false);
    onReview(quality);
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.hanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const hskBadgeColor = 
    word.hskLevel === 1 ? 'bg-jade-light text-jade' :
    word.hskLevel === 2 ? 'bg-gold-light text-gold' :
    'bg-crimson-light text-crimson';

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      {/* Progress indicator */}
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Card {cardNumber} of {totalCards}</span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${hskBadgeColor}`}>
          HSK {word.hskLevel}
        </span>
      </div>

      {/* Card */}
      <div 
        className={`card-elevated p-8 min-h-[320px] flex flex-col items-center justify-center relative transition-all duration-300 ${
          isFlipping ? 'scale-95 opacity-80' : ''
        }`}
      >
        {/* Chinese character */}
        <div className="text-center mb-6">
          <p className="font-chinese text-6xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
            {word.hanzi}
          </p>
          
          {/* Audio button */}
          <button
            onClick={speakWord}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Volume2 className="w-5 h-5" />
            <span className="text-sm">Listen</span>
          </button>
        </div>

        {/* Revealed content */}
        {isRevealed && (
          <div className="text-center animate-fade-in">
            <p className="text-xl text-primary font-medium mb-2">
              {word.pinyin}
            </p>
            <p className="text-lg text-muted-foreground">
              {word.english}
            </p>
          </div>
        )}

        {/* Reveal prompt */}
        {!isRevealed && (
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Tap to reveal meaning
          </p>
        )}

        {/* Category badge */}
        {word.category && (
          <div className="absolute top-4 left-4">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {word.category}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-6">
        {!isRevealed ? (
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleReveal}
          >
            Show Answer
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-muted-foreground mb-3">
              How well did you know this?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SIMPLE_REVIEW_OPTIONS.map((option) => (
                <Button
                  key={option.score}
                  variant={option.color}
                  size="lg"
                  className="flex-1"
                  onClick={() => handleReview(option.score)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
