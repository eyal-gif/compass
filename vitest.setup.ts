import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

// Mock framer-motion
vi.mock('framer-motion', () => {
  const createMotionComponent = (tag: string) => {
    return React.forwardRef(function MotionComponent(props: Record<string, unknown>, ref: unknown) {
      const {
        initial, animate, exit, transition, whileHover, whileTap,
        whileInView, variants, custom, layout, layoutId,
        onAnimationComplete, ...rest
      } = props;
      void initial; void animate; void exit; void transition;
      void whileHover; void whileTap; void whileInView; void variants;
      void custom; void layout; void layoutId; void onAnimationComplete;
      return React.createElement(tag, { ...rest, ref });
    });
  };
  return {
    motion: {
      div: createMotionComponent('div'),
      button: createMotionComponent('button'),
      span: createMotionComponent('span'),
      p: createMotionComponent('p'),
      section: createMotionComponent('section'),
      main: createMotionComponent('main'),
      h1: createMotionComponent('h1'),
      h2: createMotionComponent('h2'),
      h3: createMotionComponent('h3'),
      ul: createMotionComponent('ul'),
      li: createMotionComponent('li'),
      a: createMotionComponent('a'),
      input: createMotionComponent('input'),
      textarea: createMotionComponent('textarea'),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({ start: vi.fn() }),
    useInView: () => true,
  };
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: React.forwardRef(function MockLink(
    { children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown },
    ref: unknown,
  ) {
    return React.createElement('a', { href, ...props, ref }, children);
  }),
}));
