"use client";

import { useState } from "react";
import { PhaseContainer } from "../PhaseContainer";
import { AIMessage } from "../AIMessage";
import { X, Plus } from "lucide-react";

interface GoalsInputPhaseProps {
  onComplete: (goals: string[]) => void;
}

export function GoalsInputPhase({ onComplete }: GoalsInputPhaseProps) {
  const [goals, setGoals] = useState<string[]>(['', '']);
  const [errors, setErrors] = useState<string[]>([]);

  const addGoal = () => {
    if (goals.length < 4) {
      setGoals([...goals, '']);
    }
  };

  const removeGoal = (index: number) => {
    if (goals.length > 2) {
      setGoals(goals.filter((_, i) => i !== index));
      setErrors(errors.filter((_, i) => i !== index));
    }
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);

    // Clear error for this field
    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);
  };

  const handleContinue = () => {
    // Validate
    const newErrors: string[] = [];
    let hasError = false;

    goals.forEach((goal, index) => {
      if (goal.trim() === '') {
        newErrors[index] = 'Goal cannot be empty';
        hasError = true;
      } else {
        newErrors[index] = '';
      }
    });

    setErrors(newErrors);

    if (!hasError) {
      const validGoals = goals.map(g => g.trim());
      onComplete(validGoals);
    }
  };

  return (
    <PhaseContainer>
      <div className="space-y-12 max-w-2xl mx-auto">
        <AIMessage>
          <p>What are your main goals?</p>
          <br />
          <p className="text-xl text-gray-600 dark:text-slate-400">
            Share 2-4 things you want to achieve in this season of your life.
          </p>
        </AIMessage>

        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="relative">
                <div className="relative">
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-400 dark:border-slate-600 pointer-events-none z-10"></div>

                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    placeholder={`Goal ${index + 1}`}
                    className={`
                      w-full px-4 py-3
                      bg-card dark:bg-slate-900/50
                      border ${errors[index] ? 'border-red-500' : 'border-border'}
                      text-gray-900 dark:text-white
                      font-serif text-base
                      focus:outline-none focus:ring-0
                      transition-colors
                      placeholder:text-gray-400 dark:placeholder:text-slate-600
                    `}
                  />
                </div>

                {goals.length > 2 && (
                  <button
                    onClick={() => removeGoal(index)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+0.75rem)] p-2 hover:bg-accent rounded transition-colors cursor-pointer"
                    aria-label="Remove goal"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {errors[index] && (
                <p className="text-xs text-red-500 font-mono ml-1">
                  {errors[index]}
                </p>
              )}
            </div>
          ))}

          {goals.length < 4 && (
            <button
              onClick={addGoal}
              className="
                w-full py-3
                border border-dashed border-border
                text-muted-foreground
                font-mono text-xs uppercase tracking-wider
                hover:border-gray-900 dark:hover:border-white
                hover:text-gray-900 dark:hover:text-white
                transition-all
                flex items-center justify-center gap-2
                cursor-pointer
              "
            >
              <Plus className="h-4 w-4" />
              Add Goal (max 4)
            </button>
          )}
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleContinue}
            className="
              px-12 py-3
              bg-gray-900 dark:bg-white
              text-white dark:text-gray-900
              font-mono text-xs uppercase tracking-widest
              hover:scale-[1.02]
              transition-all duration-150
              cursor-pointer
              shadow-lg
            "
          >
            Generate System
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-wider">
            AI will design your complete system
          </p>
        </div>
      </div>
    </PhaseContainer>
  );
}
