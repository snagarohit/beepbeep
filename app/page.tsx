"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { VisualTimer } from "@/components/visual-timer";
import { DigitalDisplay } from "@/components/digital-display";
import { AudioPlayer } from "@/components/audio-player";

export default function TimerPage() {
  const [totalDuration, setTotalDuration] = React.useState<number>(0);
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
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

  const handleVisualTimerClick = () => {
    if (totalDuration === 0) {
      // Don't start timer if no duration is set, just play a beep to indicate selection needed
      setAudioTrigger('single');
      return;
    }
    
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
  
  const handleThemeChange = () => {
    setAudioTrigger('single');
  };

  return (
    <div className="bg-background text-foreground h-[100dvh] w-screen flex flex-col overflow-hidden antialiased">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle onThemeChange={handleThemeChange} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-[min(80vw,80vh,500px)] h-[min(80vw,80vh,500px)] flex items-center justify-center">
          <VisualTimer percentage={visualPercentage} onClick={handleVisualTimerClick} />
          <DigitalDisplay timeLeft={timeLeft} onIntervalChange={handleIntervalChange} timerStatus={timerStatus} />
        </div>
      </main>

      <footer className="w-full text-center p-4 text-xs text-muted-foreground">
        <b>Designed</b> in <b>Cupertino</b> | <b>Naga Samineni</b>
      </footer>

      <AudioPlayer 
        playTrigger={audioTrigger}
        onPlaybackComplete={() => setAudioTrigger(null)}
      />
    </div>
  );
}
