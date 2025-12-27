"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, TrendingUp, CheckCircle2, BarChart3, Calendar, Zap } from "lucide-react";
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
        <div className="space-y-8 mb-24">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              The All-in-One Human System
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 dark:text-slate-200 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The personal operating system for high performers. Track everything that matters, see your progress at a glance, and build the life you actually want.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed pl-4">
              Stop juggling multiple apps. Stop losing track of your goals. Start seeing real progress, every single day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer transition-all hover:scale-105"
              >
                Start Free Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 rounded-sm font-mono text-sm tracking-wide uppercase border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center gap-6 pt-8 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-mono">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-mono">Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
              <span className="font-mono">2 minute setup</span>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div className="mb-24 max-w-4xl">
          <div className="bg-amber-50/80 dark:bg-slate-900/50 border-l-4 border-amber-600 dark:border-amber-500 p-8 rounded-r-lg">
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Tired of feeling like you're spinning your wheels?
            </h2>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-3">
              You're tracking habits in one app, metrics in another, goals in a notebook, and tasks in yet another tool. You're making progress, but you can't actually <em>see</em> it. You're busy, but you don't know if you're getting better at what matters.
            </p>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed font-medium">
              It's time to unify your entire personal operating system in one place.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Everything You Need in <span className="italic font-medium">One Dashboard</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Your complete personal operating system. No more context switching between apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
            {/* Feature 1 */}
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Daily Habit Tracking</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Build consistency with simple yes/no habit tracking. See your streaks grow and watch patterns emerge. Red or green status at a glance—no analysis paralysis.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Visual streak tracking to maintain momentum</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Historical view to identify patterns</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Custom Metric Tracking</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Track anything quantifiable: sleep hours, workout minutes, pages read, calories, mood scores. If it matters to you, measure it and see the trends.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited custom metrics and categories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Visual charts showing progress over time</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Goal Management</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Set quarterly, monthly, and weekly goals. Break them down into actionable tasks. Track completion and never lose sight of what you're working toward.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Multi-timeframe planning (quarterly to weekly)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Task breakdown with time blocking</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Daily Operations</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Plan your day with time-blocked tasks and todos. Organize recurring operations and one-time tasks. Start each day knowing exactly what to do and when.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Time-blocked daily schedule</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Recurring operations management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Simple, Powerful, <span className="italic font-medium">Effective</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-full flex items-center justify-center font-mono font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-2">
                  Set Up Your System in Minutes
                </h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                  Add your habits, metrics, and goals. Choose what matters to you—no complicated setup required.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-full flex items-center justify-center font-mono font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-2">
                  Check In Daily
                </h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                  Spend 2 minutes each morning updating your dashboard. Check off habits, log metrics, review your plan.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-slate-950 rounded-full flex items-center justify-center font-mono font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-2">
                  See Your Progress Compound
                </h3>
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                  Watch your streaks grow, metrics improve, and goals get crushed. Finally, undeniable proof of your progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results/Benefits */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
              The <span className="italic font-medium">Results</span> Speak
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              What happens when you actually track your life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-300 dark:border-slate-800 p-6 rounded-lg shadow-sm">
              <Zap className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Crystal Clear Clarity</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                No more wondering "Did I do the thing?" You'll know exactly what you did, when you did it, and how consistently you're showing up.
              </p>
            </div>

            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-300 dark:border-slate-800 p-6 rounded-lg shadow-sm">
              <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Compound Progress</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Small daily actions add up to massive results. Watch your consistency improve week after week. Data doesn't lie.
              </p>
            </div>

            <div className="space-y-3 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900/50 dark:to-slate-800/30 border border-gray-300 dark:border-slate-800 p-6 rounded-lg shadow-sm">
              <CheckCircle2 className="h-8 w-8 text-amber-600 dark:text-amber-500" />
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Instant Accountability</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Red means you're off track. Green means you're winning. One glance at your dashboard tells you the truth.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gray-900 dark:bg-white rounded-lg p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-white dark:text-slate-950 mb-4">
              Ready to Build Your <span className="italic font-medium">Operating System?</span>
            </h2>
            <p className="text-lg text-gray-300 dark:text-slate-600 mb-8 max-w-2xl mx-auto">
              Join people who've stopped guessing and started measuring. Free forever. No credit card required.
            </p>
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'bottom' })}>
              <Button
                size="lg"
                className="group bg-white hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-gray-900 dark:text-white px-10 h-14 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer transition-all hover:scale-105"
              >
                Start Building Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-sm text-gray-400 dark:text-slate-600 mt-6 font-mono">
              Setup takes 2 minutes • Works on all devices • Free forever plan
            </p>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
