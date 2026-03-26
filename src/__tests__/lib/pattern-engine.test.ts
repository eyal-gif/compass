import {
  extractKeywords,
  extractPatterns,
  extractDiscoveries,
  generateWeeklyPatterns,
} from '@/lib/pattern-engine';
import { JournalEntry } from '@/types';

function makeEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id: crypto.randomUUID(),
    dayNumber: 1,
    promptId: 'prompt-1',
    content: '',
    wordCount: 0,
    writingDurationSeconds: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('extractKeywords', () => {
  it('should return a Map of word frequencies', () => {
    const entries = [
      makeEntry({ content: 'freedom creativity freedom creativity freedom passion' }),
    ];
    const keywords = extractKeywords(entries);
    expect(keywords).toBeInstanceOf(Map);
    expect(keywords.get('freedom')).toBe(3);
    expect(keywords.get('creativity')).toBe(2);
    expect(keywords.get('passion')).toBe(1);
  });

  it('should filter out stop words', () => {
    const entries = [
      makeEntry({ content: 'the freedom and the creativity with the passion' }),
    ];
    const keywords = extractKeywords(entries);
    expect(keywords.has('the')).toBe(false);
    expect(keywords.has('and')).toBe(false);
    expect(keywords.has('with')).toBe(false);
    expect(keywords.has('freedom')).toBe(true);
  });

  it('should filter out words with 3 or fewer characters', () => {
    const entries = [
      makeEntry({ content: 'art can be fun but creativity matters more' }),
    ];
    const keywords = extractKeywords(entries);
    expect(keywords.has('art')).toBe(false);
    expect(keywords.has('can')).toBe(false);
    expect(keywords.has('fun')).toBe(false);
    expect(keywords.has('creativity')).toBe(true);
  });

  it('should be case-insensitive', () => {
    const entries = [
      makeEntry({ content: 'Freedom FREEDOM freedom' }),
    ];
    const keywords = extractKeywords(entries);
    expect(keywords.get('freedom')).toBe(3);
  });

  it('should return empty map for empty entries', () => {
    const keywords = extractKeywords([]);
    expect(keywords.size).toBe(0);
  });

  it('should return at most 30 keywords', () => {
    // Generate a long content with many unique words
    const longWords = Array.from({ length: 50 }, (_, i) => `uniqueword${i}abcd`);
    const entries = [makeEntry({ content: longWords.join(' ') })];
    const keywords = extractKeywords(entries);
    expect(keywords.size).toBeLessThanOrEqual(30);
  });

  it('should strip non-alphabetic characters', () => {
    const entries = [
      makeEntry({ content: 'freedom! creativity? passion... freedom' }),
    ];
    const keywords = extractKeywords(entries);
    expect(keywords.get('freedom')).toBe(2);
  });

  it('should aggregate across multiple entries', () => {
    const entries = [
      makeEntry({ content: 'creativity drives everything', dayNumber: 1 }),
      makeEntry({ content: 'creativity matters deeply', dayNumber: 2 }),
    ];
    const keywords = extractKeywords(entries);
    expect(keywords.get('creativity')).toBe(2);
  });

  it('should sort by frequency descending', () => {
    const entries = [
      makeEntry({
        content: 'passion passion passion creativity creativity freedom',
      }),
    ];
    const keywords = extractKeywords(entries);
    const keys = [...keywords.keys()];
    expect(keys[0]).toBe('passion');
    expect(keys[1]).toBe('creativity');
    expect(keys[2]).toBe('freedom');
  });
});

describe('extractPatterns', () => {
  it('should return empty array for empty entries', () => {
    expect(extractPatterns([])).toEqual([]);
  });

  it('should detect words appearing across multiple days', () => {
    const entries = [
      makeEntry({
        dayNumber: 1,
        content: 'creativity helps me express myself through creativity',
      }),
      makeEntry({
        dayNumber: 2,
        content: 'creativity is what drives my work every single creativity day',
      }),
      makeEntry({
        dayNumber: 3,
        content: 'I find creativity in everything around me and more creativity',
      }),
    ];
    const patterns = extractPatterns(entries);
    expect(patterns.length).toBeGreaterThan(0);
    const hasCreativity = patterns.some(p => p.includes('creativity'));
    expect(hasCreativity).toBe(true);
  });

  it('should mention the number of days a word appears across', () => {
    const entries = [
      makeEntry({ dayNumber: 1, content: 'purpose purpose purpose purpose' }),
      makeEntry({ dayNumber: 2, content: 'purpose purpose purpose purpose' }),
    ];
    const patterns = extractPatterns(entries);
    const purposePattern = patterns.find(p => p.includes('purpose'));
    expect(purposePattern).toBeDefined();
    expect(purposePattern).toContain('2 different days');
  });

  it('should return at most 5 patterns', () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry({
        dayNumber: i + 1,
        content: `alpha alpha beta beta gamma gamma delta delta epsilon epsilon zeta zeta eta eta theta theta iota iota kappa kappa`,
      })
    );
    const patterns = extractPatterns(entries);
    expect(patterns.length).toBeLessThanOrEqual(5);
  });

  it('should return empty when all entries are on the same day', () => {
    // Words only on 1 day cannot be "cross-day"
    const entries = [
      makeEntry({ dayNumber: 1, content: 'unique unique unique unique' }),
    ];
    const patterns = extractPatterns(entries);
    // cross-day requires >= 2 days
    expect(patterns).toEqual([]);
  });
});

