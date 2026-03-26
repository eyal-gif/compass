'use client';

import { Suspense, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { useJournalStore } from '@/stores/journalStore';
import { getDayContent } from '@/data/program';
import { getNudge } from '@/data/marcus-quotes';
import { formatDuration, wordCount } from '@/lib/utils';
import Button from '@/components/ui/Button';
import MarcusCard from '@/components/marcus/MarcusCard';

const AUTOSAVE_INTERVAL = 30_000; // 30 seconds
const NUDGE_DELAY = 180; // 3 minutes in seconds

export default function WritePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-primary">
          <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
        </div>
      }
    >
      <WritePageInner />
    </Suspense>
  );
}

function WritePageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const dayNumber = Number(searchParams.get('dayNumber') ?? 0);
  const initialPromptIndex = Number(searchParams.get('promptIndex') ?? 0);

  const profile = useUserStore((s) => s.profile);
  const addEntry = useJournalStore((s) => s.addEntry);
  const completeDay = useJournalStore((s) => s.completeDay);
  const advanceDay = useUserStore((s) => s.advanceDay);

  const content = useMemo(() => getDayContent(dayNumber), [dayNumber]);

  // Collect all prompts: regular prompts + video post-watch prompts
  const allPrompts = useMemo(() => {
    if (!content) return [];
    const prompts: { id: string; text: string; estimatedMinutes: number }[] = [];

    if (content.video?.postWatchPrompts) {
      content.video.postWatchPrompts.forEach((text, i) => {
        prompts.push({
          id: `${content.dayNumber}-vp${i}`,
          text,
          estimatedMinutes: 5,
        });
      });
    }

    if (content.prompts) {
      content.prompts.forEach((p) => {
        prompts.push({ id: p.id, text: p.text, estimatedMinutes: p.estimatedMinutes });
      });
    }

    return prompts;
  }, [content]);

  const [promptIndex, setPromptIndex] = useState(initialPromptIndex);
  const [texts, setTexts] = useState<string[]>(() =>
    Array(allPrompts.length).fill('')
  );
  const [seconds, setSeconds] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [marcusNudge] = useState(() => content?.marcusNudge ?? getNudge());
  const [mounted, setMounted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const savedRef = useRef(false);

  // Hydration guard
  useEffect(() => setMounted(true), []);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Marcus nudge after NUDGE_DELAY seconds
  useEffect(() => {
    if (seconds === NUDGE_DELAY) {
      setShowNudge(true);
    }
  }, [seconds]);

  // Auto-save every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      savedRef.current = true;
      // Auto-save is implicit; entries are saved on Done
    }, AUTOSAVE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Focus textarea on prompt change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [promptIndex]);

  const currentPrompt = allPrompts[promptIndex];
  const currentText = texts[promptIndex] ?? '';
  const words = wordCount(currentText);
  const totalPrompts = allPrompts.length;

  const updateText = useCallback(
    (value: string) => {
      setTexts((prev) => {
        const next = [...prev];
        next[promptIndex] = value;
        return next;
      });
    },
    [promptIndex]
  );

  function goToPrompt(idx: number) {
    if (idx >= 0 && idx < totalPrompts) {
      setPromptIndex(idx);
    }
  }

  function handleDone() {
    if (!content) return;

    const entryIds: string[] = [];

    // Save all non-empty entries
    allPrompts.forEach((prompt, idx) => {
      const text = texts[idx]?.trim();
      if (text) {
        const entryId = crypto.randomUUID();
        entryIds.push(entryId);
        addEntry({
          id: entryId,
          dayNumber: content.dayNumber,
          promptId: prompt.id,
          content: text,
          wordCount: wordCount(text),
          writingDurationSeconds: seconds,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    });

    // Complete the day
    completeDay({
      dayNumber: content.dayNumber,
      completedAt: new Date().toISOString(),
      journalEntries: entryIds,
      videoWatched: content.type === 'video_journal',
      actionCompleted: false,
      skipped: false,
    });

    // Advance if this is the current day
    if (content.dayNumber === profile.currentDay) {
      advanceDay();
    }

    router.push('/');
  }

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  if (!content || totalPrompts === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6">
        <p className="font-body text-warm-gray">No prompts for this day.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 font-body text-sm text-accent underline"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      {/* ── Top Bar ──────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-border bg-bg-surface/80 px-4 py-3 backdrop-blur-sm">
        <button
          onClick={() => router.back()}
          className="font-body text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          &larr; Back
        </button>

        <span className="font-mono text-sm tabular-nums text-sage">
          {formatDuration(seconds)}
        </span>

        <Button size="sm" onClick={handleDone}>
          Done
        </Button>
      </header>

      {/* ── Writing Area ─────────────────────────────────── */}
      <main className="flex flex-1 flex-col px-5 pt-6">
        {/* Prompt indicator */}
        <p className="text-center font-mono text-xs tracking-widest text-text-dim uppercase">
          Prompt {promptIndex + 1} of {totalPrompts}
        </p>

        {/* Current prompt */}
        <AnimatePresence mode="wait">
          <motion.p
            key={promptIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-4 max-w-md text-center font-display text-lg leading-relaxed text-charcoal"
          >
            {currentPrompt?.text}
          </motion.p>
        </AnimatePresence>

        {/* Textarea */}
        <div className="mt-6 flex-1">
          <textarea
            ref={textareaRef}
            value={currentText}
            onChange={(e) => updateText(e.target.value)}
            placeholder="Start writing..."
            className="h-full min-h-[300px] w-full resize-none bg-transparent font-body text-base leading-relaxed text-charcoal placeholder:text-text-dim/50 focus:outline-none"
            autoFocus
          />
        </div>

        {/* Marcus nudge */}
        <AnimatePresence>
          {showNudge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="mt-4"
            >
              <MarcusCard
                quote={marcusNudge}
                variant="sage"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Bar ───────────────────────────────────── */}
      <footer className="border-t border-border bg-bg-surface/80 px-5 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Word count */}
          <span className="font-mono text-xs text-text-dim">
            {words} {words === 1 ? 'word' : 'words'}
          </span>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {allPrompts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToPrompt(idx)}
                aria-label={`Go to prompt ${idx + 1}`}
                className={[
                  'h-2 w-2 rounded-full transition-all duration-200',
                  idx === promptIndex
                    ? 'scale-125 bg-accent'
                    : (texts[idx]?.trim() ?? '').length > 0
                    ? 'bg-sage'
                    : 'bg-border',
                ].join(' ')}
              />
            ))}
          </div>

          {/* Prompt navigation */}
          <div className="flex items-center gap-2">
            {promptIndex > 0 && (
              <button
                onClick={() => goToPrompt(promptIndex - 1)}
                className="font-body text-xs text-warm-gray hover:text-charcoal transition-colors"
              >
                Prev
              </button>
            )}
            {promptIndex < totalPrompts - 1 && (
              <button
                onClick={() => goToPrompt(promptIndex + 1)}
                className="font-body text-xs font-medium text-accent hover:text-accent-dark transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
