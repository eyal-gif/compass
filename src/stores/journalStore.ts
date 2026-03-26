import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JournalEntry, DayCompletion, Discovery } from '@/types';

interface JournalState {
  entries: JournalEntry[];
  completions: DayCompletion[];
  discoveries: Discovery[];
  addEntry: (entry: JournalEntry) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  completeDay: (completion: DayCompletion) => void;
  skipDay: (dayNumber: number, reason?: string) => void;
  addDiscovery: (discovery: Discovery) => void;
  toggleDiscoveryPin: (id: string) => void;
  getEntriesForDay: (dayNumber: number) => JournalEntry[];
  getCompletionForDay: (dayNumber: number) => DayCompletion | undefined;
  resetAll: () => void;
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      completions: [],
      discoveries: [],

      addEntry: (entry) =>
        set((state) => ({
          entries: [...state.entries, entry],
        })),

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
        })),

      completeDay: (completion) =>
        set((state) => ({
          completions: [
            ...state.completions.filter(
              (c) => c.dayNumber !== completion.dayNumber
            ),
            completion,
          ],
        })),

      skipDay: (dayNumber, reason) =>
        set((state) => ({
          completions: [
            ...state.completions.filter((c) => c.dayNumber !== dayNumber),
            {
              dayNumber,
              completedAt: new Date().toISOString(),
              journalEntries: [],
              videoWatched: false,
              actionCompleted: false,
              skipped: true,
              skipReason: reason,
            },
          ],
        })),

      addDiscovery: (discovery) =>
        set((state) => ({
          discoveries: [...state.discoveries, discovery],
        })),

      toggleDiscoveryPin: (id) =>
        set((state) => ({
          discoveries: state.discoveries.map((d) =>
            d.id === id ? { ...d, pinned: !d.pinned } : d
          ),
        })),

      getEntriesForDay: (dayNumber) =>
        get().entries.filter((entry) => entry.dayNumber === dayNumber),

      getCompletionForDay: (dayNumber) =>
        get().completions.find((c) => c.dayNumber === dayNumber),

      resetAll: () =>
        set({
          entries: [],
          completions: [],
          discoveries: [],
        }),
    }),
    {
      name: 'compass-journal',
    }
  )
);
