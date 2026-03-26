'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import MarcusCard from '@/components/marcus/MarcusCard';
import BottomNav from '@/components/ui/BottomNav';
import { useJournalStore } from '@/stores/journalStore';
import { cn } from '@/lib/utils';
import type { DiscoveryCategory } from '@/types';

const categories: { key: DiscoveryCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'value', label: 'Values' },
  { key: 'strength', label: 'Strengths' },
  { key: 'energy', label: 'Energy' },
  { key: 'pattern', label: 'Patterns' },
  { key: 'why', label: 'Why' },
  { key: 'fear', label: 'Fears' },
  { key: 'decision', label: 'Decisions' },
];

const categoryColors: Record<DiscoveryCategory, string> = {
  value: 'bg-sage-light text-sage',
  strength: 'bg-gold-light text-gold',
  energy: 'bg-accent/10 text-accent',
  pattern: 'bg-bg-surface-2 text-warm-gray',
  why: 'bg-accent/15 text-accent',
  fear: 'bg-bg-surface-2 text-charcoal',
  decision: 'bg-sage-light text-sage',
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState<DiscoveryCategory | 'all'>('all');
  const discoveries = useJournalStore((s) => s.discoveries);
  const togglePin = useJournalStore((s) => s.toggleDiscoveryPin);

  const filtered = useMemo(() => {
    const items =
      activeCategory === 'all'
        ? discoveries
        : discoveries.filter((d) => d.category === activeCategory);

    // Pinned first, then by day number descending
    return [...items].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.dayNumber - a.dayNumber;
    });
  }, [discoveries, activeCategory]);

  const pinnedCount = discoveries.filter((d) => d.pinned).length;

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
          Key Discoveries
        </motion.h1>
        <motion.p variants={fadeUp} className="mb-6 text-sm text-warm-gray font-body">
          {discoveries.length} {discoveries.length === 1 ? 'discovery' : 'discoveries'}
          {pinnedCount > 0 && ` \u00b7 ${pinnedCount} pinned`}
        </motion.p>

        {/* Category filter */}
        <motion.div
          variants={fadeUp}
          className="mb-6 flex gap-2 overflow-x-auto scrollbar-none"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium font-body transition-colors duration-150',
                activeCategory === cat.key
                  ? 'bg-accent text-white'
                  : 'bg-bg-surface border border-border text-warm-gray hover:text-charcoal'
              )}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Discovery list */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12"
            >
              <MarcusCard
                quote="Discoveries build over time. Each day adds a piece. Keep showing up and they'll start to connect."
                variant="sage"
              />
              <p className="mt-4 text-center text-sm text-text-dim font-body">
                {discoveries.length === 0
                  ? 'No discoveries yet. They emerge as you write.'
                  : 'No discoveries in this category yet.'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filtered.map((d) => (
                <motion.div key={d.id} variants={fadeUp}>
                  <Card
                    className={cn(
                      'transition-shadow duration-150',
                      d.pinned && 'ring-1 ring-accent/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-start gap-1.5">
                        <span
                          className={cn(
                            'inline-block rounded-full px-2.5 py-0.5 text-xs font-medium font-body capitalize',
                            categoryColors[d.category]
                          )}
                        >
                          {d.category}
                        </span>
                        <span className="text-xs text-text-dim font-mono">Day {d.dayNumber}</span>
                      </div>
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
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <BottomNav />
    </div>
  );
}
