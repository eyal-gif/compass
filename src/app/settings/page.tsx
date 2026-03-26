'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { useReviewStore } from '@/stores/reviewStore';
import { cn } from '@/lib/utils';

/* ─── Toggle component ─── */
function Toggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        enabled ? 'bg-sage' : 'bg-light-gray'
      )}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  );
}

/* ─── Setting row ─── */
function SettingRow({
  label,
  description,
  right,
}: {
  label: string;
  description?: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-charcoal font-body">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-warm-gray font-body">{description}</p>
        )}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

/* ─── Section header ─── */
function SectionHeader({ label }: { label: string }) {
  return (
    <p className="mb-1 mt-6 text-xs font-medium tracking-widest text-text-dim font-mono uppercase first:mt-0">
      {label}
    </p>
  );
}

/* ─── Font size selector ─── */
function FontSizeSelector({
  value,
  onChange,
}: {
  value: 'small' | 'medium' | 'large';
  onChange: (size: 'small' | 'medium' | 'large') => void;
}) {
  const sizes = ['small', 'medium', 'large'] as const;
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-bg-surface p-0.5">
      {sizes.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            'rounded-md px-3 py-1 text-xs font-medium font-body capitalize transition-colors duration-150',
            value === s
              ? 'bg-accent text-white'
              : 'text-warm-gray hover:text-charcoal'
          )}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

/* ─── Animations ─── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

/* ─── Page ─── */
export default function SettingsPage() {
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const setName = useUserStore((s) => s.setName);
  const setDailyReminderTime = useUserStore((s) => s.setDailyReminderTime);
  const toggleMarcusNudges = useUserStore((s) => s.toggleMarcusNudges);
  const toggleWeeklyPatternAnalysis = useUserStore((s) => s.toggleWeeklyPatternAnalysis);
  const setWritingFontSize = useUserStore((s) => s.setWritingFontSize);
  const toggleDarkModeWriting = useUserStore((s) => s.toggleDarkModeWriting);
  const resetUser = useUserStore((s) => s.resetAll);
  const resetJournal = useJournalStore((s) => s.resetAll);
  const resetReviews = useReviewStore((s) => s.resetAll);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameValue, setNameValue] = useState(profile.name);

  const handleNameSave = useCallback(() => {
    setName(nameValue.trim());
    setNameEditing(false);
  }, [nameValue, setName]);

  const handleDeleteAll = useCallback(() => {
    resetUser();
    resetJournal();
    resetReviews();
    setShowDeleteConfirm(false);
    router.push('/');
  }, [resetUser, resetJournal, resetReviews, router]);

  const startDate = new Date(profile.startDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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
          className="mb-6 flex items-center gap-1.5 text-sm text-warm-gray font-body hover:text-charcoal transition-colors"
        >
          <span aria-hidden="true">&larr;</span> Back
        </motion.button>

        <motion.h1
          variants={fadeUp}
          className="mb-6 text-3xl font-bold text-charcoal font-display"
        >
          Settings
        </motion.h1>

        {/* ── PROFILE ── */}
        <motion.div variants={fadeUp}>
          <SectionHeader label="Profile" />
          <Card>
            <SettingRow
              label="Name"
              right={
                nameEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                      className="w-32 rounded-lg border border-border bg-bg-primary px-2 py-1 text-sm font-body text-charcoal focus:outline-none focus:ring-1 focus:ring-accent"
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
                    onClick={() => { setNameValue(profile.name); setNameEditing(true); }}
                    className="text-sm text-accent font-body"
                  >
                    {profile.name || 'Set name'}
                  </button>
                )
              }
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Program week"
              right={
                <span className="text-sm text-warm-gray font-body">
                  Week {profile.currentWeek}
                </span>
              }
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Start date"
              right={
                <span className="text-sm text-warm-gray font-body">{startDate}</span>
              }
            />
          </Card>
        </motion.div>

        {/* ── MARCUS ── */}
        <motion.div variants={fadeUp}>
          <SectionHeader label="Marcus" />
          <Card>
            <SettingRow
              label="Daily prompts"
              description="Marcus greets you each day"
              right={<Toggle enabled={true} onToggle={() => {}} />}
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Push deeper nudges"
              description="Encourages you to write more"
              right={
                <Toggle
                  enabled={profile.marcusNudgesEnabled}
                  onToggle={toggleMarcusNudges}
                />
              }
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Weekly pattern analysis"
              description="Marcus analyzes your writing patterns"
              right={
                <Toggle
                  enabled={profile.weeklyPatternAnalysis}
                  onToggle={toggleWeeklyPatternAnalysis}
                />
              }
            />
          </Card>
        </motion.div>

        {/* ── REMINDERS ── */}
        <motion.div variants={fadeUp}>
          <SectionHeader label="Reminders" />
          <Card>
            <SettingRow
              label="Daily practice time"
              right={
                <span className="text-sm text-warm-gray font-body">
                  {profile.dailyReminderTime}
                </span>
              }
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Evening reflection"
              right={<Toggle enabled={false} onToggle={() => {}} />}
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Weekly review day"
              right={
                <span className="text-sm text-warm-gray font-body">Sunday</span>
              }
            />
          </Card>
        </motion.div>

        {/* ── JOURNAL ── */}
        <motion.div variants={fadeUp}>
          <SectionHeader label="Journal" />
          <Card>
            <SettingRow
              label="Export all entries"
              right={
                <Button variant="secondary" size="sm" onClick={() => {}}>
                  Export PDF
                </Button>
              }
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Writing font size"
              right={
                <FontSizeSelector
                  value={profile.writingFontSize}
                  onChange={setWritingFontSize}
                />
              }
            />
            <div className="border-t border-border" />
            <SettingRow
              label="Dark mode for writing"
              description="Darker background while journaling"
              right={
                <Toggle
                  enabled={profile.darkModeWriting}
                  onToggle={toggleDarkModeWriting}
                />
              }
            />
          </Card>
        </motion.div>

        {/* ── DATA ── */}
        <motion.div variants={fadeUp}>
          <SectionHeader label="Data" />
          <Card>
            <SettingRow
              label="Backup journal"
              description="Save a copy of all your entries"
              right={
                <Button variant="secondary" size="sm" onClick={() => {}}>
                  Backup
                </Button>
              }
            />
            <div className="border-t border-border" />
            <div className="py-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm font-medium text-red-500 font-body hover:text-red-600 transition-colors"
              >
                Delete all data
              </button>
              <p className="mt-0.5 text-xs text-warm-gray font-body">
                This cannot be undone
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm px-6"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl bg-bg-surface p-6 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-charcoal font-display">
                Delete everything?
              </h3>
              <p className="mt-2 text-sm text-warm-gray font-body leading-relaxed">
                This will permanently remove all your journal entries, discoveries,
                reviews, and profile data. This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <button
                  onClick={handleDeleteAll}
                  className="flex-1 rounded-xl bg-red-500 px-5 py-2.5 text-base font-medium text-white font-body hover:bg-red-600 transition-colors"
                >
                  Delete All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
