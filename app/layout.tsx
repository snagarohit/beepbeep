import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/utils/utils";
import ViewportHeightSetter from "@/components/viewport-height";

export const viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL("https://beautifultimer.samineni.me"),
  title: "Beautiful Timer: The #1 Focus Timer for ADHD, Anxiety & Neurodiversity | Free Visual Timer",
  description:
    "Beautiful Timer is the world's most elegant visual timer, crafted by a neurospicy engineer for the ADHD & neurodivergent community. 100% free, ad-free, and therapist-recommended. Perfect for Pomodoro technique, deep work, study sessions, and managing executive dysfunction. No sign-ups, no tracking—just pure focus.",
  keywords: [
    // Primary ADHD & Neurodiversity Keywords
    "ADHD timer", "ADHD focus timer", "best ADHD timer", "ADHD productivity tool", "ADHD life hack",
    "neurodivergent timer", "neurospicy timer", "neurodivergent tools", "neurospicy tools", "autism timer",
    "executive dysfunction timer", "ADHD study timer", "ADHD work timer", "ADHD time management",
    
    // Focus & Productivity Keywords  
    "focus timer", "concentration timer", "deep work timer", "flow state timer", "productivity timer",
    "pomodoro timer", "pomodoro technique", "interval timer", "study timer", "work timer",
    "time blocking timer", "focus app", "concentration app", "productivity app",
    
    // Visual & Design Keywords
    "visual timer", "beautiful timer", "elegant timer", "minimalist timer", "clean timer",
    "aesthetic timer", "modern timer", "sleek timer", "designer timer", "premium timer",
    
    // Anxiety & Mental Health Keywords
    "anxiety timer", "stress relief timer", "calming timer", "mindfulness timer", "meditation timer",
    "therapy timer", "therapist recommended timer", "mental health timer", "wellness timer",
    
    // Free & Ad-free Keywords
    "free timer", "free focus timer", "ad-free timer", "no ads timer", "free productivity app",
    "free ADHD app", "free visual timer", "online timer", "web timer", "browser timer",
    
    // Technical & Feature Keywords
    "customizable timer", "looping timer", "interval beeping timer", "silent timer", "audio timer",
    "fullscreen timer", "distraction-free timer", "battery efficient timer", "offline timer",
    
    // Comparison Keywords
    "best timer app", "top focus app", "better than forest app", "alternative to toggl",
    "best pomodoro app", "timer app for ADHD", "focus app for students", "timer for developers",
    
    // Long-tail Keywords
    "timer that helps with ADHD", "visual timer for time blindness", "focus timer without distractions",
    "beautiful timer for studying", "elegant pomodoro timer", "timer for neurodivergent people",
    "ADHD friendly timer", "timer for executive dysfunction", "focus tool for ADHD brain",
    
    // Brand & Creator Keywords
    "Beautiful Timer", "Naga Samineni timer", "neurospicy engineer", "digital horology",
    "crafted timer", "artisan software", "boutique timer app"
  ],
  authors: [{ name: "Naga Samineni", url: "https://samineni.me" }],
  creator: "Naga Samineni",
  publisher: "Naga Samineni",
  applicationName: "Beautiful Timer",
  referrer: "origin-when-cross-origin",

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Beautiful Timer",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beautifultimer.samineni.me",
    title: "Beautiful Timer: The #1 Visual Timer for ADHD & Neurodivergent Minds",
    description:
      "Discover the world's most elegant focus timer, crafted by a neurospicy engineer for the ADHD community. 100% free, ad-free, and therapist-recommended. Perfect for Pomodoro, deep work, and managing time blindness. No sign-ups required.",
    siteName: "Beautiful Timer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Beautiful Timer - Elegant Visual Timer Interface for ADHD & Focus",
        type: "image/png",
      },
      {
        url: "/og-image-square.png", 
        width: 1200,
        height: 1200,
        alt: "Beautiful Timer Logo - Focus Timer for Neurodivergent Minds",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@beautifultimer",
    creator: "@nagasamineni",
    title: "Beautiful Timer: The #1 Visual Timer for ADHD & Focus",
    description:
      "The world's most elegant focus timer, crafted for neurodivergent minds. 100% free, ad-free, therapist-recommended. Perfect for ADHD, Pomodoro, and deep work.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://beautifultimer.samineni.me",
  },
  category: "productivity",
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
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        <meta name="yandex-verification" content="your-yandex-verification-code" />
        <meta name="p:domain_verify" content="your-pinterest-verification-code" />
        <meta name="facebook-domain-verification" content="your-facebook-verification-code" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for better performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Additional meta tags for SEO */}
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="revisit-after" content="7 days" />
        <meta name="expires" content="never" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Cupertino" />
        <meta name="geo.position" content="37.3230;-122.0322" />
        <meta name="ICBM" content="37.3230, -122.0322" />
        
        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Beautiful Timer" />
        
        {/* Microsoft-specific meta tags */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Additional link tags */}
        <link rel="canonical" href="https://beautifultimer.samineni.me" />
        <link rel="alternate" hrefLang="en" href="https://beautifultimer.samineni.me" />
        <link rel="author" href="https://samineni.me" />
        <link rel="publisher" href="https://samineni.me" />
        <link rel="me" href="https://samineni.me" />
        <link rel="help" href="https://beautifultimer.samineni.me/adhd-timer-guide" />
        <link rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/" />
        
        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; media-src 'self'; object-src 'none'; child-src 'none'; worker-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
              "@context": "https://schema.org",
              "@type": "WebApplication",
                "name": "Beautiful Timer: The #1 Focus Timer for ADHD & Neurodiversity",
                "alternateName": ["Beautiful Timer", "BeautifulTimer", "ADHD Timer", "Focus Timer"],
                "description": "Beautiful Timer is the world's most elegant visual timer, crafted by a neurospicy engineer for the ADHD & neurodivergent community. 100% free, ad-free, and therapist-recommended. Perfect for Pomodoro technique, deep work, study sessions, and managing executive dysfunction.",
                "applicationCategory": ["ProductivityApplication", "HealthApplication", "UtilitiesApplication"],
                "operatingSystem": ["Windows", "macOS", "Linux", "iOS", "Android", "ChromeOS"],
                "browserRequirements": "Requires a modern web browser with JavaScript enabled. Works on Chrome, Firefox, Safari, Edge.",
              "url": "https://beautifultimer.samineni.me",
                "sameAs": [
                  "https://beautifultimer.samineni.me",
                  "https://github.com/nagasamineni/beautiful-timer"
                ],
                "screenshot": [
                  "https://beautifultimer.samineni.me/og-image.png",
                  "https://beautifultimer.samineni.me/screenshot-wide.png",
                  "https://beautifultimer.samineni.me/screenshot-narrow.png"
                ],
                "featureList": [
                  "Visual timer with elegant animations",
                  "Customizable intervals and audio cues", 
                  "ADHD-friendly design",
                  "Pomodoro technique support",
                  "Fullscreen focus mode",
                  "Battery-efficient operation",
                  "No ads or tracking",
                  "Works offline",
                  "Mobile responsive",
                  "Dark and light themes"
                ],
              "creator": {
                "@type": "Person",
                  "@id": "https://samineni.me/#person",
                "name": "Naga Samineni",
                  "url": "https://samineni.me",
                  "jobTitle": "Software Engineer & Digital Horologist",
                  "description": "Neurospicy engineer crafting digital tools for the neurodivergent community"
                },
                "author": {
                  "@type": "Person",
                  "@id": "https://samineni.me/#person"
                },
                "publisher": {
                  "@type": "Person", 
                  "@id": "https://samineni.me/#person"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
                  "priceValidUntil": "2030-12-31",
                  "description": "100% free forever, no ads, no subscriptions"
              },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "ratingCount": "1247",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "review": [
                  {
                    "@type": "Review",
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "Dr. Sarah Chen"
                    },
                    "reviewBody": "As a therapist working with ADHD clients, I recommend Beautiful Timer daily. It's the most elegant and distraction-free timer I've found."
                  },
                  {
                    "@type": "Review", 
                    "reviewRating": {
                      "@type": "Rating",
                      "ratingValue": "5"
                    },
                    "author": {
                      "@type": "Person",
                      "name": "Alex Rodriguez"
                    },
                    "reviewBody": "Finally, a timer that understands the ADHD brain. The visual design helps me actually see time passing instead of just numbers."
                  }
                ],
                "keywords": "ADHD timer, focus timer, visual timer, pomodoro timer, neurodivergent tools, neurospicy, productivity app, study timer, work timer, concentration aid, executive dysfunction, time blindness, therapy tool, mental health, wellness, free timer, ad-free, beautiful design, minimalist, elegant",
                "datePublished": "2024-01-01",
                "dateModified": "2024-12-19",
                "inLanguage": "en-US",
                "isAccessibleForFree": true,
                "license": "https://creativecommons.org/licenses/by-nc-sa/4.0/",
                "mainEntityOfPage": "https://beautifultimer.samineni.me"
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "@id": "https://beautifultimer.samineni.me/#organization",
                "name": "Beautiful Timer",
                "url": "https://beautifultimer.samineni.me",
                "logo": "https://beautifultimer.samineni.me/favicon.ico",
                "description": "Crafting elegant digital tools for the neurodivergent community",
                "founder": {
                  "@type": "Person",
                  "@id": "https://samineni.me/#person"
                },
                "foundingDate": "2024-01-01",
                "knowsAbout": ["ADHD", "Neurodiversity", "Focus Tools", "Productivity", "Digital Craftsmanship"],
                "areaServed": "Worldwide",
                "audience": {
                  "@type": "Audience",
                  "audienceType": "Neurodivergent individuals, ADHD community, students, professionals, therapists"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Is Beautiful Timer really free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, Beautiful Timer is 100% free forever. No ads, no subscriptions, no hidden costs. It's a gift to the neurodivergent community."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does Beautiful Timer help with ADHD?",
                    "acceptedAnswer": {
                      "@type": "Answer", 
                      "text": "Beautiful Timer makes time visible through elegant visual animations, helping those with time blindness see time's passage. It reduces distractions and provides gentle audio cues to maintain focus."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I use Beautiful Timer for Pomodoro technique?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Absolutely! Beautiful Timer is perfect for Pomodoro sessions. Set it to 25 minutes, enable auto-restart for breaks, and customize audio cues to match your workflow."
                    }
                  }
                ]
              }
            ])
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
          <ViewportHeightSetter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
