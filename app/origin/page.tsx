import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import fs from 'fs';
import path from 'path';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Genesis of Beautiful Timer - Origin Story | Digital Horologist\'s Quest',
  description: 'Discover the craftsmanship story behind Beautiful Timer - a digital timepiece created by a neurospicy engineer for the neurodivergent community. Learn about the philosophy, vision, and obsessive attention to detail that went into creating the world\'s most elegant focus timer.',
  keywords: [
    'Beautiful Timer origin story', 'neurospicy engineer', 'digital horology', 'ADHD timer creator',
    'neurodivergent tools', 'craftsmanship story', 'timer design philosophy', 'focus tool creation',
    'Naga Samineni', 'Beautiful Timer story', 'neurospicy community', 'digital craftsmanship',
    'timer for ADHD', 'focus timer philosophy', 'neurodivergent design', 'time visualization'
  ],
  openGraph: {
    title: 'The Genesis of Beautiful Timer - A Digital Horologist\'s Quest',
    description: 'The craftsmanship story behind the world\'s most elegant focus timer, created by a neurospicy engineer for the neurodivergent community.',
    type: 'article',
    authors: ['Naga Samineni'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Genesis of Beautiful Timer - Origin Story',
    description: 'Discover the philosophy and craftsmanship behind Beautiful Timer - a digital timepiece for the neurospicy mind.',
  }
};

function getOriginStory() {
  const filePath = path.join(process.cwd(), 'ORIGIN_STORY.md');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return fileContents;
}

export default function OriginPage() {
  const content = getOriginStory();

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

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-stone dark:prose-invert prose-lg max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl md:text-5xl font-light tracking-tight text-center mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-12 mb-6 text-center italic text-muted-foreground">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl md:text-2xl font-medium tracking-tight mt-10 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-base md:text-lg leading-relaxed mb-6 text-foreground/90">
                  {children}
                </p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-6 my-8 text-xl md:text-2xl font-light italic text-center text-muted-foreground">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="space-y-2 my-6 text-foreground/90">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-2 text-xs">●</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              em: ({ children }) => (
                <em className="italic text-primary font-medium">
                  {children}
                </em>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">
                  {children}
                </strong>
              ),
              hr: () => (
                <hr className="my-12 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              ),
              a: ({ href, children }) => (
                <a 
                  href={href} 
                  className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Experience Beautiful Timer at{' '}
            <Link 
              href="/" 
              className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            >
              beautifultimer.samineni.me
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
} 