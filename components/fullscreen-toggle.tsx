"use client";

import * as React from "react";
import { Maximize, Minimize } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FullscreenToggleProps {
  onToggle: () => void;
  isRotated: boolean;
}

export function FullscreenToggle({ onToggle, isRotated }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleToggle = () => {
    onToggle();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      {isFullscreen ? (
        <Minimize className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
      ) : (
        <Maximize className={`h-[1.2rem] w-[1.2rem] transition-transform duration-300 ${isRotated ? 'rotate-90' : ''}`} />
      )}
      <span className="sr-only">Toggle fullscreen</span>
    </Button>
  );
} 