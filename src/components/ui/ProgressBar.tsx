import React from 'react';

interface ProgressBarProps {
  currentWeek: 1 | 2 | 3 | 4;
  className?: string;
}

const phases = [
  { week: 1, label: 'Excavation' },
  { week: 2, label: 'Clarity' },
  { week: 3, label: 'Vision' },
  { week: 4, label: 'Decision' },
] as const;

const ProgressBar: React.FC<ProgressBarProps> = ({ currentWeek, className = '' }) => {
  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {/* Segment bar */}
      <div className="flex gap-1.5">
        {phases.map(({ week }) => {
          let bg: string;
          if (week < currentWeek) {
            bg = 'bg-sage';
          } else if (week === currentWeek) {
            bg = 'bg-accent';
          } else {
            bg = 'bg-light-gray';
          }

          return (
            <div
              key={week}
              className={['h-2 flex-1 rounded-full transition-colors duration-300', bg].join(' ')}
            />
          );
        })}
      </div>

      {/* Labels */}
      <div className="mt-2 flex">
        {phases.map(({ week, label }) => {
          let textColor: string;
          if (week < currentWeek) {
            textColor = 'text-sage';
          } else if (week === currentWeek) {
            textColor = 'text-accent font-medium';
          } else {
            textColor = 'text-text-dim';
          }

          return (
            <span
              key={week}
              className={['flex-1 text-center text-xs font-body', textColor].join(' ')}
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
