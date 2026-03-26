import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DayPage from '@/app/day/[dayNumber]/page';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { getDayContent } from '@/data/program';

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
let mockParams: Record<string, string> = { dayNumber: '1' };

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    back: mockBack,
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/day/1',
  useParams: () => mockParams,
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  );
});

function setDefaultUserState() {
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
}

describe('DayPage', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockBack.mockClear();
    setDefaultUserState();
  });

  describe('video_journal day (Day 1)', () => {
    beforeEach(() => {
      mockParams = { dayNumber: '1' };
    });

    it('renders day title and badge', () => {
      render(<DayPage />);
      const content = getDayContent(1)!;
      expect(screen.getByText(content.title)).toBeInTheDocument();
      expect(screen.getByText('Day 1')).toBeInTheDocument();
    });

    it('shows Marcus intro message', () => {
      render(<DayPage />);
      // Multiple MarcusCards on video_journal days (intro + pre-watch note)
      const marcusLabels = screen.getAllByText('Marcus');
      expect(marcusLabels.length).toBeGreaterThanOrEqual(1);
      const content = getDayContent(1)!;
      expect(screen.getByText(content.marcusIntro)).toBeInTheDocument();
    });

    it('renders YouTube embed iframe', () => {
      render(<DayPage />);
      const content = getDayContent(1)!;
      const iframe = document.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe?.src).toContain(content.video!.youtubeId);
    });

    it('shows video title and speaker', () => {
      render(<DayPage />);
      const content = getDayContent(1)!;
      expect(screen.getByText(content.video!.title)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(content.video!.speaker))).toBeInTheDocument();
    });

    it('shows "After watching" section with post-watch prompts', () => {
      render(<DayPage />);
      expect(screen.getByText('After watching')).toBeInTheDocument();
      const content = getDayContent(1)!;
      content.video!.postWatchPrompts.forEach((prompt) => {
        expect(screen.getByText(prompt)).toBeInTheDocument();
      });
    });

    it('shows journal prompts section', () => {
      render(<DayPage />);
      expect(screen.getByText('Journal prompts')).toBeInTheDocument();
      const content = getDayContent(1)!;
      content.prompts!.forEach((prompt) => {
        expect(screen.getByText(prompt.text)).toBeInTheDocument();
      });
    });

    it('shows "Start reflection" CTA button', () => {
      render(<DayPage />);
      expect(screen.getByText('Start reflection')).toBeInTheDocument();
    });

    it('links Start reflection to write page with correct params', () => {
      render(<DayPage />);
      const link = screen.getByText('Start reflection').closest('a');
      expect(link).toHaveAttribute('href', '/day/write?dayNumber=1&promptIndex=0');
    });
  });

  describe('journal day (Day 2)', () => {
    beforeEach(() => {
      mockParams = { dayNumber: '2' };
    });

    it('renders journal day title and badge', () => {
      render(<DayPage />);
      const content = getDayContent(2)!;
      expect(screen.getByText(content.title)).toBeInTheDocument();
      expect(screen.getByText('Journal')).toBeInTheDocument();
    });

    it('shows prompts for journal days', () => {
      render(<DayPage />);
      const content = getDayContent(2)!;
      content.prompts!.forEach((prompt) => {
        expect(screen.getByText(prompt.text)).toBeInTheDocument();
      });
    });

    it('shows "Start writing" CTA', () => {
      render(<DayPage />);
      expect(screen.getByText('Start writing')).toBeInTheDocument();
    });

    it('shows estimated minutes for each prompt', () => {
      render(<DayPage />);
      const content = getDayContent(2)!;
      // Multiple prompts may share the same estimated minutes, use getAllByText
      const uniqueMinutes = [...new Set(content.prompts!.map((p) => p.estimatedMinutes))];
      uniqueMinutes.forEach((min) => {
        const count = content.prompts!.filter((p) => p.estimatedMinutes === min).length;
        const matches = screen.getAllByText(`~${min} min`);
        expect(matches.length).toBe(count);
      });
    });
  });

  describe('action day (Day 4)', () => {
    beforeEach(() => {
      mockParams = { dayNumber: '4' };
    });

    it('renders action day with steps', () => {
      render(<DayPage />);
      const content = getDayContent(4)!;
      expect(content.type).toBe('action');
      expect(screen.getByText(content.title)).toBeInTheDocument();
      content.actionSteps!.forEach((step) => {
        expect(screen.getByText(step.title)).toBeInTheDocument();
        expect(screen.getByText(step.description)).toBeInTheDocument();
      });
    });

    it('shows "I\'ve completed this" button for action days', () => {
      render(<DayPage />);
      expect(screen.getByText("I've completed this")).toBeInTheDocument();
    });

    it('completes day and navigates home on action complete', async () => {
      const user = userEvent.setup();
      useUserStore.setState({
        profile: {
          ...useUserStore.getState().profile,
          currentDay: 4,
        },
      });

      render(<DayPage />);
      await user.click(screen.getByText("I've completed this"));

      expect(mockPush).toHaveBeenCalledWith('/');
      // Day should be completed in journal store
      const completion = useJournalStore.getState().completions.find((c) => c.dayNumber === 4);
      expect(completion).toBeDefined();
      expect(completion!.actionCompleted).toBe(true);
    });
  });

  describe('rest day (Day 7)', () => {
    beforeEach(() => {
      mockParams = { dayNumber: '7' };
    });

    it('renders rest day content', () => {
      render(<DayPage />);
      const content = getDayContent(7)!;
      expect(content.type).toBe('rest');
      expect(screen.getByText(content.title)).toBeInTheDocument();
      expect(screen.getByText('No writing today. Let your mind integrate.')).toBeInTheDocument();
    });

    it('shows "Mark rest day complete" button', () => {
      render(<DayPage />);
      expect(screen.getByText('Mark rest day complete')).toBeInTheDocument();
    });

    it('shows Rest badge', () => {
      render(<DayPage />);
      expect(screen.getByText('Rest')).toBeInTheDocument();
    });
  });

  describe('invalid day', () => {
    it('shows "Day not found" for invalid day number', () => {
      mockParams = { dayNumber: '999' };
      render(<DayPage />);
      expect(screen.getByText('Day not found.')).toBeInTheDocument();
    });

    it('shows back to dashboard link for invalid day', () => {
      mockParams = { dayNumber: '999' };
      render(<DayPage />);
      expect(screen.getByText('Back to dashboard')).toBeInTheDocument();
    });
  });

  it('shows Dashboard back link', () => {
    mockParams = { dayNumber: '1' };
    render(<DayPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows week and phase info', () => {
    mockParams = { dayNumber: '1' };
    render(<DayPage />);
    const weekTexts = screen.getAllByText((_, el) => {
      return el?.textContent?.includes('Week 1') && el?.textContent?.includes('Excavation') || false;
    });
    expect(weekTexts.length).toBeGreaterThan(0);
  });
});
