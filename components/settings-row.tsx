"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils";

interface SettingsRowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SettingsRow = React.forwardRef<HTMLButtonElement, SettingsRowProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn("flex items-center justify-between p-2 rounded-lg bg-muted hover:bg-muted/80 w-full text-left", className)}
        ref={ref}
        {...props}
      />
    )
  }
)
SettingsRow.displayName = "SettingsRow"

export { SettingsRow } 