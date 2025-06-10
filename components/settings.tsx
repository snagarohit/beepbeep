"use client";

import * as React from "react";
import { Wrench } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

const intervalSteps = [0, 1, 2, 5, 10, 15, 20, 30]; // 0 is 'Off'
const stepLabels = ['Off', '1m', '2m', '5m', '10m', '15m', '20m', '30m'];

export type IntervalValue = (typeof intervalSteps)[number];
export type IntervalType = 'beep' | 'speech';

interface SettingsProps {
  onOpen: () => void;
  isRotated: boolean;
  // Timer Settings
  autoRestart: boolean;
  onAutoRestartChange: (checked: boolean) => void;
  // Audio Settings
  uiChime: boolean;
  onUiChimeChange: (checked: boolean) => void;
  intervalBeep: IntervalValue;
  onIntervalBeepChange: (value: IntervalValue) => void;
  intervalType: IntervalType;
  onIntervalTypeChange: (value: IntervalType) => void;
}

export function Settings({
  onOpen,
  isRotated,
  autoRestart,
  onAutoRestartChange,
  uiChime,
  onUiChimeChange,
  intervalBeep,
  onIntervalBeepChange,
  intervalType,
  onIntervalTypeChange,
}: SettingsProps) {
  const handleSliderChange = (value: number[]) => {
    const newInterval = intervalSteps[value[0]];
    onIntervalBeepChange(newInterval);
    onOpen();
  };
  
  const handleTypeChange = (value: IntervalType) => {
    onIntervalTypeChange(value);
    onOpen();
  };

  const currentStepIndex = intervalSteps.indexOf(intervalBeep);

  return (
    <Popover onOpenChange={() => { if(uiChime) onOpen()}}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Wrench className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
          <span className="sr-only">Open settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure timer, audio, and interface behavior.
            </p>
          </div>
          <Separator />
          <div className="grid gap-4">
            <Label className="font-semibold text-base">Timer</Label>
            <div className="flex flex-col space-y-2 p-2 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                 <Label htmlFor="auto-restart-switch">Loop Timer</Label>
                  <Switch
                    id="auto-restart-switch"
                    checked={autoRestart}
                    onCheckedChange={(c) => { onAutoRestartChange(c); onOpen(); }}
                  />
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                When the timer completes, it will automatically restart for the same duration.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <Label className="font-semibold text-base">Audio</Label>
            <div className="flex flex-col space-y-2 p-2 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <Label htmlFor="ui-chime-switch">UI Chime</Label>
                <Switch
                  id="ui-chime-switch"
                  checked={uiChime}
                  onCheckedChange={(c) => { onUiChimeChange(c); onOpen(); }}
                />
              </div>
               <p className="text-xs text-muted-foreground pt-1">
                Plays a short sound when you interact with buttons and controls.
              </p>
            </div>
            <div className="grid gap-4 p-2 rounded-lg bg-muted">
              <div className="flex justify-between items-baseline">
                <Label>Interval Alert</Label>
                <span className="text-sm font-bold text-foreground">{stepLabels[currentStepIndex]}</span>
              </div>
               <p className="text-xs text-muted-foreground pb-2">
                Get an alert at a recurring interval. Select &apos;Off&apos; to disable.
              </p>
              <Slider
                value={[currentStepIndex]}
                min={0}
                max={intervalSteps.length - 1}
                step={1}
                onValueChange={handleSliderChange}
              />
              <RadioGroup
                defaultValue={intervalType}
                onValueChange={handleTypeChange}
                className="grid grid-cols-2 gap-2"
              >
                <Label htmlFor="type-beep" className="flex items-center justify-center space-x-2 cursor-pointer rounded-md p-2 text-center text-xs bg-background">
                  <RadioGroupItem value="beep" id="type-beep" />
                  <span>Beep</span>
                </Label>
                <Label htmlFor="type-speech" className="flex items-center justify-center space-x-2 cursor-pointer rounded-md p-2 text-center text-xs bg-background">
                  <RadioGroupItem value="speech" id="type-speech" />
                  <span>Speech</span>
                </Label>
              </RadioGroup>
               <p className="text-xs text-muted-foreground pt-2">
                Choose whether the interval alert is a simple beep or a spoken announcement of the current time.
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 