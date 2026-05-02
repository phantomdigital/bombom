'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';
import { focusRing } from '@/components/ui/focus-ring';
import { cn } from '@/lib/utils';

type TimedPopoverTone = 'success' | 'error';

interface TimedPopoverProps {
  open: boolean;
  message: string;
  onDismiss: () => void;
  durationMs?: number;
  fadeMs?: number;
  id?: string;
  tone?: TimedPopoverTone;
  className?: string;
}

const toneStyles: Record<
  TimedPopoverTone,
  { container: string; text: string; track: string; bar: string; close: string }
> = {
  success: {
    container: 'border-bom-white/20 bg-bom-white/10',
    text: 'text-bom-white',
    track: 'bg-bom-white/15',
    bar: 'bg-bom-white',
    close: 'text-bom-white/80 hover:text-bom-white',
  },
  error: {
    container: 'border-bom-black bg-bom-musk/95',
    text: 'text-bom-black',
    track: 'bg-bom-musk/20',
    bar: 'bg-bom-black/20',
    close: 'text-bom-black/65 hover:text-bom-black',
  },
};

export default function TimedPopover({
  open,
  message,
  onDismiss,
  durationMs = 5000,
  fadeMs = 350,
  id,
  tone = 'error',
  className,
}: TimedPopoverProps) {
  const [isFading, setIsFading] = useState(false);
  const onDismissRef = useRef(onDismiss);
  const hasDismissedRef = useRef(false);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const clearTimers = useCallback(() => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    fadeTimeoutRef.current = null;
    dismissTimeoutRef.current = null;
  }, []);

  const requestDismiss = useCallback(() => {
    if (hasDismissedRef.current) return;
    hasDismissedRef.current = true;
    onDismissRef.current();
  }, []);

  useEffect(() => {
    if (!open) {
      setIsFading(false);
      clearTimers();
      return;
    }

    hasDismissedRef.current = false;
    setIsFading(false);

    fadeTimeoutRef.current = setTimeout(() => {
      setIsFading(true);
    }, durationMs);

    dismissTimeoutRef.current = setTimeout(() => {
      requestDismiss();
    }, durationMs + fadeMs);

    return () => clearTimers();
  }, [open, durationMs, fadeMs, clearTimers, requestDismiss]);

  const dismissEarly = () => {
    if (!open) return;
    clearTimers();
    setIsFading(true);
    dismissTimeoutRef.current = setTimeout(() => {
      requestDismiss();
    }, fadeMs);
  };

  const toneStyle = toneStyles[tone];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id={id}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: isFading ? 0 : 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className={cn(
            'absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-t-sm rounded-b-none border shadow-lg',
            toneStyle.container,
            className
          )}
        >
          <div className="relative px-10 py-3 text-center">
            <p className={cn('text-sm font-medium font-sans', toneStyle.text)}>{message}</p>
            <button
              type="button"
              onClick={dismissEarly}
              className={cn(
                'absolute right-1 top-1/2 -translate-y-1/2 rounded-sm p-2.5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
                focusRing,
                toneStyle.close
              )}
              aria-label="Dismiss message"
            >
              <HiXMark className="size-4" aria-hidden />
            </button>
          </div>
          <div className={cn('h-1 w-full', toneStyle.track)}>
            <div
              className={cn('h-full w-0 animate-success-progress', toneStyle.bar)}
              style={{ animationDuration: `${durationMs}ms` }}
              aria-hidden
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
