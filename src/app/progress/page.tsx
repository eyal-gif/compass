'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  useMeditationStore,
  getCurrentStreak,
  getLongestStreak,
  getTotalMinutes,
  getTotalSessions,
  getAverageRating,
} from '@/stores/meditationStore';
import { getWeekLabel } from '@/data/program';
import Card from '@/components/ui/Card';
import BottomNav from '@/components/ui/BottomNav';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

const ratingLabels = ['', 'Struggled', 'Uneasy', 'Neutral', 'Good', 'Peaceful'];

export default function ProgressPage() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useMeditationStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const user = useMeditationStore((s) => s.user);
  const completions = useMeditationStore((s) => s.completions);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  const totalSessions = getTotalSessions(completions);
  const totalMinutes = Math.round(getTotalMinutes(completions));
  const currentStreak = getCurrentStreak(completions);
  const longestStreak = getLongestStreak(completions);
  const avgRating = getAverageRating(completions);
  const avgRatingRounded = Math.round(avgRating);

  // Build 30-day grid: 5 rows x 6 columns
  const weeks = [1, 2, 3, 4, 5] as const;

  return (
    <div className="min-h-screen bg-primary pb-24">
      <div className="mx-auto max-w-lg px-6 pt-8">
        {/* Title */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <h1 className="font-display text-2xl font-bold text-charcoal">
            Your Journey
          </h1>
          <p className="mt-1 font-body text-sm text-warm-gray">
            Day {Math.min(user.currentDay, 30)} of 30
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-6 grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Total Sessions', value: totalSessions },
            { label: 'Total Minutes', value: totalMinutes },
            { label: 'Current Streak', value: `${currentStreak} days` },
            { label: 'Longest Streak', value: `${longestStreak} days` },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-charcoal font-display">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-warm-gray font-body">
                {stat.label}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* Average mood */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6"
        >
          <Card className="text-center">
            <p className="text-xs font-semibold tracking-widest text-warm-gray font-body uppercase">
              Average Mood
            </p>
            {totalSessions > 0 ? (
              <>
                <p className="mt-2 text-3xl">
                  {avgRatingRounded >= 1 && avgRatingRounded <= 5
                    ? ['\uD83D\uDE23', '\uD83D\uDE15', '\uD83D\uDE10', '\uD83D\uDE42', '\uD83D\uDE0C'][avgRatingRounded - 1]
                    : '\u2014'}
                </p>
                <p className="mt-1 text-sm text-charcoal font-body font-medium">
                  {ratingLabels[avgRatingRounded] || '\u2014'}
                </p>
                <p className="mt-0.5 text-xs text-warm-gray font-mono">
                  {avgRating.toFixed(1)} / 5
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-warm-gray font-body">
                Complete a session to see your mood
              </p>
            )}
          </Card>
        </motion.div>

        {/* 30-day calendar grid */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-8"
        >
          <h3 className="mb-4 font-body text-xs font-semibold tracking-widest text-warm-gray uppercase">
            30-Day Calendar
          </h3>

          <div className="space-y-4">
            {weeks.map((week) => {
              const startDay = week <= 4 ? (week - 1) * 7 + 1 : 29;
              const endDay = week <= 4 ? week * 7 : 30;
              const days = [];
              for (let d = startDay; d <= endDay; d++) {
                days.push(d);
              }

              return (
                <div key={week}>
                  <p className="mb-2 text-xs text-warm-gray font-body font-medium">
                    {getWeekLabel(week)}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {days.map((day) => {
                      const isCompleted = !!completions[day];
                      const isCurrent = day === user.currentDay && user.currentDay <= 30;

                      return (
                        <div
                          key={day}
                          className={[
                            'flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium font-body transition-colors',
                            isCompleted
                              ? 'bg-sage text-white'
                              : isCurrent
                              ? 'ring-2 ring-accent text-accent bg-surface'
                              : 'border border-light-gray text-warm-gray bg-surface',
                          ].join(' ')}
                        >
                          {isCompleted ? '\u2713' : day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
