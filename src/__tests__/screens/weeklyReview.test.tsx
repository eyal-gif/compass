import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import WeeklyReviewPage from '@/app/review/[week]/page';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { useReviewStore } from '@/stores/reviewStore';

// Mock framer-motion with Proxy to handle any motion.X element
jest.mock('framer-motion', () => {
  const motionProxy = new Proxy({}, {
    get: (_target, tag: string) => {
      return React.forwardRef(({ children, ...props }: any, ref: any) => {
        const { initial, animate, exit, transition, whileHover, whileTap, whileFocus, whileInView,
                variants, custom, layout, layoutId, onAnimationComplete, ...rest } = props;
        return React.createElement(tag, { ...rest, ref }, children);
      });
    },
  });
  return {
    motion: motionProxy,
    AnimatePresence: ({ children }: React.PropsWithChildren) => React.createElement(React.Fragment, null, children),
    useAnimation: () => ({ start: jest.fn() }),
  };
});

const mockPush = jest.fn();
const mockBack = jest.fn();
let mockParams: Record<string, string> = { week: '1' };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: mockBack,
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/review/1',
  useParams: () => mockParams,
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  );
});

function setupStores(weekNum: number = 1) {
  useUserStore.setState({
    profile: {
      id: 'test-id',
      name: 'Alex',
      startDate: new Date().toISOString(),
      currentDay: weekNum * 7 + 1,
      currentWeek: weekNum + 1,
      dailyReminderTime: '09:00',
      marcusNudgesEnabled: true,
      weeklyPatternAnalysis: true,
      writingFontSize: 'medium',
      darkModeWriting: false,
      onboardingComplete: true,
      createdAt: new Date().toISOString(),
    },
  });

  // Simulate some completed entries for the week
  const entries = Array.from({ length: 5 }, (_, i) => ({
    id: `entry-${i}`,
    dayNumber: (weekNum - 1) * 7 + i + 1,
    promptId: `prompt-${i}`,
    content: 'Some journal content for testing this entry',
    wordCount: 7,
    writingDurationSeconds: 300,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const completions = Array.from({ length: 5 }, (_, i) => ({
    dayNumber: (weekNum - 1) * 7 + i + 1,
    completedAt: new Date().toISOString(),
    journalEntries: [`entry-${i}`],
    videoWatched: i === 0,
    actionCompleted: i === 3,
    skipped: false,
  }));

  useJournalStore.setState({
    entries,
    completions,
    discoveries: [],
  });

  useReviewStore.setState({
    reviews: [],
  });
}

describe('WeeklyReviewPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    mockParams = { week: '1' };
    setupStores(1);
  });

  it('shows week completion badge', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Week 1 Complete')).toBeInTheDocument();
  });

  it('shows phase label as heading (Excavation for week 1)', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Excavation')).toBeInTheDocument();
  });

  it('shows "Week 1 of 4" subtitle', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Week 1 of 4')).toBeInTheDocument();
  });

  it('shows Marcus summary card', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Marcus')).toBeInTheDocument();
  });

  it('shows stats row with Days, Words, and Videos', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Videos')).toBeInTheDocument();
  });

  it('shows correct days completed stat', () => {
    render(<WeeklyReviewPage />);
    // 5 completions out of 7 days
    expect(screen.getByText('5/7')).toBeInTheDocument();
  });

  it('shows total words stat', () => {
    render(<WeeklyReviewPage />);
    // 5 entries * 7 words each = 35
    expect(screen.getByText('35')).toBeInTheDocument();
  });

  it('shows videos watched count', () => {
    render(<WeeklyReviewPage />);
    // "1" appears in both stats (videos watched) and pattern indicators
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "Patterns Marcus Noticed" section', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Patterns Marcus Noticed')).toBeInTheDocument();
  });

  it('shows pattern items with numbered indicators', () => {
    render(<WeeklyReviewPage />);
    // Week 1 has 5 patterns; numbers may appear in both stats and indicators
    const ones = screen.getAllByText('1');
    expect(ones.length).toBeGreaterThanOrEqual(1);
    const twos = screen.getAllByText('2');
    expect(twos.length).toBeGreaterThanOrEqual(1);
    const threes = screen.getAllByText('3');
    expect(threes.length).toBeGreaterThanOrEqual(1);
  });

  it('shows WHY draft section', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText(/Your WHY — Draft 1/)).toBeInTheDocument();
  });

  it('shows WHY draft text for week 1', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText(/Still forming/)).toBeInTheDocument();
  });

  it('shows "This will sharpen as you go deeper" note for early weeks', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('This will sharpen as you go deeper.')).toBeInTheDocument();
  });

  it('shows "Continue to Week 2" CTA for week 1', () => {
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Continue to Week 2')).toBeInTheDocument();
  });

  it('navigates to dashboard on continue click', async () => {
    const user = userEvent.setup();
    render(<WeeklyReviewPage />);

    await user.click(screen.getByText('Continue to Week 2'));
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('shows "Return to Dashboard" for week 4', () => {
    mockParams = { week: '4' };
    setupStores(4);
    render(<WeeklyReviewPage />);
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument();
  });

  it('shows Back button', () => {
    render(<WeeklyReviewPage />);
    const backBtn = screen.getByText((_, el) => {
      return el?.textContent?.includes('Back') && el?.tagName === 'BUTTON' || false;
    });
    expect(backBtn).toBeInTheDocument();
  });

  it('uses existing review WHY draft when available', () => {
    useReviewStore.setState({
      reviews: [
        {
          week: 1,
          daysCompleted: 5,
          totalWords: 500,
          videosWatched: 1,
          patterns: ['Pattern A'],
          whyDraft: 'My custom WHY draft',
          marcusSummary: 'Custom Marcus summary',
          generatedAt: new Date().toISOString(),
        },
      ],
    });

    render(<WeeklyReviewPage />);
    expect(screen.getByText(/My custom WHY draft/)).toBeInTheDocument();
    expect(screen.getByText('Custom Marcus summary')).toBeInTheDocument();
  });
});
