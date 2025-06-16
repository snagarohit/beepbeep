import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Enable experimental features for better SEO
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compress responses
  compress: true,
  
  // Generate sitemap automatically
  trailingSlash: false,
  
  // SEO and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          }
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|otf)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache HTML with shorter duration
      {
        source: '/(.*)\\.html$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate'
          }
        ]
      }
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      // Redirect common timer-related URLs to main page
      {
        source: '/timer',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pomodoro',
        destination: '/',
        permanent: true,
      },
      {
        source: '/focus',
        destination: '/',
        permanent: true,
      },
      {
        source: '/adhd',
        destination: '/adhd-timer-guide',
        permanent: true,
      },
      {
        source: '/guide',
        destination: '/adhd-timer-guide',
        permanent: true,
      },
      {
        source: '/story',
        destination: '/origin',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/origin',
        permanent: true,
      }
    ]
  },
  
  // Rewrites for better URLs
  async rewrites() {
    return [
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
      },
      {
        source: '/robots',
        destination: '/robots.txt',
      },
      {
        source: '/humans',
        destination: '/humans.txt',
      }
    ]
  }
};

export default nextConfig;
