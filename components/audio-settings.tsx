"use client";

import * as React from "react";
import { Ear } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { IntervalValue, IntervalType } from "@/components/settings";

const intervalSteps: IntervalValue[] = [0, 1, 2, 5, 10, 15, 20, 30];
const stepLabels = ['Off', '1m', '2m', '5m', '10m', '15m', '20m', '30m'];

interface AudioSettingsProps {
  onOpen: () => void;
  isRotated: boolean;
  uiChime: boolean;
  onUiChimeChange: (checked: boolean) => void;
  intervalChime: IntervalValue;
  onIntervalChimeChange: (value: IntervalValue) => void;
  intervalSound: IntervalType;
  onIntervalSoundChange: (value: IntervalType) => void;
  onIntervalSoundPreview: (value: IntervalType) => void;
}

export function AudioSettings({
  onOpen,
  isRotated,
  uiChime,
  onUiChimeChange,
  intervalChime,
  onIntervalChimeChange,
  intervalSound,
  onIntervalSoundChange,
  onIntervalSoundPreview,
}: AudioSettingsProps) {
  
  const handleSliderChange = (value: number[]) => {
    const newInterval = intervalSteps[value[0]];
    onIntervalChimeChange(newInterval);
    if (newInterval > 0) onOpen();
  };

  const handleSoundChange = (value: IntervalType) => {
    onIntervalSoundChange(value);
    onIntervalSoundPreview(value);
  };

  const currentStepIndex = intervalSteps.indexOf(intervalChime);

  return (
    <Popover onOpenChange={(open) => { if (open && uiChime) onOpen(); }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Ear className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
          <span className="sr-only">Open audio settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Audio Settings</h4>
            <p className="text-sm text-muted-foreground">
              Manage sounds and alerts.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col space-y-2">
            
            {/* Interval Alert */}
            <div className="grid gap-3 p-3 rounded-lg bg-muted">
              <div className="flex justify-between items-baseline">
                <Label>Interval Alert</Label>
                <span className="text-sm font-bold text-foreground">{stepLabels[currentStepIndex]}</span>
              </div>
              <p className="text-xs text-muted-foreground -mt-2">
                Get a sound alert at a recurring interval.
              </p>
              <Slider
                value={[currentStepIndex]}
                min={0}
                max={intervalSteps.length - 1}
                step={1}
                onValueChange={handleSliderChange}
                disabled={false}
              />
              <RadioGroup
                value={intervalSound}
                onValueChange={handleSoundChange}
                className="grid grid-cols-2 gap-2 pt-2"
                style={{ opacity: intervalChime === 0 ? 0.5 : 1 }}
              >
                <Label htmlFor="type-beep" className="flex items-center justify-center space-x-2 cursor-pointer rounded-md p-2 text-center text-xs bg-background hover:bg-accent hover:text-accent-foreground">
                  <RadioGroupItem value="beep" id="type-beep" disabled={intervalChime === 0} />
                  <span>Beep</span>
                </Label>
                <Label htmlFor="type-speech" className="flex items-center justify-center space-x-2 cursor-pointer rounded-md p-2 text-center text-xs bg-background hover:bg-accent hover:text-accent-foreground">
                  <RadioGroupItem value="speech" id="type-speech" disabled={intervalChime === 0} />
                  <span>Speech</span>
                </Label>
              </RadioGroup>
            </div>

            {/* UI Chime */}
            <div
              role="button"
              tabIndex={0}
              className="flex flex-col space-y-2 p-3 rounded-lg bg-muted text-left w-full cursor-pointer hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => { onUiChimeChange(!uiChime); onOpen(); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onUiChimeChange(!uiChime); onOpen(); e.preventDefault(); } }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="ui-chime-switch" className="cursor-pointer">Interface Chime</Label>
                <Switch
                  id="ui-chime-switch"
                  checked={uiChime}
                  onCheckedChange={(c) => { onUiChimeChange(c); onOpen(); }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                Play a soft click when interacting with controls.
              </p>
            </div>

          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 