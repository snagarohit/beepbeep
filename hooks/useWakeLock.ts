"use client";

import * as React from 'react';

/**
 * Manages the screen wake lock to prevent the device from sleeping while the timer is active.
 * It uses the navigator.wakeLock API when available, with a fallback to playing a silent
 * audio track, a common technique for ensuring screen-on time in all browsers.
 * @param status The current status of the timer ('RUNNING', 'PAUSED', 'IDLE').
 */
export function useWakeLock(status: 'RUNNING' | 'PAUSED' | 'IDLE') {
  const wakeLockSentinelRef = React.useRef<WakeLockSentinel | null>(null);
  const wakeLockAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // Effect to create a silent audio element for the fallback mechanism.
  // This runs once on component mount.
  React.useEffect(() => {
    // A minimal, silent WAV file created programmatically in memory.
    // This is more robust than hosting a file, which could fail to load.
    const audio = new Audio();
    const arrayBuffer = new ArrayBuffer(44);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    // Standard WAV header
    writeString(0, 'RIFF');
    view.setUint32(4, 36, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, 8000, true); // Sample rate
    view.setUint32(28, 8000, true); // Byte rate
    view.setUint16(32, 1, true); // Block align
    view.setUint16(34, 8, true); // Bits per sample
    writeString(36, 'data');
    view.setUint32(40, 0, true); // Sub-chunk size (0 for no data)
    
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    audio.src = URL.createObjectURL(blob);
    audio.loop = true;
    audio.volume = 0;
    wakeLockAudioRef.current = audio;

    return () => {
      // Revoke the object URL to free up memory on unmount.
      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
    };
  }, []);


  // Main effect to acquire or release the wake lock based on timer status.
  React.useEffect(() => {
    const acquireWakeLock = async () => {
      // Prefer the modern Wake Lock API for efficiency.
      if ('wakeLock' in navigator) {
        try {
          wakeLockSentinelRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          // Fallback to playing silent audio if the API fails.
          // This can happen if the user denies the permission or on older browsers.
          console.error('Failed to acquire screen wake lock, falling back to audio.', err);
          wakeLockAudioRef.current?.play().catch(e => console.error("Wake lock audio fallback failed:", e));
        }
      } else {
        // Fallback for browsers that do not support the Wake Lock API at all.
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
    
    if (status === 'RUNNING') {
      acquireWakeLock();
    } else {
      releaseWakeLock();
    }

    // Also handle visibility changes to re-acquire the lock if the user tabs away and back.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && status === 'RUNNING') {
        acquireWakeLock();
      } else {
        releaseWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Ensure the lock is always released on component unmount.
      releaseWakeLock();
    };
  }, [status]);
} 