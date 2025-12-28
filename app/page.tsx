"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Target, TrendingUp, CheckCircle2, Clock, Brain } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
              Personal Performance Dashboard
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl text-gray-800 dark:text-slate-200 max-w-2xl leading-relaxed font-normal border-l-2 border-amber-800/40 dark:border-slate-700 pl-4">
              Transform your daily actions into measurable progress. Track habits, visualize metrics, and achieve your goals with data-driven clarity.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <span>No complex setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <span>Visual insights</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                <span>Daily accountability</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-sm font-mono text-sm tracking-wide uppercase border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-20 py-16 border-y border-gray-200 dark:border-slate-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Why Human Operations?
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Most productivity apps overwhelm you with features you don't need. We focus on what matters: simple tracking, clear metrics, and actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-100 to-amber-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                <Target className="h-8 w-8 text-amber-800 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Crystal Clear Goals</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Set specific, measurable targets and see your progress at a glance. No ambiguity, no confusion—just results.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-blue-800 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Real-Time Analytics</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Beautiful charts and trends show exactly what's working. Make informed decisions backed by your own data.
              </p>
            </div>

            <div className="space-y-4 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-green-200 dark:from-slate-800 dark:to-slate-700 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-800 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Consistent Progress</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Build momentum with daily check-ins. Small wins compound into major life improvements over time.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive system designed to help you track, analyze, and optimize every aspect of your personal performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="space-y-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 dark:bg-slate-800 rounded flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-800 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Habit Tracking</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed pl-13">
                Build consistency with daily habit tracking. Mark completion, track streaks, and visualize your commitment over time. Perfect for morning routines, exercise, meditation, and more.
              </p>
            </div>

            <div className="space-y-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-slate-800 rounded flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-800 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Custom Metrics</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed pl-13">
                Track anything quantifiable: sleep hours, steps walked, pages read, calories consumed. Define your own metrics and watch trends emerge over weeks and months.
              </p>
            </div>

            <div className="space-y-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-slate-800 rounded flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-800 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Goal Management</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed pl-13">
                Break down big ambitions into actionable tasks. Set deadlines, track progress, and celebrate achievements. Stay focused on what truly moves the needle.
              </p>
            </div>

            <div className="space-y-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-slate-800 rounded flex items-center justify-center">
                  <Brain className="h-5 w-5 text-purple-800 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Smart Dashboard</h3>
              </div>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed pl-13">
                One unified view shows your entire day at a glance. Color-coded status indicators, progress bars, and trend charts provide instant clarity on your performance.
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mb-20 py-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-amber-500 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl font-serif font-light italic text-gray-800 dark:text-slate-200 mb-4">
                "Finally, a productivity system that doesn't feel like work. I can see my progress every day, and it keeps me motivated."
              </blockquote>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-mono tracking-wider uppercase">
                — Early Beta User
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-12 py-16 text-center bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-amber-200 dark:border-slate-700">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Daily Performance?
          </h2>
          <p className="text-lg text-gray-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join others who are turning intentions into measurable results. Start tracking today—it's completely free to begin.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-10 h-14 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs text-gray-600 dark:text-slate-500 mt-4 font-mono tracking-wider">
            No credit card required • Set up in under 2 minutes
          </p>
        </div>

        {/* Footer tagline */}
        <div className="mt-12 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified & Optimized
          </p>
        </div>
      </main>
    </div>
  );
}
