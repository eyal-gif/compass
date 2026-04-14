import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import BottomNav from '@/components/ui/BottomNav';

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
    expect(btn.className).toContain('bg-transparent');
    expect(btn.className).toContain('border');
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
    const onClick = vi.fn();
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

  it('applies default styles with border-border', () => {
    const { container } = render(<Card>Default</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('bg-bg-surface');
    expect(card.className).toContain('border-border');
  });

  it('applies highlighted styles with border-accent', () => {
    const { container } = render(<Card highlighted>Highlighted</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('border-2');
    expect(card.className).toContain('border-accent');
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

// ── ProgressBar ─────────────────────────────────────────────

describe('ProgressBar', () => {
  it('renders with a given value', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<ProgressBar value={50} className="mt-6" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('mt-6');
  });
});

// ── BottomNav ───────────────────────────────────────────────

describe('BottomNav', () => {
  it('renders inside a nav element', () => {
    render(<BottomNav />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders all navigation tabs', () => {
    render(<BottomNav />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<BottomNav />);
    const links = screen.getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href'));
    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/progress');
    expect(hrefs).toContain('/settings');
  });

  it('highlights active tab based on current pathname', () => {
    render(<BottomNav />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink?.className).toContain('text-accent');
  });

  it('renders SVG icons as aria-hidden', () => {
    const { container } = render(<BottomNav />);
    const hiddenIcons = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenIcons.length).toBe(3);
  });
});
