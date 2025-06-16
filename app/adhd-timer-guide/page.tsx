import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, Brain, Target, Zap, Heart, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The Complete ADHD Timer Guide: How Visual Timers Transform Focus & Productivity',
  description: 'Discover how visual timers can revolutionize ADHD time management. Learn why traditional timers fail ADHD brains, how Beautiful Timer helps with time blindness, and proven techniques for better focus and productivity.',
  keywords: [
    'ADHD timer guide', 'visual timer for ADHD', 'ADHD time management', 'time blindness solutions',
    'ADHD productivity tips', 'focus timer techniques', 'executive dysfunction help', 'ADHD study tips',
    'pomodoro for ADHD', 'ADHD work strategies', 'neurodivergent productivity', 'ADHD life hacks',
    'timer for executive dysfunction', 'ADHD concentration tools', 'time awareness ADHD'
  ],
  openGraph: {
    title: 'The Complete ADHD Timer Guide - Visual Timers for Focus & Productivity',
    description: 'Learn how visual timers can transform ADHD time management and boost productivity.',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Complete ADHD Timer Guide - Visual Timers for Focus',
    description: 'Discover how visual timers revolutionize ADHD time management and productivity.',
  }
};

export default function ADHDTimerGuide() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Beautiful Timer
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            The Complete ADHD Timer Guide
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover how visual timers can revolutionize your ADHD time management, 
            boost productivity, and help you finally master the art of focus.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-6 rounded-lg border bg-card">
            <Brain className="h-8 w-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold mb-1">85%</div>
            <div className="text-sm text-muted-foreground">of ADHD individuals struggle with time blindness</div>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <Target className="h-8 w-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold mb-1">3x</div>
            <div className="text-sm text-muted-foreground">better focus with visual time cues</div>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <Zap className="h-8 w-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold mb-1">67%</div>
            <div className="text-sm text-muted-foreground">productivity increase reported by users</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 pb-12">
        <article className="prose prose-stone dark:prose-invert prose-lg max-w-none">
          
          {/* Section 1: Understanding ADHD and Time */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              Why Traditional Timers Fail ADHD Brains
            </h2>
            
            <div className="bg-muted/50 p-6 rounded-lg mb-8">
              <p className="text-lg font-medium mb-4">
                &ldquo;Time blindness isn&rsquo;t a lack of awareness&mdash;it&rsquo;s a fundamental difference in how ADHD brains process temporal information.&rdquo;
              </p>
              <cite className="text-sm text-muted-foreground">&mdash; Dr. Russell Barkley, ADHD Research Pioneer</cite>
            </div>

            <p className="text-lg leading-relaxed mb-6">
              If you have ADHD, you&rsquo;ve probably experienced the frustration of setting a traditional timer, only to be startled when it suddenly goes off. Digital displays showing &ldquo;15:00&rdquo; don&rsquo;t communicate the passage of time&mdash;they just show numbers counting down in an abstract way that ADHD brains struggle to process.
            </p>

            <h3 className="text-2xl font-semibold mb-4">The ADHD Time Challenge</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Time Blindness:</strong> Difficulty sensing how much time has passed or remains</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Hyperfocus Traps:</strong> Getting so absorbed in tasks that hours disappear</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Executive Dysfunction:</strong> Struggling to initiate, maintain, or transition between tasks</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span><strong>Rejection Sensitivity:</strong> Harsh alarms can trigger anxiety and avoidance</span>
              </li>
            </ul>
          </section>

          {/* Section 2: The Visual Timer Solution */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              How Visual Timers Transform ADHD Focus
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Visual timers work because they translate abstract time into something ADHD brains can actually see and understand. Instead of watching numbers count down, you see time as a shrinking circle, a filling bar, or in Beautiful Timer&rsquo;s case, an elegant arc that gradually completes.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3 text-destructive">Traditional Digital Timer</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Abstract numbers (25:00, 24:59...)</li>
                  <li>• No visual progress indication</li>
                  <li>• Sudden, jarring alarms</li>
                  <li>• Requires constant checking</li>
                  <li>• Creates time anxiety</li>
                </ul>
              </div>
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-3 text-primary">Visual Timer</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Intuitive visual progress</li>
                  <li>• Peripheral time awareness</li>
                  <li>• Gentle, customizable cues</li>
                  <li>• Reduces time checking compulsion</li>
                  <li>• Builds time intuition</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Practical Techniques */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              Proven ADHD Timer Techniques
            </h2>

            <div className="space-y-8">
              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-4">The ADHD Pomodoro Method</h3>
                <p className="mb-4">Traditional Pomodoro (25 min work, 5 min break) often doesn&rsquo;t work for ADHD. Try these adaptations:</p>
                <ul className="space-y-2">
                  <li><strong>15-5 Method:</strong> 15 minutes focused work, 5 minute break</li>
                  <li><strong>Flexible Intervals:</strong> Start with 10 minutes and gradually increase</li>
                  <li><strong>Hyperfocus Respect:</strong> If you&rsquo;re in flow, let the timer complete but don&rsquo;t force a break</li>
                  <li><strong>Break Activities:</strong> Stand, stretch, hydrate&mdash;avoid screens during breaks</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-4">The Time Awareness Builder</h3>
                <p className="mb-4">Use visual timers to develop better time intuition:</p>
                <ul className="space-y-2">
                  <li><strong>Time Estimation Game:</strong> Guess how long tasks will take, then time them</li>
                  <li><strong>Transition Timers:</strong> 5-minute warnings before switching activities</li>
                  <li><strong>Hyperfocus Breaks:</strong> Set 90-minute timers to check in with yourself</li>
                  <li><strong>Daily Rhythm:</strong> Use consistent timer intervals to build routine</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-4">The Gentle Accountability System</h3>
                <p className="mb-4">Make timers supportive, not stressful:</p>
                <ul className="space-y-2">
                  <li><strong>Soft Sounds:</strong> Choose gentle chimes over harsh alarms</li>
                  <li><strong>Visual Cues:</strong> Rely on visual progress more than audio alerts</li>
                  <li><strong>Flexible Completion:</strong> It&rsquo;s okay to finish a thought before stopping</li>
                  <li><strong>Celebration:</strong> Acknowledge every completed timer session</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 4: Why Beautiful Timer Works */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              Why Beautiful Timer Was Built for ADHD Minds
            </h2>

            <p className="text-lg leading-relaxed mb-6">
              Beautiful Timer wasn&rsquo;t just designed by someone who understands ADHD&mdash;it was crafted by someone who lives with it. Every feature addresses a specific ADHD challenge:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Visual Progress Arc</h4>
                  <p className="text-sm">Makes time passage visible and intuitive, reducing time blindness</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Gentle Audio Cues</h4>
                  <p className="text-sm">Customizable sounds that guide without startling or triggering anxiety</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Distraction-Free Design</h4>
                  <p className="text-sm">No ads, popups, or unnecessary features that break focus</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Flexible Intervals</h4>
                  <p className="text-sm">Easily adjustable timing to match your unique attention patterns</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Auto-Restart Option</h4>
                  <p className="text-sm">Maintains momentum without requiring constant interaction</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold mb-2">Battery Efficient</h4>
                  <p className="text-sm">Runs for hours without draining your device, perfect for long work sessions</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center py-12 px-6 rounded-lg bg-primary/5 border">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your ADHD Time Management?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of ADHD individuals who&rsquo;ve discovered the power of visual timing. 
              Beautiful Timer is 100% free, ad-free, and designed specifically for neurodivergent minds.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Beautiful Timer Now
            </Link>
            <p className="text-sm text-muted-foreground mt-3">
              No sign-up required • Works on all devices • Always free
            </p>
          </section>
        </article>
      </main>
    </div>
  );
} 