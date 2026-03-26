import React from 'react';

type BadgeVariant = 'journal' | 'video' | 'action' | 'rest' | 'synthesis';

interface BadgeProps {
  variant: BadgeVariant;
  className?: string;
}

const config: Record<BadgeVariant, { icon: string; label: string; style: string }> = {
  journal: {
    icon: '\u270F\uFE0F',
    label: 'Journal',
    style: 'bg-accent/10 text-accent-dark',
  },
  video: {
    icon: '\uD83C\uDFA5',
    label: 'Video',
    style: 'bg-accent-light/20 text-accent-dark',
  },
  action: {
    icon: '\u26A1',
    label: 'Action',
    style: 'bg-gold-light text-gold',
  },
  rest: {
    icon: '\uD83C\uDF3F',
    label: 'Rest',
    style: 'bg-sage-light text-sage',
  },
  synthesis: {
    icon: '\uD83D\uDD2E',
    label: 'Synthesis',
    style: 'bg-bg-surface-2 text-warm-gray',
  },
};

const Badge: React.FC<BadgeProps> = ({ variant, className = '' }) => {
  const { icon, label, style } = config[variant];

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium font-body',
        style,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
};

export default Badge;
