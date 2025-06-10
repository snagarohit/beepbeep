"use client";

import * as React from "react";
import { Github, RotateCw, RotateCcw } from 'lucide-react';
import useLocalStorage from "@/hooks/use-local-storage";
import { ThemeToggle } from "@/components/theme-toggle";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { Settings, IntervalValue, IntervalType } from "@/components/settings";
import { VisualTimer } from "@/components/visual-timer";
import { DigitalDisplay } from "@/components/digital-display";
import { AudioPlayer, AudioTriggerPayload } from "@/components/audio-player";
import { Button } from "@/components/ui/button";

export default function TimerPage() {
  const [totalDuration, setTotalDuration] = React.useState<number>(2700);
  const [timeLeft, setTimeLeft] = React.useState<number>(2700);
  const [timerStatus, setTimerStatus] = React.useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  const [visualPercentage, setVisualPercentage] = React.useState((2700 / 3600) * 100);
  const [audioTrigger, setAudioTrigger] = React.useState<AudioTriggerPayload | null>(null);
  
  // Persisted Settings
  const [autoRestart, setAutoRestart] = useLocalStorage('timer-autoRestart', true);
  const [intervalBeep, setIntervalBeep] = useLocalStorage<IntervalValue>('timer-intervalBeep', 5);
  const [intervalType, setIntervalType] = useLocalStorage<IntervalType>('timer-intervalType', 'beep');
  const [uiChime, setUiChime] = useLocalStorage('timer-uiChime', true);
  const [isRotated, setIsRotated] = React.useState(false);

  const animationFrameId = React.useRef<number | null>(null);
  const timerStartTimeRef = React.useRef<number>(0);
  const timeRemainingOnPauseRef = React.useRef<number>(0);
  const nextIntervalBeepTimeRef = React.useRef<number>(0);
  const wakeLockAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const wakeLockSentinelRef = React.useRef<WakeLockSentinel | null>(null);
  const speechInteractionMadeRef = React.useRef(false);
  const isInitialMount = React.useRef(true);

  const playUiChime = React.useCallback((volume?: number) => {
    if (uiChime) {
      setAudioTrigger({ count: 1, volume });
    }
  }, [uiChime]);

  const handleTimeUpdate = (newTimeInSeconds: number, fromAutoRestart = false) => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    window.speechSynthesis.cancel();
    if (!fromAutoRestart) playUiChime();
    
    const newDuration = newTimeInSeconds === 0 ? 3600 : newTimeInSeconds;
    timeRemainingOnPauseRef.current = 0;
    setTotalDuration(newDuration);
    setTimeLeft(newDuration);
    setVisualPercentage((newDuration / 3600) * 100);
    
    timerStartTimeRef.current = Date.now();

    setTimerStatus('RUNNING');
  };

  React.useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    
    // Create wake lock audio with a proper silent audio data URL
    const audio = new Audio();
    // Create a minimal silent WAV file
    const arrayBuffer = new ArrayBuffer(44);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 8000, true);
    view.setUint32(28, 8000, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true);
    writeString(36, 'data');
    view.setUint32(40, 0, true);
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    audio.src = URL.createObjectURL(blob);
    audio.loop = true;
    audio.volume = 0;
    wakeLockAudioRef.current = audio;

    return () => {
      window.removeEventListener('resize', setAppHeight);
      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
    };
  }, []);

  React.useEffect(() => {
    if (timerStatus === 'RUNNING') {
      wakeLockAudioRef.current?.play().catch(e => console.error("Wake lock audio failed:", e));
    } else {
      wakeLockAudioRef.current?.pause();
    }
  }, [timerStatus]);

  React.useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const elapsedMs = now - timerStartTimeRef.current;
      const remainingMs = (totalDuration * 1000) - elapsedMs;

      if (remainingMs <= 0) {
        setAudioTrigger({ count: 6 }); 
        if (autoRestart) {
          handleTimeUpdate(totalDuration, true);
        } else {
          setTimerStatus('IDLE');
          setTimeLeft(totalDuration);
          setVisualPercentage((totalDuration / 3600) * 100);
        }
      } else {
        setTimeLeft(Math.ceil(remainingMs / 1000));
        setVisualPercentage((remainingMs / 1000 / 3600) * 100);

        if (intervalBeep !== 0 && now >= nextIntervalBeepTimeRef.current) {
          if (intervalType === 'beep') {
            setAudioTrigger({ count: 2 });
          } else {
            speakTime();
          }
          nextIntervalBeepTimeRef.current = nextIntervalBeepTimeRef.current + intervalBeep * 60 * 1000;
        }
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (timerStatus === 'RUNNING') {
      animationFrameId.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [timerStatus, totalDuration, autoRestart, intervalBeep, intervalType, handleTimeUpdate]);
  
  React.useEffect(() => {
    if (timerStatus === 'RUNNING' && intervalBeep > 0) {
      const elapsedMs = Date.now() - timerStartTimeRef.current;
      const intervalsPassed = Math.floor(elapsedMs / (intervalBeep * 60 * 1000));
      const nextBeepElapsed = (intervalsPassed + 1) * (intervalBeep * 60 * 1000);
      nextIntervalBeepTimeRef.current = timerStartTimeRef.current + nextBeepElapsed;
    }
  }, [timerStatus, intervalBeep, totalDuration]);

  const pauseTimer = () => {
    window.speechSynthesis.cancel();
    timeRemainingOnPauseRef.current = (totalDuration * 1000) - (Date.now() - timerStartTimeRef.current);
    setTimerStatus('PAUSED');
  };

  const handleDisplayClick = () => {
    // Always play chime on interaction
    playUiChime();
    
    // On the first user interaction, if speech is enabled, speak the time
    // to satisfy mobile browser autoplay policies.
    if (intervalType === 'speech' && !speechInteractionMadeRef.current) {
      speakTime();
      speechInteractionMadeRef.current = true;
    }

    if (timerStatus === 'RUNNING') {
      pauseTimer();
    } else { 
      if (timerStatus === 'PAUSED') {
        const elapsedOnPause = (totalDuration * 1000) - timeRemainingOnPauseRef.current;
        timerStartTimeRef.current = Date.now() - elapsedOnPause;
        timeRemainingOnPauseRef.current = 0; // Reset after use
      } else {
        timerStartTimeRef.current = Date.now();
        setTimeLeft(totalDuration);
      }
      setTimerStatus('RUNNING');
    }
  };

  // Hybrid Wake Lock Logic
  React.useEffect(() => {
    const acquireWakeLock = async () => {
      if ('wakeLock' in navigator) {
        try {
          wakeLockSentinelRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.error('Failed to acquire screen wake lock, falling back to audio.', err);
          if (wakeLockAudioRef.current) {
            wakeLockAudioRef.current.play().catch(e => console.error("Wake lock audio fallback failed:", e));
          }
        }
      } else {
        if (wakeLockAudioRef.current) {
          wakeLockAudioRef.current.play().catch(e => console.error("Wake lock audio fallback failed:", e));
        }
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

  // Mobile speech synthesis fix: wait for voices, set English voice
  const voicesRef = React.useRef<SpeechSynthesisVoice[] | null>(null);
  React.useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakTime = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const utterance = new SpeechSynthesisUtterance(`The time is ${time}`);
    const voices = voicesRef.current || window.speechSynthesis.getVoices();
    // Prefer English voice
    const enVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    // This handles the case where the user enables speech via settings
    // before any other interaction. This action counts as the user gesture.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (intervalType === 'speech' && !speechInteractionMadeRef.current) {
      speakTime();
      speechInteractionMadeRef.current = true;
    }
  }, [intervalType]);

  return (
    <div className="bg-background text-foreground h-[var(--app-height)] w-screen flex flex-col overflow-hidden antialiased">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Settings
          onOpen={playUiChime}
          isRotated={isRotated}
          autoRestart={autoRestart}
          onAutoRestartChange={setAutoRestart}
          uiChime={uiChime}
          onUiChimeChange={setUiChime}
          intervalBeep={intervalBeep}
          onIntervalBeepChange={setIntervalBeep}
          intervalType={intervalType}
          onIntervalTypeChange={setIntervalType}
        />
        <Button variant="outline" size="icon" onClick={() => { setIsRotated(!isRotated); playUiChime(); }}>
          {isRotated ? (
            <RotateCcw className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
          ) : (
            <RotateCw className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
          )}
          <span className="sr-only">Rotate Timer</span>
        </Button>
        <a href="https://github.com/snagarohit/beepbeep" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="icon">
            <Github className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
            <span className="sr-only">View on GitHub</span>
          </Button>
        </a>
        <ThemeToggle onThemeChange={playUiChime} isRotated={isRotated} />
        <FullscreenToggle onToggle={playUiChime} isRotated={isRotated} />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div 
          className="relative w-[min(80vw,80vh,500px)] h-[min(80vw,80vh,500px)] flex items-center justify-center transition-transform duration-300"
          style={{
            transform: isRotated ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          <VisualTimer 
            isRotated={isRotated}
            percentage={visualPercentage}
            onTimeChange={handleTimeUpdate}
            onDrag={() => playUiChime(0.125)}
          />
          <DigitalDisplay 
            timeLeft={timeLeft} 
            onDisplayClick={handleDisplayClick} 
            timerStatus={timerStatus}
          />
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
