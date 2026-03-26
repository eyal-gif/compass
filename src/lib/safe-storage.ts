import { createJSONStorage } from 'zustand/middleware';

export const safeLocalStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      console.warn(`[Compass] Failed to read "${name}" from localStorage`);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        console.error('[Compass] localStorage is full. Your data may not be saved.');
      } else {
        console.warn(`[Compass] Failed to write "${name}" to localStorage`);
      }
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      console.warn(`[Compass] Failed to remove "${name}" from localStorage`);
    }
  },
}));
