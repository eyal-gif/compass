export interface MeditationDay {
  dayNumber: number;
  week: number;
  title: string;
  durationMinutes: number;
  type: 'guided' | 'breathing' | 'body-scan' | 'silent' | 'loving-kindness';
  youtubeId: string;
  description: string;
  tip?: string;
}
