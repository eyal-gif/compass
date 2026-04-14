import React from 'react';

interface ProgressBarProps {
  /** 0 to 100 */
  value: number;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      {(label || true) && (
        <div className="mb-1.5 flex items-center justify-between font-body text-sm">
          {label && <span className="text-text-secondary">{label}</span>}
          <span className="text-text-dim ml-auto">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-light-gray">
        <div
          className="h-full rounded-full bg-sage transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
