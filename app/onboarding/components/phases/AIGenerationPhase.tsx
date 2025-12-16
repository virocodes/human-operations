"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Sparkles, Brain, Zap, CheckCircle2 } from "lucide-react";

interface Operation {
  id: string;
  name: string;
  description: string;
  linked_goals: string[];
}

interface Habit {
  id: string;
  name: string;
  linked_operation: string;
  reasoning: string;
}

interface Metric {
  id: string;
  name: string;
  unit: string;
  optimal_value: number;
  minimum_value: number;
  operator: string;
  linked_operation: string;
  reasoning: string;
}

interface Schedule {
  wakeHour: number;
  sleepHour: number;
  reasoning: string;
}

interface Goal {
  id: string;
  operation_id: string;
  title: string;
  goal_type: string;
}

interface GeneratedSystemData {
  operations: Operation[];
  goals: Goal[];
  habits: Habit[];
  metrics: Metric[];
  schedule: Schedule;
}

interface AIGenerationPhaseProps {
  goals: string[];
  onComplete: (data: GeneratedSystemData) => void;
}

const LOADING_STAGES = [
  {
    text: "Analyzing your ambitions...",
    icon: Brain,
    color: "text-purple-500 dark:text-purple-400"
  },
  {
    text: "Architecting operations...",
    icon: Sparkles,
    color: "text-blue-500 dark:text-blue-400"
  },
  {
    text: "Calibrating metrics...",
    icon: Zap,
    color: "text-amber-500 dark:text-amber-400"
  },
  {
    text: "Weaving connections...",
    icon: CheckCircle2,
    color: "text-green-500 dark:text-green-400"
  },
];

