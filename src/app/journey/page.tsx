'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/ui/Card';
import BottomNav from '@/components/ui/BottomNav';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { getPhaseForWeek, getPhaseLabel, cn } from '@/lib/utils';
import { getWeekDays } from '@/data/program';
import type { Phase } from '@/types';

const weeks = [1, 2, 3, 4] as const;

const weekLabels: Record<number, string> = {
  1: 'Excavation',
  2: 'Clarity',
  3: 'Vision',
  4: 'Decision',
};

const weekInsights: Record<number, string> = {
  1: 'Uncover what drives you beneath the surface',
  2: 'Name your values, strengths, and fears',
  3: 'Build a picture of your ideal direction',
  4: 'Commit to a path and take the first step',
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function JourneyPage() {
  const profile = useUserStore((s) => s.profile);
  const entries = useJournalStore((s) => s.entries);
  const completions = useJournalStore((s) => s.completions);
  const discoveries = useJournalStore((s) => s.discoveries);
  const togglePin = useJournalStore((s) => s.toggleDiscoveryPin);

  const currentWeek = profile.currentWeek;

  const weekStats = useMemo(() => {
    return weeks.map((w) => {
      const days = getWeekDays(w);
      const dayNums = days.map((d) => d.dayNumber);
      const completed = completions.filter(
        (c) => dayNums.includes(c.dayNumber) && !c.skipped
      ).length;
      return { week: w, totalDays: days.length, completed };
    });
  }, [completions]);

  const totalStats = useMemo(() => {
    const totalWords = entries.reduce((s, e) => s + e.wordCount, 0);
    const videosWatched = completions.filter((c) => c.videoWatched).length;
    return {
      entries: entries.length,
      totalWords,
      videosWatched,
    };
  }, [entries, completions]);

  function getWeekStatus(w: number): 'completed' | 'active' | 'locked' {
    if (w < currentWeek) return 'completed';
    if (w === currentWeek) return 'active';
    return 'locked';
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      <motion.div
        className="mx-auto max-w-lg px-5 pt-10"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.h1
          variants={fadeUp}
          className="mb-1 text-3xl font-bold text-charcoal font-display"
        >
          Your Journey
        </motion.h1>
        <motion.p variants={fadeUp} className="mb-8 text-sm text-warm-gray font-body">
          Day {profile.currentDay} &middot; Week {currentWeek} of 4
        </motion.p>

        {/* Vertical timeline */}
        <motion.div variants={fadeUp} className="relative mb-10 pl-8">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border" />

          {weeks.map((w, i) => {
            const status = getWeekStatus(w);
            const stat = weekStats[i];
            const isLast = i === weeks.length - 1;

            return (
              <div key={w} className={cn('relative', !isLast && 'pb-8')}>
                {/* Colored segment of the line for completed */}
                {status === 'completed' && !isLast && (
                  <div className="absolute left-[15px] top-0 h-full w-0.5 bg-sage" style={{ zIndex: 1 }} />
                )}
                {status === 'active' && i > 0 && (
                  <div className="absolute left-[15px] top-0 h-0 w-0.5 bg-sage" style={{ zIndex: 1 }} />
                )}

                {/* Node */}
                <div
                  className={cn(
                    'absolute left-0 flex h-[30px] w-[30px] items-center justify-center rounded-full text-sm font-bold font-body z-10',
                    status === 'completed' && 'bg-sage text-white',
                    status === 'active' && 'bg-accent text-white',
                    status === 'locked' && 'bg-bg-surface-2 text-text-dim border border-border'
                  )}
                >
                  {status === 'completed' ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    w
                  )}
                </div>

                {/* Content */}
                <div className="ml-6">
                  <p
                    className={cn(
                      'text-xs font-medium tracking-wider font-mono uppercase',
                      status === 'completed' && 'text-sage',
                      status === 'active' && 'text-accent',
                      status === 'locked' && 'text-text-dim'
                    )}
                  >
                    Week {w} &mdash; {weekLabels[w]}
                  </p>
                  <p className="mt-0.5 text-sm text-warm-gray font-body">
                    {stat.completed}/{stat.totalDays} days completed
                  </p>
                  <p className="mt-1 text-xs text-text-dim font-body italic">
                    {weekInsights[w]}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Running stats */}
        <motion.div variants={fadeUp} className="mb-10 grid grid-cols-3 gap-3">
          {[
            { label: 'Entries', value: totalStats.entries },
            { label: 'Words', value: totalStats.totalWords.toLocaleString() },
            { label: 'Videos', value: totalStats.videosWatched },
          ].map((s) => (
            <Card key={s.label} className="text-center">
              <p className="text-xl font-bold text-charcoal font-display">{s.value}</p>
              <p className="mt-0.5 text-xs text-warm-gray font-body">{s.label}</p>
            </Card>
          ))}
        </motion.div>

        {/* Key Discoveries */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-4 text-lg font-semibold text-charcoal font-display">
            Key Discoveries
          </h2>

          {discoveries.length === 0 ? (
            <p className="text-sm text-text-dim font-body">
              Discoveries will appear here as you progress through the program.
            </p>
          ) : (
            <div className="space-y-3">
              {[...discoveries]
                .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
                .map((d) => (
                  <Card key={d.id} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent font-mono">
                      D{d.dayNumber}
                    </span>
                    <p className="flex-1 text-sm leading-relaxed text-charcoal font-body">
                      {d.content}
                    </p>
                    <button
                      onClick={() => togglePin(d.id)}
                      className="shrink-0 text-lg transition-transform duration-150 hover:scale-110"
                      aria-label={d.pinned ? 'Unpin discovery' : 'Pin discovery'}
                    >
                      {d.pinned ? (
                        <span className="text-accent">&#9733;</span>
                      ) : (
                        <span className="text-text-dim">&#9734;</span>
                      )}
                    </button>
                  </Card>
                ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
