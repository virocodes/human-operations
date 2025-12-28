"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Target, TrendingUp, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
            <p className="text-xl text-gray-800 dark:text-slate-200 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Your personal operating system for life. Track what matters, build better habits, and achieve your goals with data-driven clarity.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Stop wondering if you're making progress. Get instant visual feedback on your daily habits, metrics, and goals—all in one intelligent dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 font-mono">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>$19 one-time • No subscription • Lifetime access</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mb-20 max-w-4xl bg-amber-50/50 dark:bg-slate-900/30 border-l-4 border-amber-600 dark:border-amber-700 p-8">
          <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
            The Problem with Progress
          </h2>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
            You set goals. You start habits. You track metrics in scattered apps, notebooks, and spreadsheets. But when someone asks "How are you doing?", you can't give a clear answer.
          </p>
          <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-gray-900 dark:text-white">Human Operations solves this.</strong> It's your unified command center—designed to give you complete clarity on your life's progress in seconds, not hours.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-12 text-center">
            Everything You Need to Operate at Your Best
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Track daily routines with simple check-ins. See your consistency streaks and patterns. Red/green status indicators show you instantly if you're on track—no analysis needed.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Sleep, exercise, productivity, mood—track any metric that drives your success. Set targets, view trends over time, and make data-backed decisions about what's working.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Stay Accountable Daily</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                One glance at your dashboard tells you everything. Visual indicators, progress bars, and trend graphs give you the accountability you need to stay consistent.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-medium text-gray-900 dark:text-white mb-12 text-center">
            Get Started in Minutes
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-sm flex items-center justify-center font-mono text-sm">
                1
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">
                  AI Builds Your System
                </h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                  Chat with Claude AI during onboarding. Describe your goals and routines—the system generates a personalized dashboard with habits, metrics, and goals tailored to you.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-sm flex items-center justify-center font-mono text-sm">
                2
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">
                  Track Daily in Seconds
                </h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                  Each morning or evening, check in with your habits and log your metrics. It takes less than 2 minutes to update everything—no complexity, just quick data entry.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-sm flex items-center justify-center font-mono text-sm">
                3
              </div>
              <div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-2">
                  See Your Progress Clearly
                </h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                  Your dashboard updates in real-time with color-coded status indicators. Green means on track, red means attention needed. No guesswork—just clear, actionable feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing CTA */}
        <div className="mb-20 max-w-4xl mx-auto bg-gray-900 dark:bg-white text-white dark:text-slate-950 p-12 shadow-lg text-center">
          <h2 className="text-3xl font-serif font-medium mb-4">
            One Price. Lifetime Access.
          </h2>
          <p className="text-lg mb-8 opacity-90">
            No subscriptions. No hidden fees. Pay once, own it forever.
          </p>
          <div className="text-5xl font-serif font-medium mb-8">
            $19
            <span className="text-xl font-light opacity-75"> one-time</span>
          </div>
          <div className="space-y-3 mb-10 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Unlimited habits, metrics, and goals</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>AI-generated personalized system</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Desktop and mobile optimized</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span>Lifetime updates and support</span>
            </div>
          </div>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_bottom_clicked', {})}>
            <Button
              size="lg"
              className="group bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-gray-900 dark:text-white px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Footer tagline */}
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase mb-2">
            Your Life, Quantified
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-700">
            Built for people who want clarity, not complexity
          </p>
        </div>
      </main>
    </div>
  );
}
