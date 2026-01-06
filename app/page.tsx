"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
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
        <div className="space-y-8 mb-32">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Est. 2025
            </div>
            <div className="px-3 py-1 bg-green-100/50 dark:bg-green-950/30 border border-green-800/20 dark:border-green-700/30 rounded-sm text-xs font-mono tracking-wider text-green-900 dark:text-green-400 uppercase">
              AI-Powered Setup
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-900 dark:text-white max-w-2xl leading-relaxed font-light border-l-2 border-gray-900 dark:border-white pl-4">
              The operating system for ambitious people who refuse to leave their progress to chance.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed pl-4">
              Track habits. Measure metrics. Hit goals. All in one place, designed by AI specifically for you in under 5 minutes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
              >
                Build Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 pl-1">
              <span className="font-mono tracking-wider uppercase">$19 one-time</span>
              <span className="text-gray-400 dark:text-slate-600">•</span>
              <span className="font-mono tracking-wider uppercase">No subscription</span>
            </div>
          </div>
        </div>

        {/* Problem-Solution Statement */}
        <div className="mb-24 max-w-4xl relative">
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
          <div className="p-8 md:p-12 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800">
            <p className="text-lg md:text-xl text-gray-900 dark:text-white font-serif leading-relaxed mb-6">
              "I know I should be tracking my habits and progress, but every system I've tried is either too complicated, too rigid, or takes hours to set up."
            </p>
            <p className="text-base text-gray-700 dark:text-slate-300 leading-relaxed border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Human Operations solves this. Tell our AI your goals, and it designs a complete tracking system tailored to your life—habits, metrics, schedule, and all. Then track everything in seconds each day with a brutally simple interface: red or green. Working or not working.
            </p>
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-12 tracking-tight">
            Everything you need.<br />Nothing you don't.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <div className="relative space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Habit Tracking</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Daily boolean tracking for your non-negotiables. Meditation, reading, exercise—build consistency with visual accountability. One glance shows your 7-day streak.
              </p>
            </div>

            <div className="relative space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Numeric Metrics</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Track anything quantifiable. Sleep hours, calories, deep work sessions, revenue. Set minimum and optimal targets. The system color-codes your performance automatically.
              </p>
            </div>

            <div className="relative space-y-4 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Operations Framework</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Organize everything around 2-4 core life areas—Health, Work, Relationships, Growth. Every habit and metric connects to an operation, giving structure to chaos.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-8 tracking-tight">
            Built for you in 5 minutes.
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-slate-950 font-mono text-xs rounded-sm">
                1
              </div>
              <div>
                <h4 className="font-serif font-medium text-gray-900 dark:text-white mb-1">Tell AI your goals</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  Share 2-4 things you want to improve. Career, fitness, relationships—whatever matters to you.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-slate-950 font-mono text-xs rounded-sm">
                2
              </div>
              <div>
                <h4 className="font-serif font-medium text-gray-900 dark:text-white mb-1">AI designs your system</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  Claude analyzes your goals and generates a complete tracking system—habits, metrics, daily schedule, and progress targets.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-slate-950 font-mono text-xs rounded-sm">
                3
              </div>
              <div>
                <h4 className="font-serif font-medium text-gray-900 dark:text-white mb-1">Track daily in seconds</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed">
                  Open your dashboard, check boxes, enter numbers. The interface shows exactly where you stand. Red or green. Simple.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof / Trust */}
        <div className="mb-24 max-w-3xl mx-auto">
          <div className="relative bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-800/40 dark:border-amber-600/40"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-800/40 dark:border-amber-600/40"></div>
            <div className="space-y-4">
              <p className="text-base md:text-lg font-serif italic text-gray-900 dark:text-white leading-relaxed">
                "Finally, a productivity system that doesn't require a PhD to set up. The AI built my entire tracking dashboard in 3 minutes, and I've been consistent for the first time in years."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 rounded-full flex items-center justify-center font-mono text-sm text-gray-700 dark:text-slate-300">
                  AK
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Alex K.</div>
                  <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">Software Engineer</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing / CTA Section */}
        <div className="mb-24 max-w-4xl mx-auto text-center">
          <div className="relative bg-white/60 dark:bg-slate-900/50 border-2 border-gray-900 dark:border-white p-12 shadow-lg">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-900 dark:border-white"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-900 dark:border-white"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-900 dark:border-white"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-900 dark:border-white"></div>

            <div className="space-y-6">
              <div>
                <div className="text-sm font-mono tracking-widest text-gray-600 dark:text-slate-500 uppercase mb-2">One-Time Payment</div>
                <div className="text-5xl md:text-6xl font-serif font-light text-gray-900 dark:text-white">$19</div>
                <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase mt-2">Lifetime Access</div>
              </div>

              <div className="max-w-sm mx-auto space-y-2 text-left">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>AI-powered system generation</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Unlimited habits & metrics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Full history & analytics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>No subscription. Ever.</span>
                </div>
              </div>

              <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'pricing' })}>
                <Button
                  size="lg"
                  className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-10 h-14 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer transition-all hover:scale-[1.02] shadow-lg mt-4"
                >
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <p className="text-xs text-gray-500 dark:text-slate-600 font-mono tracking-wider pt-2">
                Payment after AI builds your system
              </p>
            </div>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center space-y-2">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-700">
            For people who build systems, not excuses.
          </p>
        </div>
      </main>
    </div>
  );
}
