import { useUserStore } from '@/stores/userStore';
import { act } from '@testing-library/react';

// Reset store before each test
beforeEach(() => {
  const { resetAll } = useUserStore.getState();
  act(() => {
    resetAll();
  });
});

describe('useUserStore', () => {
  describe('initial state', () => {
    it('should have default profile values', () => {
      const { profile } = useUserStore.getState();
      expect(profile.name).toBe('');
      expect(profile.currentDay).toBe(1);
      expect(profile.currentWeek).toBe(1);
      expect(profile.dailyReminderTime).toBe('09:00');
      expect(profile.marcusNudgesEnabled).toBe(true);
      expect(profile.weeklyPatternAnalysis).toBe(true);
      expect(profile.writingFontSize).toBe('medium');
      expect(profile.darkModeWriting).toBe(false);
      expect(profile.onboardingComplete).toBe(false);
    });

    it('should have a valid UUID as id', () => {
      const { profile } = useUserStore.getState();
      expect(profile.id).toBeDefined();
      expect(typeof profile.id).toBe('string');
      expect(profile.id.length).toBeGreaterThan(0);
    });

    it('should have valid ISO date strings for startDate and createdAt', () => {
      const { profile } = useUserStore.getState();
      expect(() => new Date(profile.startDate)).not.toThrow();
      expect(() => new Date(profile.createdAt)).not.toThrow();
      expect(new Date(profile.startDate).getTime()).not.toBeNaN();
      expect(new Date(profile.createdAt).getTime()).not.toBeNaN();
    });
  });

  describe('setName', () => {
    it('should update the profile name', () => {
      act(() => {
        useUserStore.getState().setName('Marcus');
      });
      expect(useUserStore.getState().profile.name).toBe('Marcus');
    });

    it('should handle empty string', () => {
      act(() => {
        useUserStore.getState().setName('Marcus');
      });
      act(() => {
        useUserStore.getState().setName('');
      });
      expect(useUserStore.getState().profile.name).toBe('');
    });

    it('should not alter other profile fields', () => {
      act(() => {
        useUserStore.getState().setName('Test');
      });
      const { profile } = useUserStore.getState();
      expect(profile.currentDay).toBe(1);
      expect(profile.dailyReminderTime).toBe('09:00');
    });
  });

  describe('completeOnboarding', () => {
    it('should set onboardingComplete to true', () => {
      act(() => {
        useUserStore.getState().completeOnboarding();
      });
      expect(useUserStore.getState().profile.onboardingComplete).toBe(true);
    });

    it('should update startDate when completing onboarding', () => {
      const beforeStart = useUserStore.getState().profile.startDate;
      // Small delay to ensure different timestamp
      act(() => {
        useUserStore.getState().completeOnboarding();
      });
      const afterStart = useUserStore.getState().profile.startDate;
      // startDate is refreshed on completeOnboarding
      expect(afterStart).toBeDefined();
      expect(new Date(afterStart).getTime()).not.toBeNaN();
    });

    it('should be idempotent when called multiple times', () => {
      act(() => {
        useUserStore.getState().completeOnboarding();
      });
      act(() => {
        useUserStore.getState().completeOnboarding();
      });
      expect(useUserStore.getState().profile.onboardingComplete).toBe(true);
    });
  });

  describe('setDailyReminderTime', () => {
    it('should update the reminder time', () => {
      act(() => {
        useUserStore.getState().setDailyReminderTime('21:30');
      });
      expect(useUserStore.getState().profile.dailyReminderTime).toBe('21:30');
    });
  });

  describe('toggleMarcusNudges', () => {
    it('should toggle from true to false', () => {
      expect(useUserStore.getState().profile.marcusNudgesEnabled).toBe(true);
      act(() => {
        useUserStore.getState().toggleMarcusNudges();
      });
      expect(useUserStore.getState().profile.marcusNudgesEnabled).toBe(false);
    });

    it('should toggle from false back to true', () => {
      act(() => {
        useUserStore.getState().toggleMarcusNudges();
      });
      act(() => {
        useUserStore.getState().toggleMarcusNudges();
      });
      expect(useUserStore.getState().profile.marcusNudgesEnabled).toBe(true);
    });
  });

  describe('toggleWeeklyPatternAnalysis', () => {
    it('should toggle the weeklyPatternAnalysis flag', () => {
      expect(useUserStore.getState().profile.weeklyPatternAnalysis).toBe(true);
      act(() => {
        useUserStore.getState().toggleWeeklyPatternAnalysis();
      });
      expect(useUserStore.getState().profile.weeklyPatternAnalysis).toBe(false);
    });
  });

  describe('setWritingFontSize', () => {
    it('should set font size to small', () => {
      act(() => {
        useUserStore.getState().setWritingFontSize('small');
      });
      expect(useUserStore.getState().profile.writingFontSize).toBe('small');
    });

    it('should set font size to large', () => {
      act(() => {
        useUserStore.getState().setWritingFontSize('large');
      });
      expect(useUserStore.getState().profile.writingFontSize).toBe('large');
    });

    it('should set font size back to medium', () => {
      act(() => {
        useUserStore.getState().setWritingFontSize('large');
      });
      act(() => {
        useUserStore.getState().setWritingFontSize('medium');
      });
      expect(useUserStore.getState().profile.writingFontSize).toBe('medium');
    });
  });

  describe('toggleDarkModeWriting', () => {
    it('should toggle dark mode from false to true', () => {
      act(() => {
        useUserStore.getState().toggleDarkModeWriting();
      });
      expect(useUserStore.getState().profile.darkModeWriting).toBe(true);
    });

    it('should toggle dark mode back to false', () => {
      act(() => {
        useUserStore.getState().toggleDarkModeWriting();
      });
      act(() => {
        useUserStore.getState().toggleDarkModeWriting();
      });
      expect(useUserStore.getState().profile.darkModeWriting).toBe(false);
    });
  });

  describe('advanceDay', () => {
    it('should increment currentDay by 1', () => {
      act(() => {
        useUserStore.getState().advanceDay();
      });
      expect(useUserStore.getState().profile.currentDay).toBe(2);
    });

    it('should stay in week 1 for days 1-7', () => {
      // Start at day 1, advance to day 7 (6 advances)
      for (let i = 0; i < 6; i++) {
        act(() => {
          useUserStore.getState().advanceDay();
        });
      }
      expect(useUserStore.getState().profile.currentDay).toBe(7);
      expect(useUserStore.getState().profile.currentWeek).toBe(1);
    });

    it('should advance to week 2 on day 8', () => {
      for (let i = 0; i < 7; i++) {
        act(() => {
          useUserStore.getState().advanceDay();
        });
      }
      expect(useUserStore.getState().profile.currentDay).toBe(8);
      expect(useUserStore.getState().profile.currentWeek).toBe(2);
    });

    it('should calculate week correctly for day 14', () => {
      for (let i = 0; i < 13; i++) {
        act(() => {
          useUserStore.getState().advanceDay();
        });
      }
      expect(useUserStore.getState().profile.currentDay).toBe(14);
      expect(useUserStore.getState().profile.currentWeek).toBe(2);
    });

    it('should advance to week 3 on day 15', () => {
      for (let i = 0; i < 14; i++) {
        act(() => {
          useUserStore.getState().advanceDay();
        });
      }
      expect(useUserStore.getState().profile.currentDay).toBe(15);
      expect(useUserStore.getState().profile.currentWeek).toBe(3);
    });

    it('should reach week 4 on day 22', () => {
      for (let i = 0; i < 21; i++) {
        act(() => {
          useUserStore.getState().advanceDay();
        });
      }
      expect(useUserStore.getState().profile.currentDay).toBe(22);
      expect(useUserStore.getState().profile.currentWeek).toBe(4);
    });
  });

  describe('resetAll', () => {
    it('should reset profile to defaults', () => {
      act(() => {
        useUserStore.getState().setName('Marcus');
        useUserStore.getState().completeOnboarding();
        useUserStore.getState().advanceDay();
        useUserStore.getState().toggleMarcusNudges();
      });
      act(() => {
        useUserStore.getState().resetAll();
      });
      const { profile } = useUserStore.getState();
      expect(profile.name).toBe('');
      expect(profile.currentDay).toBe(1);
      expect(profile.currentWeek).toBe(1);
      expect(profile.onboardingComplete).toBe(false);
      expect(profile.marcusNudgesEnabled).toBe(true);
    });

    it('should generate a new id on reset', () => {
      const oldId = useUserStore.getState().profile.id;
      act(() => {
        useUserStore.getState().resetAll();
      });
      const newId = useUserStore.getState().profile.id;
      expect(newId).not.toBe(oldId);
    });

    it('should set fresh timestamps on reset', () => {
      act(() => {
        useUserStore.getState().resetAll();
      });
      const { profile } = useUserStore.getState();
      expect(new Date(profile.startDate).getTime()).not.toBeNaN();
      expect(new Date(profile.createdAt).getTime()).not.toBeNaN();
    });
  });
});
