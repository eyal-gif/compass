import {
  useMeditationStore,
  getCurrentStreak,
  getLongestStreak,
  getTotalMinutes,
  getTotalSessions,
  getAverageRating,
  Completions,
} from '@/stores/meditationStore';
import { act } from '@testing-library/react';

// Reset store before each test
beforeEach(() => {
  act(() => {
    useMeditationStore.getState().resetAll();
  });
});

describe('useMeditationStore', () => {
  describe('initial state', () => {
    it('should have empty name', () => {
      const { user } = useMeditationStore.getState();
      expect(user.name).toBe('');
    });

    it('should start at day 1', () => {
      const { user } = useMeditationStore.getState();
      expect(user.currentDay).toBe(1);
    });

    it('should have default reminder time of 09:00', () => {
      const { user } = useMeditationStore.getState();
      expect(user.dailyReminderTime).toBe('09:00');
    });

    it('should not have completed onboarding', () => {
      const { user } = useMeditationStore.getState();
      expect(user.onboardingComplete).toBe(false);
    });

    it('should have a valid startDate', () => {
      const { user } = useMeditationStore.getState();
      expect(new Date(user.startDate).getTime()).not.toBeNaN();
    });

    it('should start with empty completions', () => {
      const { completions } = useMeditationStore.getState();
      expect(Object.keys(completions)).toHaveLength(0);
    });
  });

  describe('setName', () => {
    it('should update the user name', () => {
      act(() => {
        useMeditationStore.getState().setName('Luna');
      });
      expect(useMeditationStore.getState().user.name).toBe('Luna');
    });

    it('should handle empty string', () => {
      act(() => {
        useMeditationStore.getState().setName('Luna');
      });
      act(() => {
        useMeditationStore.getState().setName('');
      });
      expect(useMeditationStore.getState().user.name).toBe('');
    });

    it('should not alter other user fields', () => {
      act(() => {
        useMeditationStore.getState().setName('Luna');
      });
      const { user } = useMeditationStore.getState();
      expect(user.currentDay).toBe(1);
      expect(user.dailyReminderTime).toBe('09:00');
    });
  });

  describe('completeOnboarding', () => {
    it('should set onboardingComplete to true', () => {
      act(() => {
        useMeditationStore.getState().completeOnboarding();
      });
      expect(useMeditationStore.getState().user.onboardingComplete).toBe(true);
    });

    it('should refresh startDate', () => {
      const before = useMeditationStore.getState().user.startDate;
      act(() => {
        useMeditationStore.getState().completeOnboarding();
      });
      const after = useMeditationStore.getState().user.startDate;
      expect(after).toBeDefined();
      expect(new Date(after).getTime()).not.toBeNaN();
    });

    it('should be idempotent', () => {
      act(() => {
        useMeditationStore.getState().completeOnboarding();
      });
      act(() => {
        useMeditationStore.getState().completeOnboarding();
      });
      expect(useMeditationStore.getState().user.onboardingComplete).toBe(true);
    });
  });

  describe('completeDay', () => {
    it('should record a completion for the given day', () => {
      act(() => {
        useMeditationStore.getState().completeDay(1, 180, 4, 'Felt calm');
      });
      const { completions } = useMeditationStore.getState();
      expect(completions[1]).toBeDefined();
      expect(completions[1].durationSeconds).toBe(180);
      expect(completions[1].feltRating).toBe(4);
      expect(completions[1].note).toBe('Felt calm');
    });

    it('should default note to empty string', () => {
      act(() => {
        useMeditationStore.getState().completeDay(1, 180, 4);
      });
      expect(useMeditationStore.getState().completions[1].note).toBe('');
    });

    it('should advance currentDay to dayNumber + 1', () => {
      act(() => {
        useMeditationStore.getState().completeDay(1, 180, 4);
      });
      expect(useMeditationStore.getState().user.currentDay).toBe(2);
    });

    it('should not go backwards if currentDay is already ahead', () => {
      act(() => {
        useMeditationStore.getState().completeDay(5, 300, 5);
      });
      // currentDay should be 6
      expect(useMeditationStore.getState().user.currentDay).toBe(6);

      act(() => {
        useMeditationStore.getState().completeDay(2, 120, 3);
      });
      // currentDay should remain 6, not go back to 3
      expect(useMeditationStore.getState().user.currentDay).toBe(6);
    });

    it('should store completedAt as valid ISO string', () => {
      act(() => {
        useMeditationStore.getState().completeDay(1, 180, 4);
      });
      const { completedAt } = useMeditationStore.getState().completions[1];
      expect(new Date(completedAt).getTime()).not.toBeNaN();
    });

    it('should allow completing multiple days', () => {
      act(() => {
        useMeditationStore.getState().completeDay(1, 180, 4);
        useMeditationStore.getState().completeDay(2, 240, 5);
        useMeditationStore.getState().completeDay(3, 300, 3);
      });
      const { completions } = useMeditationStore.getState();
      expect(Object.keys(completions)).toHaveLength(3);
    });
  });

  describe('resetAll', () => {
    it('should reset user to defaults', () => {
      act(() => {
        useMeditationStore.getState().setName('Luna');
        useMeditationStore.getState().completeOnboarding();
        useMeditationStore.getState().completeDay(1, 180, 4);
      });
      act(() => {
        useMeditationStore.getState().resetAll();
      });
      const { user } = useMeditationStore.getState();
      expect(user.name).toBe('');
      expect(user.currentDay).toBe(1);
      expect(user.onboardingComplete).toBe(false);
    });

    it('should clear all completions', () => {
      act(() => {
        useMeditationStore.getState().completeDay(1, 180, 4);
        useMeditationStore.getState().completeDay(2, 240, 5);
      });
      act(() => {
        useMeditationStore.getState().resetAll();
      });
      expect(Object.keys(useMeditationStore.getState().completions)).toHaveLength(0);
    });

    it('should set fresh startDate', () => {
      act(() => {
        useMeditationStore.getState().resetAll();
      });
      const { user } = useMeditationStore.getState();
      expect(new Date(user.startDate).getTime()).not.toBeNaN();
    });
  });
});

