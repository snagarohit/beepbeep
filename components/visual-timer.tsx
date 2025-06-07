"use client";

import * as React from 'react';
import { ClockMarkings } from './clock-markings';
import { InnerMarkings } from './inner-markings';

interface VisualTimerProps {
  percentage: number;
  onClick: () => void;
}

export function VisualTimer({ percentage, onClick }: VisualTimerProps) {
  const style = {
    '--percentage': percentage,
    // The conic-gradient now uses foreground for the remaining time,
    // and background for the elapsed time, with a border for visibility.
    background: `conic-gradient(
      var(--foreground) calc(var(--percentage, 0) * 1%),
      var(--timer-elapsed-color) 0
    )`,
  } as React.CSSProperties;

  return (
    <div
      role="button"
      aria-label={
        percentage < 100 && percentage > 0
          ? `Timer running, click to pause`
          : `Timer paused or idle, click to start`
      }
      tabIndex={0}
      className="w-full h-full rounded-full relative cursor-pointer transition-all duration-200 ease-in-out
                 shadow-[0_12px_48px_rgba(0,0,0,0.15),inset_0_0_0_0px_var(--muted-foreground)]
                 hover:shadow-[0_16px_64px_rgba(0,0,0,0.22),inset_0_0_0_0px_var(--muted-foreground)]
                 hover:scale-[1.02] active:scale-[0.98]
                 dark:shadow-[0_12px_48px_rgba(255,255,255,0.08),inset_0_0_0_0px_var(--muted-foreground)]
                 dark:hover:shadow-[0_16px_64px_rgba(255,255,255,0.12),inset_0_0_0_0px_var(--muted-foreground)]"
      style={style}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <ClockMarkings />
      <InnerMarkings />
    </div>
  );
} 