"use client";

import * as React from 'react';

interface AudioPlayerProps {
  playTrigger: 'single' | 'double' | null;
  onPlaybackComplete: () => void;
}

export function AudioPlayer({ playTrigger, onPlaybackComplete }: AudioPlayerProps) {
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const playBeep = (type: 'single' | 'double') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const context = audioContextRef.current;
    
    const play = (time: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      
      oscillator.frequency.value = 2048; // Casio beep frequency
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1, time + 0.01);
      gain.gain.linearRampToValueAtTime(0, time + 0.1);

      oscillator.start(time);
      oscillator.stop(time + 0.1);
    };

    const now = context.currentTime;
    play(now);
    if (type === 'double') {
      play(now + 0.15);
    }
    onPlaybackComplete();
  };
  
  React.useEffect(() => {
    if (playTrigger) {
      playBeep(playTrigger);
    }
  }, [playTrigger]);

  return null;
} 