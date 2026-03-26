'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import MarcusCard from '@/components/marcus/MarcusCard';
import BottomNav from '@/components/ui/BottomNav';
import { useJournalStore } from '@/stores/journalStore';
import { useUserStore } from '@/stores/userStore';
import { getDayContent } from '@/data/program';
import { cn } from '@/lib/utils';

const filters = ['All', 'Week 1', 'Week 2', 'Week 3', 'Week 4'] as const;
type Filter = (typeof filters)[number];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function JournalPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const entries = useJournalStore((s) => s.entries);
  const profile = useUserStore((s) => s.profile);

  const filteredEntries = useMemo(() => {
    const sorted = [...entries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    if (activeFilter === 'All') return sorted;
    const weekNum = Number(activeFilter.split(' ')[1]);
    const dayMin = (weekNum - 1) * 7 + 1;
    const dayMax = weekNum * 7;
    return sorted.filter((e) => e.dayNumber >= dayMin && e.dayNumber <= dayMax);
  }, [entries, activeFilter]);

  // Group entries by day
  const grouped = useMemo(() => {
    const map = new Map<number, typeof filteredEntries>();
    for (const entry of filteredEntries) {
      const list = map.get(entry.dayNumber) ?? [];
      list.push(entry);
      map.set(entry.dayNumber, list);
    }
    // Sort day groups descending
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
  }, [filteredEntries]);

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
          Your Journal
        </motion.h1>
        <motion.p variants={fadeUp} className="mb-6 text-sm text-warm-gray font-body">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'} written
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          variants={fadeUp}
          className="mb-6 flex gap-2 overflow-x-auto scrollbar-none"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium font-body transition-colors duration-150',
                activeFilter === f
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface border border-border text-warm-gray hover:text-charcoal'
              )}
            >
              {f}
            </button>
          ))}
        </motion.div>

        {/* Entries list */}
        <AnimatePresence mode="wait">
          {grouped.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <MarcusCard
                quote="Your journal is waiting. Each entry is a small act of honesty — and those add up."
                variant="sage"
              />
              <p className="mt-4 text-center text-sm text-text-dim font-body">
                No entries yet. Start today&apos;s practice to begin.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {grouped.map(([dayNumber, dayEntries]) => {
                const dayContent = getDayContent(dayNumber);
                const totalWords = dayEntries.reduce((s, e) => s + e.wordCount, 0);
                const dateStr = dayEntries[0]
                  ? new Date(dayEntries[0].createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : '';

                return (
                  <motion.div key={dayNumber} variants={fadeUp}>
                    {/* Day header */}
                    <div className="mb-2 flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-medium tracking-wider text-accent font-mono uppercase">
                          Day {dayNumber}
                        </span>
                        <span className="text-sm font-medium text-charcoal font-body">
                          {dayContent?.title ?? `Day ${dayNumber}`}
                        </span>
                      </div>
                      <span className="text-xs text-text-dim font-body">{dateStr}</span>
                    </div>

                    {/* Entry cards */}
                    <div className="space-y-2">
                      {dayEntries.map((entry) => (
                        <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow duration-150">
                          <p className="line-clamp-2 text-sm leading-relaxed text-charcoal font-body">
                            {entry.content.slice(0, 120)}
                            {entry.content.length > 120 && '...'}
                          </p>
                          <p className="mt-2 text-xs text-text-dim font-body">
                            {entry.wordCount} words
                          </p>
                        </Card>
                      ))}
                    </div>

                    {dayEntries.length > 1 && (
                      <p className="mt-1.5 text-xs text-warm-gray font-body">
                        {totalWords} words total across {dayEntries.length} entries
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <BottomNav />
    </div>
  );
}