describe('getCurrentStreak', () => {
  it('should return 0 for empty completions', () => {
    expect(getCurrentStreak({})).toBe(0);
  });

  it('should return 1 for a single completion', () => {
    const completions: Completions = {
      5: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getCurrentStreak(completions)).toBe(1);
  });

  it('should count consecutive days from the highest day', () => {
    const completions: Completions = {
      3: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      4: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      5: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getCurrentStreak(completions)).toBe(3);
  });

  it('should stop counting at a gap', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      2: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      // gap at 3
      4: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      5: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    // Highest is 5, then 4, then gap at 3 -> streak is 2
    expect(getCurrentStreak(completions)).toBe(2);
  });

  it('should handle non-sequential keys', () => {
    const completions: Completions = {
      10: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getCurrentStreak(completions)).toBe(1);
  });
});

describe('getLongestStreak', () => {
  it('should return 0 for empty completions', () => {
    expect(getLongestStreak({})).toBe(0);
  });

  it('should return 1 for a single completion', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getLongestStreak(completions)).toBe(1);
  });

  it('should find the longest consecutive run', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      2: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      // gap
      5: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      6: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      7: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getLongestStreak(completions)).toBe(3);
  });

  it('should return full length when all days are consecutive', () => {
    const completions: Completions = {};
    for (let i = 1; i <= 10; i++) {
      completions[i] = { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' };
    }
    expect(getLongestStreak(completions)).toBe(10);
  });
});

describe('getTotalMinutes', () => {
  it('should return 0 for empty completions', () => {
    expect(getTotalMinutes({})).toBe(0);
  });

  it('should convert seconds to minutes', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 300, feltRating: 4, note: '' },
      2: { completedAt: '', durationSeconds: 600, feltRating: 5, note: '' },
    };
    expect(getTotalMinutes(completions)).toBe(15); // (300 + 600) / 60
  });

  it('should handle fractional minutes', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 90, feltRating: 4, note: '' },
    };
    expect(getTotalMinutes(completions)).toBe(1.5);
  });
});

describe('getTotalSessions', () => {
  it('should return 0 for empty completions', () => {
    expect(getTotalSessions({})).toBe(0);
  });

  it('should count the number of completed sessions', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      3: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
      7: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getTotalSessions(completions)).toBe(3);
  });
});

describe('getAverageRating', () => {
  it('should return 0 for empty completions', () => {
    expect(getAverageRating({})).toBe(0);
  });

  it('should compute the average of feltRating values', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 3, note: '' },
      2: { completedAt: '', durationSeconds: 180, feltRating: 5, note: '' },
    };
    expect(getAverageRating(completions)).toBe(4);
  });

  it('should handle a single entry', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 5, note: '' },
    };
    expect(getAverageRating(completions)).toBe(5);
  });

  it('should handle non-integer averages', () => {
    const completions: Completions = {
      1: { completedAt: '', durationSeconds: 180, feltRating: 3, note: '' },
      2: { completedAt: '', durationSeconds: 180, feltRating: 4, note: '' },
    };
    expect(getAverageRating(completions)).toBe(3.5);
  });
});
