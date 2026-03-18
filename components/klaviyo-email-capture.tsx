'use client';

import { useActionState, useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { subscribeToKlaviyo } from '@/app/actions/klaviyo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DEFAULT_PLACEHOLDER_CYCLE = [
  'Hey you!',
  'Enter your email here to know when we open',
  'Drop your email here...',
  'your@email.here',
];

/** Flavour colours with correct text contrast per brand guidelines */
const FLAVOUR_BUTTON_STYLES = [
  { bg: 'bg-bom-lemon', text: 'text-bom-black', hoverBg: 'hover:!bg-bom-lemon' },
  { bg: 'bg-bom-musk', text: 'text-bom-black', hoverBg: 'hover:!bg-bom-musk' },
] as const;

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
  variant = 'inline'
}: KlaviyoEmailCaptureProps) {
  const [state, formAction, isPending] = useActionState(subscribeToKlaviyo, null);
  const [email, setEmail] = useState('');
  const cycles = placeholderCycle ?? DEFAULT_PLACEHOLDER_CYCLE;
  const [cycleIndex, setCycleIndex] = useState(0);
  const displayPlaceholder = placeholder ?? cycles[cycleIndex];
  const [flavourStyle, setFlavourStyle] = useState<(typeof FLAVOUR_BUTTON_STYLES)[number]>(() => FLAVOUR_BUTTON_STYLES[0]);

  useEffect(() => {
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
    const scheduleNext = (forIndex: number) => {
      const text = cycles[forIndex];
      const duration = getReadingDuration(text);
      timeoutId = setTimeout(() => {
        const next = (forIndex + 1) % cycles.length;
        setCycleIndex(next);
        scheduleNext(next);
      }, duration);
    };
    scheduleNext(cycleIndex);
    return () => clearTimeout(timeoutId);
  }, [placeholder, cycles]);

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
            'flex gap-2',
            isStacked && 'flex-col',
            isInline && 'flex-col sm:flex-row sm:items-center',
            variant === 'default' && 'flex-col sm:flex-row items-stretch sm:items-center'
          )}
        >
          {listId && <input type="hidden" name="listId" value={listId} />}
          <div className="flex-1 min-w-0">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={displayPlaceholder}
              disabled={isPending}
              className={cn(
                'h-14 min-h-14 py-3 px-4 sm:px-6 rounded-sm text-base font-medium font-sans uppercase tracking-wider w-full min-w-0 box-border',
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
              'font-sans font-medium uppercase tracking-wider transition-all',
              'h-14 px-8 border border-bom-black',
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
