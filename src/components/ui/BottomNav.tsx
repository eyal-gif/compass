'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { href: '/', label: 'Today', icon: '\uD83C\uDFE0' },
  { href: '/journal', label: 'Journal', icon: '\u270F\uFE0F' },
  { href: '/journey', label: 'Journey', icon: '\uD83D\uDDFA\uFE0F' },
  { href: '/insights', label: 'Insights', icon: '\uD83D\uDCA1' },
];

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map(({ href, label, icon }) => {
          const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-body transition-colors duration-150',
                isActive
                  ? 'text-accent font-medium'
                  : 'text-text-secondary hover:text-charcoal',
              ].join(' ')}
            >
              <span className="text-lg" aria-hidden="true">
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
