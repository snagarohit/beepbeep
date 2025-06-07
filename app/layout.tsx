import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://beepbeep.samineni.me"),
  title: "BeepBeep: The Neurodivergent Timer for ADHD, Focus & Flow",
  description:
    "Finally, a timer that gets it. Built by a neurodivergent creator for the neurospicy community. BeepBeep is a gorgeous, ad-free visual timer designed to conquer distraction and help you find your flow. No ads, no popups, just pure, minimalist focus.",
  keywords: [
    "visual timer", "pomodoro timer", "adhd timer", "focus timer", "interval timer",
    "productivity tool", "time management", "study timer", "work timer", "minimalist timer",
    "online timer", "free timer", "beep timer", "continuous timer", "looping timer",
    "focus tool", "deep work", "flow state", "concentration aid", "motivation tool",
    "adhd focus tool", "neurodivergent tools", "neurospicy", "study companion", "ad-free timer",
    "free pomodoro timer", "simple online timer", "distraction-free timer", "clean timer", "no ads timer"
  ],
  authors: [{ name: "Naga Samineni", url: "https://samineni.me" }],
  creator: "Naga Samineni",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    url: "https://beepbeep.samineni.me",
    title: "BeepBeep: A Timer for a Different Brain",
    description:
      "A gorgeous, ad-free visual timer built by a neurodivergent creator to help you find your focus. No ads. No popups. Just flow.",
    siteName: "BeepBeep",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeepBeep Visual Timer in action",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nagasamineni",
    title: "BeepBeep: A Timer for a Different Brain",
    description:
      "A gorgeous, ad-free visual timer built by a neurodivergent creator to help you find your focus. No ads. No popups. Just flow.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "BeepBeep: The Neurodivergent Timer",
              "description": "The #1 distraction-free visual timer, built with love by a neurodivergent creator for the neurospicy & ADHD community. A simple, modern, and completely ad-free tool to help you find your flow. No banners, no popups, just a clean interface for Pomodoro, studying, and deep work sessions.",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "All",
              "browserRequirements": "Requires a modern web browser with JavaScript enabled.",
              "url": "https://beepbeep.samineni.me",
              "screenshot": "https://beepbeep.samineni.me/og-image.png",
              "creator": {
                "@type": "Person",
                "name": "Naga Samineni",
                "url": "https://samineni.me"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "keywords": "pomodoro timer, focus timer, adhd timer, visual timer, interval timer, online timer, study timer, productivity tool, deep work, ad-free timer, neurodivergent tools, neurospicy"
            })
          }}
        />
      </head>
      <body
        className={cn(
          "font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
