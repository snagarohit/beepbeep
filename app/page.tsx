"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisualTimer } from "@/components/visual-timer";
import { DigitalDisplay } from "@/components/digital-display";
import { IntervalSelector } from "@/components/interval-selector";
import { ControlButton } from "@/components/control-button";
import { AudioPlayer } from "@/components/audio-player";

export default function TimerPage() {
  const [totalDuration, setTotalDuration] = React.useState<number>(300);
  const [timeLeft, setTimeLeft] = React.useState<number>(300);
  const [timerStatus, setTimerStatus] = React.useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [visualPercentage, setVisualPercentage] = React.useState(100);
  const [audioTrigger, setAudioTrigger] = React.useState<'single' | 'double' | null>(null);

  const animationFrameId = React.useRef<number | null>(null);
  const timerEndTimeRef = React.useRef<number>(0);
  const timeRemainingOnPauseRef = React.useRef<number>(0);
  const lastSecondRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (timerStatus !== 'RUNNING') {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const remainingMs = timerEndTimeRef.current - now;

      if (remainingMs <= 0) {
        timerEndTimeRef.current = Date.now() + totalDuration * 1000;
        setAudioTrigger('double');
        setTimeLeft(totalDuration);
        lastSecondRef.current = totalDuration;
        setVisualPercentage(100);
      } else {
        const currentSecond = Math.ceil(remainingMs / 1000);
        if (currentSecond !== lastSecondRef.current) {
          setTimeLeft(currentSecond);
          lastSecondRef.current = currentSecond;
        }
        setVisualPercentage((remainingMs / (totalDuration * 1000)) * 100);
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [timerStatus, totalDuration]);

  const pauseTimer = () => {
    if (timerStatus !== 'RUNNING') return;
    timeRemainingOnPauseRef.current = timerEndTimeRef.current - Date.now();
    setTimerStatus('PAUSED');
  };

  const handlePlayPauseClick = () => {
    setAudioTrigger('single');
    if (timerStatus === 'RUNNING') {
      pauseTimer();
    } else {
      if (timerStatus === 'PAUSED') {
        timerEndTimeRef.current = Date.now() + timeRemainingOnPauseRef.current;
      } else { // IDLE
        timerEndTimeRef.current = Date.now() + totalDuration * 1000;
        setTimeLeft(totalDuration);
        setVisualPercentage(100);
      }
      lastSecondRef.current = Math.ceil((timerEndTimeRef.current - Date.now()) / 1000);
      setTimerStatus('RUNNING');
    }
  };

  const handleIntervalChange = (value: string) => {
    const newDuration = parseInt(value, 10);
    setAudioTrigger('single');
    setTotalDuration(newDuration);
    setTimeLeft(newDuration);
    setVisualPercentage(100);
    
    timerEndTimeRef.current = Date.now() + newDuration * 1000;
    lastSecondRef.current = newDuration;
    
    setTimerStatus('RUNNING');
  };
  
  const handleOpenChange = (open: boolean) => {
    if (open && timerStatus === 'RUNNING') {
      pauseTimer();
    }
  };

  const handleThemeChange = () => {
    setAudioTrigger('single');
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4 antialiased">
      <div className="absolute top-4 right-4">
        <ThemeToggle onThemeChange={handleThemeChange} />
      </div>

      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
          <VisualTimer percentage={visualPercentage} />
          
        </div>
        
        <div className="flex items-center gap-4 mt-8 relative z-10">
          <IntervalSelector 
            onValueChange={handleIntervalChange}
            value={String(totalDuration)}
            disabled={false}
            onOpenChange={handleOpenChange}
          />
          <ControlButton status={timerStatus} onClick={handlePlayPauseClick} />
        </div>
      </main>

      <footer className="text-center p-4 text-xs text-muted-foreground">
        Built in San Francisco by <a href="mailto:snagarohit@gmail.com" className="underline">Naga Samineni</a>
      </footer>

      <AudioPlayer 
        playTrigger={audioTrigger}
        onPlaybackComplete={() => setAudioTrigger(null)}
      />
    </div>
  );
}
