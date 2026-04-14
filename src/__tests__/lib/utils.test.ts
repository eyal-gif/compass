import { vi, afterEach } from 'vitest';
import {
  cn,
  getTimeOfDay,
  formatDuration,
  getMeditationTypeIcon,
  getMeditationTypeLabel,
} from '@/lib/utils';

describe('cn', () => {
  it('should join multiple class names with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('should filter out falsy values', () => {
    expect(cn('foo', false, 'bar', undefined, null, 'baz')).toBe('foo bar baz');
  });

  it('should return empty string when all values are falsy', () => {
    expect(cn(false, undefined, null)).toBe('');
  });

  it('should return empty string when called with no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should handle a single class name', () => {
    expect(cn('only')).toBe('only');
  });

  it('should handle empty strings (they are falsy)', () => {
    expect(cn('a', '', 'b')).toBe('a b');
  });
});

describe('getTimeOfDay', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return morning for hours before 12', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(8);
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return morning for hour 0 (midnight)', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(0);
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return morning for hour 11', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(11);
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return afternoon for hour 12', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    expect(getTimeOfDay()).toBe('afternoon');
  });

  it('should return afternoon for hour 16', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(16);
    expect(getTimeOfDay()).toBe('afternoon');
  });

  it('should return evening for hour 17', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(17);
    expect(getTimeOfDay()).toBe('evening');
  });

  it('should return evening for hour 23', () => {
    vi.spyOn(Date.prototype, 'getHours').mockReturnValue(23);
    expect(getTimeOfDay()).toBe('evening');
  });
});

describe('formatDuration', () => {
  it('should format 0 seconds as 00:00', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('should format 59 seconds', () => {
    expect(formatDuration(59)).toBe('00:59');
  });

  it('should format exactly 1 minute', () => {
    expect(formatDuration(60)).toBe('01:00');
  });

  it('should format 90 seconds as 01:30', () => {
    expect(formatDuration(90)).toBe('01:30');
  });

  it('should format 600 seconds as 10:00', () => {
    expect(formatDuration(600)).toBe('10:00');
  });

  it('should format large values correctly', () => {
    expect(formatDuration(3661)).toBe('61:01');
  });

  it('should pad single-digit minutes and seconds', () => {
    expect(formatDuration(65)).toBe('01:05');
  });
});

describe('getMeditationTypeIcon', () => {
  it('should return correct icon for guided', () => {
    expect(getMeditationTypeIcon('guided')).toBe('\uD83E\uDDD8');
  });

  it('should return correct icon for breathing', () => {
    expect(getMeditationTypeIcon('breathing')).toBe('\uD83C\uDF2C\uFE0F');
  });

  it('should return correct icon for body-scan', () => {
    expect(getMeditationTypeIcon('body-scan')).toBe('\u2728');
  });

  it('should return correct icon for silent', () => {
    expect(getMeditationTypeIcon('silent')).toBe('\uD83E\uDD2B');
  });

  it('should return correct icon for loving-kindness', () => {
    expect(getMeditationTypeIcon('loving-kindness')).toBe('\uD83D\uDC97');
  });

  it('should return default icon for unknown type', () => {
    expect(getMeditationTypeIcon('unknown')).toBe('\uD83E\uDDD8');
  });
});

describe('getMeditationTypeLabel', () => {
  it('should return correct label for guided', () => {
    expect(getMeditationTypeLabel('guided')).toBe('Guided');
  });

  it('should return correct label for breathing', () => {
    expect(getMeditationTypeLabel('breathing')).toBe('Breathing');
  });

  it('should return correct label for body-scan', () => {
    expect(getMeditationTypeLabel('body-scan')).toBe('Body Scan');
  });

  it('should return correct label for silent', () => {
    expect(getMeditationTypeLabel('silent')).toBe('Silent');
  });

  it('should return correct label for loving-kindness', () => {
    expect(getMeditationTypeLabel('loving-kindness')).toBe('Loving Kindness');
  });

  it('should return the type string itself for unknown types', () => {
    expect(getMeditationTypeLabel('custom_type')).toBe('custom_type');
  });
});
