"use client";

import * as React from "react";
import { AlarmClock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// Note: Interval types are now managed in AudioSettings
export type IntervalValue = 0 | 1 | 2 | 5 | 10 | 15 | 20 | 30;
export type IntervalType = 'beep' | 'speech';

interface SettingsProps {
  onOpen: () => void;
  isRotated: boolean;
  autoRestart: boolean;
  onAutoRestartChange: (checked: boolean) => void;
}

export function Settings({
  onOpen,
  isRotated,
  autoRestart,
  onAutoRestartChange,
}: SettingsProps) {
  return (
    <Popover onOpenChange={(open) => { if(open) onOpen(); }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <AlarmClock className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
          <span className="sr-only">Open alarm settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Alarm Settings</h4>
            <p className="text-sm text-muted-foreground">
              Manage timer behavior.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col space-y-2">
            {/* Loop Timer */}
            <div 
              role="button"
              tabIndex={0}
              className="flex flex-col space-y-2 p-3 rounded-lg bg-muted text-left w-full cursor-pointer hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => { onAutoRestartChange(!autoRestart); onOpen(); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onAutoRestartChange(!autoRestart); onOpen(); e.preventDefault(); } }}
            >
              <div className="flex items-center justify-between">
                 <Label htmlFor="auto-restart-switch" className="cursor-pointer">Loop Timer</Label>
                  <Switch
                    id="auto-restart-switch"
                    checked={autoRestart}
                    onCheckedChange={(c) => { onAutoRestartChange(c); onOpen(); }}
                    onClick={(e) => e.stopPropagation()}
                  />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Automatically restart the timer when it finishes.
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 