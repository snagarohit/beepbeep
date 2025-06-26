# Beautiful Timer: Time, Made Beautiful

Beautiful Timer is not merely an application — it is an experience. Conceived in a sun-lit studio in Cupertino and crafted with the same obsessive attention to detail you would expect of a precision-milled watch, Beautiful Timer transforms the simple act of measuring time into a moment of quiet celebration.

It began as a personal exploration: could a timer feel less like software and more like a beautifully weighted object? Could the gentle sweep of a second hand calm an anxious mind, helping neurodivergent thinkers slip effortlessly into focus? The result is an ad-free, delightfully tactile instrument that you will want to reach for again and again.

---

## A Symphony of Considered Details

### **The Continuous Sweep**
Traditional timers tick; Beautiful Timer glides. Rendered at 250ms intervals with buttery smooth CSS conic gradients, the progress arc moves with the fluid grace reminiscent of a mechanical watch's second hand. Time becomes something you feel, not just read.

### **Dual-Engine Architecture**
Beautiful Timer employs a sophisticated dual-system approach for maximum reliability:

- **Visual Engine**: 250ms interval updates for smooth UI rendering, intelligently paused when the tab is hidden to conserve battery
- **Audio Heartbeat**: Precision `setTimeout` chain that runs reliably in the background, ensuring no alerts are ever missed

### **Multi-Tab Harmony**
Whether you are orchestrating deep work across myriad browser windows or simply checking email, Beautiful Timer remains in perfect sync by harnessing the browser's `storage` events. Change the duration in one tab and every other tab breathes in unison.

### **Real-World Clock Intelligence**
Interval alerts aren't tied to arbitrary timer durations—they align with actual clock boundaries. Set a 5-minute interval and receive gentle nudges at :00, :05, :10, :15, and so on, creating natural rhythm with the world around you.

### **The Precision Chime**
Alerts should prompt, never jolt. A pure 4096 Hz sine wave, generated through the Web Audio API with sophisticated mobile optimization and background audio management, rises and fades in a precise 100ms envelope. Need something more verbal? Let the built-in speech synthesis fondly announce the time.

### **Tactile Control**
Drag the dial, feel the resistance, set intention. `Math.atan2` translates your movement into minutes and seconds, with intelligent coordinate transformation for rotated displays. This form of direct manipulation makes conventional drop-downs feel archaic.

### **Orientation Intelligence**
On mobile, Beautiful Timer pirouettes gracefully. The entire interface can rotate 90 degrees with smooth CSS transitions, and all touch interactions are mathematically transformed to maintain perfect responsiveness in any orientation.

### **Typography & Colour**
We humanise pixels with Geist Sans and Geist Mono, paired with the warm neutrality of the `stone` palette in perceptually uniform OKLCH color space. The result is a canvas that disappears, letting your work shine.

---

## Features That Actually Exist

### **Flexible Timer Setting**
- **Drag to set**: Direct manipulation of the visual dial for intuitive time setting
- **URL parameters**: Launch with specific durations using `/?duration=25` (for 25 minutes)
- **Range**: 1 minute to 60 minutes, with special handling for the full hour

### **Audio System**
- **Interval alerts**: Configurable real-world clock boundary chimes (1, 2, 5, 10, 15, 20, or 30 minutes)
- **Dual audio modes**: Pure sine wave beeps or speech synthesis time announcements
- **Interface chimes**: Soft audio feedback for UI interactions (optional)
- **Mobile-optimized**: Sophisticated background audio management to ensure alerts work reliably

### **Display Options**
- **Theme support**: Seamless light/dark mode switching with system preference detection
- **Rotation**: 90-degree interface rotation for alternative viewing angles
- **Fullscreen mode**: Distraction-free focus sessions with native browser fullscreen API
- **Responsive design**: Fluid scaling from mobile to desktop

### **Smart Behavior**
- **Auto-restart**: Optional seamless session looping for continuous productivity
- **Wake lock**: Prevents device sleep during active timers
- **Multi-tab sync**: Perfect synchronization across browser tabs via localStorage
- **Page reload resilience**: Always starts fresh while remembering your preferences
- **Background reliability**: Audio alerts work even when the tab is hidden

### **Accessibility & ADHD-Friendly Design**
- **Gentle interruptions**: Audio designed to guide rather than startle
- **Visual continuity**: Smooth progress indication without harsh jumps
- **Time blindness support**: Multiple feedback modes for different processing styles
- **Touch-friendly**: Large, forgiving interaction targets

---

## Built With Obsessive Care

### **Core Technologies**
- **Next.js 15.3.3** — Server-first React framework with Turbo
- **React 19** — Latest concurrent features for smooth interactions
- **TypeScript** — Type safety and developer experience
- **Tailwind CSS v4** — Utility-first styling with custom properties
- **shadcn/ui** — Accessible, unstyled UI primitives
- **next-themes** — Seamless theme management

### **Specialized APIs**
- **Web Audio API** — Precision audio synthesis and mobile optimization
- **Speech Synthesis API** — Natural voice time announcements
- **Screen Wake Lock API** — Preventing sleep during focus sessions
- **Fullscreen API** — Distraction-free mode
- **Page Visibility API** — Intelligent background behavior

---

## Quick Start

### **Try It Now**
Visit the timer and start focusing immediately. No installation required.

### **Custom Duration**
Launch with a specific duration: `/?duration=25` for a 25-minute session.

### **Development**
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and experience the craft.

---

## The Philosophy

### **Designed to Give, Not Take**
Beautiful Timer is forever *free*. No ads, no trackers, no dark patterns. It asks for nothing but your attention — and even that, only when you invite it.

### **For the Neurodivergent Community**
Built by someone who experiences time differently, for everyone who does. Every interaction has been considered through the lens of ADHD, executive function challenges, and the need for gentle, supportive technology.

### **Craft Over Convenience**
In an age of disposable software and planned obsolescence, Beautiful Timer represents a different approach: digital craft worthy of daily ritual. Every pixel considered, every interaction refined, every moment of your time treated as precious.

---

## Technical Architecture

Beautiful Timer employs a thoughtfully decoupled architecture:

### **State Management**
- Custom localStorage hooks for persistence across sessions
- React refs for high-frequency animation data
- Controlled component patterns for settings synchronization

### **Timer Logic**
- Timestamp-based calculations for precision across browser tabs
- Separate visual and audio update cycles for optimal performance
- Page Visibility API integration for intelligent background behavior

### **Audio Engineering**
- Web Audio API with AudioContext lifecycle management
- Background audio keepalive for mobile compatibility
- Coordinate transformation mathematics for rotated touch interactions
- Exponential gain curves for natural-sounding chimes

---

## If It Resonates

Share it. Whisper its name to a friend wrestling with focus, tweet a screenshot of your tranquil workspace, or simply use it when you need time to slow down and become manageable.

Beautiful Timer spreads through genuine recommendation — the way all beautiful things should.

---

## For the Curious Builder

Clone, fork, embellish. Beautiful Timer was born of curiosity and is offered in the same spirit.

```bash
git clone [repository-url]
cd beautiful-timer
npm install
npm run dev
```

Every component is documented, every interaction is intentional, every technical decision is available for study and improvement.

---

*Crafted with caffeine, curiosity, and a quiet reverence for the passing moment.*

**No ads. No subscriptions. No bullshit. Just time, beautifully kept.**
