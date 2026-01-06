"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Target, TrendingUp, Calendar, BarChart3, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header with Sign In */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-800 dark:bg-amber-600 rounded-sm" />
            <span className="font-serif font-medium text-lg text-gray-900 dark:text-white">Human Operations</span>
          </div>
          <Link href="/login">
            <button className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors">
              Sign In →
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100/70 dark:bg-slate-800/70 border border-amber-800/30 dark:border-slate-700 rounded-full">
              <Zap className="w-4 h-4 text-amber-800 dark:text-amber-500" />
              <span className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-300 uppercase">
                AI-Powered Life Operating System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.05]">
              Stop Guessing.
              <br />
              <span className="font-medium italic bg-gradient-to-r from-amber-800 to-amber-600 dark:from-amber-500 dark:to-amber-300 bg-clip-text text-transparent">
                Start Knowing.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              The only habit tracker that shows you <span className="font-medium text-gray-900 dark:text-white">exactly where you stand</span>, every single day. No streaks. No gamification. Just honest progress.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
                <Button
                  size="lg"
                  className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-14 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-sm font-mono text-gray-600 dark:text-slate-400">
                  <span className="font-semibold text-gray-900 dark:text-white">$19</span> one-time payment
                </div>
                <div className="text-xs text-gray-500 dark:text-slate-500">
                  No subscription. Lifetime access.
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>5 free trial actions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>AI-powered onboarding</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>Works offline</span>
              </div>
            </div>
          </div>
        </section>

        {/* Problem-Solution Section */}
        <section className="py-20 border-t border-gray-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
                You're Tracking Everything.
                <br />
                <span className="italic font-medium">But Are You Actually Improving?</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                Most habit trackers focus on streaks that break when life happens. We focus on what actually matters: <span className="font-medium text-gray-900 dark:text-white">consistency over time</span>.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* Problem */}
              <div className="space-y-4 p-8 bg-red-50/30 dark:bg-red-950/10 border border-red-200/50 dark:border-red-900/30 rounded-sm">
                <div className="text-xs font-mono tracking-wider text-red-800 dark:text-red-400 uppercase mb-4">
                  ✗ Without Human Operations
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Lose your streak, lose your motivation</span>
                  </li>
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Can't see patterns in your behavior</span>
                  </li>
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Overwhelmed by too many tools</span>
                  </li>
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <span className="text-red-500 mt-1">•</span>
                    <span>No idea if you're actually improving</span>
                  </li>
                </ul>
              </div>

              {/* Solution */}
              <div className="space-y-4 p-8 bg-green-50/30 dark:bg-green-950/10 border border-green-200/50 dark:border-green-900/30 rounded-sm">
                <div className="text-xs font-mono tracking-wider text-green-800 dark:text-green-400 uppercase mb-4">
                  ✓ With Human Operations
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span>See your <span className="font-medium">real consistency rate</span> at a glance</span>
                  </li>
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Track habits, metrics, and goals <span className="font-medium">in one place</span></span>
                  </li>
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Color-coded clarity: <span className="font-medium">red or green</span>, that simple</span>
                  </li>
                  <li className="flex items-start space-x-3 text-gray-700 dark:text-slate-300">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Historical data shows <span className="font-medium">actual progress</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase mb-6">
                Everything You Need
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-light text-gray-900 dark:text-white">
                Your Life,
                <br />
                <span className="italic font-medium">Beautifully Organized</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group space-y-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-8 hover:shadow-lg hover:border-amber-800/30 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <Target className="w-8 h-8 text-amber-800 dark:text-amber-500" />
                  <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">01</div>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                  Daily Habit Tracking
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                  Mark habits as complete with a single click. See your consistency at a glance with our color-coded grid system.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group space-y-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-8 hover:shadow-lg hover:border-amber-800/30 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <BarChart3 className="w-8 h-8 text-amber-800 dark:text-amber-500" />
                  <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">02</div>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                  Quantified Metrics
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                  Track sleep hours, workout duration, water intake—anything numeric. Set targets and see if you're hitting them.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group space-y-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-8 hover:shadow-lg hover:border-amber-800/30 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-8 h-8 text-amber-800 dark:text-amber-500" />
                  <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">03</div>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                  Historical Insights
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                  View any past date to see exactly how you performed. Identify patterns and make data-driven improvements.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group space-y-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-8 hover:shadow-lg hover:border-amber-800/30 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <Calendar className="w-8 h-8 text-amber-800 dark:text-amber-500" />
                  <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">04</div>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                  Goals & Scheduling
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                  Set long-term goals with deadlines. Schedule recurring events. See what's on your plate for the week.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group space-y-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-8 hover:shadow-lg hover:border-amber-800/30 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 flex items-center justify-center text-amber-800 dark:text-amber-500 font-bold text-xl">
                    ⚡
                  </div>
                  <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">05</div>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                  Life Operations
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                  Organize your life into core pillars (Health, Career, Relationships, etc.). Each with its own habits and metrics.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group space-y-4 bg-white/80 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-8 hover:shadow-lg hover:border-amber-800/30 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 flex items-center justify-center text-amber-800 dark:text-amber-500 font-bold text-xl">
                    🤖
                  </div>
                  <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">06</div>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                  AI Setup
                </h3>
                <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm">
                  Chat with our AI to create your personalized system. It understands your goals and builds the perfect tracking setup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 border-t border-gray-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
                Simple by Design.
                <br />
                <span className="italic font-medium">Powerful in Practice.</span>
              </h2>
            </div>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-800 dark:bg-amber-600 rounded-sm flex items-center justify-center text-white font-mono text-xl">
                  1
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                    Tell Our AI About Your Life
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                    Chat with our AI-powered onboarding. Tell it about your goals, habits you want to build, and what you want to measure. It creates your entire system in minutes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-800 dark:bg-amber-600 rounded-sm flex items-center justify-center text-white font-mono text-xl">
                  2
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                    Check In Daily (Takes 2 Minutes)
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                    Every day, open your dashboard. Mark habits complete. Log your metrics. That's it. Your entire day's progress captured in seconds.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-800 dark:bg-amber-600 rounded-sm flex items-center justify-center text-white font-mono text-xl">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                    Watch Yourself Improve
                  </h3>
                  <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                    See green tiles multiply. Watch your consistency rates climb. Review your history to understand what's working. Make adjustments. Keep improving.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-amber-100/80 to-amber-50/50 dark:from-slate-900/80 dark:to-slate-800/50 border-2 border-amber-800/30 dark:border-slate-700 p-12 rounded-sm shadow-xl">
              <div className="inline-block px-3 py-1 bg-amber-200 dark:bg-amber-900/50 border border-amber-800/40 dark:border-amber-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-amber-300 uppercase mb-6">
                Limited Time Offer
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-light text-gray-900 dark:text-white mb-4">
                Start Your Journey
              </h2>

              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-6xl font-serif font-bold text-gray-900 dark:text-white">$19</span>
                <span className="text-xl text-gray-600 dark:text-slate-400">one-time</span>
              </div>

              <p className="text-gray-600 dark:text-slate-400 mb-8">
                No subscription. No recurring charges. Lifetime access.
              </p>

              <div className="space-y-3 mb-8 max-w-md mx-auto">
                <div className="flex items-center justify-start space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">Unlimited habits, metrics, and goals</span>
                </div>
                <div className="flex items-center justify-start space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">AI-powered personalization</span>
                </div>
                <div className="flex items-center justify-start space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">Works offline as a PWA</span>
                </div>
                <div className="flex items-center justify-start space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">All future updates included</span>
                </div>
                <div className="flex items-center justify-start space-x-3 text-left">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-slate-300">5 free actions to try it out</span>
                </div>
              </div>

              <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'pricing' })}>
                <Button
                  size="lg"
                  className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-10 h-14 rounded-sm font-mono text-base tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="text-xs text-gray-500 dark:text-slate-500 mt-4">
                Start free. Pay only if you love it.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
              Your Life, Quantified
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-600">
              © 2025 Human Operations. Built for people who want to improve.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
