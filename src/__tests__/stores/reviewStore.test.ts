import { useReviewStore } from '@/stores/reviewStore';
import { WeeklyReview } from '@/types';
import { act } from '@testing-library/react';

function makeReview(overrides: Partial<WeeklyReview> = {}): WeeklyReview {
  return {
    week: 1,
    daysCompleted: 5,
    totalWords: 1200,
    videosWatched: 2,
    patterns: ['The word "freedom" appears across 3 different days'],
    whyDraft: 'I want to help people find their path.',
    marcusSummary: 'You dug deep this week.',
    generatedAt: new Date().toISOString(),
    ...overrides,
  };
}

beforeEach(() => {
  act(() => {
    useReviewStore.getState().resetAll();
  });
});

describe('useReviewStore', () => {
  describe('initial state', () => {
    it('should start with empty reviews', () => {
      expect(useReviewStore.getState().reviews).toEqual([]);
    });
  });

  describe('addReview', () => {
    it('should add a weekly review', () => {
      const review = makeReview({ week: 1 });
      act(() => {
        useReviewStore.getState().addReview(review);
      });
      expect(useReviewStore.getState().reviews).toHaveLength(1);
      expect(useReviewStore.getState().reviews[0]).toEqual(review);
    });

    it('should add reviews for multiple weeks', () => {
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1 }));
        useReviewStore.getState().addReview(makeReview({ week: 2 }));
        useReviewStore.getState().addReview(makeReview({ week: 3 }));
      });
      expect(useReviewStore.getState().reviews).toHaveLength(3);
    });

    it('should replace an existing review for the same week', () => {
      const review1 = makeReview({ week: 1, totalWords: 500 });
      const review2 = makeReview({ week: 1, totalWords: 1500 });
      act(() => {
        useReviewStore.getState().addReview(review1);
      });
      act(() => {
        useReviewStore.getState().addReview(review2);
      });
      expect(useReviewStore.getState().reviews).toHaveLength(1);
      expect(useReviewStore.getState().reviews[0].totalWords).toBe(1500);
    });

    it('should not affect reviews for other weeks when replacing', () => {
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1, totalWords: 100 }));
        useReviewStore.getState().addReview(makeReview({ week: 2, totalWords: 200 }));
      });
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1, totalWords: 999 }));
      });
      const reviews = useReviewStore.getState().reviews;
      expect(reviews).toHaveLength(2);
      const week2 = reviews.find(r => r.week === 2);
      expect(week2!.totalWords).toBe(200);
    });

    it('should store patterns array correctly', () => {
      const review = makeReview({
        week: 1,
        patterns: ['Pattern A', 'Pattern B', 'Pattern C'],
      });
      act(() => {
        useReviewStore.getState().addReview(review);
      });
      expect(useReviewStore.getState().reviews[0].patterns).toHaveLength(3);
    });

    it('should handle review without whyDraft', () => {
      const review = makeReview({ week: 1, whyDraft: undefined });
      act(() => {
        useReviewStore.getState().addReview(review);
      });
      expect(useReviewStore.getState().reviews[0].whyDraft).toBeUndefined();
    });
  });

  describe('getReviewForWeek', () => {
    it('should return the review for a specific week', () => {
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 2, totalWords: 800 }));
      });
      const review = useReviewStore.getState().getReviewForWeek(2);
      expect(review).toBeDefined();
      expect(review!.week).toBe(2);
      expect(review!.totalWords).toBe(800);
    });

    it('should return undefined for a week with no review', () => {
      expect(useReviewStore.getState().getReviewForWeek(5)).toBeUndefined();
    });

    it('should return the correct review when multiple exist', () => {
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1, marcusSummary: 'Week 1 summary' }));
        useReviewStore.getState().addReview(makeReview({ week: 2, marcusSummary: 'Week 2 summary' }));
        useReviewStore.getState().addReview(makeReview({ week: 3, marcusSummary: 'Week 3 summary' }));
      });
      const review = useReviewStore.getState().getReviewForWeek(2);
      expect(review!.marcusSummary).toBe('Week 2 summary');
    });
  });

  describe('resetAll', () => {
    it('should clear all reviews', () => {
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1 }));
        useReviewStore.getState().addReview(makeReview({ week: 2 }));
      });
      act(() => {
        useReviewStore.getState().resetAll();
      });
      expect(useReviewStore.getState().reviews).toEqual([]);
    });

    it('should allow adding reviews after reset', () => {
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1 }));
      });
      act(() => {
        useReviewStore.getState().resetAll();
      });
      act(() => {
        useReviewStore.getState().addReview(makeReview({ week: 1, totalWords: 999 }));
      });
      expect(useReviewStore.getState().reviews).toHaveLength(1);
      expect(useReviewStore.getState().reviews[0].totalWords).toBe(999);
    });
  });
});
