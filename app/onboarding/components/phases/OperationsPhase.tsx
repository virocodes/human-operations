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

interface OperationsPhaseProps {
  onComplete: (operations: Operation[]) => void;
}

export function OperationsPhase({ onComplete }: OperationsPhaseProps) {
  const [stage, setStage] = useState<'question' | 'processing' | 'showing' | 'error'>('question');
  const [operations, setOperations] = useState<Operation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleUserResponse = async (response: string) => {
    setStage('processing');
    setErrorMessage('');

    try {
      // Call API to extract operations
      const res = await fetch('/api/onboarding/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: response,
          phase: 'operations',
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

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.extractedData?.operations && data.extractedData.operations.length > 0) {
        setOperations(data.extractedData.operations);
        setStage('showing');

        // Auto-advance after showing
        setTimeout(() => {
          onComplete(data.extractedData.operations);
        }, 4000);
      } else {
        // If no operations extracted, ask for clarification
        setErrorMessage("I couldn't identify clear focus areas from your response. Could you be more specific about what's important to you right now?");
        setStage('error');
      }
    } catch (error: any) {
      console.error('Failed to process response:', error);
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
            <p>Let's begin.</p>
            <br />
            <p>What calls to you most in this season of your life?</p>
            <br />
            <p className="text-xl text-gray-600 dark:text-slate-400">
              The areas where you want to grow, contribute, or simply be present.
            </p>
          </AIMessage>

          <UserInput onSubmit={handleUserResponse} />
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
            <p>{operations.length === 3 ? 'Three' : operations.length} pillars emerge.</p>
          </AIMessage>

          <div className="space-y-6 max-w-2xl mx-auto">
            {operations.map((op, index) => {
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
              return (
                <div
                  key={op.id}
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
                      {op.name}
                    </h3>
                    <p className="text-sm font-light text-gray-700 dark:text-slate-400 leading-relaxed">
                      {op.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <AIMessage delay={1500}>
            <p>We'll build upon each.</p>
          </AIMessage>
        </div>
      )}
    </PhaseContainer>
  );
}
