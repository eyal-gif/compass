'use client';

import React from 'react';
import Card from '../ui/Card';

type MarcusVariant = 'default' | 'gold' | 'sage';

interface MarcusCardProps {
  quote: string;
  variant?: MarcusVariant;
  className?: string;
}

const cardVariantMap: Record<MarcusVariant, 'marcus' | 'action' | 'sage'> = {
  default: 'marcus',
  gold: 'action',
  sage: 'sage',
};

const MarcusCard: React.FC<MarcusCardProps> = ({
  quote,
  variant = 'default',
  className = '',
}) => {
  return (
    <Card variant={cardVariantMap[variant]} className={className}>
      <div className="flex items-start gap-3">
        {/* Compass emoji */}
        <span className="text-xl leading-none" aria-hidden="true">
          {'\uD83E\uDDED'}
        </span>

        <div className="min-w-0 flex-1">
          {/* Marcus label */}
          <p className="mb-1.5 text-sm font-medium text-accent font-body">
            Marcus
          </p>

          {/* Quote */}
          <p className="text-base italic leading-relaxed text-charcoal font-display">
            {quote}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MarcusCard;
