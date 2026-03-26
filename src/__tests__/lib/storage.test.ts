import { exportJournalAsText, downloadAsFile } from '@/lib/storage';
import { JournalEntry } from '@/types';

function makeEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id: crypto.randomUUID(),
    dayNumber: 1,
    promptId: 'prompt-1',
    content: 'Sample journal content.',
    wordCount: 3,
    writingDurationSeconds: 60,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('exportJournalAsText', () => {
  it('should include the header', () => {
    const result = exportJournalAsText([]);
    expect(result).toContain('COMPASS');
    expect(result).toContain('Your Journal');
    expect(result).toContain('='.repeat(40));
  });

  it('should include entry content', () => {
    const entries = [makeEntry({ content: 'My reflections today.' })];
    const result = exportJournalAsText(entries);
    expect(result).toContain('My reflections today.');
  });

  it('should include day number', () => {
    const entries = [makeEntry({ dayNumber: 5 })];
    const result = exportJournalAsText(entries);
    expect(result).toContain('Day 5');
  });

  it('should include word count', () => {
    const entries = [makeEntry({ wordCount: 42 })];
    const result = exportJournalAsText(entries);
    expect(result).toContain('(42 words)');
  });

  it('should sort entries by dayNumber', () => {
    const entries = [
      makeEntry({ dayNumber: 3, content: 'Day three content.' }),
      makeEntry({ dayNumber: 1, content: 'Day one content.' }),
      makeEntry({ dayNumber: 2, content: 'Day two content.' }),
    ];
    const result = exportJournalAsText(entries);
    const dayOneIdx = result.indexOf('Day one content.');
    const dayTwoIdx = result.indexOf('Day two content.');
    const dayThreeIdx = result.indexOf('Day three content.');
    expect(dayOneIdx).toBeLessThan(dayTwoIdx);
    expect(dayTwoIdx).toBeLessThan(dayThreeIdx);
  });

  it('should group entries under the same day header', () => {
    const entries = [
      makeEntry({ dayNumber: 1, content: 'First entry.' }),
      makeEntry({ dayNumber: 1, content: 'Second entry.' }),
    ];
    const result = exportJournalAsText(entries);
    // Only one "Day 1" header
    const matches = result.match(/--- Day 1 ---/g);
    expect(matches).toHaveLength(1);
    expect(result).toContain('First entry.');
    expect(result).toContain('Second entry.');
  });

  it('should handle empty entries array', () => {
    const result = exportJournalAsText([]);
    expect(result).toContain('COMPASS');
    // Should not crash and should have the header
    expect(result.length).toBeGreaterThan(0);
  });

  it('should include a formatted date', () => {
    const entries = [makeEntry({ createdAt: '2025-06-15T10:00:00.000Z' })];
    const result = exportJournalAsText(entries);
    expect(result).toContain('Date:');
  });

  it('should not mutate the original entries array', () => {
    const entries = [
      makeEntry({ dayNumber: 3 }),
      makeEntry({ dayNumber: 1 }),
    ];
    const originalOrder = entries.map(e => e.dayNumber);
    exportJournalAsText(entries);
    expect(entries.map(e => e.dayNumber)).toEqual(originalOrder);
  });
});

describe('downloadAsFile', () => {
  let createElementSpy: jest.SpyInstance;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let createObjectURLSpy: jest.Mock;
  let revokeObjectURLSpy: jest.Mock;
  let clickSpy: jest.Mock;

  beforeEach(() => {
    clickSpy = jest.fn();
    createElementSpy = jest.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement);
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

    // URL.createObjectURL and URL.revokeObjectURL may not exist in JSDOM, so assign mocks directly
    createObjectURLSpy = jest.fn().mockReturnValue('blob:test-url');
    revokeObjectURLSpy = jest.fn();
    URL.createObjectURL = createObjectURLSpy;
    URL.revokeObjectURL = revokeObjectURLSpy;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an anchor element', () => {
    downloadAsFile('content', 'test.txt');
    expect(createElementSpy).toHaveBeenCalledWith('a');
  });

  it('should create a blob URL', () => {
    downloadAsFile('hello', 'file.txt');
    expect(createObjectURLSpy).toHaveBeenCalledWith(expect.any(Blob));
  });

  it('should set the download filename', () => {
    const anchor = { href: '', download: '', click: clickSpy } as unknown as HTMLAnchorElement;
    createElementSpy.mockReturnValue(anchor);
    downloadAsFile('content', 'my-journal.txt');
    expect(anchor.download).toBe('my-journal.txt');
  });

  it('should trigger a click on the anchor', () => {
    downloadAsFile('content', 'test.txt');
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should append and then remove the anchor from the body', () => {
    downloadAsFile('content', 'test.txt');
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });

  it('should revoke the object URL after download', () => {
    downloadAsFile('content', 'test.txt');
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:test-url');
  });

  it('should use text/plain as default content type', () => {
    downloadAsFile('content', 'test.txt');
    const blobArg = createObjectURLSpy.mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.type).toBe('text/plain');
  });

  it('should accept a custom content type', () => {
    downloadAsFile('{}', 'data.json', 'application/json');
    const blobArg = createObjectURLSpy.mock.calls[0][0];
    expect(blobArg.type).toBe('application/json');
  });
});