export function AIGenerationPhase({ goals, onComplete }: AIGenerationPhaseProps) {
  const [thinkingText, setThinkingText] = useState('');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [stage, setStage] = useState<'connecting' | 'generating' | 'complete' | 'error'>('connecting');
  const [error, setError] = useState<string>('');
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);

  const thinkingRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll thinking text
    if (thinkingRef.current) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
    }
  }, [thinkingText]);

  useEffect(() => {
    // Cycle through loading stages
    if (stage === 'generating') {
      const interval = setInterval(() => {
        setLoadingStageIndex((prev) => (prev + 1) % LOADING_STAGES.length);
      }, 3000); // Change stage every 3 seconds

      return () => clearInterval(interval);
    }
  }, [stage]);

  useEffect(() => {
    // Start generation
    const eventSource = new EventSource(
      `/api/onboarding/generate?goals=${encodeURIComponent(JSON.stringify(goals))}`
    );

    // Track state locally for the completion callback
    let localOperations: Operation[] = [];
    let localHabits: Habit[] = [];
    let localMetrics: Metric[] = [];
    let localSchedule: Schedule | null = null;

    eventSource.onopen = () => {
      setStage('generating');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'thinking') {
          setThinkingText(prev => prev + data.content);
        } else if (data.type === 'operation') {
          localOperations.push(data.data);
          setOperations(prev => [...prev, data.data]);
        } else if (data.type === 'habit') {
          localHabits.push(data.data);
          setHabits(prev => [...prev, data.data]);
        } else if (data.type === 'metric') {
          localMetrics.push(data.data);
          setMetrics(prev => [...prev, data.data]);
        } else if (data.type === 'schedule') {
          localSchedule = data.data;
          setSchedule(data.data);
        } else if (data.type === 'complete') {
          setStage('complete');
          eventSource.close();

          // Brief pause before completing
          setTimeout(() => {
            // Generate goals from user input + operations
            const generatedGoals: Goal[] = [];
            localOperations.forEach((op) => {
              op.linked_goals.forEach((goalText) => {
                generatedGoals.push({
                  id: `goal-${Date.now()}-${generatedGoals.length}`,
                  operation_id: op.id,
                  title: goalText,
                  goal_type: 'metric_based', // Default, can be inferred
                });
              });
            });

            onComplete({
              operations: localOperations,
              goals: generatedGoals,
              habits: localHabits,
              metrics: localMetrics,
              schedule: localSchedule || { wakeHour: 6, sleepHour: 23, reasoning: 'Default schedule' }
            });
          }, 1500);
        } else if (data.type === 'error') {
          setError(data.message || 'Generation failed');
          setStage('error');
          eventSource.close();
        }
      } catch (err) {
        console.error('Failed to parse SSE message:', err);
      }
    };

    eventSource.onerror = () => {
      setError('Connection lost. Please try again.');
      setStage('error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (stage === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg font-serif text-gray-900 dark:text-white">
              System generation encountered an error
            </p>
            <p className="text-sm text-red-500 font-mono">
              {error}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="
              px-8 py-3
              bg-gray-900 dark:bg-white
              text-white dark:text-gray-900
              font-mono text-xs uppercase tracking-widest
              hover:scale-[1.02]
              transition-all duration-150
              cursor-pointer
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentStage = LOADING_STAGES[loadingStageIndex];
  const StageIcon = currentStage.icon;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 py-8 text-center">
        {stage === 'connecting' && (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-gray-600 dark:text-slate-500" />
            <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
              Connecting to AI...
            </div>
          </div>
        )}
        {stage === 'generating' && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3 animate-fadeIn">
              <StageIcon className={`h-6 w-6 animate-pulse ${currentStage.color}`} />
              <div className="text-sm font-serif text-gray-900 dark:text-white">
                {currentStage.text}
              </div>
            </div>
            <div className="flex gap-2">
              {LOADING_STAGES.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-8 rounded-full transition-all duration-500 ${
                    index === loadingStageIndex
                      ? 'bg-gray-900 dark:bg-white'
                      : 'bg-gray-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        {stage === 'complete' && (
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
            <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
              System Complete
            </div>
          </div>
        )}
      </div>

      {/* Split Screen */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 px-6 pb-20">
        {/* Left Panel: Thinking */}
        <div className="bg-card border border-border shadow-sm p-6 relative overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

          <div className="relative h-full flex flex-col">
            <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mb-4">
              AI Reasoning
            </div>

            <div
              ref={thinkingRef}
              className="flex-1 overflow-y-auto custom-scrollbar font-serif text-sm text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap"
            >
              {thinkingText ? (
                thinkingText
              ) : stage === 'generating' ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                    <StageIcon className={`h-5 w-5 animate-pulse ${currentStage.color}`} />
                    <span className="text-sm font-serif italic">{currentStage.text}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-slate-500 font-mono">
                    The AI is analyzing your goals and crafting a personalized system...
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Establishing connection...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Generated Items */}
        <div className="bg-card border border-border shadow-sm p-6 relative overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

          <div className="relative h-full flex flex-col">
            <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mb-4">
              Your System
            </div>

            <div
              ref={itemsRef}
              className="flex-1 overflow-y-auto custom-scrollbar space-y-6"
            >
              {/* Operations */}
              {operations.map((op, index) => (
                <div
                  key={op.id}
                  className="animate-fadeIn p-4 border-l-2 border-amber-800/30 dark:border-slate-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                    {['I', 'II', 'III', 'IV'][index]}. Operation
                  </div>
                  <div className="text-base font-serif font-medium text-gray-900 dark:text-white mt-1">
                    {op.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 font-light mt-1">
                    {op.description}
                  </div>
                </div>
              ))}

              {/* Habits */}
              {habits.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                    Daily Anchors
                  </div>
                  {habits.map((habit, index) => (
                    <div
                      key={habit.id}
                      className="animate-fadeIn pl-3 border-l-2 border-gray-300 dark:border-slate-700"
                      style={{ animationDelay: `${(operations.length + index) * 100}ms` }}
                    >
                      <div className="text-sm font-serif text-gray-900 dark:text-white">
                        {habit.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-slate-400 mt-0.5">
                        {habit.reasoning}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics */}
              {metrics.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                    Measurements
                  </div>
                  {metrics.map((metric, index) => (
                    <div
                      key={metric.id}
                      className="animate-fadeIn pl-3 border-l-2 border-gray-300 dark:border-slate-700"
                      style={{ animationDelay: `${(operations.length + habits.length + index) * 100}ms` }}
                    >
                      <div className="text-sm font-serif text-gray-900 dark:text-white">
                        {metric.name}
                      </div>
                      <div className="text-xs font-mono text-gray-500 dark:text-slate-500 mt-0.5">
                        {metric.optimal_value} {metric.unit}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Schedule */}
              {schedule && (
                <div className="animate-fadeIn pt-4">
                  <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase mb-2">
                    Daily Rhythm
                  </div>
                  <div className="flex items-center gap-4 text-sm font-serif text-gray-900 dark:text-white">
                    <span>{schedule.wakeHour}:00 AM</span>
                    <span>→</span>
                    <span>{schedule.sleepHour}:00 PM</span>
                  </div>
                </div>
              )}

              {stage === 'complete' && (
                <div className="animate-fadeIn pt-6">
                  <div className="text-center py-4 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700">
                    <p className="text-sm font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
                      System Complete
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
