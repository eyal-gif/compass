'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeditationStore } from '@/stores/meditationStore';
import Button from '@/components/ui/Button';

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

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    useMeditationStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const user = useMeditationStore((s) => s.user);
  const setName = useMeditationStore((s) => s.setName);
  const completeOnboarding = useMeditationStore((s) => s.completeOnboarding);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [nameInput, setNameInput] = useState('');

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="h-8 w-8 animate-pulse rounded-full bg-accent/30" />
      </div>
    );
  }

  if (user.onboardingComplete) {
    router.replace('/');
    return null;
  }

  function goNext() {
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleComplete() {
    setName(nameInput.trim());
    completeOnboarding();
    router.replace('/');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-primary px-6">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 0: Welcome */}
          {step === 0 && (
            <motion.div
              key="welcome"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex flex-col items-center text-center"
            >
              <span className="text-6xl" role="img" aria-label="Lotus">
                {'\uD83E\uDDD8'}
              </span>

              <h1 className="mt-6 font-display text-3xl font-bold text-charcoal">
                Stillness
              </h1>
              <p className="mt-2 font-body text-base text-warm-gray">
                Build your meditation practice in 30 days
              </p>

              <p className="mt-6 font-body text-sm text-warm-gray leading-relaxed max-w-xs">
                Each day brings a new guided session — starting short and building
                gradually. No experience needed. Just you, a quiet moment, and the
                willingness to sit still.
              </p>

              <div className="mt-8 w-full">
                <Button fullWidth size="lg" onClick={goNext}>
                  Get Started
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Name */}
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
                What should we call you?
              </h2>
              <p className="mt-2 font-body text-sm text-warm-gray">
                Optional — you can leave this blank.
              </p>

              <input
                autoFocus
                type="text"
                placeholder="Your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={50}
                className="mt-6 w-full rounded-xl border border-light-gray bg-surface px-4 py-3.5 font-body text-base text-charcoal placeholder:text-warm-gray/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
              />

              <div className="mt-8 w-full">
                <Button fullWidth size="lg" onClick={handleComplete}>
                  Begin Journey
                </Button>
              </div>

              <button
                onClick={() => {
                  setDirection(-1);
                  setStep((s) => s - 1);
                }}
                className="mt-3 self-center font-body text-sm text-warm-gray hover:text-charcoal transition-colors"
              >
                Go back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i === step
                  ? 'w-6 bg-accent'
                  : i < step
                  ? 'w-1.5 bg-sage'
                  : 'w-1.5 bg-light-gray',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
