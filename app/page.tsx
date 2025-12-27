"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, BarChart3, Calendar, TrendingUp, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-y-auto bg-amber-50/30 dark:bg-slate-950">
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
        <div className="space-y-8 mb-20">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Personal Operations System
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The complete system for tracking habits, metrics, and goals.
              <span className="block mt-2 text-lg">Stop wondering if you're making progress—see exactly where you stand, every day.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { cta_location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-sm font-mono text-sm tracking-wide uppercase border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors cursor-pointer w-full sm:w-auto"
              >
                See How It Works
              </Button>
            </Link>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div className="mb-24 max-w-4xl">
          <div className="bg-white/80 dark:bg-slate-900/80 border-2 border-gray-900 dark:border-white p-8 md:p-12 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white mb-6">
              Your Personal Command Center
            </h2>
            <p className="text-base md:text-lg text-gray-700 dark:text-slate-300 leading-relaxed mb-6">
              Human Operations gives you a bird's-eye view of your life's most important metrics. Track daily habits, monitor key metrics like sleep and nutrition, set meaningful goals, and manage your tasks—all in one powerful, elegant interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-slate-300">Color-coded feedback shows what's working at a glance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-slate-300">Customizable targets keep you accountable to your goals</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-slate-300">Historical views reveal patterns and trends over time</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-gray-900 dark:text-white mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700 dark:text-slate-300">Clean, distraction-free design keeps you focused</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Everything You Need to <span className="font-medium italic">Optimize Your Life</span>
            </h2>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive toolkit designed for people who want to improve themselves systematically
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Daily Habits */}
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-sm">
                  <CheckCircle2 className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Daily Habits</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Build consistency with simple checkbox tracking. See your streak counts and completion rates. Perfect for meditation, exercise, reading, and any daily routine you want to cement.
              </p>
            </div>

            {/* Metrics Tracking */}
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-sm">
                  <BarChart3 className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Numeric Metrics</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Track any measurable value: sleep hours, calories, workouts, revenue, study time. Set optimal and minimum targets—cells turn green when you hit your goals, yellow for acceptable, red when you're off track.
              </p>
            </div>

            {/* Goals & Operations */}
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-sm">
                  <Target className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Goals & Operations</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Set meaningful goals and link them to your habits and metrics. See real-time progress toward your objectives. Break down big ambitions into daily operations that compound over time.
              </p>
            </div>

            {/* Task Management */}
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-900 dark:bg-white rounded-sm">
                  <Calendar className="h-6 w-6 text-white dark:text-gray-900" />
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Smart Scheduling</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Plan your day with time-based task scheduling. Set your wake and sleep times, add todos with hour estimates, and see your day laid out visually. Stay organized and focused on what matters.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Simple to Use, <span className="font-medium italic">Powerful in Practice</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6 items-start bg-white/40 dark:bg-slate-900/40 border border-gray-300 dark:border-slate-800 p-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-mono font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Add Your Habits & Metrics</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm leading-relaxed">
                  Start by defining what you want to track. Add daily habits (checkbox items) and numeric metrics (values with targets). Organize metrics into categories like Health, Productivity, or Finance.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start bg-white/40 dark:bg-slate-900/40 border border-gray-300 dark:border-slate-800 p-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-mono font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Log Daily Data</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm leading-relaxed">
                  Each day, check off completed habits and enter metric values. The interface shows the last 7 days at a glance, so you can spot trends instantly. Color coding gives you immediate feedback on your progress.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start bg-white/40 dark:bg-slate-900/40 border border-gray-300 dark:border-slate-800 p-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center font-mono font-bold">
                3
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">Watch Yourself Improve</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm leading-relaxed">
                  View your dashboard to see completion percentages, streaks, and overall progress. Access historical views to analyze longer-term patterns. Use insights to adjust your routines and optimize your performance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof / Benefits */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8">
              <TrendingUp className="h-10 w-10 text-gray-900 dark:text-white mx-auto mb-4" />
              <div className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-2">Data-Driven</div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Make decisions based on real patterns, not guesses</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8">
              <Zap className="h-10 w-10 text-gray-900 dark:text-white mx-auto mb-4" />
              <div className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-2">Instant Clarity</div>
              <p className="text-sm text-gray-600 dark:text-slate-400">See your entire life's status in seconds, not hours</p>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8">
              <Target className="h-10 w-10 text-gray-900 dark:text-white mx-auto mb-4" />
              <div className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-2">Goal-Oriented</div>
              <p className="text-sm text-gray-600 dark:text-slate-400">Every metric ties back to what you want to achieve</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-12 md:p-16 border-2 border-gray-900 dark:border-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
              Ready to Take <span className="font-medium italic">Control</span>?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Start tracking what matters. Build better habits. Achieve your goals.
            </p>
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { cta_location: 'final' })}>
              <Button
                size="lg"
                className="group bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-xs font-mono tracking-wider opacity-75 mt-6 uppercase">
              Free Trial • No Credit Card Required
            </p>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase mb-2">
            Your Life, Quantified
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-700">
            © 2025 Human Operations. Track smarter, live better.
          </p>
        </div>
      </main>
    </div>
  );
}
