import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OnboardingPage from '@/app/onboarding/page';
import { useUserStore } from '@/stores/userStore';

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

const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/onboarding',
  useParams: () => ({}),
}));

jest.mock('next/link', () => {
  return ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  );
});

describe('OnboardingPage', () => {
  beforeEach(() => {
    mockReplace.mockClear();

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
  });

  it('shows splash screen initially with Compass title', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Compass')).toBeInTheDocument();
    expect(screen.getByText('Find your direction')).toBeInTheDocument();
  });

  it('shows "Begin your journey" button on splash', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Begin your journey')).toBeInTheDocument();
  });

  it('shows Marcus welcome message on splash screen', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Marcus')).toBeInTheDocument();
  });

  it('shows 28-day program description on splash', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('A 28-day self-discovery program')).toBeInTheDocument();
  });

  it('navigates to name input on step 2 after clicking begin', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));

    expect(screen.getByText('What should I call you?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your first name')).toBeInTheDocument();
  });

  it('shows daily reminder time input on step 2', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));

    expect(screen.getByText('Daily reminder time')).toBeInTheDocument();
  });

  it('validates name is not empty - Continue button disabled when name is empty', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));

    const continueButton = screen.getByText('Continue');
    expect(continueButton).toBeDisabled();
  });

  it('enables Continue button when name is entered', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));

    const nameInput = screen.getByPlaceholderText('Your first name');
    await user.type(nameInput, 'Alex');

    const continueButton = screen.getByText('Continue');
    expect(continueButton).not.toBeDisabled();
  });

  it('shows commitment step after entering name and clicking Continue', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));

    const nameInput = screen.getByPlaceholderText('Your first name');
    await user.type(nameInput, 'Alex');
    await user.click(screen.getByText('Continue'));

    expect(screen.getByText('Your commitment')).toBeInTheDocument();
    expect(screen.getByText('28 days of guided self-discovery')).toBeInTheDocument();
  });

  it('shows personalized Marcus message with entered name on commitment step', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));

    const nameInput = screen.getByPlaceholderText('Your first name');
    await user.type(nameInput, 'Alex');
    await user.click(screen.getByText('Continue'));

    expect(screen.getByText(/Alex, this only works if you're honest/)).toBeInTheDocument();
  });

  it('shows "I\'m ready" button on commitment step', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));
    await user.type(screen.getByPlaceholderText('Your first name'), 'Alex');
    await user.click(screen.getByText('Continue'));

    expect(screen.getByText("I'm ready")).toBeInTheDocument();
  });

  it('completes onboarding and redirects on "I\'m ready" click', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));
    await user.type(screen.getByPlaceholderText('Your first name'), 'Alex');
    await user.click(screen.getByText('Continue'));
    await user.click(screen.getByText("I'm ready"));

    // Should set user data
    const state = useUserStore.getState();
    expect(state.profile.name).toBe('Alex');
    expect(state.profile.onboardingComplete).toBe(true);

    // Should redirect to dashboard
    expect(mockReplace).toHaveBeenCalledWith('/');
  });

  it('shows step indicator dots', () => {
    render(<OnboardingPage />);
    // 3 step dots rendered (step 0, 1, 2)
    const dots = document.querySelectorAll('.rounded-full.h-1\\.5');
    expect(dots.length).toBe(3);
  });

  it('allows going back from commitment step', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.click(screen.getByText('Begin your journey'));
    await user.type(screen.getByPlaceholderText('Your first name'), 'Alex');
    await user.click(screen.getByText('Continue'));

    expect(screen.getByText('Your commitment')).toBeInTheDocument();

    await user.click(screen.getByText('Go back'));
    expect(screen.getByText('What should I call you?')).toBeInTheDocument();
  });
});
