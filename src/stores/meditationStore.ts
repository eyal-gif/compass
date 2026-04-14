import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { safeLocalStorage } from '@/lib/safe-storage';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MeditationUser {
  name: string;
  startDate: string;
  currentDay: number;
  dailyReminderTime: string;
  onboardingComplete: boolean;
}

export interface DayCompletion {
  completedAt: string;
  durationSeconds: number;
  feltRating: number;
  note: string;
}

export type Completions = Record<number, DayCompletion>;

// ---------------------------------------------------------------------------
// State & actions
// ---------------------------------------------------------------------------

interface MeditationState {
  user: MeditationUser;
  completions: Completions;

  // Actions
  setName: (name: string) => void;
  completeOnboarding: () => void;
  completeDay: (
    dayNumber: number,
    durationSeconds: number,
    feltRating: number,
    note?: string,
  ) => void;
  resetAll: () => void;
}

const defaultUser: MeditationUser = {
  name: '',
  startDate: new Date().toISOString(),
  currentDay: 1,
  dailyReminderTime: '09:00',
  onboardingComplete: false,
};

// ---------------------------------------------------------------------------
// Store (Zustand 5 + persist)
// ---------------------------------------------------------------------------

export const useMeditationStore = create<MeditationState>()(
  persist(
    (set) => ({
      user: { ...defaultUser },
      completions: {},

      setName: (name) =>
        set((state) => ({
          user: { ...state.user, name },
        })),

      completeOnboarding: () =>
        set((state) => ({
          user: {
            ...state.user,
            onboardingComplete: true,
            startDate: new Date().toISOString(),
          },
        })),

      completeDay: (dayNumber, durationSeconds, feltRating, note = '') =>
        set((state) => ({
          completions: {
            ...state.completions,
            [dayNumber]: {
              completedAt: new Date().toISOString(),
              durationSeconds,
              feltRating,
              note,
            },
          },
          user: {
            ...state.user,
            currentDay: Math.max(state.user.currentDay, dayNumber + 1),
          },
        })),

      resetAll: () =>
        set({
          user: {
            ...defaultUser,
            startDate: new Date().toISOString(),
          },
          completions: {},
        }),
    }),
    {
      name: 'meditation-progress',
      storage: safeLocalStorage,
      // Skip hydration on the server — the store initialises with defaults and
      // rehydrates on the client after mount, avoiding SSR/client mismatches.
      skipHydration: true,
    },
  ),
);

// ---------------------------------------------------------------------------
// Derived getters (pure functions — SSR-safe, easy to test)
// ---------------------------------------------------------------------------

/**
 * Count consecutive completed days ending at today (based on startDate).
 * Days are 1-indexed: day 1 is the startDate.
 */
export function getCurrentStreak(completions: Completions): number {
  const days = Object.keys(completions)
    .map(Number)
    .sort((a, b) => b - a); // descending

  if (days.length === 0) return 0;

  let streak = 0;
  // Walk backwards from the highest completed day
  let expected = days[0];
  for (const day of days) {
    if (day === expected) {
      streak++;
      expected--;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Longest streak of consecutively completed days ever.
 */
export function getLongestStreak(completions: Completions): number {
  const days = Object.keys(completions)
    .map(Number)
    .sort((a, b) => a - b); // ascending

  if (days.length === 0) return 0;

  let longest = 1;
  let current = 1;

  for (let i = 1; i < days.length; i++) {
    if (days[i] === days[i - 1] + 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Total meditation time in minutes across all sessions.
 */
export function getTotalMinutes(completions: Completions): number {
  return (
    Object.values(completions).reduce((sum, c) => sum + c.durationSeconds, 0) /
    60
  );
}

/**
 * Number of completed sessions.
 */
export function getTotalSessions(completions: Completions): number {
  return Object.keys(completions).length;
}

/**
 * Average feltRating across all completed sessions (0 if none).
 */
export function getAverageRating(completions: Completions): number {
  const entries = Object.values(completions);
  if (entries.length === 0) return 0;
  return entries.reduce((sum, c) => sum + c.feltRating, 0) / entries.length;
}
