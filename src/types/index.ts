export type Phase = 'excavation' | 'clarity' | 'vision' | 'decision';
export type DayType = 'journal' | 'video_journal' | 'action' | 'rest' | 'synthesis';
export type DiscoveryCategory = 'value' | 'strength' | 'energy' | 'pattern' | 'why' | 'fear' | 'decision';
export type DiscoverySource = 'journal' | 'exercise' | 'conversation' | 'marcus';

export interface UserProfile {
  id: string;
  name: string;
  startDate: string;
  currentDay: number;
  currentWeek: number;
  dailyReminderTime: string;
  marcusNudgesEnabled: boolean;
  weeklyPatternAnalysis: boolean;
  writingFontSize: 'small' | 'medium' | 'large';
  darkModeWriting: boolean;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface VideoContent {
  title: string;
  speaker: string;
  youtubeId: string;
  durationMinutes: number;
  preWatchNote: string;
  postWatchPrompts: string[];
}

export interface JournalPrompt {
  id: string;
  text: string;
  subPrompts?: string[];
  estimatedMinutes: number;
}

export interface ActionStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface DayContent {
  dayNumber: number;
  week: number;
  phase: Phase;
  title: string;
  subtitle?: string;
  type: DayType;
  estimatedMinutes: number;
  marcusIntro: string;
  marcusNudge?: string;
  marcusClose?: string;
  video?: VideoContent;
  prompts?: JournalPrompt[];
  actionSteps?: ActionStep[];
  afterNote?: string;
  isRestDay: boolean;
  requiresOtherPerson: boolean;
}

export interface JournalEntry {
  id: string;
  dayNumber: number;
  promptId?: string;
  content: string;
  wordCount: number;
  writingDurationSeconds: number;
  createdAt: string;
  updatedAt: string;
  highlights?: string[];
  tags?: string[];
}

export interface DayCompletion {
  dayNumber: number;
  completedAt: string;
  journalEntries: string[];
  videoWatched: boolean;
  actionCompleted: boolean;
  skipped: boolean;
  skipReason?: string;
}

export interface WeeklyReview {
  week: number;
  daysCompleted: number;
  totalWords: number;
  videosWatched: number;
  patterns: string[];
  whyDraft?: string;
  marcusSummary: string;
  generatedAt: string;
}

export interface Discovery {
  id: string;
  dayNumber: number;
  content: string;
  category: DiscoveryCategory;
  source: DiscoverySource;
  pinned: boolean;
}

export interface IkigaiMap {
  love: string[];
  goodAt: string[];
  needed: string[];
  paidFor: string[];
}
