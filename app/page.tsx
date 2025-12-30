"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import {
  HowItWorks,
  AppPreview,
  SocialProof,
  PricingSection,
  FAQSection,
  FinalCTA,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950">
      {/* Header with Sign In */}
      <div className="fixed top-8 right-8 z-50">
        <Link href="/login">
          <button className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors bg-amber-50/80 dark:bg-slate-950/80 backdrop-blur-sm px-4 py-2 rounded-sm border border-gray-300 dark:border-slate-800">
            Sign In →
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="space-y-8 mb-20">
          <div className="inline-block">
            <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
              Est. 2025
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Stop wondering if you're making progress. Track what matters, see your trajectory, and stay accountable—all in one place.
            </p>
            <p className="text-base text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light">
              Most habit trackers are just checklists. We show you the full picture: habits, metrics, and goals working together. One glance tells you if you're on track.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/onboarding" onClick={() => trackEvent('landing_hero_cta_clicked', {})}>
              <Button
                size="lg"
                className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="flex flex-col justify-center text-sm text-gray-600 dark:text-slate-400 font-mono">
              <span>$19 one-time payment</span>
              <span className="text-xs">Setup takes 5 minutes</span>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="relative space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Track your daily routines and watch your consistency improve. No more guessing—just clear data on what's working.
            </p>
          </div>

          <div className="relative space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Sleep, exercise, productivity—track anything you want to improve. See trends over time and make better decisions.
            </p>
          </div>

          <div className="relative space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              One look at your dashboard tells you if you're on track. Red or green—it's that simple.
            </p>
          </div>
        </div>
      </section>

      {/* New sections */}
      <HowItWorks />
      <AppPreview />
      <SocialProof />
      <PricingSection />
      <FAQSection />
      <FinalCTA />

      {/* Footer */}
      <footer className="border-t border-gray-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-serif font-light text-gray-900 dark:text-white mb-2">
                Human <span className="italic">Operations</span>
              </h3>
              <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
                Your Life, Quantified
              </p>
            </div>

            <div className="flex gap-8 text-sm font-mono text-gray-600 dark:text-slate-400">
              <Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/onboarding" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-300 dark:border-slate-800 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-600 font-mono">
              © 2025 Human Operations. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
