"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface ControlButtonProps {
  status: 'IDLE' | 'RUNNING' | 'PAUSED';
  onClick: () => void;
}

export function ControlButton({ status, onClick }: ControlButtonProps) {
  return (
    <Button variant="outline" size="icon" onClick={onClick}>
      {status === 'RUNNING' ? (
        <Pause className="h-6 w-6" />
      ) : (
        <Play className="h-6 w-6" />
      )}
      <span className="sr-only">{status === 'RUNNING' ? 'Pause' : 'Play'}</span>
    </Button>
  );
} 