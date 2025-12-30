"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

const features = [
  "Unlimited habits and metrics",
  "AI-powered goal planning",
  "Daily progress tracking",
  "Visual analytics and trends",
  "Mobile-optimized interface",
  "Dark mode support",
  "Lifetime access to your data"
];

export function PricingSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Section header */}
      <div className="mb-12 space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm">
          <span className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
            Simple Pricing
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 dark:text-white">
          One price, full access
        </h2>
        <p className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
          No subscriptions, no hidden fees. Pay once, own it forever.
        </p>
      </div>

      {/* Pricing card */}
      <div className="max-w-lg mx-auto">
        <div className="relative bg-white dark:bg-slate-900 border-2 border-gray-900 dark:border-slate-100 shadow-lg">
          {/* Corner brackets - larger for emphasis */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

          <div className="p-8 md:p-12">
            {/* Price */}
            <div className="mb-8 pb-8 border-b border-gray-300 dark:border-slate-800">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-serif font-light text-gray-900 dark:text-white">$19</span>
                <span className="text-lg font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                  One-time
                </span>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-slate-400 mt-2 font-mono tracking-wide">
                Lifetime access
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-900 dark:text-slate-100 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-slate-300 text-sm font-light leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/onboarding" onClick={() => trackEvent('landing_pricing_cta_clicked', {})}>
              <Button
                size="lg"
                className="w-full group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-6 h-12 rounded-sm font-mono text-sm tracking-wide uppercase"
              >
                Start Building Your System
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <p className="text-center text-xs text-gray-500 dark:text-slate-500 mt-4 font-mono tracking-wide">
              30-day money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
