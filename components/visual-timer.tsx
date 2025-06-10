"use client";

import * as React from 'react';
import { ClockMarkings } from './clock-markings';
import { InnerMarkings } from './inner-markings';

interface VisualTimerProps {
  isRotated: boolean;
  percentage: number;
  onTimeChange: (newTime: number) => void;
  onDrag: () => void;
}

export function VisualTimer({ isRotated, percentage, onTimeChange, onDrag }: VisualTimerProps) {
  const timerRef = React.useRef<HTMLDivElement>(null);
  const lastMinuteRef = React.useRef<number | null>(null);
  
  const handleInteraction = (clientX: number, clientY: number, isDragging: boolean) => {
    if (!timerRef.current) return;

    const rect = timerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let adjustedClientX = clientX;
    let adjustedClientY = clientY;
    
    // If rotated, transform coordinates back to their original orientation
    if (isRotated) {
      // 1. Translate point to origin
      const translatedX = clientX - centerX;
      const translatedY = clientY - centerY;
      // 2. Apply reverse rotation (-90 degrees)
      const rotatedX = translatedY;
      const rotatedY = -translatedX;
      // 3. Translate point back
      adjustedClientX = rotatedX + centerX;
      adjustedClientY = rotatedY + centerY;
    }

    const angle = Math.atan2(adjustedClientY - centerY, adjustedClientX - centerX) + Math.PI / 2;
    
    let degrees = (angle * 180) / Math.PI;
    if (degrees < 0) degrees += 360;
    
    let minute = Math.round(degrees / 6);
    if (minute === 60) minute = 0;
    
    if (lastMinuteRef.current !== minute) {
      const newTime = minute * 60;
      onTimeChange(newTime);
      if (isDragging) onDrag();
      lastMinuteRef.current = minute;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    lastMinuteRef.current = -1; // Force update on first interaction
    handleInteraction(e.clientX, e.clientY, false);
  };
  
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    handleInteraction(e.clientX, e.clientY, true);
  };
  
  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    lastMinuteRef.current = null;
  };

  return (
    <div
      ref={timerRef}
      aria-label="Set timer duration by dragging or clicking the dial."
      className="w-full h-full rounded-full relative cursor-grab active:cursor-grabbing
                 shadow-[0_12px_48px_rgba(0,0,0,0.15)]
                 dark:shadow-[0_12px_48px_rgba(255,255,255,0.08)]"
      style={
        {
          '--percentage': percentage,
          background: `conic-gradient(var(--foreground) calc(var(--percentage, 0) * 1%), var(--timer-elapsed-color) 0)`,
          touchAction: 'none'
        } as React.CSSProperties
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <ClockMarkings />
      <InnerMarkings />
    </div>
  );
} 