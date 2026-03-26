import { useJournalStore } from '@/stores/journalStore';
import { JournalEntry, DayCompletion, Discovery } from '@/types';
import { act } from '@testing-library/react';

function makeEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id: crypto.randomUUID(),
    dayNumber: 1,
    promptId: 'prompt-1',
    content: 'Today I reflected on my values.',
    wordCount: 6,
    writingDurationSeconds: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeCompletion(overrides: Partial<DayCompletion> = {}): DayCompletion {
  return {
    dayNumber: 1,
    completedAt: new Date().toISOString(),
    journalEntries: ['entry-1'],
    videoWatched: true,
    actionCompleted: true,
    skipped: false,
    ...overrides,
  };
}

function makeDiscovery(overrides: Partial<Discovery> = {}): Discovery {
  return {
    id: crypto.randomUUID(),
    dayNumber: 1,
    content: 'I realize I value creative freedom.',
    category: 'value',
    source: 'journal',
    pinned: false,
    ...overrides,
  };
}

beforeEach(() => {
  act(() => {
    useJournalStore.getState().resetAll();
  });
});

describe('useJournalStore', () => {
  describe('initial state', () => {
    it('should start with empty entries', () => {
      expect(useJournalStore.getState().entries).toEqual([]);
    });

    it('should start with empty completions', () => {
      expect(useJournalStore.getState().completions).toEqual([]);
    });

    it('should start with empty discoveries', () => {
      expect(useJournalStore.getState().discoveries).toEqual([]);
    });
  });

  describe('addEntry', () => {
    it('should add a journal entry', () => {
      const entry = makeEntry();
      act(() => {
        useJournalStore.getState().addEntry(entry);
      });
      expect(useJournalStore.getState().entries).toHaveLength(1);
      expect(useJournalStore.getState().entries[0]).toEqual(entry);
    });

    it('should add multiple entries', () => {
      const entry1 = makeEntry({ id: 'e1', dayNumber: 1 });
      const entry2 = makeEntry({ id: 'e2', dayNumber: 2 });
      act(() => {
        useJournalStore.getState().addEntry(entry1);
        useJournalStore.getState().addEntry(entry2);
      });
      expect(useJournalStore.getState().entries).toHaveLength(2);
    });

    it('should preserve existing entries when adding new ones', () => {
      const entry1 = makeEntry({ id: 'e1' });
      const entry2 = makeEntry({ id: 'e2' });
      act(() => {
        useJournalStore.getState().addEntry(entry1);
      });
      act(() => {
        useJournalStore.getState().addEntry(entry2);
      });
      expect(useJournalStore.getState().entries[0].id).toBe('e1');
      expect(useJournalStore.getState().entries[1].id).toBe('e2');
    });

    it('should allow duplicate entries with the same dayNumber', () => {
      const entry1 = makeEntry({ id: 'e1', dayNumber: 1, promptId: 'p1' });
      const entry2 = makeEntry({ id: 'e2', dayNumber: 1, promptId: 'p2' });
      act(() => {
        useJournalStore.getState().addEntry(entry1);
        useJournalStore.getState().addEntry(entry2);
      });
      expect(useJournalStore.getState().entries).toHaveLength(2);
    });
  });

  describe('updateEntry', () => {
    it('should update content of an existing entry', () => {
      const entry = makeEntry({ id: 'update-test' });
      act(() => {
        useJournalStore.getState().addEntry(entry);
      });
      act(() => {
        useJournalStore.getState().updateEntry('update-test', { content: 'Updated content' });
      });
      expect(useJournalStore.getState().entries[0].content).toBe('Updated content');
    });

    it('should update the updatedAt timestamp', () => {
      const entry = makeEntry({ id: 'ts-test', updatedAt: '2024-01-01T00:00:00.000Z' });
      act(() => {
        useJournalStore.getState().addEntry(entry);
      });
      act(() => {
        useJournalStore.getState().updateEntry('ts-test', { content: 'New' });
      });
      const updated = useJournalStore.getState().entries[0];
      expect(updated.updatedAt).not.toBe('2024-01-01T00:00:00.000Z');
    });

    it('should not modify other entries', () => {
      const entry1 = makeEntry({ id: 'e1', content: 'Original 1' });
      const entry2 = makeEntry({ id: 'e2', content: 'Original 2' });
      act(() => {
        useJournalStore.getState().addEntry(entry1);
        useJournalStore.getState().addEntry(entry2);
      });
      act(() => {
        useJournalStore.getState().updateEntry('e1', { content: 'Changed' });
      });
      expect(useJournalStore.getState().entries[1].content).toBe('Original 2');
    });

    it('should handle updating a non-existent entry gracefully', () => {
      act(() => {
        useJournalStore.getState().updateEntry('non-existent', { content: 'test' });
      });
      expect(useJournalStore.getState().entries).toHaveLength(0);
    });

    it('should allow partial updates (only wordCount)', () => {
      const entry = makeEntry({ id: 'partial', wordCount: 10 });
      act(() => {
        useJournalStore.getState().addEntry(entry);
      });
      act(() => {
        useJournalStore.getState().updateEntry('partial', { wordCount: 50 });
      });
      const updated = useJournalStore.getState().entries[0];
      expect(updated.wordCount).toBe(50);
      expect(updated.content).toBe(entry.content);
    });
  });

  describe('completeDay', () => {
    it('should add a day completion', () => {
      const completion = makeCompletion({ dayNumber: 1 });
      act(() => {
        useJournalStore.getState().completeDay(completion);
      });
      expect(useJournalStore.getState().completions).toHaveLength(1);
      expect(useJournalStore.getState().completions[0]).toEqual(completion);
    });

    it('should replace existing completion for the same day', () => {
      const completion1 = makeCompletion({ dayNumber: 1, videoWatched: false });
      const completion2 = makeCompletion({ dayNumber: 1, videoWatched: true });
      act(() => {
        useJournalStore.getState().completeDay(completion1);
      });
      act(() => {
        useJournalStore.getState().completeDay(completion2);
      });
      expect(useJournalStore.getState().completions).toHaveLength(1);
      expect(useJournalStore.getState().completions[0].videoWatched).toBe(true);
    });

    it('should allow completions for different days', () => {
      act(() => {
        useJournalStore.getState().completeDay(makeCompletion({ dayNumber: 1 }));
        useJournalStore.getState().completeDay(makeCompletion({ dayNumber: 2 }));
      });
      expect(useJournalStore.getState().completions).toHaveLength(2);
    });
  });

  describe('skipDay', () => {
    it('should create a skipped completion', () => {
      act(() => {
        useJournalStore.getState().skipDay(3, 'Feeling unwell');
      });
      const completions = useJournalStore.getState().completions;
      expect(completions).toHaveLength(1);
      expect(completions[0].dayNumber).toBe(3);
      expect(completions[0].skipped).toBe(true);
      expect(completions[0].skipReason).toBe('Feeling unwell');
    });

    it('should set default values for skipped day', () => {
      act(() => {
        useJournalStore.getState().skipDay(2);
      });
      const completion = useJournalStore.getState().completions[0];
      expect(completion.journalEntries).toEqual([]);
      expect(completion.videoWatched).toBe(false);
      expect(completion.actionCompleted).toBe(false);
    });

    it('should replace existing completion when skipping', () => {
      act(() => {
        useJournalStore.getState().completeDay(makeCompletion({ dayNumber: 5 }));
      });
      act(() => {
        useJournalStore.getState().skipDay(5, 'Changed my mind');
      });
      expect(useJournalStore.getState().completions).toHaveLength(1);
      expect(useJournalStore.getState().completions[0].skipped).toBe(true);
    });

    it('should handle skip without reason', () => {
      act(() => {
        useJournalStore.getState().skipDay(4);
      });
      expect(useJournalStore.getState().completions[0].skipReason).toBeUndefined();
    });
  });

  describe('addDiscovery', () => {
    it('should add a discovery', () => {
      const discovery = makeDiscovery();
      act(() => {
        useJournalStore.getState().addDiscovery(discovery);
      });
      expect(useJournalStore.getState().discoveries).toHaveLength(1);
    });

    it('should add multiple discoveries', () => {
      act(() => {
        useJournalStore.getState().addDiscovery(makeDiscovery({ id: 'd1' }));
        useJournalStore.getState().addDiscovery(makeDiscovery({ id: 'd2' }));
      });
      expect(useJournalStore.getState().discoveries).toHaveLength(2);
    });
  });

  describe('toggleDiscoveryPin', () => {
    it('should pin an unpinned discovery', () => {
      const discovery = makeDiscovery({ id: 'pin-test', pinned: false });
      act(() => {
        useJournalStore.getState().addDiscovery(discovery);
      });
      act(() => {
        useJournalStore.getState().toggleDiscoveryPin('pin-test');
      });
      expect(useJournalStore.getState().discoveries[0].pinned).toBe(true);
    });

    it('should unpin a pinned discovery', () => {
      const discovery = makeDiscovery({ id: 'unpin-test', pinned: true });
      act(() => {
        useJournalStore.getState().addDiscovery(discovery);
      });
      act(() => {
        useJournalStore.getState().toggleDiscoveryPin('unpin-test');
      });
      expect(useJournalStore.getState().discoveries[0].pinned).toBe(false);
    });

    it('should only toggle the targeted discovery', () => {
      const d1 = makeDiscovery({ id: 'd1', pinned: false });
      const d2 = makeDiscovery({ id: 'd2', pinned: false });
      act(() => {
        useJournalStore.getState().addDiscovery(d1);
        useJournalStore.getState().addDiscovery(d2);
      });
      act(() => {
        useJournalStore.getState().toggleDiscoveryPin('d1');
      });
      expect(useJournalStore.getState().discoveries[0].pinned).toBe(true);
      expect(useJournalStore.getState().discoveries[1].pinned).toBe(false);
    });
  });

  describe('getEntriesForDay', () => {
    it('should return entries for a specific day', () => {
      act(() => {
        useJournalStore.getState().addEntry(makeEntry({ id: 'e1', dayNumber: 1 }));
        useJournalStore.getState().addEntry(makeEntry({ id: 'e2', dayNumber: 2 }));
        useJournalStore.getState().addEntry(makeEntry({ id: 'e3', dayNumber: 1 }));
      });
      const dayOneEntries = useJournalStore.getState().getEntriesForDay(1);
      expect(dayOneEntries).toHaveLength(2);
      expect(dayOneEntries.map(e => e.id)).toEqual(['e1', 'e3']);
    });

    it('should return empty array for a day with no entries', () => {
      expect(useJournalStore.getState().getEntriesForDay(99)).toEqual([]);
    });
  });

  describe('getCompletionForDay', () => {
    it('should return completion for a specific day', () => {
      act(() => {
        useJournalStore.getState().completeDay(makeCompletion({ dayNumber: 3 }));
      });
      const completion = useJournalStore.getState().getCompletionForDay(3);
      expect(completion).toBeDefined();
      expect(completion!.dayNumber).toBe(3);
    });

    it('should return undefined for an incomplete day', () => {
      expect(useJournalStore.getState().getCompletionForDay(10)).toBeUndefined();
    });
  });

  describe('resetAll', () => {
    it('should clear all entries, completions, and discoveries', () => {
      act(() => {
        useJournalStore.getState().addEntry(makeEntry());
        useJournalStore.getState().completeDay(makeCompletion());
        useJournalStore.getState().addDiscovery(makeDiscovery());
      });
      act(() => {
        useJournalStore.getState().resetAll();
      });
      const state = useJournalStore.getState();
      expect(state.entries).toEqual([]);
      expect(state.completions).toEqual([]);
      expect(state.discoveries).toEqual([]);
    });
  });
});
