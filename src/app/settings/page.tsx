'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useMeditationStore } from '@/stores/meditationStore';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BottomNav from '@/components/ui/BottomNav';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export default function SettingsPage() {
  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useMeditationStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const user = useMeditationStore((s) => s.user);
  const setName = useMeditationStore((s) => s.setName);
  const resetAll = useMeditationStore((s) => s.resetAll);

  const [nameEditing, setNameEditing] = useState(false);
  const [nameValue, setNameValue] = useState('');

  // Sync name value when hydrated
  useEffect(() => {
    if (hydrated) {
      setNameValue(user.name);
    }
  }, [hydrated, user.name]);

  const handleNameSave = useCallback(() => {
    setName(nameValue.trim());
    setNameEditing(false);
  }, [nameValue, setName]);

  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all progress? This cannot be undone.',
    );
    if (confirmed) {
      resetAll();
      router.push('/onboarding');
    }
  }, [resetAll, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  const startDate = new Date(user.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-primary pb-24">
      <motion.div
        className="mx-auto max-w-lg px-6 pt-8"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* Header */}
        <motion.div variants={fadeUp}>
          <h1 className="font-display text-2xl font-bold text-charcoal">
            Stillness
          </h1>
          <p className="mt-1 font-body text-sm text-warm-gray">Settings</p>
        </motion.div>

        {/* Profile section */}
        <motion.div variants={fadeUp} className="mt-6">
          <p className="mb-2 text-xs font-medium tracking-widest text-warm-gray font-mono uppercase">
            Profile
          </p>
          <Card>
            {/* Name */}
            <div className="flex items-center justify-between py-2">
              <p className="text-sm font-medium text-charcoal font-body">Name</p>
              {nameEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                    maxLength={50}
                    className="w-32 rounded-lg border border-light-gray bg-primary px-2 py-1 text-sm font-body text-charcoal focus:outline-none focus:ring-1 focus:ring-accent"
                    autoFocus
                  />
                  <button
                    onClick={handleNameSave}
                    className="text-xs font-medium text-accent font-body"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setNameValue(user.name);
                    setNameEditing(true);
                  }}
                  className="text-sm text-accent font-body"
                >
                  {user.name || 'Set name'}
                </button>
              )}
            </div>

            <div className="border-t border-light-gray" />

            {/* Start date */}
            <div className="flex items-center justify-between py-2">
              <p className="text-sm font-medium text-charcoal font-body">
                Started
              </p>
              <span className="text-sm text-warm-gray font-body">{startDate}</span>
            </div>

            <div className="border-t border-light-gray" />

            {/* Current day */}
            <div className="flex items-center justify-between py-2">
              <p className="text-sm font-medium text-charcoal font-body">
                Current day
              </p>
              <span className="text-sm text-warm-gray font-body">
                Day {Math.min(user.currentDay, 30)} of 30
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Data section */}
        <motion.div variants={fadeUp} className="mt-6">
          <p className="mb-2 text-xs font-medium tracking-widest text-warm-gray font-mono uppercase">
            Data
          </p>
          <Card>
            <div className="py-2">
              <button
                onClick={handleReset}
                className="text-sm font-medium text-red-500 font-body hover:text-red-600 transition-colors"
              >
                Reset All Progress
              </button>
              <p className="mt-0.5 text-xs text-warm-gray font-body">
                This cannot be undone
              </p>
            </div>
          </Card>
        </motion.div>

        {/* App info */}
        <motion.div variants={fadeUp} className="mt-8 text-center">
          <p className="font-body text-xs text-warm-gray">
            Stillness v1.0.0
          </p>
        </motion.div>
      </motion.div>

      <BottomNav />
    </div>
  );
}
