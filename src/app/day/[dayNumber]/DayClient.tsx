'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useMeditationStore } from '@/stores/meditationStore';
import { getDayContent } from '@/data/program';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Timer from '@/components/meditation/Timer';
import YouTubePlayer from '@/components/meditation/YouTubePlayer';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

const typeBadgeColors: Record<string, string> = {
  guided: 'bg-accent/15 text-accent',
  breathing: 'bg-sage/15 text-sage',
  'body-scan': 'bg-warm-gray/15 text-warm-gray',
  silent: 'bg-charcoal/10 text-charcoal',
  'loving-kindness': 'bg-accent/10 text-accent',
};

const ratingEmojis = [
  { value: 1, emoji: '\uD83D\uDE23', label: 'Struggled' },
  { value: 2, emoji: '\uD83D\uDE15', label: 'Uneasy' },
  { value: 3, emoji: '\uD83D\uDE10', label: 'Neutral' },
  { value: 4, emoji: '\uD83D\uDE42', label: 'Good' },
  { value: 5, emoji: '\uD83D\uDE0C', label: 'Peaceful' },
];

export default function DayClient() {
  const params = useParams();
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useMeditationStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const user = useMeditationStore((s) => s.user);
  const completions = useMeditationStore((s) => s.completions);
  const completeDay = useMeditationStore((s) => s.completeDay);

  const rawDay = Number(params.dayNumber);
  const dayNumber = Number.isInteger(rawDay) && rawDay >= 1 && rawDay <= 30 ? rawDay : 0;
  const content = useMemo(() => getDayContent(dayNumber), [dayNumber]);

  const [timerDone, setTimerDone] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState('');

  const isAlreadyCompleted = !!completions[dayNumber];

  const handleTimerComplete = useCallback(() => {
    setTimerDone(true);
    setShowCompletion(true);
  }, []);

  function handleSkip() {
    setShowCompletion(true);
  }

  function handleComplete() {
    if (!content) return;
    completeDay(
      dayNumber,
      content.durationMinutes * 60,
      rating || 3,
      note.trim(),
    );
    router.push('/');
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6">
        <p className="font-body text-warm-gray">Day not found.</p>
        <Link href="/" className="mt-4 font-body text-sm text-accent underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary pb-16">
      <div className="mx-auto max-w-lg px-6 pt-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-body text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          <span aria-hidden>&larr;</span> Home
        </Link>

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mt-5"
        >
          <div className="flex items-center gap-2">
            <span
              className={[
                'rounded-full px-2.5 py-0.5 text-xs font-medium font-body capitalize',
                typeBadgeColors[content.type] ?? 'bg-light-gray text-charcoal',
              ].join(' ')}
            >
              {content.type.replace('-', ' ')}
            </span>
            <span className="font-mono text-xs text-warm-gray uppercase">
              Day {content.dayNumber}
            </span>
            {isAlreadyCompleted && (
              <span className="rounded-full bg-sage/15 px-2.5 py-0.5 text-xs font-medium text-sage font-body">
                Completed
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-2xl font-bold text-charcoal">
            {content.title}
          </h1>
          <p className="mt-2 font-body text-sm text-warm-gray leading-relaxed">
            {content.description}
          </p>
        </motion.div>

        {/* Tip */}
        {content.tip && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="mt-5"
          >
            <div className="rounded-xl bg-sage/10 px-4 py-3 border border-sage/20">
              <p className="font-body text-sm text-sage leading-relaxed">
                <span className="font-semibold">Tip:</span> {content.tip}
              </p>
            </div>
          </motion.div>
        )}

        {/* YouTube Player */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mt-6"
        >
          <YouTubePlayer
            youtubeId={content.youtubeId}
            title={content.title}
          />
        </motion.div>

        {/* Timer */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-8"
        >
          <Timer
            durationMinutes={content.durationMinutes}
            onComplete={handleTimerComplete}
          />
        </motion.div>

        {/* Skip button (if timer not done) */}
        {!showCompletion && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
            className="mt-4 text-center"
          >
            <button
              onClick={handleSkip}
              className="font-body text-sm text-warm-gray hover:text-charcoal transition-colors underline"
            >
              Skip to completion
            </button>
          </motion.div>
        )}

        {/* Completion form */}
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mt-8"
          >
            <Card>
              <h3 className="font-display text-lg font-bold text-charcoal text-center">
                How did that feel?
              </h3>

              {/* Rating buttons */}
              <div className="mt-4 flex justify-center gap-3">
                {ratingEmojis.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRating(r.value)}
                    className={[
                      'flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-150',
                      rating === r.value
                        ? 'bg-accent/10 ring-2 ring-accent scale-110'
                        : 'hover:bg-light-gray/30',
                    ].join(' ')}
                    aria-label={r.label}
                  >
                    <span className="text-2xl">{r.emoji}</span>
                    <span className="text-[10px] font-body text-warm-gray">
                      {r.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Optional note */}
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any thoughts or reflections... (optional)"
                rows={3}
                className="mt-4 w-full resize-none rounded-xl border border-light-gray bg-primary px-4 py-3 font-body text-sm text-charcoal placeholder:text-warm-gray/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
              />

              {/* Complete button */}
              <div className="mt-4">
                <Button fullWidth size="lg" onClick={handleComplete}>
                  Complete
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
