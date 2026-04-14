'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  useMeditationStore,
  getCurrentStreak,
} from '@/stores/meditationStore';
import { getDayContent } from '@/data/program';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProgressBar from '@/components/ui/ProgressBar';
import BottomNav from '@/components/ui/BottomNav';

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

const typeBadgeColors: Record<string, string> = {
  guided: 'bg-accent/15 text-accent',
  breathing: 'bg-sage/15 text-sage',
  'body-scan': 'bg-warm-gray/15 text-warm-gray',
  silent: 'bg-charcoal/10 text-charcoal',
  'loving-kindness': 'bg-accent/10 text-accent',
};

export default function DashboardPage() {
  const router = useRouter();

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

  if (!user.onboardingComplete) {
    router.replace('/onboarding');
    return null;
  }

  const { name, currentDay } = user;
  const streak = getCurrentStreak(completions);
  const completedCount = Object.keys(completions).length;
  const progressPercent = Math.round((completedCount / 30) * 100);
  const todayContent = getDayContent(currentDay);
  const isFinished = currentDay > 30;

  return (
    <div className="min-h-screen bg-primary pb-24">
      <div className="mx-auto max-w-lg px-6 pt-8">
        {/* Greeting */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <p className="font-body text-sm tracking-wide text-warm-gray uppercase">
            Day {Math.min(currentDay, 30)} of 30
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-charcoal">
            Welcome back{name ? `, ${name}` : ''}
          </h1>
        </motion.div>

        {/* Progress */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-6"
        >
          <ProgressBar value={progressPercent} label="Overall Progress" />
        </motion.div>

        {/* Streak */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-4 flex items-center gap-2"
        >
          <span className="text-2xl" role="img" aria-label="fire">
            {'\uD83D\uDD25'}
          </span>
          <span className="font-body text-sm font-medium text-charcoal">
            {streak} day streak
          </span>
        </motion.div>

        {/* Today's Meditation Card or Congrats */}
        {isFinished ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6"
          >
            <Card highlighted>
              <div className="text-center py-4">
                <span className="text-5xl" role="img" aria-label="celebration">
                  {'\uD83C\uDF1F'}
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-charcoal">
                  Congratulations!
                </h2>
                <p className="mt-2 font-body text-sm text-warm-gray leading-relaxed">
                  You have completed all 30 days of meditation. Your practice is now
                  yours to continue. The stillness lives within you.
                </p>
              </div>
            </Card>
          </motion.div>
        ) : todayContent ? (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6"
          >
            <Card className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1 bg-accent" />
              <div className="pl-3">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      'rounded-full px-2.5 py-0.5 text-xs font-medium font-body capitalize',
                      typeBadgeColors[todayContent.type] ?? 'bg-light-gray text-charcoal',
                    ].join(' ')}
                  >
                    {todayContent.type.replace('-', ' ')}
                  </span>
                  <span className="font-mono text-xs text-warm-gray">
                    {todayContent.durationMinutes} min
                  </span>
                </div>

                <h2 className="mt-3 font-display text-xl font-bold text-charcoal">
                  {todayContent.title}
                </h2>
                <p className="mt-1 font-body text-sm text-warm-gray leading-relaxed">
                  {todayContent.description}
                </p>

                <div className="mt-4">
                  <Link href={`/day/${currentDay}`}>
                    <Button fullWidth size="lg">
                      Begin Session
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : null}

        {/* 30-day overview circles */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-8"
        >
          <h3 className="mb-3 font-body text-xs font-semibold tracking-widest text-warm-gray uppercase">
            30-day overview
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isCompleted = !!completions[day];
              const isCurrent = day === currentDay && !isFinished;

              return (
                <div
                  key={day}
                  className={[
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium font-body transition-colors',
                    isCompleted
                      ? 'bg-sage text-white'
                      : isCurrent
                      ? 'ring-2 ring-accent text-accent bg-primary'
                      : 'bg-light-gray/50 text-warm-gray',
                  ].join(' ')}
                >
                  {isCompleted ? '\u2713' : day}
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
