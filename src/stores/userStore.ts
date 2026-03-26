import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';

interface UserState {
  profile: UserProfile;
  setName: (name: string) => void;
  completeOnboarding: () => void;
  setDailyReminderTime: (time: string) => void;
  toggleMarcusNudges: () => void;
  toggleWeeklyPatternAnalysis: () => void;
  setWritingFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleDarkModeWriting: () => void;
  advanceDay: () => void;
  resetAll: () => void;
}

const defaultProfile: UserProfile = {
  id: crypto.randomUUID(),
  name: '',
  startDate: new Date().toISOString(),
  currentDay: 1,
  currentWeek: 1,
  dailyReminderTime: '09:00',
  marcusNudgesEnabled: true,
  weeklyPatternAnalysis: true,
  writingFontSize: 'medium',
  darkModeWriting: false,
  onboardingComplete: false,
  createdAt: new Date().toISOString(),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: { ...defaultProfile },

      setName: (name) =>
        set((state) => ({
          profile: { ...state.profile, name },
        })),

      completeOnboarding: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            onboardingComplete: true,
            startDate: new Date().toISOString(),
          },
        })),

      setDailyReminderTime: (time) =>
        set((state) => ({
          profile: { ...state.profile, dailyReminderTime: time },
        })),

      toggleMarcusNudges: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            marcusNudgesEnabled: !state.profile.marcusNudgesEnabled,
          },
        })),

      toggleWeeklyPatternAnalysis: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            weeklyPatternAnalysis: !state.profile.weeklyPatternAnalysis,
          },
        })),

      setWritingFontSize: (size) =>
        set((state) => ({
          profile: { ...state.profile, writingFontSize: size },
        })),

      toggleDarkModeWriting: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            darkModeWriting: !state.profile.darkModeWriting,
          },
        })),

      advanceDay: () =>
        set((state) => {
          const nextDay = state.profile.currentDay + 1;
          const nextWeek = Math.ceil(nextDay / 7);
          return {
            profile: {
              ...state.profile,
              currentDay: nextDay,
              currentWeek: nextWeek,
            },
          };
        }),

      resetAll: () =>
        set({
          profile: {
            ...defaultProfile,
            id: crypto.randomUUID(),
            startDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        }),
    }),
    {
      name: 'compass-user',
    }
  )
);
