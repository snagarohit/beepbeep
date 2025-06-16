"use client";

import * as React from 'react';

export interface AudioTriggerPayload {
  count: number;
  volume?: number;
}

interface AudioPlayerProps {
  playTrigger: AudioTriggerPayload | null;
  onPlaybackComplete: () => void;
}

export function AudioPlayer({ playTrigger, onPlaybackComplete }: AudioPlayerProps) {
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const backgroundAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const heartbeatIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const userInteractionMadeRef = React.useRef(false);

  // Initialize audio context and background audio
  const initializeAudio = React.useCallback(async () => {
    try {
      // Initialize Web Audio API context
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      }

      // Resume context if suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Create background audio element to keep audio active
      if (!backgroundAudioRef.current) {
        const audio = new Audio();
        
        // Create a minimal silent audio file
        const arrayBuffer = new ArrayBuffer(44);
        const view = new DataView(arrayBuffer);
        
        const writeString = (offset: number, string: string) => {
          for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
          }
        };
        
        // WAV header for silent audio
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
        audio.volume = 0.01; // Very quiet but not completely silent
        audio.preload = 'auto';
        
        backgroundAudioRef.current = audio;
      }
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }, []);

  // Start background audio to prevent suspension
  const startBackgroundAudio = React.useCallback(async () => {
    if (backgroundAudioRef.current && userInteractionMadeRef.current) {
      try {
        await backgroundAudioRef.current.play();
      } catch (error) {
        console.warn('Background audio failed to start:', error);
      }
    }
  }, []);

  // Keep audio context alive with periodic heartbeat
  const startAudioHeartbeat = React.useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(async () => {
      if (audioContextRef.current) {
        // Resume context if suspended
        if (audioContextRef.current.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
          } catch (error) {
            console.warn('Failed to resume audio context:', error);
          }
        }
      }
    }, 15000); // Every 15 seconds
  }, []);

  const playBeep = React.useCallback(async (payload: AudioTriggerPayload) => {
    try {
      await initializeAudio();
      
      if (!audioContextRef.current) return;
      
      const context = audioContextRef.current;
      
      // Ensure context is running
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      const play = (time: number) => {
        const volume = payload.volume ?? 1.0;
        
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.value = 4096; // Target 4096 Hz
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume * 0.5, time + 0.01); // Quieter attack
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.1); // Fast decay

        oscillator.start(time);
        oscillator.stop(time + 0.1);
      };

      const now = context.currentTime;
      for (let i = 0; i < payload.count; i++) {
        play(now + i * 0.12);
      }
      
      onPlaybackComplete();
    } catch (error) {
      console.warn('Audio playback failed:', error);
      onPlaybackComplete();
    }
  }, [initializeAudio, onPlaybackComplete]);

  // Handle user interaction to enable audio
  React.useEffect(() => {
    const handleUserInteraction = async () => {
      if (!userInteractionMadeRef.current) {
        userInteractionMadeRef.current = true;
        await initializeAudio();
        await startBackgroundAudio();
        startAudioHeartbeat();
      }
    };

    // Listen for any user interaction
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [initializeAudio, startBackgroundAudio, startAudioHeartbeat]);

  // Handle visibility changes to maintain audio in background
  React.useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // Tab is now hidden - ensure audio stays active
        await startBackgroundAudio();
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          try {
            await audioContextRef.current.resume();
          } catch (error) {
            console.warn('Failed to resume audio context on visibility change:', error);
          }
        }
      } else {
        // Tab is now visible - can stop background audio
        if (backgroundAudioRef.current && !backgroundAudioRef.current.paused) {
          backgroundAudioRef.current.pause();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startBackgroundAudio]);

  // Play audio when triggered
  React.useEffect(() => {
    if (playTrigger) {
      playBeep(playTrigger);
    }
  }, [playTrigger, playBeep]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        if (backgroundAudioRef.current.src) {
          URL.revokeObjectURL(backgroundAudioRef.current.src);
        }
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return null;
} 