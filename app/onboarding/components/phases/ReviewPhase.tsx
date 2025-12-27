"use client";

import { useState } from "react";
import { PhaseContainer } from "../PhaseContainer";
import { AIMessage } from "../AIMessage";
import type { Operation, Goal, Habit, Metric } from "@/lib/draft/types";

interface ReviewPhaseProps {
  operations: Operation[];
  goals: Goal[];
  habits: Habit[];
  metrics: Metric[];
  schedule: { wakeHour: number; sleepHour: number };
  onComplete: () => void;
}

export function ReviewPhase({ operations, goals, habits, metrics, schedule, onComplete }: ReviewPhaseProps) {
  const [stage, setStage] = useState<'showing' | 'finalizing'>('showing');

  const handleEnter = async () => {
    setStage('finalizing');

    try {
      const res = await fetch('/api/onboarding/finalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operations,
          goals,
          habits,
          metrics,
          schedule
        })
      });

      if (!res.ok) {
        throw new Error('Failed to finalize onboarding');
      }

      // Brief pause before completing
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      console.error('Failed to finalize:', error);
      // Could add error handling here
    }
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${period}`;
  };

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  return (
    <div className="min-h-screen flex flex-col">
      {stage === 'showing' && (
        <>
          <div className="flex-shrink-0 py-8">
            <AIMessage>
              <p>Your system has been constructed.</p>
              <br />
              <p className="text-xl text-gray-600 dark:text-slate-400">
                Everything is connected.
              </p>
            </AIMessage>
          </div>

          <div className="flex-1 overflow-y-scroll custom-scrollbar pb-40 px-6">
            <div className="max-w-5xl mx-auto space-y-6">
            {/* Schedule Banner */}
            <div className="bg-card border border-border shadow-sm p-6 relative overflow-hidden animate-fadeIn">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

              <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }}></div>

              <div className="relative flex items-center justify-center gap-12">
                <div className="text-center">
                  <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mb-2">Rise</p>
                  <p className="text-3xl font-serif font-light text-gray-900 dark:text-white">{formatHour(schedule.wakeHour)}</p>
                </div>
                <div className="text-2xl text-gray-400 dark:text-slate-600">→</div>
                <div className="text-center">
                  <p className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase mb-2">Rest</p>
                  <p className="text-3xl font-serif font-light text-gray-900 dark:text-white">{formatHour(schedule.sleepHour)}</p>
                </div>
              </div>
            </div>

            {/* Operations Grid */}
            <div className="space-y-6">
              {operations.map((operation, opIndex) => {
                const operationGoals = goals.filter(g => g.operation_id === operation.id);
                const operationHabits = habits.filter(h => h.linked_operation === operation.id);
                const operationMetrics = metrics.filter(m => m.linked_operation === operation.id);

                return (
                  <div
                    key={operation.id}
                    className="bg-card border border-border shadow-sm p-5 relative overflow-hidden animate-fadeIn"
                    style={{ animationDelay: `${opIndex * 100}ms` }}
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                      backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                      backgroundSize: '10px 10px'
                    }}></div>

                    <div className="relative space-y-4">
                      {/* Operation Header */}
                      <div>
                        <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                          {romanNumerals[opIndex]}. Operation
                        </div>
                        <h2 className="text-xl font-serif font-medium text-gray-900 dark:text-white mt-1">
                          {operation.name}
                        </h2>
                        <p className="text-xs text-gray-600 dark:text-slate-400 font-light mt-1">
                          {operation.description}
                        </p>
                      </div>

                      {/* Nested: Goals, Habits, Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Goals */}
                      {operationGoals.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                            Destinations
                          </div>
                          {operationGoals.map((goal) => (
                            <div key={goal.id} className="pl-3 border-l-2 border-gray-300 dark:border-slate-700">
                              <p className="text-xs font-serif text-gray-900 dark:text-white leading-relaxed">
                                {goal.title}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Habits */}
                      {operationHabits.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                            Anchors
                          </div>
                          {operationHabits.map((habit) => (
                            <div key={habit.id} className="pl-3 border-l-2 border-gray-300 dark:border-slate-700">
                              <p className="text-xs font-serif text-gray-900 dark:text-white leading-relaxed">
                                {habit.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Metrics */}
                      {operationMetrics.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                            Measures
                          </div>
                          {operationMetrics.map((metric) => (
                            <div key={metric.id} className="pl-3 border-l-2 border-gray-300 dark:border-slate-700">
                              <p className="text-xs font-serif text-gray-900 dark:text-white leading-relaxed">
                                {metric.name}
                              </p>
                              <p className="text-[10px] font-mono text-gray-500 dark:text-slate-500 mt-0.5">
                                {metric.optimal_value} {metric.unit}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Unlinked Habits */}
            {habits.some(h => !h.linked_operation) && (
              <div className="bg-card border border-border shadow-sm p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                  backgroundSize: '10px 10px'
                }}></div>

                <div className="relative space-y-3">
                  <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                    Daily Anchors
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {habits.filter(h => !h.linked_operation).map((habit) => (
                      <div key={habit.id} className="pl-3 border-l-2 border-gray-300 dark:border-slate-700">
                        <p className="text-xs font-serif text-gray-900 dark:text-white leading-relaxed">
                          {habit.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Unlinked Metrics */}
            {metrics.some(m => !m.linked_operation) && (
              <div className="bg-card border border-border shadow-sm p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                  backgroundSize: '10px 10px'
                }}></div>

                <div className="relative space-y-3">
                  <div className="text-[10px] font-mono tracking-wider text-gray-500 dark:text-slate-500 uppercase">
                    General Measures
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {metrics.filter(m => !m.linked_operation).map((metric) => (
                      <div key={metric.id} className="pl-3 border-l-2 border-gray-300 dark:border-slate-700">
                        <p className="text-xs font-serif text-gray-900 dark:text-white leading-relaxed">
                          {metric.name}
                        </p>
                        <p className="text-[10px] font-mono text-gray-500 dark:text-slate-500 mt-0.5">
                          {metric.optimal_value} {metric.unit}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-amber-50 dark:from-slate-950 via-amber-50/95 dark:via-slate-950/95 to-transparent pt-20 pb-8 z-10">
            <div className="text-center space-y-4">
              <div className="text-lg font-serif text-gray-900 dark:text-white">
                The architecture is complete.
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Ready to begin?
              </p>
              <button
                onClick={handleEnter}
                className="px-12 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 cursor-pointer shadow-lg"
              >
                Enter
              </button>
            </div>
          </div>
        </>
      )}

      {stage === 'finalizing' && (
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-8">
            <AIMessage>
              <p className="animate-pulse">Manifesting your system...</p>
            </AIMessage>
            <div className="text-center">
              <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700">
                <p className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase animate-pulse">
                  Initializing
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
