"use client";

import { useState } from "react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Is this really a one-time payment?",
    answer: "Yes. You pay $19 once and get lifetime access. No recurring charges, no hidden fees. We believe in simple, transparent pricing."
  },
  {
    question: "How is this different from other habit trackers?",
    answer: "Most habit trackers are just glorified checklists. We focus on the full picture: habits + metrics + goals. You see not just what you did, but whether it's moving the needle on what actually matters to you."
  },
  {
    question: "What if I'm not sure what to track?",
    answer: "That's exactly what our AI-powered onboarding is for. You tell us your goals, and we suggest specific habits and metrics to track. You can always adjust later."
  },
  {
    question: "Do I need to track every day?",
    answer: "The system works best with daily check-ins (takes about 2 minutes), but life happens. You can backfill recent days if you miss one. The key is consistency over perfection."
  },
  {
    question: "What happens to my data?",
    answer: "Your data lives in our secure database and is always accessible to you. We'll never sell it or use it for anything other than powering your dashboard. You own your data."
  },
  {
    question: "Can I get a refund if it's not for me?",
    answer: "Absolutely. We offer a 30-day money-back guarantee, no questions asked. If it's not helping you make progress, we'll refund you in full."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      {/* Section header */}
      <div className="mb-12 space-y-4">
        <div className="inline-block px-3 py-1 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm">
          <span className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
            Questions
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-light tracking-tight text-gray-900 dark:text-white">
          Common questions
        </h2>
      </div>

      {/* FAQ list */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white/60 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-6 hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                <span className="text-2xl font-light text-gray-600 dark:text-slate-400 flex-shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
            </button>

            {openIndex === index && (
              <div className="px-6 pb-6">
                <p className="text-gray-700 dark:text-slate-400 leading-relaxed text-sm font-light border-l-2 border-amber-800/30 dark:border-slate-700 pl-4">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
