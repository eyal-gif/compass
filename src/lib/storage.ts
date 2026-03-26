import { JournalEntry } from '@/types';

export function exportJournalAsText(entries: JournalEntry[]): string {
  const sorted = [...entries].sort((a, b) => a.dayNumber - b.dayNumber);

  let output = 'COMPASS — Your Journal\n';
  output += '='.repeat(40) + '\n\n';

  let currentDay = -1;
  for (const entry of sorted) {
    if (entry.dayNumber !== currentDay) {
      currentDay = entry.dayNumber;
      output += `\n--- Day ${currentDay} ---\n`;
      output += `Date: ${new Date(entry.createdAt).toLocaleDateString()}\n\n`;
    }
    output += entry.content + '\n\n';
    output += `(${entry.wordCount} words)\n\n`;
  }

  return output;
}

export function downloadAsFile(content: string, filename: string, type: string = 'text/plain') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
