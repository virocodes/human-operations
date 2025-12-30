"use client";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "I.",
    title: "Tell us your goals",
    description: "Share what you want to achieve. Our AI helps you break it down into trackable habits and metrics."
  },
  {
    number: "II.",
    title: "Get your custom system",
    description: "Receive a personalized dashboard with habits to track and metrics to measure. Review and adjust as needed."
  },
  {
    number: "III.",
    title: "Track daily progress",
    description: "Check in each day. Mark habits complete, log your metrics. Takes 2 minutes."
  },
  {
    number: "IV.",
    title: "See your trajectory",
    description: "Watch your data accumulate. Red or green—you'll know instantly if you're on track."
  }
];

export function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Section header */}
      <div className="mb-12 space-y-4">
        <div className="inline-block px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm">
          <span className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
            How It Works
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 dark:text-white">
          Four steps to clarity
        </h2>
        <p className="text-lg text-gray-700 dark:text-slate-300 max-w-2xl leading-relaxed font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
          From goals to progress in minutes. No complicated setup, no endless configuration.
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-8 shadow-sm"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

            <div className="space-y-3">
              <div className="text-sm font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                {step.number}
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
