"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, Target, Zap } from "lucide-react";
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
        <div className="space-y-8 mb-24">
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
            <p className="text-xl md:text-2xl text-gray-900 dark:text-white max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The personal operating system for people who are serious about self-improvement.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed pl-4">
              Stop wondering if you're making progress. Track habits, measure metrics, and see exactly where you stand—every single day. Finally understand what's working and what's not.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-slate-400 font-mono mt-2 sm:mt-0 sm:ml-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mb-24 p-8 bg-white/80 dark:bg-slate-900/70 border border-gray-300 dark:border-slate-800 rounded-sm shadow-sm max-w-4xl">
          <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
            Most people fail at self-improvement because they can't track what they can't see.
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
            You set goals with good intentions. You try new habits. But weeks later, you're not sure if you're actually making progress or just spinning your wheels.
          </p>
          <p className="text-gray-900 dark:text-white font-medium">
            Human Operations gives you the clarity you've been missing. A single dashboard that shows you the truth about your daily performance.
          </p>
        </div>

        {/* Value Props - Enhanced */}
        <div className="mb-24">
          <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-12 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Step I.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Define Your Habits</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Set up the daily habits you want to build—meditation, exercise, writing, or anything else. Takes 2 minutes to configure.
              </p>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center mb-2">
                <CheckCircle2 className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Step II.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Track Daily Progress</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Check in each day with simple yes/no tracking. Add custom metrics like sleep hours, workout duration, or productivity scores.
              </p>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center mb-2">
                <BarChart3 className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Step III.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">See Clear Insights</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                View your streak counters, completion rates, and trend charts. Red or green indicators show you at a glance if you're on track.
              </p>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="mb-24 p-8 bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-sm shadow-sm max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-6 text-center">
            What You Get
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Streak tracking that motivates</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Watch your consistency build day by day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Custom metrics for anything</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">Track sleep, workouts, mood, or whatever matters to you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Historical data & trends</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">See patterns emerge over weeks and months</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Simple, focused interface</p>
                <p className="text-sm text-gray-600 dark:text-slate-400">No clutter, no distractions—just what you need</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-sm">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <p className="text-sm text-gray-700 dark:text-slate-300 font-mono">
              Join high-performers who track their progress systematically
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-16 text-center space-y-6 p-12 bg-gray-900 dark:bg-white rounded-sm">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-white dark:text-slate-950">
            Ready to take control of your habits?
          </h2>
          <p className="text-gray-300 dark:text-slate-600 max-w-2xl mx-auto">
            Start tracking today. No setup fees, no complicated onboarding—just a simple system that works.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'footer' })}>
            <Button
              size="lg"
              className="group bg-white hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-gray-900 dark:text-white px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Footer tagline */}
        <div className="text-center border-t border-gray-300 dark:border-slate-800 pt-8">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase mb-2">
            Your Life, Quantified
          </p>
          <p className="text-xs text-gray-500 dark:text-slate-600">
            Built for people who believe data drives improvement
          </p>
        </div>
      </main>
    </div>
  );
}
