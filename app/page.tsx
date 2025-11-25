import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
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
              A systematic approach to daily operations. Track, measure, and optimize your personal metrics with precision and clarity.
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

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">I.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Systematic Tracking</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Document boolean and numeric metrics with customizable units for comprehensive data collection.
            </p>
          </div>

          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">II.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Visual Intelligence</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Immediate visual feedback through color-coded cells provides at-a-glance operational status.
            </p>
          </div>

          <div className="space-y-3 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">III.</div>
            <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">Operational Excellence</h3>
            <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
              Build consistency and maintain standards through daily documentation and review.
            </p>
          </div>
        </div>

        {/* Footer tagline */}
        <div className="mt-20 text-center">
          <p className="text-xs font-mono tracking-widest text-gray-500 dark:text-slate-600 uppercase">
            Optimizing Human Performance Since 2025
          </p>
        </div>
      </main>
    </div>
  );
}
