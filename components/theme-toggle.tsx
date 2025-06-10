"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

interface ThemeToggleProps {
  onThemeChange: () => void;
  isRotated: boolean;
}

export function ThemeToggle({ onThemeChange, isRotated }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    onThemeChange();
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className={`h-[1.2rem] w-[1.2rem] scale-100 transition-all dark:scale-0 ${isRotated ? 'rotate-90 dark:-rotate-0' : 'rotate-0 dark:-rotate-90'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] scale-0 transition-all dark:scale-100 ${isRotated ? 'rotate-180 dark:rotate-90' : 'rotate-90 dark:rotate-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 