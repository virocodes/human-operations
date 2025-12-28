"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950">
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
            <p className="text-xl md:text-2xl text-gray-800 dark:text-slate-200 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Transform uncertainty into clarity. Track your habits, measure your progress, and become the person you want to be.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Join thousands of high performers who use data-driven insights to build better habits, stay accountable, and achieve their goals.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
              <Button
                size="lg"
                className="group mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-xs text-gray-500 dark:text-slate-500">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-6 pt-8 border-t border-gray-200 dark:border-slate-800 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-slate-950"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white dark:border-slate-950"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white dark:border-slate-950"></div>
              </div>
              <span className="text-sm text-gray-700 dark:text-slate-300">5,000+ active users</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-slate-300">
              ⭐ 4.9/5 average rating
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-12 max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-3">
              Why Top Performers Choose Human Operations
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to take control of your personal growth in one elegant system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Track Effortlessly</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Log your habits in seconds with an intuitive interface designed for speed. No complex setup, no friction—just you and your progress.
              </p>
              <ul className="text-xs text-gray-600 dark:text-slate-500 space-y-1 pt-2">
                <li>✓ Quick daily check-ins</li>
                <li>✓ Custom habit definitions</li>
                <li>✓ Flexible tracking options</li>
              </ul>
            </div>

            <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Visualize Progress</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                See your consistency at a glance with powerful visualizations. Identify patterns, spot trends, and make data-backed decisions about your routine.
              </p>
              <ul className="text-xs text-gray-600 dark:text-slate-500 space-y-1 pt-2">
                <li>✓ Streak tracking & calendars</li>
                <li>✓ Trend analysis & insights</li>
                <li>✓ Performance metrics</li>
              </ul>
            </div>

            <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Stay Motivated</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Your dashboard shows exactly where you stand. Red means adjust, green means keep going. Simple feedback that drives real change.
              </p>
              <ul className="text-xs text-gray-600 dark:text-slate-500 space-y-1 pt-2">
                <li>✓ Clear visual feedback</li>
                <li>✓ Accountability reminders</li>
                <li>✓ Achievement milestones</li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-3">
              Get Started in Minutes
            </h2>
            <p className="text-gray-600 dark:text-slate-400">
              Three simple steps to transform your daily routine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-lg font-serif font-medium text-amber-900 dark:text-amber-400">1</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 dark:text-white">Define Your Habits</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Choose what you want to track—from sleep and exercise to deep work sessions
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-lg font-serif font-medium text-amber-900 dark:text-amber-400">2</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 dark:text-white">Log Daily</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Quick check-ins that take less than 2 minutes. Build the habit of tracking your habits
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="text-lg font-serif font-medium text-amber-900 dark:text-amber-400">3</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 dark:text-white">Watch Yourself Improve</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                See your consistency grow, identify patterns, and celebrate your progress
              </p>
            </div>
          </div>
        </div>

        {/* Secondary CTA */}
        <div className="mt-24 text-center space-y-6 max-w-2xl mx-auto pb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">
            Ready to Take Control?
          </h2>
          <p className="text-gray-600 dark:text-slate-400">
            Join the community of people who stopped guessing and started growing
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-500">
            No credit card required • 14-day free trial
          </p>
        </div>

        {/* Footer tagline */}
        <div className="pb-8 text-center border-t border-gray-200 dark:border-slate-800 pt-8">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
