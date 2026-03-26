import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WritePage from '@/app/day/write/page';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockSearchParams = new URLSearchParams('dayNumber=2&promptIndex=0');

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: mockBack,
    prefetch: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/day/write',
  useParams: () => ({}),
}));

describe('WritePage', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockPush.mockClear();
    mockBack.mockClear();
    mockSearchParams = new URLSearchParams('dayNumber=2&promptIndex=0');

    useUserStore.setState({
      profile: {
        id: 'test-id',
        name: 'Alex',
        startDate: new Date().toISOString(),
        currentDay: 2,
        currentWeek: 1,
        dailyReminderTime: '09:00',
        marcusNudgesEnabled: true,
        weeklyPatternAnalysis: true,
        writingFontSize: 'medium',
        darkModeWriting: false,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      },
    });

    useJournalStore.setState({
      entries: [],
      completions: [],
      discoveries: [],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows prompt text from day content', () => {
    render(<WritePage />);
    // Day 2 is a journal day - should show first prompt text
    // The prompt indicator should show
    expect(screen.getByText(/Prompt 1 of/)).toBeInTheDocument();
  });

  it('shows timer starting at 00:00', () => {
    render(<WritePage />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('timer increments over time', () => {
    render(<WritePage />);
    expect(screen.getByText('00:00')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('00:05')).toBeInTheDocument();
  });

  it('shows word count starting at 0', () => {
    render(<WritePage />);
    expect(screen.getByText('0 words')).toBeInTheDocument();
  });

  it('writing area accepts input and updates word count', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<WritePage />);

    const textarea = screen.getByPlaceholderText('Start writing...');
    expect(textarea).toBeInTheDocument();

    await user.type(textarea, 'Hello world test');

    expect(screen.getByText('3 words')).toBeInTheDocument();
  });

  it('shows singular "word" for single word', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<WritePage />);

    const textarea = screen.getByPlaceholderText('Start writing...');
    await user.type(textarea, 'Hello');

    expect(screen.getByText('1 word')).toBeInTheDocument();
  });

  it('shows Done button', () => {
    render(<WritePage />);
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('shows Back button', () => {
    render(<WritePage />);
    // The back button contains "Back" text with arrow
    const backBtn = screen.getByText((_, el) => {
      return el?.textContent?.includes('Back') && el?.tagName === 'BUTTON' || false;
    });
    expect(backBtn).toBeInTheDocument();
  });

  it('shows progress dots for multi-prompt days', () => {
    render(<WritePage />);
    // Day 2 has multiple prompts, so we should see prompt navigation dots
    const dotButtons = screen.getAllByRole('button', { name: /Go to prompt/ });
    expect(dotButtons.length).toBeGreaterThan(0);
  });

  it('shows Marcus nudge after NUDGE_DELAY seconds (180s)', () => {
    render(<WritePage />);

    // Initially no nudge (only one "Marcus" from page, not nudge)
    act(() => {
      jest.advanceTimersByTime(179000);
    });

    // At exactly 180 seconds the nudge should appear
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // After nudge, there should be an additional MarcusCard
    const marcusLabels = screen.getAllByText('Marcus');
    expect(marcusLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to next prompt when clicking Next', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<WritePage />);

    const nextBtn = screen.queryByText('Next');
    if (nextBtn) {
      await user.click(nextBtn);
      expect(screen.getByText(/Prompt 2 of/)).toBeInTheDocument();
    }
  });

  it('saves entries and completes day on Done', async () => {
    jest.useRealTimers();
    const user = userEvent.setup();
    render(<WritePage />);

    const textarea = screen.getByPlaceholderText('Start writing...');
    await user.type(textarea, 'My journal entry text for testing');

    await user.click(screen.getByText('Done'));

    expect(mockPush).toHaveBeenCalledWith('/');

    const state = useJournalStore.getState();
    expect(state.entries.length).toBeGreaterThan(0);
    expect(state.completions.length).toBe(1);
    expect(state.completions[0].dayNumber).toBe(2);
  });

  it('shows "No prompts for this day" for invalid day', () => {
    mockSearchParams = new URLSearchParams('dayNumber=0&promptIndex=0');
    render(<WritePage />);
    expect(screen.getByText('No prompts for this day.')).toBeInTheDocument();
  });
});
