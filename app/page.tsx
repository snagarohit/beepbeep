"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
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
  const wakeLockAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const wakeLockSentinelRef = React.useRef<WakeLockSentinel | null>(null);

  React.useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    
    // Create wake lock audio
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGliZU1wMy5vcmcAAAAPTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
    audio.loop = true;
    wakeLockAudioRef.current = audio;

    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  React.useEffect(() => {
    if (timerStatus === 'RUNNING') {
      wakeLockAudioRef.current?.play().catch(e => console.error("Wake lock audio failed:", e));
    } else {
      wakeLockAudioRef.current?.pause();
    }
  }, [timerStatus]);

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
    if (timerStatus === 'IDLE') {
      // On first click, start "beep every 5 minutes"
      handleIntervalChange("300");
      return;
    }

    setAudioTrigger('single');
    if (timerStatus === 'RUNNING') {
      pauseTimer();
    } else { // PAUSED
      timerEndTimeRef.current = Date.now() + timeRemainingOnPauseRef.current;
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

  const onDigitalDisplayClick = () => {
    setAudioTrigger('single');
  };

  // Hybrid Wake Lock Logic
  React.useEffect(() => {
    const acquireWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockSentinelRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error('Failed to acquire screen wake lock, falling back to audio.', err);
          wakeLockAudioRef.current?.play().catch(e => console.error("Wake lock audio fallback failed:", e));
        }
      } else {
        wakeLockAudioRef.current?.play().catch(e => console.error("Wake lock audio fallback failed:", e));
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockSentinelRef.current) {
        await wakeLockSentinelRef.current.release();
        wakeLockSentinelRef.current = null;
      }
      wakeLockAudioRef.current?.pause();
    };
    
    if (timerStatus === 'RUNNING') {
      acquireWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && timerStatus === 'RUNNING') {
        acquireWakeLock();
      } else {
        releaseWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseWakeLock(); // Clean up on component unmount
    };
  }, [timerStatus]);

  return (
    <div className="bg-background text-foreground h-[var(--app-height)] w-screen flex flex-col overflow-hidden antialiased">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle onThemeChange={handleThemeChange} />
        <FullscreenToggle onToggle={handleThemeChange} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="relative w-[min(80vw,80vh,500px)] h-[min(80vw,80vh,500px)] flex items-center justify-center">
          <VisualTimer percentage={visualPercentage} onClick={handleVisualTimerClick} />
          <DigitalDisplay 
            timeLeft={timeLeft} 
            onIntervalChange={handleIntervalChange} 
            timerStatus={timerStatus}
            onOpenRequest={onDigitalDisplayClick} 
          />
        </div>
      </main>

      <footer className="w-full text-center p-4 text-xs text-muted-foreground">
        <b>Designed</b> by <b>Naga Samineni</b> in <b>Cupertino</b>
      </footer>

      <AudioPlayer 
        playTrigger={audioTrigger}
        onPlaybackComplete={() => setAudioTrigger(null)}
      />
    </div>
  );
}
