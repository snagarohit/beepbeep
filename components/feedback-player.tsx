"use client";

import * as React from 'react';

interface AudioPlayerProps {
  playTrigger: number | null; // Number of beeps to play
  onPlaybackComplete: () => void;
}

export function AudioPlayer({ playTrigger, onPlaybackComplete }: AudioPlayerProps) {
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const playBeep = React.useCallback((beepCount: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    const context = audioContextRef.current;
    
    const play = (time: number) => {
      const frequencies = [1024 * 4, 1024 * 8, 1024 * 12, 1024 * 16];
      
      frequencies.forEach(frequency => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.25, time + 0.01);
        gain.gain.linearRampToValueAtTime(0, time + 0.1);

        oscillator.start(time);
        oscillator.stop(time + 0.1);
      });
    };

    const now = context.currentTime;
    for (let i = 0; i < beepCount; i++) {
      play(now + i * 0.12); // Stagger beeps by 120ms
    }
    onPlaybackComplete();
  }, [onPlaybackComplete]);
  
  React.useEffect(() => {
    if (playTrigger && playTrigger > 0) {
      playBeep(playTrigger);
    }
  }, [playTrigger, playBeep]);

  return null;
} 