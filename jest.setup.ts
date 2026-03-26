import '@testing-library/jest-dom';

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  const createMotionComponent = (tag: string) => {
    return React.forwardRef(function MotionComponent(props: Record<string, unknown>, ref: unknown) {
      const {
        initial, animate, exit, transition, whileHover, whileTap,
        whileInView, variants, custom, layout, layoutId,
        onAnimationComplete, ...rest
      } = props;
      // Suppress unused variable warnings
      void initial; void animate; void exit; void transition;
      void whileHover; void whileTap; void whileInView; void variants;
      void custom; void layout; void layoutId; void onAnimationComplete;
      return React.createElement(tag, { ...rest, ref });
    });
  };
  return {
    __esModule: true,
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
    useAnimation: () => ({ start: jest.fn() }),
    useInView: () => true,
  };
});

// Mock next/navigation
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

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: React.forwardRef(function MockLink(
      { children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown },
      ref: unknown,
    ) {
      return React.createElement('a', { href, ...props, ref }, children);
    }),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-' + Math.random().toString(36).slice(2),
    },
  });
}
