"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, TrendingUp, Target, BarChart3 } from "lucide-react";
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
              Data-Driven Self-Improvement
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Transform vague aspirations into measurable progress. Track habits, monitor metrics, and see exactly where you stand—every single day.
            </p>
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
            <Link href="#how-it-works">
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
          <div className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white dark:border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-white dark:border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 border-2 border-white dark:border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 border-2 border-white dark:border-slate-950"></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
              Join hundreds tracking their progress daily
            </p>
          </div>
        </div>

        {/* Value Proposition Section */}
        <div id="how-it-works" className="mb-24 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Why Human Operations?
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              Most tracking apps overcomplicate things. We keep it simple: measure what matters, see your progress, stay consistent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-md rounded-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <Target className="w-6 h-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                Crystal Clear Goals
              </h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Define exactly what success looks like. Whether it's hitting the gym 5x/week, sleeping 8 hours, or writing 500 words daily—set it once, track it forever.
              </p>
              <ul className="space-y-2 pt-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span>Custom habits tailored to your goals</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span>Flexible metrics for any life area</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span>Daily check-ins take less than 60 seconds</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/70 border border-gray-200 dark:border-slate-800 p-8 shadow-md rounded-sm">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-900 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                Real Progress, Visualized
              </h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Your dashboard shows what's working and what's not. Green means you're winning, red means course-correct. No ambiguity, just actionable insights.
              </p>
              <ul className="space-y-2 pt-2">
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span>Instant visual feedback on performance</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span>Historical trends to spot patterns</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-500 flex-shrink-0" />
                  <span>Data-driven decisions, not guesswork</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="space-y-3 bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Build Consistency</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Habit Tracking</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Daily habits are the foundation of success. Track them religiously, watch your streak grow, and build unstoppable momentum.
              </p>
            </div>

            <div className="space-y-3 bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Measure Impact</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Custom Metrics</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Sleep hours, workout intensity, focus time, revenue—track anything with numerical value. Watch the numbers trend up over time.
              </p>
            </div>

            <div className="space-y-3 bg-white/80 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Stay Honest</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Daily Accountability</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm">
                Your dashboard doesn't lie. Red or green—you know immediately if you're on track. No hiding from the truth.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-800 dark:from-slate-900 dark:to-slate-800 border border-amber-800 dark:border-slate-700 p-12 rounded-sm shadow-xl text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-4">
            Stop Guessing. Start Knowing.
          </h2>
          <p className="text-amber-100 dark:text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
            Your goals deserve better than wishful thinking. Build a system that actually tracks progress and holds you accountable.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'bottom' })}>
            <Button
              size="lg"
              className="group bg-white hover:bg-gray-50 text-gray-900 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-amber-200 dark:text-slate-400 text-sm mt-4">
            No credit card required • Set up in 2 minutes
          </p>
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
