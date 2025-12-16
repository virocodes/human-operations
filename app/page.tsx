"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/home');
      }
    };
    checkAuth();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950">
      <main className="max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="space-y-8 mb-32">
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
            <p className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
              Stop wondering if you're making progress. See exactly where you stand, every single day.
            </p>
          </div>

          <Link href="/home">
            <Button
              size="lg"
              className="group mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 px-6 h-11 rounded-sm font-mono text-sm tracking-wide uppercase cursor-pointer"
            >
              Begin Operations
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
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
        <div className="mt-20 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Your Life, Quantified
          </p>
        </div>
      </main>
    </div>
  );
}
