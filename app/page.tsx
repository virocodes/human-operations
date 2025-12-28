"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart2, Calendar, Target, TrendingUp, Zap, Clock } from "lucide-react";
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
              Your Personal Performance System
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The all-in-one system to track habits, measure progress, and achieve your goals.
              Stop wondering if you're improving—see your growth in real-time with data-driven insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
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
          <div className="flex items-center gap-6 pt-4 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-light">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-light">5-minute setup</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-light">AI-powered insights</span>
            </div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div id="features" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Everything You Need to Optimize Your Life
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
              A comprehensive system that replaces multiple apps with one powerful dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mb-12">
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Daily Habit Tracking</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                Build consistency with visual habit tracking. See your streaks, identify patterns, and never miss a day.
                Track everything from meditation to workouts with simple check-ins.
              </p>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <BarChart2 className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Custom Metrics</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                Measure what matters to you. Track sleep quality, energy levels, productivity scores, or any custom metric.
                Visualize trends and correlations over time.
              </p>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Goal Management</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                Set meaningful goals and track progress automatically. Break down big objectives into actionable steps
                and celebrate milestones along the way.
              </p>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Visual Analytics</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                Get instant clarity with color-coded dashboards. Red means attention needed, green means you're winning.
                No analysis paralysis—just clear signals.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 bg-white/40 dark:bg-slate-900/30 border border-gray-300 dark:border-slate-800 p-12 rounded-sm">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Simple Setup, Powerful Results
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
              Get started in minutes with our AI-powered onboarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif font-medium text-white dark:text-slate-950">1</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Tell Us Your Goals</h3>
              <p className="text-gray-600 dark:text-slate-400 font-light text-sm">
                Share what you want to achieve. Our AI helps you define meaningful habits and metrics.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif font-medium text-white dark:text-slate-950">2</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Get Your Dashboard</h3>
              <p className="text-gray-600 dark:text-slate-400 font-light text-sm">
                We build a personalized system tailored to your life. No complex setup required.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-serif font-medium text-white dark:text-slate-950">3</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Track & Improve</h3>
              <p className="text-gray-600 dark:text-slate-400 font-light text-sm">
                Log daily progress in seconds. Watch patterns emerge and optimize your performance.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Comparison */}
        <div className="mb-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
                Why Human Operations?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-medium text-gray-500 dark:text-slate-500 mb-6">Without a System</h3>
                <div className="space-y-3">
                  {[
                    "Scattered tracking across multiple apps",
                    "No clear view of overall progress",
                    "Forgotten habits and abandoned goals",
                    "Guessing at what works",
                    "Inconsistent effort, inconsistent results"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-gray-600 dark:text-slate-500">
                      <span className="text-red-500 mt-1">✗</span>
                      <span className="font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-6 rounded-sm">
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-6">With Human Operations</h3>
                <div className="space-y-3">
                  {[
                    "Everything in one unified dashboard",
                    "Clear visual progress indicators",
                    "Automated reminders and tracking",
                    "Data-driven insights and patterns",
                    "Consistent improvement over time"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-gray-900 dark:text-white">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="font-light">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-12 text-center bg-gray-900 dark:bg-white p-12 rounded-sm">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white dark:text-slate-950 mb-4">
            Start Tracking Your Progress Today
          </h2>
          <p className="text-lg text-gray-300 dark:text-slate-700 mb-8 max-w-2xl mx-auto font-light">
            Join hundreds of people who are taking control of their personal growth with data-driven decision making.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-white hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-gray-900 dark:text-white px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-gray-400 dark:text-slate-600 font-light">
            No credit card required • 5-minute setup • Cancel anytime
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
