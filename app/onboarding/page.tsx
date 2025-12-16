"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, X } from "lucide-react";
import { ReviewPage } from "./components/ReviewPage";
import { GoalDetailsPhase } from "./components/phases/GoalDetailsPhase";

interface Operation {
  id: string;
  name: string;
  description: string;
  linked_goals?: string[];
}

interface Habit {
  id: string;
  name: string;
  linked_operation: string;
}

interface Metric {
  id: string;
  name: string;
  unit: string;
  optimal_value: number;
  minimum_value: number;
  operator: string;
  linked_operation: string;
}

interface Goal {
  id: string;
  operation_name?: string;
  operation_id?: string;
  title: string;
  goal_type: string;
}

interface GoalDetail {
  goal: string;
  details: string;
}

type Stage = 'input' | 'goal-details' | 'loading' | 'review';

const LOADING_STAGES = [
  {
    label: "I",
    text: "Analyzing ambitions",
  },
  {
    label: "II",
    text: "Architecting operations",
  },
  {
    label: "III",
    text: "Calibrating metrics",
  },
  {
    label: "IV",
    text: "Structuring system",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [stage, setStage] = useState<Stage>('input');
  const [goals, setGoals] = useState<string[]>(['', '']);
  const [goalDetails, setGoalDetails] = useState<GoalDetail[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Generated data
  const [operations, setOperations] = useState<Operation[]>([]);
  const [generatedGoals, setGeneratedGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [schedule, setSchedule] = useState<{ wakeHour: number; sleepHour: number } | null>(null);

  useEffect(() => {
    // Cycle through loading stages
    if (stage === 'loading') {
      const interval = setInterval(() => {
        setLoadingStageIndex((prev) => (prev + 1) % LOADING_STAGES.length);
      }, 2500); // Change stage every 2.5 seconds

      return () => clearInterval(interval);
    } else {
      setLoadingStageIndex(0); // Reset when not loading
    }
  }, [stage]);

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

    const newErrors = [...errors];
    newErrors[index] = '';
    setErrors(newErrors);
  };

  const handleGenerate = () => {
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

    if (hasError) return;

    // Go to goal details stage
    setStage('goal-details');
  };

  const handleGoalDetailsComplete = async (details: GoalDetail[]) => {
    setGoalDetails(details);

    // Start loading
    setStage('loading');

    try {
      const response = await fetch('/api/onboarding/generate-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalDetails: details
        })
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Set all the generated data
      setOperations(data.operations || []);
      setGeneratedGoals(data.goals || []);
      setHabits(data.habits || []);
      setMetrics(data.metrics || []);
      setSchedule(data.schedule || null);

      setStage('review');
    } catch (error: any) {
      console.error('Generation error:', error);
      alert('Failed to generate system: ' + (error.message || 'Unknown error'));
      setStage('input');
    }
  };

  const handleFinalize = async () => {
    if (isFinalizing) return; // Prevent double-clicks

    setIsFinalizing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Please log in first');
        setIsFinalizing(false);
        return;
      }

      // Transform goals to use operation_id instead of operation_name
      const goalsWithOperationIds = generatedGoals.map(goal => {
        // Find the operation by name
        const operation = operations.find(op => op.name === goal.operation_name);
        return {
          ...goal,
          operation_id: operation?.id,
          operation_name: undefined // Remove operation_name
        };
      });

      // Transform habits to use operation_id instead of linked_operation name
      const habitsWithOperationIds = habits.map(habit => {
        const operation = operations.find(op => op.name === habit.linked_operation);
        return {
          ...habit,
          linked_operation: operation?.id
        };
      });

      // Transform metrics to use operation_id instead of linked_operation name
      const metricsWithOperationIds = metrics.map(metric => {
        const operation = operations.find(op => op.name === metric.linked_operation);
        return {
          ...metric,
          linked_operation: operation?.id
        };
      });

      // Save all data to database
      const response = await fetch('/api/onboarding/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operations,
          goals: goalsWithOperationIds,
          habits: habitsWithOperationIds,
          metrics: metricsWithOperationIds,
          schedule
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }

      // Use window.location instead of router.push to force a full page reload
      // This ensures the middleware re-checks the onboarding state
      window.location.href = '/home';
    } catch (error) {
      console.error('Finalize error:', error);
      alert('Failed to save system: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setIsFinalizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/30 dark:bg-slate-950 p-6 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto">
        {/* Input Stage */}
        {stage === 'input' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-serif font-light text-gray-900 dark:text-white">
                What are your main goals?
              </h1>
              <p className="text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wider">
                Share 2-4 things you want to achieve
              </p>
            </div>

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
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  {errors[index] && (
                    <p className="text-xs text-red-500 font-mono ml-1">{errors[index]}</p>
                  )}
                </div>
              ))}

              {goals.length < 4 && (
                <button
                  onClick={addGoal}
                  className="w-full py-3 border border-dashed border-border text-muted-foreground font-mono text-xs uppercase tracking-wider hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Goal (max 4)
                </button>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleGenerate}
                className="px-12 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 shadow-lg cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Goal Details Stage */}
        {stage === 'goal-details' && (
          <GoalDetailsPhase
            goals={goals.filter(g => g.trim() !== '')}
            onComplete={handleGoalDetailsComplete}
            onBack={() => setStage('input')}
          />
        )}

        {/* Loading Stage */}
        {stage === 'loading' && (
          <div className="min-h-[60vh] flex items-center justify-center animate-fadeIn">
            <div className="max-w-2xl w-full">
              {/* Main Loading Container */}
              <div className="bg-card border border-border shadow-sm p-8 relative overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5]"></div>

                {/* Grid pattern background */}
                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                  backgroundSize: '10px 10px'
                }}></div>

                <div className="relative space-y-8">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                      System Generation
                    </div>
                    <h2 className="text-2xl font-serif font-light text-gray-900 dark:text-white">
                      Designing your architecture
                    </h2>
                  </div>

                  {/* Stages List */}
                  <div className="space-y-4">
                    {LOADING_STAGES.map((stageItem, index) => {
                      const isActive = index === loadingStageIndex;
                      const isPast = index < loadingStageIndex;

                      return (
                        <div
                          key={index}
                          className={`
                            flex items-center gap-4 pl-4 py-3 border-l-2 transition-all duration-500
                            ${isActive
                              ? 'border-gray-900 dark:border-white'
                              : isPast
                              ? 'border-gray-400 dark:border-slate-600'
                              : 'border-gray-300 dark:border-slate-700'}
                          `}
                        >
                          <div className={`
                            text-xs font-mono tracking-wider uppercase transition-all duration-500
                            ${isActive
                              ? 'text-gray-900 dark:text-white'
                              : isPast
                              ? 'text-gray-500 dark:text-slate-500'
                              : 'text-gray-400 dark:text-slate-600'}
                          `}>
                            {stageItem.label}.
                          </div>
                          <div className={`
                            text-sm font-serif transition-all duration-500
                            ${isActive
                              ? 'text-gray-900 dark:text-white font-medium'
                              : isPast
                              ? 'text-gray-600 dark:text-slate-400'
                              : 'text-gray-400 dark:text-slate-600'}
                          `}>
                            {stageItem.text}
                          </div>
                          {isActive && (
                            <div className="ml-auto flex gap-1">
                              <span className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                              <span className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                              <span className="w-1 h-1 bg-gray-900 dark:bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                          )}
                          {isPast && (
                            <div className="ml-auto text-gray-500 dark:text-slate-500 text-xs">✓</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="text-center pt-4">
                    <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700">
                      <p className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
                        Please wait
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Stage */}
        {stage === 'review' && (
          <ReviewPage
            operations={operations}
            goals={generatedGoals}
            habits={habits}
            metrics={metrics}
            schedule={schedule}
            onUpdate={(data) => {
              setOperations(data.operations);
              setGeneratedGoals(data.goals);
              setHabits(data.habits);
              setMetrics(data.metrics);
              setSchedule(data.schedule);
            }}
            onStartOver={() => setStage('input')}
            onFinalize={handleFinalize}
            isFinalizing={isFinalizing}
          />
        )}
      </div>
    </div>
  );
}
