"use client";

import * as React from 'react';
import { ClockMarkings } from './clock-markings';

interface VisualTimerProps {
  percentage: number;
}

export function VisualTimer({ percentage }: VisualTimerProps) {
  const style = {
    '--percentage': percentage,
    // The conic-gradient now uses foreground for the remaining time,
    // and background for the elapsed time, with a border for visibility.
    background: `conic-gradient(
      var(--foreground) calc(var(--percentage, 0) * 1%),
      var(--background) 0
    )`,
  } as React.CSSProperties;

  return (
    <div
      className="w-full h-full rounded-full shadow-[inset_0_0_0_0px_var(--border)] relative"
      style={style}
    >
      <ClockMarkings />
    </div>
  );
} 