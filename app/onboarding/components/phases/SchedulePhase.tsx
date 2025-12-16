"use client";

import { useState } from "react";
import { PhaseContainer } from "../PhaseContainer";
import { AIMessage } from "../AIMessage";

interface SchedulePhaseProps {
  onComplete: (schedule: { wakeHour: number; sleepHour: number }) => void;
}

export function SchedulePhase({ onComplete }: SchedulePhaseProps) {
  const [wakeHour, setWakeHour] = useState(6);
  const [sleepHour, setSleepHour] = useState(23);

  const handleContinue = () => {
    onComplete({ wakeHour, sleepHour });
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${period}`;
  };

  return (
    <PhaseContainer>
      <div className="space-y-12">
        <AIMessage>
          <p>When does your day begin?</p>
          <br />
          <p className="text-xl text-gray-600 dark:text-slate-400">
            When does it end?
          </p>
        </AIMessage>

        <div className="max-w-md mx-auto space-y-8">
          {/* Wake time */}
          <div className="bg-card border border-border shadow-sm p-6 relative overflow-hidden">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

            <div className="relative space-y-4">
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase text-center">
                Rise
              </div>
              <div className="text-center">
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={wakeHour}
                  onChange={(e) => setWakeHour(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-4xl font-serif font-light text-gray-900 dark:text-white mt-4">
                  {formatHour(wakeHour)}
                </div>
              </div>
            </div>
          </div>

          {/* Sleep time */}
          <div className="bg-card border border-border shadow-sm p-6 relative overflow-hidden">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-900 dark:border-[#e5e5e5] z-10"></div>

            <div className="relative space-y-4">
              <div className="text-xs font-mono tracking-wider text-gray-600 dark:text-slate-500 uppercase text-center">
                Rest
              </div>
              <div className="text-center">
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={sleepHour}
                  onChange={(e) => setSleepHour(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-4xl font-serif font-light text-gray-900 dark:text-white mt-4">
                  {formatHour(sleepHour)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono text-xs uppercase tracking-widest hover:scale-[1.02] transition-all duration-150 cursor-pointer shadow-sm"
          >
            Continue
          </button>
        </div>
      </div>
    </PhaseContainer>
  );
}
