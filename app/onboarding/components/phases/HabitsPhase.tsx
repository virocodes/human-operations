"use client";

import { useState } from "react";
import { PhaseContainer } from "../PhaseContainer";
import { AIMessage } from "../AIMessage";
import { UserInput } from "../UserInput";

interface Habit {
  id: string;
  name: string;
  linked_operation?: string;
}

interface HabitsPhaseProps {
  onComplete: (habits: Habit[]) => void;
}

export function HabitsPhase({ onComplete }: HabitsPhaseProps) {
  const [stage, setStage] = useState<'question' | 'processing' | 'showing' | 'error'>('question');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleUserResponse = async (response: string) => {
    setStage('processing');
    setErrorMessage('');

    try {
      const res = await fetch('/api/onboarding/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: response,
          phase: 'habits',
          context: {
            conversationHistory: [],
            extractedData: {}
          }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to process your response');
      }

      const data = await res.json();

      console.log('Habits API Response:', data); // Debug log

      if (data.error) {
        console.error('Habits API returned error:', data.error);
        throw new Error(data.error);
      }

      if (data.extractedData?.habits && data.extractedData.habits.length > 0) {
        console.log('Extracted habits:', data.extractedData.habits);
        setHabits(data.extractedData.habits);
        setStage('showing');

        setTimeout(() => {
          onComplete(data.extractedData.habits);
        }, 4000);
      } else {
        console.warn('No habits extracted from response');
        setErrorMessage("I couldn't identify clear habits. Could you be more specific about your daily practices?");
        setStage('error');
      }
    } catch (error: any) {
      console.error('Failed to process habits response:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
      setStage('error');
    }
  };

  const handleRetry = () => {
    setStage('question');
    setErrorMessage('');
  };

  return (
    <PhaseContainer>
      {stage === 'question' && (
        <div className="space-y-12">
          <AIMessage>
            <p>What rituals anchor your days?</p>
            <br />
            <p className="text-xl text-gray-600 dark:text-slate-400">
              The small things done consistently.
            </p>
          </AIMessage>

          <UserInput onSubmit={handleUserResponse} placeholder="Your daily practices..." />
        </div>
      )}

      {stage === 'processing' && (
        <div className="space-y-8">
          <AIMessage>
            <p className="animate-pulse">Reading...</p>
          </AIMessage>
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700">
              <p className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase animate-pulse">
                Processing
              </p>
            </div>
          </div>
        </div>
      )}

      {stage === 'error' && (
        <div className="space-y-12">
          <AIMessage>
            <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
          </AIMessage>

          <div className="flex justify-center">
            <button
              onClick={handleRetry}
              className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 cursor-pointer shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {stage === 'showing' && (
        <div className="space-y-12">
          <AIMessage>
            <p>{habits.length} {habits.length === 1 ? 'anchor' : 'anchors'} established.</p>
          </AIMessage>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {habits.map((habit, index) => {
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
              return (
                <div
                  key={habit.id}
                  className="bg-card border border-border shadow-sm p-6 relative animate-fadeIn animate-glow overflow-hidden"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Corner brackets */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

                  <div className="relative space-y-3 text-center">
                    <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                      {romanNumerals[index]}.
                    </div>
                    <h3 className="text-base font-serif font-medium text-gray-900 dark:text-white">
                      {habit.name}
                    </h3>
                    {/* Checkbox preview */}
                    <div className="pt-2">
                      <div className="w-6 h-6 border-2 border-gray-300 dark:border-slate-700 mx-auto"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AIMessage delay={2000}>
            <p>Your foundation is set.</p>
          </AIMessage>
        </div>
      )}
    </PhaseContainer>
  );
}
