// SM-2 Spaced Repetition Algorithm Implementation
// Based on the SuperMemo SM-2 algorithm with modifications for language learning

export interface CardProgress {
  wordId: string;
  easeFactor: number; // Default 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReviewDate: Date;
  lastReviewDate: Date | null;
}

export interface ReviewQuality {
  score: 0 | 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
}

export const REVIEW_QUALITIES: ReviewQuality[] = [
  { score: 0, label: "Forgot", description: "Complete blackout" },
  { score: 1, label: "Wrong", description: "Incorrect but remembered after seeing" },
  { score: 2, label: "Hard", description: "Correct with serious difficulty" },
  { score: 3, label: "Good", description: "Correct with some hesitation" },
  { score: 4, label: "Easy", description: "Correct with little effort" },
  { score: 5, label: "Perfect", description: "Instant recall" },
];

// Simplified review options for better UX
export const SIMPLE_REVIEW_OPTIONS = [
  { score: 1 as const, label: "Again", color: "destructive" as const },
  { score: 3 as const, label: "Hard", color: "warning" as const },
  { score: 4 as const, label: "Good", color: "secondary" as const },
  { score: 5 as const, label: "Easy", color: "success" as const },
];

export function createNewCardProgress(wordId: string): CardProgress {
  return {
    wordId,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewDate: new Date(),
    lastReviewDate: null,
  };
}

export function calculateNextReview(
  progress: CardProgress,
  quality: number
): CardProgress {
  const { easeFactor, interval, repetitions } = progress;
  
  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  if (quality < 3) {
    // Failed review - reset progress
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
  } else {
    // Successful review
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }

    // Update ease factor
    newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Minimum ease factor is 1.3
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    ...progress,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReviewDate,
    lastReviewDate: new Date(),
  };
}

export function isDueForReview(progress: CardProgress): boolean {
  return new Date() >= progress.nextReviewDate;
}

export function getCardsForReview(
  allProgress: CardProgress[],
  limit: number = 20
): CardProgress[] {
  const dueCards = allProgress
    .filter(isDueForReview)
    .sort((a, b) => {
      // Prioritize cards that are more overdue
      const aOverdue = new Date().getTime() - a.nextReviewDate.getTime();
      const bOverdue = new Date().getTime() - b.nextReviewDate.getTime();
      return bOverdue - aOverdue;
    });

  return dueCards.slice(0, limit);
}

export function getNewCards(
  allWordIds: string[],
  existingProgress: CardProgress[],
  limit: number = 10
): string[] {
  const existingIds = new Set(existingProgress.map(p => p.wordId));
  const newWordIds = allWordIds.filter(id => !existingIds.has(id));
  return newWordIds.slice(0, limit);
}

// Storage helpers
const STORAGE_KEY = "chinese_srs_progress";

export function loadProgress(): CardProgress[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((p: any) => ({
      ...p,
      nextReviewDate: new Date(p.nextReviewDate),
      lastReviewDate: p.lastReviewDate ? new Date(p.lastReviewDate) : null,
    }));
  } catch {
    return [];
  }
}

export function saveProgress(progress: CardProgress[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function updateCardProgress(
  allProgress: CardProgress[],
  wordId: string,
  quality: number
): CardProgress[] {
  const existingIndex = allProgress.findIndex(p => p.wordId === wordId);
  
  if (existingIndex >= 0) {
    const updated = calculateNextReview(allProgress[existingIndex], quality);
    const newProgress = [...allProgress];
    newProgress[existingIndex] = updated;
    return newProgress;
  } else {
    const newCard = createNewCardProgress(wordId);
    const updated = calculateNextReview(newCard, quality);
    return [...allProgress, updated];
  }
}

// Statistics
export interface StudyStats {
  totalCards: number;
  cardsLearned: number;
  cardsDue: number;
  averageEase: number;
  streakDays: number;
}

export function calculateStats(progress: CardProgress[]): StudyStats {
  const now = new Date();
  const cardsDue = progress.filter(p => isDueForReview(p)).length;
  const cardsLearned = progress.filter(p => p.repetitions >= 2).length;
  
  const avgEase = progress.length > 0
    ? progress.reduce((sum, p) => sum + p.easeFactor, 0) / progress.length
    : 2.5;

  return {
    totalCards: progress.length,
    cardsLearned,
    cardsDue,
    averageEase: Math.round(avgEase * 100) / 100,
    streakDays: 0, // TODO: Implement streak tracking
  };
}
