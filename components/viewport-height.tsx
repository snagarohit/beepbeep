"use client";

import { useEffect } from "react";

/**
 * Fixes mobile viewport height issues (address bar, notch) by
 * storing `window.innerHeight` in a CSS custom property that can
 * be referenced from styles. This runs on mount and any time the
 * viewport dimensions change.
 */
export default function ViewportHeightSetter() {
  useEffect(() => {
    const setHeight = () => {
      if (typeof window === "undefined") return;
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    // Initial set
    setHeight();

    // Update on resize and orientation changes
    window.addEventListener("resize", setHeight);
    window.addEventListener("orientationchange", setHeight);

    return () => {
      window.removeEventListener("resize", setHeight);
      window.removeEventListener("orientationchange", setHeight);
    };
  }, []);

  return null;
} 