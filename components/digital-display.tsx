"use client";

import * as React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface DigitalDisplayProps {
  timeLeft: number;
  onIntervalChange: (value: string) => void;
  timerStatus: 'IDLE' | 'RUNNING' | 'PAUSED';
  onOpenRequest: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const intervals = [
  { value: "60", label: "1m" },
  { value: "300", label: "5m" },
  { value: "600", label: "10m" },
  { value: "900", label: "15m" },
  { value: "1200", label: "20m" },
  { value: "1800", label: "30m" },
];

export function DigitalDisplay({ timeLeft, onIntervalChange, timerStatus, onOpenRequest }: DigitalDisplayProps) {
  const [open, setOpen] = React.useState(false);

  const handleIntervalSelect = (value: string) => {
    onIntervalChange(value);
    setOpen(false); // Close the hover card immediately
  };

  const handleClick = () => {
    onOpenRequest();
    setOpen(!open); // Toggle for mobile
  };

  const getTopText = () => {
    if (timerStatus === 'PAUSED') return 'BEEPING PAUSED';
    if (timerStatus === 'RUNNING') return 'BEEPING IN';
    return 'BEEP EVERY';
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div 
          role="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Open interval selection menu"
          tabIndex={0}
          className="absolute w-[40%] h-[40%] rounded-full bg-background flex flex-col items-center justify-center shadow-[inset_0_0_0_0px_var(--muted-foreground)] cursor-pointer"
          onClick={handleClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick();
            }
          }}
        >
          {/* Top text - changes based on timer status */}
          <div className="text-[clamp(0.5rem,1.5vw,0.8rem)] font-mono text-muted-foreground tracking-[0.1em] uppercase mb-1 text-center">
            {getTopText()}
          </div>
          
          {/* Timer display */}
          <span className="text-[clamp(1.5rem,4vw,3rem)] font-mono text-foreground leading-none">
            {formatTime(timeLeft)}
          </span>
          
          {/* Bottom text with chevron */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[clamp(0.5rem,1.5vw,0.8rem)] font-mono text-muted-foreground tracking-[0.1em] uppercase">
              MINUTES
            </span>
            <ChevronDown 
              className={`w-[clamp(0.7rem,1.5vw,1rem)] h-[clamp(0.7rem,1.5vw,1rem)] text-muted-foreground transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 p-3" aria-label="Interval selection options">
        <div className="space-y-2">
          <p className="text-sm font-medium text-left text-muted-foreground">Beep every</p>
          <div className="grid grid-cols-3 gap-2">
            {intervals.map((interval) => (
              <Button
                key={interval.value}
                variant="outline"
                size="sm"
                onClick={() => handleIntervalSelect(interval.value)}
                className="h-8 text-xs"
              >
                {interval.label}
              </Button>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
} 