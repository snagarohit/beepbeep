"use client";

import * as React from "react";
import { Eye, RotateCw, RotateCcw, Sun, Moon, Maximize, Minimize } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DisplaySettingsProps {
  onOpen: () => void;
  isRotated: boolean;
  onRotateToggle: () => void;
  onThemeChange: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
}

export function DisplaySettings({
  onOpen,
  isRotated,
  onRotateToggle,
  onThemeChange,
  isFullscreen,
  onFullscreenToggle,
}: DisplaySettingsProps) {
  return (
    <Popover onOpenChange={(open) => { if (open) onOpen(); }}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
          <span className="sr-only">Open display settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="font-medium leading-none">Display Settings</h4>
            <p className="text-sm text-muted-foreground">
              Adjust visual appearance and layout.
            </p>
          </div>
          <Separator />
          <div className="flex flex-col space-y-2">
            {/* Theme Toggle */}
            <button className="flex items-center justify-between p-3 rounded-lg bg-muted w-full hover:bg-accent hover:text-accent-foreground" onClick={onThemeChange}>
              <div className="flex flex-col text-left">
                <span className="font-medium">Theme</span>
                <span className="text-xs text-muted-foreground">Switch between light and dark mode.</span>
              </div>
              <div className="relative flex h-[1.2rem] w-[1.2rem] items-center justify-center">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </div>
            </button>

            {/* Rotate Toggle */}
            <button className="flex items-center justify-between p-3 rounded-lg bg-muted w-full hover:bg-accent hover:text-accent-foreground" onClick={onRotateToggle}>
              <div className="flex flex-col text-left">
                <span className="font-medium">Rotation</span>
                <span className="text-xs text-muted-foreground">Rotate the timer 90 degrees.</span>
              </div>
              <div className="relative flex h-[1.2rem] w-[1.2rem] items-center justify-center">
                {isRotated ? (
                  <RotateCcw className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <RotateCw className="h-[1.2rem] w-[1.2rem]" />
                )}
              </div>
            </button>

            {/* Fullscreen Toggle */}
            <button className="flex items-center justify-between p-3 rounded-lg bg-muted w-full hover:bg-accent hover:text-accent-foreground" onClick={onFullscreenToggle}>
               <div className="flex flex-col text-left">
                <span className="font-medium">Fullscreen</span>
                <span className="text-xs text-muted-foreground">Expand to fill the entire screen.</span>
              </div>
               <div className="relative flex h-[1.2rem] w-[1.2rem] items-center justify-center">
                {isFullscreen ? (
                  <Minimize className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Maximize className="h-[1.2rem] w-[1.2rem]" />
                )}
              </div>
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 