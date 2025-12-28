"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, Target, TrendingUp, Clock, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
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
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Est. 2025
            </div>
          </div>

          <div className="space-y-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Transform Your Daily Habits Into
              <br />
              <span className="font-medium italic bg-gradient-to-r from-amber-700 to-amber-900 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">Measurable Progress</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-slate-300 max-w-3xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-6">
              The personal operations system for ambitious people who want to <strong className="font-medium text-gray-900 dark:text-white">stop guessing</strong> and start <strong className="font-medium text-gray-900 dark:text-white">seeing real results</strong>.
            </p>

            {/* Value Props - Quick Bullets */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Track habits & metrics</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Visual progress dashboard</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Data-driven insights</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { position: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-14 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 rounded-sm font-mono text-sm tracking-wide uppercase"
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                trackEvent('landing_learn_more_clicked', {});
              }}
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Problem Section */}
        <div className="mb-24 md:mb-32 max-w-4xl mx-auto">
          <div className="bg-amber-50/50 dark:bg-slate-900/30 border border-amber-200/50 dark:border-slate-800 p-8 md:p-12 rounded-sm">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-6">
              You're Working Hard. But Are You Actually <span className="italic font-medium">Improving</span>?
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-slate-300 leading-relaxed">
              <p className="text-lg">
                Most people set goals and track habits in their head—or worse, in scattered apps and notes. The result? No clear picture of progress, inconsistent follow-through, and the nagging feeling that you could be doing better.
              </p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Human Operations gives you a single source of truth for your personal performance.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-24 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Simple System. <span className="italic font-medium">Powerful Results</span>.
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              No complicated setup. No overwhelming features. Just what you need to track, measure, and improve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Step 1</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Define Your Habits</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Add the daily habits and metrics that matter to you. Exercise, sleep, deep work, meditation—track anything quantifiable.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm">
                <Clock className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Step 2</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Log Daily Progress</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Quick daily check-ins (2-3 minutes max). Mark habits complete and log your key metrics. Simple, fast, consistent.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm">
                <BarChart3 className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Step 3</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">See Your Trends</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Watch your consistency streaks grow. Spot patterns. Make data-driven decisions about what's actually working.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits with Icons */}
        <div className="mb-24 md:mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Why Human Operations?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-sm flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-700 dark:text-green-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Instant Visibility</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                  See at a glance if you're hitting your targets. Red/yellow/green indicators show exactly where you stand—no analysis required.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-sm flex items-center justify-center">
                  <Zap className="h-6 w-6 text-blue-700 dark:text-blue-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Built for Busy People</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                  No time-consuming journaling. Quick daily inputs (2-3 min) give you all the data you need without the overhead.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-sm flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-700 dark:text-purple-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Fully Customizable</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                  Track what matters to you. Whether it's workouts, creative output, or daily reading—set your own habits and metrics.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-sm flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-amber-700 dark:text-amber-500" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Long-Term Insights</h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                  Historical data shows how you're improving over weeks and months. Identify patterns and optimize your routines.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof / Stats */}
        <div className="mb-24 md:mb-32 bg-gray-900 dark:bg-slate-800 text-white -mx-6 px-6 py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                Join High Performers Who Track Their Progress
              </h2>
              <p className="text-gray-300 dark:text-slate-400 text-lg">
                The difference between intention and achievement is measurement.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-serif font-light text-amber-400">2 min</div>
                <div className="text-sm font-mono tracking-wider text-gray-400 uppercase">Daily Time Investment</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-serif font-light text-amber-400">100%</div>
                <div className="text-sm font-mono tracking-wider text-gray-400 uppercase">Clarity on Progress</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-serif font-light text-amber-400">∞</div>
                <div className="text-sm font-mono tracking-wider text-gray-400 uppercase">Customizable Metrics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-6">
            Start Building Your <span className="italic font-medium">Personal Operating System</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-slate-300 mb-8 leading-relaxed">
            Stop wondering if you're making progress. Get the clarity and accountability you need to actually achieve your goals.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { position: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-10 h-16 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-slate-500 mt-4 font-mono">
            No credit card required • Set up in under 5 minutes
          </p>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center border-t border-gray-200 dark:border-slate-800 pt-12">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
