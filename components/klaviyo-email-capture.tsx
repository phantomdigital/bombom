'use client';

import { useActionState, useEffect, useLayoutEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiChevronRight } from 'react-icons/hi2';
import { subscribeToKlaviyo } from '@/app/actions/klaviyo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const PLACEHOLDER_PREFIX = 'Hey you,';
const DEFAULT_PLACEHOLDER_CYCLE = [
  'enter your email',
  'join the list',
  'be first in line',
  'drop your email',
  'get the first scoop',
  'stay in the loop',
  "we'll keep you posted",
];

const LETTER_CONTAINER_VARIANTS = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.015,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.015,
      staggerDirection: -1,
    },
  },
};

const LETTER_VARIANTS = {
  initial: { y: 16, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    y: -16,
    opacity: 0,
    transition: {
      duration: 0.16,
      ease: 'easeIn' as const,
    },
  },
};

/** Flavour colours with correct text contrast per brand guidelines */
export const FLAVOUR_BUTTON_STYLES = [
  { bg: 'bg-bom-lemon', text: 'text-bom-black', hoverBg: 'hover:!bg-bom-lemon' },
  { bg: 'bg-bom-musk', text: 'text-bom-black', hoverBg: 'hover:!bg-bom-musk' },
] as const;

export type FlavourStyle = (typeof FLAVOUR_BUTTON_STYLES)[number];

/** Duration (ms) based on average reading speed ~200 wpm + base + padding for comfort */
function getReadingDuration(text: string): number {
  const wordCount = text.split(/\s+/).filter(Boolean).length || 1;
  const msPerWord = 300; // 200 wpm = ~300ms per word
  const baseMs = 1500;
  const paddingMs = 800; // Extra buffer for slower readers
  return baseMs + wordCount * msPerWord + paddingMs;
}

interface KlaviyoEmailCaptureProps {
  listId?: string;
  className?: string;
  placeholder?: string;
  placeholderCycle?: string[];
  buttonText?: string;
  successMessage?: string;
  variant?: 'default' | 'inline' | 'stacked';
}

