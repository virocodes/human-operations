"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Target, TrendingUp, CheckCircle2, Calendar, Activity } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30 dark:bg-slate-950">
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
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The personal operating system for high-performers who refuse to leave their progress to chance.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Track habits, measure metrics, and visualize your growth with a system that reveals exactly where you stand—every single day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-sm font-mono text-sm tracking-wide uppercase border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-900"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white dark:border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white dark:border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white dark:border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white dark:border-slate-950"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Trusted by high-performers tracking <span className="font-semibold text-gray-900 dark:text-white">10,000+</span> daily operations
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-24">
          <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-900 dark:text-amber-500" />
            </div>
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
            <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
              Track your daily routines and watch your consistency improve. No more guessing—just clear data on what's working. Set goals, create streaks, and build momentum.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Daily habit tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Streak visualization
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Custom scheduling
              </li>
            </ul>
          </div>

          <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-amber-900 dark:text-amber-500" />
            </div>
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
            <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
              Sleep, exercise, productivity, health—track any metric you want to improve. See trends over time, spot patterns, and make data-driven decisions about your life.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Custom metrics tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Historical trend analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Performance insights
              </li>
            </ul>
          </div>

          <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-900 dark:text-amber-500" />
            </div>
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
            <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
              One look at your dashboard tells you if you're on track. Red or green—it's that simple. Visual indicators keep you honest and motivated to maintain your standards.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-500">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Visual status dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Instant progress feedback
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-800 dark:text-amber-600" />
                Goal achievement tracking
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A simple, systematic approach to personal growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <div className="relative">
              <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 h-full">
                <div className="text-3xl font-serif font-light text-amber-800 dark:text-amber-600 mb-4">01</div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-3">Define Your System</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm leading-relaxed">
                  Set up the habits and metrics that matter to you. Whether it's exercise, reading, sleep quality, or work output—customize everything to match your goals.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 h-full">
                <div className="text-3xl font-serif font-light text-amber-800 dark:text-amber-600 mb-4">02</div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-3">Track Daily</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm leading-relaxed">
                  Log your habits and metrics each day in minutes. The interface is designed for speed—no friction, no complexity, just consistent data capture.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 h-full">
                <div className="text-3xl font-serif font-light text-amber-800 dark:text-amber-600 mb-4">03</div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-3">Measure Progress</h3>
                <p className="text-gray-700 dark:text-slate-400 text-sm leading-relaxed">
                  View your trends, analyze patterns, and watch your consistency compound over time. See exactly what's working and what needs adjustment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Built for Achievers
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Whether you're optimizing health, career, or personal growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            <div className="bg-gradient-to-br from-white/80 to-amber-50/40 dark:from-slate-900/60 dark:to-slate-800/40 border border-gray-300 dark:border-slate-800 p-8">
              <Calendar className="w-10 h-10 text-amber-800 dark:text-amber-600 mb-4" />
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-3">For Entrepreneurs</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed mb-4">
                Track your deep work hours, revenue metrics, networking activities, and energy levels. Know exactly how your daily operations impact your business growth.
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-500 italic">
                "I finally have clarity on which activities actually move my business forward."
              </p>
            </div>

            <div className="bg-gradient-to-br from-white/80 to-amber-50/40 dark:from-slate-900/60 dark:to-slate-800/40 border border-gray-300 dark:border-slate-800 p-8">
              <Activity className="w-10 h-10 text-amber-800 dark:text-amber-600 mb-4" />
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-3">For Athletes</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed mb-4">
                Monitor training consistency, sleep quality, nutrition adherence, and recovery metrics. Optimize your performance through systematic measurement.
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-500 italic">
                "My training became 10x more effective when I started tracking recovery properly."
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-amber-100/50 to-amber-50/30 dark:from-slate-900 dark:to-slate-800 border border-amber-800/20 dark:border-slate-700 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
            Your Future Self Will Thank You
          </h2>
          <p className="text-lg text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Stop leaving your progress to chance. Start building a system that compounds daily into extraordinary results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_bottom_clicked', {})}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-500 mt-6">
            Free to start. No credit card required.
          </p>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified & Optimized
          </p>
        </div>
      </main>
    </div>
  );
}
