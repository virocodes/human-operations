"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Keyboard, Calendar, DollarSign, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-y-auto bg-amber-50/30 dark:bg-slate-950">
      {/* Header with Sign In */}
      <div className="absolute top-8 right-8 z-10">
        <Link href="/login">
          <button
            onClick={() => trackEvent('landing_signin_clicked', {})}
            className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors"
          >
            Sign In →
          </button>
        </Link>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 pb-20">
        {/* Hero Section */}
        <div className="space-y-8 mb-32">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Est. 2025
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              One dashboard. All your habits, metrics, and goals. Finally know if you're winning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-4 text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              5-minute setup • No credit card
            </div>
          </div>

          {/* Product Screenshot Placeholder */}
          <div className="mt-12 border-2 border-gray-300 dark:border-slate-700 shadow-2xl rounded-sm overflow-hidden bg-white dark:bg-slate-900">
            <div className="aspect-video bg-gradient-to-br from-amber-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="text-sm font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                  Dashboard Preview
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-sm"></div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-500 font-light italic">
                  Track habits, measure metrics, achieve goals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-center text-gray-900 dark:text-white mb-12">
            How it works
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm flex items-center justify-center mx-auto mb-4 font-mono text-2xl">
                1
              </div>
              <h3 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">5-Min AI Setup</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Chat with Claude to build your personalized system
              </p>
            </div>
            <div className="hidden md:block text-gray-400 dark:text-slate-600 text-2xl">→</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm flex items-center justify-center mx-auto mb-4 font-mono text-2xl">
                2
              </div>
              <h3 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">Track Daily</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Log habits, metrics, and progress in seconds
              </p>
            </div>
            <div className="hidden md:block text-gray-400 dark:text-slate-600 text-2xl">→</div>
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm flex items-center justify-center mx-auto mb-4 font-mono text-2xl">
                3
              </div>
              <h3 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">See Progress</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 font-light">
                Know exactly where you stand—red or green
              </p>
            </div>
          </div>
        </div>

        {/* What Makes This Different */}
        <div className="mb-24">
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-center text-gray-900 dark:text-white mb-12">
            What makes this different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div
              className="flex items-start gap-4 p-6 border-2 border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors cursor-default"
              onMouseEnter={() => trackEvent('landing_feature_hover', { feature: 'ai_setup' })}
            >
              <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">AI-Powered Setup</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-light leading-relaxed">
                  5-minute conversation with Claude builds your entire system. No templates, no blank pages—just clarity.
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-4 p-6 border-2 border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors cursor-default"
              onMouseEnter={() => trackEvent('landing_feature_hover', { feature: 'keyboard_nav' })}
            >
              <Keyboard className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">Keyboard Navigation</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-light leading-relaxed">
                  Navigate with arrow keys. No clicking required. Optimized for speed and focus.
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-4 p-6 border-2 border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors cursor-default"
              onMouseEnter={() => trackEvent('landing_feature_hover', { feature: 'operations' })}
            >
              <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">Operations-Based</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-light leading-relaxed">
                  Organize around 2-4 life pillars. Every habit, metric, and goal maps to what matters most.
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-4 p-6 border-2 border-gray-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/50 hover:border-gray-400 dark:hover:border-slate-600 transition-colors cursor-default"
              onMouseEnter={() => trackEvent('landing_feature_hover', { feature: 'pricing' })}
            >
              <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-white">One-Time Payment</h4>
                <p className="text-sm text-gray-600 dark:text-slate-400 font-light leading-relaxed">
                  $19 lifetime access. No subscriptions, no upsells, no monthly fees.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-24">
          <div className="max-w-md mx-auto text-center bg-white dark:bg-slate-900 border-2 border-gray-300 dark:border-slate-700 p-8 md:p-10 shadow-xl">
            <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mb-3">
              Simple Pricing
            </div>
            <div className="text-6xl font-serif font-medium text-gray-900 dark:text-white mb-2">
              $19
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-6 font-light">
              One-time payment. Lifetime access. No subscriptions.
            </p>
            <div className="space-y-3 mb-8 text-left">
              <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span>AI-powered personalized setup</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span>Unlimited habits, metrics, and goals</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span>Full history and analytics</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700 dark:text-slate-300">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <span>All future updates included</span>
              </div>
            </div>
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'pricing' })}>
              <Button
                size="lg"
                className="w-full group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-4 font-light">
              Start free • Pay after setup • 30-day refund
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mb-20">
          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Track your daily routines and watch your consistency improve. No more guessing—just clear data on what's working.
            </p>
          </div>

          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Sleep, exercise, productivity—track anything you want to improve. See trends over time and make better decisions.
            </p>
          </div>

          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              One look at your dashboard tells you if you're on track. Red or green—it's that simple.
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
