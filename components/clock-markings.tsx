"use client";

import * as React from 'react';

export function ClockMarkings() {
  const markings = Array.from({ length: 60 }).map((_, i) => {
    const isHourMark = i % 5 === 0;
    const rotation = i * 6;
    const minute = i;

    return (
      <div
        key={`mark-${i}`}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`absolute bg-muted-foreground ${
            isHourMark
              ? 'w-[2px] h-4'
              : 'w-[1px] h-2'
          } top-0 left-1/2 -translate-x-1/2`}
        />
        {isHourMark && (
            <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: '-1.8rem',
                  transform: `rotate(${-rotation}deg)`
                }}
            >
                <span className="text-s text-muted-foreground font-mono">
                  {minute}
                </span>
            </div>
        )}
      </div>
    );
  });

  return <div className="absolute w-full h-full pointer-events-none">{markings}</div>;
} 