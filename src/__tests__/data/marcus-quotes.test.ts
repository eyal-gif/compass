import { program, getDayContent, getWeekDays, getWeekLabel } from '@/data/program';

describe('program data', () => {
  it('has 30 days', () => {
    expect(program).toHaveLength(30);
  });

  it('days are numbered 1-30', () => {
    program.forEach((day, i) => {
      expect(day.dayNumber).toBe(i + 1);
    });
  });

  it('every day has a youtubeId', () => {
    program.forEach(day => {
      expect(day.youtubeId).toBeTruthy();
    });
  });

  it('durations progress from 3 to 15 minutes', () => {
    expect(program[0].durationMinutes).toBeLessThanOrEqual(5);
    expect(program[29].durationMinutes).toBe(15);
  });

  it('getDayContent returns correct day', () => {
    const day5 = getDayContent(5);
    expect(day5?.dayNumber).toBe(5);
  });

  it('getDayContent returns undefined for invalid day', () => {
    expect(getDayContent(0)).toBeUndefined();
    expect(getDayContent(31)).toBeUndefined();
  });

  it('getWeekDays returns days for a week', () => {
    const week1 = getWeekDays(1);
    expect(week1.length).toBe(7);
    week1.forEach(d => expect(d.week).toBe(1));
  });

  it('getWeekLabel returns labels', () => {
    expect(getWeekLabel(1)).toContain('Foundation');
    expect(getWeekLabel(4)).toContain('Integration');
  });
});
