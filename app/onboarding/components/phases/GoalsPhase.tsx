"use client";

import { useState } from "react";
import { PhaseContainer } from "../PhaseContainer";
import { AIMessage } from "../AIMessage";
import { UserInput } from "../UserInput";

interface Operation {
  id: string;
  name: string;
  description: string;
}

interface Goal {
  id: string;
  operation_id: string;
  title: string;
  goal_type: string;
  subgoals?: string[];
}

interface GoalsPhaseProps {
  operations: Operation[];
  onComplete: (goals: Goal[]) => void;
}

export function GoalsPhase({ operations, onComplete }: GoalsPhaseProps) {
  const [currentOperationIndex, setCurrentOperationIndex] = useState(0);
  const [stage, setStage] = useState<'question' | 'processing' | 'showing' | 'error'>('question');
  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [currentGoals, setCurrentGoals] = useState<Goal[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const currentOperation = operations[currentOperationIndex];

  const handleUserResponse = async (response: string) => {
    setStage('processing');
    setErrorMessage('');

    try {
      const res = await fetch('/api/onboarding/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: response,
          phase: 'goals',
          context: {
            conversationHistory,
            extractedData: { operations },
            currentOperation: currentOperation.name // Add current operation context
          }
        })
      });

      if (!res.ok) {
        throw new Error('Failed to process your response');
      }

      const data = await res.json();

      console.log('API Response:', data); // Debug log

      if (data.error) {
        console.error('API returned error:', data.error);
        throw new Error(data.error);
      }

      // Update conversation history
      setConversationHistory([
        ...conversationHistory,
        { role: 'user', content: response },
        { role: 'assistant', content: data.aiMessage }
      ]);

      if (data.extractedData?.goals && data.extractedData.goals.length > 0) {
        const newGoals = data.extractedData.goals;
        setCurrentGoals(newGoals);
        setAllGoals([...allGoals, ...newGoals]);
        setStage('showing');

        // Auto-advance after showing
        setTimeout(() => {
          // Move to next operation or complete
          if (currentOperationIndex < operations.length - 1) {
            setCurrentOperationIndex(currentOperationIndex + 1);
            setStage('question');
            setCurrentGoals([]);
            setConversationHistory([]); // Reset conversation for next operation
          } else {
            // All operations done
            onComplete([...allGoals, ...newGoals]);
          }
        }, 4000);
      } else {
        console.warn('No goals extracted from response');
        setErrorMessage("I couldn't identify clear goals. Could you be more specific about what you want to achieve?");
        setStage('error');
      }
    } catch (error: any) {
      console.error('Failed to process response:', error);
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
          {/* Operation context badge */}
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700">
              <p className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
                {currentOperation.name} ({currentOperationIndex + 1}/{operations.length})
              </p>
            </div>
          </div>

          <AIMessage>
            <p>What does mastery look like here?</p>
            <br />
            <p className="text-xl text-gray-600 dark:text-slate-400">
              Where are you heading in the next season?
            </p>
          </AIMessage>

          <UserInput onSubmit={handleUserResponse} placeholder="Your aspirations..." />
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
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-amber-100/50 dark:bg-slate-900 border border-amber-800/20 dark:border-slate-700">
              <p className="text-xs font-mono tracking-wider text-amber-900 dark:text-slate-400 uppercase">
                {currentOperation.name}
              </p>
            </div>
          </div>

          <AIMessage>
            <p>{currentGoals.length} {currentGoals.length === 1 ? 'destination' : 'destinations'} identified.</p>
          </AIMessage>

          <div className="space-y-4 max-w-2xl mx-auto">
            {currentGoals.map((goal, index) => {
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
              return (
                <div
                  key={goal.id}
                  className="bg-card border border-border shadow-sm p-6 relative animate-fadeIn animate-glow overflow-hidden"
                  style={{ animationDelay: `${index * 200}ms` }}
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

                  <div className="relative space-y-3">
                    <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                      {romanNumerals[index]}.
                    </div>
                    <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h3>
                    {goal.subgoals && goal.subgoals.length > 0 && (
                      <ul className="space-y-2 ml-4">
                        {goal.subgoals.map((subgoal, idx) => (
                          <li key={idx} className="text-sm font-light text-gray-700 dark:text-slate-400 leading-relaxed flex items-start">
                            <span className="mr-2 text-gray-400">→</span>
                            {subgoal}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {currentOperationIndex < operations.length - 1 && (
            <AIMessage delay={2000}>
              <p>Moving forward.</p>
            </AIMessage>
          )}
        </div>
      )}
    </PhaseContainer>
  );
}
