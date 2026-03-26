'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MarcusCard from '@/components/marcus/MarcusCard';
import { useReviewStore } from '@/stores/reviewStore';
import { useJournalStore } from '@/stores/journalStore';
import { useUserStore } from '@/stores/userStore';
import { getPhaseForWeek, getPhaseLabel } from '@/lib/utils';
import { getWeekDays } from '@/data/program';
import { getRandomQuote } from '@/data/marcus-quotes';

const weekPatterns: Record<number, string[]> = {
  1: [
    'You write most honestly in the evenings — your defenses drop after dark.',
    'Energy and creativity came up repeatedly. Those aren\'t accidents.',
    'You avoided writing about your current work until Day 4. That avoidance is data.',
    'The word "should" appeared often early on, but less by the end of the week.',
    'Your peak moments all share one thing: autonomy.',
  ],
  2: [
    'Your values cluster around independence and meaningful impact.',
    'Fear of stagnation came up more than fear of failure. Interesting.',
    'You\'re strongest when you\'re building something from nothing.',
    'Patterns show you energize around teaching and explaining.',
    'The gap between what you say you value and how you spend your time is shrinking.',
  ],
  3: [
    'Your vision gravitates toward work that combines creativity with helping others.',
    'You described your ideal day three times — each version got more honest.',
    'The WHY draft has roots in every discovery from the first two weeks.',
    'You keep returning to the idea of building something that lasts.',
  ],
  4: [
    'You made the decision faster than you expected. Trust that.',
    'Your first steps are practical, not aspirational. That\'s maturity.',
    'The fears you named in Week 2 didn\'t stop you. Notice that.',
    'Your final WHY statement is sharper than anything you wrote on Day 1.',
    'You\'re leaving with clarity you didn\'t have 28 days ago.',
  ],
};

const weekWhyDrafts: Record<number, string> = {
  1: 'Still forming — the raw material is gathering.',
  2: 'I want to use my strengths to create meaningful work that gives me autonomy and helps others grow.',
  3: 'I exist to build things that help people see themselves more clearly, using my creativity and drive for independence.',
  4: 'I build tools and experiences that help people find their own direction — because I know what it feels like to search.',
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function ReviewClient() {
  const params = useParams();
  const router = useRouter();
  const rawWeek = Number(params.week);
  const weekNum = Number.isInteger(rawWeek) && rawWeek >= 1 && rawWeek <= 4 ? rawWeek : 0;
  const profile = useUserStore((s) => s.profile);
  const entries = useJournalStore((s) => s.entries);
  const completions = useJournalStore((s) => s.completions);
  const existingReview = useReviewStore((s) => s.getReviewForWeek(weekNum));

  const phase = getPhaseForWeek(weekNum);
  const phaseLabel = getPhaseLabel(phase);
  const weekDays = getWeekDays(weekNum);

  const stats = useMemo(() => {
    const dayRange = weekDays.map((d) => d.dayNumber);
    const weekEntries = entries.filter((e) => dayRange.includes(e.dayNumber));
    const weekCompletions = completions.filter((c) => dayRange.includes(c.dayNumber) && !c.skipped);
    const videosWatched = weekCompletions.filter((c) => c.videoWatched).length;
    const totalWords = weekEntries.reduce((sum, e) => sum + e.wordCount, 0);
    return {
      daysCompleted: weekCompletions.length,
      totalDays: weekDays.length,
      totalWords,
      videosWatched,
    };
  }, [entries, completions, weekDays]);

  if (weekNum === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6">
        <p className="font-body text-warm-gray">Invalid week.</p>
        <button onClick={() => router.push('/')} className="mt-4 font-body text-sm text-accent underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  const patterns = weekPatterns[weekNum] ?? weekPatterns[1];
  const whyDraft = existingReview?.whyDraft ?? weekWhyDrafts[weekNum] ?? weekWhyDrafts[1];
  const marcusSummary =
    existingReview?.marcusSummary ?? getRandomQuote('week_complete');

  const nextWeek = weekNum < 4 ? weekNum + 1 : null;

  return (
    <div className="min-h-screen bg-bg-primary pb-12">
      <motion.div
        className="mx-auto max-w-lg px-5 pt-10"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Back button */}
        <motion.button
          variants={fadeUp}
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-1.5 text-sm text-warm-gray font-body hover:text-charcoal transition-colors"
        >
          <span aria-hidden="true">&larr;</span> Back
        </motion.button>

        {/* Week complete badge */}
        <motion.div variants={fadeUp} className="mb-2 flex items-center gap-3">
          <span className="inline-block rounded-full bg-sage/15 px-3 py-1 text-xs font-medium tracking-widest text-sage font-mono uppercase">
            Week {weekNum} Complete
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="mb-1 text-3xl font-bold text-charcoal font-display"
        >
          {phaseLabel}
        </motion.h1>
        <motion.p variants={fadeUp} className="mb-8 text-sm text-warm-gray font-body">
          Week {weekNum} of 4
        </motion.p>

        {/* Marcus summary */}
        <motion.div variants={fadeUp} className="mb-6">
          <MarcusCard quote={marcusSummary} variant="sage" />
        </motion.div>

        {/* Stats row */}
        <motion.div variants={fadeUp} className="mb-8 grid grid-cols-3 gap-3">
          {[
            { label: 'Days', value: `${stats.daysCompleted}/${stats.totalDays}` },
            { label: 'Words', value: stats.totalWords.toLocaleString() },
            { label: 'Videos', value: String(stats.videosWatched) },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-charcoal font-display">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs text-warm-gray font-body">
                {stat.label}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* Patterns Marcus Noticed */}
        <motion.div variants={fadeUp} className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-charcoal font-display">
            Patterns Marcus Noticed
          </h2>
          <div className="space-y-3">
            {patterns.map((pattern, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex items-start gap-3"
              >
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/15 text-xs font-medium text-sage font-mono">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-charcoal font-body">
                  {pattern}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* WHY statement draft */}
        <motion.div variants={fadeUp} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold text-charcoal font-display">
            Your WHY — Draft {weekNum}
          </h2>
          <Card className="border-l-4 border-l-accent bg-accent/5">
            <p className="text-base italic leading-relaxed text-charcoal font-display">
              &ldquo;{whyDraft}&rdquo;
            </p>
            {weekNum < 3 && (
              <p className="mt-3 text-xs text-warm-gray font-body">
                This will sharpen as you go deeper.
              </p>
            )}
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeUp}>
          {nextWeek ? (
            <Button fullWidth size="lg" onClick={() => router.push('/')}>
              Continue to Week {nextWeek}
            </Button>
          ) : (
            <Button fullWidth size="lg" onClick={() => router.push('/')}>
              Return to Dashboard
            </Button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
