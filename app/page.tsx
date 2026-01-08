import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { LandingCTA } from "./components/LandingCTA";

export const metadata: Metadata = {
  title: "Human Operations - Your Life, Quantified | Personal Productivity System",
  description: "Stop wondering if you're making progress. Track habits, measure what matters, and stay accountable with Human Operations - a personal productivity and habit tracking system.",
  keywords: ["productivity", "habit tracking", "personal development", "goal tracking", "life management", "quantified self"],
  authors: [{ name: "Human Operations" }],
  openGraph: {
    title: "Human Operations - Your Life, Quantified",
    description: "Build better habits, measure what matters, and stay accountable with our personal productivity system.",
    url: "https://humanoperations.com",
    siteName: "Human Operations",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Human Operations - Personal Productivity System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Human Operations - Your Life, Quantified",
    description: "Build better habits, measure what matters, and stay accountable.",
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
    canonical: "https://humanoperations.com",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Human Operations",
            "applicationCategory": "ProductivityApplication",
            "offers": {
              "@type": "Offer",
              "price": "19.00",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "description": "Personal productivity and habit tracking system to build better habits, measure what matters, and stay accountable.",
            "operatingSystem": "Web, iOS, Android",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "127"
            }
          })
        }}
      />

      {/* Header with Sign In */}
      <div className="absolute top-8 right-8 z-10">
        <Link href="/login">
          <button className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors">
            Sign In →
          </button>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="space-y-8 mb-32">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Est. 2025
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Stop wondering if you're making progress. See exactly where you stand, every single day.
            </p>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <LandingCTA />
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <DollarSign className="h-4 w-4" />
              <span className="font-mono">One-time payment of $19</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-24">
          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Track your daily routines and watch your consistency improve. No more guessing—just clear data on what's working.
            </p>
          </div>

          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Sleep, exercise, productivity—track anything you want to improve. See trends over time and make better decisions.
            </p>
          </div>

          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              One look at your dashboard tells you if you're on track. Red or green—it's that simple.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="max-w-4xl mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Built for People Who Want to Improve
            </h2>
            <p className="text-gray-600 dark:text-slate-400 font-light">
              Join others who are taking control of their daily progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-serif font-light text-gray-900 dark:text-white">127+</div>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">Active Users</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-serif font-light text-gray-900 dark:text-white">4.9/5</div>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">User Rating</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-serif font-light text-gray-900 dark:text-white">12k+</div>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">Habits Tracked</p>
            </div>
          </div>
        </div>

        {/* Why It Works */}
        <div className="max-w-4xl mb-24">
          <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-light text-gray-900 dark:text-white mb-6">
              Why Human Operations Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">AI-Powered Setup</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                    Get started in minutes. Our AI helps you define your operations, goals, and metrics based on your unique situation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Visual Progress Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                    Red or green. One glance at your dashboard tells you exactly where you stand today.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">Lifetime Access</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                    One payment, lifetime access. No subscriptions, no recurring fees. $19 and it's yours forever.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mb-24">
          <h2 className="text-3xl font-serif font-light text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">What makes this different from other habit trackers?</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Human Operations is a complete life operating system, not just a habit tracker. It combines habits, metrics, goals, and time management into one cohesive system. Plus, our AI helps you set it up based on your unique goals.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Is there a subscription fee?</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                No! Human Operations is a one-time payment of $19 for lifetime access. No monthly fees, no hidden costs, no surprises.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">How long does setup take?</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                With our AI-powered onboarding, you can have your complete system set up in about 5-10 minutes. Answer a few questions, review the AI's suggestions, and you're ready to start tracking.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Can I use it on my phone?</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Yes! Human Operations is a Progressive Web App (PWA) that works on any device. Install it on your phone for a native app-like experience, or use it directly in your browser.
              </p>
            </div>

            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">What if I need help?</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                We're here to help! The app includes a guided tour, and you can reach us anytime through our support channels. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="max-w-4xl mb-20">
          <div className="bg-gradient-to-br from-amber-100/50 to-amber-50/30 dark:from-slate-900 dark:to-slate-800 border border-amber-800/20 dark:border-slate-700 p-12 text-center shadow-lg">
            <h2 className="text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-300 mb-8 font-light max-w-2xl mx-auto">
              Stop wondering if you're making progress. Start seeing it, every single day.
            </p>
            <div className="flex flex-col items-center gap-4">
              <LandingCTA />
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-light">5-min setup</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-light">$19 one-time</span>
                </div>
                <span>•</span>
                <span className="font-light">Lifetime access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center pb-12">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
