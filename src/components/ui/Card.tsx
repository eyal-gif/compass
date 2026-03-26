'use client';

import React from 'react';

type CardVariant = 'default' | 'marcus' | 'action' | 'sage';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-bg-surface border border-border',
  marcus: 'bg-bg-surface border border-border border-l-4 border-l-accent',
  action: 'bg-gold-light border border-gold/20',
  sage: 'bg-sage-light border border-sage/20',
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[
          'rounded-2xl p-5 shadow-sm',
          variantStyles[variant],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export default Card;
