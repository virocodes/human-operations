"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, CheckCircle2, Target, TrendingUp, Clock, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950">
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
              Personal Performance System
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl text-gray-800 dark:text-slate-200 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              The operating system for ambitious people who refuse to coast through life.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Stop wondering if you're making progress. Get instant clarity on your habits, metrics, and goals—all in one place. No fluff, just data that drives action.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { position: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-gray-900 dark:border-slate-300 text-gray-900 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-900 rounded-sm font-mono text-sm tracking-wide uppercase"
              >
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-6 pt-6 text-sm text-gray-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-mono">Free forever plan</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-mono">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="font-mono">2 min setup</span>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="bg-white/80 dark:bg-slate-900/80 border border-gray-300 dark:border-slate-800 p-8 shadow-sm">
            <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              You're tired of feeling like you're spinning your wheels
            </h2>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
              You set goals. You track some things in spreadsheets. You use multiple apps. But at the end of the week,
              you still can't answer: <span className="font-medium italic">"Am I actually making progress?"</span>
            </p>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
              Human Operations gives you one dashboard with everything that matters—your habits, your metrics, your tasks,
              your goals—so you can see your real progress at a glance.
            </p>
          </div>
        </div>

        {/* Core Features - How It Works */}
        <div id="how-it-works" className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-light text-gray-900 dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-slate-400 font-mono text-sm tracking-wide uppercase">
              Three simple systems, one powerful dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">1. Habits</div>
                <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Build Consistency</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Check off your daily habits. See your streak grow. Watch consistency compound into real results.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Track unlimited habits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Visual streak tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Historical completion rates</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">2. Metrics</div>
                <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Measure Progress</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Log the numbers that matter to you. Sleep hours, workout duration, focus time—anything quantifiable.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Custom metrics with targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Trend analysis over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Color-coded status (red/yellow/green)</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">3. Tasks</div>
                <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Execute Daily</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Organize your to-dos and projects. See what needs attention. Actually get things done.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Projects with subtasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Priority levels</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>Quick daily capture</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Why This Works */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-100/50 to-amber-50/30 dark:from-slate-900/50 dark:to-slate-900/30 border border-amber-800/20 dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                The Power of Daily Clarity
              </h2>
            </div>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-4">
              Most people fail not from lack of effort, but from lack of feedback. When you can't see if you're winning
              or losing, motivation dies.
            </p>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
              Human Operations solves this with <span className="font-medium">instant visibility</span>. Open your dashboard
              and immediately know if today was a win or a loss. Red means you're slipping. Green means you're crushing it.
              It's simple, it's honest, and it works.
            </p>
          </div>
        </div>

        {/* Social Proof / Stats */}
        <div className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-4xl font-serif font-light text-gray-900 dark:text-white">2 min</div>
              <div className="text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wide">Average Setup Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-serif font-light text-gray-900 dark:text-white">&lt;60 sec</div>
              <div className="text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wide">Daily Check-In Time</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-serif font-light text-gray-900 dark:text-white">100%</div>
              <div className="text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wide">Free Core Features</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mb-16 max-w-3xl mx-auto text-center">
          <div className="bg-gray-900 dark:bg-white/95 p-12 shadow-lg">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white dark:text-slate-950 mb-4">
              Ready to stop guessing and start knowing?
            </h2>
            <p className="text-gray-300 dark:text-slate-700 mb-8 text-lg">
              Join the system that turns daily actions into measurable progress.
            </p>
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { position: 'bottom' })}>
              <Button
                size="lg"
                className="group bg-white hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-gray-900 dark:text-white px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-xs text-gray-400 dark:text-slate-600 mt-4 font-mono">
              Free plan available · No credit card required
            </p>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified · Est. 2025
          </p>
        </div>
      </main>
    </div>
  );
}
