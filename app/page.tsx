"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Component Imports
import { DisplaySettings } from "@/components/display-settings";
import { Settings, IntervalValue } from "@/components/settings";
import { AudioSettings } from "@/components/audio-settings";
import { VisualTimer } from "@/components/visual-timer";
import { DigitalDisplay } from "@/components/digital-display";
import { AudioPlayer, AudioTriggerPayload } from "@/components/audio-player";

// Hook Imports
import useLocalStorage from "@/hooks/use-local-storage";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useTimerAnimation } from "@/hooks/useTimerAnimation";

/**
 * Component to handle URL search parameters
 */
function TimerPageContent() {
  // URL parameters
  const searchParams = useSearchParams();
  
  // Core timer state
  const defaultDuration = 20 * 60; // 20 minutes in seconds
  
  // Check for duration parameter in URL (e.g., /?duration=25 for 25 minutes)
  const urlDuration = React.useMemo(() => {
    const durationParam = searchParams.get('duration');
    if (durationParam) {
      const minutes = parseInt(durationParam, 10);
      if (!isNaN(minutes) && minutes > 0 && minutes <= 60) {
        return minutes * 60; // Convert minutes to seconds
      }
    }
    return null;
  }, [searchParams]);
  
  const [totalDuration, setTotalDuration] = useLocalStorage('timer-totalDuration', urlDuration || defaultDuration);
  const [timeLeft, setTimeLeft] = useLocalStorage('timer-timeLeft', urlDuration || defaultDuration);
  const [timerStatus, setTimerStatus] = useLocalStorage<'IDLE' | 'RUNNING' | 'PAUSED'>('timer-status', 'IDLE');
  
  // Persisted settings using a custom hook for localStorage
  const [autoRestart, setAutoRestart] = useLocalStorage('timer-autoRestart', true);
  const [intervalChime, setIntervalChime] = useLocalStorage<IntervalValue>('timer-intervalChime', 5);
  const [intervalSound, setIntervalSound] = useLocalStorage<'beep' | 'speech'>('timer-intervalSound', 'beep');
  const [uiChime, setUiChime] = useLocalStorage('timer-uiChime', true);

  // UI state
  const [isRotated, setIsRotated] = useLocalStorage('timer-isRotated', false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [audioTrigger, setAudioTrigger] = useLocalStorage<AudioTriggerPayload | null>('audio-trigger', null);

  // External hook state
  const { theme, setTheme } = useTheme();

  // --- Refs for managing state within animation loops and event handlers ---
  
  /** Ref to store the system timestamp when the timer was started or resumed. */
  const timerStartTimeRef = React.useRef<number>(0);
  const [timerStartTime, setTimerStartTime] = useLocalStorage('timer-startTime', 0);
  React.useEffect(() => {
      timerStartTimeRef.current = timerStartTime;
  }, [timerStartTime]);


  /** Ref to store the remaining time when the timer is paused. */
  const timeRemainingOnPauseRef = React.useRef<number>(0);

  /** Ref to ensure a user gesture has been made for speech synthesis to work on mobile. */
  const speechInteractionMadeRef = React.useRef(false);

  /** Ref to the main visual timer DOM element. */
  const visualTimerRef = React.useRef<HTMLDivElement>(null);
  
  // --- State-driven Handlers ---
  
  const playInteractionSound = React.useCallback((volume?: number) => {
    if (uiChime) {
      setAudioTrigger({ count: 1, volume: volume ?? 0.125 });
    }
  }, [uiChime, setAudioTrigger]);
  
  const handleToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    playInteractionSound();
  };
  
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        alert(`Error enabling full-screen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
    playInteractionSound(0.5);
  };
  
  React.useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

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
    if (!fromAutoRestart) playInteractionSound(0.5);
    
    // A duration of 0 (dragging to 12 o'clock) is treated as a full hour.
    const newDuration = newTimeInSeconds === 0 ? 3600 : newTimeInSeconds;
    
    timeRemainingOnPauseRef.current = 0;
    setTotalDuration(newDuration);
    setTimeLeft(newDuration);
    
    if (visualTimerRef.current) {
      visualTimerRef.current.style.setProperty('--percentage', `${(newDuration / 3600) * 100}`);
    }
    
    setTimerStartTime(Date.now());
    setTimerStatus('RUNNING');
  }, [playInteractionSound, setTotalDuration, setTimeLeft, setTimerStartTime, setTimerStatus]);

  // --- Custom Hooks ---

  useWakeLock(timerStatus);
  
  useTimerAnimation({
    timerStatus,
    totalDuration,
    autoRestart,
    intervalChime,
    intervalSound,
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
    playInteractionSound(0.5);
    
    // On the first user interaction, if speech is enabled, speak the time
    // to satisfy mobile browser autoplay policies for speech synthesis.
    if (intervalSound === 'speech' && !speechInteractionMadeRef.current) {
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
        setTimerStartTime(Date.now() - elapsedOnPause);
        timeRemainingOnPauseRef.current = 0; // Reset after use
      } else { // Start from IDLE
        setTimerStartTime(Date.now());
        setTimeLeft(totalDuration);
      }
      setTimerStatus('RUNNING');
    }
  };

  /**
   * Handle URL duration parameter - if present, override stored duration
   */
  React.useEffect(() => {
    if (urlDuration && urlDuration !== totalDuration) {
      setTotalDuration(urlDuration);
      setTimeLeft(urlDuration);
      if (visualTimerRef.current) {
        visualTimerRef.current.style.setProperty('--percentage', `${(urlDuration / 3600) * 100}`);
      }
    }
  }, [urlDuration, totalDuration, setTotalDuration, setTimeLeft]);

  /**
   * On initial load, always reset to a clean, idle state, honoring the user's saved total duration.
   * This ensures that reloading the page while timer is running loads as if it's the first time,
   * except honoring the settings and last set duration.
   */
  React.useEffect(() => {
    // Always reset to idle state on page load, regardless of previous state
    setTimeLeft(totalDuration);
    setTimerStatus('IDLE');
    setTimerStartTime(0);
    timeRemainingOnPauseRef.current = 0;
    
    // Reset visual timer to match the total duration
    if (visualTimerRef.current) {
      visualTimerRef.current.style.setProperty('--percentage', `${(totalDuration / 3600) * 100}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (intervalSound === 'speech' && !speechInteractionMadeRef.current) {
      speakTime();
      speechInteractionMadeRef.current = true;
    }
  }, [intervalSound, speakTime]);
  
  const handleIntervalSoundPreview = (type: 'beep' | 'speech') => {
    if (type === 'beep') {
      setAudioTrigger({ count: 2, volume: 1.0 });
    } else {
      speakTime();
    }
  }

  return (
    <div className="bg-background text-foreground h-screen w-full flex flex-col antialiased overflow-hidden" style={{ height: 'var(--app-height)' }}>
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Settings
          onOpen={() => playInteractionSound(0.5)}
          isRotated={isRotated}
          autoRestart={autoRestart}
          onAutoRestartChange={setAutoRestart}
        />
        <AudioSettings
          onOpen={() => playInteractionSound(0.5)}
          isRotated={isRotated}
          uiChime={uiChime}
          onUiChimeChange={setUiChime}
          intervalChime={intervalChime}
          onIntervalChimeChange={setIntervalChime}
          intervalSound={intervalSound}
          onIntervalSoundChange={setIntervalSound}
          onIntervalSoundPreview={handleIntervalSoundPreview}
        />
        <DisplaySettings
          onOpen={() => playInteractionSound(0.5)}
          isRotated={isRotated}
          onRotateToggle={() => { setIsRotated(!isRotated); playInteractionSound(0.5); }}
          onThemeChange={handleToggleTheme}
          isFullscreen={isFullscreen}
          onFullscreenToggle={handleToggleFullscreen}
        />
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
            onDrag={() => playInteractionSound()}
          />
          <DigitalDisplay 
            timeLeft={timeLeft} 
            onDisplayClick={handleDisplayClick} 
            timerStatus={timerStatus}
          />
        </div>
      </main>

      <footer className="w-full text-center p-4 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <span>A <b>Beautiful Timer</b></span>
          <span className="text-muted-foreground/50">•</span>
          <span>Designed in <b>Cupertino</b></span>
          <span className="text-muted-foreground/50">•</span>
          <span><b>Naga Samineni</b></span>
        </div>
      </footer>

      <AudioPlayer 
        playTrigger={audioTrigger}
        onPlaybackComplete={() => setAudioTrigger(null)}
      />
    </div>
  );
}

/**
 * The main page component for the BeepBeep timer application.
 * Wraps TimerPageContent in Suspense to handle useSearchParams.
 */
export default function TimerPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-background" />}>
      <TimerPageContent />
    </Suspense>
  );
}
