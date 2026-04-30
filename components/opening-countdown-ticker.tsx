"use client";

import { useEffect, useState } from "react";

/** 1 May 2026, 11:00 Australian Eastern (AEST/+10 wall time — Sydney handles DST for display labels). */
const OPENING_TARGET_MS = new Date("2026-05-01T11:00:00+10:00").getTime();

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

  const label = `Opens in ${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

  return (
    <div
      className={`rounded-sm bg-bom-black px-3 py-2 font-mono text-xs font-black uppercase tracking-widest text-bom-white sm:px-4 sm:py-2.5 sm:text-sm ${className}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      {label}
    </div>
  );
}
