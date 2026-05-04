'use client';

import { useActionState, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { HiXMark } from 'react-icons/hi2';
import { subscribeToKlaviyo } from '@/app/actions/klaviyo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import TimedPopover from '@/components/ui/timed-popover';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER_CYCLE = [
  'enter your email',
  'join the list',
  'be first in line',
  'drop your email',
  'get the first scoop',
  'stay in the loop',
  "we'll keep you posted",
];

const FORM_REVEAL_DELAY_MS = 1000;

const ATTRIBUTION_QUERY_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'ttclid',
] as const;

const PLACEHOLDER_LETTER_CONTAINER_VARIANTS = {
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

const PLACEHOLDER_LETTER_VARIANTS = {
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
  /** When true, supporting copy (e.g. consent) is light for dark panels */
  onDarkSurface?: boolean;
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
  onDarkSurface = false,
  onSuccessVisibilityChange,
}: KlaviyoEmailCaptureProps) {
  const [state, formAction, isPending] = useActionState(subscribeToKlaviyo, null);
  const [email, setEmail] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const cycles = placeholderCycle ?? DEFAULT_PLACEHOLDER_CYCLE;
  const [cycleIndex, setCycleIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSuccessFading, setIsSuccessFading] = useState(false);
  const [isFormContentRevealed, setIsFormContentRevealed] = useState(true);
  const [errorToastMessage, setErrorToastMessage] = useState('');
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorToastKey, setErrorToastKey] = useState(0);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [attributionFields, setAttributionFields] = useState<Record<string, string>>({});
  const marketingConsentId = useId();
  const hasShownSuccessRef = useRef(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      setIsSuccessFading(false);
      setShowErrorToast(false);
      setErrorToastMessage('');
      setMarketingConsent(false);
      setEmail('');
      if (typeof document !== 'undefined') {
        const el = document.activeElement;
        if (el instanceof HTMLElement) el.blur();
      }
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
    if (showSuccess) {
      hasShownSuccessRef.current = true;
      setIsFormContentRevealed(false);
      return;
    }

    if (!hasShownSuccessRef.current) return;

    const revealTimeoutId = window.setTimeout(() => {
      setIsFormContentRevealed(true);
    }, FORM_REVEAL_DELAY_MS);

    return () => window.clearTimeout(revealTimeoutId);
  }, [showSuccess]);

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

  const hasEmailDomainDot = /.+@.+\./.test(email.trim());
  const showMarketingConsentField = hasEmailDomainDot;

  useEffect(() => {
    if (!showMarketingConsentField) {
      setMarketingConsent(false);
    }
  }, [showMarketingConsentField]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const nextAttribution: Record<string, string> = {};

    for (const key of ATTRIBUTION_QUERY_KEYS) {
      const value = params.get(key);
      if (value) nextAttribution[key] = value;
    }

    nextAttribution.landing_path = `${window.location.pathname}${window.location.search}`;

    if (document.referrer) {
      nextAttribution.referrer_url = document.referrer;
    }

    setAttributionFields(nextAttribution);
  }, []);

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

  const animatedPlaceholder = `Hey you, ${cycles[cycleIndex]}...`;
  const showAnimatedPlaceholder = !placeholder && !email && !isInputFocused;
  const nativePlaceholder = placeholder ?? '';

  const status = showSuccess ? 'success' : isPending ? 'loading' : 'idle';
  const hasError = showErrorToast;
  const canSubmit =
    !isPending &&
    email.trim().length > 0 &&
    (!showMarketingConsentField || marketingConsent);

  const isInline = variant === 'inline';
  const isStacked = variant === 'stacked';

  return (
    <div className={cn('relative w-full max-w-3xl', className)}>
      {status === 'success' ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "flex min-h-[13.5rem] w-full flex-col text-center transition-opacity duration-400 sm:min-h-[6.125rem]",
            isSuccessFading ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="flex min-h-0 flex-1 flex-col justify-center pb-5 sm:pb-4">
            <p
              className={cn(
                "font-sans text-3xl font-medium leading-tight tracking-tight sm:text-4xl lg:text-5xl",
                onDarkSurface ? "text-bom-white" : "text-bom-ink"
              )}
            >
              {successMessage}
            </p>
          </div>
          <div
            className={cn(
              "h-1 w-full shrink-0",
              onDarkSurface ? "bg-bom-white/15" : "bg-bom-ink/15"
            )}
            aria-hidden
          >
            <div
              className={cn(
                "h-full w-0 animate-success-progress",
                onDarkSurface ? "bg-bom-white" : "bg-bom-ink"
              )}
            />
          </div>
        </div>
      ) : (
        <motion.form
          action={formAction}
          aria-label="Email signup form"
          initial={{ opacity: 0, y: 6 }}
          animate={{
            opacity: isFormContentRevealed ? 1 : 0,
            y: isFormContentRevealed ? 0 : 6,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className={cn(
            "flex flex-col gap-2",
            !isFormContentRevealed && "pointer-events-none"
          )}
          aria-hidden={!isFormContentRevealed}
        >
          {listId && <input type="hidden" name="listId" value={listId} />}
          {marketingConsent && (
            <input type="hidden" name="marketingConsent" value="yes" />
          )}
          {Object.entries(attributionFields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <div
            className={cn(
              'isolate flex gap-1.5 sm:gap-2',
              isStacked && 'flex-col',
              isInline && 'flex-col lg:flex-row lg:items-center',
              variant === 'default' && 'flex-col sm:flex-row items-stretch sm:items-center'
            )}
          >
            <div
              className={cn(
                'relative min-w-0 cursor-pointer',
                'w-full',
                isStacked && 'shrink-0',
                isInline && 'lg:min-w-0 lg:flex-[1_1_560px]',
                variant === 'default' && 'shrink-0 sm:flex-1 sm:min-w-0',
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {showAnimatedPlaceholder && (
                  <motion.div
                    key={animatedPlaceholder}
                    className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-full items-center justify-center overflow-hidden px-[26px] text-muted-foreground sm:justify-start"
                    aria-hidden
                  >
                    <motion.span
                      className="flex min-w-0 items-center overflow-hidden whitespace-nowrap font-sans text-base font-normal"
                      variants={PLACEHOLDER_LETTER_CONTAINER_VARIANTS}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {Array.from(animatedPlaceholder).map((char, index) => (
                        <motion.span
                          key={`${animatedPlaceholder}-${char}-${index}`}
                          className="inline-block"
                          variants={PLACEHOLDER_LETTER_VARIANTS}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex items-center justify-center p-2 text-muted-foreground sm:right-5 focus-visible:ring-0 rounded-sm"
                  aria-label="Clear email"
                >
                  <HiXMark className="size-5" />
                </button>
              )}
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={nativePlaceholder}
                disabled={isPending}
                className={cn(
                  'h-[65px] min-h-[65px] py-0 !px-[26px] leading-[65px] rounded-sm text-base font-medium font-sans w-full min-w-0 box-border appearance-none antialiased',
                  'bg-background border-0 shadow-none',
                  'outline-none',
                  'focus:border-transparent focus:ring-0 focus:ring-offset-0',
                  hasError && 'focus:border-transparent focus:ring-0',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'text-center placeholder:text-center sm:text-left sm:placeholder:text-left',
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
              disabled={!canSubmit}
              aria-busy={isPending}
              variant="bomPill"
              size="bomPill"
              className={cn(
                'bg-bom-lime text-bom-black font-sans font-medium antialiased',
                'w-full lg:w-auto lg:whitespace-nowrap items-center justify-center',
            !isPending && 'disabled:opacity-100'
              )}
            >
              {status === 'loading' ? (
                <span className="inline-flex items-center gap-2">
                  <AiOutlineLoading3Quarters className="size-4 shrink-0 animate-spin" aria-hidden />
                  <span>Subscribing...</span>
                </span>
              ) : (
                <span>{buttonText}</span>
              )}
            </Button>
          </div>
          <AnimatePresence initial={false}>
            {showMarketingConsentField && (
              <motion.div
                key="marketing-consent"
                initial={{ opacity: 0, y: 6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="mt-2 sm:mt-3 overflow-hidden"
              >
                <label
                  htmlFor={marketingConsentId}
                  className="group -mx-1 flex w-full cursor-pointer touch-manipulation select-none items-center justify-center gap-3.5 px-2 py-2.5 sm:gap-4 sm:py-3"
                >
                  <span className="-m-1 inline-flex shrink-0 items-center justify-center rounded-md p-0.5">
                    <Checkbox
                      id={marketingConsentId}
                      name="marketingConsent"
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked === true)}
                      disabled={isPending}
                      required={showMarketingConsentField}
                      className={cn(
                        'size-6 overflow-hidden rounded-md border-0 shadow-none',
                        onDarkSurface
                          ? "bg-bom-white/20 focus-visible:ring-bom-white/45"
                          : "bg-bom-black/10 focus-visible:ring-bom-black/25",
                        "data-[state=checked]:bg-bom-lime data-[state=checked]:text-bom-black",
                        "focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-offset-transparent",
                        "[&_svg]:size-[1.125rem]"
                      )}
                    />
                  </span>
                  <span
                    className={cn(
                      "text-center font-sans text-[13px] leading-snug sm:text-[15px]",
                      onDarkSurface ? "text-bom-white/85" : "text-bom-black/85"
                    )}
                  >
                    I agree to receive marketing emails from BomBom.
                  </span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
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
