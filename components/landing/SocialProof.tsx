"use client";

interface Testimonial {
  quote: string;
  author: string;
  context: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Finally, a tracker that doesn't feel like homework. I actually look forward to checking in each day.",
    author: "Sarah K.",
    context: "Product Designer"
  },
  {
    quote: "The AI setup was surprisingly good. It suggested habits I hadn't even thought of that turned out to be crucial.",
    author: "Michael R.",
    context: "Software Engineer"
  },
  {
    quote: "I've tried every habit app out there. This is the first one that shows me the bigger picture, not just checkboxes.",
    author: "James L.",
    context: "Entrepreneur"
  }
];

const stats = [
  { value: "2 min", label: "Daily time commitment" },
  { value: "$19", label: "One-time payment" },
  { value: "Unlimited", label: "Habits & metrics" }
];

export function SocialProof() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      {/* Stats bar */}
      <div className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 shadow-sm"
            >
              <div className="text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-400 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="mb-12 space-y-4 text-center">
        <div className="inline-block px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm">
          <span className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
            Testimonials
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 dark:text-white">
          What users say
        </h2>
      </div>

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="relative bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 p-6 shadow-sm"
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-900 dark:border-[#e5e5e5]"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-900 dark:border-[#e5e5e5]"></div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light italic">
                "{testimonial.quote}"
              </p>
              <div className="pt-4 border-t border-gray-300 dark:border-slate-800">
                <div className="text-sm font-serif font-medium text-gray-900 dark:text-white">
                  {testimonial.author}
                </div>
                <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mt-1">
                  {testimonial.context}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
