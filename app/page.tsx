"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Target, Clock } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header with Sign In */}
      <div className="absolute top-8 right-8 z-10">
        <Link href="/login">
          <button className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors">
            Sign In →
          </button>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {/* Hero Section */}
        <div className="space-y-10 mb-24 text-center max-w-4xl mx-auto">
          <div className="inline-block">
            <div className="px-4 py-1.5 bg-amber-100/60 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-full text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              The Operating System for Your Life
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              Transform Intentions
              <br />
              <span className="font-medium italic bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-400 dark:to-amber-600 bg-clip-text text-transparent">Into Results</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Stop wondering if you're making progress. Human Operations gives you clarity, accountability, and the data-driven insights you need to achieve your goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-14 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-gray-600 dark:text-slate-400 font-mono">
              No credit card required
            </p>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 text-sm font-mono text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Privacy-First</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Works Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Your Data, Your Control</span>
            </div>
          </div>
        </div>

        {/* Value Proposition - Problem/Solution */}
        <div className="mb-32 max-w-5xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-gray-200 dark:border-slate-800 rounded-lg p-8 md:p-12 shadow-sm backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-6 text-center">
              The Challenge of Self-Improvement
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-4">
                <h3 className="text-lg font-mono text-red-700 dark:text-red-400 uppercase tracking-wider">Without a System</h3>
                <ul className="space-y-3 text-gray-700 dark:text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Goals fade away after a few weeks</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>No visibility into what's actually working</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Inconsistent habits and wasted potential</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Feeling overwhelmed by scattered tools</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-mono text-green-700 dark:text-green-400 uppercase tracking-wider">With Human Operations</h3>
                <ul className="space-y-3 text-gray-700 dark:text-slate-300">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Crystal-clear progress tracking every day</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Data-driven insights on your performance</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Sustainable habits that compound over time</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <span>One unified system for everything that matters</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Everything You Need to Win
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A complete system designed to turn your goals into measurable, achievable outcomes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4 bg-white/80 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-lg backdrop-blur-sm">
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-800 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Habit Tracking</h3>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Build consistency with visual streaks and completion rates. See exactly which habits are sticking and which need attention.
              </p>
            </div>

            <div className="space-y-4 bg-white/80 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-lg backdrop-blur-sm">
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-800 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Metrics Dashboard</h3>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Track custom metrics like sleep quality, exercise, mood, or productivity. Visualize trends and identify patterns over time.
              </p>
            </div>

            <div className="space-y-4 bg-white/80 dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-lg backdrop-blur-sm">
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-800 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Daily Operations</h3>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                Start each day with a clear view: green means on track, red means needs attention. No guessing, just action.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-32 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Simple. Powerful. Effective.
            </h2>
            <p className="text-xl text-gray-600 dark:text-slate-400">
              Get started in under 5 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif font-bold text-white dark:text-gray-900">1</span>
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Define Your Goals</h3>
              <p className="text-gray-600 dark:text-slate-400">
                Set up the habits and metrics that matter to you. Health, productivity, relationships—track it all.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif font-bold text-white dark:text-gray-900">2</span>
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Track Daily</h3>
              <p className="text-gray-600 dark:text-slate-400">
                Spend 2 minutes each day logging your progress. Quick, simple, and becomes second nature.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif font-bold text-white dark:text-gray-900">3</span>
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">See Results</h3>
              <p className="text-gray-600 dark:text-slate-400">
                Watch your consistency improve. Make data-driven decisions. Achieve more than you thought possible.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-slate-900 dark:to-slate-800 rounded-xl p-12 md:p-16 text-center shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the people who are building better versions of themselves, one day at a time.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_bottom_clicked', {})}>
            <Button
              size="lg"
              className="group bg-white hover:bg-gray-100 text-gray-900 px-8 h-14 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-sm text-gray-400 mt-6 font-mono">
            Free tier available forever • Upgrade only if you love it
          </p>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
