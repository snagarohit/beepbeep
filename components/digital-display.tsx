"use client";

import * as React from 'react';

interface DigitalDisplayProps {
  timeLeft: number;
  onDisplayClick: () => void;
  timerStatus: 'IDLE' | 'RUNNING' | 'PAUSED';
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export function DigitalDisplay({ timeLeft, onDisplayClick, timerStatus }: DigitalDisplayProps) {
  const getTopText = () => {
    if (timerStatus === 'PAUSED') return 'PAUSED BEEP IN';
    if (timerStatus === 'RUNNING') return 'BEEPING IN';
    return 'START TIMER';
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      className="absolute w-[40%] h-[40%] rounded-full bg-background flex flex-col items-center justify-center shadow-[inset_0_0_0_0px_var(--muted-foreground)] cursor-pointer"
      onClick={onDisplayClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onDisplayClick();
        }
      }}
    >
      <div className="text-[clamp(0.5rem,1.5vw,0.8rem)] font-mono text-muted-foreground tracking-[0.1em] uppercase mb-1 text-center">
        {getTopText()}
      </div>
      
      <span className="text-[clamp(1.5rem,4vw,3rem)] font-mono text-foreground leading-none">
        {formatTime(timeLeft)}
      </span>

      <div className="flex items-center gap-1 mt-1">
        <span className="text-[clamp(0.5rem,1.5vw,0.8rem)] font-mono text-muted-foreground tracking-[0.1em] uppercase">
          MINUTES
        </span>
      </div>
    </div>
  );
} 