"use client";

import * as React from 'react';

export function ClockMarkings() {
  const markings = Array.from({ length: 60 }).map((_, i) => {
    const isHourMark = i % 5 === 0;
    const rotation = i * 6; // 360 / 60 = 6 degrees per mark

    return (
      <div
        key={`mark-${i}`}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`absolute bg-muted-foreground pointer-events-none ${
            isHourMark
              ? 'w-[2px] h-4' // Bolder, larger line for hour markings
              : 'w-[1px] h-2'   // Thinner, shorter line for minute markings
          } top-0 left-1/2 -translate-x-1/2`}
        />
      </div>
    );
  });

  return <div className="pointer-events-none">{markings}</div>;
} 