describe('extractDiscoveries', () => {
  it('should detect discovery markers in sentences', () => {
    const entry = makeEntry({
      content: 'I realize that I have been avoiding this for years. The weather is nice today.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].content).toContain('I realize');
  });

  it('should categorize value-related discoveries', () => {
    const entry = makeEntry({
      content: 'I believe that honesty and integrity are what matter most to me.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].category).toBe('value');
  });

  it('should categorize strength-related discoveries', () => {
    const entry = makeEntry({
      content: 'My strength is connecting with people on a deep level.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].category).toBe('strength');
  });

  it('should categorize energy-related discoveries', () => {
    const entry = makeEntry({
      content: 'I come alive when I am creating something new and original.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].category).toBe('energy');
  });

  it('should categorize fear-related discoveries', () => {
    const entry = makeEntry({
      content: "I'm afraid of being stuck in a life that doesn't feel like mine.",
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].category).toBe('fear');
  });

  it('should categorize decision-related discoveries', () => {
    const entry = makeEntry({
      content: "I'm going to start prioritizing my creative work over everything else.",
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].category).toBe('decision');
  });

  it('should categorize purpose/why-related discoveries', () => {
    const entry = makeEntry({
      content: 'I realize that my purpose is to help others find their voice.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].category).toBe('why');
  });

  it('should truncate long sentences to 150 characters', () => {
    const longSentence = 'I realize that ' + 'a'.repeat(200) + '.';
    const entry = makeEntry({ content: longSentence });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBeGreaterThan(0);
    expect(discoveries[0].content!.length).toBeLessThanOrEqual(150);
    expect(discoveries[0].content!.endsWith('...')).toBe(true);
  });

  it('should return empty for content without discovery markers', () => {
    const entry = makeEntry({
      content: 'The weather was nice today. I went for a walk in the park.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries).toEqual([]);
  });

  it('should set source to journal and pinned to false', () => {
    const entry = makeEntry({
      content: 'I realize this is important to me.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries[0].source).toBe('journal');
    expect(discoveries[0].pinned).toBe(false);
  });

  it('should set dayNumber from the entry', () => {
    const entry = makeEntry({
      dayNumber: 7,
      content: 'I realize I need to change course.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries[0].dayNumber).toBe(7);
  });

  it('should only match one marker per sentence (break after first match)', () => {
    const entry = makeEntry({
      content: 'I realize I want to change everything about my life.',
    });
    const discoveries = extractDiscoveries(entry);
    // "i realize" and "i want" are both markers, but only 1 discovery per sentence
    expect(discoveries).toHaveLength(1);
  });

  it('should handle multiple sentences with discoveries', () => {
    const entry = makeEntry({
      content: 'I realize this matters. I want freedom. The sky is blue. I believe in honesty.',
    });
    const discoveries = extractDiscoveries(entry);
    expect(discoveries.length).toBe(3);
  });
});

describe('generateWeeklyPatterns', () => {
  it('should return a fallback message for no entries in the week', () => {
    const patterns = generateWeeklyPatterns([], 1);
    expect(patterns).toEqual(['Not enough writing yet to identify patterns. Keep going.']);
  });

  it('should filter entries by week number', () => {
    const entries = [
      makeEntry({ dayNumber: 1, content: 'creativity creativity creativity creativity' }),
      makeEntry({ dayNumber: 8, content: 'something else entirely different words here' }),
    ];
    // Week 1 = days 1-7, Week 2 = days 8-14
    const week1Patterns = generateWeeklyPatterns(entries, 1);
    // Only 1 entry in week 1, so no cross-day patterns possible
    expect(week1Patterns).toEqual([
      'Your writing is building a foundation. Patterns will emerge as you continue.',
    ]);
  });

  it('should return foundation message when no cross-day patterns found', () => {
    const entries = [
      makeEntry({ dayNumber: 1, content: 'unique content here only once today' }),
    ];
    const patterns = generateWeeklyPatterns(entries, 1);
    expect(patterns).toEqual([
      'Your writing is building a foundation. Patterns will emerge as you continue.',
    ]);
  });

  it('should detect patterns within a specific week', () => {
    const entries = [
      makeEntry({
        dayNumber: 1,
        content: 'creativity creativity creativity creativity is what drives me',
      }),
      makeEntry({
        dayNumber: 2,
        content: 'my creativity creativity creativity creativity keeps growing',
      }),
      makeEntry({
        dayNumber: 3,
        content: 'creativity creativity creativity creativity is my calling',
      }),
    ];
    const patterns = generateWeeklyPatterns(entries, 1);
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns.some(p => p.includes('creativity'))).toBe(true);
  });

  it('should return fallback for entries in a different week', () => {
    const entries = [
      makeEntry({ dayNumber: 8, content: 'week two content here' }),
      makeEntry({ dayNumber: 9, content: 'more week two content here' }),
    ];
    const patterns = generateWeeklyPatterns(entries, 1);
    expect(patterns).toEqual([
      'Not enough writing yet to identify patterns. Keep going.',
    ]);
  });

  it('should correctly map day 7 to week 1 and day 8 to week 2', () => {
    const entries = [
      makeEntry({ dayNumber: 7, content: 'freedom freedom freedom freedom freedom' }),
      makeEntry({ dayNumber: 8, content: 'freedom freedom freedom freedom freedom' }),
    ];
    // Day 7 is ceil(7/7) = 1, Day 8 is ceil(8/7) = 2
    const week1 = generateWeeklyPatterns(entries, 1);
    const week2 = generateWeeklyPatterns(entries, 2);
    // Each week only has 1 day of entries, so no cross-day patterns
    expect(week1).toEqual([
      'Your writing is building a foundation. Patterns will emerge as you continue.',
    ]);
    expect(week2).toEqual([
      'Your writing is building a foundation. Patterns will emerge as you continue.',
    ]);
  });
});
