import { useMemo } from "react";
import { Sparkles, Flame, Clock, BookOpen } from "lucide-react";
import { LastSessionData, CardProgress, getAlmostMasteredCards, getNearMissCards } from "@/lib/srs";
import { VocabWord } from "@/data/vocabulary";

interface PersonalizedWelcomeProps {
  lastSession: LastSessionData | null;
  progress: CardProgress[];
  vocabulary: VocabWord[];
}

export function PersonalizedWelcome({ lastSession, progress, vocabulary }: PersonalizedWelcomeProps) {
  const welcomeData = useMemo(() => {
    const nearMissCards = getNearMissCards(progress, 3);
    const almostMastered = getAlmostMasteredCards(progress).slice(0, 3);
    
    // Find the actual words
    const nearMissWords = nearMissCards
      .map(p => vocabulary.find(v => v.id === p.wordId))
      .filter((w): w is VocabWord => w !== undefined);
    
    const almostMasteredWords = almostMastered
      .map(p => vocabulary.find(v => v.id === p.wordId))
      .filter((w): w is VocabWord => w !== undefined);

    // Determine message type
    if (lastSession && nearMissWords.length > 0) {
      return {
        type: "near-miss",
        icon: Sparkles,
        color: "text-gold",
        bgColor: "bg-gold-light",
        title: "Welcome back!",
        message: "Yesterday you almost mastered:",
        words: nearMissWords,
      };
    }
    
    if (almostMasteredWords.length > 0) {
      return {
        type: "almost-mastered",
        icon: Flame,
        color: "text-crimson",
        bgColor: "bg-crimson-light",
        title: "So close!",
        message: "These words are almost mastered:",
        words: almostMasteredWords,
      };
    }

    if (lastSession && lastSession.wordsReviewed > 0) {
      return {
        type: "returning",
        icon: Clock,
        color: "text-jade",
        bgColor: "bg-jade-light",
        title: "Ready to continue?",
        message: `Last session: ${lastSession.wordsReviewed} words reviewed`,
        words: [],
      };
    }

    return {
      type: "new",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      title: "Start your journey",
      message: "Build your Chinese vocabulary with spaced repetition",
      words: [],
    };
  }, [lastSession, progress, vocabulary]);

  const Icon = welcomeData.icon;

  if (welcomeData.type === "new" && !lastSession) {
    return null; // Don't show for brand new users
  }

  return (
    <div className={`${welcomeData.bgColor} rounded-xl p-4 mb-6 animate-fade-in`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-background/50`}>
          <Icon className={`w-5 h-5 ${welcomeData.color}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${welcomeData.color} mb-1`}>
            {welcomeData.title}
          </h3>
          <p className="text-sm text-foreground/70 mb-2">
            {welcomeData.message}
          </p>
          
          {welcomeData.words.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {welcomeData.words.map(word => (
                <span 
                  key={word.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-background/70 rounded-md text-sm"
                >
                  <span className="font-chinese font-medium">{word.hanzi}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{word.english.split(',')[0]}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
