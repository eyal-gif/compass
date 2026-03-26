'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { getDayContent, dayTypeToBadgeVariant } from '@/data/program';
import { getRandomQuote } from '@/data/marcus-quotes';
import {
  getPhaseLabel,
  getPhaseForWeek,
  getDayTypeLabel,
} from '@/lib/utils';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import MarcusCard from '@/components/marcus/MarcusCard';

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function DayPage() {
  const params = useParams();
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const completeDay = useJournalStore((s) => s.completeDay);
  const advanceDay = useUserStore((s) => s.advanceDay);

  const dayNumber = Number(params.dayNumber);
  const content = useMemo(() => getDayContent(dayNumber), [dayNumber]);

  // Hydration guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6">
        <p className="font-body text-warm-gray">Day not found.</p>
        <Link href="/" className="mt-4 font-body text-sm text-accent underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const phase = getPhaseForWeek(content.week);

  function handleActionComplete() {
    completeDay({
      dayNumber: content!.dayNumber,
      completedAt: new Date().toISOString(),
      journalEntries: [],
      videoWatched: false,
      actionCompleted: true,
      skipped: false,
    });
    if (dayNumber === profile.currentDay) {
      advanceDay();
    }
    router.push('/');
  }

  // ── Render by type ───────────────────────────────────────────

  return (
    <div className="min-h-screen bg-bg-primary pb-16">
      <div className="mx-auto max-w-lg px-5 pt-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-body text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          <span aria-hidden>&larr;</span> Dashboard
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
            <Badge variant={dayTypeToBadgeVariant(content.type)} />
            <span className="font-mono text-xs text-text-dim uppercase">
              Day {content.dayNumber}
            </span>
          </div>

          <p className="mt-3 font-mono text-xs tracking-widest text-warm-gray uppercase">
            Week {content.week} &mdash; {getPhaseLabel(phase)}
          </p>

          <h1 className="mt-1 font-display text-2xl font-bold text-charcoal">
            {content.title}
          </h1>
          {content.subtitle && (
            <p className="mt-1 font-body text-sm text-warm-gray">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Marcus intro */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mt-6"
        >
          <MarcusCard quote={content.marcusIntro} />
        </motion.div>

        {/* ── REST DAY ──────────────────────────────────────── */}
        {content.type === 'rest' && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6"
          >
            <Card variant="sage" className="text-center">
              <span className="text-4xl" role="img" aria-label="leaf">
                {'\uD83C\uDF3F'}
              </span>
              <p className="mt-4 font-display text-lg italic text-charcoal">
                {getRandomQuote('rest_day')}
              </p>
              <p className="mt-3 font-body text-sm text-sage">
                No writing today. Let your mind integrate.
              </p>
            </Card>

            {content.video && (
              <Card className="mt-4">
                <p className="font-body text-sm font-medium text-charcoal">
                  Optional: {content.video.title}
                </p>
                <p className="mt-1 font-body text-xs text-warm-gray">
                  {content.video.speaker} &middot; {content.video.durationMinutes} min
                </p>
              </Card>
            )}

            <div className="mt-6">
              <Button fullWidth onClick={handleActionComplete}>
                Mark rest day complete
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── JOURNAL / SYNTHESIS ───────────────────────────── */}
        {(content.type === 'journal' || content.type === 'synthesis') &&
          content.prompts && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6 space-y-4"
            >
              {content.type === 'synthesis' && (
                <Card variant="sage">
                  <p className="font-body text-sm text-sage">
                    Take a few minutes to re-read your entries from this week before you begin.
                  </p>
                </Card>
              )}

              <div className="space-y-3">
                {content.prompts.map((prompt, idx) => (
                  <Card key={prompt.id}>
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-body text-sm leading-relaxed text-charcoal">
                          {prompt.text}
                        </p>
                        {prompt.subPrompts && (
                          <ul className="mt-2 space-y-1 pl-1">
                            {prompt.subPrompts.map((sp, i) => (
                              <li
                                key={i}
                                className="font-body text-xs text-warm-gray before:mr-1.5 before:content-['\u2022']"
                              >
                                {sp}
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-2 font-mono text-xs text-text-dim">
                          ~{prompt.estimatedMinutes} min
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {content.afterNote && (
                <p className="font-body text-xs italic text-warm-gray">
                  {content.afterNote}
                </p>
              )}

              <Link href={`/day/write?dayNumber=${content.dayNumber}&promptIndex=0`}>
                <Button fullWidth size="lg" className="mt-2">
                  Start writing
                </Button>
              </Link>
            </motion.div>
          )}

        {/* ── VIDEO JOURNAL ─────────────────────────────────── */}
        {content.type === 'video_journal' && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 space-y-4"
          >
            {content.video && (
              <>
                {/* Video embed */}
                <div className="overflow-hidden rounded-2xl border border-border">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${content.video.youtubeId}`}
                      title={content.video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="bg-bg-surface p-4">
                    <p className="font-body text-sm font-medium text-charcoal">
                      {content.video.title}
                    </p>
                    <p className="mt-0.5 font-body text-xs text-warm-gray">
                      {content.video.speaker} &middot;{' '}
                      {content.video.durationMinutes} min
                    </p>
                  </div>
                </div>

                {/* Pre-watch note */}
                <MarcusCard
                  quote={content.video.preWatchNote}
                  variant="gold"
                />

                {/* Reflection prompts */}
                {content.video.postWatchPrompts && (
                  <div className="space-y-3">
                    <h3 className="font-body text-xs font-semibold tracking-widest text-warm-gray uppercase">
                      After watching
                    </h3>
                    {content.video.postWatchPrompts.map((prompt, idx) => (
                      <Card key={idx}>
                        <div className="flex items-start gap-3">
                          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent">
                            {idx + 1}
                          </span>
                          <p className="font-body text-sm text-charcoal">
                            {prompt}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Journal prompts */}
            {content.prompts && content.prompts.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-body text-xs font-semibold tracking-widest text-warm-gray uppercase">
                  Journal prompts
                </h3>
                {content.prompts.map((prompt, idx) => (
                  <Card key={prompt.id}>
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-body text-sm leading-relaxed text-charcoal">
                          {prompt.text}
                        </p>
                        <p className="mt-2 font-mono text-xs text-text-dim">
                          ~{prompt.estimatedMinutes} min
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {content.afterNote && (
              <p className="font-body text-xs italic text-warm-gray">
                {content.afterNote}
              </p>
            )}

            <Link href={`/day/write?dayNumber=${content.dayNumber}&promptIndex=0`}>
              <Button fullWidth size="lg" className="mt-2">
                Start reflection
              </Button>
            </Link>
          </motion.div>
        )}

        {/* ── ACTION ────────────────────────────────────────── */}
        {content.type === 'action' && content.actionSteps && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="mt-6 space-y-4"
          >
            {content.marcusNudge && (
              <MarcusCard quote={content.marcusNudge} variant="gold" />
            )}

            <div className="space-y-3">
              {content.actionSteps.map((step) => (
                <Card key={step.stepNumber}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gold-light font-mono text-sm font-bold text-gold">
                      {step.stepNumber}
                    </span>
                    <div>
                      <p className="font-body text-sm font-semibold text-charcoal">
                        {step.title}
                      </p>
                      <p className="mt-1 font-body text-sm text-warm-gray leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button fullWidth size="lg" onClick={handleActionComplete}>
              I&apos;ve completed this
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
