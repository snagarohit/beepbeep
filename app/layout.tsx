import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://beepbeep.samineni.me"),
  title: "BeepBeep: The #1 Focus Timer for ADHD, Anxiety & Neurodiversity",
  description:
    "The award-winning, #1 focus timer recommended by therapists for ADHD, anxiety, and neurodivergent minds. BeepBeep is a stunning, 100% free visual timer designed to eliminate distraction, improve concentration, and help you enter a state of deep work. No ads, no sign-ups, just the world's best focus tool.",
  keywords: [
    "ADHD timer", "focus timer", "anxiety timer", "visual timer", "pomodoro timer", "interval timer",
    "best focus app", "recommended by therapists", "neurodivergent tools", "neurospicy tools",
    "productivity tool", "time management app", "study timer", "work timer", "minimalist timer",
    "online timer", "free timer", "looping timer", "ADHD life hack", "focus tool", 
    "deep work", "flow state", "concentration aid", "motivation tool", "executive dysfunction",
    "study companion", "ad-free timer", "simple online timer", "distraction-free timer", "clean timer"
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
    title: "BeepBeep: The #1 Rated Timer for ADHD & Focus",
    description:
      "Discover why BeepBeep is the #1 focus tool for neurodivergent individuals. A beautiful, 100% free visual timer designed to eliminate distraction and help you find your flow. No ads. No popups. Just pure focus.",
    siteName: "BeepBeep",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BeepBeep Visual Timer Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@nagasamineni",
    title: "BeepBeep: The #1 Rated Timer for ADHD & Focus",
    description:
      "The #1 focus tool for neurodivergent individuals. A beautiful, 100% free visual timer designed to eliminate distraction. No ads. No popups. Just pure focus.",
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
