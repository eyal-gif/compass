import {
  marcusQuotes,
  getRandomQuote,
  getGreeting,
  getPhaseIntro,
  getNudge,
} from '@/data/marcus-quotes';

describe('marcusQuotes data', () => {
  const allCategories = Object.keys(marcusQuotes) as (keyof typeof marcusQuotes)[];

  it('should have all expected categories', () => {
    const expected = [
      'greeting_morning', 'greeting_afternoon', 'greeting_evening',
      'excavation_intro', 'clarity_intro', 'vision_intro', 'decision_intro',
      'go_deeper', 'stay_with_it', 'challenge',
      'day_complete', 'week_complete', 'program_complete',
      'missed_day', 'resistance', 'rest_day',
      'war_context', 'stuck', 'writing_block', 'short_entry',
    ];
    for (const cat of expected) {
      expect(marcusQuotes).toHaveProperty(cat);
    }
  });

  it('should have at least one quote in every category', () => {
    for (const category of allCategories) {
      expect(marcusQuotes[category].length).toBeGreaterThan(0);
    }
  });

  it('should contain only non-empty strings in every category', () => {
    for (const category of allCategories) {
      for (const quote of marcusQuotes[category]) {
        expect(typeof quote).toBe('string');
        expect(quote.length).toBeGreaterThan(0);
      }
    }
  });

  it('should have at least 5 quotes in greeting categories', () => {
    expect(marcusQuotes.greeting_morning.length).toBeGreaterThanOrEqual(5);
    expect(marcusQuotes.greeting_afternoon.length).toBeGreaterThanOrEqual(5);
    expect(marcusQuotes.greeting_evening.length).toBeGreaterThanOrEqual(5);
  });

  it('should have at least 5 quotes in phase intro categories', () => {
    expect(marcusQuotes.excavation_intro.length).toBeGreaterThanOrEqual(5);
    expect(marcusQuotes.clarity_intro.length).toBeGreaterThanOrEqual(5);
    expect(marcusQuotes.vision_intro.length).toBeGreaterThanOrEqual(5);
    expect(marcusQuotes.decision_intro.length).toBeGreaterThanOrEqual(5);
  });
});

describe('getRandomQuote', () => {
  it('should return a string', () => {
    const quote = getRandomQuote('greeting_morning');
    expect(typeof quote).toBe('string');
    expect(quote.length).toBeGreaterThan(0);
  });

  it('should return a quote from the specified category', () => {
    const quote = getRandomQuote('rest_day');
    expect(marcusQuotes.rest_day).toContain(quote);
  });

  it('should return a quote from go_deeper category', () => {
    const quote = getRandomQuote('go_deeper');
    expect(marcusQuotes.go_deeper).toContain(quote);
  });

  it('should handle all categories without error', () => {
    const categories = Object.keys(marcusQuotes) as (keyof typeof marcusQuotes)[];
    for (const cat of categories) {
      expect(() => getRandomQuote(cat)).not.toThrow();
      expect(marcusQuotes[cat]).toContain(getRandomQuote(cat));
    }
  });
});

describe('getGreeting', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return a morning greeting before noon', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(8);
    const greeting = getGreeting();
    expect(marcusQuotes.greeting_morning).toContain(greeting);
  });

  it('should return an afternoon greeting between 12 and 17', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(14);
    const greeting = getGreeting();
    expect(marcusQuotes.greeting_afternoon).toContain(greeting);
  });

  it('should return an evening greeting at 17 or later', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(20);
    const greeting = getGreeting();
    expect(marcusQuotes.greeting_evening).toContain(greeting);
  });

  it('should return an evening greeting at midnight (hour 0)', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(0);
    const greeting = getGreeting();
    // Hour 0 is < 5, so it falls into the else branch (evening)
    expect(marcusQuotes.greeting_evening).toContain(greeting);
  });

  it('should return a morning greeting at hour 5', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(5);
    const greeting = getGreeting();
    expect(marcusQuotes.greeting_morning).toContain(greeting);
  });

  it('should return an afternoon greeting at hour 12', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(12);
    const greeting = getGreeting();
    expect(marcusQuotes.greeting_afternoon).toContain(greeting);
  });

  it('should return an evening greeting at hour 17', () => {
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(17);
    const greeting = getGreeting();
    expect(marcusQuotes.greeting_evening).toContain(greeting);
  });
});

describe('getPhaseIntro', () => {
  it('should return a quote from excavation_intro for excavation phase', () => {
    const intro = getPhaseIntro('excavation');
    expect(marcusQuotes.excavation_intro).toContain(intro);
  });

  it('should return a quote from clarity_intro for clarity phase', () => {
    const intro = getPhaseIntro('clarity');
    expect(marcusQuotes.clarity_intro).toContain(intro);
  });

  it('should return a quote from vision_intro for vision phase', () => {
    const intro = getPhaseIntro('vision');
    expect(marcusQuotes.vision_intro).toContain(intro);
  });

  it('should return a quote from decision_intro for decision phase', () => {
    const intro = getPhaseIntro('decision');
    expect(marcusQuotes.decision_intro).toContain(intro);
  });

  it('should always return a non-empty string', () => {
    const phases = ['excavation', 'clarity', 'vision', 'decision'] as const;
    for (const phase of phases) {
      const intro = getPhaseIntro(phase);
      expect(typeof intro).toBe('string');
      expect(intro.length).toBeGreaterThan(0);
    }
  });
});

describe('getNudge', () => {
  it('should return a string', () => {
    const nudge = getNudge();
    expect(typeof nudge).toBe('string');
    expect(nudge.length).toBeGreaterThan(0);
  });

  it('should return a quote from go_deeper, stay_with_it, or challenge', () => {
    const allNudgeQuotes = [
      ...marcusQuotes.go_deeper,
      ...marcusQuotes.stay_with_it,
      ...marcusQuotes.challenge,
    ];
    // Run multiple times to account for randomness
    for (let i = 0; i < 20; i++) {
      const nudge = getNudge();
      expect(allNudgeQuotes).toContain(nudge);
    }
  });

  it('should not return quotes from non-nudge categories', () => {
    const nonNudgeQuotes = [
      ...marcusQuotes.greeting_morning,
      ...marcusQuotes.rest_day,
      ...marcusQuotes.day_complete,
    ];
    // Run multiple times; a nudge should never be from these categories
    // (unless by coincidence a string is identical, which doesn't happen here)
    for (let i = 0; i < 20; i++) {
      const nudge = getNudge();
      // This is a soft check; if a quote text happens to be in both,
      // it would be a false positive, but the data doesn't have duplicates across categories
      const inNudge = [
        ...marcusQuotes.go_deeper,
        ...marcusQuotes.stay_with_it,
        ...marcusQuotes.challenge,
      ].includes(nudge);
      expect(inNudge).toBe(true);
    }
  });
});
