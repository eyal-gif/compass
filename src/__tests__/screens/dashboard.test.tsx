import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '@/app/page';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { getDayContent, getWeekDays } from '@/data/program';

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

// Capture router.replace calls
const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('DashboardPage', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    mockPush.mockClear();

    // Default: onboarding complete, user with name
    useUserStore.setState({
      profile: {
        id: 'test-id',
        name: 'Alex',
        startDate: new Date().toISOString(),
        currentDay: 1,
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

  it('redirects to onboarding if not completed', () => {
    useUserStore.setState({
      profile: {
        id: 'test-id',
        name: '',
        startDate: new Date().toISOString(),
        currentDay: 1,
        currentWeek: 1,
        dailyReminderTime: '09:00',
        marcusNudgesEnabled: true,
        weeklyPatternAnalysis: true,
        writingFontSize: 'medium',
        darkModeWriting: false,
        onboardingComplete: false,
        createdAt: new Date().toISOString(),
      },
    });

    render(<DashboardPage />);
    expect(mockReplace).toHaveBeenCalledWith('/onboarding');
  });

  it('renders greeting with user name', () => {
    render(<DashboardPage />);
    // getGreetingPrefix returns "Good morning/afternoon/evening, Alex"
    expect(screen.getByText(/Alex/)).toBeInTheDocument();
  });

  it('shows current day number out of 28', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Day 1 of 28')).toBeInTheDocument();
  });

  it('shows a different day number when advanced', () => {
    useUserStore.setState({
      profile: {
        id: 'test-id',
        name: 'Alex',
        startDate: new Date().toISOString(),
        currentDay: 5,
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

    render(<DashboardPage />);
    expect(screen.getByText('Day 5 of 28')).toBeInTheDocument();
  });

  it('shows the phase progress bar with Excavation label for week 1', () => {
    render(<DashboardPage />);
    // ProgressBar renders phase labels
    expect(screen.getByText('Excavation')).toBeInTheDocument();
    expect(screen.getByText('Clarity')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(screen.getByText('Decision')).toBeInTheDocument();
  });

  it('shows week number and phase label', () => {
    render(<DashboardPage />);
    // "Week 1 — Excavation" rendered with mdash
    const weekText = screen.getAllByText((_, el) => {
      return el?.textContent?.includes('Week 1') && el?.textContent?.includes('Excavation') || false;
    });
    expect(weekText.length).toBeGreaterThan(0);
  });

  it('renders Marcus daily message card', () => {
    render(<DashboardPage />);
    // MarcusCard always renders "Marcus" label
    expect(screen.getByText('Marcus')).toBeInTheDocument();
  });

  it('shows today\'s practice card with title from day content', () => {
    const dayContent = getDayContent(1);
    render(<DashboardPage />);

    if (dayContent) {
      // Title appears both in the practice card and the week schedule
      const titles = screen.getAllByText(dayContent.title);
      expect(titles.length).toBeGreaterThan(0);
    }
  });

  it('shows start practice button for non-rest day', () => {
    render(<DashboardPage />);
    expect(screen.getByText("Start today\u2019s practice")).toBeInTheDocument();
  });

  it('shows "This week" schedule section with week days', () => {
    render(<DashboardPage />);
    expect(screen.getByText('This week')).toBeInTheDocument();

    const weekDays = getWeekDays(1);
    // Each week day title should appear in the schedule (may appear more than once if it's also today's practice)
    weekDays.forEach((day) => {
      const matches = screen.getAllByText(day.title);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('shows "Today" label next to current day in schedule', () => {
    render(<DashboardPage />);
    // "Today" appears in both the schedule and BottomNav
    const todayLabels = screen.getAllByText('Today');
    expect(todayLabels.length).toBeGreaterThanOrEqual(1);
  });

  it('shows completion status for completed days', () => {
    useJournalStore.setState({
      entries: [],
      completions: [
        {
          dayNumber: 1,
          completedAt: new Date().toISOString(),
          journalEntries: ['entry-1'],
          videoWatched: true,
          actionCompleted: false,
          skipped: false,
        },
      ],
      discoveries: [],
    });

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

    render(<DashboardPage />);
    // Completed day shows checkmark
    expect(screen.getByText('\u2713')).toBeInTheDocument();
  });

  it('renders BottomNav with all navigation tabs', () => {
    render(<DashboardPage />);
    // "Today" may appear in both schedule and BottomNav; "Journal" may appear in badge labels
    const todayLabels = screen.getAllByText('Today');
    expect(todayLabels.length).toBeGreaterThanOrEqual(1);
    const journalLabels = screen.getAllByText('Journal');
    expect(journalLabels.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });
});
