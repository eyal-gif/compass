'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '@/stores/userStore';
import { getPhaseIntro } from '@/data/marcus-quotes';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import MarcusCard from '@/components/marcus/MarcusCard';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 260 : -260,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -260 : 260,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const setName = useUserStore((s) => s.setName);
  const setDailyReminderTime = useUserStore((s) => s.setDailyReminderTime);
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [nameInput, setNameInput] = useState('');
  const [reminderTime, setReminderTime] = useState('09:00');

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleComplete() {
    setName(nameInput.trim());
    setDailyReminderTime(reminderTime);
    completeOnboarding();
    router.replace('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait" custom={direction}>
          {/* ── Step 0: Splash ─────────────────────────────── */}
          {step === 0 && (
            <motion.div
              key="splash"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <span className="text-6xl" role="img" aria-label="Compass">
                {'\uD83E\uDDED'}
              </span>

              <h1 className="mt-6 font-display text-3xl font-bold text-charcoal">
                Compass
              </h1>
              <p className="mt-1 font-body text-base text-warm-gray">
                Find your direction
              </p>

              <MarcusCard
                quote={getPhaseIntro('excavation')}
                className="mt-8"
              />

              <div className="mt-8 w-full">
                <Button fullWidth size="lg" onClick={goNext}>
                  Begin your journey
                </Button>
              </div>

              <p className="mt-4 font-body text-xs text-text-dim">
                A 28-day self-discovery program
              </p>
            </motion.div>
          )}

          {/* ── Step 1: Name & Reminder ────────────────────── */}
          {step === 1 && (
            <motion.div
              key="name"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col"
            >
              <h2 className="font-display text-2xl font-bold text-charcoal">
                What should I call you?
              </h2>
              <p className="mt-2 font-body text-sm text-warm-gray">
                Marcus will use this name when he speaks with you.
              </p>

              <input
                autoFocus
                type="text"
                placeholder="Your first name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="mt-6 w-full rounded-xl border border-border bg-bg-surface px-4 py-3.5 font-body text-base text-charcoal placeholder:text-text-dim focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
              />

              <div className="mt-6">
                <label className="block font-body text-sm font-medium text-charcoal">
                  Daily reminder time
                </label>
                <p className="mt-1 font-body text-xs text-warm-gray">
                  We&apos;ll nudge you to show up each day.
                </p>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-bg-surface px-4 py-3 font-mono text-sm text-charcoal focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
                />
              </div>

              <div className="mt-8">
                <Button
                  fullWidth
                  size="lg"
                  disabled={!nameInput.trim()}
                  onClick={goNext}
                >
                  Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Commitment ─────────────────────────── */}
          {step === 2 && (
            <motion.div
              key="commit"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <h2 className="font-display text-2xl font-bold text-charcoal">
                Your commitment
              </h2>

              <Card className="mt-6 text-left" variant="sage">
                <ul className="space-y-3 font-body text-sm text-charcoal">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sage">&#x2713;</span>
                    <span>28 days of guided self-discovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sage">&#x2713;</span>
                    <span>15-30 minutes of honest reflection daily</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sage">&#x2713;</span>
                    <span>Write for yourself, not for anyone else</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 text-sage">&#x2713;</span>
                    <span>Show up even when it gets uncomfortable</span>
                  </li>
                </ul>
              </Card>

              <MarcusCard
                quote={`${nameInput.trim()}, this only works if you're honest. Not polished — honest. Can you do that.`}
                variant="gold"
                className="mt-6"
              />

              <div className="mt-8 w-full">
                <Button fullWidth size="lg" onClick={handleComplete}>
                  I&apos;m ready
                </Button>
              </div>

              <button
                onClick={() => {
                  setDirection(-1);
                  setStep((s) => s - 1);
                }}
                className="mt-3 font-body text-sm text-warm-gray hover:text-charcoal transition-colors"
              >
                Go back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i === step
                  ? 'w-6 bg-accent'
                  : i < step
                  ? 'w-1.5 bg-sage'
                  : 'w-1.5 bg-border',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
