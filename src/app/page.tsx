'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { getDayContent, getWeekDays, dayTypeToBadgeVariant } from '@/data/program';
import { getGreeting } from '@/data/marcus-quotes';
import {
  getGreetingPrefix,
  getDayTypeIcon,
  getDayTypeLabel,
  getPhaseForWeek,
  getPhaseLabel,
} from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import MarcusCard from '@/components/marcus/MarcusCard';
import BottomNav from '@/components/ui/BottomNav';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function DashboardPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const getCompletionForDay = useJournalStore((s) => s.getCompletionForDay);

  // Hydration guard for Zustand persisted stores
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Stable Marcus quote per session
  const [marcusMessage] = useState(() => getGreeting());

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  // Redirect to onboarding if not complete
  if (!profile.onboardingComplete) {
    router.replace('/onboarding');
    return null;
  }

  const { name, currentDay, currentWeek } = profile;
  const todayContent = getDayContent(currentDay);
  const weekDays = getWeekDays(currentWeek);
  const phase = getPhaseForWeek(currentWeek);
  const clampedWeek = Math.min(Math.max(currentWeek, 1), 4) as 1 | 2 | 3 | 4;

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <div className="mx-auto max-w-lg px-5 pt-8">
        {/* ── Greeting ─────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <p className="font-body text-sm tracking-wide text-warm-gray uppercase">
            Day {currentDay} of 28
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-charcoal">
            {getGreetingPrefix(name)}
          </h1>
        </motion.div>

        {/* ── Phase Progress ───────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-6"
        >
          <p className="mb-2 text-center font-mono text-xs tracking-widest text-warm-gray uppercase">
            Week {currentWeek} &mdash; {getPhaseLabel(phase)}
          </p>
          <ProgressBar currentWeek={clampedWeek} />
        </motion.div>

        {/* ── Marcus Card ──────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6"
        >
          <MarcusCard quote={marcusMessage} />
        </motion.div>

        {/* ── Today's Practice ─────────────────────────────── */}
        {todayContent && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6"
          >
            <Card className="relative overflow-hidden">
              {/* Subtle accent strip */}
              <div className="absolute inset-y-0 left-0 w-1 bg-accent" />

              <div className="pl-3">
                <div className="flex items-center gap-2">
                  <Badge variant={dayTypeToBadgeVariant(todayContent.type)} />
                  {todayContent.estimatedMinutes > 0 && (
                    <span className="font-mono text-xs text-text-dim">
                      {todayContent.estimatedMinutes} min
                    </span>
                  )}
                </div>

                <h2 className="mt-3 font-display text-xl font-bold text-charcoal">
                  {todayContent.title}
                </h2>
                {todayContent.subtitle && (
                  <p className="mt-1 font-body text-sm text-warm-gray">
                    {todayContent.subtitle}
                  </p>
                )}

                <div className="mt-4">
                  <Link href={`/day/${currentDay}`}>
                    <Button fullWidth size="lg">
                      {todayContent.isRestDay
                        ? 'View today\u2019s rest day'
                        : 'Start today\u2019s practice'}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ── This Week's Schedule ─────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-8"
        >
          <h3 className="mb-3 font-body text-xs font-semibold tracking-widest text-warm-gray uppercase">
            This week
          </h3>

          <div className="space-y-2">
            {weekDays.map((day) => {
              const completion = getCompletionForDay(day.dayNumber);
              const isToday = day.dayNumber === currentDay;
              const isPast = day.dayNumber < currentDay;
              const isCompleted = !!completion && !completion.skipped;
              const isSkipped = !!completion?.skipped;

              return (
                <Link
                  key={day.dayNumber}
                  href={`/day/${day.dayNumber}`}
                  className={[
                    'flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-150',
                    isToday
                      ? 'bg-bg-surface border border-accent/30 shadow-sm'
                      : 'hover:bg-bg-surface-2',
                  ].join(' ')}
                >
                  {/* Day indicator */}
                  <div
                    className={[
                      'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-medium font-body',
                      isCompleted
                        ? 'bg-sage text-white'
                        : isToday
                        ? 'bg-accent text-white'
                        : isSkipped
                        ? 'bg-bg-surface-2 text-text-dim line-through'
                        : 'bg-bg-surface-2 text-warm-gray',
                    ].join(' ')}
                  >
                    {isCompleted ? '\u2713' : day.dayNumber}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={[
                        'truncate font-body text-sm',
                        isToday
                          ? 'font-semibold text-charcoal'
                          : isPast
                          ? 'text-warm-gray'
                          : 'text-charcoal',
                      ].join(' ')}
                    >
                      {day.title}
                    </p>
                    <p className="text-xs text-text-dim">
                      {getDayTypeIcon(day.type)}{' '}
                      {getDayTypeLabel(day.type)}
                      {day.estimatedMinutes > 0 &&
                        ` \u00B7 ${day.estimatedMinutes} min`}
                    </p>
                  </div>

                  {/* Status */}
                  {isToday && !isCompleted && (
                    <span className="flex-shrink-0 text-xs font-medium text-accent font-body">
                      Today
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
