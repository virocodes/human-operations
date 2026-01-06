"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Zap, Target, TrendingUp, Calendar, ListChecks, Brain, Lock, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { useState } from "react";

export default function Home() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Setup",
      description: "Tell us your goals in plain English. Our AI builds a personalized tracking system tailored to your life in minutes."
    },
    {
      icon: Target,
      title: "Habit Tracking",
      description: "Build consistency with daily habit tracking. See your streaks, completion rates, and patterns at a glance."
    },
    {
      icon: TrendingUp,
      title: "Metric Tracking",
      description: "Track anything with numbers: steps, sleep hours, calories, revenue, pages read. Set targets and watch your progress."
    },
    {
      icon: ListChecks,
      title: "Goal Management",
      description: "Break down big goals into manageable subgoals. Track progress automatically as you complete daily actions."
    },
    {
      icon: Calendar,
      title: "Daily Schedule",
      description: "Plan your day with time blocks. Link tasks to habits and see exactly what you need to accomplish."
    },
    {
      icon: Sparkles,
      title: "Operations Framework",
      description: "Organize your life around 2-4 core pillars (Health, Career, Relationships, etc.). Keep what matters in focus."
    }
  ];

  const faqs = [
    {
      question: "How is this different from other habit trackers?",
      answer: "Unlike template-based apps, Human Operations uses AI to create a completely personalized system based on YOUR specific goals and lifestyle. Plus, our unique 2D navigation and Operations framework help you see the big picture, not just isolated habits."
    },
    {
      question: "Is there a subscription?",
      answer: "No! Pay once ($19), use forever. No monthly fees, no recurring charges. We believe in simple, honest pricing."
    },
    {
      question: "Can I try it before paying?",
      answer: "Yes! You get 5 free actions to explore the system after AI setup. This gives you a real feel for how it works before committing."
    },
    {
      question: "How long does setup take?",
      answer: "About 5 minutes. You have a conversation with our AI about your goals, and it builds your entire system automatically—habits, metrics, schedule, and goals."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption, secure authentication via Google, and your data is stored in a private database with row-level security. We never sell or share your data."
    },
    {
      question: "Does it work on mobile?",
      answer: "Yes! Human Operations is a Progressive Web App—it works beautifully on mobile, tablet, and desktop. You can even install it on your phone for a native app experience."
    }
  ];

  const testimonials = [
    {
      quote: "Finally, a habit tracker that actually adapts to my life instead of forcing me into rigid templates. The AI setup was surprisingly accurate.",
      author: "Sarah M.",
      role: "Product Designer"
    },
    {
      quote: "The Operations framework changed how I think about productivity. Instead of scattered goals, everything now connects to my core life pillars.",
      author: "David K.",
      role: "Entrepreneur"
    },
    {
      quote: "Best $19 I've spent this year. No subscription nonsense, just a clean tool that helps me stay on track every single day.",
      author: "Maya P.",
      role: "Graduate Student"
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-serif font-medium text-gray-900 dark:text-white">
              Human <span className="italic">Operations</span>
            </div>
          </div>
          <Link href="/login">
            <button className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white uppercase transition-colors">
              Sign In →
            </button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100/70 dark:bg-slate-800/50 border border-amber-800/20 dark:border-slate-700 rounded-full text-sm font-mono tracking-wide text-amber-900 dark:text-slate-300">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Life Operating System</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight text-gray-900 dark:text-white leading-[1.1]">
              Stop Guessing.
              <br />
              <span className="font-medium italic">Start Knowing.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
              Track your habits, measure what matters, and see exactly where you stand—every single day. No more wondering if you're making progress.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/onboarding" onClick={() => trackEvent('landing_hero_cta_clicked', {})}>
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase shadow-lg hover:shadow-xl transition-all"
                >
                  Build Your System Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <div className="text-sm text-gray-600 dark:text-slate-400 font-mono">
                <Shield className="w-4 h-4 inline mr-1" />
                5 free actions • No credit card
              </div>
            </div>

            {/* Social Proof */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>One-time payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>No subscription</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span>Works on all devices</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white dark:bg-slate-900 py-20 md:py-28 border-y border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
                Everything you need to level up your life
              </h2>
              <p className="text-lg text-gray-600 dark:text-slate-400 font-light">
                From AI-powered setup to advanced goal tracking, Human Operations has you covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-800 dark:to-slate-800/50 border border-gray-300 dark:border-slate-700 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-4 right-4 w-12 h-12 bg-amber-100 dark:bg-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <feature.icon className="w-6 h-6 text-amber-800 dark:text-slate-300" />
                  </div>
                  <feature.icon className="w-10 h-10 text-amber-800 dark:text-slate-300 mb-4" />
                  <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Get started in 3 simple steps
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 font-light">
              From signup to tracking in under 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900 text-2xl font-bold font-mono">
                1
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                Talk to AI
              </h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                Describe your goals, habits, and what you want to improve. Our AI listens and learns.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900 text-2xl font-bold font-mono">
                2
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                Get Your System
              </h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                AI generates your personalized Operations, habits, metrics, goals, and daily schedule.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900 text-2xl font-bold font-mono">
                3
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                Track & Improve
              </h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed font-light">
                Check in daily, see your progress, and watch yourself improve. Red or green—it's that simple.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-gradient-to-br from-amber-100/50 to-amber-50/30 dark:from-slate-800/50 dark:to-slate-900/30 py-20 md:py-28 border-y border-gray-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
                Loved by people building better lives
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 p-8 shadow-sm"
                >
                  <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-6 font-light italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-400 font-mono">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-400 font-light">
              Pay once. Use forever. No subscriptions. No hidden fees.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-800 dark:to-slate-800/50 border-2 border-gray-900 dark:border-white p-10 shadow-2xl">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900 dark:bg-white text-white dark:text-slate-900 text-xs font-mono tracking-wider uppercase">
                Limited Time
              </div>

              <div className="text-center space-y-6">
                <h3 className="text-2xl font-serif font-medium text-gray-900 dark:text-white">
                  Lifetime Access
                </h3>

                <div className="space-y-2">
                  <div className="text-6xl font-bold text-gray-900 dark:text-white font-mono">
                    $19
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400 font-mono uppercase tracking-wide">
                    One-time payment
                  </div>
                </div>

                <ul className="space-y-3 text-left">
                  {[
                    "AI-powered personalized setup",
                    "Unlimited habits & metrics",
                    "Goal tracking with subgoals",
                    "Daily schedule planner",
                    "7-day rolling view",
                    "Historical data & trends",
                    "Works on all devices (PWA)",
                    "Lifetime updates",
                    "No ads, ever"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-slate-300 font-light">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/onboarding" onClick={() => trackEvent('landing_pricing_cta_clicked', {})} className="block">
                  <Button
                    size="lg"
                    className="w-full group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>

                <p className="text-xs text-gray-600 dark:text-slate-400 font-mono">
                  Try 5 actions free • No credit card required
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white dark:bg-slate-900 py-20 md:py-28 border-y border-gray-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white mb-4">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <button
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <span className="text-lg font-medium text-gray-900 dark:text-white pr-8">
                      {faq.question}
                    </span>
                    <span className="text-2xl text-gray-600 dark:text-slate-400 flex-shrink-0">
                      {faqOpen === index ? "−" : "+"}
                    </span>
                  </button>
                  {faqOpen === index && (
                    <div className="px-8 pb-6 text-gray-700 dark:text-slate-300 leading-relaxed font-light border-t border-gray-200 dark:border-slate-700 pt-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-8 bg-gradient-to-br from-amber-100/50 to-amber-50/30 dark:from-slate-800/50 dark:to-slate-900/30 border-2 border-gray-900 dark:border-white p-12 md:p-16 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-medium text-gray-900 dark:text-white">
              Ready to see where you <span className="italic">actually</span> stand?
            </h2>
            <p className="text-lg text-gray-700 dark:text-slate-300 font-light">
              Join people who stopped guessing and started knowing. Your AI-powered life system is 5 minutes away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/onboarding" onClick={() => trackEvent('landing_final_cta_clicked', {})} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto group bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-8 h-12 rounded-sm font-mono text-sm tracking-wide uppercase shadow-lg hover:shadow-xl transition-all"
                >
                  Build Your System Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-slate-400 font-mono">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>5 Min Setup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="text-2xl font-serif font-medium mb-2">
                  Human <span className="italic">Operations</span>
                </div>
                <p className="text-sm text-gray-400 font-mono tracking-wider uppercase">
                  Your Life, Quantified
                </p>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-400">
                <Link href="/login" className="hover:text-white transition-colors">
                  Sign In
                </Link>
                <a href="mailto:support@humanoperations.app" className="hover:text-white transition-colors">
                  Support
                </a>
                <span className="font-mono">© 2025</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
