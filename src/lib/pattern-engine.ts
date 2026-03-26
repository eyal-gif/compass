import { JournalEntry, Discovery } from '@/types';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'was', 'are', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'need', 'dare',
  'ought', 'used', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
  'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
  'it', 'its', 'they', 'them', 'their', 'theirs', 'what', 'which',
  'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'been',
  'not', 'no', 'nor', 'so', 'very', 'just', 'about', 'also', 'then',
  'than', 'too', 'if', 'when', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own',
  'same', 'into', 'up', 'out', 'as', 'like', 'really', 'thing',
  'things', 'much', 'many', 'still', 'even', 'here', 'there', 'where',
  'why', 'because', 'through', 'during', 'before', 'after', 'above',
  'below', 'between', 'under', 'again', 'further', 'once', 'something',
  'anything', 'everything', 'nothing', 'someone', 'anyone', 'everyone',
  'get', 'got', 'going', 'went', 'come', 'came', 'make', 'made',
  'take', 'took', 'know', 'knew', 'think', 'thought', 'see', 'saw',
  'want', 'wanted', 'look', 'looked', 'give', 'gave', 'tell', 'told',
  'work', 'find', 'found', 'say', 'said', 'let', 'put', 'keep', 'kept',
  'way', 'day', 'time', 'year', 'back', 'one', 'two', 'three',
  'first', 'last', 'long', 'great', 'little', 'right', 'old', 'big',
  'high', 'different', 'small', 'new', 'good', 'bad', 'able', 'lot',
  'always', 'never', 'don', 'doesn', 'didn', 'won', 'wouldn', 'couldn',
  'shouldn', 'isn', 'wasn', 'aren', 'weren', 'hasn', 'haven', 'hadn',
  'feel', 'felt', 'doing', 'done', 'being', 'having', 'getting',
]);

const DISCOVERY_MARKERS = [
  'i realize', 'i realise', 'the truth is', 'i want', 'i need',
  'i love', 'i hate', 'what matters', 'i believe', 'i value',
  'my strength', 'i am', 'i\'m not', 'i\'ve always', 'i never',
  'the pattern', 'i see now', 'it\'s clear', 'what drives me',
  'i come alive', 'makes me feel', 'i\'m afraid', 'my fear',
  'i\'m going to', 'i choose', 'i decide', 'my purpose',
];

export function extractKeywords(entries: JournalEntry[]): Map<string, number> {
  const wordFreq = new Map<string, number>();

  for (const entry of entries) {
    const words = entry.content
      .toLowerCase()
      .replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOP_WORDS.has(w));

    for (const word of words) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  }

  return new Map(
    [...wordFreq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
  );
}

export function extractPatterns(entries: JournalEntry[]): string[] {
  if (entries.length === 0) return [];

  const keywords = extractKeywords(entries);
  const topWords = [...keywords.entries()].slice(0, 10).map(([word]) => word);

  const patterns: string[] = [];

  // Look for words that appear across multiple days
  const wordsByDay = new Map<string, Set<number>>();
  for (const entry of entries) {
    const words = entry.content.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (topWords.includes(word)) {
        if (!wordsByDay.has(word)) wordsByDay.set(word, new Set());
        wordsByDay.get(word)!.add(entry.dayNumber);
      }
    }
  }

  const crossDayWords = [...wordsByDay.entries()]
    .filter(([, days]) => days.size >= 2)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 5);

  for (const [word, days] of crossDayWords) {
    patterns.push(
      `The word "${word}" appears across ${days.size} different days of writing`
    );
  }

  return patterns;
}

export function extractDiscoveries(entry: JournalEntry): Partial<Discovery>[] {
  const discoveries: Partial<Discovery>[] = [];
  const sentences = entry.content.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

  for (const sentence of sentences) {
    const lower = sentence.toLowerCase();
    for (const marker of DISCOVERY_MARKERS) {
      if (lower.includes(marker)) {
        let category: Discovery['category'] = 'pattern';
        if (lower.includes('value') || lower.includes('believe') || lower.includes('matters')) category = 'value';
        else if (lower.includes('strength') || lower.includes('good at') || lower.includes('skill')) category = 'strength';
        else if (lower.includes('alive') || lower.includes('energy') || lower.includes('love')) category = 'energy';
        else if (lower.includes('afraid') || lower.includes('fear') || lower.includes('scared')) category = 'fear';
        else if (lower.includes('going to') || lower.includes('choose') || lower.includes('decide')) category = 'decision';
        else if (lower.includes('purpose') || lower.includes('why') || lower.includes('drive')) category = 'why';

        discoveries.push({
          dayNumber: entry.dayNumber,
          content: sentence.length > 150 ? sentence.slice(0, 147) + '...' : sentence,
          category,
          source: 'journal',
          pinned: false,
        });
        break;
      }
    }
  }

  return discoveries;
}

export function generateWeeklyPatterns(entries: JournalEntry[], week: number): string[] {
  const weekEntries = entries.filter(e => {
    const dayWeek = Math.ceil(e.dayNumber / 7);
    return dayWeek === week;
  });

  if (weekEntries.length === 0) {
    return ['Not enough writing yet to identify patterns. Keep going.'];
  }

  const patterns = extractPatterns(weekEntries);

  if (patterns.length === 0) {
    return ['Your writing is building a foundation. Patterns will emerge as you continue.'];
  }

  return patterns;
}
