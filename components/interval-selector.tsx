"use client";

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IntervalSelectorProps {
  onValueChange: (value: string) => void;
  value: string;
  disabled: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntervalSelector({ onValueChange, value, disabled, onOpenChange }: IntervalSelectorProps) {
  return (
    <Select onValueChange={onValueChange} value={value} disabled={disabled} onOpenChange={onOpenChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an interval" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Minutes</SelectLabel>
          <SelectItem value="60">1 Minute</SelectItem>
          <SelectItem value="300">5 Minutes</SelectItem>
          <SelectItem value="600">10 Minutes</SelectItem>
          <SelectItem value="900">15 Minutes</SelectItem>
          <SelectItem value="1800">30 Minutes</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
} 