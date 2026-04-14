export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function getMeditationTypeIcon(type: string): string {
  switch (type) {
    case 'guided': return '🧘';
    case 'breathing': return '🌬️';
    case 'body-scan': return '✨';
    case 'silent': return '🤫';
    case 'loving-kindness': return '💗';
    default: return '🧘';
  }
}

export function getMeditationTypeLabel(type: string): string {
  switch (type) {
    case 'guided': return 'Guided';
    case 'breathing': return 'Breathing';
    case 'body-scan': return 'Body Scan';
    case 'silent': return 'Silent';
    case 'loving-kindness': return 'Loving Kindness';
    default: return type;
  }
}
