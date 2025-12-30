"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export function FinalCTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="relative bg-gray-900 dark:bg-slate-100 border-2 border-gray-900 dark:border-slate-100 shadow-2xl overflow-hidden">
        {/* Corner brackets - inverted colors */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-500 dark:border-amber-600 z-10"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-500 dark:border-amber-600 z-10"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-500 dark:border-amber-600 z-10"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-500 dark:border-amber-600 z-10"></div>

        <div className="px-8 py-16 md:px-16 md:py-20 text-center space-y-8">
          {/* Badge */}
          <div className="inline-block px-3 py-1 bg-amber-500/20 dark:bg-amber-600/20 border border-amber-500/30 dark:border-amber-600/30 rounded-sm">
            <span className="text-xs font-mono tracking-wider text-amber-200 dark:text-amber-700 uppercase">
              Ready to start?
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-serif font-light tracking-tight text-white dark:text-slate-950 max-w-3xl mx-auto leading-tight">
            Stop wondering.
            <br />
            <span className="font-medium italic">Start knowing.</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-300 dark:text-slate-700 max-w-2xl mx-auto leading-relaxed font-light">
            Build your personal operations system in the next 5 minutes. See your progress from day one.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link href="/onboarding" onClick={() => trackEvent('landing_final_cta_clicked', {})}>
              <Button
                size="lg"
                className="group bg-amber-500 hover:bg-amber-400 dark:bg-amber-600 dark:hover:bg-amber-700 text-gray-900 dark:text-white px-8 h-14 rounded-sm font-mono text-base tracking-wide uppercase shadow-lg"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm text-gray-400 dark:text-slate-600 font-mono tracking-wide pt-4">
            <span>$19 one-time payment</span>
            <span className="hidden md:inline">•</span>
            <span>30-day money-back guarantee</span>
            <span className="hidden md:inline">•</span>
            <span>Setup takes 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
