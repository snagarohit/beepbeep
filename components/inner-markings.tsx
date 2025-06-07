"use client";

import * as React from 'react';

export function InnerMarkings() {
  const markings = Array.from({ length: 60 }).map((_, i) => {
    const isHourMark = i % 5 === 0;
    const rotation = i * 6; // 360 / 60 = 6 degrees per mark

    return (
      <div
        key={`inner-mark-${i}`}
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`absolute bg-muted-foreground pointer-events-none ${
            isHourMark
              ? 'w-[2px] h-4'
              : 'w-[1px] h-2'
          } top-[30%] left-1/2 -translate-x-1/2 -translate-y-full`}
        />
      </div>
    );
  });

  return <>{markings}</>;
} 