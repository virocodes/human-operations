"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Target, BarChart3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
              Professional Life Management
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The operating system for ambitious people who want to achieve more.
              Track habits, measure metrics, and visualize your progress—all in one elegant dashboard.
            </p>

            {/* Value Props */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>No setup required</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Data-driven insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                <span>Track unlimited metrics</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { button: 'primary' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" onClick={() => trackEvent('landing_cta_clicked', { button: 'secondary' })}>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-sm font-mono text-sm tracking-wide uppercase border-2 border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Problem/Solution Statement */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-100/30 to-amber-50/20 dark:from-slate-800/50 dark:to-slate-900/30 border border-amber-200 dark:border-slate-700 rounded-sm p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              You can't improve what you don't measure.
            </h2>
            <p className="text-gray-700 dark:text-slate-300 text-lg leading-relaxed mb-4">
              Most people have goals but no system to track progress. They rely on memory and intuition,
              leading to inconsistency and frustration. Human Operations gives you complete visibility
              into your daily performance so you can make informed decisions and achieve your goals faster.
            </p>
            <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
              Whether you're optimizing your health, building a business, or mastering a skill—our platform
              provides the clarity and accountability you need to succeed.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 dark:text-white mb-12 text-center">
            Everything you need to optimize your life
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <div className="h-12 w-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Habit Tracking</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Build consistency with daily habit tracking. Visual streaks and completion rates keep you motivated
                and accountable to your routines.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <div className="h-12 w-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Custom Metrics</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Track anything that matters to you—sleep hours, workout duration, revenue, study time.
                Unlimited custom metrics with flexible input types.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <div className="h-12 w-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Visual Progress</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                See your progress at a glance with color-coded indicators. Red means behind target,
                green means on track. Simple, clear, actionable.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <div className="h-12 w-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Daily Operations</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Complete daily check-ins in under 2 minutes. Quick input forms and smart defaults
                make tracking effortless and consistent.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <div className="h-12 w-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Historical Analysis</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Review your complete history with powerful analytics. Identify patterns, spot trends,
                and understand what drives your success.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow rounded-sm">
              <div className="h-12 w-12 rounded-sm bg-amber-100 dark:bg-slate-800 flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Goal Management</h3>
              <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                Set targets for each metric and track progress automatically. Stay focused on what
                matters most with prioritized goal tracking.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof / Stats */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white">2min</div>
              <div className="text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider font-mono">Daily Check-in</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white">∞</div>
              <div className="text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider font-mono">Custom Metrics</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white">100%</div>
              <div className="text-sm text-gray-600 dark:text-slate-400 uppercase tracking-wider font-mono">Your Data</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-16 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-slate-900 dark:to-slate-800 rounded-sm shadow-xl">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-white mb-4">
            Ready to take control?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join ambitious individuals who are using data to achieve their goals faster.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { button: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-white hover:bg-gray-100 text-gray-900 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started—It's Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
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
