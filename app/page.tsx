"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Target, TrendingUp, BarChart3 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-x-hidden bg-amber-50/30 dark:bg-slate-950">
      {/* Header with Sign In */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-amber-50/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-amber-800/10 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-lg font-serif font-medium text-gray-900 dark:text-white">
              Human <span className="italic">Operations</span>
            </div>
          </div>
          <Link href="/login">
            <button
              className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors"
              aria-label="Sign in to your account"
            >
              Sign In →
            </button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <section className="space-y-8 mb-24" aria-labelledby="hero-heading">
          <div className="inline-block animate-fadeIn">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Est. 2025
            </div>
          </div>

          <div className="space-y-6 max-w-3xl animate-fadeIn" style={{ animationDelay: "0.1s" }}>
            <h1 id="hero-heading" className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Stop wondering if you're making progress. See exactly where you stand, every single day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'hero' })}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-6 h-11 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer w-full sm:w-auto"
                aria-label="Start building your personal system"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" onClick={() => trackEvent('auth_started', { location: 'landing_hero' })}>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-900 px-6 h-11 rounded-sm font-mono text-sm tracking-wide uppercase w-full sm:w-auto"
                aria-label="Sign in to existing account"
              >
                Already have an account?
              </Button>
            </Link>
          </div>
        </section>

        {/* Social Proof */}
        <section className="mb-24 animate-fadeIn" style={{ animationDelay: "0.3s" }} aria-labelledby="social-proof-heading">
          <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-y border-amber-800/10 dark:border-slate-800">
            <div className="text-center">
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-white">AI-Powered</div>
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mt-1">Smart Setup</div>
            </div>
            <div className="w-px h-12 bg-amber-800/20 dark:bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-white">100% Private</div>
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mt-1">Your Data</div>
            </div>
            <div className="w-px h-12 bg-amber-800/20 dark:bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-serif font-medium text-gray-900 dark:text-white">Works Offline</div>
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mt-1">PWA Ready</div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-24" aria-labelledby="benefits-heading">
          <h2 id="benefits-heading" className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-12 text-center">
            Everything you need to level up
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
            <article className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-800/30 dark:hover:border-slate-600">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Track your daily routines and watch your consistency improve. No more guessing—just clear data on what's working.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-slate-500">
                <CheckCircle2 className="h-4 w-4" />
                <span>Daily tracking</span>
              </div>
            </article>

            <article className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-800/30 dark:hover:border-slate-600">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                Sleep, exercise, productivity—track anything you want to improve. See trends over time and make better decisions.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-slate-500">
                <TrendingUp className="h-4 w-4" />
                <span>Custom metrics</span>
              </div>
            </article>

            <article className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-800/30 dark:hover:border-slate-600">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                One look at your dashboard tells you if you're on track. Red or green—it's that simple.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-slate-500">
                <Target className="h-4 w-4" />
                <span>Visual feedback</span>
              </div>
            </article>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-24 bg-white/40 dark:bg-slate-900/30 border border-amber-800/10 dark:border-slate-800 p-12 rounded-sm" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-12 text-center">
            Get started in minutes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center border border-amber-800/20 dark:border-slate-700">
                <span className="text-xl font-mono font-medium text-gray-900 dark:text-white">1</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Tell us your goals</h3>
              <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                Our AI creates a personalized system based on what you want to achieve.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center border border-amber-800/20 dark:border-slate-700">
                <span className="text-xl font-mono font-medium text-gray-900 dark:text-white">2</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Track daily</h3>
              <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                Spend 2 minutes each day logging your habits and metrics.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center border border-amber-800/20 dark:border-slate-700">
                <span className="text-xl font-mono font-medium text-gray-900 dark:text-white">3</span>
              </div>
              <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">See your progress</h3>
              <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                Watch trends emerge and adjust your approach based on real data.
              </p>
            </div>
          </div>
        </section>

        {/* Stats/Features Grid */}
        <section className="mb-24" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-12 text-center">
            Designed for serious self-improvers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="flex gap-4 items-start bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6">
              <BarChart3 className="h-6 w-6 text-amber-800 dark:text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif font-medium text-gray-900 dark:text-white mb-2">Unlimited custom metrics</h3>
                <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                  Track anything: from calories and mood to coding hours and book pages read.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6">
              <Target className="h-6 w-6 text-amber-800 dark:text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif font-medium text-gray-900 dark:text-white mb-2">Smart target ranges</h3>
                <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                  Set minimum and maximum values. Get instant visual feedback on your performance.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6">
              <CheckCircle2 className="h-6 w-6 text-amber-800 dark:text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif font-medium text-gray-900 dark:text-white mb-2">7-day quick entry</h3>
                <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                  See the full week at a glance. Update any day with a single click or tap.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6">
              <TrendingUp className="h-6 w-6 text-amber-800 dark:text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-serif font-medium text-gray-900 dark:text-white mb-2">Goals & operations</h3>
                <p className="text-sm text-gray-700 dark:text-slate-400 font-light">
                  Organize life by areas (Health, Career, etc.) with nested goals and sub-goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center py-16 bg-amber-100/30 dark:bg-slate-900/30 border border-amber-800/20 dark:border-slate-800 rounded-sm" aria-labelledby="final-cta-heading">
          <h2 id="final-cta-heading" className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
            Ready to take control?
          </h2>
          <p className="text-gray-700 dark:text-slate-400 mb-8 max-w-xl mx-auto font-light">
            Join people who are serious about measuring and improving their lives.
          </p>
          <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', { location: 'footer' })}>
            <Button
              size="lg"
              className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              aria-label="Get started with Human Operations"
            >
              Get Started — It's Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-800/10 dark:border-slate-800 mt-20 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg font-serif font-medium text-gray-900 dark:text-white mb-1">
                Human <span className="italic">Operations</span>
              </div>
              <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
                Your Life, Quantified
              </p>
            </div>
            <div className="flex gap-8 text-sm text-gray-600 dark:text-slate-400">
              <Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/onboarding" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-amber-800/10 dark:border-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-600">
              © 2025 Human Operations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
