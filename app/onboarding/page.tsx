"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Plus, X } from "lucide-react";
import { ReviewPage } from "./components/ReviewPage";
import { GoalDetailsPhase } from "./components/phases/GoalDetailsPhase";
import { createDraft, getDraft, updateDraft, clearDraft, isDraftExpired } from "@/lib/draft/storage";
import { trackEvent } from "@/lib/analytics/client";
import type { Operation, Habit, Metric, Goal, GoalDetail, Stage } from "@/lib/draft/types";

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
  const [isClaimingDraft, setIsClaimingDraft] = useState(false);

  // Draft mode state
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);

  // Generated data
  const [operations, setOperations] = useState<Operation[]>([]);
  const [generatedGoals, setGeneratedGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [schedule, setSchedule] = useState<{ wakeHour: number; sleepHour: number } | null>(null);

  // Initialize draft mode on mount
  useEffect(() => {
    const initializeDraft = async () => {
      // Check if user is already authenticated
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check if user has completed onboarding
        const { data: onboardingState } = await supabase
          .from('onboarding_state')
          .select('current_phase')
          .eq('user_id', user.id)
          .single();

        if (onboardingState?.current_phase === 'complete') {
          // User already completed onboarding - clear any stale drafts
          const draft = getDraft();
          if (draft) {
            clearDraft();
          }
          router.push('/home');
          return;
        }

        // User authenticated but hasn't completed onboarding
        const draft = getDraft();

        if (draft && isDraftExpired(draft)) {
          // Draft expired - clear it and start fresh
          clearDraft();
          // Fall through to create new draft below
        } else if (draft) {
          // Valid draft exists - claim it
          setDraftId(draft.draftId);
          setIsDraftMode(true);
          setOperations(draft.operations || []);
          setGeneratedGoals(draft.generatedGoals || []);
          setHabits(draft.habits || []);
          setMetrics(draft.metrics || []);
          setSchedule(draft.schedule);
          setIsClaimingDraft(true);

          await claimDraft();
          return;
        }

        // No draft - authenticated user starting fresh onboarding (edge case)
        const newDraft = createDraft();
        setDraftId(newDraft.draftId);
        setIsDraftMode(false); // Not in draft mode since they're authenticated
        trackEvent('onboarding_started', { draft_mode: false }, newDraft.draftId);
        return;
      }

      // Anonymous user - check for existing draft
      const draft = getDraft();
      if (draft && !isDraftExpired(draft)) {
        // Resume existing draft
        setDraftId(draft.draftId);
        setIsDraftMode(true);
        setStage(draft.stage);
        setGoals(draft.goals);
        setGoalDetails(draft.goalDetails);
        setOperations(draft.operations || []);
        setGeneratedGoals(draft.generatedGoals || []);
        setHabits(draft.habits || []);
        setMetrics(draft.metrics || []);
        setSchedule(draft.schedule);
      } else {
        // New draft
        const newDraft = createDraft();
        setDraftId(newDraft.draftId);
        setIsDraftMode(true);

        // Track analytics
        trackEvent('onboarding_started', { draft_mode: true }, newDraft.draftId);
      }
    };

    initializeDraft();
  }, []); // Run once on mount

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

    // Save to draft before proceeding
    if (isDraftMode && draftId) {
      updateDraft({
        stage: 'goal-details',
        goals
      });

      trackEvent('onboarding_stage_completed', {
        stage_name: 'input',
        goals_count: goals.length
      }, draftId);
    }

    // Go to goal details stage
    setStage('goal-details');
  };

  const handleGoalDetailsComplete = async (details: GoalDetail[]) => {
    setGoalDetails(details);

    // Save to draft
    if (isDraftMode && draftId) {
      updateDraft({
        stage: 'loading',
        goalDetails: details
      });

      trackEvent('onboarding_stage_completed', {
        stage_name: 'goal-details'
      }, draftId);
    }

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

      // Save generated system to draft
      if (isDraftMode && draftId) {
        updateDraft({
          stage: 'review',
          operations: data.operations || [],
          generatedGoals: data.goals || [],
          habits: data.habits || [],
          metrics: data.metrics || [],
          schedule: data.schedule || null
        });

        trackEvent('system_generated_viewed', {}, draftId);
      }

      setStage('review');
    } catch (error: any) {
      console.error('Generation error:', error);
      alert('Failed to generate system: ' + (error.message || 'Unknown error'));
      setStage('input');
    }
  };

  const handleSaveSystem = async () => {
    if (isFinalizing) return;

    setIsFinalizing(true);

    // Check if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // Not authenticated - redirect to login with draft context
      trackEvent('auth_started', {
        source: 'onboarding'
      }, draftId || undefined);

      // Store redirect intent
      if (typeof window !== 'undefined') {
        localStorage.setItem('humanops_post_auth_action', 'claim_draft');
      }

      // Redirect to login
      router.push(`/login?source=onboarding&draftId=${draftId}`);
      return;
    }

    // Already authenticated - claim draft immediately
    await claimDraft();
  };

  const claimDraft = async () => {
    try {
      const draft = getDraft();
      if (!draft) {
        throw new Error('No draft found');
      }

      // Use draft data directly instead of state (state updates are async and may not be ready)
      const draftOperations = draft.operations || [];
      const draftGoals = draft.generatedGoals || [];
      const draftHabits = draft.habits || [];
      const draftMetrics = draft.metrics || [];
      const draftSchedule = draft.schedule;

      // Transform data (same as original finalize logic)
      const goalsWithOperationIds = draftGoals.map(goal => {
        const operation = draftOperations.find(op => op.name === goal.operation_name);
        return {
          ...goal,
          operation_id: operation?.id,
          operation_name: undefined
        };
      });

      const habitsWithOperationIds = draftHabits.map(habit => {
        const operation = draftOperations.find(op => op.name === habit.linked_operation);
        return {
          ...habit,
          linked_operation: operation?.id
        };
      });

      const metricsWithOperationIds = draftMetrics.map(metric => {
        const operation = draftOperations.find(op => op.name === metric.linked_operation);
        return {
          ...metric,
          linked_operation: operation?.id
        };
      });

      // Call draft claim API
      const response = await fetch('/api/draft/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draftId: draft.draftId,
          operations: draftOperations,
          goals: goalsWithOperationIds,
          habits: habitsWithOperationIds,
          metrics: metricsWithOperationIds,
          schedule: draftSchedule
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to claim draft');
      }

      // Clear draft from localStorage
      clearDraft();

      // Redirect to home
      window.location.href = '/home';
    } catch (error) {
      console.error('Draft claim error:', error);
      alert('Failed to save system. Please try again.');
      setIsFinalizing(false);
      setIsClaimingDraft(false);
    }
  };

  // Show loading screen while claiming draft
  if (isClaimingDraft) {
    return (
      <div className="h-screen bg-amber-50/30 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-serif font-light text-gray-900 dark:text-white">
            Saving your system...
          </div>
          <div className="text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wider">
            Please wait
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-amber-50/30 dark:bg-slate-950 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      <div className={`max-w-4xl w-full mx-auto ${(stage === 'input' || stage === 'goal-details' || stage === 'loading') ? 'min-h-full flex items-center' : ''}`}>
        {/* Input Stage */}
        {stage === 'input' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn w-full">
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-light text-gray-900 dark:text-white">
                What are your main goals?
              </h1>
              <p className="text-xs sm:text-sm font-mono text-gray-600 dark:text-slate-400 uppercase tracking-wider">
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
                        className="absolute right-2 top-2 sm:right-0 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-[calc(100%+0.75rem)] p-2 hover:bg-accent rounded transition-colors cursor-pointer"
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
                className="w-full sm:w-auto px-8 sm:px-12 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 shadow-lg cursor-pointer"
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
          <div className="flex items-center justify-center animate-fadeIn w-full">
            <div className="max-w-2xl w-full">
              {/* Main Loading Container */}
              <div className="bg-card border border-border shadow-sm p-4 sm:p-6 md:p-8 relative overflow-hidden">
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
          <>
            {/* Draft mode banner - fixed in top right corner of PAGE */}
            {isDraftMode && (
              <div className="fixed top-6 right-6 z-50">
                <div className="inline-block px-3 py-1.5 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700 rounded-sm shadow-sm">
                  <p className="text-xs font-mono text-amber-900 dark:text-slate-400 uppercase tracking-wider">
                    Draft • Not Saved
                  </p>
                </div>
              </div>
            )}

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
              onFinalize={handleSaveSystem}
              isFinalizing={isFinalizing}
              ctaText={isDraftMode ? "Save My System" : "Finalize System"}
            />
          </>
        )}
      </div>
    </div>
  );
}
