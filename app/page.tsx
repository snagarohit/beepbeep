"use client";

import * as React from "react";
import { RotateCw, RotateCcw } from 'lucide-react';

// Component Imports
import { ThemeToggle } from "@/components/theme-toggle";
import { FullscreenToggle } from "@/components/fullscreen-toggle";
import { Settings, IntervalValue, IntervalType } from "@/components/settings";
import { VisualTimer } from "@/components/visual-timer";
import { DigitalDisplay } from "@/components/digital-display";
import { AudioPlayer, AudioTriggerPayload } from "@/components/audio-player";
import { Button } from "@/components/ui/button";

// Hook Imports
import useLocalStorage from "@/hooks/use-local-storage";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useTimerAnimation } from "@/hooks/useTimerAnimation";

/**
 * The main page component for the BeepBeep timer application.
 * It orchestrates the entire application state and renders all sub-components.
 */
export default function TimerPage() {
  // Core timer state
  const defaultDuration = 20 * 60; // 20 minutes in seconds
  const [totalDuration, setTotalDuration] = React.useState<number>(defaultDuration);
  const [timeLeft, setTimeLeft] = React.useState<number>(defaultDuration);
  const [timerStatus, setTimerStatus] = React.useState<'IDLE' | 'RUNNING' | 'PAUSED'>('IDLE');
  
  // Persisted settings using a custom hook for localStorage
  const [autoRestart, setAutoRestart] = useLocalStorage('timer-autoRestart', true);
  const [intervalBeep, setIntervalBeep] = useLocalStorage<IntervalValue>('timer-intervalBeep', 5);
  const [intervalType, setIntervalType] = useLocalStorage<IntervalType>('timer-intervalType', 'beep');
  const [uiChime, setUiChime] = useLocalStorage('timer-uiChime', true);

  // UI state
  const [isRotated, setIsRotated] = React.useState(false);
  const [audioTrigger, setAudioTrigger] = React.useState<AudioTriggerPayload | null>(null);

  // --- Refs for managing state within animation loops and event handlers ---
  
  /** Ref to store the system timestamp when the timer was started or resumed. */
  const timerStartTimeRef = React.useRef<number>(0);

  /** Ref to store the remaining time when the timer is paused. */
  const timeRemainingOnPauseRef = React.useRef<number>(0);

  /** Ref to ensure a user gesture has been made for speech synthesis to work on mobile. */
  const speechInteractionMadeRef = React.useRef(false);

  /** Ref to the main visual timer DOM element. */
  const visualTimerRef = React.useRef<HTMLDivElement>(null);
  
  /**
   * Plays a UI chime sound if enabled.
   * @param volume - Optional volume level for the chime.
   */
  const playUiChime = React.useCallback((volume?: number) => {
    if (uiChime) {
      setAudioTrigger({ count: 1, volume: volume ?? 0.5 });
    }
  }, [uiChime]);

  /**
   * Pre-loads speech synthesis voices and provides a function to speak the current time.
   * This is wrapped in a ref to handle asynchronous voice loading on mobile.
   */
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

  const speakTime = React.useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const utterance = new SpeechSynthesisUtterance(`The time is ${time}`);
    const voices = voicesRef.current || window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
    if (enVoice) utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
  }, []);

  /**
   * Handles updates to the timer's total duration.
   * This is called when the user drags the visual timer.
   * @param newTimeInSeconds - The new duration in seconds.
   * @param fromAutoRestart - Flag to prevent playing a UI chime on auto-restarts.
   */
  const handleTimeUpdate = React.useCallback((newTimeInSeconds: number, fromAutoRestart = false) => {
    window.speechSynthesis.cancel();
    if (!fromAutoRestart) playUiChime();
    
    // A duration of 0 (dragging to 12 o'clock) is treated as a full hour.
    const newDuration = newTimeInSeconds === 0 ? 3600 : newTimeInSeconds;
    
    timeRemainingOnPauseRef.current = 0;
    setTotalDuration(newDuration);
    setTimeLeft(newDuration);
    
    if (visualTimerRef.current) {
      visualTimerRef.current.style.setProperty('--percentage', `${(newDuration / 3600) * 100}`);
    }
    
    timerStartTimeRef.current = Date.now();
    setTimerStatus('RUNNING');
  }, [playUiChime]);


  // --- Custom Hooks ---

  useWakeLock(timerStatus);
  
  useTimerAnimation({
    timerStatus,
    totalDuration,
    autoRestart,
    intervalBeep,
    intervalType,
    timeLeft,
    timerStartTime: timerStartTimeRef,
    visualTimerRef: visualTimerRef as React.MutableRefObject<HTMLDivElement>,
    setAudioTrigger,
    handleTimeUpdate,
    setTimerStatus,
    setTimeLeft,
    speakTime
  });
  
  /**
   * Handles the primary user interaction: clicking the central display.
   * This toggles the timer between RUNNING, PAUSED, and IDLE states.
   */
  const handleDisplayClick = () => {
    playUiChime();
    
    // On the first user interaction, if speech is enabled, speak the time
    // to satisfy mobile browser autoplay policies for speech synthesis.
    if (intervalType === 'speech' && !speechInteractionMadeRef.current) {
      speakTime();
      speechInteractionMadeRef.current = true;
    }

    if (timerStatus === 'RUNNING') {
      // Pause the timer
      timeRemainingOnPauseRef.current = (totalDuration * 1000) - (Date.now() - timerStartTimeRef.current);
      setTimerStatus('PAUSED');
    } else { 
      // Resume from PAUSED
      if (timerStatus === 'PAUSED') {
        const elapsedOnPause = (totalDuration * 1000) - timeRemainingOnPauseRef.current;
        timerStartTimeRef.current = Date.now() - elapsedOnPause;
        timeRemainingOnPauseRef.current = 0; // Reset after use
      } else { // Start from IDLE
        timerStartTimeRef.current = Date.now();
        setTimeLeft(totalDuration);
      }
      setTimerStatus('RUNNING');
    }
  };

  /**
   * This effect ensures that if a user enables speech synthesis via the settings menu
   * before any other interaction, that action counts as the required user gesture
   * to allow speech to play.
   */
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (intervalType === 'speech' && !speechInteractionMadeRef.current) {
      speakTime();
      speechInteractionMadeRef.current = true;
    }
  }, [intervalType, speakTime]);
  
  const handleIntervalTypePreview = (type: IntervalType) => {
    if (type === 'beep') {
      setAudioTrigger({ count: 2, volume: 1.0 });
    } else {
      speakTime();
    }
  }

  return (
    <div className="bg-background text-foreground h-full w-full flex flex-col antialiased">
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
          onIntervalTypePreview={handleIntervalTypePreview}
        />
        <Button variant="outline" size="icon" onClick={() => { setIsRotated(!isRotated); playUiChime(); }}>
          {isRotated ? (
            <RotateCcw className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
          ) : (
            <RotateCw className="h-[1.2rem] w-[1.2rem] transition-transform duration-300" />
          )}
          <span className="sr-only">Rotate Timer</span>
        </Button>
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
            ref={visualTimerRef}
            isRotated={isRotated}
            percentage={(totalDuration / 3600) * 100}
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
        A <b>Beautiful Timer</b> | Designed in <b>Cupertino</b> | <b>Naga Samineni</b>
      </footer>

      <AudioPlayer 
        playTrigger={audioTrigger}
        onPlaybackComplete={() => setAudioTrigger(null)}
      />
    </div>
  );
}
