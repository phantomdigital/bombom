"use client";

import { useEffect, useState } from "react";

/** 1 May 2026, 11:00 Australian Eastern (AEST/+10 wall time — Sydney handles DST for display labels). */
export const OPENING_LAUNCH_TIMESTAMP_MS = new Date(
  "2026-05-01T11:00:00+10:00"
).getTime();

const OPENING_TARGET_MS = OPENING_LAUNCH_TIMESTAMP_MS;

type OpeningCountdownTickerProps = {
  className?: string;
};

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export default function OpeningCountdownTicker({
  className = "",
}: OpeningCountdownTickerProps) {
  const [remainingMs, setRemainingMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemainingMs(OPENING_TARGET_MS - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (remainingMs === null || remainingMs <= 0) return null;

  const { days, hours, minutes, seconds } = formatCountdown(remainingMs);

  const timeLabel = `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

  return (
    <div
      className={`text-center text-bom-white ${className}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mb-2 font-mono text-[0.625rem] font-black uppercase tracking-[0.22em] sm:text-xs">
        Opens in
      </div>
      <div
        className="relative rounded-3xl bg-transparent px-6 py-4 font-sans text-base font-bold uppercase tracking-[0.08em] tabular-nums sm:px-14 sm:py-5 sm:text-lg"
        aria-label={`Opens in ${timeLabel}`}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
        >
          <rect
            x="0.5"
            y="0.5"
            width="calc(100% - 1px)"
            height="calc(100% - 1px)"
            rx="24"
            fill="none"
            stroke="currentColor"
            strokeDasharray="14 10"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-14;-24"
              keyTimes="0;0.5;1"
              dur="1.2s"
              calcMode="discrete"
              repeatCount="indefinite"
            />
          </rect>
        </svg>
        {timeLabel}
      </div>
    </div>
  );
}
