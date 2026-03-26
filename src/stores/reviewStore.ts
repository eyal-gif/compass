import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeeklyReview } from '@/types';
import { safeLocalStorage } from '@/lib/safe-storage';

interface ReviewState {
  reviews: WeeklyReview[];
  addReview: (review: WeeklyReview) => void;
  getReviewForWeek: (week: number) => WeeklyReview | undefined;
  resetAll: () => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) =>
        set((state) => ({
          reviews: [
            ...state.reviews.filter((r) => r.week !== review.week),
            review,
          ],
        })),

      getReviewForWeek: (week) =>
        get().reviews.find((r) => r.week === week),

      resetAll: () =>
        set({
          reviews: [],
        }),
    }),
    {
      name: 'compass-reviews',
      storage: safeLocalStorage,
    }
  )
);
