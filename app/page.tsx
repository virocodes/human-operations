"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Target, Calendar } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Header with Sign In */}
      <div className="absolute top-8 right-8 z-10">
        <Link href="/login">
          <button className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors">
            Sign In →
          </button>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="space-y-8 mb-24 md:mb-32">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/60 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Science-Backed Personal Analytics
            </div>
          </div>

          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              Turn Your Life Into
              <br />
              <span className="font-medium italic bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">A System That Works</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light">
              Stop wondering if you're making progress. Track what matters, see real trends, and build the habits that transform your life.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <span>Data stays private</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { type: 'primary' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" onClick={() => trackEvent('landing_cta_clicked', { type: 'secondary' })}>
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                View Demo
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              The Only Self-Tracking System You'll Actually Use
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Designed for real people who want results without complexity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl">
            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-amber-700 dark:text-amber-500 uppercase font-medium">Step 01</div>
                <TrendingUp className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Track Daily Metrics</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Log habits, moods, sleep, exercise—anything you want to improve. Takes less than 60 seconds per day with our streamlined interface.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-amber-700 dark:text-amber-500 uppercase font-medium">Step 02</div>
                <Calendar className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">See Your Patterns</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Visual dashboards show your trends instantly. Discover what's working and what's holding you back with color-coded clarity.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-amber-700 dark:text-amber-500 uppercase font-medium">Step 03</div>
                <Target className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Optimize & Improve</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Make data-driven decisions about your life. Set goals, track progress, and watch as small improvements compound over time.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Why People Choose Human Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Actually Simple To Use</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                No complicated spreadsheets or manual calculations. Log your day in seconds, get insights instantly. The fastest way to track your life.
              </p>
            </div>

            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Fully Customizable</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Track what matters to you. Create custom metrics, set your own goals, and design a system that fits your unique lifestyle.
              </p>
            </div>

            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Your Data, Your Privacy</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                End-to-end encryption keeps your personal data private. We never sell your information or show you ads. Your metrics stay yours.
              </p>
            </div>

            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">See Real Results</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Users report 2.5x improvement in habit consistency within 30 days. Visual feedback keeps you motivated and on track, every single day.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="text-center py-16 px-6 bg-gradient-to-r from-amber-100/40 to-amber-50/40 dark:from-slate-900/50 dark:to-slate-800/50 border border-amber-200/50 dark:border-slate-800 rounded-sm">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of people who've turned their lives into systems that actually work.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { type: 'final' })}>
            <Button
              size="lg"
              className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-4">
            No credit card required • Start tracking in under 2 minutes
          </p>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified • Built for Progress
          </p>
        </div>
      </main>
    </div>
  );
}
