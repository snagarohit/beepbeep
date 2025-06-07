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

export function DigitalDisplay({ timeLeft, onIntervalChange, timerStatus }: DigitalDisplayProps) {
  const [open, setOpen] = React.useState(false);

  const handleIntervalSelect = (value: string) => {
    onIntervalChange(value);
    setOpen(false); // Close the hover card immediately
  };

  const handleClick = () => {
    setOpen(!open); // Toggle for mobile
  };

  const isRunning = timerStatus === 'RUNNING';

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>
        <div 
          className="absolute w-[40%] h-[40%] rounded-full bg-background flex flex-col items-center justify-center shadow-[inset_0_0_0_0px_var(--muted-foreground)] cursor-pointer"
          onClick={handleClick}
        >
          {/* Top text - changes based on timer status */}
          <div className="text-[clamp(0.4rem,1vw,0.8rem)] font-mono text-muted-foreground tracking-[0.1em] uppercase mb-1">
            {isRunning ? 'BEEPING IN' : 'BEEP EVERY'}
          </div>
          
          {/* Timer display */}
          <span className="text-[clamp(1.5rem,4vw,3rem)] font-mono text-foreground leading-none">
            {formatTime(timeLeft)}
          </span>
          
          {/* Bottom text with chevron */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[clamp(0.4rem,1vw,0.8rem)] font-mono text-muted-foreground tracking-[0.1em] uppercase">
              MINUTES
            </span>
            <ChevronDown 
              className={`w-[clamp(0.6rem,1.2vw,1rem)] h-[clamp(0.6rem,1.2vw,1rem)] text-muted-foreground transition-transform duration-200 ${
                open ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 p-3">
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
      </HoverCardContent>
    </HoverCard>
  );
} 