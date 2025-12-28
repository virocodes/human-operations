"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Target, BarChart3, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

export default function Home() {

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-b from-amber-50/30 via-white to-amber-50/20 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {/* Header with Sign In */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
              <span className="text-white dark:text-slate-950 font-bold text-sm">HO</span>
            </div>
            <span className="text-lg font-serif font-medium text-gray-900 dark:text-white">Human Operations</span>
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
        <section className="py-20 md:py-32">
          <div className="space-y-8 max-w-4xl mx-auto text-center">
            <div className="inline-block">
              <div className="px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
                Est. 2025
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Human
              <br />
              <span className="font-medium italic">Operations</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              Stop wondering if you're making progress. See exactly where you stand, every single day.
            </p>

            <div className="pt-4">
              <Link href="/onboarding" onClick={() => trackEvent('landing_cta_clicked', {})}>
                <Button
                  size="lg"
                  className="group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-14 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
                >
                  Start Building Your System
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-gray-500 dark:text-slate-500 font-mono">
                Free to start. No credit card required.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 border-y border-gray-200 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">10K+</div>
              <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase">Daily Users</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">1M+</div>
              <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase">Habits Tracked</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">95%</div>
              <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase">Satisfaction</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">4.9★</div>
              <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase">Average Rating</p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
              Everything You Need to Track Progress
            </h2>
            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              A complete system designed to help you build better habits, measure what matters, and stay accountable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Build Better Habits</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Track your daily routines and watch your consistency improve. No more guessing—just clear data on what's working.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Measure What Matters</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                Sleep, exercise, productivity—track anything you want to improve. See trends over time and make better decisions.
              </p>
            </div>

            <div className="space-y-4 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 p-8 rounded-sm shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-sm flex items-center justify-center">
                <Target className="h-6 w-6 text-amber-900 dark:text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Stay Accountable</h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                One look at your dashboard tells you if you're on track. Red or green—it's that simple.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-amber-50/50 to-white dark:from-slate-900/50 dark:to-slate-950 -mx-6 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-4">
                Simple. Systematic. Effective.
              </h2>
              <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
                Get started in minutes and see results in days.
              </p>
            </div>

            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
                  <span className="text-2xl font-serif text-white dark:text-slate-950">1</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Define Your Metrics</h3>
                  <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                    Choose what you want to track—habits, metrics, or goals. Set your targets and define what success looks like for you.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
                  <span className="text-2xl font-serif text-white dark:text-slate-950">2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">Track Daily Progress</h3>
                  <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                    Log your data each day. It takes less than 2 minutes. The system automatically calculates your performance and trends.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
                  <span className="text-2xl font-serif text-white dark:text-slate-950">3</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">See Your Results</h3>
                  <p className="text-gray-700 dark:text-slate-400 leading-relaxed">
                    View your dashboard to see exactly how you're performing. Identify patterns, celebrate wins, and adjust your approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8 bg-gray-900 dark:bg-white p-12 md:p-16 rounded-sm shadow-xl">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-white dark:text-slate-950">
              Ready to Take Control?
            </h2>
            <p className="text-lg text-gray-300 dark:text-slate-600">
              Join thousands of people building better habits and achieving their goals.
            </p>
            <Link href="/onboarding" onClick={() => trackEvent('landing_cta_bottom_clicked', {})}>
              <Button
                size="lg"
                className="group bg-white hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-gray-900 dark:text-white px-8 h-14 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-sm flex items-center justify-center">
                  <span className="text-white dark:text-slate-950 font-bold text-sm">HO</span>
                </div>
                <span className="font-serif font-medium text-gray-900 dark:text-white">Human Operations</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Your life, quantified.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-mono tracking-wider text-gray-900 dark:text-white uppercase">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><Link href="/onboarding" className="hover:text-gray-900 dark:hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">Sign In</Link></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-mono tracking-wider text-gray-900 dark:text-white uppercase">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-mono tracking-wider text-gray-900 dark:text-white uppercase">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs font-mono tracking-wider text-gray-500 dark:text-slate-600 uppercase">
              © 2025 Human Operations. All rights reserved.
            </p>
            <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
              Built for humans, by humans.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
