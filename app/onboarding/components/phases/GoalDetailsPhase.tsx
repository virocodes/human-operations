"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface GoalDetail {
  goal: string;
  details: string;
}

interface GoalDetailsPhaseProps {
  goals: string[];
  onComplete: (goalDetails: GoalDetail[]) => void;
  onBack: () => void;
}

export function GoalDetailsPhase({ goals, onComplete, onBack }: GoalDetailsPhaseProps) {
  const [details, setDetails] = useState<string[]>(goals.map(() => ''));
  const [errors, setErrors] = useState<string[]>([]);

  const updateDetail = (index: number, value: string) => {
    const newDetails = [...details];
    newDetails[index] = value;
    setDetails(newDetails);

    // Clear error for this field
    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);
  };

  const handleContinue = () => {
    // Validate
    const newErrors: string[] = [];
    let hasError = false;

    details.forEach((detail, index) => {
      if (detail.trim() === '') {
        newErrors[index] = 'Please describe how you\'ll achieve this goal';
        hasError = true;
      } else {
        newErrors[index] = '';
      }
    });

    setErrors(newErrors);

    if (hasError) return;

    // Create goal details array
    const goalDetails: GoalDetail[] = goals.map((goal, index) => ({
      goal,
      details: details[index].trim()
    }));

    onComplete(goalDetails);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full">
      {/* Header */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">
          How will you achieve these?
        </h1>
        <p className="text-xs sm:text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wider px-4">
          Describe the steps, habits, or metrics for each goal
        </p>
      </div>

      {/* Goal Details */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-3">
            {/* Goal Label */}
            <div className="bg-card border border-border shadow-sm p-4 relative overflow-hidden">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-400 dark:border-slate-600 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-400 dark:border-slate-600 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-400 dark:border-slate-600 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-400 dark:border-slate-600 pointer-events-none"></div>

              <div className="relative">
                <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mb-2">
                  Goal {index + 1}
                </div>
                <p className="text-lg font-serif text-gray-900 dark:text-white border-l-2 border-amber-800/30 dark:border-slate-700 pl-3">
                  {goal}
                </p>
              </div>
            </div>

            {/* Details Input */}
            <div className="relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>

              <textarea
                value={details[index]}
                onChange={(e) => updateDetail(index, e.target.value)}
                placeholder="What will you do? (e.g., daily habits, metrics to track...)"
                rows={4}
                className={`
                  w-full px-4 py-3
                  bg-card dark:bg-slate-900/50
                  border ${errors[index] ? 'border-red-500' : 'border-border'}
                  text-gray-900 dark:text-white
                  font-serif text-sm
                  focus:outline-none focus:ring-0
                  transition-colors
                  placeholder:text-gray-400 dark:placeholder:text-slate-600
                  resize-none
                `}
              />
            </div>

            {errors[index] && (
              <p className="text-xs text-red-500 font-mono ml-1">{errors[index]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white font-mono text-xs uppercase tracking-widest hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
