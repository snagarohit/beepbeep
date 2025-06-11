"use client";

import * as React from 'react';
import { IntervalType, IntervalValue } from '@/components/settings';
import { AudioTriggerPayload } from '@/components/audio-player';

interface TimerAnimationProps {
  timerStatus: 'IDLE' | 'RUNNING' | 'PAUSED';
  totalDuration: number;
  autoRestart: boolean;
  intervalBeep: IntervalValue;
  intervalType: IntervalType;
  timeLeft: number;
  timerStartTime: React.MutableRefObject<number>;
  visualTimerRef: React.RefObject<HTMLDivElement>;
  setAudioTrigger: (payload: AudioTriggerPayload | null) => void;
  handleTimeUpdate: (newTimeInSeconds: number, fromAutoRestart?: boolean) => void;
  setTimerStatus: (status: 'IDLE' | 'RUNNING' | 'PAUSED') => void;
  setTimeLeft: (time: number) => void;
  speakTime: () => void;
}

/**
 * Manages the core timer logic with a decoupled architecture for maximum
 * efficiency and reliability.
 *
 * 1.  **Visual Engine (`setInterval`)**: Updates the UI 4 times per second.
 *     This is paused via the Page Visibility API when the tab is hidden to
 *     conserve battery.
 *
 * 2.  **Audio Heartbeat (`setTimeout` chain)**: Schedules the next audible
 *     event (interval or completion). This is highly efficient and runs
 *     reliably in the background, ensuring no alerts are missed.
 */
export function useTimerAnimation({
  timerStatus,
  totalDuration,
  autoRestart,
  intervalBeep,
  intervalType,
  timeLeft,
  timerStartTime,
  visualTimerRef,
  setAudioTrigger,
  handleTimeUpdate,
  setTimerStatus,
  setTimeLeft,
  speakTime,
}: TimerAnimationProps) {
  const visualIntervalIdRef = React.useRef<NodeJS.Timeout | null>(null);
  const audioTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const stateRef = React.useRef({
    timerStatus,
    totalDuration,
    autoRestart,
    intervalBeep,
    intervalType,
    timeLeft,
    handleTimeUpdate,
    speakTime,
  });

  React.useEffect(() => {
    stateRef.current = {
      timerStatus,
      totalDuration,
      autoRestart,
      intervalBeep,
      intervalType,
      timeLeft,
      handleTimeUpdate,
      speakTime,
    };
  }, [timerStatus, totalDuration, autoRestart, intervalBeep, intervalType, timeLeft, handleTimeUpdate, speakTime]);


  const stopVisualInterval = React.useCallback(() => {
    if (visualIntervalIdRef.current) {
      clearInterval(visualIntervalIdRef.current);
      visualIntervalIdRef.current = null;
    }
  }, []);

  const stopAudioTimeout = React.useCallback(() => {
    if (audioTimeoutIdRef.current) {
      clearTimeout(audioTimeoutIdRef.current);
      audioTimeoutIdRef.current = null;
    }
  }, []);


  const scheduleNextAudioEvent = React.useCallback(() => {
    stopAudioTimeout();

    const {
      totalDuration,
      intervalBeep,
      intervalType,
      speakTime,
    } = stateRef.current;
    
    const now = Date.now();
    const elapsedMs = now - timerStartTime.current;
    const remainingMs = (totalDuration * 1000) - elapsedMs;

    if (remainingMs <= 0) return;

    let nextEventTimeoutMs: number = remainingMs;
    let eventType: 'final' | 'interval' = 'final';

    if (intervalBeep > 0) {
      // Determine when the *next* real-world clock boundary occurs.
      const unitMinutes = intervalBeep; // e.g. every 5 minutes

      const nowDate = new Date(now);

      // Zero-out seconds & milliseconds so we start calculations on a clean minute boundary.
      nowDate.setSeconds(0, 0);

      const currentMinutes = nowDate.getMinutes();

      // Calculate the next minute value that is a multiple of the unit.
      let nextBoundaryMinutes = Math.ceil((currentMinutes + (Date.now() - nowDate.getTime()) / 60000) / unitMinutes) * unitMinutes;

      // If we overflow past the hour, adjust hours & minutes.
      const nextBoundaryDate = new Date(nowDate);
      if (nextBoundaryMinutes >= 60) {
        nextBoundaryDate.setHours(nextBoundaryDate.getHours() + 1);
        nextBoundaryMinutes = nextBoundaryMinutes % 60;
      }
      nextBoundaryDate.setMinutes(nextBoundaryMinutes);

      const intervalTimeoutMs = nextBoundaryDate.getTime() - now;

      // Only use this interval event if it happens before the timer finishes.
      if (intervalTimeoutMs > 50 && intervalTimeoutMs < nextEventTimeoutMs) {
        nextEventTimeoutMs = intervalTimeoutMs;
        eventType = 'interval';
      }
    }

    audioTimeoutIdRef.current = setTimeout(() => {
      if (eventType === 'final') {
        setAudioTrigger({ count: 6 });
        if (stateRef.current.autoRestart) {
          stateRef.current.handleTimeUpdate(stateRef.current.totalDuration, true);
          scheduleNextAudioEvent();
        } else {
          setTimerStatus('IDLE');
          setTimeLeft(stateRef.current.totalDuration);
        }
      } else { // 'interval'
        if (intervalType === 'beep') {
          setAudioTrigger({ count: 2 });
        } else {
          speakTime();
        }
        scheduleNextAudioEvent();
      }
    }, nextEventTimeoutMs);
    
  }, [timerStartTime, setAudioTrigger, setTimerStatus, setTimeLeft, stopAudioTimeout]);


  const runVisualUpdate = React.useCallback(() => {
    const { totalDuration } = stateRef.current;
    const elapsedMs = Date.now() - timerStartTime.current;
    const remainingMs = Math.max(0, (totalDuration * 1000) - elapsedMs);
    
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    setTimeLeft(remainingSeconds);

    if (visualTimerRef.current) {
      const newPercentage = (remainingMs / 1000 / 3600) * 100;
      visualTimerRef.current.style.setProperty('--percentage', `${newPercentage}`);
    }
  }, [timerStartTime, setTimeLeft, visualTimerRef]);


  const startVisualInterval = React.useCallback(() => {
    stopVisualInterval();
    runVisualUpdate();
    visualIntervalIdRef.current = setInterval(runVisualUpdate, 250);
  }, [stopVisualInterval, runVisualUpdate]);


  React.useEffect(() => {
    if (timerStatus === 'RUNNING') {
      if (document.visibilityState === 'visible') {
        startVisualInterval();
      }
      scheduleNextAudioEvent();
    } else {
      stopVisualInterval();
      stopAudioTimeout();
    }
    
    return () => {
      stopVisualInterval();
      stopAudioTimeout();
    };
  }, [timerStatus, startVisualInterval, stopVisualInterval, stopAudioTimeout, scheduleNextAudioEvent]);


  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (timerStatus === 'RUNNING') {
        if (document.hidden) {
          stopVisualInterval();
        } else {
          startVisualInterval();
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [timerStatus, startVisualInterval, stopVisualInterval]);

  React.useEffect(() => {
    if (timerStatus === 'RUNNING') {
      scheduleNextAudioEvent();
    }
  }, [totalDuration, intervalBeep, intervalType, timerStatus, scheduleNextAudioEvent]);
}