"use client";

import * as React from 'react';

interface DigitalDisplayProps {
  timeLeft: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function DigitalDisplay({ timeLeft }: DigitalDisplayProps) {
  return (
    <div className="absolute w-32 h-32 sm:w-30 sm:h-30 rounded-full bg-background flex items-center justify-center shadow-[inset_0_0_0_1px_var(--border)]">
      <span className="text-4xl sm:text-4xl font-mono text-foreground">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
} 