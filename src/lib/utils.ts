export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function getGreetingPrefix(name: string): string {
  const tod = getTimeOfDay();
  const greetings = {
    morning: `Good morning, ${name}`,
    afternoon: `Good afternoon, ${name}`,
    evening: `Good evening, ${name}`,
  };
  return greetings[tod];
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getPhaseForWeek(week: number): 'excavation' | 'clarity' | 'vision' | 'decision' {
  const phases = ['excavation', 'clarity', 'vision', 'decision'] as const;
  return phases[Math.min(week - 1, 3)];
}

export function getPhaseLabel(phase: string): string {
  return phase.charAt(0).toUpperCase() + phase.slice(1);
}

export function getDayTypeIcon(type: string): string {
  switch (type) {
    case 'journal': return '✏️';
    case 'video_journal': return '🎬';
    case 'action': return '⚡';
    case 'rest': return '🌿';
    case 'synthesis': return '🔮';
    default: return '📝';
  }
}

export function getDayTypeLabel(type: string): string {
  switch (type) {
    case 'journal': return 'Journal';
    case 'video_journal': return 'Video + Journal';
    case 'action': return 'Action';
    case 'rest': return 'Rest';
    case 'synthesis': return 'Synthesis';
    default: return type;
  }
}
