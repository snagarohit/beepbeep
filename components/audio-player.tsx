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

  const playBeep = React.useCallback((payload: AudioTriggerPayload) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    const context = audioContextRef.current;
    
    const play = (time: number) => {
      const frequencies = [1024 * 4, 1024 * 8, 1024 * 12, 1024 * 16];
      const volume = payload.volume ?? 1.0;
      
      frequencies.forEach(frequency => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + 0.01);
        gain.gain.linearRampToValueAtTime(0, time + 0.1);

        oscillator.start(time);
        oscillator.stop(time + 0.1);
      });
    };

    const now = context.currentTime;
    for (let i = 0; i < payload.count; i++) {
      play(now + i * 0.12);
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