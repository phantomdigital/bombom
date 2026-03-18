'use client';

import { useActionState, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiChevronRight } from 'react-icons/hi2';
import { subscribeToKlaviyo } from '@/app/actions/klaviyo';
import { Button } from '@/components/ui/button';
import TimedPopover from '@/components/ui/timed-popover';
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
  onSuccessVisibilityChange?: (isVisible: boolean) => void;
}

export default function KlaviyoEmailCapture({
  listId = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID || '',
  className,
  placeholder,
  placeholderCycle,
  buttonText = 'Subscribe',
  successMessage = 'Thanks for subscribing!',
  variant = 'inline',
  onSuccessVisibilityChange,
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

  const overlayRef = useRef<HTMLDivElement>(null);
  const measurerRef = useRef<HTMLSpanElement>(null);
  const [centerOffset, setCenterOffset] = useState(0);
  const [hasCycled, setHasCycled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSuccessFading, setIsSuccessFading] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastKey, setErrorToastKey] = useState(0);

  useLayoutEffect(() => {
    setFlavourStyle(FLAVOUR_BUTTON_STYLES[Math.floor(Math.random() * FLAVOUR_BUTTON_STYLES.length)]);
  }, []);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      setIsSuccessFading(false);
      setShowErrorToast(false);
      setErrorToastMessage('');
      setEmail('');
      return;
    }

    if (state?.success === false) {
      setErrorToastMessage(state.error || 'Something went wrong. Please try again.');
      setShowErrorToast(true);
      setErrorToastKey((prev) => prev + 1);
    }
  }, [state]);

  useEffect(() => {
    onSuccessVisibilityChange?.(showSuccess);
  }, [showSuccess, onSuccessVisibilityChange]);

  useEffect(() => {
    if (!showSuccess) return;

    const durationMs = 5000;
    const fadeMs = 400;
    const fadeTimeoutId = setTimeout(() => {
      setIsSuccessFading(true);
    }, durationMs);

    const hideTimeoutId = setTimeout(() => {
      setShowSuccess(false);
      setIsSuccessFading(false);
    }, durationMs + fadeMs);

    return () => {
      clearTimeout(fadeTimeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, [showSuccess]);

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

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const measurer = measurerRef.current;
    if (!overlay || !measurer || !showPlaceholderOverlay) return;

    const updateOffset = () => {
      if (!overlay || !measurer) return;
      const containerWidth = overlay.getBoundingClientRect().width;
      const contentWidth = measurer.getBoundingClientRect().width;
      const paddingLeft = parseFloat(getComputedStyle(overlay).paddingLeft) || 0;
      const centerX = containerWidth / 2;
      const contentCenterOffset = contentWidth / 2;
      setCenterOffset(Math.max(0, centerX - contentCenterOffset - paddingLeft));
    };

    updateOffset();
    const ro = new ResizeObserver(updateOffset);
    ro.observe(overlay);

    return () => ro.disconnect();
  }, [showPlaceholderOverlay, cycleIndex, rotatingText]);

  useEffect(() => {
    if (cycleIndex > 0) setHasCycled(true);
  }, [cycleIndex]);

  const status = showSuccess ? 'success' : isPending ? 'loading' : 'idle';
  const hasError = showErrorToast;

  const isInline = variant === 'inline';
  const isStacked = variant === 'stacked';

  return (
    <div className={cn('relative w-full max-w-xl', className)}>
      {status === 'success' ? (
        <div
          className={cn(
            'overflow-hidden rounded-t-sm rounded-b-none bg-bom-white/10 text-center font-sans font-semibold transition-opacity duration-400',
            isSuccessFading ? 'opacity-0' : 'opacity-100'
          )}
        >
          <div className="px-6 py-5">
            <p className="text-bom-white font-medium">{successMessage}</p>
          </div>
          <div className="h-1 w-full bg-bom-white/15">
            <div
              className="h-full w-0 bg-bom-white animate-success-progress"
              aria-hidden
            />
          </div>
        </div>
      ) : (
        <motion.form
          action={formAction}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
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
                ref={overlayRef}
                className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3 sm:px-6 text-muted-foreground"
                aria-hidden
              >
                {/* Off-screen measurer - exact same structure for accurate width */}
                <span
                  ref={measurerRef}
                  className="absolute left-[-9999px] top-0 inline-flex items-center gap-1 leading-none text-sm sm:text-base font-medium font-sans whitespace-nowrap invisible"
                  aria-hidden
                >
                  <span className="shrink-0">{PLACEHOLDER_PREFIX}</span>
                  <span>{rotatingText}</span>
                </span>
                <motion.span
                  className="inline-flex items-center gap-1 leading-none"
                  animate={{ x: centerOffset }}
                  transition={
                    hasCycled
                      ? { type: 'tween', ease: 'easeOut', duration: 0.35 }
                      : { duration: 0 }
                  }
                >
                  <span className="shrink-0 text-sm sm:text-base font-medium font-sans">
                    {PLACEHOLDER_PREFIX}
                  </span>
                  <span
                    className="relative inline-block h-[1.2em] overflow-hidden text-left align-middle"
                    style={{ width: `${rotatingTextWidthCh}ch` }}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={rotatingText}
                        variants={LETTER_CONTAINER_VARIANTS}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ overflow: 'hidden' }}
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
                </motion.span>
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
                'h-14 min-h-14 py-2.5 px-10 sm:py-3 sm:pl-6 sm:pr-12 rounded-sm text-base font-medium font-sans w-full min-w-0 box-border',
                'bg-background border border-bom-black shadow-none',
                'transition-all outline-none',
                'focus:border-bom-black focus:ring-[1px] focus:ring-bom-black/20 focus:ring-offset-0',
                hasError && 'border-bom-darkred focus:border-bom-darkred focus:ring-bom-darkred/20',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'text-center sm:text-left placeholder:text-center sm:placeholder:text-left',
                'placeholder:text-muted-foreground placeholder:font-normal placeholder:normal-case placeholder:tracking-normal'
              )}
              aria-label="Email address"
              aria-invalid={hasError}
              aria-describedby={hasError ? 'klaviyo-email-error-popover' : undefined}
              required
            />
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
              'h-14 py-0 px-5 sm:px-8 border border-bom-black',
              'w-full sm:w-auto sm:whitespace-nowrap items-stretch'
            )}
          >
            {status === 'loading' ? (
              <span className="inline-flex h-full items-center gap-2">
                <AiOutlineLoading3Quarters className="size-4 animate-spin" aria-hidden />
                <span>Subscribing...</span>
              </span>
            ) : (
              <span className="inline-flex h-full items-center">{buttonText}</span>
            )}
          </Button>
        </motion.form>
      )}
      <TimedPopover
        key={`error-toast-${errorToastKey}`}
        open={showErrorToast}
        id="klaviyo-email-error-popover"
        tone="error"
        message={errorToastMessage}
        onDismiss={() => {
          setShowErrorToast(false);
          setErrorToastMessage('');
        }}
      />
    </div>
  );
}
