"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, TrendingUp, Clock } from "lucide-react";
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

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="space-y-10 mb-24 md:mb-32">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Your Life Operating System
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 dark:text-slate-100 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Stop wondering if you're making progress. See exactly where you stand, every single day.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed pl-4">
              An AI-powered personal dashboard that transforms your goals into a systematic tracking system. Get clarity, build consistency, and make data-driven decisions about your life.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 pl-1">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-light">Free to start • $19 one-time payment</span>
            </div>
          </div>

          {/* Trust Indicator */}
          <div className="pt-6 border-t border-gray-200 dark:border-slate-800 max-w-2xl">
            <p className="text-xs font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase mb-3">
              Built With
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-slate-400">
              <span className="px-2 py-1 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-sm font-mono">AI-Powered Setup</span>
              <span className="px-2 py-1 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-sm font-mono">Real-Time Tracking</span>
              <span className="px-2 py-1 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 rounded-sm font-mono">Data Privacy First</span>
            </div>
          </div>
        </div>

        {/* Problem/Solution Section */}
        <div className="mb-24 max-w-4xl">
          <div className="bg-white/80 dark:bg-slate-900/70 border-2 border-gray-300 dark:border-slate-800 p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white mb-6">
              The Problem with Personal Productivity
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-slate-300 leading-relaxed">
              <p className="text-base">
                You have goals. You want to build better habits. You know what matters—sleep, exercise, deep work, relationships. But tracking everything manually is exhausting, and most apps are either too simple or overwhelming with features you don't need.
              </p>
              <p className="text-base font-medium text-gray-900 dark:text-white">
                Human Operations gives you a personalized system in minutes, not hours. AI designs your tracking dashboard based on your goals, and you get instant clarity on your progress every single day.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid - Enhanced */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-12 text-center">
            Your Progress, Quantified
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
                <Target className="h-5 w-5 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Track your daily routines with boolean flags and watch your consistency improve. No more guessing—just clear data on what's working and what needs attention.
              </p>
              <div className="pt-2">
                <p className="text-xs font-mono text-gray-500 dark:text-slate-500">→ Daily check-ins in seconds</p>
              </div>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
                <TrendingUp className="h-5 w-5 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Sleep hours, workout sessions, deep work time, water intake—track any metric you want to improve. See trends over time, spot patterns, and make better decisions based on real data.
              </p>
              <div className="pt-2">
                <p className="text-xs font-mono text-gray-500 dark:text-slate-500">→ Custom metrics for your goals</p>
              </div>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
                <Clock className="h-5 w-5 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                One look at your dashboard tells you if you're on track. Red or green—it's that simple. No complex charts or confusing metrics, just instant clarity on your daily performance.
              </p>
              <div className="pt-2">
                <p className="text-xs font-mono text-gray-500 dark:text-slate-500">→ Visual feedback you understand</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-12 text-center">
            Get Started in Minutes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-slate-800 border-2 border-amber-800/30 dark:border-slate-700 text-amber-900 dark:text-amber-500 font-mono text-lg font-medium">
                1
              </div>
              <h4 className="font-serif font-medium text-gray-900 dark:text-white">Tell AI Your Goals</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Have a conversation about what you want to track and improve in your life
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-slate-800 border-2 border-amber-800/30 dark:border-slate-700 text-amber-900 dark:text-amber-500 font-mono text-lg font-medium">
                2
              </div>
              <h4 className="font-serif font-medium text-gray-900 dark:text-white">Get Your System</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                AI generates a personalized dashboard with habits, metrics, and goals tailored to you
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-slate-800 border-2 border-amber-800/30 dark:border-slate-700 text-amber-900 dark:text-amber-500 font-mono text-lg font-medium">
                3
              </div>
              <h4 className="font-serif font-medium text-gray-900 dark:text-white">Track Daily</h4>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Log your data in seconds and see your progress visualized in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center space-y-6 py-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white">
            Ready to Take Control?
          </h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 font-light max-w-2xl mx-auto">
            Join people who have stopped guessing and started measuring. Build your personalized system today.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg"
            >
              Start Building Your System
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-gray-500 dark:text-slate-500 font-light">
            No credit card required to start • 5 free actions to try it out
          </p>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-slate-800 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