export default function KlaviyoEmailCapture({
  listId = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID || '',
  className,
  placeholder,
  placeholderCycle,
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  variant = 'inline',
}: KlaviyoEmailCaptureProps) {
  const [state, formAction, isPending] = useActionState(subscribeToKlaviyo, null);
  const [email, setEmail] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const cycles = placeholderCycle ?? DEFAULT_PLACEHOLDER_CYCLE;
  const [cycleIndex, setCycleIndex] = useState(0);
  const [flavourStyle, setFlavourStyle] = useState<FlavourStyle>(() => FLAVOUR_BUTTON_STYLES[0]);
  const useAnimatedPlaceholder = !placeholder;
  const longestCycleLength = Math.max(...cycles.map((item) => item.length), 0);
  const rotatingTextWidthCh = Math.min(Math.max(longestCycleLength + 3, 10), 24);

  useLayoutEffect(() => {
    setFlavourStyle(FLAVOUR_BUTTON_STYLES[Math.floor(Math.random() * FLAVOUR_BUTTON_STYLES.length)]);
  }, []);

  useEffect(() => {
    if (state?.success) {
      setEmail('');
    }
  }, [state?.success]);

  useEffect(() => {
    if (placeholder) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const INITIAL_HOLD_MS = 3500;
    const scheduleNext = (forIndex: number) => {
      const text = cycles[forIndex];
      const duration = forIndex === 0 ? INITIAL_HOLD_MS : getReadingDuration(text);
      timeoutId = setTimeout(() => {
        const next = (forIndex + 1) % cycles.length;
        setCycleIndex(next);
        scheduleNext(next);
      }, duration);
    };
    scheduleNext(cycleIndex);
    return () => clearTimeout(timeoutId);
  }, [placeholder, cycles]);

  const showPlaceholderOverlay = useAnimatedPlaceholder && !email && !isFocused;
  const nativePlaceholder = placeholder ?? (useAnimatedPlaceholder ? '' : cycles[0]);
  const rotatingText = `${cycles[cycleIndex]}...`;

  const status = state?.success ? 'success' : state?.success === false ? 'error' : isPending ? 'loading' : 'idle';
  const errorMessage = state?.success === false ? state.error : '';
  const hasError = status === 'error';
  const friendlyErrorMessage = errorMessage || 'Something went wrong. Please try again.';

  const isInline = variant === 'inline';
  const isStacked = variant === 'stacked';

  return (
    <div className={cn('w-full max-w-xl', className)}>
      {status === 'success' ? (
        <div className="text-center py-5 px-6 bg-bom-white/10 border border-bom-white rounded-sm font-sans font-semibold">
          <p className="text-bom-white font-medium">{successMessage}</p>
        </div>
      ) : (
        <form
          action={formAction}
          className={cn(
            'flex gap-1.5 sm:gap-2',
            isStacked && 'flex-col',
            isInline && 'flex-col sm:flex-row sm:items-center',
            variant === 'default' && 'flex-col sm:flex-row items-stretch sm:items-center'
          )}
        >
          {listId && <input type="hidden" name="listId" value={listId} />}
          <div className="group relative flex-1 min-w-0 cursor-pointer">
            <div
              className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:right-6"
              aria-hidden
            >
              <HiChevronRight className="size-5" />
            </div>
            {showPlaceholderOverlay && (
              <div
                className="pointer-events-none absolute inset-0 flex items-center px-3 sm:px-6 text-muted-foreground justify-start"
                aria-hidden
              >
                <span className="inline-flex items-center gap-1 leading-none max-sm:ml-[28%] sm:ml-0">
                  <span className="shrink-0 text-sm sm:text-base font-medium font-sans">
                    {PLACEHOLDER_PREFIX}
                  </span>
                  <span
                    className="relative inline-block h-[1.2em] overflow-hidden text-left align-middle"
                    style={{ width: `${rotatingTextWidthCh}ch` }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={rotatingText}
                        variants={LETTER_CONTAINER_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute inset-0 flex items-center justify-start font-medium font-sans text-sm sm:text-base leading-none whitespace-nowrap"
                      >
                        {Array.from(rotatingText).map((char, idx) => (
                          <motion.span
                            key={`${char}-${idx}`}
                            variants={LETTER_VARIANTS}
                            className="inline-block"
                          >
                            {char === ' ' ? '\u00A0' : char}
                          </motion.span>
                        ))}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>
              </div>
            )}
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={nativePlaceholder}
              disabled={isPending}
              className={cn(
                'h-14 min-h-14 py-2.5 pl-3 pr-10 sm:py-3 sm:pl-6 sm:pr-12 rounded-sm text-sm sm:text-base font-medium font-sans w-full min-w-0 box-border',
                'bg-background border border-bom-black shadow-none',
                'transition-all outline-none',
                'focus:border-bom-darkred focus:ring-[3px] focus:ring-bom-red/20 focus:ring-offset-0',
                hasError && 'border-bom-darkred focus:border-bom-darkred focus:ring-bom-darkred/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'text-center sm:text-left placeholder:text-center sm:placeholder:text-left',
                'placeholder:text-muted-foreground placeholder:font-normal placeholder:normal-case placeholder:tracking-normal'
              )}
              aria-label="Email address"
              aria-invalid={hasError}
              aria-describedby={hasError ? 'klaviyo-email-error' : undefined}
              required
            />
            {hasError && (
              <p
                id="klaviyo-email-error"
                className="mt-2 rounded-sm border border-bom-darkred/50 bg-bom-darkred/15 px-3 py-2 text-sm text-bom-white"
                role="alert"
                aria-live="polite"
              >
                {friendlyErrorMessage}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isPending}
            size={isInline ? 'default' : 'lg'}
            className={cn(
              'rounded-sm hover:underline',
              flavourStyle.bg,
              flavourStyle.hoverBg,
              flavourStyle.text,
              'focus-visible:ring-bom-red/30 focus-visible:ring-[3px]',
              'text-sm sm:text-base font-sans font-medium uppercase tracking-wider transition-all',
              'h-14 px-5 sm:px-8 border border-bom-black',
              'w-full sm:w-auto sm:whitespace-nowrap'
            )}
          >
            {status === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <AiOutlineLoading3Quarters className="size-4 animate-spin" aria-hidden />
                <span>Subscribing...</span>
              </span>
            ) : (
              buttonText
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
