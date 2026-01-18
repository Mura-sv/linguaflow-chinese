import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VocabWord } from "@/data/vocabulary";
import { Volume2, Check, X, ArrowRight, RotateCcw } from "lucide-react";

export type PracticeDirection = "chinese-to-english" | "english-to-chinese";

interface TypingCardProps {
  word: VocabWord;
  direction: PracticeDirection;
  onResult: (isCorrect: boolean) => void;
  cardNumber: number;
  totalCards: number;
}

// Normalize text for comparison (lowercase, trim, remove extra spaces)
function normalizeText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

// Remove tone marks from pinyin for more lenient matching
function removeToneMarks(pinyin: string): string {
  const toneMap: Record<string, string> = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v', 'ü': 'v',
  };
  
  return pinyin.split('').map(char => toneMap[char] || char).join('');
}

// Check if answer is correct
function checkAnswer(
  userAnswer: string,
  word: VocabWord,
  direction: PracticeDirection
): boolean {
  const normalized = normalizeText(userAnswer);
  
  if (direction === "chinese-to-english") {
    // For Chinese to English, check against English meanings
    const englishOptions = word.english.toLowerCase().split(/[,;]/).map(s => s.trim());
    return englishOptions.some(option => 
      normalized === option || option.includes(normalized) || normalized.includes(option)
    );
  } else {
    // For English to Chinese, accept either hanzi or pinyin (with or without tones)
    const hanziNormalized = normalizeText(word.hanzi);
    const pinyinNormalized = normalizeText(word.pinyin);
    const pinyinNoTones = removeToneMarks(pinyinNormalized);
    const userNoTones = removeToneMarks(normalized);
    
    return (
      normalized === hanziNormalized ||
      normalized === pinyinNormalized ||
      userNoTones === pinyinNoTones
    );
  }
}

export function TypingCard({ 
  word, 
  direction, 
  onResult, 
  cardNumber, 
  totalCards 
}: TypingCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and word change
  useEffect(() => {
    setUserAnswer("");
    setIsSubmitted(false);
    inputRef.current?.focus();
  }, [word.id, direction]);

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.hanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    
    const correct = checkAnswer(userAnswer, word, direction);
    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  const handleContinue = () => {
    onResult(isCorrect);
  };

  const handleRetry = () => {
    setUserAnswer("");
    setIsSubmitted(false);
    inputRef.current?.focus();
  };

  const hskBadgeColor = 
    word.hskLevel === 1 ? 'bg-jade-light text-jade' :
    word.hskLevel === 2 ? 'bg-gold-light text-gold' :
    'bg-crimson-light text-crimson';

  const promptText = direction === "chinese-to-english" 
    ? "Type the English meaning" 
    : "Type in Chinese (pinyin or hanzi)";

  return (
    <div className="w-full max-w-md mx-auto animate-scale-in">
      {/* Progress indicator */}
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Card {cardNumber} of {totalCards}</span>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            direction === "chinese-to-english" ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
          }`}>
            {direction === "chinese-to-english" ? "中→EN" : "EN→中"}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${hskBadgeColor}`}>
            HSK {word.hskLevel}
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="card-elevated p-8 min-h-[280px] flex flex-col items-center justify-center relative">
        {/* Prompt */}
        <div className="text-center mb-6">
          {direction === "chinese-to-english" ? (
            <>
              <p className="font-chinese text-6xl md:text-7xl font-bold text-foreground mb-4 leading-tight">
                {word.hanzi}
              </p>
              <button
                onClick={speakWord}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                <span className="text-sm">Listen</span>
              </button>
            </>
          ) : (
            <p className="text-2xl md:text-3xl font-semibold text-foreground">
              {word.english}
            </p>
          )}
        </div>

        {/* Input or Result */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="w-full max-w-xs">
            <p className="text-sm text-muted-foreground text-center mb-3">
              {promptText}
            </p>
            <Input
              ref={inputRef}
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={direction === "chinese-to-english" ? "English..." : "Pinyin or 汉字..."}
              className="text-center text-lg"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>
        ) : (
          <div className={`text-center animate-fade-in p-4 rounded-lg w-full ${
            isCorrect ? "bg-jade-light" : "bg-crimson-light"
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <Check className="w-5 h-5 text-jade" />
                  <span className="font-medium text-jade">Correct!</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-crimson" />
                  <span className="font-medium text-crimson">Not quite</span>
                </>
              )}
            </div>
            
            <div className="space-y-1 text-sm">
              {direction === "chinese-to-english" ? (
                <>
                  <p className="text-primary font-medium">{word.pinyin}</p>
                  <p className="text-foreground">{word.english}</p>
                </>
              ) : (
                <>
                  <p className="font-chinese text-2xl text-foreground">{word.hanzi}</p>
                  <p className="text-primary font-medium">{word.pinyin}</p>
                </>
              )}
              {!isCorrect && (
                <p className="text-muted-foreground mt-2">
                  Your answer: <span className="italic">{userAnswer}</span>
                </p>
              )}
            </div>
          </div>
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
        {!isSubmitted ? (
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleSubmit}
            disabled={!userAnswer.trim()}
          >
            Check Answer
          </Button>
        ) : (
          <div className="flex gap-3">
            {!isCorrect && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleRetry}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            )}
            <Button
              variant={isCorrect ? "success" : "secondary"}
              size="lg"
              className="flex-1"
              onClick={handleContinue}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
