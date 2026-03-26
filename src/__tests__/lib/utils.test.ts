import {
  cn,
  getTimeOfDay,
  getGreetingPrefix,
  formatDuration,
  wordCount,
  getPhaseForWeek,
  getPhaseLabel,
  getDayTypeIcon,
  getDayTypeLabel,
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

  it('should handle empty strings (they are falsy-like but truthy)', () => {
    // Empty string is falsy, so it should be filtered out
    expect(cn('a', '', 'b')).toBe('a b');
  });
});

describe('getTimeOfDay', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return morning for hours before 12', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(8);
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return morning for hour 0 (midnight)', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(0);
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return morning for hour 11', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(11);
    expect(getTimeOfDay()).toBe('morning');
  });

  it('should return afternoon for hour 12', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    expect(getTimeOfDay()).toBe('afternoon');
  });

  it('should return afternoon for hour 16', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(16);
    expect(getTimeOfDay()).toBe('afternoon');
  });

  it('should return evening for hour 17', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(17);
    expect(getTimeOfDay()).toBe('evening');
  });

  it('should return evening for hour 23', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(23);
    expect(getTimeOfDay()).toBe('evening');
  });
});

describe('getGreetingPrefix', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return morning greeting with name', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
    expect(getGreetingPrefix('Marcus')).toBe('Good morning, Marcus');
  });

  it('should return afternoon greeting with name', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    expect(getGreetingPrefix('Sarah')).toBe('Good afternoon, Sarah');
  });

  it('should return evening greeting with name', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    expect(getGreetingPrefix('Alex')).toBe('Good evening, Alex');
  });

  it('should handle empty name', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(9);
    expect(getGreetingPrefix('')).toBe('Good morning, ');
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

describe('wordCount', () => {
  it('should count words in a normal sentence', () => {
    expect(wordCount('hello world')).toBe(2);
  });

  it('should return 0 for empty string', () => {
    expect(wordCount('')).toBe(0);
  });

  it('should return 0 for whitespace-only string', () => {
    expect(wordCount('   ')).toBe(0);
  });

  it('should handle multiple spaces between words', () => {
    expect(wordCount('one   two   three')).toBe(3);
  });

  it('should handle leading and trailing whitespace', () => {
    expect(wordCount('  hello world  ')).toBe(2);
  });

  it('should handle tabs and newlines', () => {
    expect(wordCount('hello\tworld\nnew line')).toBe(4);
  });

  it('should count a single word', () => {
    expect(wordCount('hello')).toBe(1);
  });
});

describe('getPhaseForWeek', () => {
  it('should return excavation for week 1', () => {
    expect(getPhaseForWeek(1)).toBe('excavation');
  });

  it('should return clarity for week 2', () => {
    expect(getPhaseForWeek(2)).toBe('clarity');
  });

  it('should return vision for week 3', () => {
    expect(getPhaseForWeek(3)).toBe('vision');
  });

  it('should return decision for week 4', () => {
    expect(getPhaseForWeek(4)).toBe('decision');
  });

  it('should clamp to decision for weeks beyond 4', () => {
    expect(getPhaseForWeek(5)).toBe('decision');
    expect(getPhaseForWeek(10)).toBe('decision');
  });
});

describe('getPhaseLabel', () => {
  it('should capitalize the first letter', () => {
    expect(getPhaseLabel('excavation')).toBe('Excavation');
    expect(getPhaseLabel('clarity')).toBe('Clarity');
    expect(getPhaseLabel('vision')).toBe('Vision');
    expect(getPhaseLabel('decision')).toBe('Decision');
  });

  it('should handle single character', () => {
    expect(getPhaseLabel('a')).toBe('A');
  });

  it('should handle empty string', () => {
    expect(getPhaseLabel('')).toBe('');
  });
});

describe('getDayTypeIcon', () => {
  it('should return correct icon for journal', () => {
    expect(getDayTypeIcon('journal')).toBe('\u270F\uFE0F');
  });

  it('should return correct icon for video_journal', () => {
    expect(getDayTypeIcon('video_journal')).toBe('\uD83C\uDFAC');
  });

  it('should return correct icon for action', () => {
    expect(getDayTypeIcon('action')).toBe('\u26A1');
  });

  it('should return correct icon for rest', () => {
    expect(getDayTypeIcon('rest')).toBe('\uD83C\uDF3F');
  });

  it('should return correct icon for synthesis', () => {
    expect(getDayTypeIcon('synthesis')).toBe('\uD83D\uDD2E');
  });

  it('should return default icon for unknown type', () => {
    expect(getDayTypeIcon('unknown')).toBe('\uD83D\uDCDD');
  });
});

describe('getDayTypeLabel', () => {
  it('should return correct label for journal', () => {
    expect(getDayTypeLabel('journal')).toBe('Journal');
  });

  it('should return correct label for video_journal', () => {
    expect(getDayTypeLabel('video_journal')).toBe('Video + Journal');
  });

  it('should return correct label for action', () => {
    expect(getDayTypeLabel('action')).toBe('Action');
  });

  it('should return correct label for rest', () => {
    expect(getDayTypeLabel('rest')).toBe('Rest');
  });

  it('should return correct label for synthesis', () => {
    expect(getDayTypeLabel('synthesis')).toBe('Synthesis');
  });

  it('should return the type string itself for unknown types', () => {
    expect(getDayTypeLabel('custom_type')).toBe('custom_type');
  });
});
