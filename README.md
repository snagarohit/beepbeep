# BeepBeep: The ADHD Refocus Timer

BeepBeep is a minimalist, web-based timer designed to help users, especially those with ADHD, maintain focus and manage time effectively. It combines a clean, intuitive interface with powerful, customizable features to create the perfect tool for work, study, and creative sessions.

![BeepBeep Timer Screenshot](public/screenshot.png) 

*(Note: You will need to add a `screenshot.png` to the `public` directory for this image to display.)*

## ✨ Features

- **Intuitive Visual Timer:** A simple, drag-to-set timer that provides a clear visual representation of time, adjustable from 1 to 60 minutes.
- **Digital Display:** A large, easy-to-read digital clock that serves as the primary start/pause control.
- **Interval Alerts:** Get a gentle nudge at recurring intervals to help you stay on track. Choose between a simple beep or a spoken announcement of the current time.
- **Customizable Intervals:** Set interval alerts for every 1, 2, 5, 10, 15, 20, or 30 minutes.
- **Speech Synthesis:** Instead of a beep, the timer can speak the current time, providing a less jarring alert.
- **Looping Timer:** Automatically restart the timer when it finishes, perfect for continuous focus sessions.
- **UI Chimes:** Subtle audio feedback for interactions, making the experience more tactile and responsive.
- **Persistent Settings:** All your preferences are saved locally in your browser, so the timer is always set up just the way you like it.
- **Screen Wake Lock:** Prevents your device from going to sleep while the timer is running, using the native Screen Wake Lock API with a silent audio fallback for wider compatibility.
- **Mobile-First Design:** A fully responsive layout that works beautifully on any device.
- **Rotation Lock:** On mobile, the timer automatically rotates to stay upright in landscape mode, but you can lock it in place if you prefer.

## 🚀 How to Use

1.  **Set the Time:** Click and drag the circular timer to set your desired duration.
2.  **Start/Pause:** Click the large digital time display in the center to start or pause the timer.
3.  **Rotate Timer:** Click the **rotate icon** (🔄) to toggle the timer's orientation by 90 degrees, perfect for landscape viewing on mobile.
4.  **Configure Settings:** Click the **wrench icon** (🔩) in the top right to access settings:
    - **Loop Timer:** Toggle on to make the timer restart automatically.
    - **UI Chime:** Toggle audio feedback for button clicks.
    - **Interval Alert:** Use the slider to set how often you get a recurring alert. Set to 'Off' to disable.
    - **Alert Type (Beep/Speech):** Choose your preferred style for interval alerts.
    - **Rotation Lock:** Toggle to lock the timer's orientation on mobile devices.

## 🛠️ Getting Started for Developers

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, install the dependencies:

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


