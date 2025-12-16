"use client";

import { useState } from "react";
import { PhaseContainer } from "../PhaseContainer";
import { AIMessage } from "../AIMessage";
import { UserInput } from "../UserInput";

interface Metric {
  id: string;
  name: string;
  unit: string;
  optimal_value: number;
  minimum_value: number;
  operator: string;
  linked_operation?: string;
}

interface MetricsPhaseProps {
  onComplete: (metrics: Metric[]) => void;
}

export function MetricsPhase({ onComplete }: MetricsPhaseProps) {
  const [stage, setStage] = useState<'question' | 'processing' | 'showing' | 'error'>('question');
  const [metrics, setMetrics] = useState<Metric[]>([]);
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
          phase: 'metrics',
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

      console.log('Metrics API Response:', data); // Debug log

      if (data.error) {
        console.error('Metrics API returned error:', data.error);
        throw new Error(data.error);
      }

      if (data.extractedData?.metrics && data.extractedData.metrics.length > 0) {
        console.log('Extracted metrics:', data.extractedData.metrics);
        setMetrics(data.extractedData.metrics);
        setStage('showing');

        setTimeout(() => {
          onComplete(data.extractedData.metrics);
        }, 4000);
      } else {
        console.warn('No metrics extracted from response');
        setErrorMessage("I couldn't identify clear metrics. Could you be more specific about what you want to measure?");
        setStage('error');
      }
    } catch (error: any) {
      console.error('Failed to process metrics response:', error);
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
            <p>What do you measure?</p>
            <br />
            <p className="text-xl text-gray-600 dark:text-slate-400">
              The numbers that tell the story of your days.
            </p>
          </AIMessage>

          <UserInput onSubmit={handleUserResponse} placeholder="Sleep hours, steps, reading time..." />
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
            <p>The measures are set.</p>
          </AIMessage>

          <div className="space-y-6 max-w-2xl mx-auto">
            {metrics.map((metric, index) => {
              const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
              return (
                <div
                  key={metric.id}
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

                  <div className="relative space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase">
                          {romanNumerals[index]}.
                        </div>
                        <h3 className="text-lg font-serif font-medium text-gray-900 dark:text-white">
                          {metric.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                          Unit
                        </p>
                        <p className="text-sm font-mono text-gray-900 dark:text-white">
                          {metric.unit}
                        </p>
                      </div>
                    </div>

                    {/* Range visualization */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-500 dark:text-slate-500">Min: {metric.minimum_value}</span>
                        <span className="text-gray-900 dark:text-white font-bold">Optimal: {metric.optimal_value}</span>
                      </div>
                      <div className="mt-2 h-1 bg-gray-200 dark:bg-slate-800 relative">
                        <div className="absolute left-0 h-full bg-gradient-to-r from-red-400 to-green-400" style={{
                          width: '100%'
                        }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <AIMessage delay={2000}>
            <p>Numbers to guide you.</p>
          </AIMessage>
        </div>
      )}
    </PhaseContainer>
  );
}
