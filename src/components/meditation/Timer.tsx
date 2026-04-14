'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  durationMinutes: number;
  onComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ durationMinutes, onComplete }) => {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setSecondsLeft(totalSeconds);
    setIsRunning(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft]);

  const togglePlay = useCallback(() => {
    if (secondsLeft === 0) {
      setSecondsLeft(totalSeconds);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  }, [secondsLeft, totalSeconds]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / totalSeconds;

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={isRunning ? { scale: [1, 1.03, 1] } : { scale: 1 }}
          transition={
            isRunning
              ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        >
          <svg width="220" height="220" viewBox="0 0 220 220">
            {/* Background circle */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              className="stroke-light-gray"
              strokeWidth="6"
            />
            {/* Progress arc */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              className="stroke-sage"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 110 110)"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
        </motion.div>

        {/* Time display */}
        <span className="absolute font-display text-5xl text-charcoal tabular-nums">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>

      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-md transition-colors hover:bg-accent-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label={isRunning ? 'Pause' : 'Play'}
      >
        {isRunning ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Timer;
