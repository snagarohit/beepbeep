# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
No test framework is currently configured in this project.

## Project Architecture

### Core Application Structure
Beautiful Timer is a sophisticated React/Next.js timer application with a dual-engine architecture:

1. **Visual Engine**: Updates UI at 250ms intervals using `setInterval`, intelligently paused when tab is hidden
2. **Audio Heartbeat**: Precision `setTimeout` chain for reliable background audio alerts

### Key Components
- `app/page.tsx` - Main timer application with comprehensive state management
- `components/visual-timer.tsx` - Interactive draggable timer dial with coordinate transformation
- `components/audio-player.tsx` - Web Audio API integration for precision chimes
- `hooks/useTimerAnimation.ts` - Core timer logic with dual-engine implementation
- `hooks/useWakeLock.ts` - Prevents device sleep during active timers
- `hooks/use-local-storage.ts` - Persistent settings across sessions

### State Management Pattern
- Custom localStorage hooks for persistence
- React refs for high-frequency animation data
- Controlled component patterns for settings synchronization
- Multi-tab synchronization via localStorage events

### Timer Logic
- Timestamp-based calculations for precision across browser tabs
- Separate visual and audio update cycles for optimal performance
- Real-world clock boundary alignment for interval alerts
- Page Visibility API integration for intelligent background behavior

### Audio System
- Web Audio API with AudioContext lifecycle management
- Background audio keepalive for mobile compatibility
- Dual audio modes: pure sine wave beeps or speech synthesis
- Mobile-optimized with sophisticated background audio management

### UI/UX Features
- Drag-to-set timer with `Math.atan2` coordinate transformation
- 90-degree interface rotation with transformed touch interactions
- Smooth CSS animations with conic gradients for progress visualization
- Theme switching with next-themes
- Fullscreen mode support

### Technology Stack
- Next.js 15.3.3 with React 19
- TypeScript for type safety
- Tailwind CSS v4 for styling
- shadcn/ui components
- Specialized Web APIs: Audio, Speech Synthesis, Wake Lock, Fullscreen, Page Visibility

### URL Parameters
- `/?duration=25` - Launch with specific duration (25 minutes)
- Supports 1-60 minute range, with 0 treated as full hour (3600 seconds)

### Mobile Considerations
- Touch-friendly interactions with pointer events
- Coordinate transformation for rotated displays
- Wake lock prevents device sleep during active timers
- Background audio management for reliable alerts

### Settings Persistence
All user preferences persist via localStorage:
- Timer duration and state
- Audio settings (interval chimes, sound type, UI chimes)
- Display settings (theme, rotation, fullscreen)
- Auto-restart behavior