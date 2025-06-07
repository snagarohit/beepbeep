"use client";

import * as React from 'react';

interface AudioPlayerProps {
  playTrigger: 'single' | 'double' | null;
  onPlaybackComplete: () => void;
}

export function AudioPlayer({ playTrigger, onPlaybackComplete }: AudioPlayerProps) {
  const audioContextRef = React.useRef<AudioContext | null>(null);

  const playBeep = React.useCallback((type: 'single' | 'double') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const context = audioContextRef.current;
    
    const play = (time: number) => {
      const frequencies = [1024 * 4, 1024 * 8, 1024 * 12, 1024 * 16]; // 4096, 8192, 12288, 16384 Hz
      
      frequencies.forEach(frequency => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.25, time + 0.01); // Lower volume since we have multiple frequencies
        gain.gain.linearRampToValueAtTime(0, time + 0.1);

        oscillator.start(time);
        oscillator.stop(time + 0.1);
      });
    };

    const now = context.currentTime;
    play(now);
    if (type === 'double') {
      play(now + 0.1); // 100ms separation
    }
    onPlaybackComplete();
  }, [onPlaybackComplete]);
  
  React.useEffect(() => {
    if (playTrigger) {
      playBeep(playTrigger);
    }
  }, [playTrigger, playBeep]);

  return null;
} 