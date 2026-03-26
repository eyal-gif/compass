import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import BottomNav from '@/components/ui/BottomNav';
import MarcusCard from '@/components/marcus/MarcusCard';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// ── Button ──────────────────────────────────────────────────

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders as a button element', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies primary variant styles by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-accent');
    expect(btn.className).toContain('text-white');
  });

  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-bg-surface');
    expect(btn.className).toContain('border');
  });

  it('applies ghost variant styles', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('bg-transparent');
  });

  it('applies size sm styles', () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-3');
    expect(btn.className).toContain('py-1.5');
  });

  it('applies size lg styles', () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('px-7');
    expect(btn.className).toContain('py-3.5');
  });

  it('applies full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('w-full');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    expect(btn.className).toContain('disabled:opacity-50');
  });

  it('calls onClick handler', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ── Card ────────────────────────────────────────────────────

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default variant styles', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-bg-surface');
    expect(card.className).toContain('border-border');
  });

  it('applies marcus variant styles', () => {
    const { container } = render(<Card variant="marcus">Marcus</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-l-4');
    expect(card.className).toContain('border-l-accent');
  });

  it('applies action variant styles', () => {
    const { container } = render(<Card variant="action">Action</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-gold-light');
  });

  it('applies sage variant styles', () => {
    const { container } = render(<Card variant="sage">Sage</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-sage-light');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="mt-4">Custom</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('mt-4');
  });

  it('always has rounded corners and padding', () => {
    const { container } = render(<Card>Styled</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('rounded-2xl');
    expect(card.className).toContain('p-5');
  });
});

// ── Badge ───────────────────────────────────────────────────

describe('Badge', () => {
  it('renders journal badge with icon and label', () => {
    render(<Badge variant="journal" />);
    expect(screen.getByText('Journal')).toBeInTheDocument();
  });

  it('renders video badge', () => {
    render(<Badge variant="video" />);
    expect(screen.getByText('Video')).toBeInTheDocument();
  });

  it('renders action badge', () => {
    render(<Badge variant="action" />);
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders rest badge', () => {
    render(<Badge variant="rest" />);
    expect(screen.getByText('Rest')).toBeInTheDocument();
  });

  it('renders synthesis badge', () => {
    render(<Badge variant="synthesis" />);
    expect(screen.getByText('Synthesis')).toBeInTheDocument();
  });

  it('applies variant-specific color styles', () => {
    const { container } = render(<Badge variant="journal" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('bg-accent/10');
    expect(badge.className).toContain('text-accent-dark');
  });

  it('renders icon as aria-hidden', () => {
    const { container } = render(<Badge variant="journal" />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Badge variant="journal" className="ml-2" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('ml-2');
  });
});

// ── ProgressBar ─────────────────────────────────────────────

describe('ProgressBar', () => {
  it('renders all four phase labels', () => {
    render(<ProgressBar currentWeek={1} />);
    expect(screen.getByText('Excavation')).toBeInTheDocument();
    expect(screen.getByText('Clarity')).toBeInTheDocument();
    expect(screen.getByText('Vision')).toBeInTheDocument();
    expect(screen.getByText('Decision')).toBeInTheDocument();
  });

  it('shows active segment for current week (accent color)', () => {
    const { container } = render(<ProgressBar currentWeek={2} />);
    const segments = container.querySelectorAll('.rounded-full.h-2');
    // Week 1 should be completed (sage), Week 2 active (accent)
    expect(segments[0].className).toContain('bg-sage');
    expect(segments[1].className).toContain('bg-accent');
    expect(segments[2].className).toContain('bg-light-gray');
    expect(segments[3].className).toContain('bg-light-gray');
  });

  it('shows all segments completed for week 4', () => {
    const { container } = render(<ProgressBar currentWeek={4} />);
    const segments = container.querySelectorAll('.rounded-full.h-2');
    expect(segments[0].className).toContain('bg-sage');
    expect(segments[1].className).toContain('bg-sage');
    expect(segments[2].className).toContain('bg-sage');
    expect(segments[3].className).toContain('bg-accent');
  });

  it('highlights current week label with accent color', () => {
    render(<ProgressBar currentWeek={1} />);
    const excavationLabel = screen.getByText('Excavation');
    expect(excavationLabel.className).toContain('text-accent');
  });

  it('applies custom className', () => {
    const { container } = render(<ProgressBar currentWeek={1} className="mt-6" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('mt-6');
  });
});

// ── BottomNav ───────────────────────────────────────────────

describe('BottomNav', () => {
  it('renders all four navigation tabs', () => {
    render(<BottomNav />);
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<BottomNav />);
    const links = screen.getAllByRole('link');

    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/journal');
    expect(hrefs).toContain('/journey');
    expect(hrefs).toContain('/insights');
  });

  it('renders inside a nav element', () => {
    render(<BottomNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('highlights active tab based on current pathname', () => {
    // Default mock pathname is '/', so "Today" should be active
    render(<BottomNav />);
    const todayLink = screen.getByText('Today').closest('a');
    expect(todayLink?.className).toContain('text-accent');
  });

  it('renders emoji icons as aria-hidden', () => {
    const { container } = render(<BottomNav />);
    const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenIcons.length).toBe(4);
  });
});

// ── MarcusCard ──────────────────────────────────────────────

describe('MarcusCard', () => {
  it('shows "Marcus" label', () => {
    render(<MarcusCard quote="Test message" />);
    expect(screen.getByText('Marcus')).toBeInTheDocument();
  });

  it('shows the quote text', () => {
    render(<MarcusCard quote="Stay with the discomfort." />);
    expect(screen.getByText('Stay with the discomfort.')).toBeInTheDocument();
  });

  it('renders compass emoji as aria-hidden', () => {
    const { container } = render(<MarcusCard quote="Test" />);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
    expect(icon?.textContent).toBe('\uD83E\uDDED');
  });

  it('uses marcus card variant by default', () => {
    const { container } = render(<MarcusCard quote="Default variant" />);
    // MarcusCard default maps to Card variant="marcus" which has border-l-4
    const card = container.querySelector('.border-l-4');
    expect(card).toBeInTheDocument();
  });

  it('uses sage card variant when variant="sage"', () => {
    const { container } = render(<MarcusCard quote="Sage variant" variant="sage" />);
    const card = container.querySelector('.bg-sage-light');
    expect(card).toBeInTheDocument();
  });

  it('uses action card variant when variant="gold"', () => {
    const { container } = render(<MarcusCard quote="Gold variant" variant="gold" />);
    const card = container.querySelector('.bg-gold-light');
    expect(card).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<MarcusCard quote="Custom" className="mt-8" />);
    const card = container.querySelector('.mt-8');
    expect(card).toBeInTheDocument();
  });
});
